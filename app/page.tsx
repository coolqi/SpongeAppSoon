import dynamic from "next/dynamic";
import Script from "next/script";
import { Metadata } from "next";

const Homepage = dynamic(() => import("./components/Home"), { 
  ssr: false
});

export const metadata: Metadata = {
  title: "Sponge",
  description: "Stake SOL, Get Exposure from Bluechips",
  icons: {
    icon: '/favicon.ico',
  },
}

export default function DappInterface() {
  return (
    <>
      <Homepage />
      <Script 
        src="https://terminal.jup.ag/main-v1.js" 
        strategy="afterInteractive"
      />
    </>
  );
}