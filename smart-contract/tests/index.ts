import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { PublicKey, SystemProgram, Keypair } from "@solana/web3.js";
import { createMint, createAccount, mintTo, getAccount } from "@solana/spl-token";
import { WalmartContract } from "../target/types/walmart_contract";

describe("walmart-contract", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);
  const program = anchor.workspace.walmart_contract as Program<WalmartContract>;

  const USER_SEED = Buffer.from("user");
  const CAMPAIGN_SEED = Buffer.from("campaign");
  const VAULT_AUTHORITY_SEED = Buffer.from("vault-authority");

  let user: Keypair;
  const campaignId = "camp1";
  let mint: PublicKey;
  let vaultAuthorityPda: PublicKey;
  let vaultBump: number;
  let userTokenAccount: PublicKey;

  before(async () => {
    // Setup user and funding
    user = Keypair.generate();
    await provider.connection.confirmTransaction(
      await provider.connection.requestAirdrop(user.publicKey, 1e9)
    );
    await provider.connection.confirmTransaction(
      await provider.connection.requestAirdrop(provider.wallet.publicKey, 1e9)
    );

    // Find vault authority PDA first
    [vaultAuthorityPda, vaultBump] = await PublicKey.findProgramAddress(
      [VAULT_AUTHORITY_SEED],
      program.programId
    );

    // Create mint with vault authority as mint authority
    mint = await createMint(
      provider.connection,
      provider.wallet.payer,
      vaultAuthorityPda, // Use PDA as mint authority
      null,
      0
    );

    // Create associated token account for user
    userTokenAccount = await createAccount(
      provider.connection,
      provider.wallet.payer,
      mint,
      user.publicKey
    );
  });

  it("initializes a user account", async () => {
    const [userAccountPda] = PublicKey.findProgramAddressSync(
      [USER_SEED, user.publicKey.toBuffer()],
      program.programId
    );

    await program.methods
      .initializeUser()
      .accounts({
        user: user.publicKey,
      })
      .signers([user])
      .rpc();

    const userAcc = await program.account.userAccount.fetch(userAccountPda);
    console.log("UserAccount:", userAcc);
  });

  it("initializes a campaign", async () => {
    const [campaignPda] = PublicKey.findProgramAddressSync(
      [CAMPAIGN_SEED, Buffer.from(campaignId)],
      program.programId
    );

    await program.methods
      .initializeCampaign(
        campaignId,
        "BrandX",
        ["SKU1", "SKU2"],
        3,
        new anchor.BN(5), // Use BN for u64 values
        mint,
        new anchor.BN(0),
        new anchor.BN(9999999999)
      )
      .accounts({
        authority: provider.wallet.publicKey,
      })
      .rpc();

    const camp = await program.account.campaign.fetch(campaignPda);
    console.log("Campaign:", camp);
  });

  it("logs scans and mints rewards on complete_campaign", async () => {
    const [userAccountPda] = PublicKey.findProgramAddressSync(
      [USER_SEED, user.publicKey.toBuffer()],
      program.programId
    );
    const [campaignPda] = PublicKey.findProgramAddressSync(
      [CAMPAIGN_SEED, Buffer.from(campaignId)],
      program.programId
    );

    // Log 3 scans as required by the campaign
    for (let i = 0; i < 3; i++) {
      const timestamp = Date.now() + i; // Make timestamps unique
      const sku = `SKU${i + 1}`;
      
      // Calculate scan log PDA based on the seeds defined in the contract
      const [scanLogPda] = PublicKey.findProgramAddressSync(
        [
          Buffer.from("scan"),
          user.publicKey.toBuffer(),
          Buffer.from(sku),
          Buffer.from(timestamp.toString().slice(0, 8)) // Use first 8 bytes for timestamp
        ],
        program.programId
      );

      await program.methods
        .logScan(
          sku,
          new anchor.BN(timestamp),
          new anchor.BN(365)
        )
        .accounts({
          user: user.publicKey,
        })
        .signers([user])
        .rpc();
    }

    // Complete the campaign
    await program.methods
      .completeCampaign()
      .accounts({
        userAccount: userAccountPda,
        campaign: campaignPda,
        tokenMint: mint,
        userTokenAccount
      })
      .rpc();

    // Check token balance
    const tokenAccountInfo = await getAccount(provider.connection, userTokenAccount);
    console.log("Token balance:", tokenAccountInfo.amount.toString());
  });

  it("upgrades loyalty tier correctly", async () => {
    const [userAccountPda] = PublicKey.findProgramAddressSync(
      [USER_SEED, user.publicKey.toBuffer()],
      program.programId
    );

    // Log additional scans to reach loyalty tier thresholds
    for (let i = 0; i < 7; i++) {
      const timestamp = Date.now() + 1000 + i; // Make timestamps unique
      const sku = `SKUX${i}`;
      
      // Calculate scan log PDA
      const [scanLogPda] = PublicKey.findProgramAddressSync(
        [
          Buffer.from("scan"),
          user.publicKey.toBuffer(),
          Buffer.from(sku),
          Buffer.from(timestamp.toString().slice(0, 8))
        ],
        program.programId
      );

      await program.methods
        .logScan(
          sku,
          new anchor.BN(timestamp),
          new anchor.BN(365)
        )
        .accounts({
          user: user.publicKey,
        })
        .signers([user])
        .rpc();
    }

    // Upgrade loyalty tier
    await program.methods
      .upgradeLoyalty()
      .accounts({
        user: user.publicKey,
      })
      .signers([user])
      .rpc();

    const updated = await program.account.userAccount.fetch(userAccountPda);
    console.log("Loyalty tier:", updated.loyaltyTier);
  });
});