import "../css/ProductCard.css";
import { useCartContext } from "../contexts/CartContext";
import { Link } from "react-router-dom";
function ProductCard({ product }) {
  const { isInCart, addToCart } = useCartContext();
  const inCart = isInCart(product.id);

  function onAddToCart(e) {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
  }

  const discount = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <Link to={`/product/${product.id}`} className="product-card">
      <div className="product-image">
        {discount > 0 && (
          <div className="discount-badge">{discount}% OFF</div>
        )}
        <div className="product-rating">
          <div className="user-rating">⭐ {product.rating?.toFixed(1) || "4.0"}</div>
        </div>
        <img src={product.image} alt={product.name} />
        <div className="product-overlay">
          <button 
            className={`add-to-cart-btn ${inCart ? "in-cart" : ""}`} 
            onClick={onAddToCart}
          >
            {inCart ? "✓ Added to Cart" : "Add to Cart"}
          </button>
        </div>
      </div>
      <div className="product-info">
        <h3 className="product-name">{product.name}</h3>
        <p className="product-brand">{product.brand}</p>
        <div className="product-price">
          <span className="current-price">{formatPrice(product.price)}</span>
          {product.originalPrice && product.originalPrice > product.price && (
            <span className="original-price">{formatPrice(product.originalPrice)}</span>
          )}
        </div>
        <div className="product-rating">
          <span>⭐ {product.rating?.toFixed(1) || "4.0"}</span>
          <span className="reviews-count">({product.reviews || 0} reviews)</span>
        </div>
      </div>
    </Link>
  );
}
export default ProductCard;
