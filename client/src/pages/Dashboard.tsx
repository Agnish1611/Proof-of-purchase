import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Wallet, Coins, Trophy, Scan, Target, Plus } from "lucide-react";
import { ScanModal } from "@/components/ScanModal";
import { CampaignCard } from "@/components/CampaignCard";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useProgram } from "@/utils/connection";
import { PublicKey } from "@solana/web3.js";
import { scanService } from "@/services/scanService";
import { campaignService } from "@/services/campaignService";

const tiers = ["Bronze", "Silver", "Gold", "Platinum"];
const tierThresholds = [10, 50, 100]; // thresholds to reach next tier

const Dashboard = () => {
  const [scanModalOpen, setScanModalOpen] = useState(false);
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [userScans, setUserScans] = useState<any[]>([]);
  const wallet = useWallet();
  const { connection } = useConnection();
  const { program } = useProgram();

  const [userAccount, setUserAccount] = useState<null | {
    totalTokens: number;
    totalScans: number;
    loyaltyTier: number;
  }>(null);

  const [weeklyChange, setWeeklyChange] = useState(0);
  const [monthlyChange, setMonthlyChange] = useState(0);

  const fetchCampaigns = async () => {
    try {
      const res = await campaignService.getCampaigns();
      const campaigns = res.data;

      setCampaigns(campaigns);
    } catch (err) {
      console.error("Failed to fetch campaigns", err);
    }
  };

  const fetchUserAccount = async () => {
    if (!wallet.publicKey || !program) return;

    try {
      const [userPDA] = PublicKey.findProgramAddressSync(
        [Buffer.from("user"), wallet.publicKey.toBuffer()],
        program.programId
      );

      const accountInfo = await connection.getAccountInfo(userPDA);
      if (!accountInfo?.data) return;

      const decoded = program.coder.accounts.decode(
        "userAccount",
        accountInfo.data
      );

      setUserAccount({
        totalTokens: decoded.tokensEarned.toNumber(),
        totalScans: decoded.scanCount,
        loyaltyTier: decoded.loyaltyTier,
      });
    } catch (err) {
      console.error("Failed to fetch user account", err);
      setUserAccount(null);
    }
  };

  const fetchScanStats = async () => {
    if (!wallet.publicKey) return;

    try {
      const response = await scanService.getUserScans(
        wallet.publicKey.toBase58()
      );
      const data = response.data;
      setUserScans(data);

      const now = Math.floor(Date.now() / 1000);
      const oneDay = 24 * 60 * 60;

      const thisWeekStart = now - 7 * oneDay;
      const lastWeekStart = now - 14 * oneDay;
      const lastWeekEnd = thisWeekStart;

      const thisMonthStart = now - 30 * oneDay;
      const lastMonthStart = now - 60 * oneDay;
      const lastMonthEnd = thisMonthStart;

      const toUnix = (date: string) =>
        Math.floor(new Date(date).getTime() / 1000);

      const thisWeekScans = data.filter(
        (s: any) => toUnix(s.scanned_at) >= thisWeekStart
      );
      const lastWeekScans = data.filter((s: any) => {
        const ts = toUnix(s.scanned_at);
        return ts >= lastWeekStart && ts < lastWeekEnd;
      });

      const thisMonthScans = data.filter(
        (s: any) => toUnix(s.scanned_at) >= thisMonthStart
      );
      const lastMonthScans = data.filter((s: any) => {
        const ts = toUnix(s.scanned_at);
        return ts >= lastMonthStart && ts < lastMonthEnd;
      });

      setWeeklyChange(thisWeekScans.length - lastWeekScans.length);
      setMonthlyChange(thisMonthScans.length - lastMonthScans.length);
    } catch (err) {
      console.error("Failed to fetch scan stats", err);
    }
  };

  useEffect(() => {
    if (wallet.connected) {
      fetchUserAccount();
      fetchScanStats();
    }
  }, [wallet.publicKey, program]);

  useEffect(() => {
    if (userScans.length > 0) {
      fetchCampaigns();
    }
  }, [userScans]);

  const nextThreshold = tierThresholds[userAccount?.loyaltyTier ?? 0] ?? null;
  const progressPercent =
    userAccount && nextThreshold
      ? Math.min((userAccount.totalScans / nextThreshold) * 100, 100)
      : 100;

  const progressLabel = nextThreshold
    ? `${userAccount?.totalScans}/${nextThreshold}`
    : "Max";

  const nextTierLabel =
    userAccount?.loyaltyTier !== undefined && userAccount.loyaltyTier < 3
      ? tiers[userAccount.loyaltyTier + 1]
      : "Max Tier";

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-yellow-50 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-gray-900">
            Loyalty Dashboard
          </h1>
          <p className="text-gray-600">Scan, Earn, and Unlock Rewards</p>
        </div>

        {/* Wallet Connection */}
        <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <CardContent className="p-6 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Wallet className="h-8 w-8" />
              {wallet.connected && wallet.publicKey ? (
                <div>
                  <p className="text-sm opacity-90">Connected Wallet</p>
                  <p className="font-mono text-lg">
                    {wallet.publicKey.toBase58().slice(0, 4)}...
                    {wallet.publicKey.toBase58().slice(-4)}
                  </p>
                </div>
              ) : (
                <p className="text-sm">No wallet connected</p>
              )}
            </div>
            <WalletMultiButton className="!bg-white !text-blue-600 !hover:bg-gray-100" />
          </CardContent>
        </Card>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Total Tokens
              </CardTitle>
              <Coins className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">
                {userAccount?.totalTokens ?? "--"}
              </div>
              <p className="text-xs text-muted-foreground">
                +{monthlyChange} from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Scans</CardTitle>
              <Scan className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {userAccount?.totalScans ?? "--"}
              </div>
              <p className="text-xs text-muted-foreground">
                +{weeklyChange} this week
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Loyalty Tier
              </CardTitle>
              <Trophy className="h-4 w-4 text-amber-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-amber-600">
                {userAccount ? tiers[userAccount.loyaltyTier] : "--"}
              </div>
              <div className="mt-2">
                <div className="flex justify-between text-xs text-muted-foreground mb-1">
                  <span>Progress to {nextTierLabel}</span>
                  <span>{progressLabel}</span>
                </div>
                <Progress value={progressPercent} className="h-2" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Scan */}
        <Card className="border-2 border-dashed border-blue-300 bg-blue-50">
          <CardContent className="p-6 text-center">
            <Target className="h-12 w-12 text-blue-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Ready to Scan?</h3>
            <p className="text-gray-600 mb-4">
              Scan product SKUs to earn tokens and complete campaigns
            </p>
            <Button
              onClick={() => setScanModalOpen(true)}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Scan New Product
            </Button>
          </CardContent>
        </Card>

        {/* Campaigns */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Active Campaigns</h2>
            <Button variant="outline" size="sm">
              View All
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {campaigns.map((campaign) => (
              <CampaignCard
                key={campaign._id}
                campaign={{
                  _id: campaign._id,
                  title: campaign.title,
                  brand: campaign.brand,
                  scan_count_required: campaign.scan_count_required,
                  reward_tokens: campaign.reward_tokens,
                  status: campaign.status,
                }}
              />
            ))}
          </div>
        </div>

        <ScanModal
          open={scanModalOpen}
          onOpenChange={(open) => {
            setScanModalOpen(open);
            if (!open) {
              fetchUserAccount(); // Refresh after scan
              fetchScanStats(); // Refresh stats
            }
          }}
        />
      </div>
    </div>
  );
};

export default Dashboard;
