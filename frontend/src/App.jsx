import "./css/App.css"
import Product from "./pages/Product"
import Cart from "./pages/Cart";
import Home from "./pages/Home";
import { Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar";
import { CartProvider } from "./contexts/CartContext";
function App() {
  return (
    <CartProvider>
      <NavBar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/product/:id" element={<Product/>}/>
        </Routes>
      </main>
    </CartProvider>
  );
}
export default App;
