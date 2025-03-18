'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { nanumPen } from "@/fonts";

export default function Navbar() {
  const pathname = usePathname();

  const navItems = [
    {
      icon: "🏠",
      label: "Discover",
      href: "/",
    },
    { icon: "🔄", label: "Swap", href: "https://cobaltx.io/swap/" },
    { icon: "🏦", label: "Vault", href: "/vault" },
    { icon: "📊", label: "Portfolio", href: "/portfolio" },
    { icon: "🎁", label: "Referral", href: "/referral" },
  ];

  return (
    <nav className="fixed left-0 top-0 h-screen w-64 bg-yellow-200 dark:bg-[#030711] border-r-4 border-green-400 z-50 transition-all duration-300 transform md:translate-x-0">
      <div className="p-6">
        <div className="flex items-center space-x-2 mb-8">
          <span className="text-3xl animate-bounce">
            <Image width={40} height={48} alt="sponge" src="/sponge.svg" />
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
              href={item.disabled ? "#" : item.href}
              className={`flex items-center space-x-3 px-4 py-3 rounded-xl text-sm transition-all transform hover:scale-105 ${
                pathname === item.href
                  ? "bg-green-400 text-white shadow-lg"
                  : "text-gray-700 dark:text-gray-400 hover:bg-green-100 dark:hover:bg-[#141921]"
              }`}
              {...(item.disabled ? { "aria-disabled": true } : {})}
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
            © 2024 Sponge
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