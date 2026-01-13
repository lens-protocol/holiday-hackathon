/***************************************************************
 * server.js
 ***************************************************************/
const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const app = express();
const cors = require('cors');
const { getAllAgents, createNPCConfig } = require('./web3');
const blacklist = require('./blacklist.json');
const { askSimple } = require('./openai');
const mongoose = require('mongoose');
const ConversationHistory = require('./models/ConversationHistory');

// =================== CONFIGURATIONS & CONSTANTS ===================
const PORT = 3003;

// How often (ms) to check collisions
const COLLISION_CHECK_INTERVAL = 1000;

// Use a simple approach to skip frames for NPC movement / game state emissions
const UPDATE_SKIP_FRAMES = 1;    // Updates happen only every N frames

// How often to run the main gameLoop (fps)
const GAME_LOOP_FPS = 60;
const FRAME_INTERVAL_MS = 1000 / GAME_LOOP_FPS;

// =================== EXPRESS & SOCKET SETUP ===================
app.use(cors({ origin: "*", methods: ["GET", "POST"], credentials: true }));
const server = http.createServer(app);

const io = new Server(server, {
    cors: { origin: "*", methods: ["GET", "POST"], credentials: true }
});

app.use(express.static('public'));
app.use(express.json());

// =================== GAME STATE ===================
const gameState = {
    mapWidth: 1864 - 10,
    mapHeight: 1337 - 10,
    gamePaused: false,
    npcs: [],
    activeConversations: new Map(), // Track ongoing conversations
    npcConversationHistory: new Map(), // Track conversation history per NPC
    combatLog: []
};

// =================== SAMPLE MESSAGES ===================
const sampleMessages = [
    "Hey netrunner, how's your neural interface holding up?",
    "Another day in this neon-drenched dystopia, eh?",
    "Heard about the latest corp takedown in the dataverse?",
    "Gotta jack out, the grid's getting hot.",
    "What brings a chrome-head like you to these parts?",
    "Nice augments - black market or legit?",
    "Looking to hack some systems together? I know a score.",
    "Watch your vectors in my cyberspace, choomba!",
    "Let's sync our neural networks, could be profitable."
];

// =================== SIMPLE POSITION UTILS ===================
function getEvenlyDistributedPositions(numNPCs, mapWidth, mapHeight) {
    if (numNPCs === 1) {
        return [{ x: 782, y: 568 }];
    }
    const positions = [];
    const cols = Math.ceil(Math.sqrt(numNPCs));
    const rows = Math.ceil(numNPCs / cols);

    const cellWidth = mapWidth / cols;
    const cellHeight = mapHeight / rows;

    let count = 0;
    for (let i = 0; i < rows && count < numNPCs; i++) {
        for (let j = 0; j < cols && count < numNPCs; j++) {
            const randomX = (j * cellWidth) + (Math.random() * (cellWidth - 64)) + 32;
            const randomY = (i * cellHeight) + (Math.random() * (cellHeight - 64)) + 32;
            positions.push({ x: randomX, y: randomY });
            count++;
        }
    }
    return positions;
}

// Just for reference if you need truly random placement
function getRandomPositions(numNPCs, mapWidth, mapHeight) {
    const positions = [];
    for (let i = 0; i < numNPCs; i++) {
        positions.push({
            x: Math.random() * (mapWidth - 64) + 32,
            y: Math.random() * (mapHeight - 64) + 32
        });
    }
    return positions;
}

// =================== NPC MOVEMENT & CONVERSATION LOGIC ===================

