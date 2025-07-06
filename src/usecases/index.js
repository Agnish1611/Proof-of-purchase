const { UserRepository, ProductRepository, OrderRepository } = require('../repositories');
const smartContractService = require('../services/smartContractService');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const userRepo = new UserRepository();
const productRepo = new ProductRepository();
const orderRepo = new OrderRepository();

// Auth usecases
exports.register = async (data) => {
  const existing = await userRepo.findByEmail(data.email);
  if (existing) throw new Error('User already exists');
  const user = await userRepo.create(data);
  return { id: user.id, email: user.email, name: user.name, role: user.role };
};

exports.login = async (data) => {
  const user = await userRepo.findByEmail(data.email);
  if (!user) throw new Error('Invalid credentials');
  const valid = await bcrypt.compare(data.password, user.passwordHash);
  if (!valid) throw new Error('Invalid credentials');
  const token = jwt.sign({ id: user.id, role: user.role }, 'secret', { expiresIn: '1d' });
  return { token };
};

// Product usecases
exports.createProduct = async (data, userId) => {
  // Only allow if user is supplier or admin
  // ...mock role check for now...
  const product = await productRepo.create({ ...data, ownerId: userId });
  return product;
};

exports.listProducts = async () => {
  return productRepo.findAll();
};

// Order usecases
exports.createOrder = async (data, buyerId) => {
  // Mock smart contract call
  await smartContractService.mockCall({ type: 'order', ...data });
  const order = await orderRepo.create({ ...data, buyerId, status: 'pending' });
  return order;
};

exports.listOrders = async (buyerId) => {
  return orderRepo.findByBuyerId(buyerId);
};

// Example: Call smart contract (mocked)
exports.processAction = async (data) => {
  const contractResult = await smartContractService.mockCall(data);
  // ...additional business logic...
  return contractResult;
};
