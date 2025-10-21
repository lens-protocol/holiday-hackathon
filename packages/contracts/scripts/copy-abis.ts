// scripts/copy-abis.ts
import fs from "fs";
import path from "path";

// Configuration
const config = {
  // Source directory where Hardhat puts compiled artifacts
  sourceDir: path.join(__dirname, "../artifacts-zk/contracts"),
  // Destination directory in your frontend
  destDir: path.join(__dirname, "../../../app/src/contracts/abis"),
  // List of contracts whose ABIs you want to copy
  contracts: ["ScoreManager", "TipManager", "TokenManager", "TechBites"],
};

async function copyABIs() {
  try {
    // Create destination directory if it doesn't exist
    if (!fs.existsSync(config.destDir)) {
      fs.mkdirSync(config.destDir, { recursive: true });
    }

    for (const contractName of config.contracts) {
      // Construct source path - note the updated path structure
      const sourcePath = path.join(
        config.sourceDir,
        contractName + ".sol",
        contractName + ".json"
      );

      // Check if source file exists
      if (!fs.existsSync(sourcePath)) {
        console.error(
          `Warning: Could not find artifact for ${contractName} at ${sourcePath}`
        );
        // Try alternative path (some setups might have nested contract directories)
        const altSourcePath = path.join(
          config.sourceDir,
          contractName,
          contractName + ".json"
        );
        if (!fs.existsSync(altSourcePath)) {
          console.error(`Also checked alternative path: ${altSourcePath}`);
          continue;
        }
      }

      // Read the artifact JSON
      const artifact = JSON.parse(fs.readFileSync(sourcePath, "utf8"));

      // Extract just the ABI and bytecode
      const abiOnly = {
        abi: artifact.abi,
        bytecode: artifact.bytecode,
      };

      // Construct destination path
      const destPath = path.join(config.destDir, contractName + ".json");

      // Write the ABI to the destination
      fs.writeFileSync(destPath, JSON.stringify(abiOnly, null, 2));

      console.log(`✓ Copied ABI for ${contractName}`);
    }

    console.log("\nABI copy completed successfully! 🎉");
  } catch (error) {
    console.error("Error copying ABIs:", error);
    process.exit(1);
  }
}

// Execute if this is run directly
if (require.main === module) {
  copyABIs();
}
