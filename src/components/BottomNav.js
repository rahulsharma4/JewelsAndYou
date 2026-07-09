import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, Grid, ShoppingBag, User } from 'lucide-react';
import { useCart } from '../contexts/CartContext';

const BottomNav = ({ user, onCartClick }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { getTotalItems } = useCart();

  const navItems = [
    { name: 'Home', icon: Home, path: '/' },
    { name: 'Products', icon: Grid, path: '/products' },
    { name: 'Cart', icon: ShoppingBag, path: '/cart', isCart: true },
    { name: 'Profile', icon: User, path: user ? '/profile' : '/login' },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-[100] pb-safe px-4 pb-4 pointer-events-none">
      <div className="bg-white/80 backdrop-blur-xl border border-brand-dark/10 shadow-[0_8px_32px_rgba(0,0,0,0.08)] rounded-[2rem] mx-auto max-w-sm pointer-events-auto flex justify-around items-center h-16 px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <button
              key={item.name}
              onClick={() => {
                if (item.isCart && onCartClick) {
                  onCartClick();
                } else {
                  navigate(item.path);
                }
              }}
              className="relative flex flex-col items-center justify-center w-16 h-full group"
            >
              <motion.div
                whileTap={{ scale: 0.85 }}
                className={`relative flex flex-col items-center justify-center w-full h-full transition-all duration-300 ${isActive ? '-translate-y-1' : ''}`}
              >
                <div className={`p-2 rounded-2xl transition-all duration-300 ${isActive ? 'bg-brand-gold text-white shadow-md shadow-brand-gold/30' : 'text-brand-dark/50 group-hover:text-brand-dark'}`}>
                  <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
                  {item.isCart && getTotalItems() > 0 && (
                    <span className="absolute top-1 right-2 inline-flex items-center justify-center min-w-[18px] h-[18px] text-[10px] font-bold text-white bg-red-500 rounded-full px-1 shadow-sm border-2 border-white ring-1 ring-black/5">
                      {getTotalItems()}
                    </span>
                  )}
                </div>
                
                {isActive && (
                  <motion.div 
                    layoutId="bottomNavDot"
                    className="absolute -bottom-1 w-1.5 h-1.5 rounded-full bg-brand-gold"
                  />
                )}
              </motion.div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNav;
