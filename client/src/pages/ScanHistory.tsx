
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Filter, Download, Calendar, Package } from 'lucide-react';

const ScanHistory = () => {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [dateFilter, setDateFilter] = React.useState('all');

  // Mock data - replace with actual API calls
  const scans = [
    {
      id: 1,
      sku: "12345678901",
      productName: "MacBook Pro 16-inch",
      brand: "Apple",
      timestamp: "2024-07-08T14:30:00Z",
      warrantyDuration: "12 months",
      tokensEarned: 50,
      campaignName: "Electronics Week"
    },
    {
      id: 2,
      sku: "98765432109",
      productName: "Wireless Headphones",
      brand: "Sony",
      timestamp: "2024-07-07T09:15:00Z",
      warrantyDuration: "24 months",
      tokensEarned: 25,
      campaignName: "Back to School"
    },
    {
      id: 3,
      sku: "11223344556",
      productName: "Gaming Mouse",
      brand: "Logitech",
      timestamp: "2024-07-06T16:45:00Z",
      warrantyDuration: "36 months",
      tokensEarned: 15,
      campaignName: null
    },
    {
      id: 4,
      sku: "66778899001",
      productName: "USB-C Cable",
      brand: "Anker",
      timestamp: "2024-07-05T11:20:00Z",
      warrantyDuration: "18 months",
      tokensEarned: 10,
      campaignName: "Electronics Week"
    },
    {
      id: 5,
      sku: "44556677889",
      productName: "Bluetooth Speaker",
      brand: "JBL",
      timestamp: "2024-07-04T13:10:00Z",
      warrantyDuration: "12 months",
      tokensEarned: 30,
      campaignName: "Summer Sale"
    }
  ];

  const filteredScans = scans.filter(scan => {
    if (searchTerm && 
        !scan.sku.includes(searchTerm) && 
        !scan.productName.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !scan.brand.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    
    if (dateFilter !== 'all') {
      const scanDate = new Date(scan.timestamp);
      const now = new Date();
      const daysDiff = Math.floor((now.getTime() - scanDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (dateFilter === 'week' && daysDiff > 7) return false;
      if (dateFilter === 'month' && daysDiff > 30) return false;
    }
    
    return true;
  });

  const totalTokensEarned = filteredScans.reduce((sum, scan) => sum + scan.tokensEarned, 0);

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-background p-4 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Scan History</h1>
          <p className="text-muted-foreground">
            View all your product scans and earned rewards
          </p>
        </div>
        
        <Button variant="outline" className="w-fit">
          <Download className="h-4 w-4 mr-2" />
          Export Data
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Scans</p>
                <p className="text-2xl font-bold">{filteredScans.length}</p>
              </div>
              <Package className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Tokens Earned</p>
                <p className="text-2xl font-bold">{totalTokensEarned}</p>
              </div>
              <Calendar className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg per Scan</p>
                <p className="text-2xl font-bold">
                  {filteredScans.length > 0 ? Math.round(totalTokensEarned / filteredScans.length) : 0}
                </p>
              </div>
              <Filter className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by SKU, product name, or brand..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div className="flex gap-2">
              <Button 
                variant={dateFilter === 'all' ? 'default' : 'outline'} 
                size="sm"
                onClick={() => setDateFilter('all')}
              >
                All Time
              </Button>
              <Button 
                variant={dateFilter === 'week' ? 'default' : 'outline'} 
                size="sm"
                onClick={() => setDateFilter('week')}
              >
                This Week
              </Button>
              <Button 
                variant={dateFilter === 'month' ? 'default' : 'outline'} 
                size="sm"
                onClick={() => setDateFilter('month')}
              >
                This Month
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Scans Table */}
      <Card>
        <CardHeader>
          <CardTitle>Scan Records</CardTitle>
          <CardDescription>
            Detailed history of all your product scans
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>SKU</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>Brand</TableHead>
                  <TableHead>Date & Time</TableHead>
                  <TableHead>Warranty</TableHead>
                  <TableHead>Campaign</TableHead>
                  <TableHead className="text-right">Tokens</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredScans.map((scan) => (
                  <TableRow key={scan.id}>
                    <TableCell className="font-mono text-sm">
                      {scan.sku}
                    </TableCell>
                    <TableCell className="font-medium">
                      {scan.productName}
                    </TableCell>
                    <TableCell>{scan.brand}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {formatDate(scan.timestamp)}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-xs">
                        {scan.warrantyDuration}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {scan.campaignName ? (
                        <Badge variant="secondary" className="text-xs">
                          {scan.campaignName}
                        </Badge>
                      ) : (
                        <span className="text-muted-foreground text-sm">-</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right font-semibold">
                      +{scan.tokensEarned}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          
          {filteredScans.length === 0 && (
            <div className="text-center py-8">
              <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No scans found</h3>
              <p className="text-muted-foreground">Try adjusting your search or date filters</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ScanHistory;
