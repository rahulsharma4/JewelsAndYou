import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import api from "./services/api";
import { CartProvider, useCart } from "./contexts/CartContext";
import { NotificationProvider } from "./contexts/NotificationContext";
import ErrorBoundary from "./components/ErrorBoundary";
import { ImageWithFallback } from "./utils/imageUtils";

// Import components
import Header from "./components/Header";
import ProductDetail from "./components/ProductDetail";
import Footer from "./components/Footer";
import BottomNav from "./components/BottomNav";
import ScrollToTop from "./components/ScrollToTop";

// Import pages
import HomePage from "./pages/HomePage";
import ProductsPage from "./pages/ProductsPage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import CategoryPage from "./pages/CategoryPage";
import AuthLogin from "./pages/AuthLogin";
import AuthRegister from "./pages/AuthRegister";
import ProfilePage from "./pages/ProfilePage";
import CartPage from "./pages/CartPage";
import CheckoutAddress from "./pages/CheckoutAddress";
import CheckoutShipping from "./pages/CheckoutShipping";
import CheckoutPayment from "./pages/CheckoutPayment";
import CheckoutReview from "./pages/CheckoutReview";
import CheckoutSuccess from "./pages/CheckoutSuccess";
import OrdersPage from "./pages/OrdersPage";
import WishlistPage from "./pages/WishlistPage";
import SearchPage from "./pages/SearchPage";
import NotFoundPage from "./pages/NotFoundPage";
import ReturnsShippingPage from "./pages/ReturnsShippingPage";
import TermsPage from "./pages/TermsPage";
import PrivacyPage from "./pages/PrivacyPage";
import AdminPanel from "./pages/AdminPanel";
import AdminDashboard from "./pages/AdminDashboard";
import PaymentAnalytics from "./pages/PaymentAnalytics";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import OrderTracking from "./pages/OrderTracking";