// Moves two NPCs apart after their conversation ends
function moveNPCsApart(npc1, npc2) {
    const angle = Math.random() * 2 * Math.PI; // Random angle
    const distance = 100; // Distance to move apart

    const newX1 = npc1.x + Math.cos(angle) * distance;
    const newY1 = npc1.y + Math.sin(angle) * distance;
    const newX2 = npc2.x - Math.cos(angle) * distance;
    const newY2 = npc2.y - Math.sin(angle) * distance;

    // Clamp positions to map boundaries
    npc1.x = Math.max(0, Math.min(gameState.mapWidth - npc1.size, newX1));
    npc1.y = Math.max(0, Math.min(gameState.mapHeight - npc1.size, newY1));
    npc2.x = Math.max(0, Math.min(gameState.mapWidth - npc2.size, newX2));
    npc2.y = Math.max(0, Math.min(gameState.mapHeight - npc2.size, newY2));
}
function startConversation(npc1, npc2) {
    const conversationId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    if (!gameState.activeConversations.has(conversationId)) {
        // Initialize empty conversation history for both NPCs if not exists
        if (!gameState.npcConversationHistory.has(npc1.address)) {
            gameState.npcConversationHistory.set(npc1.address, []);
        }
        if (!gameState.npcConversationHistory.has(npc2.address)) {
            gameState.npcConversationHistory.set(npc2.address, []);
        }

        const conversation = {
            participants: [npc1.address, npc2.address],
            messageCount: 0,
            conversationHistory: [],
            // Create MongoDB document for this conversation
            dbConversation: new ConversationHistory({
                conversationId,
                participants: [
                    {
                        id: npc1.address,
                        name: npc1.name,
                        character: npc1.character,
                        bio: npc1.instructions,
                        position: { x: npc1.x, y: npc1.y }
                    },
                    {
                        id: npc2.address,
                        name: npc2.name,
                        character: npc2.character,
                        bio: npc2.instructions,
                        position: { x: npc2.x, y: npc2.y }
                    }
                ],
                location: { x: (npc1.x + npc2.x) / 2, y: (npc1.y + npc2.y) / 2 }
            }),
            interval: setInterval(async () => {
                // If we haven't exchanged 6 messages yet, get a new message
                if (conversation.messageCount < 6) {
                    // Alternate between npc1 and npc2 based on messageCount
                    const speaker = conversation.messageCount % 2 === 0 ? npc1 : npc2;
                    const other = speaker === npc1 ? npc2 : npc1;

                    let interaction;
                    if (conversation.messageCount === 0) {
                        interaction = `Hi ${other.name}, my name is ${speaker.name} and I'm a ${speaker.character}. ${sampleMessages[Math.floor(Math.random() * sampleMessages.length)]}`;
                    } else {
                        // Use the last message from the conversation history as context
                        interaction = conversation.conversationHistory[conversation.conversationHistory.length - 1];
                    }

                    try {
                        const message = await askSimple(speaker.instructions, interaction, conversation.conversationHistory);
                        conversation.conversationHistory.push(message);

                        // Save message to MongoDB
                        conversation.dbConversation.messages.push({
                            content: message,
                            speaker: {
                                id: speaker.address,
                                name: speaker.name,
                                character: speaker.character,
                                bio: speaker.instructions
                            },
                            recipient: {
                                id: other.address,
                                name: other.name,
                                character: other.character,
                                bio: other.instructions
                            }
                        });
                        conversation.dbConversation.totalMessages++;
                        await conversation.dbConversation.save();

                        // Update the NPC's conversation history
                        const speakerHistory = gameState.npcConversationHistory.get(speaker.address);
                        speakerHistory.push({
                            timestamp: Date.now(),
                            partner: other.name,
                            message: message
                        });
                        gameState.npcConversationHistory.set(speaker.address, speakerHistory);

                        io.emit('npcMessage', {
                            speaker: speaker.name,
                            message,
                            conversationId
                        });
                    } catch (err) {
                        console.error("Error in conversation:", err);
                    }

                    conversation.messageCount++;
                } else {
                    // Update MongoDB document when conversation ends
                    conversation.dbConversation.completed = true;
                    conversation.dbConversation.endTime = new Date();
                    await conversation.dbConversation.save();

                    clearInterval(conversation.interval);
                    gameState.activeConversations.delete(conversationId);
                    npc1.isInConversation = false;
                    npc2.isInConversation = false;
                    moveNPCsApart(npc1, npc2);
                }
            }, 10000)
        };

        npc1.isInConversation = true;
        npc2.isInConversation = true;
        gameState.activeConversations.set(conversationId, conversation);
    }
}

// Add endpoint to fetch NPC conversation history
app.get('/npc/history/:address', async (req, res) => {
    const { address } = req.params;
    try {
        const conversations = await ConversationHistory.find({
            'participants.id': address
        }).sort({ startTime: -1 }).limit(10); // limit results to 10

        res.json(conversations);
    } catch (error) {
        console.error("Error fetching conversation history:", error);
        res.status(500).json({ error: "Failed to fetch conversation history" });
    }
});


function updateNPC(npc) {
    if (npc.isInConversation) return;

    const npcConfig = npc.config;
    npcConfig.moveTimer++;

    if (npcConfig.moveTimer >= npcConfig.moveDuration) {
        const directions = ['up', 'down', 'left', 'right'];
        npcConfig.direction = directions[Math.floor(Math.random() * directions.length)];
        npcConfig.moveTimer = 0;
        npcConfig.isMoving = Math.random() > 0.3;
    }

    if (npcConfig.isMoving) {
        let dx = 0;
        let dy = 0;

        switch (npcConfig.direction) {
            case 'up':
                dy -= npc.speed;
                break;
            case 'down':
                dy += npc.speed;
                break;
            case 'left':
                dx -= npc.speed;
                break;
            case 'right':
                dx += npc.speed;
                break;
        }

        npc.x = Math.max(0, Math.min(gameState.mapWidth - npc.size, npc.x + dx));
        npc.y = Math.max(0, Math.min(gameState.mapHeight - npc.size, npc.y + dy));

        npcConfig.frameCount++;
        if (npcConfig.frameCount >= 5) {
            npcConfig.frameCount = 0;
            npcConfig.currentFrame =
                (npcConfig.currentFrame + 1) % npcConfig.animations[npcConfig.direction].frames;
        }
    } else {
        npcConfig.currentFrame = 0;
    }
}

