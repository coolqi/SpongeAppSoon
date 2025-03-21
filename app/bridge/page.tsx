'use client';

import { MemeButton } from '../components/ui/MemeButton';
import { useState } from 'react';
import Image from 'next/image';

export default function BridgePage() {
  const [selectedBridge, setSelectedBridge] = useState<'solana' | 'eth' | null>(null);

  return (
    <div className="min-h-screen bg-yellow-50 dark:bg-[#030711] text-black dark:text-white">
      <main className="ml-64 p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-semibold mb-6">Bridge</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Bridge for Solana */}
            <div 
              className={`bg-white dark:bg-[#0A0F1C] rounded-xl p-6 border-4 ${
                selectedBridge === 'solana' ? 'border-purple-400' : 'border-gray-200 dark:border-gray-800'
              } cursor-pointer transition-all hover:transform hover:scale-105`}
              onClick={() => setSelectedBridge('solana')}
            >
              <div className="flex items-center gap-4 mb-4">
                <Image 
                  src="/solana.png"
                  alt="Solana"
                  width={40}
                  height={40}
                  className="rounded-full"
                />
                <h2 className="text-xl font-semibold">Bridge for Solana</h2>
              </div>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Bridge your assets to the Solana network for fast and low-cost transactions.
              </p>
              <a 
                href="https://www.usenexus.org/?origin=solanamainnet&destination=soon" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                <MemeButton 
                  className="w-full bg-purple-400 hover:bg-purple-300 border-purple-600"
                >
                  Bridge to Solana 🌊
                </MemeButton>
              </a>
            </div>

            {/* Bridge from ETH */}
            <div 
              className={`bg-white dark:bg-[#0A0F1C] rounded-xl p-6 border-4 ${
                selectedBridge === 'eth' ? 'border-blue-400' : 'border-gray-200 dark:border-gray-800'
              } cursor-pointer transition-all hover:transform hover:scale-105`}
              onClick={() => setSelectedBridge('eth')}
            >
              <div className="flex items-center gap-4 mb-4">
                <Image 
                  src="https://s2.coinmarketcap.com/static/img/coins/64x64/1027.png"
                  alt="Ethereum"
                  width={40}
                  height={40}
                  className="rounded-full"
                />
                <h2 className="text-xl font-semibold">Bridge from ETH</h2>
              </div>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Transfer your assets from Ethereum network to access cross-chain opportunities.
              </p>
              <a 
                href="https://cometbridge.app/?original=Ethereum&target=Soon%20Mainnet&symbol=ETH" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                <MemeButton 
                  className="w-full bg-blue-400 hover:bg-blue-300 border-blue-600"
                >
                  Bridge from ETH ⚡
                </MemeButton>
              </a>
            </div>
          </div>

          {/* Additional Information */}
          <div className="mt-8 bg-white dark:bg-[#0A0F1C] rounded-xl p-6 border-4 border-yellow-400">
            <h2 className="text-xl font-semibold mb-4">Bridge Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <div className="text-2xl">🔒</div>
                <h3 className="font-medium">Secure</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  All bridge transactions are secured and verified on both chains
                </p>
              </div>
              <div className="space-y-2">
                <div className="text-2xl">⚡</div>
                <h3 className="font-medium">Fast</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Quick processing times for your cross-chain transfers
                </p>
              </div>
              <div className="space-y-2">
                <div className="text-2xl">💰</div>
                <h3 className="font-medium">Low Fees</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Competitive fees for all bridge transactions
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}