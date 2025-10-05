// pages/index.tsx
import React, { useState } from "react";
import type { NextPage } from "next";
import Link from "next/link";
import { useAccount, useProvider } from "wagmi"; 
import { ethers } from "ethers";

import styles from "../styles/Home.module.css";


const CHALLENGE_FACTORY_ADDRESS = "0xA6bCfcB1C0a88531DeC551392429652cD4aBb6Df";


const CHALLENGE_FACTORY_ABI = [
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "challengeId",
          "type": "uint256"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "creator",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "rewardToken",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "bountyAmount",
          "type": "uint256"
        }
      ],
      "name": "ChallengeCreated",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "challengeId",
          "type": "uint256"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "participant",
          "type": "address"
        }
      ],
      "name": "ChallengeJoined",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "uint8",
          "name": "version",
          "type": "uint8"
        }
      ],
      "name": "Initialized",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "previousOwner",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "newOwner",
          "type": "address"
        }
      ],
      "name": "OwnershipTransferred",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "challengeId",
          "type": "uint256"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "participant",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "string",
          "name": "lensPostLink",
          "type": "string"
        }
      ],
      "name": "SubmissionMade",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "challengeId",
          "type": "uint256"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "winner",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "bountyAmount",
          "type": "uint256"
        }
      ],
      "name": "WinnerDeclared",
      "type": "event"
    },
    {
      "inputs": [],
      "name": "challengeCount",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_rewardToken",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "_bountyAmount",
          "type": "uint256"
        }
      ],
      "name": "createChallenge",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_challengeId",
          "type": "uint256"
        },
        {
          "internalType": "address",
          "name": "_winner",
          "type": "address"
        }
      ],
      "name": "declareWinner",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_challengeId",
          "type": "uint256"
        }
      ],
      "name": "getChallengeData",
      "outputs": [
        {
          "internalType": "address",
          "name": "creator",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "rewardToken",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "bountyAmount",
          "type": "uint256"
        },
        {
          "internalType": "bool",
          "name": "active",
          "type": "bool"
        },
        {
          "internalType": "address",
          "name": "winner",
          "type": "address"
        },
        {
          "internalType": "address[]",
          "name": "participantList",
          "type": "address[]"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_challengeId",
          "type": "uint256"
        },
        {
          "internalType": "address",
          "name": "_participant",
          "type": "address"
        }
      ],
      "name": "getParticipantInfo",
      "outputs": [
        {
          "internalType": "bool",
          "name": "hasJoined",
          "type": "bool"
        },
        {
          "internalType": "bool",
          "name": "hasSubmitted",
          "type": "bool"
        },
        {
          "internalType": "string",
          "name": "lensPostLink",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "initialize",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_challengeId",
          "type": "uint256"
        }
      ],
      "name": "joinChallenge",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "owner",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "renounceOwnership",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_challengeId",
          "type": "uint256"
        },
        {
          "internalType": "string",
          "name": "_lensPostLink",
          "type": "string"
        }
      ],
      "name": "submitLensPost",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "newOwner",
          "type": "address"
        }
      ],
      "name": "transferOwnership",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    }
  ];

