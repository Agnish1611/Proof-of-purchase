import {
  Connection,
  PublicKey,
  SystemProgram,
  sendAndConfirmTransaction,
  Transaction,
} from "@solana/web3.js";
import * as anchor from "@coral-xyz/anchor";
import {
  TOKEN_PROGRAM_ID,
  getAssociatedTokenAddress,
  createAssociatedTokenAccountInstruction,
  ASSOCIATED_TOKEN_PROGRAM_ID,
  getAccount,
} from "@solana/spl-token";
import { WalletContextState } from "@solana/wallet-adapter-react";

export const MINTS = {
  scout: new PublicKey("ERaGozeR8oyHmME687W1RrK9SoStxmMVT54DjhD1fgZk"),
  cadet: new PublicKey("J7o15133dnTYzqpokQJCyfSg66fqK5Cx89gxzbTxV28W"),
  forager: new PublicKey("3LXAn3rVA4srZAjV7wduF8KxyYonaWs2mSEtBSVcSV31"),
  commander: new PublicKey("B9o14LNoG4YfW8im6eA5aRXFEPv977M6ZPdV9hpJvnbH"),
  tyrant: new PublicKey("844wzMqfkJHywZqiBDaMWpXf99U9ZkqSruyUnp378WWv"),
};

export const TOKEN_MINT_ADDRESS = new PublicKey("AaVUAamHhJHqJYHMKV7XnJ88Me8kCutjD7v57yHDWzEb");

export const initializeUser = async (program: anchor.Program, wallet: any) => {
  const [userPda] = anchor.web3.PublicKey.findProgramAddressSync(
    [Buffer.from("user"), wallet.publicKey.toBuffer()],
    program.programId
  );

  const tx = await program.methods
    .initializeUser()
    .accounts({
      userAccount: userPda,
      user: wallet.publicKey,
      systemProgram: SystemProgram.programId,
    })
    .rpc();

  console.log("User Initialized:", tx);
};

export const logScan = async (
  program: anchor.Program,
  wallet: any,
  sku: string,
  warranty_days: number
) => {
  const timestamp = Math.floor(Date.now() / 1000); // current UNIX time

  const [userPDA] = PublicKey.findProgramAddressSync(
    [Buffer.from("user"), wallet.publicKey.toBuffer()],
    program.programId
  );

  const [scanPDA] = PublicKey.findProgramAddressSync(
    [
      Buffer.from("scan"),
      wallet.publicKey.toBuffer(),
      Buffer.from(sku),
      Buffer.from(new anchor.BN(timestamp).toArrayLike(Buffer, "le", 8)),
    ],
    program.programId
  );

  const tx = await program.methods
    .logScan(sku, new anchor.BN(timestamp), new anchor.BN(warranty_days))
    .accounts({
      userAccount: userPDA,
      scanLog: scanPDA,
      user: wallet.publicKey,
      systemProgram: SystemProgram.programId,
    })
    .rpc();

  console.log("Scan logged on-chain:", tx);
};

export const initialize_campaign = async ({
  program,
  wallet,
  campaign_id,
  brand,
  required_skus,
  scan_count_req,
  reward_tokens,
  token_mint,
  start_date,
  end_date,
}: {
  program: anchor.Program;
  wallet: any;
  campaign_id: string;
  brand: string;
  required_skus: string[];
  scan_count_req: number;
  reward_tokens: number;
  token_mint: PublicKey;
  start_date: number; // UNIX timestamp
  end_date: number; // UNIX timestamp
}) => {
  const [campaignPDA] = PublicKey.findProgramAddressSync(
    [Buffer.from("campaign"), Buffer.from(campaign_id)],
    program.programId
  );

  const tx = await program.methods
    .initializeCampaign(
      campaign_id,
      brand,
      required_skus,
      scan_count_req,
      new anchor.BN(reward_tokens),
      token_mint,
      new anchor.BN(start_date),
      new anchor.BN(end_date)
    )
    .accounts({
      campaign: campaignPDA,
      authority: wallet.publicKey,
      systemProgram: SystemProgram.programId,
    })
    .rpc();

  console.log("Campaign initialized on-chain:", tx);
};

