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
      className="group h-full flex flex-col rounded-xl overflow-hidden bg-brand-tealDark border border-brand-gold/10 hover:border-brand-gold/30 cursor-pointer transition-all duration-300"
    >
      {/* Image Container */}
      <div className="relative h-64 overflow-hidden">
        <ImageWithFallback
          src={product.image || (product.images && product.images.length > 0 ? product.images[0] : null)}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        />

        {/* Gradient overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Favorite button */}
        <button
          onClick={handleToggleFavorite}
          className="absolute top-3 right-3 z-10 w-9 h-9 flex items-center justify-center rounded-full bg-brand-tealDark/80 backdrop-blur-sm border border-brand-off/10 hover:bg-brand-tealDark transition group/fav"
          aria-label="Toggle favorite"
        >
          <Heart
            className={`w-4 h-4 transition-all ${
              isFavorite
                ? 'fill-red-500 text-red-500 scale-110'
                : 'text-brand-off/70 group-hover/fav:text-red-400'
            }`}
          />
        </button>

        {/* Category badge */}
        <span className="absolute top-3 left-3 z-10 text-[10px] font-semibold px-2.5 py-1 rounded-md bg-brand-tealDark/80 text-brand-gold border border-brand-gold/20 backdrop-blur-sm">
          {product.category}
        </span>

        {/* Hover action buttons */}
        <div className="absolute bottom-3 left-3 right-3 flex gap-2 opacity-0 translate-y-3 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
          <button
            onClick={handleAddToCart}
            className="flex-1 inline-flex items-center justify-center gap-1.5 bg-brand-gold text-brand-tealDark text-xs font-semibold py-2.5 rounded-lg hover:bg-brand-gold/90 transition"
          >
            <ShoppingBag className="w-3.5 h-3.5" /> Add to Cart
          </button>
          <button
            onClick={handleViewDetails}
            className="w-10 h-10 flex items-center justify-center bg-brand-tealDark/80 backdrop-blur-sm rounded-lg border border-brand-off/20 hover:bg-brand-tealDark transition"
            title="Quick View"
          >
            <Eye className="w-4 h-4 text-brand-off" />
          </button>
        </div>
      </div>

      {/* Product Info */}
      <div className="flex-1 p-4 flex flex-col">
        <h3 className="font-semibold text-sm mb-1 truncate">{product.name}</h3>
        <p className="text-xs text-brand-off/50 mb-2 line-clamp-2 flex-1">{product.description}</p>

        {/* Rating */}
        <div className="flex items-center gap-1.5 mb-2">
          <div className="flex text-yellow-500 text-xs">
            {Array.from({ length: 5 }).map((_, i) => (
              <span key={i}>{i < Math.round(product.rating || 0) ? '★' : '☆'}</span>
            ))}
          </div>
          <span className="text-[10px] text-brand-off/40">({product.rating || 0})</span>
        </div>

        {/* Price */}
        <div className="text-brand-gold font-bold text-base">
          ₹{product.price?.toLocaleString('en-IN')}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
