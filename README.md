# h3lp.io 🌱 - Helping Help Others Help You

A permissionless marketplace built on Lens Protocol that helps creators offer
personalized products and services to their community.

# [Watch the video demo here!](https://javitoshi.com/videos/h3lp-demo-video.mp4)

[![h3lp.io Demo](https://h3lp.io/h3lp-readme-thumbnail.png)](https://javitoshi.com/videos/h3lp-demo-video.mp4)

## 🌟 Features

- **AI-Powered Product Generation**: Analyzes Lens profiles to suggest
  personalized products and services
- **Decentralized Marketplace**: Built on Lens Protocol for secure, web3-native
  transactions
- **Custom Feed Integration**: Connect with your favorite Lens creators
- **Smart Contract Integration**: View transactions on
  [Lens Testnet Explorer](https://block-explorer.testnet.lens.dev/address/0x57466D1767a5693251a5737A5c1a0C857c1Bbf6D#transactions)

## 🚀 Quick Start

1. Install dependencies:

```bash
npm install
```

2. Run development server:

```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000)

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 19, TailwindCSS
- **AI Integration**: I tried Anthropic Claude, DeepSeek, Groq, OpenAI... All
  with different results.. currently using only GPT-4o.
- **Blockchain**: Lens Protocol, Wagmi, Viem
- **UI Components**: Shadcn/UI
- **Authentication**: ConnectKit by Family
- **Web2 Backend**: Vercel API routes, Supabase, PostGresQL (the table
  declarations are inside the `lib/postgres.ts` file)

## 🎯 Core Features

### AI-Powered Product Generation

The platform analyzes Lens profiles and publications to generate personalized
product suggestions using state-of-the-art AI models.

### Dynamic User Interface

Clean, interface (not mobile-ready yet, sorry!) with smooth animations and
transitions built with modern React patterns and TailwindCSS.

### Product Management

Intuitive product creation and editing with smart contract integration for
secure transactions.

## 📝 GraphQL API

The project reads publications and profiles using the Lens Protocol API at:
`https://api-v2.lens.dev/`

## 💡 Ideal use cases:

- 1: Discover hidden talents you have, and monetize them.
- 2: Help others monetize their talents too: pay them for services they aren't
  currently offering... make a product, pay for it, and offer them the
  opportunity to help you and make money too.

## 🌐 Links

- [h3lp.io](https://h3lp.io)

- [Contract Explorer](https://block-explorer.testnet.lens.dev/address/0x72eB025487F1A5DaB9e8657CDBd5335009750314)

---

Built with 💚 for the Lens community
