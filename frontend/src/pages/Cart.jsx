import "../css/Favorites.css";
import { useCartContext } from "../contexts/CartContext";
import { Link } from "react-router-dom";
import "../css/ProductCard.css";

function Cart() {
  const { cart, removeFromCart, updateQuantity, getCartTotal, clearCart } = useCartContext();
  const total = getCartTotal();

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price);
  };

  if (cart.length === 0) {
    return (
      <div className="favorites-empty cart-empty">
        <h2>Your Cart is Empty</h2>
        <p>Start adding products to your cart and they will appear here</p>
        <Link to="/" className="continue-shopping-btn">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="favorites cart-page">
      <div className="cart-header">
        <h2>Your Cart ({cart.length} {cart.length === 1 ? "item" : "items"})</h2>
        <button onClick={clearCart} className="clear-cart-btn">
          Clear Cart
        </button>
      </div>
      <div className="cart-content">
        <div className="cart-items">
          {cart.map((item) => (
            <div key={item.id} className="cart-item">
              <Link to={`/product/${item.id}`} className="cart-item-image">
                <img src={item.image} alt={item.name} />
              </Link>
              <div className="cart-item-details">
                <Link to={`/product/${item.id}`}>
                  <h3>{item.name}</h3>
                </Link>
                <p className="cart-item-brand">{item.brand}</p>
                <div className="cart-item-price">
                  <span className="current-price">{formatPrice(item.price)}</span>
                  {item.originalPrice && item.originalPrice > item.price && (
                    <span className="original-price">{formatPrice(item.originalPrice)}</span>
                  )}
                </div>
              </div>
              <div className="cart-item-controls">
                <div className="quantity-controls">
                  <button
                    onClick={() => updateQuantity(item.id, (item.quantity || 1) - 1)}
                    className="quantity-btn"
                  >
                    -
                  </button>
                  <span className="quantity">{item.quantity || 1}</span>
                  <button
                    onClick={() => updateQuantity(item.id, (item.quantity || 1) + 1)}
                    className="quantity-btn"
                  >
                    +
                  </button>
                </div>
                <div className="cart-item-total">
                  {formatPrice(item.price * (item.quantity || 1))}
                </div>
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="remove-item-btn"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
        <div className="cart-summary">
          <h3>Order Summary</h3>
          <div className="summary-row">
            <span>Subtotal:</span>
            <span>{formatPrice(total)}</span>
          </div>
          <div className="summary-row">
            <span>Shipping:</span>
            <span>Free</span>
          </div>
          <div className="summary-row total-row">
            <span>Total:</span>
            <span>{formatPrice(total)}</span>
          </div>
          <button className="checkout-btn">Proceed to Checkout</button>
          <Link to="/" className="continue-shopping-link">
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Cart;

