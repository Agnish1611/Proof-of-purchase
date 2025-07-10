import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, Legend } from 'recharts';
import { TrendingUp, Users, Target, Award, Eye, ShoppingBag, Plus, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';

const brandEngagementData = [
  { brand: 'Kellogg\'s', scans: 145, campaigns: 3, conversion: 78, engagement: 85 },
  { brand: 'Nature Valley', scans: 98, campaigns: 2, conversion: 65, engagement: 72 },
  { brand: 'Coca-Cola', scans: 234, campaigns: 4, conversion: 82, engagement: 91 },
  { brand: 'Nestlé', scans: 167, campaigns: 3, conversion: 71, engagement: 68 },
  { brand: 'Unilever', scans: 132, campaigns: 2, conversion: 59, engagement: 64 }
];

const monthlyScansData = [
  { month: 'Jan', scans: 420, campaigns: 8 },
  { month: 'Feb', scans: 680, campaigns: 12 },
  { month: 'Mar', scans: 890, campaigns: 15 },
  { month: 'Apr', scans: 1240, campaigns: 18 },
  { month: 'May', scans: 1680, campaigns: 22 },
  { month: 'Jun', scans: 2100, campaigns: 25 }
];

const campaignStatusData = [
  { name: 'Active', value: 18, color: '#10b981' },
  { name: 'Completed', value: 45, color: '#3b82f6' },
  { name: 'Draft', value: 12, color: '#f59e0b' },
  { name: 'Paused', value: 8, color: '#ef4444' }
];

const AdminDashboard = () => {
  const totalStats = {
    totalScans: 2876,
    activeCampaigns: 18,
    totalBrands: 12,
    avgEngagement: 76
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-600">Monitor brand engagements and campaign performance</p>
          </div>
          <Link to="/admin/create-campaign">
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Create Campaign
            </Button>
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Scans</CardTitle>
              <Eye className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{totalStats.totalScans.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">+20.1% from last month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Campaigns</CardTitle>
              <Target className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{totalStats.activeCampaigns}</div>
              <p className="text-xs text-muted-foreground">+3 from last week</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Partner Brands</CardTitle>
              <ShoppingBag className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">{totalStats.totalBrands}</div>
              <p className="text-xs text-muted-foreground">+2 new this month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Engagement</CardTitle>
              <TrendingUp className="h-4 w-4 text-amber-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-amber-600">{totalStats.avgEngagement}%</div>
              <p className="text-xs text-muted-foreground">+5.2% from last month</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Monthly Scans Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Monthly Scan Activity</CardTitle>
              <CardDescription>Scan volume and campaign count over time</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={{
                scans: { label: "Scans", color: "#3b82f6" },
                campaigns: { label: "Campaigns", color: "#10b981" }
              }} className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyScansData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="scans" fill="#3b82f6" />
                    <Bar dataKey="campaigns" fill="#10b981" />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Campaign Status Pie Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Campaign Status Distribution</CardTitle>
              <CardDescription>Current status of all campaigns</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={{
                active: { label: "Active", color: "#10b981" },
                completed: { label: "Completed", color: "#3b82f6" },
                draft: { label: "Draft", color: "#f59e0b" },
                paused: { label: "Paused", color: "#ef4444" }
              }} className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={campaignStatusData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {campaignStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <ChartTooltip content={<ChartTooltipContent />} />
                  </PieChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>

        {/* Brand Engagement Table */}
        <Card>
          <CardHeader>
            <CardTitle>Brand Engagement Overview</CardTitle>
            <CardDescription>Performance metrics for partner brands</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-4">Brand</th>
                    <th className="text-left p-4">Total Scans</th>
                    <th className="text-left p-4">Active Campaigns</th>
                    <th className="text-left p-4">Conversion Rate</th>
                    <th className="text-left p-4">Engagement Score</th>
                    <th className="text-left p-4">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {brandEngagementData.map((brand, index) => (
                    <tr key={index} className="border-b hover:bg-gray-50">
                      <td className="p-4 font-medium">{brand.brand}</td>
                      <td className="p-4">{brand.scans.toLocaleString()}</td>
                      <td className="p-4">{brand.campaigns}</td>
                      <td className="p-4">
                        <div className="flex items-center space-x-2">
                          <Progress value={brand.conversion} className="w-16 h-2" />
                          <span className="text-sm">{brand.conversion}%</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center space-x-2">
                          <Progress value={brand.engagement} className="w-16 h-2" />
                          <span className="text-sm">{brand.engagement}%</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <Badge 
                          variant={brand.engagement > 80 ? "default" : brand.engagement > 60 ? "secondary" : "destructive"}
                        >
                          {brand.engagement > 80 ? "Excellent" : brand.engagement > 60 ? "Good" : "Needs Attention"}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;