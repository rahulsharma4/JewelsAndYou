import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, Search, ShoppingBag, User } from 'lucide-react';
import { useCart } from '../contexts/CartContext';

const BottomNav = ({ user, onCartClick }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { getTotalItems } = useCart();

  const navItems = [
    { name: 'Home', icon: Home, path: '/' },
    { name: 'Search', icon: Search, path: '/search' },
    { name: 'Cart', icon: ShoppingBag, path: '/cart', isCart: true },
    { name: 'Profile', icon: User, path: user ? '/profile' : '/login' },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-brand-tealDark border-t border-brand-gold/20 pb-safe z-50">
      <div className="flex justify-around items-center h-16">
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
              className="relative flex flex-col items-center justify-center w-full h-full text-brand-off"
            >
              <motion.div
                whileTap={{ scale: 0.9 }}
                className={`p-2 rounded-full ${isActive ? 'text-brand-gold' : 'text-brand-off/70'}`}
              >
                <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
                {item.isCart && getTotalItems() > 0 && (
                  <span className="absolute top-1 right-2 inline-flex items-center justify-center min-w-[18px] h-[18px] text-[10px] font-bold text-brand-tealDark bg-brand-gold rounded-full px-1">
                    {getTotalItems()}
                  </span>
                )}
              </motion.div>
              <span className={`text-[10px] font-medium ${isActive ? 'text-brand-gold' : 'text-brand-off/70'}`}>
                {item.name}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNav;
