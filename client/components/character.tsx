"use client";

import { useState, useRef, useEffect } from "react";
import { useAccount } from "wagmi";
import { ConnectKitButton } from "connectkit";
import { fal } from "@fal-ai/client";
import { createUserAvatar, getUserAvatar } from "@/lib/dynamodb";
import { Button } from "@/components/ui/button";
import { cn, mintNFT } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import GamePage from "./game";

const PROMPT_OPTIONS = [
  {
    value: 0,
    description: "Vintage Royalty",
    preview: "https://fal.media/files/rabbit/bZTcMnrMe8xEKHES-na0f.png",
    prompt:
      "A futuristic gladiator clad in glowing neon armor, blending sci-fi technology with ancient gladiatorial flair. The fighter wields a glowing energy shield, features cybernetic enhancements, and wears a bold helmet accented with neon lines",
  },
  {
    value: 1,
    description: "Renaissance Noble",
    preview: "https://fal.media/files/monkey/Fd0KrJ-Tprz5D_p5stvBv.png",
    prompt:
      "A rugged, post-apocalyptic fighter adorned with scavenged armor and makeshift weapons. The character has spiked shoulder pads, battle-worn goggles, and scars or tattoos that tell stories of their survival",
  },
  {
    value: 2,
    description: "Modern Artistic",
    preview: "https://fal.media/files/panda/M5SrY5jSpsRx6rauA8tw4.png",
    prompt:
      "A sleek and mysterious enforcer cloaked in shadow. The fighter wears a dark hood, glowing red or green accents, and wields dual energy blades or knuckles designed for stealthy combat",
  },
  {
    value: 3,
    description: "Modern Artistic",
    preview: "https://fal.media/files/zebra/TpggY2SAU3WukLtHisnMr.png",
    prompt:
      "A mystical warrior inspired by the moon, combining elegance and lethality. The character wears silver armor with crescent moon motifs, flowing robes, and glowing lunar tattoos that shimmer in low light",
  },
  {
    value: 4,
    description: "Modern Artistic",
    preview: "https://fal.media/files/penguin/bjA92zgPFOnHoMmLsluwq.png",
    prompt:
      "A primal, wild fighter inspired by the untamed jungle. The warrior features tribal tattoos, animalistic fur accents, and weapons resembling bones or claws, embodying raw, unrefined power.",
  },
  {
    value: 5,
    description: "Modern Artistic",
    preview: "https://fal.media/files/lion/KfuS0R2Yg_f4eQO1cdMOB.png",
    prompt:
      "A modern-day samurai equipped with futuristic armor and a glowing katana. The character wears a sleek trench coat over lightweight armor, and their helmet integrates traditional samurai features with cybernetic enhancements.",
  },
  {
    value: 6,
    description: "Modern Artistic",
    preview: "https://fal.media/files/elephant/XUhu2KOibJYTNZ2x4myzZ.png",
    prompt:
      "A retro-style fighter inspired by pixel art, with chunky, brightly-colored gear and exaggerated animations. The character wears a pixelated power glove, wields a glowing 8-bit hammer, and has a bold, blocky appearance.",
  },
  {
    value: 7,
    description: "Modern Artistic",
    preview: "https://fal.media/files/monkey/0LincpG91vo6B9vPcICTQ.png",
    prompt:
      "A chilling fighter embodying the essence of ice and snow. They wear crystalline armor adorned with frost patterns, carry an icy halberd, and emit a cold mist with each movement. Their glowing blue eyes and frostbitten skin give them an otherworldly appearance.",
  },
] as const;

fal.config({
  proxyUrl: "/api/profile/upload",
});

export default function CharacterPage() {
  const { address, isConnected } = useAccount();
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedPrompt, setSelectedPrompt] = useState<number | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [playMode, setPlayMode] = useState<boolean>(false);
  const [userAvatar, setUserAvatar] = useState<string | null>(null);

  const [isMinting, setIsMinting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const getAvatar = async () => {
      // const address = "0x1";
      const res = await getUserAvatar(address as string);
      setUserAvatar(res?.avatarUrl);
      console.log("AVATAR", res);
    };
    getAvatar();
  }, [isConnected, address]);

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async () => {
    // remove this code its for deployment

    // router.push("/game");

    // open this code for deployment
    if (!selectedImage) return;

    setIsUploading(true);
    try {
      const uploadedImageUrl = await fal.storage.upload(selectedImage);

      console.log("Uploaded Image URL:", uploadedImageUrl);

      const promptConfig = PROMPT_OPTIONS.find(
        (p) => p.value === selectedPrompt
      )!;

      const result = await fal.subscribe("fal-ai/flux-pulid", {
        input: {
          prompt: promptConfig.prompt,
          reference_image_url: uploadedImageUrl,
        },
        logs: true,
        onQueueUpdate: (update) => {
          if (update.status === "IN_PROGRESS") {
            update.logs.map((log) => log.message).forEach(console.log);
          }
        },
      });

      console.log("Generated Image Data:", result.data);
      console.log("Request ID:", result.requestId);

      if (result.data) {
        const generatedUrl = result.data.images[0].url;
        setGeneratedImage(generatedUrl);
        createUserAvatar(address as string, generatedUrl);
      } else {
        throw new Error("Failed to generate image");
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert(
        error instanceof Error
          ? error.message
          : "Failed to upload or generate image"
      );
    } finally {
      setIsUploading(false);
    }
  };

  const handleMint = async () => {
    if (!generatedImage) return;

    setIsMinting(true);
    try {
      const result = await mintNFT(generatedImage);
      alert(result.message);
    } catch (error) {
      console.error("Minting error:", error);
    } finally {
      setIsMinting(false);
    }
  };

  return playMode || userAvatar ? (
    <GamePage />
  ) : (
    <Card>
      <CardHeader>
        <CardTitle>Create your character</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <div>
            <Label>Select Style</Label>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
              {PROMPT_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setSelectedPrompt(option.value)}
                  className={cn(
                    "relative aspect-square overflow-hidden rounded-lg transition-all hover:opacity-90",
                    "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
                    selectedPrompt === option.value
                      ? "ring-2 ring-primary ring-offset-2"
                      : "ring-1 ring-gray-200"
                  )}
                >
                  <img
                    src={option.preview}
                    alt={option.description}
                    className="h-full w-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          <p className="my-4 text-center">
            Or create your custom character in above style
          </p>

          {previewImage && (
            <div className="mb-4">
              <img
                src={previewImage}
                alt="Selected profile picture"
                className="mx-auto h-32 w-32 rounded-full object-cover"
              />
            </div>
          )}

          {generatedImage && (
            <div className="flex justify-center">
              <img
                src={generatedImage}
                alt="Your generated character"
                className="mx-auto h-64 w-64 rounded-full object-cover"
              />
            </div>
          )}

          <div className="mt-4 flex w-full justify-center gap-4">
            <div>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageSelect}
                ref={fileInputRef}
                className="hidden"
              />
              <Button
                disabled={!!generatedImage}
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
              >
                Upload Your Selfie
              </Button>
            </div>
            <Button
              disabled={!!generatedImage}
              variant="outline"
              onClick={handleUpload}
            >
              Make My Character
            </Button>
          </div>

          <div className="mt-6 flex flex-col items-center gap-2">
            <Button
              onClick={() => setPlayMode(true)}
              // onClick={handleUpload}
              // disabled={(!selectedImage || isUploading) && !selectedPrompt}
              className="w-full"
              // variant={
              //   (!selectedImage || isUploading) && !selectedPrompt
              //     ? "secondary"
              //     : "default"
              // }
            >
              Play
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
