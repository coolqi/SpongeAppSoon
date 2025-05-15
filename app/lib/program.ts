import * as anchor from "@coral-xyz/anchor";
import { Program, AnchorProvider } from "@coral-xyz/anchor";
import {
  PublicKey,
  LAMPORTS_PER_SOL,
  Connection,
} from "@solana/web3.js";

import { AnchorWallet } from "@solana/wallet-adapter-react";
import { SoonVault } from "@/program/soon_vault";
import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  getAssociatedTokenAddressSync,
  TOKEN_PROGRAM_ID,
} from "./splToken";

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

    const { userStatePDA }: { userStatePDA: PublicKey } = await getVault(
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
      const fetchedUserState = await (program.account as any).userV2State.fetch(
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
    const tokenAccountPublicKey = getAssociatedTokenAddressSync(
      tokenMintPublicKey,
      userPublicKey
    );
    console.log("tokenAccountPublicKey", tokenAccountPublicKey.toBase58());

    try {
      const accountInfo = await connection.getParsedAccountInfo(
        tokenAccountPublicKey
      );
      console.dir(accountInfo);
      const parsedAccountInfo = accountInfo.value?.data as any;
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