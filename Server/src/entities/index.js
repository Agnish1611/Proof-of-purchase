// User entity
class User {
  constructor({ id, name, email, passwordHash, role }) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.passwordHash = passwordHash;
    this.role = role; // e.g., 'admin', 'supplier', 'retailer', 'customer'
  }
}

// Product entity
class Product {
  constructor({ id, name, description, price, ownerId }) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.price = price;
    this.ownerId = ownerId;
  }
}

// Order entity
class Order {
  constructor({ id, productId, buyerId, status }) {
    this.id = id;
    this.productId = productId;
    this.buyerId = buyerId;
    this.status = status; // e.g., 'pending', 'completed', 'cancelled'
  }
}

module.exports = { User, Product, Order };