// =================== COLLISION CHECKING ===================
// We'll do it on a cooldown rather than every frame.
function checkCollisions() {
    const collisions = [];
    for (let i = 0; i < gameState.npcs.length; i++) {
        for (let j = i + 1; j < gameState.npcs.length; j++) {
            const npc1 = gameState.npcs[i];
            const npc2 = gameState.npcs[j];

            const dx = npc1.x - npc2.x;
            const dy = npc1.y - npc2.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < npc1.size && !npc1.isInConversation && !npc2.isInConversation) {
                collisions.push({ npc1, npc2 });
            }
        }
    }
    return collisions;
}

// =================== GAME LOOP ===================
let frameCount = 0;
let lastCollisionCheck = 0;

function gameLoop() {
    frameCount++;

    /************************
     * 1) NPC MOVEMENT
     ************************/
    // Skip frames to reduce CPU usage (update NPCs every other frame, for example)
    if (frameCount % UPDATE_SKIP_FRAMES === 0) {
        gameState.npcs.forEach(updateNPC);
    }

    /************************
     * 2) COLLISION CHECK
     ************************/
    const now = Date.now();
    if (now - lastCollisionCheck > COLLISION_CHECK_INTERVAL) {
        const collisions = checkCollisions();
        collisions.forEach(({ npc1, npc2 }) => {
            startConversation(npc1, npc2);
        });
        lastCollisionCheck = now;
    }

    /************************
     * 3) EMIT GAME STATE
     ************************/
    // Also skip frames for emitting game state
    if (frameCount % UPDATE_SKIP_FRAMES === 0) {
        io.emit('gameState', {
            npcs: gameState.npcs.map(npc => ({
                x: npc.x,
                y: npc.y,
                name: npc.name,
                character: npc.character,
                size: npc.size,
                address: npc.address,
                isInConversation: npc.isInConversation,
                animation: {
                    direction: npc.config.direction,
                    currentFrame: npc.config.currentFrame,
                    isMoving: npc.config.isMoving
                }
            })),
            timestamp: now
        });
    }
}

// =================== ROUTES ===================
app.route('/blacklist').get((req, res) => {
    res.json(blacklist);
});

app.route('/gameState').get((req, res) => {
    res.json(gameState);
});

// =================== SOCKET CONNECTIONS ===================
io.on('connection', (socket) => {
    console.log('A user connected');
    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });
});

// =================== MAIN SERVER STARTUP ===================
setInterval(gameLoop, FRAME_INTERVAL_MS);

server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
// =================== NPCs FROM CONTRACT ===================
async function updateNPCsFromContract() {
    try {
        const agents = await getAllAgents();
        if (agents.length > 0) {
            // Get existing NPCs by address
            const existingNPCs = new Map(gameState.npcs.map(npc => [npc.address, npc]));

            // Filter out new agents
            const newAgents = agents.filter(agent => !existingNPCs.has(agent.address));

            if (newAgents.length > 0) {
                const newPositions = getEvenlyDistributedPositions(
                    newAgents.length,
                    gameState.mapWidth,
                    gameState.mapHeight
                );

                const newNPCs = newAgents.map((agent, index) => ({
                    ...agent,
                    x: newPositions[index].x,
                    y: newPositions[index].y,
                    isInConversation: false
                }));

                const allNPCs = [...gameState.npcs, ...newNPCs];

                // Update players count based on all NPCs
                gameState.playersCount = [...new Set(allNPCs.map(npc => npc.owner))].length;

                // Combine existing and new NPCs, then take only the latest 15
                gameState.npcs = allNPCs.slice(-15);

            }
        }
    } catch (error) {
        console.error("Error updating NPCs:", error);
    }
}

// Initial load of NPCs from the blockchain
updateNPCsFromContract().then(() => {
    console.log(`Loaded ${gameState.npcs.length} NPCs from blockchain`);
});

// Periodic NPC updates (every 5 minutes)
setInterval(updateNPCsFromContract, 5 * 60 * 1000);

// Add mongoose connection setup near the top of the file
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
