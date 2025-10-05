## Project Name
Lens AgentKit

## Team Members

- Giovanni Fu Lin @linext.lens

## Project Description

### Lens Protocol AgentKit for Building AI Agents

![lensai](https://github.com/user-attachments/assets/c2b12d4a-686b-4889-be84-006c6da95bac)

A comprehensive AI-powered SDK for seamless interaction with Lens Protocol through natural language processing, built as a GOAT plugin for universal AI agent framework compatibility.

### Problem
* Complex integration requirements for Lens Protocol
* High technical barrier for new developers
* Time-consuming implementation of basic social features
* Difficult user onboarding for non-technical users
* Limited accessibility to web3 social features
* Fragmented ecosystem across different AI frameworks and blockchain tools

### Solution
A comprehensive SDK that:
  • Provides AI-powered tools to interact with Lens Protocol
  • Simplifies complex operations into natural language commands
  • Integrates seamlessly with existing web3 infrastructure
  • Offers type-safe implementations using TypeScript
  • Supports both development and production environments
  • Works with all major AI frameworks through GOAT integration

### Core Features

**Account Management**
- Create new Lens Protocol accounts with custom profiles
- Search accounts via natural language queries
- Retrieve account details and metadata

**Content Management**
- Create and publish content 
- Fetch author-specific posts
- Browse publications with advanced filtering

Support Major AI Frameworks: Langchain, Vercel's Al SDK, Eliza...

### Implementation

Example with vercel ai

```ts
import { lens } from "@goat-sdk/plugin-lens";
import { getOnChainTools } from "@goat-sdk/adapter-vercel-ai";
// Initialize the SDK
const tools = await getOnChainTools({
wallet: viem(walletClient),
plugins: [lens()],
});
// Use natural language to interact with Lens Protocol
const result = await generateText({
model: groq("llama-3.3-70b-versatile"),
tools: tools,
prompt: "Create a new post saying 'Hello Web3 Social!'"
});
```

## Source Code Link
- https://github.com/aeither/lens-agentkit

## Preview Link (Optional)
- https://github.com/aeither/lens-agentkit/blob/main/typescript/examples/vercel-ai/viem/index.ts

## Demo Video/Slide Deck Link (Optional)

- https://youtu.be/Mxo_4tHSUeA

## Screenshots (Optional)

![screenshot1](https://github.com/user-attachments/assets/a1079aa5-e51a-4ce5-8564-aaf1763e6015)
