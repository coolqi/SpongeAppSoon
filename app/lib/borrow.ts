import * as anchor from "@coral-xyz/anchor";
import {
  Connection,
  PublicKey,
  SystemProgram,
  TransactionConfirmationStrategy,
  RpcResponseAndContext,
  SignatureResult,
  Commitment,
} from "@solana/web3.js";
import { Idl, web3 } from "@coral-xyz/anchor";
import fallIdl from "./cash.json";
import BN from "bn.js";
import {
  AUTHORITY_SEED,
  LENDING_TOKEN_SEED,
  CASH_TOKEN_SEED,
} from "./constants";
import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  getAssociatedTokenAddressSync,
  TOKEN_PROGRAM_ID,
} from "./splToken";
import { handleError } from "./utils/error";

export const getSolBalance = async (
  connection: Connection,
  walletPublicKey: PublicKey
) => {
  if (!walletPublicKey) return 0;

  const lamports = await connection.getBalance(walletPublicKey);
  const sol = lamports / 1e9;

  return sol;
};

export const getMockQuote = (amountSOL: number) => {
  const fakeRate = Math.pow(10, 9);
  return amountSOL * fakeRate;
};

export const getInputBalance = (balance: number) => {
  return balance / Math.pow(10, 9);
};

export const borrow = async (
  wallet: any,
  connection: Connection,
  poolPda: PublicKey,
  borrowAmount: number
) => {
  try {
    // Create a new connection with shorter timeout
    const newConnection = new Connection(connection.rpcEndpoint, {
      commitment: "confirmed",
      confirmTransactionInitialTimeout: 10000, // 10 seconds
    });

    const provider = new anchor.AnchorProvider(newConnection, wallet, {
      preflightCommitment: "confirmed",
      commitment: "confirmed",
      skipPreflight: false,
      maxRetries: 5,
    });

    const program = new anchor.Program(fallIdl as any as Idl, provider) as any;

    const pool = await program.account.pool.fetch(poolPda);
    const mintA = pool.mintA;

    const [poolAuthority] = PublicKey.findProgramAddressSync(
      [pool.amm.toBuffer(), mintA.toBuffer(), Buffer.from(AUTHORITY_SEED)],
      program.programId
    );

    const poolAccountA = getAssociatedTokenAddressSync(
      mintA,
      poolAuthority,
      true
    );

    const [lendingReceiptTokenMint] = PublicKey.findProgramAddressSync(
      [pool.amm.toBuffer(), mintA.toBuffer(), Buffer.from(LENDING_TOKEN_SEED)],
      program.programId
    );

    const [cashTokenMint] = PublicKey.findProgramAddressSync(
      [pool.amm.toBuffer(), mintA.toBuffer(), Buffer.from(CASH_TOKEN_SEED)],
      program.programId
    );

    const lenderTokenA = await anchor.utils.token.associatedAddress({
      mint: mintA,
      owner: provider.wallet.publicKey,
    });

    const [lenderAuthority] = PublicKey.findProgramAddressSync(
      [
        poolPda.toBuffer(),
        provider.wallet.publicKey.toBuffer(),
        Buffer.from(AUTHORITY_SEED),
      ],
      program.programId
    );

    const lenderLendReceiptToken = await anchor.utils.token.associatedAddress({
      mint: lendingReceiptTokenMint,
      owner: lenderAuthority,
    });

    const lenderCashToken = await anchor.utils.token.associatedAddress({
      mint: cashTokenMint,
      owner: provider.wallet.publicKey,
    });

    let txSignature: string;
    try {
      txSignature = await program.methods
        .lend(new BN(borrowAmount))
        .accounts({
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
        })
        .rpc();
    } catch (error: any) {
      txSignature = await handleError(error, provider) ?? '';
    }

    return {
      tx: txSignature,
      accounts: {
        poolAuthority,
        lendingReceiptTokenMint,
        cashTokenMint,
        lenderTokenA,
        lenderLendReceiptToken,
        lenderCashToken,
      },
    };
  } catch (error) {
    console.error("Error in lend:", error);
    if (error instanceof Error) {
      console.error("Error details:", {
        message: error.message,
        stack: error.stack,
      });
    }
    throw error;
  }
};

export async function redeem(
  wallet: any,
  connection: Connection,
  poolPda: PublicKey
) {
  try {
    // Create a new connection with shorter timeout
    const newConnection = new Connection(connection.rpcEndpoint, {
      commitment: "confirmed",
      confirmTransactionInitialTimeout: 10000, // 10 seconds
    });

    const provider = new anchor.AnchorProvider(newConnection, wallet, {
      preflightCommitment: "confirmed",
      commitment: "confirmed",
      skipPreflight: false,
      maxRetries: 5,
    });

    const program = new anchor.Program(fallIdl as any as Idl, provider) as any;

    const pool = await program.account.pool.fetch(poolPda);
    const mintA = pool.mintA;

    const [poolAuthority] = PublicKey.findProgramAddressSync(
      [pool.amm.toBuffer(), mintA.toBuffer(), Buffer.from(AUTHORITY_SEED)],
      program.programId
    );

    const poolAccountA = getAssociatedTokenAddressSync(
      mintA,
      poolAuthority,
      true
    );

    const [lendingReceiptTokenMint] = PublicKey.findProgramAddressSync(
      [pool.amm.toBuffer(), mintA.toBuffer(), Buffer.from(LENDING_TOKEN_SEED)],
      program.programId
    );

    const [cashTokenMint] = PublicKey.findProgramAddressSync(
      [pool.amm.toBuffer(), mintA.toBuffer(), Buffer.from(CASH_TOKEN_SEED)],
      program.programId
    );

    const lenderTokenA = await anchor.utils.token.associatedAddress({
      mint: mintA,
      owner: provider.wallet.publicKey,
    });

    const [lenderAuthority] = PublicKey.findProgramAddressSync(
      [
        poolPda.toBuffer(),
        provider.wallet.publicKey.toBuffer(),
        Buffer.from(AUTHORITY_SEED),
      ],
      program.programId
    );

    const lenderLendReceiptToken = await anchor.utils.token.associatedAddress({
      mint: lendingReceiptTokenMint,
      owner: lenderAuthority,
    });

    const lenderCashToken = await anchor.utils.token.associatedAddress({
      mint: cashTokenMint,
      owner: provider.wallet.publicKey,
    });

    let txSignature: string;
    try {
      txSignature = await program.methods
        .redeem()
        .accounts({
          pool: poolPda,
          poolAuthority: poolAuthority,
          mintA: mintA,
          poolAccountA: poolAccountA,
          lendingReceiptTokenMint: lendingReceiptTokenMint,
          lender: provider.wallet.publicKey,
          lenderTokenA: lenderTokenA,
          lenderAuthority: lenderAuthority,
          lenderLendReceiptToken: lenderLendReceiptToken,
          cashTokenMint: cashTokenMint,
          lenderCashToken: lenderCashToken,
          payer: provider.wallet.publicKey,
          tokenProgram: TOKEN_PROGRAM_ID,
          associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
          systemProgram: SystemProgram.programId,
        })
        .rpc();
    } catch (error: any) {
      txSignature = await handleError(error, provider) ?? '';
    }

    return {
      tx: txSignature,
      accounts: {
        poolAuthority,
        lendingReceiptTokenMint,
        cashTokenMint,
        lenderTokenA,
        lenderLendReceiptToken,
        lenderCashToken,
      },
    };
  } catch (error) {
    console.error("Error in redeem:", error);
    if (error instanceof Error) {
      console.error("Error details:", {
        message: error.message,
        stack: error.stack,
      });
    }
    throw error;
  }
}
