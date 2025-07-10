import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trophy, Target, CheckCircle, Lock } from 'lucide-react';
import { campaignService } from '@/services/campaignService';
import { useWallet } from '@solana/wallet-adapter-react';

interface Campaign {
  _id: string;
  title: string;
  brand: string;
  scan_count_required: number;
  reward_tokens: number;
  status: 'active' | 'completed' | 'locked';
}

interface CampaignCardProps {
  campaign: Campaign;
}

export const CampaignCard = ({ campaign }: CampaignCardProps) => {
  const wallet = useWallet();
  const [progress, setProgress] = useState<number>(0);
  const [completed, setCompleted] = useState<boolean>(false);

  const requiredScans = campaign.scan_count_required;
  const progressPercentage = (progress / requiredScans) * 100;

  const getStatusIcon = () => {
    if (completed) return <CheckCircle className="h-4 w-4 text-green-500" />;
    if (campaign.status === 'locked') return <Lock className="h-4 w-4 text-muted-foreground" />;
    return <Target className="h-4 w-4 text-blue-500" />;
  };

  const getStatusBadge = () => {
    if (completed) return <Badge className="bg-green-100 text-green-800">Completed</Badge>;
    if (campaign.status === 'locked') return <Badge variant="secondary">Locked</Badge>;
    return <Badge className="bg-blue-100 text-blue-800">Active</Badge>;
  };

  const fetchProgress = async () => {
    if (!wallet.publicKey) return;
    try {
      const res = await campaignService.getProgress(wallet.publicKey.toBase58(), campaign._id);
      const data = res.data;

      setProgress(data.scan_count);
      setCompleted(data.completed);
    } catch (err) {
      console.error('Failed to fetch campaign progress', err);
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
        <CardDescription className="text-sm">by {campaign.brand}</CardDescription>
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
            disabled={!completed}
            variant={completed ? 'default' : 'secondary'}
          >
            {completed ? 'Claim Tokens' : 'In Progress'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};