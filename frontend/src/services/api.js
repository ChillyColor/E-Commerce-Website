const BACKEND_URL = "http://localhost:5000/api";

export const getProducts = async (page = 1, category = null) => {
  const url = category && category !== "All"
    ? `${BACKEND_URL}/category/${category}?page=${page}&limit=20`
    : `${BACKEND_URL}/products?page=${page}&limit=20`;
  const response = await fetch(url);
  const data = await response.json();
  return data;
};

export const searchProducts = async (query) => {
  const response = await fetch(`${BACKEND_URL}/search?q=${encodeURIComponent(query)}`);
  const data = await response.json();
  return data;
};

export const getProductDetails = async (productId) => {
  const response = await fetch(`${BACKEND_URL}/product/${productId}`);
  const data = await response.json();
  return data;
};

export const getCategories = async () => {
  const response = await fetch(`${BACKEND_URL}/categories`);
  const data = await response.json();
  return data;
};
