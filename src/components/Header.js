import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import logo from '../Assets/Logo.png';
import SearchBar from './SearchBar';
import { useCart } from '../contexts/CartContext';
import { ImageWithFallback } from '../utils/imageUtils';

const Header = ({ cartItemCount, onCartClick, selectedCategory, onCategoryChange, user, onLogout }) => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [categoryMenuOpen, setCategoryMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  // Use cart context
  const { cart, updateCartItem, removeFromCart, getTotalPrice, getTotalItems } = useCart();

  const categories = ['All', 'Rings', 'Necklaces', 'Earrings', 'Bracelets', 'Pendants'];

  const handleCategorySelect = (category) => {
    onCategoryChange(category);
    setCategoryMenuOpen(false);
    navigate(`/category/${encodeURIComponent(category)}`);
  };

  const handleCartClick = () => {
    setCartOpen(true);
    onCartClick?.();
  };

  const handleCheckout = () => {
    setCartOpen(false);
    navigate('/checkout/address');
  };

  return (
    <>
      <header className="sticky top-0 z-50 shadow-sm font-body">
        <div className="bg-brand-tealDark">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex h-14 items-center justify-between">
              {/* Brand */}
              <div className="flex items-center gap-3">
                <img
                  src={logo}
                  alt="Logo"
                  className="h-10 cursor-pointer"
                  onClick={() => navigate('/')}
                  style={{filter: 'invert(1)'}}
                />
                <button
                  onClick={() => navigate('/')}
                  className="text-brand-off font-heading tracking-wide text-lg"
                >
                  JewelsAndYou
                </button>
              </div>

              {/* Desktop nav */}
              <nav className="hidden md:flex items-center gap-1">
                <button
                  onClick={() => navigate('/')}
                  className="px-3 py-2 rounded-md text-sm font-medium text-brand-off/90 hover:bg-brand-tealDark/10 hover:text-brand-off transition"
                >
                  Home
                </button>
                <button
                  onClick={() => navigate('/products')}
                  className="px-3 py-2 rounded-md text-sm font-medium text-brand-off/90 hover:bg-brand-tealDark/10 hover:text-brand-off transition"
                >
                  Products
                </button>
                <button
                  onClick={() => navigate('/about')}
                  className="px-3 py-2 rounded-md text-sm font-medium text-brand-off/90 hover:bg-brand-tealDark/10 hover:text-brand-off transition"
                >
                  About
                </button>
                <button
                  onClick={() => navigate('/contact')}
                  className="px-3 py-2 rounded-md text-sm font-medium text-brand-off/90 hover:bg-brand-tealDark/10 hover:text-brand-off transition"
                >
                  Contact
                </button>

                {/* Categories dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setCategoryMenuOpen((v) => !v)}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition ${
                      categoryMenuOpen ? 'bg-brand-gold/20 text-brand-off' : 'text-brand-off/90 hover:bg-brand-tealDark/10 hover:text-brand-off'
                    }`}
                  >
                    Categories
                  </button>
                  {categoryMenuOpen && (
                    <div className="absolute right-0 mt-2 w-44 rounded-md bg-brand-tealDark shadow-lg ring-1 ring-brand-gold/20 text-brand-off border border-brand-gold/20">
                      <ul className="py-1">
                        {categories.map((cat) => (
                          <li key={cat}>
                            <button
                              onClick={() => handleCategorySelect(cat)}
                              className={`w-full text-left px-3 py-2 text-sm rounded-md transition ${
                                selectedCategory === cat ? 'bg-brand-gold/20 text-brand-off font-semibold' : 'hover:bg-brand-teal/20'
                              }`}
                            >
                              {cat}
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </nav>

              {/* Right actions */}
              <div className="flex items-center gap-2">
                {/* Search */}
                <SearchBar />
                
                {/* User Menu */}
                {user ? (
                  <div className="relative">
                    <button
                      onClick={() => setUserMenuOpen(!userMenuOpen)}
                      className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium text-brand-off/90 hover:bg-brand-tealDark/10 hover:text-brand-off transition"
                    >
                      <div className="w-8 h-8 bg-brand-gold rounded-full flex items-center justify-center text-brand-tealDark font-semibold">
                        {user.name?.charAt(0)?.toUpperCase()}
                      </div>
                      <span className="hidden md:block">{user.name}</span>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    {userMenuOpen && (
                      <div className="absolute right-0 mt-2 w-48 rounded-md bg-brand-tealDark shadow-lg ring-1 ring-brand-gold/20 text-brand-off border border-brand-gold/20">
                        <div className="py-1">
                          <button
                            onClick={() => { navigate('/profile'); setUserMenuOpen(false); }}
                            className="w-full text-left px-4 py-2 text-sm hover:bg-brand-teal/20 transition"
                          >
                            Profile
                          </button>
                          <button
                            onClick={() => { navigate('/orders'); setUserMenuOpen(false); }}
                            className="w-full text-left px-4 py-2 text-sm hover:bg-brand-teal/20 transition"
                          >
                            Orders
                          </button>
                          {user.role === 'admin' && (
                            <button
                              onClick={() => { navigate('/admin/dashboard'); setUserMenuOpen(false); }}
                              className="w-full text-left px-4 py-2 text-sm hover:bg-brand-teal/20 transition text-brand-gold font-semibold"
                            >
                              Admin Panel
                            </button>
                          )}
                          <hr className="my-1 border-brand-gold/20" />
                          <button
                            onClick={() => { onLogout?.(); setUserMenuOpen(false); }}
                            className="w-full text-left px-4 py-2 text-sm hover:bg-brand-teal/20 transition text-red-400"
                          >
                            Logout
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => navigate('/login')}
                      className="px-3 py-2 rounded-md text-sm font-medium text-brand-off/90 hover:bg-brand-tealDark/10 hover:text-brand-off transition"
                    >
                      Login
                    </button>
                    <button
                      onClick={() => navigate('/register')}
                      className="px-3 py-2 rounded-md text-sm font-medium bg-brand-gold text-brand-tealDark hover:bg-brand-gold/90 transition"
                    >
                      Register
                    </button>
                  </div>
                )}
                
                {/* Mobile menu button */}
                <button
                  className="md:hidden inline-flex items-center justify-center rounded-md p-2 text-brand-off hover:bg-brand-tealDark/10 focus:outline-none focus:ring-2 focus:ring-brand-gold/40"
                  onClick={() => setMobileMenuOpen(true)}
                  aria-label="Open menu"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                  </svg>
                </button>

                {/* Cart button with badge */}
                <button
                  onClick={handleCartClick}
                  className="relative inline-flex items-center justify-center rounded-full p-2 text-brand-off hover:bg-brand-tealDark/10 focus:outline-none focus:ring-2 focus:ring-brand-gold/40"
                  aria-label="Open cart"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                    <path d="M2.25 3a.75.75 0 0 1 .75-.75h1.287a1.5 1.5 0 0 1 1.445 1.106l.232.928h12.786a.75.75 0 0 1 .731.915l-1.5 6a.75.75 0 0 1-.731.585H7.06l.24.96h10.2a.75.75 0 0 1 0 1.5H6.75a1.5 1.5 0 0 1-1.445-1.106L3.34 4.393A.75.75 0 0 0 2.287 3.75H3a.75.75 0 0 1-.75-.75ZM7.5 20.25a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Zm9 0a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z" />
                  </svg>
                  {getTotalItems() > 0 && (
                    <span className="absolute -top-1 -right-1 min-w-[1.25rem] h-5 px-1 inline-flex items-center justify-center rounded-full text-xs font-bold bg-brand-gold text-brand-tealDark">
                      {getTotalItems()}
                    </span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Drawer */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50">
            <div className="absolute inset-0 bg-black/40" onClick={() => setMobileMenuOpen(false)} />
            <motion.div 
              initial={{ x: '100%', opacity: 0 }} 
              animate={{ x: 0, opacity: 1 }} 
              transition={{ duration: 0.35, ease: 'easeOut' }} 
              className="absolute right-0 top-0 h-full w-80 max-w-[85%] bg-brand-tealDark text-brand-off shadow-2xl p-4 overflow-y-auto border-l border-brand-gold/20"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="font-bold">Menu</span>
                <button
                  className="rounded-md p-2 hover:bg-brand-teal/20"
                  onClick={() => setMobileMenuOpen(false)}
                  aria-label="Close menu"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                    <path fillRule="evenodd" d="M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 0 1-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>

              {/* Nav links */}
              <div className="flex flex-col gap-1 mb-4">
                <button
                  onClick={() => { navigate('/'); setMobileMenuOpen(false); }}
                  className="w-full text-left px-3 py-2 rounded-md text-brand-off/90 hover:bg-brand-teal/20"
                >
                  Home
                </button>
                <button
                  onClick={() => { navigate('/products'); setMobileMenuOpen(false); }}
                  className="w-full text-left px-3 py-2 rounded-md text-brand-off/90 hover:bg-brand-teal/20"
                >
                  Products
                </button>
                <button
                  onClick={() => { navigate('/about'); setMobileMenuOpen(false); }}
                  className="w-full text-left px-3 py-2 rounded-md text-brand-off/90 hover:bg-brand-teal/20"
                >
                  About
                </button>
                <button
                  onClick={() => { navigate('/contact'); setMobileMenuOpen(false); }}
                  className="w-full text-left px-3 py-2 rounded-md text-brand-off/90 hover:bg-brand-teal/20"
                >
                  Contact
                </button>
                {user ? (
                  <>
                    <button
                      onClick={() => { navigate('/profile'); setMobileMenuOpen(false); }}
                      className="w-full text-left px-3 py-2 rounded-md text-brand-off/90 hover:bg-brand-teal/20"
                    >
                      Profile
                    </button>
                    <button
                      onClick={() => { navigate('/orders'); setMobileMenuOpen(false); }}
                      className="w-full text-left px-3 py-2 rounded-md text-brand-off/90 hover:bg-brand-teal/20"
                    >
                      Orders
                    </button>
                    {user.role === 'admin' && (
                      <button
                        onClick={() => { navigate('/admin/dashboard'); setMobileMenuOpen(false); }}
                        className="w-full text-left px-3 py-2 rounded-md text-brand-gold hover:bg-brand-teal/20 font-semibold"
                      >
                        Admin Panel
                      </button>
                    )}
                    <button
                      onClick={() => { onLogout?.(); setMobileMenuOpen(false); }}
                      className="w-full text-left px-3 py-2 rounded-md text-red-400 hover:bg-brand-teal/20"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => { navigate('/login'); setMobileMenuOpen(false); }}
                      className="w-full text-left px-3 py-2 rounded-md text-brand-off/90 hover:bg-brand-teal/20"
                    >
                      Login
                    </button>
                    <button
                      onClick={() => { navigate('/register'); setMobileMenuOpen(false); }}
                      className="w-full text-left px-3 py-2 rounded-md text-brand-gold hover:bg-brand-teal/20 font-semibold"
                    >
                      Register
                    </button>
                  </>
                )}
              </div>

              {/* Categories */}
              <div className="mt-2">
                <div className="px-2 text-xs uppercase tracking-wide text-brand-off/70 mb-2">Categories</div>
                <div className="flex flex-col">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => {
                        onCategoryChange(cat);
                        setMobileMenuOpen(false);
                        navigate(`/category/${encodeURIComponent(cat)}`);
                      }}
                      className={`text-left px-4 py-2 rounded-md mb-1 transition ${
                        selectedCategory === cat
                          ? 'bg-brand-gold/20 text-brand-off font-semibold border border-brand-gold/30'
                          : 'text-brand-off/90 hover:bg-brand-teal/20'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </header>

      {/* Cart Drawer */}
      {cartOpen && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/40" onClick={() => setCartOpen(false)} />
          <motion.div 
            initial={{ x: '100%', opacity: 0 }} 
            animate={{ x: 0, opacity: 1 }} 
            transition={{ duration: 0.35, ease: 'easeOut' }} 
            className="absolute right-0 top-0 h-full w-full max-w-sm bg-brand-tealDark text-brand-off shadow-2xl border-l border-brand-gold/20"
          >
            <div className="p-4">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-bold">Shopping Cart ({getTotalItems()} items)</h2>
                <button 
                  onClick={() => setCartOpen(false)} 
                  className="text-2xl leading-none hover:text-brand-gold transition"
                >
                  ×
                </button>
              </div>

              {cart.length === 0 ? (
                <div className="text-center py-8">
                  <svg className="w-16 h-16 mx-auto text-brand-off/30 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
                  </svg>
                  <p className="text-brand-off/80">Your cart is empty</p>
                  <button
                    onClick={() => { setCartOpen(false); navigate('/products'); }}
                    className="mt-4 px-4 py-2 bg-brand-gold text-brand-tealDark rounded-lg font-semibold hover:bg-brand-gold/90 transition"
                  >
                    Continue Shopping
                  </button>
                </div>
              ) : (
                <>
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {cart.map((item) => (
                      <div key={item.product._id} className="flex items-center gap-4 p-3 bg-brand-teal/10 rounded-lg">
                        <ImageWithFallback
                          src={item.product.image}
                          alt={item.product.name}
                          className="w-16 h-16 object-cover rounded"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold truncate">{item.product.name}</div>
                          <div className="text-sm text-brand-gold">${item.product.price.toLocaleString()}</div>
                          <div className="flex items-center mt-2">
                            <button
                              onClick={() => updateCartItem(item.product._id, item.quantity - 1)}
                              className="px-2 py-1 rounded border border-brand-off/30 hover:bg-brand-teal/20 transition"
                            >
                              -
                            </button>
                            <span className="mx-3">{item.quantity}</span>
                            <button
                              onClick={() => updateCartItem(item.product._id, item.quantity + 1)}
                              className="px-2 py-1 rounded border border-brand-off/30 hover:bg-brand-teal/20 transition"
                            >
                              +
                            </button>
                          </div>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.product._id)}
                          className="text-rose-400 hover:text-rose-300 transition"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                            <path fillRule="evenodd" d="M16.5 4.478V5.25h3.375a.75.75 0 0 1 0 1.5h-.546l-1.2 12.01A2.25 2.25 0 0 1 15.888 21H8.112a2.25 2.25 0 0 1-2.241-2.24L4.67 6.75h-.546a.75.75 0 0 1 0-1.5H7.5v-.772A2.478 2.478 0 0 1 9.978 1.5h4.044A2.478 2.478 0 0 1 16.5 4.478ZM9 9.75a.75.75 0 0 1 1.5 0v7.5a.75.75 0 0 1-1.5 0v-7.5Zm4.5 0a.75.75 0 0 1 1.5 0v7.5a.75.75 0 0 1-1.5 0v-7.5Z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 border-t border-brand-off/10 pt-4">
                    <div className="flex items-center justify-between font-bold mb-3">
                      <span>Total:</span>
                      <span className="text-brand-gold">${getTotalPrice().toLocaleString()}</span>
                    </div>
                    <button
                      onClick={handleCheckout}
                      className="w-full py-3 rounded-md font-semibold text-brand-tealDark bg-brand-gold hover:bg-brand-gold/90 transition"
                    >
                      Checkout
                    </button>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
};

export default Header;
