import { Connection, PublicKey, SystemProgram } from "@solana/web3.js";
import * as anchor from "@coral-xyz/anchor";
import { WalmartContract } from "@/idl/walmart_contract";

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