"use client";

import CharacterPage from "@/components/character";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getUserAvatar } from "@/lib/dynamodb";
import { ConnectKitButton } from "connectkit";
import Link from "next/link";
import { useEffect, useState } from "react";
import { parseEther } from "viem";
import { useAccount, useBalance, useSendTransaction } from "wagmi";

export default function Home() {
  const { address, isConnecting, isConnected } = useAccount();
  const { data: balance, isLoading: isBalanceLoading } = useBalance({
    address,
  });
  const [userAvatar, setUserAvatar] = useState<string | null>(null);
  const { sendTransaction } = useSendTransaction();
  const [isTxSuccess, setIsTxSuccess] = useState(false);

  useEffect(() => {
    const getAvatar = async () => {
      const address = "0x1";
      const res = await getUserAvatar(address as string);
      setUserAvatar(res?.avatarUrl);
      console.log("AVATAR", res);
    };
    getAvatar();
  }, [isConnected, address]);

  const handleInsert = () => {
    sendTransaction(
      {
        to: "0xE609B58cBA66403576458a32e754B49AF17b04F1",
        value: parseEther("0.01"),
      },
      {
        onSuccess: async (hash) => {
          console.log("TX HASH", hash);
          setIsTxSuccess(true);
        },
        onError: (error) => {
          console.error("TX ERROR", error);
        },
      }
    );
  };

  if (isConnecting) {
    return (
      <Card className="w-full max-w-lg">
        <CardContent className="!pt-6 text-center">
          Connecting wallet...
        </CardContent>
      </Card>
    );
  }

  if (!isConnected) {
    return (
      <>
        <Card className="w-full max-w-lg">
          <CardHeader className="text-center">
            <CardTitle>Welcome to Prompt Destroyers</CardTitle>
            <CardDescription>Connect your wallet to begin</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <ConnectKitButton />
          </CardContent>
        </Card>
      </>
    );
  }

  if (isConnected && balance) {
    return !isTxSuccess ? (
      <Card className="w-full max-w-lg text-center">
        <CardHeader>
          <CardTitle>Welcome to Prompt Destroyers</CardTitle>
        </CardHeader>
        <CardContent className="!pt-6">
          <p>Insert $GRASS to play</p>

          {balance?.value <= 0 ? (
            <>
              <p>
                You don't have enough $GRASS, use faucet to add and then refresh
                page.
              </p>
              <Button
                asChild
                variant="default"
                size="lg"
                className="mt-4 w-full"
              >
                <Link target="_blank" href="https://testnet.lenscan.io/faucet">
                  Add $GRASS
                </Link>
              </Button>
            </>
          ) : (
            <Button
              onClick={handleInsert}
              variant="default"
              size="lg"
              className="mt-4 w-full"
            >
              Insert 1 $GRASS
            </Button>
          )}
        </CardContent>
      </Card>
    ) : (
      <CharacterPage />
    );
  }
}

// return (
//   <div className="flex min-h-screen flex-col items-center justify-center bg-primary p-4">
//     <div className="w-90 mb-8">
//       {/* <Image src="/logo.jpg" alt="Prompt Destroyers Logo" width={500} height={500} className="rounded-lg shadow-lg" priority /> */}
//       <video className="rounded-lg shadow-lg" width="500" autoPlay loop>
//         <source src="/assets/videos/initialCardVideo.mp4" type="video/mp4" />
//         Your browser doesn't support this video
//       </video>
//     </div>

//     <div className="w-full max-w-lg">
//       {balance && isConnected ? (
//         <Card className="text-center">
//           <CardHeader>
//             <CardTitle>Welcome to Prompt Destroyers</CardTitle>
//           </CardHeader>
//           <CardContent className="!pt-6">
//             {/* <div className="mb-4 flex w-full justify-center">
//               <img
//                 src={userAvatar}
//                 alt="User Avatar"
//                 className="h-24 w-24 rounded-full"
//               />
//             </div> */}
//             <p>Insert 1 $GRASS to play</p>
//             {/* <p className="font-mono">{`${balance?.value} GRASS`}</p> */}

//             {false ? (
//               <>
//                 <p>
//                   You don't have enough $GRASS, use faucet to add and then
//                   refresh page.
//                 </p>
//                 <Button
//                   asChild
//                   variant="default"
//                   size="lg"
//                   className="mt-4 w-full"
//                 >
//                   <Link
//                     target="_blank"
//                     href="https://testnet.lenscan.io/faucet"
//                   >
//                     Add $GRASS
//                   </Link>
//                 </Button>
//               </>
//             ) : (
//               <Button
//                 onClick={handleInsert}
//                 variant="default"
//                 size="lg"
//                 className="mt-4 w-full"
//               >
//                 Insert 1 $GRASS
//               </Button>
//             )}
//           </CardContent>
//         </Card>
//       ) : (
//         <>
//           {!isConnected ? (
//             <Card>
//               <CardHeader className="text-center">
//                 <CardTitle>Welcome to Prompt Destroyers</CardTitle>
//                 <CardDescription>
//                   Connect your wallet to begin
//                 </CardDescription>
//               </CardHeader>
//               <CardContent className="flex justify-center">
//                 <ConnectKitButton />
//               </CardContent>
//             </Card>
//           ) : (
//             <Card className="flex flex-col items-center gap-6">
//               {/* <CardContent className="w-full rounded-lg bg-black/20 p-4">
//                 {isBalanceLoading ? (
//                   <p className="mt-2 animate-pulse text-gray-300">
//                     Loading balance...
//                   </p>
//                 ) : (
//                   <p className="mt-2 font-mono">
//                     {balance?.formatted} {balance?.symbol}
//                   </p>
//                 )}
//               </CardContent> */}

//               <CardContent className="flex w-full flex-col items-center justify-center gap-4 !pt-6">
//                 <Button
//                   asChild
//                   variant="default"
//                   size="lg"
//                   className="w-full"
//                   // onClick={() => setIsOpenedInsert(true)}
//                 >
//                   <Link href="/profile">Create Your Avatar</Link>
//                 </Button>
//               </CardContent>
//             </Card>
//           )}
//         </>
//       )}
//     </div>
//   </div>
// );
