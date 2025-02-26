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