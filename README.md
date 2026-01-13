
# ResolutionDAO - A Web3 Challenge Resolution Platform 🎯

**ResolutionDAO** is a decentralized platform that allows users to create, join, and stake money on personal or community-driven challenges. It combines the power of Web3 technology with a gamified approach to resolutions, helping individuals stay accountable and achieve their goals by ensuring they have a "skin in the game."

---

## 🧑‍🤝‍🧑 Team Members:
- **Kunal Garg**
- **Yash (0xdynamo23)**

---

## 📜 Project Description

In the world of personal development, we all know the struggle of setting ambitious resolutions—whether it's losing weight, finishing a project, or achieving a personal goal. **ResolutionDAO** was born out of the idea that sometimes, we need more than just determination. We need something that ensures we stay accountable. Something that forces us to put skin in the game.

Imagine this: You’ve set a resolution to run a marathon, but as the weeks go by, the excitement fades, and your commitment weakens. Now, imagine that you had a **financial stake**—something that you would lose if you didn't complete the challenge. Suddenly, your goal doesn’t feel so optional anymore. You can’t back out without feeling the consequences.

**ResolutionDAO** leverages Web3 technology to make this scenario a reality. It allows users to create, join, and stake money on personal or community-driven challenges. If you succeed, you earn rewards; if you fail, you lose your stake. This system incentivizes **commitment**, builds **accountability**, and fosters a **community of achievers**.

### 🎯 Problem Statement:
- **Challenge for Users**: How can individuals maintain motivation to complete long-term goals or resolutions?
- **Challenge for DApps**: How can decentralized platforms facilitate community-driven motivation and resolution completion?

---
📺 **Watch the Presentation Video**  
[Click here to watch the presentation video!](https://drive.google.com/file/d/12Yphay5vKWD1FL7o5sJCklhgdV5UgxP7/view?usp=sharing)

🚀 Bringing Resolutions On-Chain

---

## 💡 Solution:
**ResolutionDAO** tackles these challenges through the use of smart contracts and blockchain technology:

- **Create or Join Challenges**: Users can create their own challenges or join those created by others.
- **Skin in the Game**: Participants must stake a certain amount of cryptocurrency to enter a challenge, creating a financial incentive to complete the task.
- **Rewards System**: Those who complete the challenge receive rewards drawn from the collective pool of staked funds.
- **Decentralized Governance**: The platform’s rules and challenge outcomes are governed by smart contracts, ensuring transparency and fairness.

---

## 🔧 Tech Stack
- **Frontend**: ReactJS, Typescript
- **Smart Contracts**: Solidity
- **Development Environment**: Hardhat
- **Blockchain Interaction**: Ethers.js
- **Storage**: IPFS 

---

## 🌟 Key Features:
1. **Create and Join Challenges**: Users can create new challenges with specific goals, or they can join existing challenges created by others.
2. **Staking Mechanism**: Participants must stake an amount of cryptocurrency as a financial incentive to complete their resolution.
3. **Challenge Validation**: Smart contracts automatically track challenge progress and validate when a user successfully completes a challenge.
4. **Reward Distribution**: Upon challenge completion, the reward pool, which consists of all staked funds, is distributed to the winners.
5. **Community Governance**: DAO-based governance ensures that the community has control over the platform’s rules and features.
6. **On-Chain Verification**: Using the blockchain for challenge tracking ensures that there’s no room for fraud or dispute over resolution completion.

---

## 🚀 Getting Started

### Clone the repository

```bash
git clone https://github.com/ikunal-04/holiday-hackathon.git
```

### Navigate into the project directory

```bash
cd holiday-hackathon
```
```bash
cd client
```
### Install dependencies

```bash
npm install
```

### Run the development server

```bash
npm run dev
```

### Deploy smart contracts

To deploy the smart contracts to a blockchain, use Hardhat:

```bash
npm hardhat deploy-zksync --script deploy-storage.ts --network lensTestnet
```

---

## 🤝 Contributing

We welcome contributions to **ResolutionDAO**! Here's how you can help:

1. **Fork the repository**
2. **Create a feature branch**: 
   ```bash
   git checkout -b feature/AmazingFeature
   ```
3. **Commit your changes**: 
   ```bash
   git commit -m 'Add some AmazingFeature'
   ```
4. **Push to the branch**: 
   ```bash
   git push origin feature/AmazingFeature
   ```
5. **Open a Pull Request**: Describe the changes and improvements in detail for review.

---

## 📜 License
This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 📊 Example Use Cases:

### 1. **Fitness Challenges**:
- User A creates a fitness challenge to run 10 kilometers in a month and stakes 0.1 ETH. User B joins the challenge with their own stake.
- After 30 days, if User A and User B complete the challenge, they share the rewards of the staked ETH. If either participant fails, they lose their stake.

### 2. **Reading Challenge**:
- User C sets a challenge to read 10 books in 2 months, staking 0.2 ETH.
- Participants who read the books within the deadline receive the entire pool of staked ETH as a reward. If they fail, they lose their stake.

### 3. **Community Goal Completion**:
- A community challenge could be created to fundraise for a cause, where all participants stake some funds. The goal must be met within a specified time, or the staked funds are refunded or redistributed.

---

## Key Benefits:
- **Motivation to Follow Through**: Financial stake and rewards create strong motivation to complete goals.
- **Transparency and Accountability**: Blockchain ensures that all challenges and rewards are tracked transparently.
- **Decentralized Governance**: Community involvement in platform decisions enhances trust and fairness.
- **Skin in the Game**: Both users and platform participants have financial incentives to ensure goals are completed.

---

## Areas of Future Expansion:
- **Cross-Platform Challenges**: Allow users to create challenges that integrate with other platforms (fitness apps, productivity tools, etc.).
- **Challenge Marketplaces**: A marketplace where users can create and trade challenge entries with others.
- **More Reward Mechanisms**: Expand reward options beyond just monetary, such as NFTs or tokens.

---

## The Story Behind ResolutionDAO:

At some point, we’ve all been there: we make a resolution, excited and determined, but as time passes, distractions creep in. Maybe it's the hustle of daily life or the lack of real consequences for not following through. What if there was a way to ensure we stay motivated? A way to make our goals not just personal, but part of a larger community effort where success brings rewards and failure brings lessons. 

That's where **ResolutionDAO** steps in. We’ve taken the concept of "skin in the game" and turned it into a Web3-powered challenge platform, where your commitment is tied to a financial stake. By creating or joining challenges, you’re putting something valuable on the line. And with the transparency and fairness of smart contracts, you can trust that your rewards are well-earned. 

ResolutionDAO isn’t just about individual goals—it’s about building a **community** of achievers who support each other and hold one another accountable. Whether it’s running a marathon, reading more books, or completing a creative project, ResolutionDAO is here to ensure you stick to your resolutions.

---

Let’s achieve more together. Let’s make our goals a reality. Let’s create a world of accountability and accomplishment. Welcome to **ResolutionDAO**!

---

## All Important Links

- [Presentation Video](https://drive.google.com/file/d/12Yphay5vKWD1FL7o5sJCklhgdV5UgxP7/view?usp=sharing)
- [Deployed Contract](https://block-explorer.testnet.lens.dev/address/0xc07387E5A4A048a09FDc8a047bBE608F164fbEbe#contract)
- [Slide Deck](https://drive.google.com/file/d/1hF6GOrDuziXkft1oG2yL__T9aRJKRkRH/view?usp=sharing)
- [Prototype Demo](https://resolutiondao.vercel.app/)