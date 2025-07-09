import React, { useState } from 'react';
import { LoginForm } from '@/components/auth/LoginForm';
import { RegistrationForm } from '@/components/auth/RegistrationForm';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { Trophy } from 'lucide-react';

export const Auth: React.FC = () => {
  const [isLogin, setIsLogin] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 to-secondary/10">
      {/* Navbar */}
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

            {/* Wallet Button */}
            <WalletMultiButton className="!bg-primary !text-white !rounded-md" />
          </div>
        </div>
      </header>

      {/* Auth Body */}
      <div className="flex items-center justify-center p-4">
        <div className="w-full max-w-md space-y-6">
          {/* Auth Forms */}
          {isLogin ? (
            <LoginForm onSwitchToRegister={() => setIsLogin(false)} />
          ) : (
            <RegistrationForm onSwitchToLogin={() => setIsLogin(true)} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Auth;
