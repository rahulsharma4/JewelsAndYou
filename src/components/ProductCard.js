import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ImageWithFallback } from '../utils/imageUtils';

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
      className="h-full flex flex-col rounded-lg overflow-hidden shadow-sm  bg-brand-tealDark cursor-pointer transition-transform duration-300 hover:-translate-y-2 hover:shadow-xl"
    >
      <div className="relative h-72">
        <ImageWithFallback
          src={product.image}
          alt={product.name}
          className="absolute inset-0 h-full w-full object-cover"
        />

        {/* Favorite button */}
        <button
          onClick={handleToggleFavorite}
          className="absolute top-2 right-2 z-10 inline-flex items-center justify-center rounded-full p-2  bg-brand-tealDark/90 hover: bg-brand-tealDark"
          aria-label="Toggle favorite"
        >
          {isFavorite ? (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#e91e63" className="w-5 h-5">
              <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.227 3 12.973 3 10.5 3 7.462 5.462 5 8.5 5a5.49 5.49 0 0 1 3.5 1.236A5.49 5.49 0 0 1 15.5 5C18.538 5 21 7.462 21 10.5c0 2.473-1.688 4.727-3.989 7.007a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.218l-.022.012-.007.003a.75.75 0 0 1-.666 0z" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
              <path fillRule="evenodd" d="M11.53 3.293a6.75 6.75 0 0 1 9.548 9.548l-7.075 7.076a2.25 2.25 0 0 1-3.183 0L3.745 12.84a6.75 6.75 0 1 1 9.548-9.548 6.704 6.704 0 0 1 2.344 1.79 6.705 6.705 0 0 1-4.108-1.79Z" clipRule="evenodd" />
            </svg>
          )}
        </button>

        {/* Category badge */}
        <span className="absolute top-2 left-2 z-10 inline-flex items-center rounded-md bg-yellow-300/90 text-slate-900 text-xs font-semibold px-2 py-1">
          {product.category}
        </span>
      </div>

      <div className="flex-1 p-4">
        <h3 className="text-base font-bold mb-1 line-clamp-1">{product.name}</h3>
        <p className="text-sm text-slate-600 mb-2 min-h-[40px] line-clamp-2">{product.description}</p>
        <div className="flex items-center mb-2">
          <div className="flex items-center">
            {/* rating as stars */}
            <div className="text-yellow-500 mr-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <span key={i}>{i + 1 <= Math.round(product.rating) ? '★' : '☆'}</span>
              ))}
            </div>
            <span className="text-xs text-slate-600">({product.rating})</span>
          </div>
        </div>
        <div className="text-lg font-bold text-brand-gold mb-2">
          ₹{product.price.toLocaleString('en-IN')}
        </div>
      </div>

      <div className="px-4 pb-4">
        <div className="flex items-center justify-between">
          <button
            onClick={handleViewDetails}
            className="inline-flex items-center justify-center rounded-md px-3 py-2 text-sm bg-brand-gold/15 text-brand-gold hover:bg-brand-gold/25"
          >
            View
          </button>
          <button
            onClick={handleAddToCart}
            className="inline-flex items-center justify-center rounded-md px-3 py-2 text-sm font-semibold bg-brand-gold text-brand-tealDark"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
