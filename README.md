# BookIt - Web3 Event Ticketing Platform 🎫

BookIt is revolutionizing event ticketing through web3 technology, creating a trustless and transparent ecosystem for event organizers and attendees.

## Deployments 
1) Live Demo : [https://book-it-opal.vercel.app/](https://book-it-opal.vercel.app/)
2) Deployed contract : [lensExplorer](https://block-explorer.testnet.lens.dev/address/0xdB023ADd0dEFF974d03D184173c5CDd60C25cA86)
3) Contract code : [Contract code](https://github.com/dhananjaypai08/LENS-HOLIDAYHACK/blob/master/contractsv1/contracts/BookIt.sol)
4) Onchain AppKit code : [Familykit](https://github.com/dhananjaypai08/LENS-HOLIDAYHACK/blob/master/Frontend/src/components/Web3Provider.jsx)
5) Slide Deck : [Deck](https://www.canva.com/design/DAGbch5iMGU/droge_pnR2o1U1nRPRIQlA/edit?utm_content=DAGbch5iMGU&utm_campaign=designshare&utm_medium=link2&utm_source=sharebutton)

## 🎯 Problem Statement

The current event ticketing industry faces several critical challenges:

1. **Extreme Price Scalping**: Authentic tickets are being resold at drastically inflated prices (e.g., Coldplay tickets originally priced at ₹5,000 being resold for ₹1,50,000).

2. **Widespread Fraud**: Approximately 25% of people globally have been scammed while attempting to purchase resale tickets.

3. **High Platform Fees**: Traditional platforms charge substantial fees on every ticket sale, creating financial burden for both organizers and attendees.

## 💡 Solution

BookIt addresses these challenges through innovative Web3 technology:

- **Non-transferable Digital Tickets**: Smart contract-secured tickets with cryptographic proof of ownership
- **Reputation System**: On-chain verification of attendance and authenticated reviews
- **Direct Value Transfer**: Peer-to-peer transactions without intermediary fees
- **Organizer Staking**: 0.2 ETH stake requirement ensuring accountability

## 🛠️ Tech Stack

- **Frontend**: ReactJS
- **Smart Contracts**: Solidity
- **Development Environment**: Hardhat
- **Blockchain Interaction**: Ethers.js
- **Storage**: IPFS

## 🌟 Key Features

- Smart contract-managed escrow system
- Decentralized social graph for event discovery
- On-chain reputation scoring
- Instant financial settlements
- User-friendly Web3 interface
- Community-driven trust network

## 🚀 Getting Started

1. Clone the repository
```bash
git clone https://github.com/yourusername/bookit.git
cd bookit
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
```bash
cp .env.example .env
# Add your environment variables
```

4. Run development server
```bash
npm run dev
```

5. Deploy smart contracts
```bash
npx hardhat run scripts/deploy.js --network lensTestnet
```

## 🤝 Contributing

We welcome contributions to BookIt! Here's how you can help:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request


## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.


---
