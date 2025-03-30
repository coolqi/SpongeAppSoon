import * as anchor from "@coral-xyz/anchor";
import { Program, BN, AnchorProvider } from "@coral-xyz/anchor";
import {
  PublicKey,
  LAMPORTS_PER_SOL,
  Connection,
  Transaction,
  SystemProgram,
  SYSVAR_RENT_PUBKEY,
} from "@solana/web3.js";
import { AnchorWallet } from "@solana/wallet-adapter-react";
import { SoonVault } from "@/program/soon_vault";
import {
  TOKEN_PROGRAM_ID,
  ASSOCIATED_TOKEN_PROGRAM_ID,
} from "@solana/spl-token";
import * as token from "@solana/spl-token";
import { getAccountInfo, getAssociatedTokenAddress } from "@solana/spl-token";

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

export const stakeSpl = async (
  connection: Connection,
  wallet: AnchorWallet,
  amount: number,
  idl: SoonVault,
  contractAddress: string,
  authority: PublicKey,
  splMint: PublicKey
): Promise<Transaction> => {
  const { program } = getProgram(
    connection,
    wallet,
    idl,
    contractAddress,
    authority
  );

  const { splVaultStatePDA, splVaultATA, userStatePDA, userSplATA } =
    await getVault(
      connection,
      wallet,
      idl,
      contractAddress,
      authority,
      splMint
    );

  return await program.methods
    .stakeSpl(new BN(amount))
    .accounts({
      authority: authority,
      splMint: splMint,
      user: authority,
      tokenProgram: TOKEN_PROGRAM_ID,
    })
    .transaction();
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
  const { program } = getProgram(
    connection,
    wallet,
    idl,
    contractAddress,
    authority
  );

  const { splVaultStatePDA, splVaultATA, userStatePDA, userSplATA } =
    await getVault(
      connection,
      wallet,
      idl,
      contractAddress,
      authority,
      splMint
    );

  return await program.methods
    .unstakeSpl(new BN(amount))
    .accounts({
      authority: authority,
      splMint: splMint,
      user: wallet.publicKey,
      tokenProgram: TOKEN_PROGRAM_ID,
    })
    .transaction();
};

/**
 * Stake native tokens (ETH)
 */
export const stake = async (
  connection: Connection,
  wallet: AnchorWallet,
  amount: number,
  idl: SoonVault,
  contractAddress: string,
  authority: PublicKey
): Promise<Transaction> => {
  const { program } = getProgram(
    connection,
    wallet,
    idl,
    contractAddress,
    authority
  );

  // For Ethereum as wrapped SOL on Solana
  return await program.methods
    .stakeEth(new BN(amount))
    .accounts({
      authority: authority,
      user: wallet.publicKey,
      systemProgram: SystemProgram.programId,
    })
    .transaction();
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
