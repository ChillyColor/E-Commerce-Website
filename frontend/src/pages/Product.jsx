import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProductDetails } from "../services/api";
import { useCartContext } from "../contexts/CartContext";
import "../css/product.css";

export default function Product() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const { addToCart, isInCart } = useCartContext();
  const inCart = product ? isInCart(product.id) : false;

  useEffect(() => {
    async function fetchProduct() {
      try {
        setLoading(true);
        setImageLoaded(false);
        setImageError(false);
        const data = await getProductDetails(id);
        setProduct(data);
      } catch (e) {
        console.error("Error fetching product details:", e);
      } finally {
        setLoading(false);
      }
    }
    fetchProduct();
  }, [id]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price);
  };

  const discount = product?.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const handleAddToCart = () => {
    if (product) {
      addToCart(product);
    }
  };

  if (loading) {
    return (
      <div className="product-page">
        <div className="product-container">
          <div className="loading">
            <div className="loading-text">Loading product details...</div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="product-page">
        <div className="product-container">
          <div className="loading">
            <div className="loading-text">Product not found</div>
            <button onClick={() => navigate("/")} style={{ marginTop: "1rem", padding: "0.5rem 1rem" }}>
              Go Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="product-page">
      <div className="product-container">
        <div className="product-header">
          <div className="product-image-wrapper">
            <div className="product-image-container">
              {!imageError && product.image ? (
                <>
                  {!imageLoaded && (
                    <div className="image-loading">
                      <div className="spinner-wrapper">
                        <div className="spinner"></div>
                      </div>
                      <div>Loading image...</div>
                    </div>
                  )}
                  <img
                    src={product.image}
                    alt={product.name}
                    className="product-detail-image"
                    style={{ display: imageLoaded ? "block" : "none" }}
                    onLoad={() => {
                      setImageLoaded(true);
                      setImageError(false);
                    }}
                    onError={(e) => {
                      console.log(e)
                      console.error("Failed to load image:", product.image);
                      setImageError(true);
                      setImageLoaded(false);
                    }}
                  />
                  {discount > 0 && imageLoaded && (
                    <div className="discount-badge-large">{discount}% OFF</div>
                  )}
                </>
              ) : (
                <div className="product-image-placeholder">
                  <div className="placeholder-icon">📷</div>
                  <div className="placeholder-text">Image not available</div>
                  {product.image && (
                    <div className="placeholder-product-name" style={{ marginTop: "0.5rem", fontSize: "0.85rem", color: "#999" }}>
                      URL: {product.image.substring(0, 50)}...
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
          <div className="product-info-detail">
            <h1 className="product-title">{product.name}</h1>
            <p className="product-brand-large">{product.brand}</p>
            
            <div className="product-price-section">
              <span className="current-price-large">{formatPrice(product.price)}</span>
              {product.originalPrice && product.originalPrice > product.price && (
                <>
                  <span className="original-price-large">{formatPrice(product.originalPrice)}</span>
                  <span className="discount-text">{discount}% off</span>
                </>
              )}
            </div>

            <div className="product-rating-section">
              <div className="rating-badge">
                <span>⭐ {product.rating?.toFixed(1) || "4.0"}</span>
                <span className="reviews-text">({product.reviews || 0} reviews)</span>
              </div>
            </div>

            <div className="product-availability">
              {product.stock > 0 ? (
                <span className="in-stock">✓ In Stock ({product.stock} available)</span>
              ) : (
                <span className="out-of-stock">✗ Out of Stock</span>
              )}
            </div>

            <p className="product-description">{product.description}</p>

            <div className="product-features">
              <h3>Key Features:</h3>
              <ul>
                {product.features?.map((feature, index) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>
            </div>

            {product.specifications && (
              <div className="product-specifications">
                <h3>Specifications:</h3>
                <div className="specs-grid">
                  {Object.entries(product.specifications).map(([key, value]) => (
                    <div key={key} className="spec-item">
                      <span className="spec-key">{key}:</span>
                      <span className="spec-value">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="product-actions">
              <button
                className={`add-to-cart-button ${inCart ? "in-cart" : ""}`}
                onClick={handleAddToCart}
                disabled={product.stock === 0}
              >
                {inCart ? "✓ Added to Cart" : "Add to Cart"}
              </button>
              <button
                className="buy-now-button"
                disabled={product.stock === 0}
              >
                Buy Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

