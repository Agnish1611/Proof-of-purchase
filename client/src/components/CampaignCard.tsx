import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trophy, Target, CheckCircle, Lock } from "lucide-react";
import { campaignService } from "@/services/campaignService";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { useProgram } from "@/utils/connection";
import { completeCampaign } from "@/utils/instructions";
import { toast } from "sonner";

interface Campaign {
  _id: string;
  title: string;
  brand: string;
  scan_count_required: number;
  reward_tokens: number;
  status: "active" | "completed" | "locked";
}

interface CampaignCardProps {
  campaign: Campaign;
  onProgressUpdated?: () => void;
}

export const CampaignCard = ({
  campaign,
  onProgressUpdated,
}: CampaignCardProps) => {
  const wallet = useWallet();
  const { program } = useProgram();
  const { connection } = useConnection();

  const [progress, setProgress] = useState<number>(0);
  const [completed, setCompleted] = useState<boolean>(false);
  const [claiming, setClaiming] = useState(false);
  const [tokensClaimed, setTokensClaimed] = useState<boolean>(true);

  const requiredScans = campaign.scan_count_required;
  const progressPercentage = (progress / requiredScans) * 100;

  const getStatusIcon = () => {
    if (completed) return <CheckCircle className="h-4 w-4 text-green-500" />;
    if (campaign.status === "locked")
      return <Lock className="h-4 w-4 text-muted-foreground" />;
    return <Target className="h-4 w-4 text-blue-500" />;
  };

  const getStatusBadge = () => {
    if (completed)
      return <Badge className="bg-green-100 text-green-800">Completed</Badge>;
    if (campaign.status === "locked")
      return <Badge variant="secondary">Locked</Badge>;
    return <Badge className="bg-blue-100 text-blue-800">Active</Badge>;
  };

  const fetchProgress = async () => {
    if (!wallet.publicKey) return;
    try {
      const res = await campaignService.getProgress(
        wallet.publicKey.toBase58(),
        campaign._id
      );
      const data = res.data;
      setProgress(data.scan_count);
      setCompleted(data.completed);
    } catch (err) {
      console.error("Failed to fetch campaign progress", err);
    }
  };

  const handleClaim = async () => {
    if (!program || !wallet.publicKey || !connection) return;

    try {
      setClaiming(true);
      toast.loading("Claiming tokens...");

      await completeCampaign({
        program,
        signer: wallet,
        campaignId: campaign.title,
        connection,
      });

      toast.dismiss();
      toast.success("Tokens claimed!");
      await fetchProgress();

      onProgressUpdated?.();
      setTokensClaimed(true);
    } catch (err: any) {
      console.error(err);
      toast.dismiss();
      toast.error(err.message || "Failed to claim tokens.");
    } finally {
      setClaiming(false);
    }
  };

  useEffect(() => {
    if (wallet.connected && campaign._id) {
      fetchProgress();
    }
  }, [wallet.publicKey, campaign._id]);

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {getStatusIcon()}
            <CardTitle className="text-lg">{campaign.title}</CardTitle>
          </div>
          {getStatusBadge()}
        </div>
        <CardDescription className="text-sm">
          by {campaign.brand}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Progress</span>
          <span className="font-medium">
            {Math.min(progress, requiredScans)}/{requiredScans} scans
          </span>
        </div>

        <Progress value={progressPercentage} className="h-2" />

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Trophy className="h-4 w-4" />
            <span>{campaign.reward_tokens} tokens</span>
          </div>

          <Button
            size="sm"
            onClick={handleClaim}
            disabled={!completed || claiming || tokensClaimed}
            variant={completed ? "default" : "secondary"}
          >
            {claiming
              ? "Claiming..."
              : completed
              ? tokensClaimed
                ? "Tokens claimed"
                : "Claim Tokens"
              : "In Progress"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