export const upgradeLoyalty = async (
  program: anchor.Program,
  wallet: any,
  connection: Connection
) => {
  if (!wallet.publicKey) throw new Error("Wallet not connected");

  const [userPDA] = anchor.web3.PublicKey.findProgramAddressSync(
    [Buffer.from("user"), wallet.publicKey.toBuffer()],
    program.programId
  );

  const [vaultAuthority] = anchor.web3.PublicKey.findProgramAddressSync(
    [Buffer.from("vault-authority")],
    program.programId
  );

  const accountInfo = await connection.getAccountInfo(userPDA);
  if (!accountInfo?.data) return;

  const decoded = program.coder.accounts.decode(
    "userAccount",
    accountInfo.data
  );
  const scanCount = decoded.scanCount;

  let tier = 0;
  if (scanCount >= 100) tier = 4;
  else if (scanCount >= 50) tier = 3;
  else if (scanCount >= 10) tier = 2;
  else if (scanCount >= 1) tier = 1;
  else tier = 0;

  const mintMap = [
    MINTS.scout,
    MINTS.cadet,
    MINTS.forager,
    MINTS.commander,
    MINTS.tyrant,
  ];

  const targetMint = mintMap[tier];

  const userTokenAccount = await getAssociatedTokenAddress(
    targetMint,
    wallet.publicKey
  );

  const ataInfo = await connection.getAccountInfo(userTokenAccount);
  if (!ataInfo) {
    const ataIx = createAssociatedTokenAccountInstruction(
      wallet.publicKey,
      userTokenAccount,
      wallet.publicKey,
      targetMint
    );
    const tx = new Transaction().add(ataIx);
    const sig = await wallet.sendTransaction(tx, connection);
    await connection.confirmTransaction(sig, "confirmed");
  }

  const txSig = await program.methods
    .upgradeLoyaltyAlt()
    .accounts({
      userAccount: userPDA,
      vaultAuthority,
      scoutMint: MINTS.scout,
      cadetMint: MINTS.cadet,
      foragerMint: MINTS.forager,
      commanderMint: MINTS.commander,
      tyrantMint: MINTS.tyrant,
      userTokenAccount,
      wallet: wallet.publicKey,
      tokenProgram: TOKEN_PROGRAM_ID,
      systemProgram: SystemProgram.programId,
    })
    .rpc();

  console.log("Loyalty upgraded:", txSig);
};

export async function completeCampaign({
  program,
  connection,
  campaignId,
  signer,
}: {
  program: anchor.Program;
  connection: Connection;
  campaignId: string;
  signer: WalletContextState;
}) {
  const userPublicKey = signer.publicKey;
  if (!userPublicKey) throw new Error("Wallet not connected");

  // Derive user account PDA
  const [userPDA] = PublicKey.findProgramAddressSync(
    [Buffer.from("user"), userPublicKey.toBuffer()],
    program.programId
  );

  // Derive campaign PDA
  const [campaignPDA] = PublicKey.findProgramAddressSync(
    [Buffer.from("campaign"), Buffer.from(campaignId)],
    program.programId
  );

  // Derive user's ATA
  const userTokenAccount = await getAssociatedTokenAddress(
    TOKEN_MINT_ADDRESS,
    userPublicKey
  );

  const instructions: anchor.web3.TransactionInstruction[] = [];

  // If user doesn't have ATA, create it
  try {
    await getAccount(connection, userTokenAccount);
  } catch (e) {
    instructions.push(
      createAssociatedTokenAccountInstruction(
        userPublicKey,
        userTokenAccount,
        userPublicKey,
        TOKEN_MINT_ADDRESS
      )
    );
  }

  // Vault authority PDA
  const [vaultAuthority] = PublicKey.findProgramAddressSync(
    [Buffer.from("vault-authority")],
    program.programId
  );

  const tx = await program.methods
    .completeCampaign()
    .accounts({
      userAccount: userPDA,
      campaign: campaignPDA,
      tokenMint: TOKEN_MINT_ADDRESS,
      userTokenAccount,
      vaultAuthority,
      tokenProgram: TOKEN_PROGRAM_ID,
    })
    .transaction();

  const finalTx = new Transaction().add(...instructions, ...tx.instructions);

  const latestBlockhash = await connection.getLatestBlockhash();
  finalTx.feePayer = userPublicKey;
  finalTx.recentBlockhash = latestBlockhash.blockhash;

  const signedTx = await signer.signTransaction!(finalTx);
  const txid = await connection.sendRawTransaction(signedTx.serialize());
  await connection.confirmTransaction({ signature: txid, ...latestBlockhash });

  return txid;
}
