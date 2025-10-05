// pages/index.tsx
import type { NextPage } from "next";
import { ConnectKitButton } from "connectkit";
import Infrapage from "../components/Infra";
import Kyc from "../components/Kyc";
import { useState } from "react";

const Home: NextPage = () => {
  const [kycHash, setKycHash] = useState("");

  function handleKycCapture(hash: string) {
    console.log("Received KYC hash from KYC component:", hash);
    setKycHash(hash);
    
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        gap: "2rem",
      }}
    >
      <ConnectKitButton />
      <Infrapage />

      <div style={{ border: "1px solid #ccc", padding: "1rem" }}>
        <h2>KYC Demo</h2>
        <Kyc onCapture={handleKycCapture} />
        {kycHash && (
          <p>
            Captured face hash: <strong>{kycHash}</strong>
          </p>
        )}
      </div>
    </div>
  );
};

export default Home;
