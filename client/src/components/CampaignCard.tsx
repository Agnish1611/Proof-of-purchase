
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trophy, Target, CheckCircle, Lock } from 'lucide-react';

interface Campaign {
  id: number;
  title: string;
  brand: string;
  requiredScans: number;
  reward: number;
  status: 'active' | 'completed' | 'locked';
  progress: number;
}

interface CampaignCardProps {
  campaign: Campaign;
}

export const CampaignCard = ({ campaign }: CampaignCardProps) => {
  const progressPercentage = (campaign.progress / campaign.requiredScans) * 100;
  
  const getStatusIcon = () => {
    switch (campaign.status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'locked':
        return <Lock className="h-4 w-4 text-muted-foreground" />;
      default:
        return <Target className="h-4 w-4 text-blue-500" />;
    }
  };

  const getStatusBadge = () => {
    switch (campaign.status) {
      case 'completed':
        return <Badge variant="default" className="bg-green-100 text-green-800">Completed</Badge>;
      case 'locked':
        return <Badge variant="secondary">Locked</Badge>;
      default:
        return <Badge variant="default" className="bg-blue-100 text-blue-800">Active</Badge>;
    }
  };

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
            {campaign.progress}/{campaign.requiredScans} scans
          </span>
        </div>
        
        <Progress value={progressPercentage} className="h-2" />
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Trophy className="h-4 w-4" />
            <span>{campaign.reward} tokens</span>
          </div>
          
          <Button 
            size="sm" 
            disabled={campaign.status === 'completed' || campaign.status === 'locked'}
            variant={campaign.status === 'completed' ? 'secondary' : 'default'}
          >
            {campaign.status === 'completed' ? 'Completed' : 
             campaign.status === 'locked' ? 'Locked' : 'Join Campaign'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
