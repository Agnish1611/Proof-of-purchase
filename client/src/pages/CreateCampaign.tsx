import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { Plus, X, Calendar as CalendarIcon } from "lucide-react";

import { campaignService } from "@/services/campaignService";
import { initialize_campaign } from "@/utils/instructions";

import { PublicKey } from "@solana/web3.js";
import { useWallet } from "@solana/wallet-adapter-react";
import { useProgram } from "@/utils/connection";

const CreateCampaign = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { publicKey, signTransaction } = useWallet();
  const { program } = useProgram();

  const [formData, setFormData] = useState({
    title: "",
    brand: "",
    requiredSkus: [] as string[],
    scanCountRequired: 1,
    rewardTokens: 0,
    startDate: undefined as Date | undefined,
    endDate: undefined as Date | undefined,
    tokenMint: "",
  });

  const [skuInput, setSkuInput] = useState("");

  const handleChange = (field: keyof typeof formData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const addSku = () => {
    if (skuInput.trim() && !formData.requiredSkus.includes(skuInput.trim())) {
      handleChange("requiredSkus", [...formData.requiredSkus, skuInput.trim()]);
      setSkuInput("");
    }
  };

  const removeSku = (sku: string) => {
    handleChange(
      "requiredSkus",
      formData.requiredSkus.filter((s) => s !== sku)
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.title ||
      !formData.brand ||
      !formData.startDate ||
      !formData.endDate ||
      !formData.tokenMint
    ) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    try {
      const campaignData = {
        title: formData.title,
        brand: formData.brand,
        required_skus: formData.requiredSkus,
        scan_count_required: formData.scanCountRequired,
        reward_tokens: formData.rewardTokens,
        start_time: formData.startDate.toISOString(),
        end_time: formData.endDate.toISOString(),
        status: "active",
      };

      // Solana on-chain write
      await initialize_campaign({
        program,
        wallet: publicKey!,
        campaign_id: formData.title, // Unique identifier
        brand: formData.brand,
        required_skus: formData.requiredSkus,
        scan_count_req: formData.scanCountRequired,
        reward_tokens: formData.rewardTokens,
        token_mint: new PublicKey(formData.tokenMint),
        start_date: Math.floor(formData.startDate.getTime() / 1000),
        end_date: Math.floor(formData.endDate.getTime() / 1000),
      });

      // Backend DB write
      await campaignService.createCampaign(campaignData);

      toast({
        title: "Campaign Created",
        description: "Your campaign was created successfully.",
      });
      navigate("/admin");
    } catch (err) {
      console.error(err);
      toast({
        title: "Error",
        description: "Failed to create campaign",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6">Create New Campaign</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <Label>Campaign Title *</Label>
          <Input
            value={formData.title}
            onChange={(e) => handleChange("title", e.target.value)}
          />
        </div>

        <div>
          <Label>Brand *</Label>
          <Input
            value={formData.brand}
            onChange={(e) => handleChange("brand", e.target.value)}
          />
        </div>

        <div>
          <Label>Reward Tokens *</Label>
          <Input
            type="number"
            value={formData.rewardTokens}
            onChange={(e) =>
              handleChange("rewardTokens", parseInt(e.target.value))
            }
          />
        </div>

        <div>
          <Label>Scan Count Required *</Label>
          <Input
            type="number"
            value={formData.scanCountRequired}
            onChange={(e) =>
              handleChange("scanCountRequired", parseInt(e.target.value))
            }
          />
        </div>

        <div>
          <Label>Token Mint Address *</Label>
          <Input
            value={formData.tokenMint}
            onChange={(e) => handleChange("tokenMint", e.target.value)}
          />
        </div>

        {/* SKU List */}
        <div>
          <Label>Required SKUs *</Label>
          <div className="flex gap-2">
            <Input
              value={skuInput}
              onChange={(e) => setSkuInput(e.target.value)}
              placeholder="Add SKU..."
            />
            <Button type="button" onClick={addSku}>
              <Plus size={16} />
            </Button>
          </div>
          <div className="flex gap-2 mt-2 flex-wrap">
            {formData.requiredSkus.map((sku, idx) => (
              <span
                key={idx}
                className="flex items-center gap-1 px-2 py-1 border rounded bg-gray-100"
              >
                {sku}
                <X
                  className="h-3 w-3 cursor-pointer"
                  onClick={() => removeSku(sku)}
                />
              </span>
            ))}
          </div>
        </div>

        {/* Dates */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Start Date *</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left",
                    !formData.startDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.startDate
                    ? format(formData.startDate, "PPP")
                    : "Select date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent align="start">
                <Calendar
                  mode="single"
                  selected={formData.startDate}
                  onSelect={(date) => handleChange("startDate", date)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div>
            <Label>End Date *</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left",
                    !formData.endDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.endDate
                    ? format(formData.endDate, "PPP")
                    : "Select date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent align="start">
                <Calendar
                  mode="single"
                  selected={formData.endDate}
                  onSelect={(date) => handleChange("endDate", date)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <Button
          type="submit"
          className="bg-blue-600 text-white hover:bg-blue-700"
        >
          Create Campaign
        </Button>
      </form>
    </div>
  );
};

export default CreateCampaign;
