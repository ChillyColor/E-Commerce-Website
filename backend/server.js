// server/server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load products from JSON file
let products = [];
try {
  const productsData = readFileSync(join(__dirname, "products.json"), "utf-8");
  products = JSON.parse(productsData);
} catch (error) {
  console.error("Error loading products:", error);
  products = [];
}

// Get all products (with pagination support)
app.get("/api/products", async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const category = req.query.category;
  const search = req.query.search?.toLowerCase() || "";
  
  let filteredProducts = [...products];
  
  // Filter by category
  if (category && category !== "All") {
    filteredProducts = filteredProducts.filter(
      (product) => product.category === category || product.subcategory === category
    );
  }
  
  // Filter by search query
  if (search) {
    filteredProducts = filteredProducts.filter(
      (product) =>
        product.name.toLowerCase().includes(search) ||
        product.description.toLowerCase().includes(search) ||
        product.brand.toLowerCase().includes(search)
    );
  }
  
  // Pagination
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedProducts = filteredProducts.slice(startIndex, endIndex);
  
  res.json({
    products: paginatedProducts,
    total: filteredProducts.length,
    page,
    totalPages: Math.ceil(filteredProducts.length / limit),
  });
});

// Get product by ID
app.get("/api/product/:id", async (req, res) => {
  const { id } = req.params;
  const product = products.find((p) => p.id === parseInt(id));
  if (product) {
    res.json(product);
  } else {
    res.status(404).json({ error: "Product not found" });
  }
});

// Get all categories
app.get("/api/categories", async (req, res) => {
  const categories = [...new Set(products.map((p) => p.category))];
  const subcategories = [...new Set(products.map((p) => p.subcategory))];
  res.json({ categories, subcategories });
});

// Search products
app.get("/api/search", async (req, res) => {
  const query = req.query.q?.toLowerCase() || "";
  if (!query) {
    return res.json([]);
  }
  
  const searchResults = products.filter(
    (product) =>
      product.name.toLowerCase().includes(query) ||
      product.description.toLowerCase().includes(query) ||
      product.brand.toLowerCase().includes(query) ||
      product.category.toLowerCase().includes(query)
  );
  
  res.json(searchResults);
});

// Get products by category
app.get("/api/category/:category", async (req, res) => {
  const { category } = req.params;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  
  const filteredProducts = products.filter(
    (product) => product.category === category || product.subcategory === category
  );
  
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedProducts = filteredProducts.slice(startIndex, endIndex);
  
  res.json({
    products: paginatedProducts,
    total: filteredProducts.length,
    page,
    totalPages: Math.ceil(filteredProducts.length / limit),
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
