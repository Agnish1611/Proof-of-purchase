import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Home, Target, History, Trophy, Wallet, Menu, User, LogOut } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';

const Layout = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const { user, logout } = useAuth();
  const { toast } = useToast();

  const navigation = [
    { name: 'Dashboard', href: '/', icon: Home },
    { name: 'Campaigns', href: '/campaigns', icon: Target },
    { name: 'Scan History', href: '/scan-history', icon: History },
    { name: 'Loyalty Tier', href: '/loyalty-tier', icon: Trophy },
  ];

  const handleLogout = async () => {
    await logout();
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
  };

  const NavItems = ({ mobile = false }) => (
    <nav className={`${mobile ? 'flex flex-col space-y-2' : 'hidden md:flex md:space-x-1'}`}>
      {navigation.map((item) => {
        const Icon = item.icon;
        return (
          <NavLink
            key={item.name}
            to={item.href}
            className={({ isActive }) =>
              `flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              } ${mobile ? 'w-full' : ''}`
            }
            onClick={() => mobile && setIsMobileMenuOpen(false)}
          >
            <Icon className="h-4 w-4" />
            {item.name}
          </NavLink>
        );
      })}
    </nav>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center">
                <Trophy className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-lg font-bold">LoyaltyChain</h1>
                <p className="text-xs text-muted-foreground hidden sm:block">
                  Solana Rewards DApp
                </p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <NavItems />

            {/* User & Mobile Menu */}
            <div className="flex items-center gap-2">
              {/* User Info */}
              <div className="hidden sm:flex items-center gap-2">
                <div className="flex items-center gap-2 px-3 py-1 bg-muted rounded-md">
                  <User className="h-4 w-4" />
                  <span className="text-sm font-medium">{user?.username}</span>
                </div>
                <Button variant="outline" size="sm" onClick={handleLogout}>
                  <LogOut className="h-4 w-4 mr-1" />
                  Logout
                </Button>
              </div>

              {/* Mobile Menu */}
              <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" size="icon" className="md:hidden">
                    <Menu className="h-4 w-4" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-64">
                  <div className="space-y-4">
                    <div className="border-b pb-4">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="h-6 w-6 bg-primary rounded flex items-center justify-center">
                          <Trophy className="h-4 w-4 text-primary-foreground" />
                        </div>
                        <span className="font-bold">LoyaltyChain</span>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Solana Rewards DApp
                      </div>
                    </div>
                    
                    <NavItems mobile />
                    
                    <div className="border-t pt-4 space-y-2">
                      <div className="flex items-center gap-2 p-2 bg-muted rounded-md">
                        <User className="h-4 w-4" />
                        <span className="text-sm font-medium">{user?.username}</span>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full justify-start gap-2"
                        onClick={handleLogout}
                      >
                        <LogOut className="h-4 w-4" />
                        Logout
                      </Button>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="border-t bg-muted/50 mt-12">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 bg-primary rounded flex items-center justify-center">
                <Trophy className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="font-semibold">LoyaltyChain</span>
              <Badge variant="secondary" className="text-xs">
                Powered by Solana
              </Badge>
            </div>
            <div className="text-sm text-muted-foreground text-center md:text-right">
              <p>Earn rewards by scanning products</p>
              <p className="text-xs">Built with Anchor Framework</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
