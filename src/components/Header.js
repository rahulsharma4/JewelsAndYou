import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Grid, Info, Phone, User as UserIcon, ShoppingBag, Settings, LogOut } from 'lucide-react';
import logo from '../Assets/LogoLatest.png';
import SearchBar from './SearchBar';
import { useCart } from '../contexts/CartContext';
import api from '../services/api';

const Header = ({ cartItemCount, onCartClick, selectedCategory, onCategoryChange, user, onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [categoryMenuOpen, setCategoryMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [categories, setCategories] = useState(['All']);
  const categoryRef = useRef(null);
  const userRef = useRef(null);

  useEffect(() => {
    const fetchCats = async () => {
      try {
        const list = await api.getCategories();
        if (Array.isArray(list)) {
          const cleanList = list.filter(cat => 
            typeof cat === 'string' && 
            cat.trim() !== '' && 
            /[a-zA-Z0-9]/.test(cat)
          );
          setCategories(['All', ...cleanList]);
        }
      } catch (err) {
        console.error('Error fetching dynamic categories in Header:', err);
      }
    };
    fetchCats();

    const handleClickOutside = (event) => {
      if (categoryRef.current && !categoryRef.current.contains(event.target)) {
        setCategoryMenuOpen(false);
      }
      if (userRef.current && !userRef.current.contains(event.target)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Use cart context
  const { getTotalItems } = useCart();

  const handleCategorySelect = (category) => {
    onCategoryChange(category);
    setCategoryMenuOpen(false);
    navigate(`/category/${encodeURIComponent(category)}`);
  };

  const handleCartClick = () => {
    onCartClick?.();
  };

  return (
    <>
      <header className="sticky top-0 z-50 shadow-sm font-body">
        <div className="bg-brand-light">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex h-14 items-center justify-between">
              {/* Brand */}
              <div className="flex items-center gap-2">
                <img
                  src={logo}
                  alt="Logo"
                  className="h-10 cursor-pointer"
                  onClick={() => navigate('/')}
                />
              </div>

              {/* Desktop nav */}
              <nav className="hidden md:flex items-center gap-1">
                {[
                  { name: 'Home', path: '/' },
                  { name: 'Products', path: '/products' },
                  { name: 'About', path: '/about' },
                  { name: 'Contact', path: '/contact' }
                ].map(item => {
                  const isActive = location.pathname === item.path;
                  return (
                    <button
                      key={item.name}
                      onClick={() => navigate(item.path)}
                      className={`px-4 py-2 rounded-full text-sm transition-all duration-300 ${
                        isActive 
                          ? 'font-bold bg-brand-gold text-white shadow-md shadow-brand-gold/20 -translate-y-0.5' 
                          : 'font-medium text-brand-dark/80 hover:bg-brand-gold/10 hover:text-brand-dark'
                      }`}
                    >
                      {item.name}
                    </button>
                  );
                })}

                {/* Categories dropdown */}
                <div className="relative" ref={categoryRef}>
                  <button
                    onClick={() => setCategoryMenuOpen((v) => !v)}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition ${
                      categoryMenuOpen ? 'bg-brand-gold/20 text-brand-dark' : 'text-brand-dark/90 hover:bg-brand-light/10 hover:text-brand-dark'
                    }`}
                  >
                    Categories
                  </button>
                  {categoryMenuOpen && (
                    <div className="absolute right-0 mt-2 w-44 rounded-md bg-brand-light shadow-lg ring-1 ring-brand-gold/20 text-brand-dark border border-brand-gold/20">
                      <ul className="py-1">
                        {categories.map((cat) => (
                          <li key={cat}>
                            <button
                              onClick={() => handleCategorySelect(cat)}
                              className={`w-full text-left px-3 py-2 text-sm rounded-md transition ${
                                selectedCategory === cat ? 'bg-brand-gold/20 text-brand-dark font-semibold' : 'hover:bg-brand-cream/20'
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
                  <div className="relative" ref={userRef}>
                    <button
                      onClick={() => setUserMenuOpen(!userMenuOpen)}
                      className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium text-brand-dark/90 hover:bg-brand-light/10 hover:text-brand-dark transition"
                    >
                      <div className="w-8 h-8 bg-brand-gold rounded-full flex items-center justify-center text-brand-light font-semibold">
                        {user.name?.charAt(0)?.toUpperCase()}
                      </div>
                      <span className="hidden md:block">{user.name}</span>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    {userMenuOpen && (
                      <div className="absolute right-0 mt-2 w-48 rounded-md bg-brand-light shadow-lg ring-1 ring-brand-gold/20 text-brand-dark border border-brand-gold/20">
                        <div className="py-1">
                          <button
                            onClick={() => { navigate('/profile'); setUserMenuOpen(false); }}
                            className="w-full text-left px-4 py-2 text-sm hover:bg-brand-cream/20 transition"
                          >
                            Profile
                          </button>
                          <button
                            onClick={() => { navigate('/orders'); setUserMenuOpen(false); }}
                            className="w-full text-left px-4 py-2 text-sm hover:bg-brand-cream/20 transition"
                          >
                            Orders
                          </button>
                          {user.role === 'admin' && (
                            <button
                              onClick={() => { navigate('/admin/dashboard'); setUserMenuOpen(false); }}
                              className="w-full text-left px-4 py-2 text-sm hover:bg-brand-cream/20 transition text-brand-gold font-semibold"
                            >
                              Admin Panel
                            </button>
                          )}
                          <hr className="my-1 border-brand-gold/20" />
                          <button
                            onClick={() => { onLogout?.(); setUserMenuOpen(false); }}
                            className="w-full text-left px-4 py-2 text-sm hover:bg-brand-cream/20 transition text-red-400"
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
                      className="px-3 py-2 rounded-md text-sm font-medium text-brand-dark/90 hover:bg-brand-light/10 hover:text-brand-dark transition"
                    >
                      Login
                    </button>
                    <button
                      onClick={() => navigate('/register')}
                      className="px-3 py-2 rounded-md text-sm font-medium bg-brand-gold text-brand-light hover:bg-brand-gold/90 transition"
                    >
                      Register
                    </button>
                  </div>
                )}
                
                {/* Mobile menu button */}
                <button
                  className="md:hidden flex items-center justify-center rounded-md p-2 text-brand-dark hover:bg-brand-gold/10 focus:outline-none transition"
                  onClick={() => setMobileMenuOpen(true)}
                  aria-label="Open menu"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                  </svg>
                </button>

                {/* Cart button with badge - Hidden on mobile, handled by BottomNav */}
                <button
                  onClick={handleCartClick}
                  className="hidden md:inline-flex relative items-center justify-center rounded-full p-2 text-brand-dark hover:bg-brand-light/10 focus:outline-none focus:ring-2 focus:ring-brand-gold/40"
                  aria-label="Open cart"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                    <path d="M2.25 3a.75.75 0 0 1 .75-.75h1.287a1.5 1.5 0 0 1 1.445 1.106l.232.928h12.786a.75.75 0 0 1 .731.915l-1.5 6a.75.75 0 0 1-.731.585H7.06l.24.96h10.2a.75.75 0 0 1 0 1.5H6.75a1.5 1.5 0 0 1-1.445-1.106L3.34 4.393A.75.75 0 0 0 2.287 3.75H3a.75.75 0 0 1-.75-.75ZM7.5 20.25a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Zm9 0a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z" />
                  </svg>
                  {getTotalItems() > 0 && (
                    <span className="absolute -top-1 -right-1 min-w-[1.25rem] h-5 px-1 inline-flex items-center justify-center rounded-full text-xs font-bold bg-brand-gold text-brand-light">
                      {getTotalItems()}
                    </span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Drawer (Beautiful App Sidebar) */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <div className="fixed inset-0 z-[60]">
              <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} />
              <motion.div 
                initial={{ x: '-100%' }} 
                animate={{ x: 0 }} 
                exit={{ x: '-100%' }}
                transition={{ duration: 0.35, ease: 'easeOut' }} 
                className="absolute left-0 top-0 h-full w-[80%] max-w-sm bg-[#FFFDF9] shadow-2xl flex flex-col overflow-hidden"
              >
                {/* Profile Header */}
                <div className="relative bg-brand-dark p-6 pb-8 rounded-br-[3rem] overflow-hidden">
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-brand-gold/20 via-transparent to-transparent opacity-60" />
                  <button
                    className="absolute top-4 right-4 p-2 rounded-full bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm transition-all"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                      <path fillRule="evenodd" d="M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 0 1-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
                    </svg>
                  </button>
                  
                  {user ? (
                    <div className="flex items-center gap-4 mt-4 relative z-10">
                      <div className="w-16 h-16 bg-brand-gold rounded-full flex items-center justify-center text-brand-dark text-2xl font-bold shadow-lg border-2 border-brand-dark">
                        {user.name?.charAt(0)?.toUpperCase()}
                      </div>
                      <div>
                        <div className="font-bold font-heading text-xl text-white">{user.name}</div>
                        <div className="text-[10px] font-bold uppercase tracking-wider text-brand-gold mt-1">
                          {user.role === 'admin' ? 'Admin User' : 'Verified Member'}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="mt-4 relative z-10">
                      <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center text-brand-gold border border-white/20 mb-3 backdrop-blur-sm">
                        <UserIcon className="w-7 h-7" />
                      </div>
                      <div className="font-bold font-heading text-2xl text-white mb-1">Welcome!</div>
                      <div className="text-sm font-medium text-white/60">Login to access your account</div>
                    </div>
                  )}
                </div>

                {/* Navigation Links */}
                <div className="flex-1 overflow-y-auto px-4 py-6 space-y-1">
                  {[
                    { name: 'Home', path: '/', icon: Home },
                    { name: 'Products', path: '/products', icon: Grid },
                    { name: 'About Us', path: '/about', icon: Info },
                    { name: 'Contact', path: '/contact', icon: Phone }
                  ].map(item => {
                    const isActive = location.pathname === item.path;
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.name}
                        onClick={() => { navigate(item.path); setMobileMenuOpen(false); }}
                        className={`w-full flex items-center gap-4 px-4 py-4 rounded-2xl transition-all ${
                          isActive 
                            ? 'bg-brand-gold text-white font-bold shadow-md shadow-brand-gold/20' 
                            : 'text-brand-dark/70 hover:bg-[#FDFBF7] font-medium border border-transparent'
                        }`}
                      >
                        <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-brand-gold'}`} />
                        <span>{item.name}</span>
                        {isActive && <div className="ml-auto w-2 h-2 rounded-full bg-white shadow-sm" />}
                      </button>
                    );
                  })}

                  <div className="my-4 border-t border-brand-gold/10" />
                  
                  <div className="px-4 text-xs font-bold uppercase tracking-wider text-brand-dark/40 mb-2">My Account</div>
                  
                  {user ? (
                    <>
                      <button onClick={() => { navigate('/profile'); setMobileMenuOpen(false); }} className="w-full flex items-center gap-4 px-4 py-3 rounded-xl text-brand-dark/80 hover:bg-brand-cream font-medium transition">
                        <Settings className="w-5 h-5 text-brand-dark/50" /> <span>Profile Settings</span>
                      </button>
                      <button onClick={() => { navigate('/orders'); setMobileMenuOpen(false); }} className="w-full flex items-center gap-4 px-4 py-3 rounded-xl text-brand-dark/80 hover:bg-brand-cream font-medium transition">
                        <ShoppingBag className="w-5 h-5 text-brand-dark/50" /> <span>My Orders</span>
                      </button>
                      {user.role === 'admin' && (
                        <button onClick={() => { navigate('/admin/dashboard'); setMobileMenuOpen(false); }} className="w-full flex items-center gap-4 px-4 py-3 rounded-xl text-brand-gold hover:bg-brand-gold/10 font-bold transition">
                          <UserIcon className="w-5 h-5 text-brand-gold" /> <span>Admin Panel</span>
                        </button>
                      )}
                      <button onClick={() => { onLogout?.(); setMobileMenuOpen(false); }} className="w-full flex items-center gap-4 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 font-medium transition mt-4">
                        <LogOut className="w-5 h-5 text-red-400" /> <span>Logout</span>
                      </button>
                    </>
                  ) : (
                    <>
                      <button onClick={() => { navigate('/login'); setMobileMenuOpen(false); }} className="w-full flex items-center gap-4 px-4 py-3 rounded-xl text-brand-dark/80 hover:bg-brand-cream font-medium transition">
                        <UserIcon className="w-5 h-5 text-brand-dark/50" /> <span>Login</span>
                      </button>
                      <button onClick={() => { navigate('/register'); setMobileMenuOpen(false); }} className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-brand-gold text-white font-bold shadow-md hover:bg-brand-gold/90 transition mt-2">
                        Create Account
                      </button>
                    </>
                  )}
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </header>


    </>
  );
};

export default Header;
