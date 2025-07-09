const API_BASE_URL = 'http://localhost:3000/api';

class ScanService {
  async getUserScans(walletAddress: string) {
    const response = await fetch(`${API_BASE_URL}/scans/${walletAddress}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch scan data');
    }

    return response.json();
  }

  async scanProduct(data: {
    wallet_address: string;
    sku: string;
    location?: string;
  }) {
    const response = await fetch(`${API_BASE_URL}/scan`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to scan product');
    }

    return response.json();
  }
}

export const scanService = new ScanService();
