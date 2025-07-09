import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { WalmartContract } from "../target/types/walmart_contract";

describe("walmart-contract", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.walmart_contract as Program<WalmartContract>;

  it("initializes user account", async () => {
    const user = anchor.web3.Keypair.generate();
    const airdrop = await provider.connection.requestAirdrop(
      user.publicKey,
      10000000000
    );
    await provider.connection.confirmTransaction(airdrop);

    const tx = await program.methods
      .initializeUser()
      .accounts({
        user: user.publicKey
      })
      .signers([user])
      .rpc();

    console.log(tx);
  });
});
