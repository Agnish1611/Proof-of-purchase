import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Trophy, Star, Crown, Target } from "lucide-react";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { useProgram } from "@/utils/connection";
import { PublicKey } from "@solana/web3.js";

const tiers = [
  {
    name: "Scout",
    icon: Trophy,
    scansRequired: 1,
    multiplier: "1x",
  },
  {
    name: "Cadet",
    icon: Star,
    scansRequired: 10,
    multiplier: "1.5x",
  },
  {
    name: "Forager",
    icon: Crown,
    scansRequired: 50,
    multiplier: "2x",
  },
  {
    name: "Commander",
    icon: Crown,
    scansRequired: 100,
    multiplier: "2.5x",
  },
  {
    name: "Tyrant",
    icon: Crown,
    scansRequired: 200,
    multiplier: "3x",
  },
];

const LoyaltyTierPage = () => {
  const { publicKey } = useWallet();
  const { connection } = useConnection();
  const { program } = useProgram();

  const [userData, setUserData] = useState<{
    scanCount: number;
    loyaltyTier: number;
    tokensEarned: number;
  } | null>(null);

  const fetchUser = async () => {
    if (!publicKey || !program) return;
    const [userPDA] = PublicKey.findProgramAddressSync(
      [Buffer.from("user"), publicKey.toBuffer()],
      program.programId
    );
    const info = await connection.getAccountInfo(userPDA);
    if (!info?.data) return;
    const decoded = program.coder.accounts.decode("userAccount", info.data);
    setUserData({
      scanCount: decoded.scanCount,
      loyaltyTier: decoded.loyaltyTier,
      tokensEarned: decoded.tokensEarned.toNumber(),
    });
  };

  useEffect(() => {
    if (publicKey) fetchUser();
  }, [publicKey, program]);

  if (!userData) {
    return <p>Loading loyalty data...</p>;
  }

  const { scanCount, loyaltyTier, tokensEarned } = userData;
  const current = tiers[loyaltyTier];
  const next = tiers[loyaltyTier + 1];
  const progressPct = next
    ? Math.min((scanCount / next.scansRequired) * 100, 100)
    : 100;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Your Loyalty Tier</h1>
        <p className="text-muted-foreground">Scan products to climb higher!</p>
      </div>

      {/* Current Tier Card */}
      <Card>
        <CardHeader className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {React.createElement(current.icon, { className: "h-8 w-8 text-blue-600" })}
            <div>
              <CardTitle className="text-2xl">{current.name}</CardTitle>
              <p className="text-sm">{scanCount} scans</p>
            </div>
          </div>
          <Badge variant="outline">{current.multiplier}</Badge>
        </CardHeader>
        <CardContent className="space-y-4">
          {next && (
            <>
              <div className="flex justify-between text-sm">
                <span>Progress to {next.name}</span>
                <span className="font-medium">
                  {Math.max(0, next.scansRequired - scanCount)} scans left
                </span>
              </div>
              <Progress value={progressPct} className="h-3" />
            </>
          )}
          {!next && (
            <div className="text-center py-4 text-green-600">
              🎉 You’ve reached the top tier: {current.name}!
            </div>
          )}
          <div className="text-center">
            <Target className="h-4 w-4 inline-block mr-1" />
            Keep Scanning to earn more!
          </div>
        </CardContent>
      </Card>

      {/* Tokens Earned */}
      <Card>
        <CardHeader>
          <CardTitle>Total Tokens Earned</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold">{tokensEarned}</p>
        </CardContent>
      </Card>

      {/* Tier Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {tiers.map((tierInfo, idx) => {
          const unlocked = idx <= loyaltyTier;
          return (
            <Card
              key={tierInfo.name}
              className={`p-4 ${unlocked ? "ring ring-blue-200" : "opacity-50"}`}
            >
              <div className="text-center">
                {React.createElement(tierInfo.icon, { className: "h-6 w-6 mb-2 text-blue-600" })}
                <CardTitle>{tierInfo.name}</CardTitle>
                <p className="text-sm">{tierInfo.scansRequired} scans</p>
                <Badge variant="outline">{tierInfo.multiplier}</Badge>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default LoyaltyTierPage;
