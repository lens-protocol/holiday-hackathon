import { Deployer } from "@matterlabs/hardhat-zksync";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { Wallet } from "zksync-ethers";
import dotenv from "dotenv";

dotenv.config();

export default async function (hre: HardhatRuntimeEnvironment) {
    // Initialize wallet with private key from .env file
    if (!process.env.PRIVATE_KEY) {
        throw new Error("Private key not provided in .env file");
    }
    const wallet = new Wallet(process.env.PRIVATE_KEY);

    // Initialize deployer
    const deployer = new Deployer(hre, wallet);

    // Load the artifact
    const artifact = await deployer.loadArtifact("ResolutionChallenge");

    // Deploy the contract
    // Note: Our contract doesn't need constructor parameters as it initializes
    // default categories in the constructor
    const resolutionContract = await deployer.deploy(artifact, []);

    // Get the contract address
    const contractAddress = await resolutionContract.getAddress();

    console.log(`${artifact.contractName} was deployed to ${contractAddress}`);

    // Verify the contract
    console.log("Verifying contract...");
    await hre.run("verify:verify", {
        address: contractAddress,
        contract: "contracts/ResolutionChallenge.sol:ResolutionChallenge",
    });

    // For testing purposes, you might want to add some initial categories
    // Only do this on test networks
    if (process.env.NODE_ENV === "development") {
        console.log("Adding test categories...");
        try {
            await resolutionContract.addCategory("Meditation");
            await resolutionContract.addCategory("Reading");
            await resolutionContract.addCategory("Writing");
            console.log("Test categories added successfully");
        } catch (error) {
            console.error("Error adding test categories:", error);
        }
    }
}

// Deploy configuration
module.exports.tags = ["ResolutionChallenge"];
module.exports.dependencies = []; // Add any dependencies here if needed