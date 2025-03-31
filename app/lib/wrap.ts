import {
    Connection,
    PublicKey,
    Transaction,
    SystemProgram,
    sendAndConfirmTransaction,
    Keypair,
    LAMPORTS_PER_SOL,
    TransactionInstruction,
} from '@solana/web3.js';
import {
    TOKEN_PROGRAM_ID,
    NATIVE_MINT,
    ASSOCIATED_TOKEN_PROGRAM_ID,
} from '@solana/spl-token';

/**
 * Gets the instructions needed to wrap SOL to Wrapped SOL
 * @param payer Public key of the wallet
 * @param amount Amount of SOL to wrap (in SOL, not lamports)
 * @returns Array of instructions
 */
export async function getWrapSolInstructions(
    payer: PublicKey,
    amount: number
): Promise<TransactionInstruction[]> {
    const instructions: TransactionInstruction[] = [];
    const lamports = amount;
    
    // Find the associated token account
    const associatedTokenAccount = await PublicKey.findProgramAddress(
        [
            payer.toBuffer(),
            TOKEN_PROGRAM_ID.toBuffer(),
            NATIVE_MINT.toBuffer(),
        ],
        ASSOCIATED_TOKEN_PROGRAM_ID
    );

    // Create ATA instruction
    instructions.push(
        new TransactionInstruction({
            programId: ASSOCIATED_TOKEN_PROGRAM_ID,
            keys: [
                { pubkey: payer, isSigner: true, isWritable: true },
                { pubkey: associatedTokenAccount[0], isSigner: false, isWritable: true },
                { pubkey: payer, isSigner: false, isWritable: false },
                { pubkey: NATIVE_MINT, isSigner: false, isWritable: false },
                { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
                { pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
            ],
            data: Buffer.from([1]), // create instruction
        })
    );

    // Transfer SOL instruction
    instructions.push(
        SystemProgram.transfer({
            fromPubkey: payer,
            toPubkey: associatedTokenAccount[0],
            lamports,
        })
    );

    // Sync native instruction
    instructions.push(
        new TransactionInstruction({
            programId: TOKEN_PROGRAM_ID,
            keys: [
                { pubkey: associatedTokenAccount[0], isSigner: false, isWritable: true },
            ],
            data: Buffer.from([17]), // sync native instruction
        })
    );

    return instructions;
}

/**
 * Gets the instructions needed to unwrap SOL from Wrapped SOL
 * @param payer Public key of the wallet
 * @returns Array of instructions
 */
export async function getUnwrapSolInstructions(
    payer: PublicKey
): Promise<TransactionInstruction[]> {
    const instructions: TransactionInstruction[] = [];
    
    // Find the associated token account
    const associatedTokenAccount = await PublicKey.findProgramAddress(
        [
            payer.toBuffer(),
            TOKEN_PROGRAM_ID.toBuffer(),
            NATIVE_MINT.toBuffer(),
        ],
        ASSOCIATED_TOKEN_PROGRAM_ID
    );

    // Close account instruction to unwrap all SOL
    instructions.push(
        new TransactionInstruction({
            programId: TOKEN_PROGRAM_ID,
            keys: [
                { pubkey: associatedTokenAccount[0], isSigner: false, isWritable: true },
                { pubkey: payer, isSigner: true, isWritable: true },
                { pubkey: payer, isSigner: false, isWritable: true },
            ],
            data: Buffer.from([9]), // close account instruction
        })
    );

    return instructions;
}

/**
 * Wraps SOL to Wrapped SOL
 * @param connection Solana connection
 * @param payer Wallet keypair
 * @param amount Amount of SOL to wrap (in SOL, not lamports)
 * @returns Transaction signature
 */
export async function wrapSol(
    connection: Connection,
    payer: Keypair,
    amount: number
): Promise<string> {
    const instructions = await getWrapSolInstructions(payer.publicKey, amount);
    const transaction = new Transaction().add(...instructions);
    return await sendAndConfirmTransaction(connection, transaction, [payer]);
}

/**
 * Unwraps SOL from Wrapped SOL
 * @param connection Solana connection
 * @param payer Wallet keypair
 * @returns Transaction signature
 */
export async function unwrapSol(
    connection: Connection,
    payer: Keypair
): Promise<string> {
    const instructions = await getUnwrapSolInstructions(payer.publicKey);
    const transaction = new Transaction().add(...instructions);
    return await sendAndConfirmTransaction(connection, transaction, [payer]);
}