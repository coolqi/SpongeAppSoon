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
import * as token from "@solana/spl-token";

export const getProgram = (
  connection: Connection,
  wallet: AnchorWallet,
  idl: soonVault,
  contractAddress: string,
  authority: PublicKey
) => {
  const provider = new AnchorProvider(connection, wallet, {
    commitment: "confirmed",
  });
  anchor.setProvider(provider);
  const program: Program<soonVault> = new Program(
    idl as any,
    contractAddress,
    provider
  );

  return { program, provider, authority };
};

export const getVault = async (
  connection: Connection,
  wallet: AnchorWallet,
  idl: any,
  contractAddress: string,
  authority: PublicKey
) => {
  const { program, provider } = getProgram(
    connection,
    wallet,
    idl,
    contractAddress,
    authority
  );

  const publicKeyBytes = authority.toBytes();

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
  authority: PublicKey
): Promise<Transaction> => {
  const { program, provider } = getProgram(
    connection,
    wallet,
    idl,
    contractAddress,
    authority
  );
  const { vaultStatePDA, vaultPDA, userStatePDA } = await getVault(
    connection,
    wallet,
    idl,
    contractAddress,
    authority
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
  authority: PublicKey
) => {
  const { program, provider } = getProgram(
    connection,
    wallet,
    idl,
    contractAddress,
    authority
  );
  const { vaultStatePDA, vaultPDA, userStatePDA } = await getVault(
    connection,
    wallet,
    idl,
    contractAddress,
    authority
  );

  return await program.methods
    .unstakeEth(new BN(amount * LAMPORTS_PER_SOL))
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
    const tokenAccount = await token.getAssociatedTokenAddress(
      tokenMintPublicKey,
      userPublicKey
    );

    try {
      const account = await token.getAccount(connection, tokenAccount);
      return Number(account.amount);
    } catch (error) {
      console.error("Token account does not exist.");
      return 0;
    }
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
    authority
  );
  const { vaultStatePDA, vaultPDA, userStatePDA } = await getVault(
    connection,
    wallet,
    idl,
    contractAddress,
    authority
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