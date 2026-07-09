import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import { Heart } from "lucide-react";

const WishlistPage = ({ products = [], favorites = [], onAddToCart, onToggleFavorite }) => {
  const navigate = useNavigate();
  const wishlistProducts = products.filter(product => favorites.includes(product._id || product.id));

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 pb-24 md:pb-8">
      <h1 className="text-3xl font-heading font-bold mb-1">My Wishlist</h1>
      
      {wishlistProducts.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-brand-light text-brand-dark p-10 rounded-2xl border border-brand-gold/15 text-center max-w-xl mx-auto mt-8"
        >
          <Heart className="w-14 h-14 text-brand-gold/30 mx-auto mb-4" />
          <h2 className="text-xl font-bold font-heading mb-2">Your Wishlist is Empty</h2>
          <p className="text-brand-dark/60 text-sm mb-6 max-w-xs mx-auto">Explore our premium collections and save your favorite designs here.</p>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/products')}
            className="px-6 py-3 rounded-lg bg-brand-gold text-brand-light font-bold text-sm shadow-lg shadow-brand-gold/10"
          >
            Start Exploring
          </motion.button>
        </motion.div>
      ) : (
        <>
          <p className="text-brand-dark/60 text-sm mb-8">You have saved {wishlistProducts.length} items in your wishlist</p>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4"
          >
            {wishlistProducts.map((product, index) => (
              <motion.div
                key={product._id || product.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <ProductCard
                  product={product}
                  onAddToCart={onAddToCart}
                  onToggleFavorite={onToggleFavorite}
                  isFavorite={favorites.includes(product._id || product.id)}
                />
              </motion.div>
            ))}
          </motion.div>
        </>
      )}
    </div>
  );
};

export default WishlistPage;
