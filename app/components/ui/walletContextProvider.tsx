"use client";
import React, { ReactNode, useEffect, useState } from "react";
import { UnifiedWalletProvider, useWallet } from "@jup-ag/wallet-adapter";
import { PhantomWalletAdapter } from "@solana/wallet-adapter-phantom";
import { SolflareWalletAdapter } from "@solana/wallet-adapter-solflare";
import { UnifiedWalletButton } from "@jup-ag/wallet-adapter";
import { NetworkSwitcher } from "../network/NetworkSwitcher";
import axios from "axios";
import "@jup-ag/terminal/css";
import Image from "next/image";

const WalletContextProvider: React.FC<{ children: ReactNode }> = (props: {
  children: ReactNode;
}) => {
  const [ethPrice, setEthPrice] = useState<number | null>(null);

  useEffect(() => {
    const fetchEthPrice = async () => {
      try {
        const response = await axios.get(
          'https://api3.binance.com/api/v3/ticker/price?symbols=["ETHUSDC"]'
        );
        setEthPrice(parseFloat(response.data[0].price));
      } catch (error) {
        console.error("Error fetching ETH price:", error);
      }
    };

    fetchEthPrice();
    const interval = setInterval(fetchEthPrice, 10000); // Update every 10 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <UnifiedWalletProvider
      wallets={[new PhantomWalletAdapter(), new SolflareWalletAdapter()]}
      config={{
        autoConnect: true,
        env: "devnet",
        metadata: {
          name: "UnifiedWallet",
          description: "UnifiedWallet",
          url: "https://jup.ag",
          iconUrls: ["https://jup.ag/favicon.ico"],
        },
        walletlistExplanation: {
          href: "https://station.jup.ag/docs/additional-topics/wallet-list",
        },
        theme: "light",
      }}
    >
      <div className=" relative overflow-hidden">
        <div
          className="absolute inset-0 bg-[url('/bg.svg')] bg-contain
              rotate-[-15deg] scale-150 z-0"
        />

        <div className="absolute inset-0 bg-white opacity-90 z-10" />
        <div className="z-20 relative w-full h-screen">
          <div className="flex justify-end p-6 space-x-4">
            <div className="flex items-center gap-4">
              {/* {ethPrice && (
                <div className="px-4 py-2 rounded-xl border-2 border-yellow-300 dark:border-yellow-600">
                  <div className="flex items-center gap-2">
                    <Image
                      src="https://s2.coinmarketcap.com/static/img/coins/64x64/1027.png"
                      alt="ETH"
                      width={20}
                      height={20}
                      className="rounded-full"
                    />
                    <span className="font-bold">${ethPrice.toFixed(2)}</span>
                  </div>
                </div>
              )} */}
              <NetworkSwitcher />
              <UnifiedWalletButton 
              currentUserClassName="!z-20 !text-sm !bg-[url('/launch.png')] !bg-cover !w-[157px] !h-[55px] !font-sm !flex !items-center !justify-center"
              buttonClassName="!z-20 !text-sm !bg-[url('/launch.png')] !bg-cover !w-[157px] !h-[55px] !font-sm !flex !items-center !justify-center" />
            </div>
          </div>
          {props.children}
        </div>
      </div>
    </UnifiedWalletProvider>
  );
};

export default WalletContextProvider;
