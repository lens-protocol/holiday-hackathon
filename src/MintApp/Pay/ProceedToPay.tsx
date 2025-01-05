 import { useAccount } from "wagmi";
// import { simulateContract, writeContract } from "@wagmi/core";
// import { abi } from "./generateImageAbi";
// import { config } from "../wagmi";
import { useState } from 'react';

export const useProceedToPay = (onSuccess?: () => void) => {
   const { address } = useAccount();
  const [isPay, setIsPay] = useState<boolean>(false);
  const errorr = null;
  // const [errorr, setError] = useState<string | null>(null);

  const proceedToPay = async () => {
    
    if (!address) {
      console.error("No account connected");
      // setError("No account connected");
      return;
    }
    console.log("payed");
    setIsPay(true);
    if (onSuccess) {
      onSuccess();
    }
    // const valueInWei = BigInt(Math.floor(0.00007 * 10 ** 18)); // Convert 0.0007 Grass to Wei

    // try {
    //   // Simulate the contract call to check if it will succeed
    //   const { request } = await simulateContract(config, {
    //     abi,
    //     address: import.meta.env.VITE_PAY_CONTRACT_ADDREESS,
    //     functionName: "pay",
    //     args: [], // Add any necessary arguments for the 'pay' function here
    //     value: valueInWei,
    //   });

    //   // Proceed to write the contract if simulation succeeded
    //   console.log("Simulation succeeded, proceeding with transaction.");

    //   const hash = await writeContract(config, request);

    //   // Optionally, you can wait for the transaction receipt if needed
    //   console.log("Transaction sent, hash:", hash);
    //   setIsPay(true);
    // } catch (error) {
    //   console.error("Error writing contract:", error);
    //   setError("Transaction failed");
    // }
  };

  return { proceedToPay, isPay, errorr };
};

export default useProceedToPay;
