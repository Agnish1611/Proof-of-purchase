import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { PublicKey, Keypair } from "@solana/web3.js";
import { createMint, createAccount, getAccount } from "@solana/spl-token";
import { WalmartContract } from "../target/types/walmart_contract";
import * as bs58 from "bs58";

describe("walmart-contract", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);
  const program = anchor.workspace.walmart_contract as Program<WalmartContract>;

  // Helper function to find scan log PDA
  function findScanLogPda(
    userPubkey: PublicKey,
    sku: string,
    timestamp: anchor.BN
  ) {
    return PublicKey.findProgramAddressSync(
      [
        Buffer.from("scan"),
        userPubkey.toBuffer(),
        Buffer.from(sku),
        timestamp.toBuffer("le", 8),
      ],
      program.programId
    )[0];
  }

  const USER_SEED = Buffer.from("user");
  const CAMPAIGN_SEED = Buffer.from("campaign");
  const VAULT_AUTHORITY_SEED = Buffer.from("vault-authority");

  let user: Keypair;
  const campaignId = "camp1";
  let mint: PublicKey;
  let vaultAuthorityPda: PublicKey;
  let vaultBump: number;
  let userTokenAccount: PublicKey;
  let userAccountPda: PublicKey;
  let campaignPda: PublicKey;

  // Loyalty tier mints
  // Since we're just testing, we'll create new mints for each tier
  let scoutMint: PublicKey;
  let cadetMint: PublicKey;
  let foragerMint: PublicKey;
  let commanderMint: PublicKey;
  let tyrantMint: PublicKey;
  
  // Token accounts for each tier
  let scoutTokenAccount: PublicKey;
  let cadetTokenAccount: PublicKey;
  let foragerTokenAccount: PublicKey;
  let commanderTokenAccount: PublicKey;
  let tyrantTokenAccount: PublicKey;

  before(async () => {
    // Use the default provider's wallet for tests
    // Instead of trying to use a separate user keypair
    user = provider.wallet.payer;

    // Log the user's public key to help debugging
    console.log("User public key:", user.publicKey.toString());

    [vaultAuthorityPda, vaultBump] = await PublicKey.findProgramAddress(
      [VAULT_AUTHORITY_SEED],
      program.programId
    );

    console.log("Vault Authority PDA:", vaultAuthorityPda.toBase58());

    mint = await createMint(
      provider.connection,
      provider.wallet.payer,
      vaultAuthorityPda,
      null,
      0
    );

    userTokenAccount = await createAccount(
      provider.connection,
      provider.wallet.payer,
      mint,
      user.publicKey
    );

    userAccountPda = PublicKey.findProgramAddressSync(
      [USER_SEED, user.publicKey.toBuffer()],
      program.programId
    )[0];

    campaignPda = PublicKey.findProgramAddressSync(
      [CAMPAIGN_SEED, Buffer.from(campaignId)],
      program.programId
    )[0];
  });

  it("initializes a user account", async () => {
    const userAccountExists = await provider.connection.getAccountInfo(
      userAccountPda
    );
    if (!userAccountExists) {
      await program.methods
        .initializeUser()
        .accounts({
          user: user.publicKey,
        })
        .signers([user])
        .rpc();
    }

    const userAcc = await program.account.userAccount.fetch(userAccountPda);
    console.log("UserAccount:", userAcc);
  });

  it("initializes a campaign", async () => {
    const campaignAccountExists = await provider.connection.getAccountInfo(
      campaignPda
    );
    if (!campaignAccountExists) {
      await program.methods
        .initializeCampaign(
          campaignId,
          "BrandX",
          ["SKU1", "SKU2"],
          3,
          new anchor.BN(5),
          mint,
          new anchor.BN(0),
          new anchor.BN(9999999999)
        )
        .accounts({
          authority: provider.wallet.publicKey,
        })
        .rpc();
    }

    const camp = await program.account.campaign.fetch(campaignPda);
    console.log("Campaign:", camp);
  });

  it("logs scans and completes campaign", async () => {
    for (let i = 0; i < 3; i++) {
      const timestamp = Date.now() + i;
      const sku = `SKU${i + 1}`;
      const scanLogPda = findScanLogPda(
        user.publicKey,
        sku,
        new anchor.BN(timestamp)
      );

      await program.methods
        .logScan(sku, new anchor.BN(timestamp), new anchor.BN(365))
        .accounts({
          user: user.publicKey,
          userAccount: userAccountPda,
          scanLog: scanLogPda,
          systemProgram: anchor.web3.SystemProgram.programId,
        })
        .signers([user])
        .rpc();
    }

    await program.methods
      .completeCampaign()
      .accounts({
        campaign: campaignPda,
        tokenMint: mint,
        userTokenAccount,
        userAccount: userAccountPda,
        vaultAuthority: vaultAuthorityPda,
        tokenProgram: anchor.utils.token.TOKEN_PROGRAM_ID,
      })
      .signers([user])
      .rpc();

    const tokenAccountInfo = await getAccount(
      provider.connection,
      userTokenAccount
    );
    console.log(
      "Token balance after campaign:",
      tokenAccountInfo.amount.toString()
    );
  });

  it("upgrades loyalty tier", async () => {
    // Check initial state
    const initialUser = await program.account.userAccount.fetch(userAccountPda);
    console.log("Initial user state:", initialUser);

    // User account already has enough scans from previous tests
    // Skip additional scans to avoid running out of funds

    try {
      // Get all user accounts to make sure we're passing the right one
      const allUserAccounts = await program.account.userAccount.all();
      console.log(
        "Found user accounts:",
        allUserAccounts.map((acc) => ({
          publicKey: acc.publicKey.toString(),
          wallet: acc.account.wallet.toString(),
          scanCount: acc.account.scanCount,
        }))
      );

      // Find the right user account for our test user
      const correctUserAccount = allUserAccounts.find(
        (acc) => acc.account.wallet.toString() === user.publicKey.toString()
      );

      if (!correctUserAccount) {
        throw new Error("Could not find user account for test wallet");
      }

      console.log(
        "Using user account:",
        correctUserAccount.publicKey.toString()
      );

      // Try using the upgrade_loyalty_alt instruction instead which has a different account structure
      await program.methods
        .upgradeLoyaltyAlt()
        .accounts({
          userAccount: userAccountPda,
          vaultAuthority: vaultAuthorityPda,
          scoutMint: scoutMint,
          cadetMint: cadetMint,
          foragerMint: foragerMint,
          commanderMint: commanderMint,
          tyrantMint: tyrantMint,
          userTokenAccount,
          wallet: user.publicKey,
          tokenProgram: anchor.utils.token.TOKEN_PROGRAM_ID,
          systemProgram: anchor.web3.SystemProgram.programId,
        })
        .signers([user])
        .rpc();
    } catch (error) {
      console.error("Error details:", error);
      throw error;
    }

    const updated = await program.account.userAccount.fetch(userAccountPda);
    console.log("New Loyalty Tier:", updated.loyaltyTier);
  });
});
