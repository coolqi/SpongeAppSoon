import { create } from 'zustand';
import { PublicKey } from '@solana/web3.js';
import { SOL_MINT, ETH_MINT } from '@/core/setting';

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
    symbol: 'SOL',
    mint: SOL_MINT.toBase58(),
    decimals: 6,
    isNative: false
  },
  {
    symbol: 'ETH',
    mint: ETH_MINT.toBase58(),
    decimals: 9,
    isNative: true
  }
];

const useTokenStore = create<TokenState>((set, get) => ({
  supportedTokens: initialSupportedTokens,
  selectedToken: initialSupportedTokens[0], // Default to first token
  balance: 0,
  stakedAmount: 0,
  
  setSelectedToken: (token) => set({ selectedToken: token }),
  setBalance: (balance) => set({ balance }),
  setStakedAmount: (stakedAmount) => set({ stakedAmount }),
  
  getTokenMint: (symbol) => {
    switch (symbol) {
      case 'SOL':
        return SOL_MINT;
      case 'ETH':
        return ETH_MINT;
      default:
        const tokenInfo = get().supportedTokens.find(t => t.symbol === symbol);
        return tokenInfo ? new PublicKey(tokenInfo.mint) : SOL_MINT;
    }
  }
}));

export default useTokenStore; 