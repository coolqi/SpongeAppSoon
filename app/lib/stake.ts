import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  getAccount,
  getAssociatedTokenAddress,
  TOKEN_PROGRAM_ID,
} from "@solana/spl-token";
import {
  AUTHORITY_SEED,
  LENDING_TOKEN_SEED,
  SCASH_TOKEN_SEED,
} from "./constants";
import { PoolInfo } from "./getPoolList";
import * as anchor from "@coral-xyz/anchor";
import { Connection, PublicKey, SystemProgram } from "@solana/web3.js";
import fallIdl from "./cash.json";
import { CASH_TOKEN_SEED } from "./constants";
import { BN, Idl } from "@coral-xyz/anchor";
import { AnchorWallet } from "@solana/wallet-adapter-react";

export interface PoolStatusInfo {
  createPool1: boolean;
}

export type PoolDetailInfo = {
  poolStatus: PoolStatusInfo;
  poolInfo: PoolInfo;
  userAssets: {
    tokenAAmount: string;
    lendingReceiptAmount: string;
    cashAmount: string;
    userSCashAmount: string;
  };
};

export async function getPoolDetail(
  wallet: AnchorWallet,
  connection: Connection,
  poolPk: PublicKey,
  walletPublicKey: PublicKey
): Promise<PoolDetailInfo> {
  try {
    const provider = new anchor.AnchorProvider(connection, wallet, {
      commitment: "confirmed",
      preflightCommitment: "confirmed",
    });
    const program = new anchor.Program(fallIdl as any as Idl, provider) as any;

    const pool = await program.account.pool.fetch(poolPk);
    let amm: any;
    try {
      amm = await program.account.amm.fetch(pool.amm);
    } catch (e) {
      console.log("amm err", e);
    }

    const mintA = new PublicKey(pool.mintA);

    const [lenderAuthority] = PublicKey.findProgramAddressSync(
      [
        poolPk.toBuffer(),
        provider.wallet.publicKey.toBuffer(),
        Buffer.from(AUTHORITY_SEED),
      ],
      program.programId
    );
    const [poolAuthority] = PublicKey.findProgramAddressSync(
      [pool.amm.toBuffer(), mintA.toBuffer(), Buffer.from(AUTHORITY_SEED)],
      program.programId
    );
    const [lendingReceiptTokenMint] = PublicKey.findProgramAddressSync(
      [pool.amm.toBuffer(), mintA.toBuffer(), Buffer.from(LENDING_TOKEN_SEED)],
      program.programId
    );
    const [cashTokenMint] = PublicKey.findProgramAddressSync(
      [pool.amm.toBuffer(), mintA.toBuffer(), Buffer.from(CASH_TOKEN_SEED)],
      program.programId
    );
    const [sCashTokenMint] = PublicKey.findProgramAddressSync(
      [
        pool.amm.toBuffer(),
        pool.mintA.toBuffer(),
        Buffer.from(SCASH_TOKEN_SEED),
      ],
      program.programId
    );
    const [
      createPool1,
      userSCashAmount,
      userCashAmount,
      poolAccountAInfo,
      userTokenAAccount,
      userLendingReceiptAmount,
    ] = await Promise.all([
      accountExists(connection, poolPk).catch(() => false),
      getUserTokenAmount(connection, walletPublicKey, sCashTokenMint).catch(
        () => 0
      ),
      getUserTokenAmount(connection, walletPublicKey, cashTokenMint).catch(
        () => 0
      ),
      // getUserTokenAmount(connection, poolAuthority, cashTokenMint).catch(() => 0),
      getUserTokenAmount(connection, poolAuthority, pool.mintA).catch(() => 0),
      getUserTokenAmount(connection, walletPublicKey, mintA).catch(() => 0),
      getUserTokenAmount(
        connection,
        lenderAuthority,
        lendingReceiptTokenMint
      ).catch(() => 0),
    ]);
    return {
      poolStatus: {
        createPool1,
      },
      poolInfo: {
        poolPk: poolPk,
        amm: pool.amm,
        admin: amm.admin,
        mintA: mintA,
        tokenASymbol:
          mintA.toString() === "So11111111111111111111111111111111111111112"
            ? "SOL"
            : "USDT",
        tokenAIcon: null as any,
        tokenAAmount: Number(poolAccountAInfo),
      },
      userAssets: {
        tokenAAmount: userTokenAAccount.toString(),
        lendingReceiptAmount: userLendingReceiptAmount.toString(),
        cashAmount: userCashAmount.toString(),
        userSCashAmount: userSCashAmount.toString(),
      },
    };
  } catch (error) {
    console.error("Error getting lending pool details:", error);
    return {
      poolStatus: {
        createPool1: false,
      },
      poolInfo: {
        poolPk: new PublicKey(poolPk),
        amm: new PublicKey(""),
        admin: new PublicKey(""),
        mintA: new PublicKey(""),
        tokenAAmount: 0,
      },
      userAssets: {
        tokenAAmount: "0",
        lendingReceiptAmount: "0",
        cashAmount: "0",
        userSCashAmount: '0'
      },
    };
  }
}

