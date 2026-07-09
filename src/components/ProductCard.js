import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ImageWithFallback } from '../utils/imageUtils';
import { Heart, ShoppingBag, Eye } from 'lucide-react';

const ProductCard = ({ product, onAddToCart, onToggleFavorite, isFavorite = false }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/product/${product._id || product.id}`);
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    onAddToCart(product);
  };

  const handleToggleFavorite = (e) => {
    e.stopPropagation();
    onToggleFavorite(product._id || product.id);
  };

  const handleViewDetails = (e) => {
    e.stopPropagation();
    navigate(`/product/${product._id || product.id}`);
  };

  return (
    <div
      onClick={handleCardClick}
      className="group flex flex-col bg-white rounded-[2rem] p-3 border border-brand-gold/15 shadow-[0_10px_40px_rgba(0,0,0,0.03)] hover:shadow-[0_15px_50px_rgba(212,175,55,0.12)] hover:border-brand-gold/40 transition-all duration-700 cursor-pointer h-full relative overflow-hidden"
    >
      {/* Decorative Glow on Hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-brand-gold/0 via-brand-gold/0 to-brand-gold/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

      {/* Premium Image Container */}
      <div className="relative h-[280px] w-full rounded-[1.5rem] bg-gradient-to-br from-[#ffffff] via-[#FDFBF7] to-[#F4EFE6] overflow-hidden border border-brand-gold/10">
        <ImageWithFallback
          src={product.image || (product.images && product.images.length > 0 ? product.images[0] : null)}
          alt={product.name}
          className="w-full h-full object-contain mix-blend-multiply p-6 drop-shadow-md transition-all duration-700 group-hover:scale-110 group-hover:drop-shadow-2xl"
        />

        {/* Floating Actions */}
        <div className="absolute top-4 w-full px-4 flex justify-between items-start z-10">
          {/* Category Badge */}
          <span className="inline-block px-3 py-1.5 bg-white/90 backdrop-blur-md rounded-full text-[9px] font-bold uppercase tracking-widest text-brand-gold border border-brand-gold/20 shadow-sm">
            {product.category}
          </span>

          {/* Favorite Button */}
          <button
            onClick={handleToggleFavorite}
            className="w-9 h-9 flex items-center justify-center rounded-full bg-white/90 backdrop-blur-md shadow-md border border-brand-gold/20 hover:bg-red-50 hover:border-red-100 hover:scale-110 transition-all duration-300 group/fav"
            aria-label="Toggle favorite"
          >
            <Heart
              className={`w-4 h-4 transition-all duration-300 ${
                isFavorite
                  ? 'fill-red-500 text-red-500'
                  : 'text-brand-dark/40 group-hover/fav:text-red-500'
              }`}
            />
          </button>
        </div>

        {/* Quick View Button overlay */}
        <div className="absolute inset-x-4 bottom-4 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 z-10 hidden sm:block">
           <button
             onClick={handleAddToCart}
             className="w-full py-3 rounded-xl bg-white/90 backdrop-blur-md border border-brand-gold/20 text-brand-dark text-xs font-bold uppercase tracking-widest shadow-lg hover:bg-brand-gold hover:text-white transition-colors duration-300 flex items-center justify-center gap-2"
           >
             <ShoppingBag className="w-4 h-4" /> Quick Add
           </button>
        </div>
      </div>

      {/* Elegant Info Section */}
      <div className="pt-5 px-2 flex flex-col flex-1 bg-transparent relative z-10">
        <h3 className="font-heading text-lg font-bold text-brand-dark leading-snug line-clamp-1 mb-1 group-hover:text-brand-gold transition-colors">
          {product.name}
        </h3>
        
        <div className="flex items-center justify-between mt-1 mb-2">
           {/* Minimalist Rating */}
          <div className="flex items-center gap-1.5">
            <div className="flex text-brand-gold text-[10px]">
              {Array.from({ length: 5 }).map((_, i) => (
                <span key={i}>{i < Math.round(product.rating || 5) ? '★' : '☆'}</span>
              ))}
            </div>
            <span className="text-[10px] text-brand-dark/40 font-semibold">
              ({product.rating || 5})
            </span>
          </div>

          <span className="text-brand-gold font-bold text-lg">
            ₹{product.price?.toLocaleString('en-IN')}
          </span>
        </div>

        <p className="text-xs font-medium text-brand-dark/50 mb-4 line-clamp-2">
          {product.description}
        </p>

        {/* Add to Cart - Mobile only since desktop has hover button */}
        <button
          onClick={handleAddToCart}
          className="mt-auto sm:hidden w-full py-3 rounded-xl border border-brand-gold/30 bg-brand-light text-brand-dark text-[11px] font-bold uppercase tracking-widest active:bg-brand-gold active:text-white transition-colors duration-300 flex items-center justify-center gap-2"
        >
          <ShoppingBag className="w-4 h-4" /> Add to Bag
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
