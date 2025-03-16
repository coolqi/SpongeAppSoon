"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import spongeIcon from "@/assets/image/sponge.svg";
import { nanumPen } from "@/fonts";

export default function Navbar() {
  const pathname = usePathname();

  const navItems = [
    {
      icon: <Image width={20} height={28} alt="sponge" src={spongeIcon} />,
      label: "Discover",
      href: "/",
    },
    { icon: "🔄", label: "Swap (Solana Mainnet-beta)", href: "/swap" },
    { icon: "🏦", label: "Sponge Vault", href: "/vault" },
    {
      icon: "📊",
      label: "Portfolio (Coming Soon)",
      href: "/portfolio",
      disabled: true,
    },
    {
      icon: "🎯",
      label: "Strategy (Coming Soon)",
      href: "/strategy",
      disabled: true,
    },
    {
      icon: "📈",
      label: "Dashboard (Coming Soon)",
      href: "/dashboard",
      disabled: true,
    },
    { icon: "🌐", label: "DeFi (Coming Soon)", href: "/defi", disabled: true },
    {
      icon: "👥",
      label: "Referral (Coming Soon)",
      href: "/referral",
      disabled: true,
    },
    // {
    //   icon: "⚖️",
    //   label: "Governance (Coming Soon)",
    //   href: "/governance",
    //   disabled: true,
    // },
    // { icon: "📄", label: "Docs (Coming Soon)", href: "/docs", disabled: true },
  ];

  return (
    <nav className="fixed left-0 top-0 h-screen w-64 bg-yellow-200 dark:bg-[#030711] border-r-4 border-green-400">
      <div className="p-6">
        <div className="flex items-center space-x-2 mb-8">
          <span className="text-3xl animate-bounce">
            <Image width={40} height={48} alt="sponge" src={spongeIcon} />
          </span>
          <h1
            className={`text-4xl font-bold text-black dark:text-white ${nanumPen.className}`}
          >
            Sponge
          </h1>
        </div>

        <div className="space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.disabled ? "#" : item.href} // Use '#' if disabled
              className={`flex items-center space-x-3 px-4 py-3 rounded-xl text-sm transition-all transform hover:scale-105 ${
                pathname === item.href
                  ? "bg-green-400 text-white shadow-lg"
                  : "text-gray-700 dark:text-gray-400 hover:bg-green-100 dark:hover:bg-[#141921]"
              }`}
              {...(item.disabled ? { "aria-disabled": true } : {})} // Add aria-disabled if disabled
            >
              <span className="text-xl">{item.icon}</span>
              <span className="font-medium">{item.label}</span>
            </Link>
          ))}
        </div>
      </div>
      <div className="fixed left-0 w-64 bottom-0 p-6">
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            © 2025 Sponge
          </p>
          <a
            href="https://x.com/spongedotsol"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors"
          >
            <svg
              viewBox="0 0 24 24"
              width="20"
              height="20"
              fill="currentColor"
              className="transform hover:scale-110 transition-transform"
            >
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
          </a>
        </div>
      </div>
    </nav>
  );
}