async function getUserTokenAmount(
  connection: Connection,
  walletPublicKey: PublicKey,
  tokenMint: PublicKey
): Promise<number> {
  try {
    const userToken = await getAssociatedTokenAddress(
      tokenMint,
      walletPublicKey,
      true
    );
    const userTokenAccount = await getAccount(connection as any, userToken);
    return Number(userTokenAccount.amount);
  } catch (e) {
    console.log("getUserTokenAmount err", e);
    return 0;
  }
}

async function accountExists(
  connection: Connection,
  publicKey: PublicKey
): Promise<boolean> {
  const account = await connection.getAccountInfo(publicKey);
  return account !== null;
}

export async function redeemCash(
  wallet: any,
  connection: Connection,
  poolPda: PublicKey,
  amount: number
) {
  try {
    const provider = new anchor.AnchorProvider(connection, wallet, {
      preflightCommitment: "confirmed",
    });

    const program = new anchor.Program(fallIdl as any as Idl, provider) as any;

    const cashPool = await program.account.pool.fetch(poolPda);

    const [poolAuthority] = PublicKey.findProgramAddressSync(
      [
        cashPool.amm.toBuffer(),
        cashPool.mintA.toBuffer(),
        Buffer.from(AUTHORITY_SEED),
      ],
      program.programId
    );
    const [sCashTokenMint] = PublicKey.findProgramAddressSync(
      [
        cashPool.amm.toBuffer(),
        cashPool.mintA.toBuffer(),
        Buffer.from(SCASH_TOKEN_SEED),
      ],
      program.programId
    );

    const [cashTokenMint] = PublicKey.findProgramAddressSync(
      [
        cashPool.amm.toBuffer(),
        cashPool.mintA.toBuffer(),
        Buffer.from(CASH_TOKEN_SEED),
      ],
      program.programId
    );

    const poolAccountCash = await anchor.utils.token.associatedAddress({
      mint: cashTokenMint,
      owner: poolAuthority,
    });
    const lenderCashToken = await anchor.utils.token.associatedAddress({
      mint: cashTokenMint,
      owner: provider.wallet.publicKey,
    });

    const lenderScashToken = await anchor.utils.token.associatedAddress({
      mint: sCashTokenMint,
      owner: provider.wallet.publicKey,
    });

    const tx = await program.methods
      .redeemCash()
      .accounts({
        cashPool: poolPda,
        poolAuthority: poolAuthority,
        poolAccountCash: poolAccountCash,
        cashTokenMint: cashTokenMint,
        sCashTokenMint: sCashTokenMint,
        lender: provider.wallet.publicKey,
        lenderCashToken: lenderCashToken,
        lenderScashToken: lenderScashToken,
        payer: provider.wallet.publicKey,
        tokenProgram: TOKEN_PROGRAM_ID,
        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
        systemProgram: SystemProgram.programId,
      })
      .rpc();

    return {
      tx,
      accounts: {
        poolAuthority,
        cashTokenMint,
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
