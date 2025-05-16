"use client";

import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
} from "@solana/wallet-adapter-wallets";
import dynamic from "next/dynamic";
import Script from "next/script";
import { Suspense, useEffect } from "react";
import { Spinner } from "./components/ui/Spinner";
import useNetworkStore from "./store/useNetworkStore";

const WalletContextProvider = dynamic(
  () => import("./components/ui/walletContextProvider"),
  { ssr: false }
);

const SimpleSnackbar = dynamic(() => import("./components/ui/SimpleSnackbar"), {
  ssr: false,
});

const endpoint =
  process.env.NEXT_PUBLIC_RPC_ENDPOINT || "https://api.devnet.solana.com";
const wallets = [new PhantomWalletAdapter(), new SolflareWalletAdapter()];

export default function Providers({ children }: { children: React.ReactNode }) {
  const { setConnected } = useNetworkStore();
  useEffect(() => {
    const handleConnect = () => {
      setConnected(true);
    };
    const handleDisconnect = () => {
      setConnected(false);
    };

    window?.solana?.on("connect", handleConnect);
    window?.solana?.on("disconnect", handleDisconnect);

    return () => {
      window?.solana?.off("connect", handleConnect);
      window?.solana?.off("disconnect", handleDisconnect);
    };
  }, []);
  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletContextProvider>
          <Suspense fallback={<Spinner />}>{children}</Suspense>
          <SimpleSnackbar />
        </WalletContextProvider>
      </WalletProvider>
      <Script
        src="https://terminal.jup.ag/main-v1.js"
        strategy="afterInteractive"
      />
    </ConnectionProvider>
  );
}
