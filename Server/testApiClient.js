const axios = require('axios');

const API = 'http://localhost:3000/api';

async function testAll() {
  try {
    // console.log('\n--- Registering user ---');
    // const registerRes = await axios.post(`${API}/auth/register`, {
    //   username: 'apitestuser',
    //   email: 'apitestuser@example.com',
    //   password: 'apitestpass123'
    // });
    // console.log('Register response:', registerRes.data);

    console.log('\n--- Logging in ---');
    const loginRes = await axios.post(`${API}/auth/login`, {
      email: 'apitestuser@example.com',
      password: 'apitestpass123'
    });
    console.log('Login response:', loginRes.data);
    const token = loginRes.data.data && loginRes.data.data.token ? loginRes.data.data.token : (loginRes.data.token || '');
    const cookie = loginRes.headers['set-cookie'] ? loginRes.headers['set-cookie'][0] : '';

    // Auth headers for protected routes
    const authHeaders = cookie ? { headers: { Cookie: cookie } } : { headers: { Authorization: `Bearer ${token}` } };

    console.log('\n--- Get Profile (protected) ---');
    const profileRes = await axios.get(`${API}/auth/profile`, authHeaders);
    console.log('Profile response:', profileRes.data);

    console.log('\n--- Update Profile (protected) ---');
    const updateProfileRes = await axios.put(`${API}/auth/profile`, { username: 'apitestuser2' }, authHeaders);
    console.log('Update profile response:', updateProfileRes.data);

    // console.log('\n--- Change Password (protected) ---');
    // const changePasswordRes = await axios.put(`${API}/auth/change-password`, { oldPassword: 'apitestpass123', newPassword: 'apitestpass456' }, authHeaders);
    // console.log('Change password response:', changePasswordRes.data);

    // console.log('\n--- Get All Users (admin only, should fail for normal user) ---');
    // try {
    //   const usersRes = await axios.get(`${API}/users`, authHeaders);
    //   console.log('All users response:', usersRes.data);
    // } catch (err) {
    //   console.log('All users (expected fail):', err.response ? err.response.data : err.message);
    // }

    console.log('\n--- Logout ---');
    const logoutRes = await axios.post(`${API}/auth/logout`, {}, authHeaders);
    console.log('Logout response:', logoutRes.data);

    // --- Create Product ---
    console.log('\n--- Create Product ---');
    const productData = {
      name: 'Test Product',
      sku: 'SKU12345',
      brand: 'TestBrand',
      category: 'Electronics',
      has_warranty: true,
      warranty_days: 365
    };
    const createProductRes = await axios.post(`${API}/products`, productData, authHeaders);
    console.log('Create product response:', createProductRes.data);

    // --- Create Campaign ---
    console.log('\n--- Create Campaign ---');
    const campaignData = {
      title: 'Test Campaign',
      brand: 'TestBrand',
      required_skus: ['SKU12345', 'SKU67890'],
      scan_count_required: 10,
      reward_tokens: 100,
      start_time: new Date().toISOString(),
      end_time: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'active'
    };
    const createCampaignRes = await axios.post(`${API}/campaigns/scan`, campaignData, authHeaders);
    console.log('Create campaign response:', createCampaignRes.data);

  } catch (err) {
    if (err.response) {
      console.error('Error:', err.response.data);
    } else {
      console.error('Error:', err.message);
    }
  }
}

testAll();
