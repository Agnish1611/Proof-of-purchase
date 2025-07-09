
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trophy, Star, Crown, Gift, Zap, Target } from 'lucide-react';

const LoyaltyTier = () => {
  // Mock data - replace with actual API calls
  const userTierData = {
    currentTier: "Silver",
    currentScans: 47,
    nextTier: "Gold",
    scansToNextTier: 13,
    totalTokensEarned: 2450,
    tierUpgrades: [
      { tier: "Bronze", date: "2024-01-15", scans: 10 },
      { tier: "Silver", date: "2024-03-22", scans: 30 }
    ]
  };

  const tiers = [
    {
      name: "Bronze",
      icon: Trophy,
      color: "text-amber-600",
      bgColor: "bg-amber-50",
      borderColor: "border-amber-200",
      scansRequired: 10,
      perks: [
        "Basic token rewards",
        "Access to general campaigns",
        "Monthly newsletters"
      ],
      multiplier: "1x"
    },
    {
      name: "Silver",
      icon: Star,
      color: "text-gray-600",
      bgColor: "bg-gray-50",
      borderColor: "border-gray-200",
      scansRequired: 30,
      perks: [
        "1.5x token multiplier",
        "Priority campaign access",
        "Exclusive silver campaigns",
        "Weekly bonus rewards"
      ],
      multiplier: "1.5x"
    },
    {
      name: "Gold",
      icon: Crown,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
      borderColor: "border-yellow-200",
      scansRequired: 60,
      perks: [
        "2x token multiplier",
        "VIP campaign access",
        "Premium support",
        "Monthly exclusive rewards",
        "Special brand partnerships"
      ],
      multiplier: "2x"
    }
  ];

  const getCurrentTierIndex = () => {
    return tiers.findIndex(tier => tier.name === userTierData.currentTier);
  };

  const getNextTierIndex = () => {
    const currentIndex = getCurrentTierIndex();
    return currentIndex < tiers.length - 1 ? currentIndex + 1 : currentIndex;
  };

  const calculateProgress = () => {
    const currentTierIndex = getCurrentTierIndex();
    if (currentTierIndex === tiers.length - 1) return 100; // Max tier reached
    
    const currentTierScans = currentTierIndex > 0 ? tiers[currentTierIndex - 1].scansRequired : 0;
    const nextTierScans = tiers[currentTierIndex + 1].scansRequired;
    const progress = ((userTierData.currentScans - currentTierScans) / (nextTierScans - currentTierScans)) * 100;
    
    return Math.min(100, Math.max(0, progress));
  };

  const currentTierIndex = getCurrentTierIndex();
  const nextTierIndex = getNextTierIndex();
  const progress = calculateProgress();

  return (
    <div className="min-h-screen bg-background p-4 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Loyalty Tier System</h1>
        <p className="text-muted-foreground">
          Scan more products to unlock higher tiers and better rewards
        </p>
      </div>

      {/* Current Status */}
      <Card className="relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 opacity-10">
          {React.createElement(tiers[currentTierIndex].icon, { 
            className: `w-full h-full ${tiers[currentTierIndex].color}` 
          })}
        </div>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {React.createElement(tiers[currentTierIndex].icon, { 
                className: `h-8 w-8 ${tiers[currentTierIndex].color}` 
              })}
              <div>
                <CardTitle className="text-2xl">
                  {userTierData.currentTier} Tier
                </CardTitle>
                <CardDescription>
                  {userTierData.currentScans} scans completed
                </CardDescription>
              </div>
            </div>
            <Badge 
              variant="secondary" 
              className={`${tiers[currentTierIndex].bgColor} ${tiers[currentTierIndex].color} text-sm px-3 py-1`}
            >
              {tiers[currentTierIndex].multiplier} rewards
            </Badge>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {currentTierIndex < tiers.length - 1 && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progress to {userTierData.nextTier}</span>
                <span className="font-medium">
                  {userTierData.scansToNextTier} scans remaining
                </span>
              </div>
              <Progress value={progress} className="h-3" />
              <p className="text-center text-sm text-muted-foreground">
                {Math.round(progress)}% complete
              </p>
            </div>
          )}
          
          {currentTierIndex === tiers.length - 1 && (
            <div className="text-center py-4">
              <Crown className="h-12 w-12 text-yellow-500 mx-auto mb-2" />
              <p className="text-lg font-semibold">Congratulations! 🎉</p>
              <p className="text-muted-foreground">You've reached the highest tier</p>
            </div>
          )}
          
          <div className="text-center">
            <Button className="gap-2">
              <Target className="h-4 w-4" />
              Keep Scanning!
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Tier Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {tiers.map((tier, index) => {
          const isCurrentTier = tier.name === userTierData.currentTier;
          const isUnlocked = index <= currentTierIndex;
          const TierIcon = tier.icon;
          
          return (
            <Card 
              key={tier.name} 
              className={`relative transition-all ${
                isCurrentTier 
                  ? `ring-2 ring-primary ${tier.bgColor}` 
                  : isUnlocked 
                    ? 'hover:shadow-md' 
                    : 'opacity-60'
              }`}
            >
              {isCurrentTier && (
                <div className="absolute -top-2 -right-2">
                  <Badge className="bg-primary text-primary-foreground">Current</Badge>
                </div>
              )}
              
              <CardHeader className="text-center">
                <div className={`mx-auto p-3 rounded-full ${tier.bgColor} ${tier.borderColor} border-2 w-fit`}>
                  <TierIcon className={`h-8 w-8 ${tier.color}`} />
                </div>
                <CardTitle className="text-xl">{tier.name}</CardTitle>
                <CardDescription>
                  {tier.scansRequired} scans required
                </CardDescription>
                <Badge variant="outline" className="w-fit mx-auto">
                  {tier.multiplier} token multiplier
                </Badge>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-3">
                  <h4 className="font-semibold text-sm flex items-center gap-2">
                    <Gift className="h-4 w-4" />
                    Perks & Benefits
                  </h4>
                  <ul className="space-y-2">
                    {tier.perks.map((perk, perkIndex) => (
                      <li key={perkIndex} className="text-sm flex items-start gap-2">
                        <Zap className="h-3 w-3 text-green-500 mt-1 flex-shrink-0" />
                        {perk}
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Tier History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5" />
            Tier Upgrade History
          </CardTitle>
          <CardDescription>
            Your journey through the loyalty tiers
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {userTierData.tierUpgrades.map((upgrade, index) => (
              <div key={index} className="flex items-center gap-4 p-3 bg-muted rounded-lg">
                <div className="flex-shrink-0">
                  <Badge variant="secondary">{upgrade.tier}</Badge>
                </div>
                <div className="flex-1">
                  <p className="font-medium">Upgraded to {upgrade.tier} tier</p>
                  <p className="text-sm text-muted-foreground">
                    Reached {upgrade.scans} scans on {new Date(upgrade.date).toLocaleDateString()}
                  </p>
                </div>
                <Trophy className="h-5 w-5 text-amber-500" />
              </div>
            )).reverse()}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoyaltyTier;
