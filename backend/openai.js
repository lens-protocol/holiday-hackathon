const OpenAI = require('openai');

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

async function createAssistant(name, userInstructions) {
    const scenarioPrompt = `${userInstructions}`;

    const assistant = await openai.beta.assistants.create({
        name,
        instructions: scenarioPrompt,
        tools: [],
        model: "gpt-4"
    });
    return assistant.id;
}

async function askSimple(bio, message, history) {
    console.log("asking simple");
    const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
            { role: "system", content: 'You are a character on a RPG Cyberpunk game. you send only short messages. description: ' + bio },
            {
                role: "user",
                content: message,
            },
            {
                role: "user",
                content: "Conversation history: " + history.join("\n"),
            },
        ],
    });
    console.log("asking simple done");
    return completion.choices[0].message.content;
}

async function createThread(message, userId) {
    const thread = await openai.beta.threads.create({
        messages: [
            {
                role: "user",
                content: message,
            },
        ],
        metadata: {
            user_id: userId,
        },
    });

    return thread.id;
}

async function processMessage(threadId, assistantId, message) {
    // Add message to thread
    await openai.beta.threads.messages.create(threadId, {
        role: "user",
        content: message,
    });

    // Create and monitor run
    const run = await openai.beta.threads.runs.create(threadId, {
        assistant_id: assistantId,
    });

    let runStatus = await openai.beta.threads.runs.retrieve(threadId, run.id);

    while (runStatus.status !== "completed") {
        await new Promise((resolve) => setTimeout(resolve, 2000));
        runStatus = await openai.beta.threads.runs.retrieve(threadId, run.id);
    }

    // Get messages
    const messages = await openai.beta.threads.messages.list(threadId);
    return messages.data
        .filter(message => message.run_id === run.id && message.role === "assistant")
        .pop();
}

module.exports = {
    createThread,
    processMessage,
    createAssistant,
    askSimple
}