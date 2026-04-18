import { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { CartProvider, useCart } from "./context/CartContext";

// Layout
import Navbar from "./components/Navbar";
import CartDrawer from "./components/CartDrawer";
import Footer from "./components/Footer";

// Public pages
import Home from "./pages/public/Home";
import Shop from "./pages/public/Shop";
import ProductDetails from "./pages/public/ProductDetails";

// Auth pages
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Profile from "./pages/auth/Profile";

// Checkout pages
import Checkout from "./pages/checkout/Checkout";
import Success from "./pages/checkout/Success";

// Admin pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import ManageProducts from "./pages/admin/ManageProducts";
import ManageOrders from "./pages/admin/ManageOrders";

// ─── Guards ──────────────────────────────────────────────────────────────────
function PrivateRoute({ children }) {
  const { token, loading } = useAuth();
  const location = useLocation();
  if (loading) return <div className="min-h-screen bg-cream flex items-center justify-center"><div className="w-6 h-6 rounded-full border-2 border-nude border-t-charcoal animate-spin" /></div>;
  return token ? children : <Navigate to="/login" state={{ from: location }} replace />;
}

function AdminRoute({ children }) {
  const { isAdmin, loading } = useAuth();
  if (loading) return null;
  return isAdmin() ? children : <Navigate to="/" replace />;
}

// ─── Layout wrapper ──────────────────────────────────────────────────────────
function AppLayout() {
  const [cartOpen, setCartOpen] = useState(false);
  const { count } = useCart();
  const location = useLocation();

  // Auth pages: no navbar/footer
  const isAuthPage = ["/login", "/register"].includes(location.pathname);
  const isSuccessPage = location.pathname === "/order-success";

  if (isAuthPage || isSuccessPage) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/order-success" element={<Success />} />
      </Routes>
    );
  }

  return (
    <>
      <Navbar
        cartCount={count}
        onCartOpen={() => setCartOpen(true)}
      />
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/products/:id" element={<ProductDetails />} />

        <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
        <Route path="/checkout" element={<PrivateRoute><Checkout /></PrivateRoute>} />

        <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
        <Route path="/admin/products" element={<AdminRoute><ManageProducts /></AdminRoute>} />
        <Route path="/admin/orders" element={<AdminRoute><ManageOrders /></AdminRoute>} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      <Footer />
    </>
  );
}

// ─── Root ─────────────────────────────────────────────────────────────────────
export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <AppLayout />
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
