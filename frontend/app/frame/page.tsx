import Farcaster from "@/components/farcaster";
import dynamic from "next/dynamic";
import Link from "next/link";

const appUrl = process.env.NEXT_PUBLIC_URL || "https://agent-arena.xyz";

export const metadata = {
  title: 'AI Agent Arena',
  description: 'AI Agent Arena Game',
  url: `${appUrl}/frame`,
  icons: [`${appUrl}/logo.png`],
  other: {
    'fc:frame': JSON.stringify({
      version: "next",
      imageUrl: `${appUrl}/images/1200x630_Rich_Link_Preview_Image.png`,
      button: {
        title: "Play Now",
        action: {
          type: "launch_frame",
          name: "AI Agent Arena",
          url: `${appUrl}/frame`,
          splashImageUrl: `${appUrl}/logo.png`,
          splashBackgroundColor: "#131313"
        }
      }
    })
  }
}

// const Farcaster = dynamic(() => import("@/components/farcaster"), {
//   ssr: false,
// });

export default function Frame() {
  return <div>
    <Farcaster />
    {/* <div className="flex justify-center items-center h-screen text-neon-blue hover:text-neon-pink">
      <Link href="/farcaster/agentarena-1-agent" className="px-4 py-2 rounded-lg border text-neon-blue hover:text-neon-pink border-neon-blue">
        Enter
      </Link>
    </div> */}
  </div>
}
