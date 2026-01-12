## Project Name: Poolen

**Project Description:** <br/>
**Poolen** is a simple prototype of betting application built on top of lens network to handle picking meme & distributing rewards once the time ends. We used the Lens v3 integration with Connectkit to connect as well as utilised the usage of v3 lens sdk to onboard mulitple users. Poolen handles or works as contract that enables the txns based on smart wallet account instance supported by lens i.e. we don't use the EOA wallet address to sign the txns on contract rather use lens account instace for every procedure. Having such use case we can easily bind the username that were being transacting in our contract even if the single EOA wallet handles multiple lens account addresses. 

##
**Team Members: (Name and Lens Handle)**
- [whoisanku](https://hey.xyz/u/whoisanku)
- [aryog](https://hey.xyz/u/yoges)
- alexcommoner

## Source Code Link: <br />
https://github.com/Nester-xyz/Poolen

##
***Screenshot of homepage where anyone can make a bet:*** <br />

<img width="536" alt="Screenshot 2025-01-07 at 5 30 46 PM" src="https://github.com/user-attachments/assets/b4138b65-4cf4-432e-89c1-0ea60cb8e4f8" />

##
**Use cases**
- Enables token prediction for memecoins
- Streamlined user onboarding
- Profile and account management
- Token management & withdrawal function from Smart Wallet > EOA

## MemeMelee Contract architecture:

MemeMelee is a smart contract that enables users to bet on memes in 24-hour rounds. Users place bets on memes, and winners are determined by price performance. Rewards are automatically distributed at the end of each round.

## Core Features

- Daily betting rounds with automatic reset
- Single bet per user per round
- Fair reward distribution system
- Transparent betting history
- Owner-controlled meme management

### Key Functions

1. **Betting**
- `pickMeme()`: Place bet on a meme
- Minimum bet: 0.001 GRASS
- One bet per user per round

2. **Round Management**
- 24-hour rounds
- Automatic stats reset
- Prize pool tracking
- Recent bet history (last 50)

3. **Reward System**
- 5% platform fee
- 95% distributed to winners
- Proportional distribution based on bet size
- Automatic distribution at round end

4. **Admin Controls**
- Add new memes
- Set round winners
- Manage round closure
- Cannot modify core mechanics

5. **Security Features**
- OpenZeppelin's Ownable
- Immutable token integration
- Safe math operations
- ETH transfer safety checks

## Usage

1. Users can place bets using `pickMeme()`
2. Admin adds memes via `addMeme()`
3. Rounds end automatically after 24 hours
4. Winners receive rewards automatically
5. New round starts immediately after

## Events

- MemePicked
- RoundEnded
- UserRewarded
- MemePriceSet
- NewRoundStarted
- MemeAdded

##
**Technical Stack**  

**_Frontend:_** React + TypeScript with Vite   
**_Styling:_** TailwindCSS + shadcn/ui  
**_Web3:_**  
- Lens Protocol for social graph 
- ConnectKit + wagmi + viem for wallet connections  
- Alchemy custom Lens testnet RPC 
**_Backend:_** Node.js with Express   

##
**Development Roadmap**
- User created based prediction market handling Oracle based decentralized results
- On-chain community comments
- More streamlined lens sdk integration (i.e. session management & more)

##
**Demo Video/Slide Deck Link:** <br />
https://docs.google.com/presentation/d/1UWi1INSxjRHQOtSTEMVGzcdULHS5o_dO4giZvrGc7_Y/edit?usp=sharing

##
***Profile section screenshot:*** <br />

<img width="489" alt="Screenshot 2025-01-07 at 5 28 57 PM" src="https://github.com/user-attachments/assets/ca2a2736-0d65-4a83-928c-bf150aade0f5" />



