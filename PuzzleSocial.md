# Puzzle Social
![2025-01-07 19-31-27](https://github.com/user-attachments/assets/afa09094-e8c7-472d-801b-d63b4780c906)

## Introduction

Puzzle Social is a decentralized social platform built on the Lens Network, designed to revolutionize the way puzzle enthusiasts connect, share, and solve puzzles using Lens Network. By leveraging the high-performance Lens Network and its robust social connectivity tools, Puzzle Social enables users to create and interact with puzzle games in a truly Web3-native way. Our project aims to empower puzzle creators, solvers, and communities to engage in a fun, collaborative, and rewarding environment.

Puzzle Social achieves this by:
- Allowing users to create custom puzzle game types with flexible rules.
- Providing a mechanism to create and share puzzles with encoded states.
- Enabling social interaction, competition, and collaboration among puzzle enthusiasts via the Lens ecosystem.
- Utilizing off-chain computation to handle complex puzzle state encoding and decoding, ensuring scalability and efficiency.

This project aligns with the Lens Network's vision of fostering SocialFi applications by combining gamification, creativity, and community engagement.
Currently the app only has  one type of puzzle game which is sliding puzzle. but contracts are compatible to support more puzzle games.

## Built with Lens ConnectKit
Our frontend utilizes the Lens ConnectKit to seamlessly integrate user authentication, social graph interactions, and data retrieval. This ensures a smooth and secure user experience, leveraging the full capabilities of the Lens Network.

## VIDEO DEMO:
https://drive.google.com/file/d/1EWN5Etaj7HGcdHd75aEakNiOYYFFxliM/view?usp=sharing

## Dapp deployment:
https://puzzle-social.vercel.app/

## Create Puzzles and share it worldwide via LENS Network
![image](https://github.com/user-attachments/assets/aff65b43-f376-4bb2-9faa-92302d2f7cb9)


## Play different Puzzles created by people 
<img src="https://github.com/user-attachments/assets/e9399c9b-ae72-4192-a036-a24fd4d93b0f" width="500" />

## How It Works

### Core Features
1. **Puzzle Game Types**
   - Users (or admins) can create new types of puzzles with customizable rules.
   - Rules include whether a final state is required, enabling diverse gameplay mechanics. Different game types like sliding puzzle, wordle games are defined using this

2. **Puzzle Creation**
   - Users can create puzzles under specific game types, defining the initial state and (optionally) the final state.
   - The puzzle states are encoded off-chain for scalability and submitted on-chain for verification and sharing.

3. **Social Engagement**
   - Puzzle creators can share their puzzles with the Lens Network community.
   - Players can solve puzzles, share their solutions, and engage with other users.
   - Community features like leaderboards, comments, and likes can be integrated with Lens's social graph.

### Flow Overview
1. **Puzzle Game Type Creation** (Admin-only):
   - Define a game type (e.g., sliding puzzle, Sudoku, Crossword) and set whether a final state is required.
   - Store the game type on-chain for validation and use.

2. **Puzzle Creation**:
   - Define the puzzle's initial state and (if required) its final state.
   - Encode these states off-chain and store the encoded data on-chain.

3. **Puzzle Interaction**:
   - Players retrieve puzzle states via the  frontend.
   - Players solve puzzles locally.

## How the Smart Contract Works

### Puzzle Game Types
The contract allows the owner to create different game types with unique rules. Each game type is stored on-chain with the following properties:
- `id`: Unique identifier.
- `name`: Name of the game type.
- `isFinalStateRequired`: Specifies whether the final state is mandatory.
- `exists`: Ensures validation during puzzle creation.

### Puzzle Creation
The contract lets any user create a puzzle by submitting:
- `gameTypeId`: The type of puzzle being created.
- `initialState`: Encoded data representing the starting state of the puzzle.
- `finalState`: Encoded data for the solution (if required).

These puzzles are stored on-chain with details about the creator, associated game type, and states. Validation ensures the puzzle adheres to the rules of its game type.

### Off-Chain Calculation for Puzzle States
To ensure scalability, Puzzle Social employs off-chain computation for puzzle state handling:
- **Encoding:** Puzzle states (initial and final) are encoded into `bytes` format using off-chain tools before being submitted on-chain.
- **Decoding:** When players interact with puzzles, the states are retrieved and decoded off-chain for efficient processing and display.

By offloading these computationally expensive tasks, we reduce gas costs and improve the overall user experience.

## Frontend Integration

Puzzle Social's frontend is built to maximize user engagement and streamline interactions with the smart contract. Key components include:

### Puzzle Creation Interface
- Users can create puzzles via an intuitive interface.
- Inputs for puzzle states are processed locally, encoded off-chain, and submitted to the smart contract.

### Puzzle Discovery and Interaction
- Explore puzzles created by the community via a feed powered by the Lens social graph.
- Filter puzzles by type, popularity, or creator.
- View puzzle details and retrieve encoded states for solving.

### Solution Submission and Leaderboards
- Players can submit their solutions to puzzles via the frontend.
- Integrate with Lens Network for features like upvotes, comments, and reputation points.
- A leaderboard showcases top solvers and creators, fostering competition and engagement.


## Why Puzzle Social Should Win the Lens Hackathon

Puzzle Social embodies the spirit of the Lens Holiday Hackathon by:
- Showcasing the power of the Lens Network for SocialFi/games applications.
- Combining gaming, community building, and decentralization into a single platform.
- Utilizing off-chain computation for scalability while maintaining trustless on-chain mechanics.
- Encouraging creativity, collaboration, and competition among users.

Our project is not just a game platform; it’s a community-driven ecosystem that highlights the versatility and potential of the Lens Network. Together, we’re redefining the future of social gaming on Web3.

