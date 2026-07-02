import React from "react";
import { motion } from "framer-motion";
import ProductCard from "../components/ProductCard";

const WishlistPage = ({ products = [], favorites = [], onAddToCart, onToggleFavorite }) => {
  const wishlistProducts = products.filter(product => favorites.includes(product.id));

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">My Wishlist</h1>
      
      {wishlistProducts.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-brand-tealDark text-brand-off p-8 rounded-lg border border-brand-gold/20 text-center"
        >
          <div className="text-6xl mb-4">💝</div>
          <h2 className="text-xl font-bold mb-2">Your wishlist is empty</h2>
          <p className="text-brand-off/80 mb-4">Start adding items you love to your wishlist!</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            className="px-6 py-3 rounded-md bg-brand-gold text-brand-tealDark font-semibold"
          >
            Browse Products
          </motion.button>
        </motion.div>
      ) : (
        <>
          <p className="text-brand-off/80 mb-6">You have {wishlistProducts.length} items in your wishlist</p>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ staggerChildren: 0.1 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {wishlistProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <ProductCard
                  product={product}
                  onAddToCart={onAddToCart}
                  onToggleFavorite={onToggleFavorite}
                  isFavorite={favorites.includes(product.id)}
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
