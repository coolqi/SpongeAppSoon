import { Connection, Keypair, PublicKey, SystemProgram, Transaction } from "@solana/web3.js";
import { AnchorProvider, Program, web3 } from '@coral-xyz/anchor';

const connection = new Connection('https://api.devnet.solana.com', 'confirmed');
const wallet = Keypair.generate();
export const getSolBalance = async (walletPublicKey: PublicKey) => {
  if (!walletPublicKey) return 0;

  const lamports = await connection.getBalance(walletPublicKey);
  const sol = lamports / 1e9;

  console.log(`Wallet has ${sol} SOL`);
  return sol;
};

export const getMockQuote = (amountSOL: number) => {
  const fakeRate = 1; // mock
  return amountSOL * fakeRate;
};

export const borrow = async (wallet: any, amount: number) => {
}
