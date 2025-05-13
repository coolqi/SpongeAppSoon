import * as anchor from "@coral-xyz/anchor";
import { Program, BN, AnchorProvider } from "@coral-xyz/anchor";
import {
  PublicKey,
  LAMPORTS_PER_SOL,
  Connection,
  Transaction,
  SystemProgram,
  SYSVAR_RENT_PUBKEY,
  TransactionInstruction,
} from "@solana/web3.js";

import { AnchorWallet } from "@solana/wallet-adapter-react";
import { SoonVault } from "@/program/soon_vault";
import {
  TOKEN_PROGRAM_ID,
  ASSOCIATED_TOKEN_PROGRAM_ID,
  NATIVE_MINT,
} from "@solana/spl-token";
import * as token from "@solana/spl-token";
import { getWrapSolInstructions, getUnwrapSolInstructions } from "./wrap";
import { ETH_MINT } from "@/core/setting";

/**
 * Program ID for the Soon Vault progra
 */
export const SOON_VAULT_PROGRAM_ID = new PublicKey(
  "9PCuUZGyahj9Akup3qJVrKVVpfhjeNnVnkbrdtJ1RcXm"
);

/**
 * Seeds used for PDA derivation
 */
export const SPL_VAULT_STATE_SEED = Buffer.from("spl_vault_state");
export const USER_STATE_SEED = Buffer.from("user_state");

export const getProgram = (
  connection: Connection,
  wallet: AnchorWallet,
  idl: SoonVault,
  contractAddress: string,
  authority: PublicKey
) => {
  const provider = new AnchorProvider(connection, wallet, {
    commitment: "confirmed",
  });
  anchor.setProvider(provider);
  const program = new Program(idl as any, provider);

  return { program, provider, authority };
};

export const getVault = async (
  connection: Connection,
  wallet: AnchorWallet,
  idl: SoonVault,
  contractAddress: string,
  authority: PublicKey,
  splMint: PublicKey
) => {
  const { program } = getProgram(
    connection,
    wallet,
    idl,
    contractAddress,
    authority
  );

  const [splVaultStatePDA] = PublicKey.findProgramAddressSync(
    [SPL_VAULT_STATE_SEED, splMint.toBytes(), authority.toBytes()],
    program.programId
  );

  const [splVaultATA] = PublicKey.findProgramAddressSync(
    [splVaultStatePDA.toBytes(), TOKEN_PROGRAM_ID.toBytes(), splMint.toBytes()],
    ASSOCIATED_TOKEN_PROGRAM_ID
  );

  const [userStatePDA] = PublicKey.findProgramAddressSync(
    [USER_STATE_SEED, splMint.toBytes(), wallet.publicKey.toBytes()],
    program.programId
  );

  const [userSplATA] = PublicKey.findProgramAddressSync(
    [wallet.publicKey.toBytes(), TOKEN_PROGRAM_ID.toBytes(), splMint.toBytes()],
    ASSOCIATED_TOKEN_PROGRAM_ID
  );

  return { splVaultStatePDA, splVaultATA, userStatePDA, userSplATA };
};

export const getStakeSplInstructions = async (
  connection: Connection,
  wallet: AnchorWallet,
  amount: number,
  idl: SoonVault,
  contractAddress: string,
  authority: PublicKey,
  splMint: PublicKey
): Promise<TransactionInstruction> => {
  const { program } = getProgram(
    connection,
    wallet,
    idl,
    contractAddress,
    authority
  );

  return await program.methods
    .stakeSpl(new BN(amount))
    .accounts({
      authority: authority,
      splMint: splMint,
      user: wallet.publicKey,
      tokenProgram: TOKEN_PROGRAM_ID,
    })
    .instruction();
};

export const getUnstakeSplInstructions = async (
  connection: Connection,
  wallet: AnchorWallet,
  amount: number,
  idl: SoonVault,
  contractAddress: string,
  authority: PublicKey,
  splMint: PublicKey
): Promise<TransactionInstruction> => {
  const { program } = getProgram(
    connection,
    wallet,
    idl,
    contractAddress,
    authority
  );

  return await program.methods
    .unstakeSpl(new BN(amount))
    .accounts({
      authority: authority,
      splMint: splMint,
      user: wallet.publicKey,
      tokenProgram: TOKEN_PROGRAM_ID,
    })
    .instruction();
};

export const stakeSpl = async (
  connection: Connection,
  wallet: AnchorWallet,
  amount: number,
  idl: SoonVault,
  contractAddress: string,
  authority: PublicKey,
  splMint: PublicKey
): Promise<Transaction> => {
  const legalAmount = Math.floor(amount);
  const instruction = await getStakeSplInstructions(
    connection,
    wallet,
    legalAmount,
    idl,
    contractAddress,
    authority,
    splMint
  );
  return new Transaction().add(instruction);
};

export const unstakeSpl = async (
  connection: Connection,
  wallet: AnchorWallet,
  amount: number,
  idl: SoonVault,
  contractAddress: string,
  authority: PublicKey,
  splMint: PublicKey
): Promise<Transaction> => {
  const instruction = await getUnstakeSplInstructions(
    connection,
    wallet,
    amount,
    idl,
    contractAddress,
    authority,
    splMint
  );
  return new Transaction().add(instruction);
};

export const stake = async (
  connection: Connection,
  wallet: AnchorWallet,
  amount: number,
  idl: SoonVault,
  contractAddress: string,
  authority: PublicKey,
  splMint: PublicKey
): Promise<Transaction> => {
  const instruction = await getStakeSplInstructions(
    connection,
    wallet,
    amount,
    idl,
    contractAddress,
    authority,
    splMint
  );
  return new Transaction().add(instruction);
};

