const axios = require('axios');

const API = 'http://localhost:3000/api';

async function test() {
  try {
    console.log('--- Registering user ---');
    const registerRes = await axios.post(`${API}/register`, {
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
      role: 'supplier'
    });
    console.log('Register response:', registerRes.data);

    console.log('--- Logging in ---');
    const loginRes = await axios.post(`${API}/login`, {
      email: 'test@example.com',
      password: 'password123'
    });
    console.log('Login response:', loginRes.data);
    const token = loginRes.data.token;

    console.log('--- Creating product ---');
    const productRes = await axios.post(`${API}/products`, {
      name: 'Sample Product',
      description: 'A test product',
      price: 99.99
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('Create product response:', productRes.data);
    const productId = productRes.data.id || (productRes.data.data && productRes.data.data.id);

    console.log('--- Listing products ---');
    const productsRes = await axios.get(`${API}/products`);
    console.log('List products response:', productsRes.data);

    console.log('--- Creating order ---');
    const orderRes = await axios.post(`${API}/orders`, {
      productId: productId || 1
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('Create order response:', orderRes.data);

    console.log('--- Listing orders ---');
    const ordersRes = await axios.get(`${API}/orders`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('List orders response:', ordersRes.data);
  } catch (err) {
    if (err.response) {
      console.error('Error:', err.response.data);
    } else {
      console.error('Error:', err.message);
    }
  }
}

test();
