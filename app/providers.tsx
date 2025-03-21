'use client';

import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react";
import { PhantomWalletAdapter, SolflareWalletAdapter } from "@solana/wallet-adapter-wallets";
import dynamic from "next/dynamic";

const WalletContextProvider = dynamic(
  () => import("./components/ui/walletContextProvider"),
  { ssr: false }
);

const endpoint = process.env.NEXT_PUBLIC_RPC_ENDPOINT || "https://api.devnet.solana.com";
const wallets = [
  new PhantomWalletAdapter(),
  new SolflareWalletAdapter()
];

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletContextProvider>
          {children}
        </WalletContextProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}