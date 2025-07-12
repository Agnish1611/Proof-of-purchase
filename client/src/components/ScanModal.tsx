import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useWallet } from "@solana/wallet-adapter-react";
import { useProgram } from "@/utils/connection";
import { logScan } from "@/utils/instructions";
import { scanService } from "@/services/scanService";
import { campaignService } from "@/services/campaignService"; // 👈 make sure this is imported

interface ScanModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ScanModal: React.FC<ScanModalProps> = ({ open, onOpenChange }) => {
  const [sku, setSku] = useState("");
  const [warrantyDays, setWarrantyDays] = useState<number>(0);
  const [loading, setLoading] = useState(false);

  const wallet = useWallet();
  const { program } = useProgram();

  const handleScan = async () => {
    if (!sku || !wallet.publicKey || !program) return;

    setLoading(true);
    try {
      // ✅ Step 1: Log the on-chain scan (optional if needed for history)
      await logScan(program, wallet as any, sku, warrantyDays);

      // ✅ Step 2: Log the scan off-chain
      await scanService.scanProduct({
        wallet_address: wallet.publicKey.toBase58(),
        sku,
        location: "India",
      });

      // ✅ Step 3: Fetch all campaigns
      const campaignRes = await campaignService.getCampaigns();
      const allCampaigns = campaignRes.data;

      console.log('@All campaigns: ', allCampaigns);

      // ✅ Step 4: Filter campaigns with this SKU
      const matchedCampaigns = allCampaigns.filter((campaign: any) =>
        campaign.required_skus.includes(sku)
      );

      console.log('@matched_campaigns: ', matchedCampaigns);

      // ✅ Step 5: Update progress in each matched campaign
      await Promise.all(
        matchedCampaigns.map((campaign: any) =>
          campaignService.updateProgress({
            userPublicKey: wallet.publicKey!.toBase58(),
            campaignId: campaign._id,
            scannedSKU: sku,
          }).catch((err) => {
            console.error(`Failed to update progress for campaign ${campaign._id}`, err);
          })
        )
      );

      setSku("");
      setWarrantyDays(0);
      onOpenChange(false);
    } catch (err) {
      console.error("Failed to scan product:", err);
      alert("Failed to scan product. See console for details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Scan Product</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <Input
            placeholder="Product SKU"
            value={sku}
            onChange={(e) => setSku(e.target.value)}
          />
          <Input
            type="number"
            placeholder="Warranty (days)"
            value={warrantyDays}
            onChange={(e) => setWarrantyDays(parseInt(e.target.value))}
          />
          <Button onClick={handleScan} disabled={loading || !sku}>
            {loading ? "Scanning..." : "Scan Product"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};