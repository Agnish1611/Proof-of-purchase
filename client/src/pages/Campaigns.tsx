import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Search, Trophy, Calendar, Users, Target, CheckCircle, Lock } from "lucide-react";

const Campaigns = () => {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [filter, setFilter] = React.useState("all");

  // Mock data - replace with actual API calls
  const campaigns = [
    {
      id: 1,
      title: "Test Campaign",
      brand: "TestBrand",
      requiredScans: 10,
      reward: 100,
      status: "active" as const,
      progress: 0,
      description: "Scan products to participate in the Test Campaign.",
      endDate: "2025-08-01",
      participants: 0,
    },
    {
      id: 2,
      title: "Buy 10 pepsi in 3 days",
      brand: "Pepsi",
      requiredScans: 10,
      reward: 20,
      status: "active" as const,
      progress: 0,
      description: "Scan Pepsi products within 3 days.",
      endDate: "2025-08-02",
      participants: 2,
    },
    {
      id: 3,
      title: "CokeCampaign",
      brand: "CocaCola",
      requiredScans: 12,
      reward: 50,
      status: "completed" as const,
      progress: 12,
      description: "Completed campaign for CocaCola lovers.",
      endDate: "2025-07-12",
      participants: 2,
    },
    {
      id: 4,
      title: "Premium Member Exclusive",
      brand: "Costco",
      requiredScans: 15,
      reward: 500,
      status: "locked" as const,
      progress: 0,
      description: "Exclusive for Commander tier members",
      endDate: "2024-08-30",
      participants: 0,
    },
  ];

  const filteredCampaigns = campaigns.filter((campaign) => {
    if (filter !== "all" && campaign.status !== filter) return false;
    if (
      searchTerm &&
      !campaign.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !campaign.brand.toLowerCase().includes(searchTerm.toLowerCase())
    )
      return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-background p-4 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Campaigns</h1>
          <p className="text-muted-foreground">
            Join campaigns to earn rewards by scanning products
          </p>
        </div>

        {/* Search and Filter */}
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search campaigns..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
          <div className="flex gap-1">
            <Button
              variant={filter === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("all")}
            >
              All
            </Button>
            <Button
              variant={filter === "active" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("active")}
            >
              Active
            </Button>
            <Button
              variant={filter === "completed" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("completed")}
            >
              Completed
            </Button>
          </div>
        </div>
      </div>

      {/* Campaign Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Active Campaigns
                </p>
                <p className="text-2xl font-bold">
                  {campaigns.filter((c) => c.status === "active").length}
                </p>
              </div>
              <Trophy className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Completed
                </p>
                <p className="text-2xl font-bold">
                  {campaigns.filter((c) => c.status === "completed").length}
                </p>
              </div>
              <Calendar className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Total Participants
                </p>
                <p className="text-2xl font-bold">
                  {campaigns
                    .reduce((sum, c) => sum + c.participants, 0)
                    .toLocaleString()}
                </p>
              </div>
              <Users className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Campaigns Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCampaigns.map((campaign) => (
          <div key={campaign.id} className="space-y-2">
            <MockCampaignCard campaign={campaign} />
            <Card className="p-4 bg-muted/50">
              <div className="text-sm space-y-2">
                <p className="text-muted-foreground">{campaign.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-muted-foreground">
                    Ends: {new Date(campaign.endDate).toLocaleDateString()}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {campaign.participants} participants
                  </span>
                </div>
              </div>
            </Card>
          </div>
        ))}
      </div>

      {filteredCampaigns.length === 0 && (
        <div className="text-center py-12">
          <Trophy className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No campaigns found</h3>
          <p className="text-muted-foreground">
            Try adjusting your search or filters
          </p>
        </div>
      )}
    </div>
  );
};

const MockCampaignCard = ({ campaign }: { campaign: any }) => {
  const scansDone = Math.min(campaign.progress ?? 0, campaign.requiredScans ?? 0);
  const totalScans = campaign.requiredScans ?? 0;
  const progressPercentage = totalScans ? (scansDone / totalScans) * 100 : 0;

  const getStatusIcon = () => {
    if (campaign.status === "completed") {
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    }
    if (campaign.status === "locked") {
      return <Lock className="h-4 w-4 text-muted-foreground" />;
    }
    return <Target className="h-4 w-4 text-blue-500" />;
  };

  const getStatusBadge = () => {
    if (campaign.status === "completed") {
      return <Badge className="bg-green-100 text-green-800">Completed</Badge>;
    }
    if (campaign.status === "locked") {
      return <Badge variant="secondary">Locked</Badge>;
    }
    return <Badge className="bg-blue-100 text-blue-800">Active</Badge>;
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
        <CardDescription className="text-sm">by {campaign.brand}</CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Progress</span>
          <span className="font-medium">
            {scansDone}/{totalScans} scans
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
            disabled
            variant={
              campaign.status === "completed" ? "default" : "secondary"
            }
          >
            {campaign.status === "completed"
              ? "Tokens claimed"
              : campaign.status === "locked"
              ? "Locked"
              : "In Progress"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default Campaigns;