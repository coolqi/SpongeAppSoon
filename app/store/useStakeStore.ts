import { create } from 'zustand';
import { PublicKey } from '@solana/web3.js';
import { CASH_MINT, USDC_MINT } from '@/core/setting';

export interface TokenInfo {
  symbol: string;
  mint: string;
  decimals: number;
  isNative: boolean;
}

interface TokenState {

  // Available tokens in the application
  supportedTokens: TokenInfo[];
  
  // Currently selected token
  selectedToken: TokenInfo;
  
  // User balances
  balance: number;
  stakedAmount: number;
  
  // Actions
  setSelectedToken: (token: TokenInfo) => void;
  setBalance: (balance: number) => void;
  setStakedAmount: (amount: number) => void;
  getTokenMint: (symbol: string) => PublicKey;
}

// Define initial supported tokens
const initialSupportedTokens: TokenInfo[] = [
  {
    symbol: 'mvmUSD',
    mint: CASH_MINT.toBase58(),
    decimals: 6,
    isNative: false
  },
  {
    symbol: 'USD*',
    mint: USDC_MINT.toBase58(),
    decimals: 6,
    isNative: false
  }
];

const useStakeStore = create<TokenState>((set, get) => ({
  supportedTokens: initialSupportedTokens,
  selectedToken: initialSupportedTokens[0], // Default to first token
  balance: 0,
  stakedAmount: 0,
  
  setSelectedToken: (token) => set({ selectedToken: token }),
  setBalance: (balance) => set({ balance }),
  setStakedAmount: (stakedAmount) => set({ stakedAmount }),
  
  getTokenMint: (symbol) => {
    switch (symbol) {
      case 'mvmUSD':
        return CASH_MINT;
      case 'USD*':
        return USDC_MINT;
      default:
        const tokenInfo = get().supportedTokens.find(t => t.symbol === symbol);
        return tokenInfo ? new PublicKey(tokenInfo.mint) : CASH_MINT;
    }
  }
}));

export default useStakeStore; 