function AppContent({ user, setUser }) {
  const [cartOpen, setCartOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [favorites, setFavorites] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Use cart context
  const { cart, addToCart, getTotalItems, updateCartItem, removeFromCart, getTotalPrice } = useCart();

  const isMobile = typeof window !== 'undefined' ? window.innerWidth < 768 : false;
  const navigate = useNavigate();

  const loadProducts = async () => {
    try {
      setLoading(true);
      const response = await api.getProducts();
      setProducts(response.products || []);
    } catch (error) {
      console.error('Error loading products:', error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  // Load data on component mount
  useEffect(() => {
    loadProducts();
    checkAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAddToCart = async (product) => {
    try {
      await addToCart(product, 1);
      setSnackbar({ open: true, message: `${product.name} added to cart!`, severity: "success" });
    } catch (error) {
      console.error('Error adding to cart:', error);
      setSnackbar({ open: true, message: error.message || "Error adding to cart", severity: "error" });
    }
  };

  const handleCheckout = () => {
    setCartOpen(false);
    navigate('/checkout/address');
  };




  const checkAuth = async () => {
    try {
      console.log('🔍 Checking authentication...');
      const profile = await api.getProfile();
      console.log('👤 Profile loaded:', profile);
      setUser(profile);
      const favs = await api.getFavorites();
      console.log('❤️ Favorites loaded:', favs);
      setFavorites(favs.map(fav => fav._id));
    } catch (error) {
      console.log('❌ Auth check failed:', error.message);
      // User not authenticated
    }
  };

  const toggleFavorite = async (productId) => {
    if (!user) {
      setSnackbar({ open: true, message: "Please login to add to wishlist!", severity: "error" });
      navigate('/login');
      return;
    }
    try {
      await api.toggleFavorite(productId);
      const isFav = favorites.includes(productId);
      setFavorites((prev) => (isFav ? prev.filter((id) => id !== productId) : [...prev, productId]));
      setSnackbar({ 
        open: true, 
        message: isFav ? "Removed from wishlist!" : "Added to wishlist!", 
        severity: "success" 
      });
    } catch (error) {
      console.error('Error toggling favorite:', error);
      setSnackbar({ open: true, message: "Error updating wishlist.", severity: "error" });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-brand-teal text-brand-off font-body pb-16 md:pb-0">
        {/* Header */}
        <Header
          cartItemCount={getTotalItems()}
          onCartClick={() => setCartOpen(true)}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          user={user}
          onLogout={() => {
            api.logout();
            setUser(null);
            setFavorites([]);
          }}
        />

        {/* Main Content */}
        <div className="flex-1">
          <Routes>
            <Route
              path="/"
              element={
                <HomePage
                  products={products}
                  onAddToCart={handleAddToCart}
                  onToggleFavorite={toggleFavorite}
                  favorites={favorites}
                  loading={loading}
                />
              }
            />
            <Route
              path="/products"
              element={
                <ProductsPage
                  products={products}
                  onAddToCart={handleAddToCart}
                  onToggleFavorite={toggleFavorite}
                  favorites={favorites}
                  loading={loading}
                />
              }
            />
            <Route
              path="/product/:id"
              element={
                <ProductDetail
                  products={products}
                  onAddToCart={handleAddToCart}
                  onToggleFavorite={toggleFavorite}
                  favorites={favorites}
                  user={user}
                  loadProducts={loadProducts}
                />
              }
            />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route
              path="/category/:name"
              element={
                <CategoryPage
                  products={products}
                  onAddToCart={handleAddToCart}
                  onToggleFavorite={toggleFavorite}
                  favorites={favorites}
                />
              }
            />
            <Route path="/login" element={<AuthLogin onLogin={(user) => {
              console.log('🔑 App: User login callback received:', user);
              setUser(user);
            }} />} />
            <Route path="/register" element={<AuthRegister onLogin={(user) => {
              console.log('🔑 App: User registration callback received:', user);
              setUser(user);
            }} />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/checkout/address" element={<CheckoutAddress />} />
            <Route path="/checkout/shipping" element={<CheckoutShipping />} />
            <Route path="/checkout/payment" element={<CheckoutPayment />} />
            <Route path="/checkout/review" element={<CheckoutReview />} />
            <Route path="/checkout/success" element={<CheckoutSuccess />} />
            <Route path="/orders" element={<OrdersPage />} />
            <Route
              path="/wishlist"
              element={
                <WishlistPage
                  products={products}
                  favorites={favorites}
                  onAddToCart={handleAddToCart}
                  onToggleFavorite={toggleFavorite}
                />
              }
            />
            <Route
              path="/search"
              element={
                <SearchPage
                  onAddToCart={handleAddToCart}
                  onToggleFavorite={toggleFavorite}
                  favorites={favorites}
                />
              }
            />
            <Route path="/returns-shipping" element={<ReturnsShippingPage />} />
            <Route path="/terms" element={<TermsPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
            <Route path="/admin" element={<AdminPanel />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/payments" element={<PaymentAnalytics />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/order-tracking/:orderId" element={<OrderTracking />} />

            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </div>

        {/* Shopping Cart Drawer */}
        {cartOpen && (
          <div className="fixed inset-0 z-50">
            <div className="absolute inset-0 bg-black/40" onClick={() => setCartOpen(false)} />
            <div className={`absolute right-0 top-0 h-full w-full ${isMobile ? 'max-w-full' : 'max-w-sm'} bg-brand-tealDark text-brand-off shadow-2xl border-l border-brand-gold/20`}>
              <div className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-lg font-bold">Shopping Cart ({getTotalItems()} items)</h2>
                  <button onClick={() => setCartOpen(false)} className="text-2xl leading-none hover:text-brand-gold">×</button>
                </div>

                {cart.length === 0 ? (
                  <p className="text-brand-off/80">Your cart is empty</p>
                ) : (
                  <>
                    <ul className="divide-y divide-brand-off/10">
                      {cart.map((item) => (
                        <li key={item.id} className="py-3">
                          <div className="flex items-center gap-4">
                            <ImageWithFallback
                              src={item.product.image}
                              alt={item.product.name}
                              className="w-16 h-16 object-cover rounded"
                            />
                            <div className="flex-1 min-w-0">
                              <div className="font-semibold truncate">{item.product.name}</div>
                              <div className="text-sm text-brand-gold">
                                ₹{item.product.price.toLocaleString('en-IN')}
                              </div>
                              <div className="flex items-center mt-2">
                                <button
                                  onClick={() => updateCartItem(item.product._id, item.quantity - 1)}
                                  className="px-2 py-1 rounded border border-brand-off/30 hover:bg-brand-teal/20"
                                  aria-label="Decrease quantity"
                                >
                                  -
                                </button>
                                <span className="mx-3">{item.quantity}</span>
                                <button
                                  onClick={() => updateCartItem(item.product._id, item.quantity + 1)}
                                  className="px-2 py-1 rounded border border-brand-off/30 hover:bg-brand-teal/20"
                                  aria-label="Increase quantity"
                                >
                                  +
                                </button>
                              </div>
                            </div>
                            <button
                              onClick={() => removeFromCart(item.product._id)}
                              className="text-rose-400 hover:text-rose-300"
                              aria-label="Remove item"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                                <path fillRule="evenodd" d="M16.5 4.478V5.25h3.375a.75.75 0 0 1 0 1.5h-.546l-1.2 12.01A2.25 2.25 0 0 1 15.888 21H8.112a2.25 2.25 0 0 1-2.241-2.24L4.67 6.75h-.546a.75.75 0 0 1 0-1.5H7.5v-.772A2.478 2.478 0 0 1 9.978 1.5h4.044A2.478 2.478 0 0 1 16.5 4.478ZM9 9.75a.75.75 0 0 1 1.5 0v7.5a.75.75 0 0 1-1.5 0v-7.5Zm4.5 0a.75.75 0 0 1 1.5 0v7.5a.75.75 0 0 1-1.5 0v-7.5Z" clipRule="evenodd" />
                              </svg>
                            </button>
                          </div>
                        </li>
                      ))}
                    </ul>

                    <div className="mt-4 border-t border-brand-off/10 pt-4">
                      <div className="flex items-center justify-between font-bold mb-3">
                        <span>Total:</span>
                        <span className="text-brand-gold">₹{getTotalPrice().toLocaleString('en-IN')}</span>
                      </div>
                      <button
                        onClick={handleCheckout}
                        className="w-full py-3 rounded-md font-semibold text-brand-tealDark bg-brand-gold hover:bg-brand-gold/90"
                      >
                        Checkout
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Snackbar */}
        {snackbar.open && (
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
            <div
              className={`px-4 py-3 rounded-md shadow-lg text-white ${
                snackbar.severity === 'success' ? 'bg-emerald-600' : snackbar.severity === 'info' ? 'bg-sky-600' : 'bg-rose-600'
              }`}
              onAnimationEnd={() => {}}
            >
              {snackbar.message}
            </div>
          </div>
        )}

        {/* Footer */}
        <Footer />
        <BottomNav user={user} onCartClick={() => setCartOpen(true)} />
      </div>
  );
}

function App() {
  const [user, setUser] = useState(null);
  
  return (
    <ErrorBoundary>
      <NotificationProvider>
        <Router>
          <ScrollToTop />
          <CartProvider user={user}>
            <AppContent user={user} setUser={setUser} />
          </CartProvider>
        </Router>
      </NotificationProvider>
    </ErrorBoundary>
  );
}

export default App;
