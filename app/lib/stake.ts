import { ASSOCIATED_TOKEN_PROGRAM_ID, TOKEN_PROGRAM_ID, getAssociatedTokenAddress } from "@solana/spl-token";
import { Connection, PublicKey } from "@solana/web3.js";

export const fetchTokenBalance = async (walletAddress, tokenMintAddress) => {
  const connection = new Connection("https://api.testnet.solana.com");
  const publicKey = new PublicKey(walletAddress);
  const tokenMint = new PublicKey('EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v');

  // 获取关联的 Token Account 地址
  const associatedTokenAccount = getAssociatedTokenAddress(
    tokenMintAddress,
    walletAddress
  );

  try {
    const accountInfo = await connection.getTokenAccountBalance(associatedTokenAccount);
    console.log("Token account info:", accountInfo);
    return accountInfo.value.uiAmount; // 代币数量（含小数）
  } catch (error) {
    console.error("Token account not found:", error);
    return 0; // 如果账户不存在，返回 0
  }
};