export const getUserSplStaked = async (
  connection: Connection,
  wallet: AnchorWallet,
  idl: SoonVault,
  contractAddress: string,
  authority: PublicKey,
  splMint: PublicKey
): Promise<number | null> => {
  try {
    const { program } = getProgram(
      connection,
      wallet,
      idl,
      contractAddress,
      authority
    );

    const { userStatePDA } = await getVault(
      connection,
      wallet,
      idl,
      contractAddress,
      authority,
      splMint
    );

    const userPublicKey = wallet.publicKey;

    if (!userPublicKey) {
      return null;
    }

    try {
      const fetchedUserState = await program.account.userV2State.fetch(
        userStatePDA
      );
      return fetchedUserState.splStakeAmount.toNumber();
    } catch (error) {
      console.error("Error fetching user state:", error);
      return 0;
    }
  } catch (error) {
    console.error("Error getting user SPL staked:", error);
    return null;
  }
};

export const getUserNativeBalance = async (
  connection: Connection,
  wallet: AnchorWallet
): Promise<number | null> => {
  try {
    const userPublicKey = wallet.publicKey;

    if (!userPublicKey) {
      return null;
    }

    const balance = await connection.getBalance(userPublicKey);
    console.log("balance", balance / LAMPORTS_PER_SOL);
    return balance / LAMPORTS_PER_SOL;
  } catch (error) {
    console.error("Error getting user native balance:", error);
    return null;
  }
};

export const getUserSplBalance = async (
  connection: Connection,
  wallet: AnchorWallet,
  tokenMintAddress: string
): Promise<number | null> => {
  try {
    if (!wallet || !wallet.publicKey) {
      console.error("Wallet not connected.");
      return null;
    }

    let tokenMintPublicKey: PublicKey;
    try {
      tokenMintPublicKey = new PublicKey(tokenMintAddress);
    } catch (error) {
      console.error("Invalid token mint address:", tokenMintAddress);
      return null;
    }

    const userPublicKey = wallet.publicKey;
    const tokenAccountPublicKey = await getAssociatedTokenAddress(
      tokenMintPublicKey,
      userPublicKey
    );
    console.log(tokenAccountPublicKey.toBase58());

    try {
      console.log("GETACCOUNT info");
      const accountInfo = await connection.getParsedAccountInfo(
        tokenAccountPublicKey
      );
      console.dir(accountInfo);
      const parsedAccountInfo = accountInfo.value?.data;
      if (!parsedAccountInfo) {
        throw new Error("account does not exist.");
      }
      return parsedAccountInfo?.parsed.info.tokenAmount.uiAmount;
    } catch (error) {
      console.error("Token account does not exist.");
      return 0;
    }
  } catch (error) {
    console.error("Error getting user SPL balance:", error);
    return null;
  }
};

export const getSplTokenDecimals = async (
  connection: Connection,
  mintAddress: string
): Promise<number> => {
  try {
    const mint = await getAccountInfo(new PublicKey(mintAddress));
    console.log("DECIMAL", mint.decimals);
    return mint.decimals;
  } catch (error) {
    console.error("Error getting token decimals:", error);
    throw error;
  }
};

export const getStakeNativeInstructions = async (
  connection: Connection,
  wallet: AnchorWallet,
  amount: number,
  idl: SoonVault,
  contractAddress: string,
  authority: PublicKey
): Promise<TransactionInstruction[]> => {
  const { program } = getProgram(
    connection,
    wallet,
    idl,
    contractAddress,
    authority
  );

  const wrapInstructions = await getWrapSolInstructions(
    wallet.publicKey,
    amount
  );

  const stakeInstruction = await program.methods
    .stakeSpl(new BN(amount))
    .accounts({
      authority: authority,
      splMint: ETH_MINT,
      user: wallet.publicKey,
      tokenProgram: TOKEN_PROGRAM_ID,
    })
    .instruction();

  return [...wrapInstructions, stakeInstruction];
};

export const getUnstakeNativeInstructions = async (
  connection: Connection,
  wallet: AnchorWallet,
  amount: number,
  idl: SoonVault,
  contractAddress: string,
  authority: PublicKey
): Promise<TransactionInstruction[]> => {
  const { program } = getProgram(
    connection,
    wallet,
    idl,
    contractAddress,
    authority
  );

  const unstakeInstruction = await program.methods
    .unstakeSpl(new BN(amount))
    .accounts({
      authority: authority,
      splMint: ETH_MINT,
      user: wallet.publicKey,
      tokenProgram: TOKEN_PROGRAM_ID,
    })
    .instruction();

  const unwrapInstructions = await getUnwrapSolInstructions(
    wallet.publicKey,
  );

  return [unstakeInstruction, ...unwrapInstructions];
};

export const stakeNative = async (
  connection: Connection,
  wallet: AnchorWallet,
  amount: number,
  idl: SoonVault,
  contractAddress: string,
  authority: PublicKey
): Promise<Transaction> => {
  const legalAmount = Math.floor(amount);
  const instructions = await getStakeNativeInstructions(
    connection,
    wallet,
    legalAmount,
    idl,
    contractAddress,
    authority
  );
  return new Transaction().add(...instructions);
};

export const unstakeNative = async (
  connection: Connection,
  wallet: AnchorWallet,
  amount: number,
  idl: SoonVault,
  contractAddress: string,
  authority: PublicKey
): Promise<Transaction> => {
  const instructions = await getUnstakeNativeInstructions(
    connection,
    wallet,
    amount,
    idl,
    contractAddress,
    authority
  );
  return new Transaction().add(...instructions);
};
