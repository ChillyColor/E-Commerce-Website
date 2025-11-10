import { Link } from "react-router-dom";
import { useCartContext } from "../contexts/CartContext";
import "../css/Navbar.css"
function NavBar() {
  const { getCartCount } = useCartContext();
  const cartCount = getCartCount();

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">🛍️ ShopEasy</Link>
      </div>
      <div className="navbar-links">
        <Link to="/" className="nav-link">
          Home
        </Link>
        <Link to="/cart" className="nav-link cart-link">
          Cart {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
        </Link>
      </div>
    </nav>
  );
}
export default NavBar;
