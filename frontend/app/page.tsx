"use client";

import { ConnectKitButton } from "connectkit";
import Image from "next/image";
import { useRouter } from "next/navigation";
import RetroGrid from "@/components/components/ui/retro-grid";
import HyperText from "@/components/components/ui/hyper-text";
import { useEffect, useState } from "react";

export default function Home() {
  const router = useRouter();

  const [gameState, setGameState] = useState(null);
  const [onlinePlayers, setOnlinePlayers] = useState("...");
  const [playersCount, setPlayersCount] = useState("...");

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/gameState`)
      .then((response) => response.json())
      .then((data) => {
        setGameState(data);
        setOnlinePlayers(data.npcs.length);
        setPlayersCount(data.playersCount);
      })
      .catch((error) => console.error("Error fetching game state:", error));
  }, []);

  return (
    <>
      <div className="fixed w-full relative z-0">
        <RetroGrid />
      </div>
      <main className="relative min-h-screen font-mono bg-cyber-black text-neon-blue">
        <div className="relative z-10">
          {/* Hero Section */}
          <section className="py-12 bg-gradient-to-b border-b md:py-20 from-cyber-black to-cyber-gray-900 border-neon-pink/30">
            <div className="px-4 mx-auto max-w-6xl text-center">
              <HyperText className="mb-4 text-3xl font-bold md:mb-6 md:text-4xl lg:text-5xl text-neon-pink">
                NEXT_GEN::GAMING_EVOLUTION
              </HyperText>
              <p className="mx-auto mb-6 max-w-2xl text-sm md:mb-8 md:text-base text-neon-blue/80">
                CREATE AI-DRIVEN AGENTS WITH UNIQUE ATTRIBUTES ON THE LENS
                NETWORK. BATTLE. EXPLORE. TRADE. IN A DECENTRALIZED DYSTOPIA.
              </p>
              <p className="mx-auto mb-6 max-w-2xl text-sm md:mb-8 md:text-base text-neon-pink">
                {onlinePlayers} AGENTS CREATED BY {playersCount} PLAYERS ON THE
                ARENA
                {/* blinking neon dot */}
                <span className="animate-blink text-neon-pink w-2 h-2">.</span>
              </p>
              <div className="flex flex-col gap-4 justify-center items-center sm:flex-row">
                <a
                  onClick={() => router.push("/game")}
                  className="w-full sm:w-auto inline-block px-4 md:px-6 py-2 md:py-3 text-sm md:text-base font-bold text-cyber-black bg-neon-pink rounded-none cursor-pointer hover:bg-neon-blue hover:text-cyber-black transition-all duration-300 border border-neon-pink hover:border-neon-blue transform hover:translate-y-[-2px] hover:shadow-[0_0_15px_rgba(255,0,255,0.5)]"
                >
                  INITIALIZE_GAME
                </a>
              </div>
            </div>
          </section>

          {/* Roadmap Section */}
          <section className="py-12 md:py-16 bg-cyber-black/80">
            <div className="px-4 mx-auto max-w-6xl">
              <HyperText className="mb-6 text-2xl font-bold md:mb-8 md:text-3xl text-neon-pink">
                ROADMAP::TIMELINE
              </HyperText>

              <div className="flex">
                {/* Right Timeline Cards */}
                <div className="flex-1 flex flex-col gap-8">
                  <div className="relative p-6 border group transition-all duration-300 bg-cyber-gray-800/50 border-neon-blue/30 hover:border-neon-pink hover:bg-cyber-gray-800/70 hover:transform hover:translate-x-2">
                    <div className="absolute -top-3 left-6 px-2 bg-cyber-black text-neon-pink text-xs font-bold">
                      PHASE_01
                    </div>
                    <h4 className="mb-4 text-xl font-bold text-neon-pink group-hover:text-neon-blue transition-colors">
                      HACKATHON_KICKOFF
                    </h4>
                    <div className="text-xs text-neon-pink/70 mb-3">
                      DEC_16_2024
                    </div>
                    <ul className="list-disc list-inside text-neon-blue/70 space-y-2">
                      <li>Project initialization </li>
                      <li>Smart contract architecture design</li>
                      <li>Core AI integration planning</li>
                    </ul>
                  </div>

                  <div className="relative p-6 border group transition-all duration-300 bg-cyber-gray-800/50 border-neon-blue/30 hover:border-neon-pink hover:bg-cyber-gray-800/70 hover:transform hover:translate-x-2 mt-16">
                    <div className="absolute -top-3 left-6 px-2 bg-cyber-black text-neon-pink text-xs font-bold">
                      PHASE_02
                    </div>
                    <h4 className="mb-4 text-xl font-bold text-neon-pink group-hover:text-neon-blue transition-colors">
                      BUILDING_PHASE
                    </h4>
                    <div className="text-xs text-neon-pink/70 mb-3">
                      DEC_16 - JAN_07
                    </div>
                    <ul className="list-disc list-inside text-neon-blue/70 space-y-2">
                      <li>Smart contract development & testing</li>
                      <li>Frontend UI/UX implementation</li>
                      <li>AI agent behavior systems</li>
                      <li>Token economics & staking mechanics</li>
                    </ul>
                  </div>

                  <div className="relative p-6 border group transition-all duration-300 bg-cyber-gray-800/50 border-neon-blue/30 hover:border-neon-pink hover:bg-cyber-gray-800/70 hover:transform hover:translate-x-2 mt-16">
                    <div className="absolute -top-3 left-6 px-2 bg-cyber-black text-neon-pink text-xs font-bold">
                      PHASE_03
                    </div>
                    <h4 className="mb-4 text-xl font-bold text-neon-pink group-hover:text-neon-blue transition-colors">
                      TESTING_&_SUBMISSION
                    </h4>
                    <div className="text-xs text-neon-pink/70 mb-3">
                      JAN_07_2025
                    </div>
                    <ul className="list-disc list-inside text-neon-blue/70 space-y-2">
                      <li>Comprehensive testing & debugging</li>
                      <li>Documentation completion</li>
                      <li>Hackathon submission preparation</li>
                    </ul>
                  </div>

                  <div className="relative p-6 border group transition-all duration-300 bg-cyber-gray-800/50 border-neon-blue/30 hover:border-neon-pink hover:bg-cyber-gray-800/70 hover:transform hover:translate-x-2 mt-16">
                    <div className="absolute -top-3 left-6 px-2 bg-cyber-black text-neon-pink text-xs font-bold">
                      PHASE_04
                    </div>
                    <h4 className="mb-4 text-xl font-bold text-neon-pink group-hover:text-neon-blue transition-colors">
                      MAINNET_LAUNCH
                    </h4>
                    <div className="text-xs text-neon-pink/70 mb-3">
                      JAN_12_2025
                    </div>
                    <ul className="list-disc list-inside text-neon-blue/70 space-y-2">
                      <li>Base network deployment</li>
                      <li>Community onboarding</li>
                      <li>Marketing campaign launch</li>
                      <li>Continuous updates & improvements</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Features Section */}
          <section id="features" className="py-12 md:py-16 bg-cyber-black/80">
            <div className="px-4 mx-auto max-w-6xl">
              <h3 className="mb-6 text-2xl font-bold md:mb-8 md:text-3xl text-neon-blue">
                CORE::FEATURES
              </h3>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 md:gap-8">
                {/* Feature 1 */}
                <div className="p-4 border transition-colors duration-300 md:p-6 bg-cyber-gray-800/50 border-neon-blue/30 hover:border-neon-blue">
                  <h4 className="mb-2 text-lg font-bold md:text-xl text-neon-pink">
                    AI-DRIVEN_AGENTS
                  </h4>
                  <p className="text-sm md:text-base text-neon-blue/70">
                    EACH AGENT IS UNIQUE, POWERED BY ON-CHAIN WALLETS, SHAPED BY
                    USER-PROVIDED ATTRIBUTES AND PERSONALITIES.
                  </p>
                </div>
                {/* Feature 2 */}
                <div className="p-4 border transition-colors duration-300 md:p-6 bg-cyber-gray-800/50 border-neon-blue/30 hover:border-neon-blue">
                  <h4 className="mb-2 text-lg font-bold md:text-xl text-neon-pink">
                    ERC20-BASED_ATTRIBUTES
                  </h4>
                  <p className="text-sm md:text-base text-neon-blue/70">
                    STR, INT, VIT... TRANSFER TOKENS TO YOUR AGENT TO UPGRADE
                    STATS AND CUSTOMIZE PLAYSTYLES.
                  </p>
                </div>
                {/* Feature 3 */}
                <div className="p-4 border transition-colors duration-300 md:p-6 bg-cyber-gray-800/50 border-neon-blue/30 hover:border-neon-blue">
                  <h4 className="mb-2 text-lg font-bold md:text-xl text-neon-pink">
                    LENS_PROTOCOL
                  </h4>
                  <p className="text-sm md:text-base text-neon-blue/70">
                    GASLESS, HIGH-SPEED TRANSACTIONS AND INTEGRATED SOCIAL
                    FEATURES FOR GUILDS, RAIDS, AND MARKETPLACE INTERACTIONS.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* System Overview */}
          <section
            id="system-overview"
            className="py-12 md:py-16 bg-cyber-black border-y border-neon-pink/30"
          >
            <div className="px-4 mx-auto max-w-6xl">
              <h3 className="mb-4 text-2xl font-bold md:mb-6 md:text-3xl text-neon-blue">
                SYSTEM::OVERVIEW
              </h3>
              <ul className="space-y-3 text-sm list-disc list-inside md:space-y-4 md:text-base text-neon-blue/70">
                <li>
                  <strong className="text-neon-pink">NFT = AI_AGENT</strong> —
                  EACH AGENT IS AN NFT WITH UNIQUE PERSONALITY AND ATTRIBUTE
                  DATA.
                </li>
                <li>
                  <strong className="text-neon-pink">
                    CORE_ATTRIBUTES: STR, INT, VIT
                  </strong>{" "}
                  — STORED ON-CHAIN.
                </li>
                <li>
                  <strong className="text-neon-pink">TOKEN_UPGRADES</strong> —
                  USE $AGNT TOKENS TO ENHANCE YOUR AGENT&apos;S ABILITIES.
                </li>
                <li>
                  <strong className="text-neon-pink">COMBAT_SYSTEM</strong> —
                  ALGORITHMIC POWER COMPARISON VS ENEMY OR AGENT.
                </li>
                <li>
                  <strong className="text-neon-pink">SOCIAL_INTEGRATION</strong>{" "}
                  — BROADCAST COMBAT RESULTS TO LENS FEED.
                </li>
                <li>
                  <strong className="text-neon-pink">NETWORK_SUPPORT</strong> —
                  CURRENTLY ON LENS NETWORK, BASE INTEGRATION COMING SOON.
                </li>
              </ul>
            </div>
          </section>

          {/* Call to Action */}
          <section
            id="get-started"
            className="py-12 text-center backdrop-blur-sm md:py-16 bg-neon-purple/10"
          >
            <div className="px-4 mx-auto max-w-6xl">
              <h4 className="mb-3 text-xl font-bold md:mb-4 md:text-2xl text-neon-pink">
                READY_TO_JOIN?
              </h4>
              <p className="mb-6 text-sm md:mb-8 md:text-base text-neon-blue">
                ENTER THE ARENA. SHAPE THE FUTURE OF ON-CHAIN GAMING.
              </p>
              <a
                href="#"
                className="inline-block px-4 md:px-6 py-2 md:py-3 text-sm md:text-base font-bold text-cyber-black bg-neon-pink rounded-none hover:bg-neon-blue transition-all duration-300 transform hover:translate-y-[-2px] hover:shadow-[0_0_15px_rgba(255,0,255,0.5)]"
              >
                INITIALIZE_AGENT
              </a>
            </div>
          </section>

          {/* Footer */}
          <footer className="py-4 w-full border-t md:py-6 bg-cyber-black border-neon-pink/30">
            <div className="px-4 mx-auto max-w-6xl text-sm text-center md:text-base text-neon-blue/50">
              <p>
                © {new Date().getFullYear()} CYBER_AI_RPG :: ALL_RIGHTS_RESERVED
              </p>
            </div>
          </footer>
        </div>
      </main>
    </>
  );
}
