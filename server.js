// server.js
const express = require("express");
const app = express();
app.use(express.json());

// ---------------------------
// Sample In-Memory Data
// ---------------------------

// Products data
let products = [
  { id: 1, name: "Laptop", brand: "Dell", price: 65000, inStock: true },
  { id: 2, name: "Smartphone", brand: "Samsung", price: 35000, inStock: true },
  { id: 3, name: "Headphones", brand: "Sony", price: 5000, inStock: false }
];

// Customers data
let customers = [
  { id: 1, name: "Alice", membership: "Gold", purchasedProducts: [3] },
  { id: 2, name: "Bob", membership: "Silver", purchasedProducts: [] }
];

// ---------------------------
// Part A: ROUTING BASICS
// ---------------------------

// 1️⃣ View all products
app.get("/products", (req, res) => {
  res.json(products);
});

// 2️⃣ Manage customers
// View all customers
app.get("/customers", (req, res) => {
  res.json(customers);
});

// Add a new customer
app.post("/customers", (req, res) => {
  const newCustomer = { id: customers.length + 1, ...req.body, purchasedProducts: [] };
  customers.push(newCustomer);
  res.status(201).json({ message: "Customer added successfully", customer: newCustomer });
});

// Update membership
app.put("/customers/:id/membership", (req, res) => {
  const customer = customers.find(c => c.id === parseInt(req.params.id));
  if (!customer) return res.status(404).json({ message: "Customer not found" });

  customer.membership = req.body.membership;
  res.json({ message: "Membership updated", customer });
});

// 3️⃣ Purchase a product
app.post("/purchase/:customerId/:productId", (req, res) => {
  const customer = customers.find(c => c.id === parseInt(req.params.customerId));
  const product = products.find(p => p.id === parseInt(req.params.productId));

  if (!customer) return res.status(404).json({ message: "Customer not found" });
  if (!product) return res.status(404).json({ message: "Product not found" });
  if (!product.inStock) return res.status(400).json({ message: "Product is out of stock" });

  product.inStock = false;
  customer.purchasedProducts.push(product.id);

  res.json({ message: `${customer.name} purchased "${product.name}" successfully.` });
});

// 4️⃣ Return a product
app.post("/return/:customerId/:productId", (req, res) => {
  const customer = customers.find(c => c.id === parseInt(req.params.customerId));
  const product = products.find(p => p.id === parseInt(req.params.productId));

  if (!customer || !product) return res.status(404).json({ message: "Customer or Product not found" });

  const index = customer.purchasedProducts.indexOf(product.id);
  if (index === -1) return res.status(400).json({ message: "Product not purchased by this customer" });

  customer.purchasedProducts.splice(index, 1);
  product.inStock = true;

  res.json({ message: `${customer.name} returned "${product.name}" successfully.` });
});

// ---------------------------
// Part B: PATH PARAMETERS
// ---------------------------

// 1️⃣ Fetch details about a specific product
app.get("/products/:id", (req, res) => {
  const product = products.find(p => p.id === parseInt(req.params.id));
  if (!product) return res.status(404).json({ message: "Product not found" });
  res.json(product);
});

// 2️⃣ Retrieve a specific customer’s purchase history
app.get("/customers/:id/history", (req, res) => {
  const customer = customers.find(c => c.id === parseInt(req.params.id));
  if (!customer) return res.status(404).json({ message: "Customer not found" });

  const purchasedDetails = products.filter(p => customer.purchasedProducts.includes(p.id));
  res.json({
    customer: customer.name,
    purchasedProducts: purchasedDetails
  });
});

// ---------------------------
// Start Server
// ---------------------------
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🛒 E-Commerce API running at http://localhost:${PORT}`);
});
