"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
// import { useLens } from "../../../contexts/LensContext";
import Image from "next/image";
import ConnectLens from "../../../components/connect-lens";
import { useWriteContract } from "wagmi";
import { useAccount } from "wagmi";
import abi from "../../../abis/AgentFactory.json";
import { AGENT_FACTORY_ADDRESS } from "../../constants";
import { ConnectKitButton } from "connectkit";
import { chains } from "@lens-network/sdk/viem";

const characters = [
  "deckard.png",
  "joi.png",
  "k casual.png",
  "k jacket.png",
  "luv combat.png",
  "luv corp.png",
  "mariette jacket.png",
  "neanderwallace.png",
  "pris.png",
  "rachel.png",
  "royjacket.png",
  "royshirtless.png",
  "sapper.png",
];

export default function CreateAgentPage() {
  const router = useRouter();
  //   const { createAccount, isAuthenticated } = useLens();
  const { writeContract, isPending, isSuccess, isError, error, data } =
    useWriteContract();
  const { address } = useAccount();
  const [formData, setFormData] = useState({
    name: "",
    bio: "",
    character: characters[0],
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCharacterSelect = (character: string) => {
    setFormData((prev) => ({
      ...prev,
      character,
    }));
  };

  useEffect(() => {
    if (isSuccess) {
      router.push("/agents");
    }
  }, [isSuccess]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    writeContract({
      abi: abi.abi,
      address: AGENT_FACTORY_ADDRESS,
      functionName: "createAgent",
      chainId: chains.testnet.id,
      chain: chains.testnet,
      args: [formData.name, formData.bio, formData.character],
    });
    // try {
    //     const username = formData.name.toLowerCase().replace(/[^a-z0-9]/g, '');

    //     await createAccount({
    //         name: formData.name,
    //         username,
    //         bio: formData.bio,
    //         picture: formData.character,
    //         character: formData.character
    //     });

    //     router.push('/agents');
    // } catch (error) {
    //     console.error('Failed to create agent:', error);
    // }
  };

  if (!address) {
    return (
      <div className="flex justify-center items-center min-h-screen text-white bg-gray-900">
        Please connect your wallet first
        <br />
        <ConnectKitButton />
      </div>
    );
  }

  return (
    <main className="p-8 min-h-screen font-sans text-white bg-gray-900">
      <form onSubmit={handleSubmit} className="mx-auto space-y-6 max-w-2xl">
        <div className="space-y-4">
          <div>
            <label htmlFor="name" className="block mb-1 text-sm font-medium">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              maxLength={32}
              className="px-3 py-2 w-full text-white bg-gray-800 rounded-md"
              required
            />
            <p className="text-xs text-gray-500">
              The name must be 32 characters or less.
            </p>
          </div>

          <div>
            <label htmlFor="bio" className="block mb-1 text-sm font-medium">
              AI Agent Instructions / Personality
            </label>
            <textarea
              id="bio"
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              className="px-3 py-2 w-full text-white bg-gray-800 rounded-md"
              rows={3}
              required
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium">Character</label>
            <div className="grid grid-cols-4 gap-4">
              {characters.map((char) => (
                <div
                  key={char}
                  className={`flex flex-col items-center justify-center cursor-pointer p-2 rounded-lg ${
                    formData.character === char ? "bg-blue-600" : "bg-gray-800"
                  }`}
                  onClick={() => handleCharacterSelect(char)}
                >
                  <div className="w-[64px] h-[64px] overflow-hidden relative">
                    <div
                      className="absolute"
                      style={{
                        width: "64px",
                        height: "64px",
                        backgroundImage: `url(/static/characters/${encodeURIComponent(
                          char
                        )})`,
                        backgroundPosition: "0 0",
                        imageRendering: "pixelated",
                        transform: "scale(2)",
                        transformOrigin: "top left",
                      }}
                    />
                  </div>
                  <p className="mt-2 text-xs text-center">
                    {char.replace(".png", "")}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="px-4 py-2 w-full font-bold text-white bg-blue-600 rounded hover:bg-blue-700"
        >
          {isPending ? (
            <div className="flex justify-center items-center w-full">
              {/* spinner */}
              {/* tailwindcss spinner */}
              <div className="w-4 h-4 rounded-full border-4 border-t-4 border-white animate-spin border-t-transparent"></div>
            </div>
          ) : (
            "Create Agent"
          )}
        </button>
        <div className="p-4 mb-6 text-sm text-blue-200 bg-blue-900/50 rounded-lg">
          Note: After creating your agent, please allow up to 5 minutes for it
          to appear on the map.
        </div>
        <div className="flex justify-center items-center w-full text-wrap">
          {isSuccess && (
            <div className="flex justify-center items-center w-full">
              <p className="text-green-500">Agent created successfully</p>
            </div>
          )}

          {isError && (
            <div className="flex justify-center items-center w-full">
              <p className="text-red-500">Error creating agent</p>
            </div>
          )}

          {error && (
            <div className="flex justify-center items-center w-full">
              <p className="text-red-500">{error.message}</p>
            </div>
          )}

          {data && (
            <div className="flex justify-center items-center w-full">
              <p className="text-green-500">Agent created successfully</p>
            </div>
          )}
        </div>
      </form>
    </main>
  );
}
