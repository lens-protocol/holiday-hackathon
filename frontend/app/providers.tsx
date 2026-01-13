"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { PropsWithChildren, useEffect, type ReactNode } from "react";
import { WagmiProvider } from "wagmi";
import { config } from "../config";
import { ConnectKitProvider } from "connectkit";
import { lensClient } from "../services/lens-client";
import { farcasterFrame } from "@farcaster/frame-wagmi-connector";
// import { LensProvider } from '../contexts/LensContext';
import FrameSDK from '@farcaster/frame-sdk'
import { connect } from "wagmi/actions";

const queryClient = new QueryClient();

function FarcasterFrameProvider({ children }: PropsWithChildren) {
  useEffect(() => {
    const init = async () => {
      const context = await FrameSDK.context

      // Autoconnect if running in a frame.
      if (context?.client.clientFid) {
        connect(config, { connector: farcasterFrame() })
      }

      // Hide splash screen after UI renders.
      setTimeout(() => {
        FrameSDK.actions.ready()
        console.log("FrameSDK.actions.ready()")
      }, 500)
    }
    init()
  }, [])

  return <>{children}</>
}
export function Providers(props: { children: ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <ConnectKitProvider>
          <FarcasterFrameProvider>
            {/* <LensProvider> */}
            {props.children}
            {/* </LensProvider> */}
          </FarcasterFrameProvider>
        </ConnectKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
