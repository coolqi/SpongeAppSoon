import * as anchor from '@coral-xyz/anchor';
import { Connection, PublicKey } from '@solana/web3.js';
import fallIdl from './fall.json';
import { Idl } from '@coral-xyz/anchor';
import { MVM_USD_MINT } from '@/core/setting';

export interface PoolInfo {
  poolPk: PublicKey;
  amm: PublicKey;
  admin: PublicKey;
  mintA: PublicKey;
  mintB?: PublicKey;
  tokenAAmount: number;
  tokenBAmount?: number;
  liquidityMintAmount?: number;
  adminFeeAmount?: number;
  aToB?: number;
  bToA?: number;
  displayName?: string;
  tokenAIcon?: string;
  tokenBIcon?: string;
  tokenASymbol?: string;
  tokenBSymbol?: string;
}

const nameMap = {
  'So11111111111111111111111111111111111111112': 'SOL',
  'Gh9ZwEmdLJ8DscKNTkTqPbNwLNNBjuSzaG9Vp2KGtKJr': 'USDC',
}

export async function getPoolList(
  wallet: any,
  connection: Connection
): Promise<PoolInfo[]> {
  try {
    const provider = new anchor.AnchorProvider(
      connection,
      wallet,
      { preflightCommitment: "confirmed" }
    );

    const program = new anchor.Program(
      (fallIdl as any) as Idl,
      provider
    ) as any;

    const accounts = await program.account.pool.all();
    return accounts.filter((account: any) => account.publicKey.toString().startsWith('Hme') || account.publicKey.toString().startsWith('E8w')).map((account: any) => ({
      name: account.publicKey.toString(),
      poolPk: new PublicKey(account.publicKey.toString()),
      amm: new PublicKey(account.account.amm.toString()),
      mintA: new PublicKey(account.account.mintA.toString()),
      mintB: new PublicKey(account.account.mintB.toString()),
      tokenAAmount: account.account.tokenAAmount.toString(),
      tokenBAmount: account.account.tokenBAmount.toString(),
      // @ts-expect-error ignore type error
      displayName: nameMap[account.account.mintB.toString()],
    }));
  } catch (error) {
    console.error('Error fetching pool accounts:', error);
    throw error;
  }
} 