# Pixel Canvas

## Team Members
- [Michael](https://github.com/joaolago1113) (lens: @michael_lens)

## Project Description
**Pixel Canvas** is a decentralized platform allowing users to create pixel art collaboratively on a 64x64 canvas. Here users can paint individual pixels or upload entire images while using **PaintTokens**, a currency based on the ERC20 standard, to buy and set colors of the pixels. Smart contracts on the **Lens network** manage all transactions and will ensure secure modification of the canvas. Integration with this blockchain makes the whole experience community-driven and allows everybody to be a part of the collective masterpiece. There's a finite supply of 10 million PaintTokens, which when all burned, the canvas will become immutable.

## Technical Overview

### Smart Contracts

- **Location:** `packages/hardhat/contracts/CollaborativeArtCanvas.sol` and `packages/hardhat/contracts/PaintToken.sol`

- **CollaborativeArtCanvas.sol:**
  - **Description:** Handles the canvas state, pixel color updates, and interactions with PaintTokens, enabling users to paint and own pixels securely.
  - **Deployment Address:** [0xDdC944c362A3D3b8B2223092Fab0027DF127ae27](https://block-explorer.testnet.lens.dev/address/0xDdC944c362A3D3b8B2223092Fab0027DF127ae27)
  
- **PaintToken.sol:**
  - **Description:** Manages the creation, distribution, and burning of PaintTokens, ensuring a controlled token economy within the platform.
  - **Deployment Address:** [0x1e952234E4014B836FfA8877b26Cb61fF206926e](https://block-explorer.testnet.lens.dev/address/0x1e952234E4014B836FfA8877b26Cb61fF206926e)

### Frontend Integration

- **ConnectKit Integration:** Using ConnectKit to ensure easy wallet connection and management, a high-quality authentication experience.
- **React & Next.js:** Build up modern React patterns and Next.js for performance and developer experience.

### Features

- **64x64 Collaborative Canvas:** A canvas with fixed size, where all users can paint pixels or apply whole images to it.
- **PaintTokens (ERC20):** A cryptocurrency that enables users to paint but ensures that transactions happen in a safe and open way.
- **Integration with Smart Contracts:** Solidity contracts that are deployed on the Lens Network for secure management of token supply, ownership, and pixel change.

### Draw & Image Tools

- **Upload an Image:** 
  - Upload, Resize and Position images in the canvas 
  - Preview Guaranteed Perfect Placement
- **Advanced Drawing Tools:**
  - Interactive color picker with hex input and preset colors
  - Eraser tool for removing pixels
  - Continuous drawing mode for smooth pixel painting

### Transactional and Optimization Features

- **Shopping Cart System:**
  - Adding multiple pixels into cart before buying
  - View all changes before validating
  - Process in batches
  - Clear cart and also clear individual pixel
- **Optimization Attributes:**
  - Automatic detection of rectangular area in paint for smarter painting 
  - RLE (Run Termination Encoding) method for optimized pixel updates 
  - Color-Palette Optimization for Batch-Transactions 

### User Experience

- **Overall User Interface:**
  - UI runs on both mobile and desktop
  - The active pixel coordinates display
  - Zoom and pan in the view for precise pixel placement
  - With modern gradient aesthetics- dark mode interface
- **Token Management:**
  - Token purchase incorporated
  - Display real-time balance
  - Automatic token refill required on token shortage
  - Transparent price and gas optimization

## Getting Started

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/joaolago1113/pixel_canvas.git
   cd pixel_canvas
   ```

2. **Install Dependencies:**
   ```bash
   yarn install
   ```

3. **Configure Environment Variables:**
   - Create a `.env` file in `packages/nextjs/` and add your WalletConnect Project ID:
     ```
     NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=your-walletconnect-project-id
     ```

4. **Compile Smart Contracts:**
   ```bash
   cd packages/hardhat
   npx hardhat compile
   ```

5. **Deploy Contracts (If Not Already Deployed):**
   ```bash
   npx hardhat run scripts/00_deploy_your_contract.ts --network lensTestnet
   ```

6. **Run the Frontend:**
   ```bash
   cd packages/nextjs
   yarn dev
   ```   

7. **Access the Application:**
   - Open [http://localhost:3000](http://localhost:3000) in your browser to start painting!

## Links

### Source Code: [github.com/joaolago1113/pixel_canvas](https://github.com/joaolago1113/pixel_canvas)

### Preview: [pixelcanvas.vercel.app](https://pixelcanvas.vercel.app/)

### Demo Video: 


https://github.com/user-attachments/assets/2bd533bb-c986-4797-b0b4-c0b3669b955d




### Screenshots:

#### Dashboard
![image](https://github.com/user-attachments/assets/d7b5c75a-1bf6-4293-a7dd-59456b451afb)
#### Image Upload
![image](https://github.com/user-attachments/assets/e68853e2-c686-435d-b160-ab0ca0c2bcd2)
#### Color Picker
![image](https://github.com/user-attachments/assets/4fc31b86-c7ce-420d-bc18-43292cf082e0)
#### Shopping Cart
![image](https://github.com/user-attachments/assets/eb40e556-9b70-4a58-9613-6e33d38e0ff2)
#### Eraser Tool
![image](https://github.com/user-attachments/assets/4af68e92-495c-41fb-a87f-404681f83793)
#### Purchase Tokens
![image](https://github.com/user-attachments/assets/bd017879-e045-4493-910b-645b1af5daa7)


## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any enhancements or bug fixes.

## License

This project is licensed under the MIT License.

## Acknowledgements

- [OpenZeppelin](https://openzeppelin.com/) for their robust smart contract libraries
- [Lens Protocol](https://lens.xyz/) for their innovative social network infrastructure
- [ConnectKit](https://github.com/family/connectkit) for their excellent wallet connection interface and components

