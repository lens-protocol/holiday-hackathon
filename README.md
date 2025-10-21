# Hello!

I joined super late, but still wanted to explore the protocol.

I almost finished the 3D scene beacon storage node uploading but ran into CORS issues. I was aiming to have a fully hosted R3F scene completely on-chain, no external dep. Even though it's missing most of the features I felt I should still share the full concept.

**Video Demo and rant:** [CLICK ME](https://www.youtube.com/watch?v=VOotGqwAxy0)

# Forward.lens

Forward.lens is a social platform built on Lens Protocol that transforms acts of paying it forward into evolving 3D digital art. Users create unique digital spaces called Beacons that grow and change through anonymous acts of generosity.

## Overview

Here's how it works:

- Every day, users can send one "beam" - a combination of tokens (ETH/USDC) and an encrypted message that gets randomly sent to another user's account.
- When you send a beam, you earn Essence points that you can use to transform and enhance your own Beacons with visual effects and mutations - all stored permanently on-chain through Lens.
- Each beam includes an encrypted message that only the recipient can read. Users can then rate that message which affects how much Essence will be earned by the sender.
- Beacons require regular outward generosity to stay healthy - if you don't pay it forward monthly, your Beacon's health declines, eventually leading to its self-destruction
- The Beacon's 3D scene evolves based on the user's generosity, with rare and ethereal effects unlocked with Essence earned through their acts of paying it forward.

Forward.lens demonstrates how blockchain tech, in particular Lens Protocol's advanced features, can make acts of kindness visible and permanent while creating beautiful, evolving digital spaces that reflect real community impact.

## Technical Details

### Built With

- Next.js
- React Three Fiber & Drei
- Lens Protocol V3
- ConnectKit
- Zustand for state management
- TypeScript

### Features

- Wallet connection through ConnectKit
- Automatic Lens login detection
- Account selection for multiple Lens profiles
- Profile editing (name, bio, picture)
- Fully on-chain 3D scene storage via Lens
- Encrypted messaging system
- Random recipient selection
- Effect/mutation system
- Health tracking mechanisms

### Smart Contract Integration

- Token transfers (ETH/USDC)
- Beacon state management
- Effect verification
- Health system tracking
- Random recipient selection
- Message encryption/decryption

## Getting Started

### Prerequisites

- Node.js 20+
- npm or yarn
- Git

### Installation

1. Clone the repository

```bash
git clone https://github.com/yourusername/forward-lens.git
cd forward-lens
```

2. Install dependencies

```bash
npm install
```

3. Configure environment variables

```bash
# Copy the example env file
cp .env.example .env.local

# Edit .env.local with your values:
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID="your_project_id"
NEXT_PUBLIC_ALCHEMY_KEY="your_alchemy_key"
```

4. Run the development server

```bash
npm run dev
```

The app will be available at `http://localhost:3000`

## Environment Variables

Required variables in `.env.local`:

- `NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID`: Your WalletConnect project ID
- `NEXT_PUBLIC_ALCHEMY_KEY`: Your Alchemy API key

## Usage

1. Connect your wallet
2. Log in with your Lens profile
3. Create your first Beacon
4. Send daily beams to participate
5. Collect Essence through giving
6. Transform your Beacon with effects

## Contributing

TDB

## License

This project is licensed under the MIT License

## Acknowledgments

- Lens Protocol team for their amazing protocol
- ThreeJS and React Three Fiber communities
- ConnectKit team for wallet integration
