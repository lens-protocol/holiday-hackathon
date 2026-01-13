const { ethers } = require("ethers");

const RPC_URL = "https://rpc.testnet.lens.dev/";
const FACTORY_ADDRESS = "0x14E19d15094911B87cFF482F33fD1468eF86feb7";

const factoryAbi = require("./abis/AgentFactory.json");
const agentWalletAbi = require("./abis/AgentWallet.json");

const blacklist = require("./blacklist.json");
const blacklistSet = new Set(blacklist.map(addr => addr.toLowerCase()));

const provider = new ethers.providers.JsonRpcProvider(RPC_URL);
const factory = new ethers.Contract(FACTORY_ADDRESS, factoryAbi.abi, provider);

async function getAllAgents() {
    try {
        const agents = [];
        let agentId = 1;

        while (true) {
            try {
                const walletAddress = await factory.agentWallets(agentId);
                // If wallet address is zero address, we've reached the end
                if (walletAddress === "0x0000000000000000000000000000000000000000") {
                    break;
                }

                if (blacklistSet.has(walletAddress.toLowerCase())) {
                    console.log("Skipping blacklisted agent:", walletAddress);
                    agentId++;
                    continue;
                }

                const ownerOf = await factory.ownerOf(agentId);

                // Create contract instance for the agent wallet
                const agentWallet = new ethers.Contract(walletAddress, agentWalletAbi.abi, provider);

                // Fetch agent details
                const [name, bio, character] = await Promise.all([
                    agentWallet.name(),
                    agentWallet.bio(),
                    agentWallet.character(),
                ]);

                agents.push({
                    id: agentId.toString(),
                    name,
                    address: walletAddress,
                    instructions: bio,
                    character: '/static/characters/' + encodeURIComponent(character),
                    size: 32,
                    speed: 2,
                    config: createNPCConfig(),
                    owner: ownerOf
                });

                agentId++;
            } catch (error) {
                // If we get an error, assume we've reached the end
                break;
            }
        }

        return agents;
    } catch (error) {
        console.error("Error fetching agents:", error);
        return [];
    }
}

// Helper function to create NPC config (moved from index.js)
function createNPCConfig() {
    return {
        frameWidth: 96,
        frameHeight: 96,
        animations: {
            down: { y: 0, frames: 3 },
            left: { y: 1, frames: 3 },
            right: { y: 2, frames: 3 },
            up: { y: 3, frames: 3 }
        },
        currentFrame: 0,
        frameCount: 0,
        direction: 'down',
        moveTimer: 0,
        moveDuration: 60,
        isMoving: false
    };
}

module.exports = {
    provider,
    factory,
    getAllAgents,
    createNPCConfig
};
