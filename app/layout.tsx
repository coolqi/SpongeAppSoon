import "./globals.css";
import { Metadata } from "next";
import { Inter } from "next/font/google";
import Navbar from "./components/Navbar";
import { ThemeProvider } from "./components/ThemeProvider";
import dynamic from "next/dynamic";

const Providers = dynamic(() => import("./providers"), { ssr: false });

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Sponge",
  description: "Stake SOL, Get Exposure from Bluechips",
  icons: {
    icon: "/sponge.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <Providers>
            <div className="min-h-screen bg-yellow-50 dark:bg-[#030711] flex">
              <Navbar />
              <div className="flex-1">
                {children}
              </div>
            </div>
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  );
}