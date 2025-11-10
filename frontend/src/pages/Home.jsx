import ProductCard from "../components/ProductCard";
import { useState, useEffect } from "react";
import {
  searchProducts,
  getProducts,
  getCategories,
} from "../services/api";
import InfiniteScroll from "react-infinite-scroll-component";
import "../css/Home.css";

function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [totalProducts, setTotalProducts] = useState(0);

  // Load categories on mount
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const categoryData = await getCategories();
        setCategories(categoryData.categories || []);
      } catch (gerr) {
        console.log("Failed to load categories", gerr);
      }
    };
    loadCategories();
  }, []);

  // Load products when category changes
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const category = selectedCategory === "All" ? null : selectedCategory;
        const data = await getProducts(1, category);
        setProducts(data.products || []);
        setTotalProducts(data.total || 0);
        setPage(2);
        setHasMore(data.page < data.totalPages);
      } catch (err) {
        console.log(err);
        setError("Failed to load products...");
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, [selectedCategory]);

  const fetchMoreProducts = async () => {
    try {
      const category = selectedCategory === "All" ? null : selectedCategory;
      const data = await getProducts(page, category);
      if (data.products && data.products.length > 0) {
        setProducts((prevProducts) => [...prevProducts, ...data.products]);
        setPage((prevPage) => prevPage + 1);
        setHasMore(data.page < data.totalPages);
      } else {
        setHasMore(false);
      }
    } catch (err) {
      console.log(err);
      setError("Failed to load more products...");
      setHasMore(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    if (loading) return;
    setLoading(true);
    try {
      const searchResults = await searchProducts(searchQuery);
      setProducts(searchResults);
      setIsSearching(true);
      setError(null);
    } catch (err) {
      console.log(err);
      setError("Failed to search products....");
    } finally {
      setLoading(false);
    }
  };

  const clearSearch = async () => {
    setSearchQuery("");
    setIsSearching(false);
    setLoading(true);
    try {
      const category = selectedCategory === "All" ? null : selectedCategory;
      const data = await getProducts(1, category);
      setProducts(data.products || []);
      setTotalProducts(data.total || 0);
      setError(null);
      setPage(2);
      setHasMore(data.page < data.totalPages);
    } catch (err) {
      console.log(err);
      setError("Failed to reload products...");
    } finally {
      setLoading(false);
    }
  };

  const onCategoryChange = async (e) => {
    const category = e.target.value;
    setSelectedCategory(category);
    setLoading(true);
    setIsSearching(false);
    setPage(1);
    try {
      const data = await getProducts(1, category === "All" ? null : category);
      setProducts(data.products || []);
      setTotalProducts(data.total || 0);
      setPage(2);
      setHasMore(data.page < data.totalPages);
      setError(null);
    } catch (err) {
      console.log(err);
      setError("Failed to load products...");
    } finally {
      setLoading(false);
    }
  };

  // When searching, render without InfiniteScroll
  if (isSearching) {
    return (
      <div className="home">
        <form onSubmit={handleSearch} className="search-form">
          <input
            type="text"
            placeholder="Search for products..."
            className="search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <button type="submit" className="search-button">
              Search
            </button>
            {isSearching && (
              <button
                type="button"
                className="search-button"
                onClick={clearSearch}
              >
                Clear
              </button>
            )}
          </div>
        </form>
        {error && <div className="error-message">{error}</div>}
        {loading ? (
          <div className="loading">
            <div className="spinner" />
            <div>Loading products...</div>
          </div>
        ) : (
          <div className="products-grid">
            {products.length > 0 ? (
              products.map((product) => (
                <ProductCard product={product} key={product.id} />
              ))
            ) : (
              <div className="no-results">No products found</div>
            )}
          </div>
        )}
      </div>
    );
  }

  // Default view uses InfiniteScroll
  return (
    <InfiniteScroll
      dataLength={products.length}
      next={fetchMoreProducts}
      hasMore={hasMore}
      loader={
        <div className="loading">
          <div className="spinner" />
          <div>Loading more products...</div>
        </div>
      }
      endMessage={
        <p style={{ textAlign: "center", padding: "2rem" }}>
          {products.length > 0 ? "You've seen all products!" : "No products available"}
        </p>
      }
    >
      <div className="home">
        <form onSubmit={handleSearch} className="search-form">
          <input
            type="text"
            placeholder="Search for products..."
            className="search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <button type="submit" className="search-button">
              Search
            </button>
            {isSearching && (
              <button
                type="button"
                className="search-button"
                onClick={clearSearch}
              >
                Clear
              </button>
            )}
          </div>
          <select
            className="genre-select category-select"
            value={selectedCategory}
            onChange={onCategoryChange}
            aria-label="Filter by category"
          >
            <option value="All">All Categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </form>
        {error && <div className="error-message">{error}</div>}
        {loading && products.length === 0 ? (
          <div className="loading">
            <div className="spinner" />
            <div>Loading products...</div>
          </div>
        ) : (
          <div className="products-grid">
            {products.map((product) => (
              <ProductCard product={product} key={product.id} />
            ))}
          </div>
        )}
      </div>
    </InfiniteScroll>
  );
}
export default Home;
