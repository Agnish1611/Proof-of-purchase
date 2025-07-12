const API_BASE_URL = 'http://localhost:3000/api';

class CampaignService {
  async createCampaign(data: {
    title: string;
    brand: string;
    required_skus: string[];
    scan_count_required: number;
    reward_tokens: number;
    start_time: string; // ISO string or formatted date
    end_time: string;   // ISO string or formatted date
    status: string;     // e.g., 'active', 'draft'
  }) {
    const response = await fetch(`${API_BASE_URL}/campaigns`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to create campaign');
    }

    return response.json();
  }

  async getCampaigns() {
    const response = await fetch(`${API_BASE_URL}/campaigns`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch campaigns');
    }

    return response.json();
  }

  async getProgress(userWallet: string, campaignId: string) {
    const response = await fetch(
      `${API_BASE_URL}/campaign/progress/${userWallet}/${campaignId}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch campaign progress');
    }

    return response.json();
  }

  async updateProgress(data: {
    userPublicKey: string;
    campaignId: string;
    scannedSKU: string;
  }) {
    console.log('update progress service called');
    const response = await fetch(`${API_BASE_URL}/campaign/progress`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to update campaign progress');
    }

    return response.json();
  }
}

export const campaignService = new CampaignService();