const Home: NextPage = () => {
  const { address, isConnected } = useAccount(); 
  const provider = useProvider();              

  const [tokenAddress, setTokenAddress] = useState("");
  const [bountyAmount, setBountyAmount] = useState("");


  async function handleCreateChallenge() {
    try {
      if (!isConnected) {
        alert("Wallet not connected!");
        return;
      }
      if (!tokenAddress || !bountyAmount) {
        alert("Please enter token address and amount.");
        return;
      }

      
      const signer = provider.getSigner(address);

      
      const contract = new ethers.Contract(
        CHALLENGE_FACTORY_ADDRESS,
        CHALLENGE_FACTORY_ABI,
        signer
      );

      console.log("Sending createChallenge transaction...");
      const tx = await contract.createChallenge(
        tokenAddress,
        ethers.utils.parseEther(bountyAmount)
      );
      const receipt = await tx.wait();
      console.log("Challenge created, tx hash:", receipt.transactionHash);
      alert(`Challenge created! txHash: ${receipt.transactionHash}`);
    } catch (error) {
      console.error(error);
      alert(`Error: ${String(error)}`);
    }
  }

  return (
    <div className={styles.container}>
      {/* Hero Section */}
      <header
        className={styles.heroSection}
        style={{ backgroundImage: "url('/hero-image.jpg')" }}
      >
        <div className={styles.overlay} />
        <div className={styles.heroContent}>
          <h1>ChallengeMe</h1>
          <p>
            The platform where watching, creating, doing, and supporting
            challenges unite for real-world rewards.
          </p>
          <Link href="#features" scroll={false} className={styles.exploreBtn}>
            Explore Features
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className={styles.main}>
        <section id="features" className={styles.featuresSection}>
          <h2>Platform Features</h2>
          <p className={styles.subtitle}>
            Four roles power the ChallengeMe ecosystem: Watchers, Challengers,
            Doers, and Supporters. Earn real rewards, drive engagement, and
            build communities around bold challenges.
          </p>

          {/* Features Grid */}
          <div className={styles.featuresGrid}>
            {/* Watcher */}
            <div className={styles.featureCard}>
              <h3 className={styles.featureTitle}>
                <span className={styles.iconBox}>
                  {/* Eye Icon (example) */}
                  <svg
                    className={styles.icon}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    viewBox="0 0 24 24"
                  >
                    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>
                </span>
                Watcher
              </h3>
              <ul className={styles.list}>
                <li>
                  <span className={styles.iconSmall}>
                    {/* DollarSign Icon */}
                    <svg
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      viewBox="0 0 24 24"
                    >
                      <line x1="12" y1="1" x2="12" y2="23"></line>
                      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                    </svg>
                  </span>
                  Pay $1 to view, vote, and share in rewards
                </li>
                <li>
                  <span className={styles.iconSmall}>
                    {/* Gift Icon */}
                    <svg
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      viewBox="0 0 24 24"
                    >
                      <polyline points="20 12 20 22 4 22 4 12"></polyline>
                      <rect x="2" y="7" width="20" height="5"></rect>
                      <line x1="12" y1="22" x2="12" y2="7"></line>
                      <path d="M12 7a4 4 0 1 1 8 0v0a4 4 0 0 1-8 0v0z"></path>
                      <path d="M12 7a4 4 0 1 0-8 0v0a4 4 0 0 0 8 0v0z"></path>
                    </svg>
                  </span>
                  Random prize allocations to most active watchers
                </li>
              </ul>
            </div>

            {/* Challenger */}
            <div className={styles.featureCard}>
              <h3 className={styles.featureTitle}>
                <span className={styles.iconBox}>
                  {/* Trophy Icon */}
                  <svg
                    className={styles.icon}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    viewBox="0 0 24 24"
                  >
                    <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"></path>
                    <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"></path>
                    <path d="M4 22h16"></path>
                    <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"></path>
                    <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"></path>
                    <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"></path>
                  </svg>
                </span>
                Challenger
              </h3>
              <ul className={styles.list}>
                <li>
                  <span className={styles.iconSmall}>
                    {/* DollarSign Icon */}
                    <svg
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      viewBox="0 0 24 24"
                    >
                      <line x1="12" y1="1" x2="12" y2="23"></line>
                      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                    </svg>
                  </span>
                  Earn a cut from watchers’ pay-to-watch fees
                </li>
                <li>
                  <span className={styles.iconSmall}>
                    {/* SquareSplitVertical Icon */}
                    <svg
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      viewBox="0 0 24 24"
                    >
                      <rect width="18" height="18" x="3" y="3" rx="2" ry="2"></rect>
                      <line x1="12" y1="3" x2="12" y2="21"></line>
                    </svg>
                  </span>
                  Option to split bounty for multiple winners
                </li>
                <li>
                  <span className={styles.iconSmall}>
                    {/* Target Icon */}
                    <svg
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      viewBox="0 0 24 24"
                    >
                      <circle cx="12" cy="12" r="10"></circle>
                      <circle cx="12" cy="12" r="6"></circle>
                      <circle cx="12" cy="12" r="2"></circle>
                    </svg>
                  </span>
                  Create micro-challenges
                </li>
              </ul>
            </div>

            {/* Doer */}
            <div className={styles.featureCard}>
              <h3 className={styles.featureTitle}>
                <span className={styles.iconBox}>
                  {/* User Icon */}
                  <svg
                    className={styles.icon}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    viewBox="0 0 24 24"
                  >
                    <path d="M20 21v-2a4 4 0 0 0-3-3.87"></path>
                    <path d="M4 21v-2a4 4 0 0 1 3-3.87"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                </span>
                Doer
              </h3>
              <ul className={styles.list}>
                <li>
                  <span className={styles.iconSmall}>
                    {/* DollarSign Icon */}
                    <svg
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      viewBox="0 0 24 24"
                    >
                      <line x1="12" y1="1" x2="12" y2="23"></line>
                      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                    </svg>
                  </span>
                  Larger prize pool from Watchers & Supporters
                </li>
                <li>
                  <span className={styles.iconSmall}>
                    {/* Award Icon */}
                    <svg
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      viewBox="0 0 24 24"
                    >
                      <circle cx="12" cy="8" r="7"></circle>
                      <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline>
                    </svg>
                  </span>
                  Chooses which Supporter earns a cut
                </li>
              </ul>
            </div>

            {/* Supporter */}
            <div className={styles.featureCard}>
              <h3 className={styles.featureTitle}>
                <span className={styles.iconBox}>
                  {/* Users Icon */}
                  <svg
                    className={styles.icon}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    viewBox="0 0 24 24"
                  >
                    <path d="M17 21v-2a4 4 0 0 0-3-3.87"></path>
                    <path d="M9 21v-2a4 4 0 0 1 3-3.87"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                    <path d="M5 8c-1.67.85-2.99 2.54-3 4.62C2 17 4.5 19 5.5 20.5"></path>
                    <path d="M22 12.62c0-2.08-1.33-3.77-3-4.62"></path>
                  </svg>
                </span>
                Supporter
              </h3>
              <ul className={styles.list}>
                <li>
                  <span className={styles.iconSmall}>
                    {/* Heart Icon */}
                    <svg
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      viewBox="0 0 24 24"
                    >
                      <path d="M20.84 4.61c-1.54-1.35-3.57-1.61-5.2-.68-1.06.58-1.94 1.51-2.64 2.58C12.3 5.44 11.42 4.51 10.36 3.93c-1.63-.93-3.66-.67-5.2.68C2.38 6.28 2 8.5 3.5 10.28L12 19l8.5-8.72c1.5-1.78 1.12-4 0-5.67Z"></path>
                    </svg>
                  </span>
                  Send funds or resources to Doers
                </li>
                <li>
                  <span className={styles.iconSmall}>
                    {/* Award Icon */}
                    <svg
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      viewBox="0 0 24 24"
                    >
                      <circle cx="12" cy="8" r="7"></circle>
                      <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline>
                    </svg>
                  </span>
                  Earn a cut if chosen by the Doer
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* 
          Example: Minimal form to create a challenge.
        */}
        <section style={{ marginTop: "2rem", padding: "1rem", border: "1px solid #ccc" }}>
          <h3>Create a Challenge</h3>
          <div style={{ marginBottom: "1rem" }}>
            <label style={{ display: "block", marginBottom: ".25rem" }}>
              Reward Token Address
            </label>
            <input
              type="text"
              placeholder="0x..."
              value={tokenAddress}
              onChange={(e) => setTokenAddress(e.target.value)}
              style={{ width: "100%", padding: ".5rem" }}
            />
          </div>
          <div style={{ marginBottom: "1rem" }}>
            <label style={{ display: "block", marginBottom: ".25rem" }}>
              Bounty Amount (ETH decimals)
            </label>
            <input
              type="text"
              placeholder="e.g. 10"
              value={bountyAmount}
              onChange={(e) => setBountyAmount(e.target.value)}
              style={{ width: "100%", padding: ".5rem" }}
            />
          </div>
          <button style={{ padding: ".5rem 1rem" }} onClick={handleCreateChallenge}>
            Create Challenge
          </button>
        </section>
      </main>

      {/* Footer */}
      <footer className={styles.footer}>
        <p>&copy; {new Date().getFullYear()} ChallengeMe. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Home;
