import * as anchor from "@coral-xyz/anchor";
import { Connection, PublicKey, SystemProgram } from "@solana/web3.js";
import {
  TOKEN_PROGRAM_ID,
  ASSOCIATED_TOKEN_PROGRAM_ID,
  getAssociatedTokenAddressSync,
  getAccount,
} from "./splToken";
import { BN } from "bn.js";
import fallIdl from "./utils/swap.json";
import { AUTHORITY_SEED } from "./constants";
import { Idl } from "@coral-xyz/anchor";
import tokenList from "./utils/token.json";

import { PoolInfo } from "./getPoolList";

export const getSwapBalance = async (
  connection: Connection,
  walletPublicKey: PublicKey,
  symbol: string
) => {
  if (!walletPublicKey) return 0;

  const findMintBySymbol = (symbol: string) => {
    const token = tokenList.tokens.find(
      (t) => t.symbol === symbol.toUpperCase()
    );
    return token?.address;
  };

  const mint = findMintBySymbol(symbol.toLowerCase());
  if (!mint) {
    return 0;
  }
  const usdcAta = getAssociatedTokenAddressSync(
    new PublicKey(mint),
    walletPublicKey
  );
  const accountInfo = await getAccount(connection, usdcAta);
  const balance = Number(accountInfo.amount) / 10 ** 6;
  return balance;
};

export async function swap(
  wallet: any,
  connection: Connection,
  pool: PublicKey,
  amm: PublicKey,
  mintA: PublicKey,
  mintB: PublicKey,
  swapAtoB: boolean,
  inputAmount: number,
  minOutputAmount: number
) {
  try {
    const provider = new anchor.AnchorProvider(connection, wallet, {
      preflightCommitment: "confirmed",
    });

    const program = new anchor.Program(fallIdl as any as Idl, provider) as any;

    const [poolAuthority] = PublicKey.findProgramAddressSync(
      [
        amm.toBuffer(),
        mintA.toBuffer(),
        mintB.toBuffer(),
        Buffer.from(AUTHORITY_SEED),
      ],
      program.programId
    );

    const poolAccountA = await getAssociatedTokenAddressSync(
      mintA,
      poolAuthority,
      true
    );

    const poolAccountB = await getAssociatedTokenAddressSync(
      mintB,
      poolAuthority,
      true
    );

    const traderAccountA = await getAssociatedTokenAddressSync(
      mintA,
      wallet.publicKey,
      true
    );

    const traderAccountB = await getAssociatedTokenAddressSync(
      mintB,
      wallet.publicKey,
      true
    );

    const inputAmountBN = new BN(Math.floor(inputAmount));
    const minOutputAmountBN = new BN(Math.floor(minOutputAmount));
    let txSignature: string;

    try {
      txSignature = await program.methods
        .swapExactTokensForTokens(swapAtoB, inputAmountBN, minOutputAmountBN)
        .accounts({
          amm,
          pool,
          poolAuthority,
          trader: wallet.publicKey,
          mintA,
          mintB,
          poolAccountA,
          poolAccountB,
          traderAccountA,
          traderAccountB,
          payer: wallet.publicKey,
          tokenProgram: TOKEN_PROGRAM_ID,
          associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
          systemProgram: SystemProgram.programId,
        })
        .rpc();
    } catch (error: any) {
      // Check if the error is about duplicate transaction
      if (error.message?.includes("already been processed")) {
        // If we have a valid signature in the error, use it
        if (
          error.signature &&
          typeof error.signature === "string" &&
          error.signature.length > 0
        ) {
          try {
            const status = await provider.connection.getSignatureStatus(
              error.signature
            );
            if (status?.value?.confirmationStatus === "confirmed") {
              txSignature = error.signature;
            } else {
              throw error;
            }
          } catch (statusError) {
            // If we can't get the status, just use the signature
            txSignature = error.signature;
          }
        } else {
          if (!error.signature) {
            return;
          }
          throw error;
        }
      }
      // Ignore timeout errors
      else if (error.message?.includes("Transaction was not confirmed")) {
        if (
          error.signature &&
          typeof error.signature === "string" &&
          error.signature.length > 0
        ) {
          txSignature = error.signature;
        } else {
          throw error;
        }
      } else {
        throw error;
      }
    }

    return txSignature;
  } catch (error) {
    throw error;
  }
}
export interface PoolStatusInfo {
  createPool1: boolean;
  createPool2: boolean;
  initLendingPool1: boolean;
  initLendingPool2: boolean;
  initLendingPool3: boolean;
}

export type PoolDetailInfo = {
  poolStatus: PoolStatusInfo;
  poolInfo: PoolInfo;
  lendingPoolInfo: {
    tokenAAmount: number;
    tokenBAmount: number;
    addresses: {
      lendingReceipt: string;
      borrowReceipt: string;
      collateralReceipt: string;
    };
    lendingReceiptSupply: number;
    borrowReceiptSupply: number;
    collateralReceiptSupply: number;
  };
  userAssets: {
    tokenAAmount: string;
    tokenBAmount: string;
    liquidityAmount: string;
    lendingReceiptAmount: string;
    borrowReceiptAmount: string;
    collateralReceiptAmount: string;
  };
};
