import { getAccount, getAssociatedTokenAddress } from '@solana/spl-token';
import { PoolInfo } from './getCashPoolList';
import * as anchor from '@coral-xyz/anchor';
import { Connection, PublicKey } from '@solana/web3.js';
import fallIdl from './cash.json';
import { Idl } from '@coral-xyz/anchor';
import { AnchorWallet } from '@solana/wallet-adapter-react';

export interface CashPoolStatusInfo {
  createPool1: boolean;
}

export type CashPoolDetailInfo = {
  poolStatus: CashPoolStatusInfo;
  poolInfo: PoolInfo;
  userAssets: {
    poolCashAmount: string;
    userCashAmount: string;
    userSCashAmount: string;
  };
}

export async function getCashPoolDetail(
  wallet: AnchorWallet,
  connection: Connection,
  poolPk: PublicKey,
  walletPublicKey: PublicKey  
): Promise<CashPoolDetailInfo> {
  try {
    const provider = new anchor.AnchorProvider(
      connection,
      wallet,
      {
        commitment: "confirmed",
        preflightCommitment: "confirmed" 
      }
    );
    const program = new anchor.Program(
      (fallIdl as any) as Idl,
      provider
    ) as any;

    const pool = await program.account.pool.fetch(poolPk);
    let amm: any;
    try{
      amm = await program.account.amm.fetch(pool.amm);
      console.log("amm", amm);
    }catch(e){
      console.log("amm", e);
    }

    const mintA = new PublicKey(pool.mintA);
    
    const [poolAuthority] = PublicKey.findProgramAddressSync(
      [
        pool.amm.toBuffer(),
        mintA.toBuffer(),
        Buffer.from('a')
      ],
      program.programId
    );
    const [scashTokenMint] = PublicKey.findProgramAddressSync(
      [
        pool.amm.toBuffer(),
        mintA.toBuffer(),
        Buffer.from('f')
      ],
      program.programId
    );
    const [cashTokenMint] = PublicKey.findProgramAddressSync(
      [
        pool.amm.toBuffer(),
        mintA.toBuffer(),
        Buffer.from('f')
      ],
      program.programId
    );
    const [
      createPool1,
      poolCashAmount,
      userCashAmount,
      userSCashAmount,
    ] = await Promise.all([
      accountExists(connection, poolPk).catch(() => false),
      getUserTokenAmount(connection, poolAuthority, cashTokenMint).catch(() => 0),
      getUserTokenAmount(connection, walletPublicKey,cashTokenMint ).catch(() => 0),
      getUserTokenAmount(connection, walletPublicKey,scashTokenMint  ).catch(() => 0),
    ]);
    console.log("poolAccountAInfo", createPool1);
    console.log("poolCashAmount", poolCashAmount);
    console.log("userCashAmount", userCashAmount);
    console.log("userSCashAmount", userSCashAmount);

    return {
      poolStatus: {
        createPool1,
      },
      poolInfo: {
        poolPk: poolPk,
        amm: pool.amm,
        admin: amm.admin,
        mintA: mintA,
        tokenASymbol: mintA.toString()?.slice(0, 4),
        tokenAIcon: '',
        tokenAAmount: Number(poolCashAmount),
      },
      userAssets: {
        poolCashAmount: poolCashAmount.toString(),
        userCashAmount: userCashAmount.toString(),
        userSCashAmount: userSCashAmount.toString(),
      }
    };
  } catch (error) {
    console.error('Error getting lending pool details:', error);
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
        poolCashAmount: '0',
        userCashAmount: '0',
        userSCashAmount: '0'
      }
    };
  }
}

async function getUserTokenAmount (connection: Connection, walletPublicKey: PublicKey, tokenMint: PublicKey): Promise<number> {
  try{
    const userToken = await getAssociatedTokenAddress(tokenMint, walletPublicKey, true);
    const userTokenAccount = await getAccount(connection as any, userToken);
    return Number(userTokenAccount.amount);
  }catch(e){
    console.log("getUserTokenAmount",e);
    return 0;
  }
}

async function accountExists(connection: Connection, publicKey: PublicKey): Promise<boolean> {
  const account = await connection.getAccountInfo(publicKey);
  return account !== null;
}


