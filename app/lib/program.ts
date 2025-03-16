/* eslint-disable @typescript-eslint/no-explicit-any */
import * as anchor from "@coral-xyz/anchor";
import { Program, BN, AnchorProvider } from "@coral-xyz/anchor";
import {
  PublicKey,
  LAMPORTS_PER_SOL,
  Connection,
  Transaction,
} from "@solana/web3.js";
import { AnchorWallet } from "@solana/wallet-adapter-react";
import { Vault as soonVault } from "@/program/soon_vault";
import { getAssociatedTokenAddress } from "@solana/spl-token";

export const getProgram = (
  connection: Connection,
  wallet: AnchorWallet,
  idl: soonVault,
  contractAddress: string,
  authority: PublicKey // Add authority parameter
) => {
  const provider = new AnchorProvider(connection, wallet, {
    commitment: "confirmed",
  });
  anchor.setProvider(provider);
  const program: Program<soonVault> = new Program(
    idl as any,
    // contractAddress,
    provider
  );

  return { program, provider, authority }; // Return authority if needed
};

export const getVault = async (
  connection: Connection,
  wallet: AnchorWallet,
  idl: any,
  contractAddress: string,
  authority: PublicKey // Add authority parameter
) => {
  const { program, provider } = getProgram(
    connection,
    wallet,
    idl,
    contractAddress,
    authority // Pass authority to getProgram
  );

  const publicKeyBytes = authority.toBytes(); // Use the authority public key

  const vaultStatePDA = PublicKey.findProgramAddressSync(
    [Buffer.from("vault_state"), publicKeyBytes],
    program.programId
  )[0];

  const vaultPDA = PublicKey.findProgramAddressSync(
    [Buffer.from("vault"), vaultStatePDA.toBytes()],
    program.programId
  )[0];

  const userStatePDA = PublicKey.findProgramAddressSync(
    [Buffer.from("user_state"), provider.wallet.publicKey.toBytes()],
    program.programId
  )[0];

  return { vaultStatePDA, vaultPDA, userStatePDA };
};

export const stake = async (
  connection: Connection,
  wallet: AnchorWallet,
  amount: number,
  idl: any,
  contractAddress: string,
  authority: PublicKey // Add authority parameter
): Promise<Transaction> => {
  const { program, provider } = getProgram(
    connection,
    wallet,
    idl,
    contractAddress,
    authority // Pass authority to getProgram
  );
  const { vaultStatePDA, vaultPDA, userStatePDA } = await getVault(
    connection,
    wallet,
    idl,
    contractAddress,
    authority // Pass authority to getVault
  );

  return await program.methods
    .stakeEth(new BN(amount * LAMPORTS_PER_SOL))
    .accountsPartial({
      authority: authority,
      user: provider.wallet.publicKey,
    })
    .transaction();
};

export const unstake = async (
  connection: Connection,
  wallet: AnchorWallet,
  amount: number,
  idl: any,
  contractAddress: string,
  authority: PublicKey // Add authority parameter
) => {
  const { program, provider } = getProgram(
    connection,
    wallet,
    idl,
    contractAddress,
    authority // Pass authority to getProgram
  );
  const { vaultStatePDA, vaultPDA, userStatePDA } = await getVault(
    connection,
    wallet,
    idl,
    contractAddress,
    authority // Pass authority to getVault
  );

  return await program.methods
    .unstakeEth(new BN(amount * LAMPORTS_PER_SOL)) // 0.001 SOL
    .accountsPartial({
      authority: authority,
      user: provider.wallet.publicKey,
    })
    .transaction();
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
    const userAta = getAssociatedTokenAddress(
      tokenMintPublicKey,
      userPublicKey,
      false
    );

    const accountInfo = await connection.getTokenAccountBalance(userAta);
    console.log("accountInfo", accountInfo);

    if (!accountInfo) {
      console.error("Token account does not exist.");
      return 0;
    }

    return Number(accountInfo.value.amount);
  } catch (error) {
    console.error("Error getting user SPL balance:", error);
    return null;
  }
};

export const getUserNativeStaked = async (
  connection: Connection,
  wallet: AnchorWallet,
  idl: any,
  contractAddress: string,
  authority: PublicKey
): Promise<number | null> => {
  const { program, provider } = getProgram(
    connection,
    wallet,
    idl,
    contractAddress,
    authority // Pass authority to getProgram
  );
  const { vaultStatePDA, vaultPDA, userStatePDA } = await getVault(
    connection,
    wallet,
    idl,
    contractAddress,
    authority // Pass authority to getVault
  );

  try {
    const userPublicKey = wallet.publicKey;

    if (!userPublicKey) {
      return null;
    }

    const fetchedUserState = await program.account.userState.fetch(userStatePDA);
    const staked = fetchedUserState.ethStakeAmount.toNumber();
    console.log("staked:", fetchedUserState.ethStakeAmount.toNumber() / LAMPORTS_PER_SOL);
    
    return staked / LAMPORTS_PER_SOL;
  } catch (error) {
    console.error("Error getting user native staked:", error);
    return null;
  }
};