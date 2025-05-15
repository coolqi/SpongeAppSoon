"use client";
import FeatureCard from "./FeatureCard";
import Link from "next/link";
import { nanumPen } from "../fonts";
import Image from "next/image";

export default function HomePage() {
  const features = [
    {
      icon: "🔄",
      title: "Swap",
      description:
        "Exchange tokens quickly and efficiently with our decentralized swap feature.",
      link: "/swap",
    },
    {
      icon: "🏦",
      title: "Vault",
      description:
        "Securely store and manage your digital assets with advanced staking options.",
      link: "/vault",
    },
    {
      icon: <Image width={28} height={28} alt="soon" src="/soon.png" />,
      title: "InterSOON",
      description: "First bridge connecting the TON and Solana ecosystems.",
      link: "https://intersoon.soo.network/",
    },
    {
      icon: <Image width={28} height={28} alt="soon" src="/soon.png" />,
      title: "SOON Bridge",
      description: "Bridge your tokens between Ethereum and SOON",
      link: "https://bridge.testnet.soo.network/home",
    },
  ];

  return (
    <div className="p-8 w-full">
      <div className="max-w-7xl mx-auto">
        <h1 className={`text-2xl font-semibold mb-6 ${nanumPen.className}`}>
          Discover
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((feature, index) => (
            <Link href={feature.link} key={index}>
              <FeatureCard
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
              />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
