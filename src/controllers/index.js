const usecase = require('../usecases');

exports.handleAction = async (req, res) => {
  try {
    const result = await usecase.processAction(req.body);
    res.json({ success: true, data: result });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.register = async (req, res) => {
  try {
    const result = await usecase.register(req.body);
    res.json({ success: true, data: result });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const result = await usecase.login(req.body);
    res.json({ success: true, data: result });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

exports.createProduct = async (req, res) => {
  try {
    // In real app, get userId from JWT
    const userId = 1; // mock
    const result = await usecase.createProduct(req.body, userId);
    res.json({ success: true, data: result });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

exports.listProducts = async (req, res) => {
  try {
    const result = await usecase.listProducts();
    res.json({ success: true, data: result });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

exports.createOrder = async (req, res) => {
  try {
    // In real app, get buyerId from JWT
    const buyerId = 1; // mock
    const result = await usecase.createOrder(req.body, buyerId);
    res.json({ success: true, data: result });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

exports.listOrders = async (req, res) => {
  try {
    // In real app, get buyerId from JWT
    const buyerId = 1; // mock
    const result = await usecase.listOrders(buyerId);
    res.json({ success: true, data: result });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};
