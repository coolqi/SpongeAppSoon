'use client';

import { useEffect, useState } from 'react';
import { useWallet, useAnchorWallet } from "@solana/wallet-adapter-react";

export default function ReferralPage() {
  const wallet = useAnchorWallet();
  const [referralLink, setReferralLink] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (wallet?.publicKey) {
      setReferralLink(`https://app.sponge.network?ref=${wallet.publicKey.toString()}`);
    }
  }, [wallet]);

  const handleCopyReferral = async () => {
    try {
      await navigator.clipboard.writeText(referralLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="h-full flex flex-col justify-center mt-[-80px] text-black dark:text-white">
      <main className="w-full p-8">
        <div className="max-w-5xl mx-auto">
          {/* <h1 className="text-2xl font-semibold mb-6">Referral Program</h1> */}
          <div className="bg-green-light dark:bg-[#0A0F1C] rounded-xl p-6 border-4 border-black">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Earn More with Referrals 🎁</h2>
              <div className="px-4 py-2 bg-green-light border-2 border-black dark:bg-[#1A1F2E] rounded-lg">
                <span className="text-sm bg-green-light dark:text-purple-400">Earn extra 10% of referral earnings</span>
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="p-6 bg-green-light dark:bg-[#1A1F2E] rounded-xl border-2 border-black dark:border-yellow-600">
                <p className="text-sm dark:text-gray-400 mb-4">Your Referral Link</p>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={wallet ? referralLink : "Connect wallet to get your referral link"}
                    className="flex-1 bg-green-dark dark:bg-[#0A0F1C] border-2 border-black dark:border-yellow-600 rounded-lg px-4 py-3 text-sm"
                  />
                  <button
                    onClick={handleCopyReferral}
                    disabled={!wallet}
                    className="px-6 py-3 bg-yellow-light text-black rounded-lg hover:bg-yellow-dark disabled:opacity-50 disabled:cursor-not-allowed border-2 border-black transition-all"
                  >
                    {copied ? "Copied! ✓" : "Copy 📋"}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-6 bg-purple-100 dark:bg-[#1A1F2E] rounded-xl">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Total Referrals</p>
                  <p className="text-3xl font-bold text-purple-600">0</p>
                </div>
                <div className="p-6 bg-green-100 dark:bg-[#1A1F2E] rounded-xl">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Total Points Earned</p>
                  <p className="text-3xl font-bold text-green-600">0</p>
                </div>
                <div className="p-6 bg-blue-100 dark:bg-[#1A1F2E] rounded-xl">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Active Referrals</p>
                  <p className="text-3xl font-bold text-blue-600">0</p>
                </div>
              </div>

              <div className="bg-green-light dark:bg-[#1A1F2E] rounded-xl p-6 border-2 border-black dark:border-gray-800">
                <h3 className="text-lg font-semibold mb-4">How it Works</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <div className="text-2xl">1️⃣</div>
                    <h4 className="font-medium">Share Your Link</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Share your unique referral link with friends</p>
                  </div>
                  <div className="space-y-2">
                    <div className="text-2xl">2️⃣</div>
                    <h4 className="font-medium">Friends Join</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">When they join and stake using your link</p>
                  </div>
                  <div className="space-y-2">
                    <div className="text-2xl">3️⃣</div>
                    <h4 className="font-medium">Earn Points</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Get 10% of their earnings as points</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}