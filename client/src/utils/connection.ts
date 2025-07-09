import { AnchorProvider, Program } from "@coral-xyz/anchor";
import { useAnchorWallet, useConnection } from "@solana/wallet-adapter-react";
import idl from "@/idl/walmart_contract.json";
import type { WalmartContract } from "@/idl/walmart_contract";
import { useMemo } from "react";
import { PublicKey } from "@solana/web3.js";

export const useProgram = () => {
  const { connection } = useConnection();
  const wallet = useAnchorWallet();

  const provider = useMemo(() => {
    if (!wallet) return null;
    return new AnchorProvider(connection, wallet, { commitment: "confirmed" });
  }, [wallet, connection]);

  const program = useMemo(() => {
    if (!provider) return null;
    return new Program(idl as WalmartContract, provider);
  }, [provider]);

  return { provider, program };
};
