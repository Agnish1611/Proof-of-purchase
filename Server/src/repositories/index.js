// This is a placeholder for repository logic
// Example: Database access, data persistence, etc.

// In-memory mock DB
const { User, Product, Order } = require('../entities');
const bcrypt = require('bcrypt');
const users = [];
const products = [];
const orders = [];

class UserRepository {
  async create(userData) {
    const id = users.length + 1;
    const passwordHash = await bcrypt.hash(userData.password, 10);
    const user = new User({ ...userData, id, passwordHash });
    users.push(user);
    return user;
  }
  async findByEmail(email) {
    return users.find(u => u.email === email);
  }
  async findById(id) {
    return users.find(u => u.id === id);
  }
}

class ProductRepository {
  async create(productData) {
    const id = products.length + 1;
    const product = new Product({ ...productData, id });
    products.push(product);
    return product;
  }
  async findAll() {
    return products;
  }
  async findById(id) {
    return products.find(p => p.id === id);
  }
}

class OrderRepository {
  async create(orderData) {
    const id = orders.length + 1;
    const order = new Order({ ...orderData, id });
    orders.push(order);
    return order;
  }
  async findById(id) {
    return orders.find(o => o.id === id);
  }
  async findByBuyerId(buyerId) {
    return orders.filter(o => o.buyerId === buyerId);
  }
}

module.exports = { UserRepository, ProductRepository, OrderRepository };
