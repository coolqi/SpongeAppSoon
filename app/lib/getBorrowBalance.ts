import * as anchor from '@coral-xyz/anchor';
import { Connection, Keypair, PublicKey, SystemProgram, Transaction } from "@solana/web3.js";
import { AnchorProvider, Program, web3 } from '@coral-xyz/anchor';
import { Idl } from '@coral-xyz/anchor';
import fallIdl from './cash.json';
import BN from 'bn.js';
import { AUTHORITY_SEED, LENDING_TOKEN_SEED, CASH_TOKEN_SEED } from './constants';
import { TOKEN_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID, getAssociatedTokenAddressSync } from '@solana/spl-token';


const connection = new Connection('https://api.devnet.solana.com', 'confirmed');
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

export const borrow = async (
  wallet: any,
  connection: Connection,
  poolPda: PublicKey,
  borrowAmount: number
) => {
  try {
    console.log('Executing lend...');
    const provider = new anchor.AnchorProvider(
      connection,
      wallet,
      { preflightCommitment: "confirmed" }
    );

    const program = new anchor.Program(
      (fallIdl as any) as Idl,
      provider
    ) as any;

    const pool = await program.account.pool.fetch(poolPda);
    const mintA = pool.mintA;
    console.log('mintA',mintA.toString());
    console.log('pool.amm', pool.amm.toString());

    const [poolAuthority] = PublicKey.findProgramAddressSync(
      [
        pool.amm.toBuffer(),
        mintA.toBuffer(),
        Buffer.from(AUTHORITY_SEED)
      ],
      program.programId
    );

    const poolAccountA = getAssociatedTokenAddressSync(
      mintA,
      poolAuthority,
      true
    );

    const [lendingReceiptTokenMint] = PublicKey.findProgramAddressSync(
      [
        pool.amm.toBuffer(),
        mintA.toBuffer(),
        Buffer.from(LENDING_TOKEN_SEED)
      ],
      program.programId
    );

    const [cashTokenMint] = PublicKey.findProgramAddressSync(
      [
        pool.amm.toBuffer(),
        mintA.toBuffer(),
        Buffer.from(CASH_TOKEN_SEED)
      ],
      program.programId
    );

    const lenderTokenA = await anchor.utils.token.associatedAddress({
      mint: mintA,
      owner: provider.wallet.publicKey
    });

    const [lenderAuthority] = PublicKey.findProgramAddressSync(
      [
        poolPda.toBuffer(),
        provider.wallet.publicKey.toBuffer(),
        Buffer.from(AUTHORITY_SEED)
      ],
      program.programId
    );

    const lenderLendReceiptToken = await anchor.utils.token.associatedAddress({
      mint:lendingReceiptTokenMint,
      owner:lenderAuthority,
    });
    
    const lenderCashToken = await anchor.utils.token.associatedAddress({
      mint: cashTokenMint,
      owner: provider.wallet.publicKey,
    });

    const tx = await program.methods.lend(new BN(borrowAmount)).accounts({
        pool: poolPda,
        poolAuthority: poolAuthority,
        poolAccountA: poolAccountA,
        lendingReceiptTokenMint: lendingReceiptTokenMint,
        cashTokenMint: cashTokenMint,
        lender: provider.wallet.publicKey,
        lenderTokenA: lenderTokenA,
        lenderAuthority: lenderAuthority,
        lenderLendReceiptToken: lenderLendReceiptToken,
        lenderCashToken: lenderCashToken,
        payer: provider.wallet.publicKey,
        tokenProgram: TOKEN_PROGRAM_ID,
        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
        systemProgram: SystemProgram.programId,
      }).rpc();

    return {
      tx,
      accounts: {
        poolAuthority,
        lendingReceiptTokenMint,
        cashTokenMint,
        lenderTokenA,
        lenderLendReceiptToken,
        lenderCashToken,
      }
    };
  } catch (error) {
    console.error('Error in lend:', error);
    if (error instanceof Error) {
      console.error('Error details:', {
        message: error.message,
        stack: error.stack,
      });
    }
    throw error;
  }  
}
