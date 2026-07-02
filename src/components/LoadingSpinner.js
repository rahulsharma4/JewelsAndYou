import React from 'react';
import { motion } from 'framer-motion';

const LoadingSpinner = ({ size = 'md', text = 'Loading...', className = '' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <motion.div
        className={`${sizeClasses[size]} border-2 border-brand-gold/30 border-t-brand-gold rounded-full`}
        animate={{ rotate: 360 }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: "linear"
        }}
      />
      {text && (
        <motion.p
          className="mt-2 text-brand-off/70 text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {text}
        </motion.p>
      )}
    </div>
  );
};

// Skeleton loader for product cards
export const ProductCardSkeleton = () => (
  <div className="h-full rounded-lg overflow-hidden shadow-sm bg-brand-tealDark animate-pulse">
    <div className="h-64 w-full bg-brand-off/20" />
    <div className="p-4">
      <div className="h-4 bg-brand-off/20 rounded mb-2" />
      <div className="h-3 bg-brand-off/20 rounded mb-2 w-3/4" />
      <div className="h-3 bg-brand-off/20 rounded mb-2 w-1/2" />
      <div className="h-6 bg-brand-off/20 rounded w-1/3" />
    </div>
  </div>
);

// Skeleton loader for product list
export const ProductListSkeleton = () => (
  <div className="flex items-center gap-4 p-4 bg-brand-tealDark rounded-lg shadow-sm border border-brand-gold/20 animate-pulse">
    <div className="w-28 h-28 bg-brand-off/20 rounded" />
    <div className="flex-1">
      <div className="h-4 bg-brand-off/20 rounded mb-2" />
      <div className="h-3 bg-brand-off/20 rounded mb-2 w-3/4" />
      <div className="h-3 bg-brand-off/20 rounded mb-2 w-1/2" />
      <div className="h-6 bg-brand-off/20 rounded w-1/3" />
    </div>
  </div>
);

// Skeleton loader for categories
export const CategorySkeleton = () => (
  <div className="relative h-72 rounded-lg overflow-hidden shadow-sm bg-brand-off/20 animate-pulse">
    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/10" />
    <div className="absolute inset-0 flex items-center justify-center text-white">
      <div className="text-center">
        <div className="h-6 bg-white/20 rounded mb-1 w-24" />
        <div className="h-4 bg-white/20 rounded w-16 mx-auto" />
      </div>
    </div>
  </div>
);

// Skeleton loader for testimonials
export const TestimonialSkeleton = () => (
  <div className="p-6 bg-brand-tealDark rounded-lg shadow-sm text-center animate-pulse">
    <div className="w-20 h-20 rounded-full bg-brand-off/20 mx-auto mb-3" />
    <div className="h-4 bg-brand-off/20 rounded mb-2 w-16 mx-auto" />
    <div className="h-3 bg-brand-off/20 rounded mb-2 w-full" />
    <div className="h-3 bg-brand-off/20 rounded mb-2 w-3/4 mx-auto" />
    <div className="h-4 bg-brand-off/20 rounded w-24 mx-auto" />
  </div>
);

export default LoadingSpinner;