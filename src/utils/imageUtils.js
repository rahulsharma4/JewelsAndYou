import React from 'react';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
const BASE_SERVER_URL = API_BASE_URL.replace('/api', '');

// Utility function to get the correct image URL
export const getImageUrl = (imagePath) => {
  if (!imagePath) {
    return '/placeholder.svg'; // Default placeholder
  }
  
  // Check if it's an asset image (starts with Jevel or Logo)
  if (/^(Jevel|Logo)/i.test(imagePath)) {
    try {
      return require(`../Assets/${imagePath}`);
    } catch (e) {
      console.warn("Asset not found:", imagePath);
    }
  }
  
  // For uploaded images and any other case, use /uploads
  return `${BASE_SERVER_URL}/uploads/${imagePath}`;
};

// Enhanced image component with error handling
export const ImageWithFallback = ({ src, alt, className, ...props }) => {
  const [imgSrc, setImgSrc] = React.useState(getImageUrl(src));
  const [hasError, setHasError] = React.useState(false);

  React.useEffect(() => {
    setImgSrc(getImageUrl(src));
    setHasError(false);
  }, [src]);

  const handleError = () => {
    if (!hasError) {
      setHasError(true);
      setImgSrc('/placeholder.svg');
    }
  };

  return (
    <img
      src={imgSrc}
      alt={alt}
      className={className}
      onError={handleError}
      loading="lazy"
      {...props}
    />
  );
};

// Alternative function that tries multiple paths
export const getImageUrlWithFallback = (imagePath) => {
  if (!imagePath) {
    return '/placeholder.svg';
  }
  
  if (/^(Jevel|Logo)/i.test(imagePath)) {
    try {
      return require(`../Assets/${imagePath}`);
    } catch (e) {
      console.warn("Asset not found:", imagePath);
    }
  }
  
  // For other filenames, use uploads
  return `${BASE_SERVER_URL}/uploads/${imagePath}`;
};
