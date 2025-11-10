import "../css/Favorites.css";
import { useCartContext } from "../contexts/CartContext";
import ProductCard from "../components/ProductCard";
function Favorites() {
  const { favorites } = useCartContext();
  return favorites.length === 0 ? (
    <div className="favorites-empty">
      <h2>No Favourite Products Yet</h2>
      <p>Start adding products to your favorites and they will appear here</p>
    </div>
  ) : (
    <div className="favorites">
      <h2>Your Favorites</h2>
      <div className="products-grid">
        {favorites.map((product) => (
          <ProductCard product={product} key={product.id} />
        ))}
      </div>
    </div>
  );
}
export default Favorites;
