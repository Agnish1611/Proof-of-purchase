import { useMemo } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./hooks/use-auth";
import { ProtectedRoute } from "./components/ProtectedRoute";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Campaigns from "./pages/Campaigns";
import ScanHistory from "./pages/ScanHistory";
import LoyaltyTier from "./pages/LoyaltyTier";
import NotFound from "./pages/NotFound";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
} from "@solana/wallet-adapter-wallets";
import { clusterApiUrl } from "@solana/web3.js";

import "@solana/wallet-adapter-react-ui/styles.css";
import AdminDashboard from "./pages/AdminDashboard";
import CreateCampaign from "./pages/CreateCampaign";

const queryClient = new QueryClient();

const App = () => {
  const endpoint = clusterApiUrl("devnet");
  const wallets = useMemo(
    () => [new PhantomWalletAdapter(), new SolflareWalletAdapter()],
    []
  );

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <QueryClientProvider client={queryClient}>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <AuthProvider>
                <BrowserRouter>
                  <ProtectedRoute>
                    <Routes>
                      <Route path="/" element={<Layout />}>
                        <Route index element={<Dashboard />} />
                        <Route path="campaigns" element={<Campaigns />} />
                        <Route path="scan-history" element={<ScanHistory />} />
                        <Route path="loyalty-tier" element={<LoyaltyTier />} />
                      </Route>
                      
                      {/* Admin Routes */}
                      <Route path="/admin" element={<AdminDashboard />} />
                      <Route
                        path="/admin/create-campaign"
                        element={<CreateCampaign />}
                      />
                      
                      {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </ProtectedRoute>
                </BrowserRouter>
              </AuthProvider>
            </TooltipProvider>
          </QueryClientProvider>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};

export default App;
