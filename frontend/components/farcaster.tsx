'use client'

import { useEffect, useState } from "react";
import sdk, { type FrameContext } from "@farcaster/frame-sdk";
import Game from "./Game";
import GameControls from "./GameControls";
import Link from "next/link";

export default function Farcaster() {
  const [isSDKLoaded, setIsSDKLoaded] = useState(false);
  const [context, setContext] = useState<FrameContext>();
  const [mapPosition, setMapPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const load = async () => {
      const context = await sdk.context;
      setContext(context);
      sdk.actions.ready({});
    };

    if (sdk && !isSDKLoaded) {
      setIsSDKLoaded(true);
      load();
      return () => {
        sdk.removeAllListeners();
      };
    }
  }, [isSDKLoaded]);

  const handleMove = (direction: string) => {
    const moveAmount = 100; // Pixels to move per click
    
    switch(direction) {
      case 'left':
        setMapPosition(prev => ({ ...prev, x: prev.x + moveAmount }));
        break;
      case 'right':
        setMapPosition(prev => ({ ...prev, x: prev.x - moveAmount }));
        break;
      case 'up':
        setMapPosition(prev => ({ ...prev, y: prev.y + moveAmount }));
        break;
      case 'down':
        setMapPosition(prev => ({ ...prev, y: prev.y - moveAmount }));
        break;
    }
  };

  if (!isSDKLoaded) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{ 
      paddingTop: context?.client.safeAreaInsets?.top ?? 0,
      paddingBottom: context?.client.safeAreaInsets?.bottom ?? 0,
      paddingLeft: context?.client.safeAreaInsets?.left ?? 0,
      paddingRight: context?.client.safeAreaInsets?.right ?? 0,
      position: 'relative',
      width: '100vw',
      height: '100vh',
      overflow: 'hidden'
    }}>
      <div className="absolute top-0 right-0 left-0 z-50 p-4 text-center border-b bg-black/80 border-neon-pink">
        <Link href="/faucet" className="transition-colors text-neon-blue hover:text-neon-pink">
          Need tokens to play? Click here to get some from our faucet! →
        </Link>
      </div>
      <Game farcaster={true} mapPosition={mapPosition}/>
      <GameControls onMove={handleMove} />
    </div>
  );
}
