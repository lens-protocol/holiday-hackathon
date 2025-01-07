const hre = require("hardhat");

async function main() {
  try {
    // Get the contract factory
    const MyToken = await hre.ethers.getContractFactory("BookIt");
    
    console.log("Deploying contract...");
    
    // Deploy the contract
    const myToken = await MyToken.deploy();
    await myToken.waitForDeployment();
    
    const address = await myToken.getAddress();
    console.log("Contract deployed to:", address);
    
    // Wait for a few block confirmations
    console.log("Waiting for confirmations...");
    await myToken.deploymentTransaction().wait(6);
    
    // Verify the contract
    console.log("Verifying contract...");
    await hre.run("verify:verify", {
      address: address,
      constructorArguments: []
    });
    
    console.log("Contract verified successfully");
    
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });