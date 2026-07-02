import React from 'react';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
const BASE_SERVER_URL = API_BASE_URL.replace('/api', '');

// Utility function to get the correct image URL
export const getImageUrl = (imagePath) => {
  if (!imagePath) {
    return '/placeholder.svg'; // Default placeholder
  }
  
  // Check if it's an uploaded image (has timestamp prefix)
  if (/^\d+\.(jpg|jpeg|png|gif|svg|webp)$/i.test(imagePath)) {
    return `${BASE_SERVER_URL}/uploads/${imagePath}`;
  }
  
  // Check if it's an asset image (starts with Jevel or Logo)
  if (/^(Jevel|Logo)/i.test(imagePath)) {
    return `${BASE_SERVER_URL}/assets/${imagePath}`;
  }
  
  // For any other case, try uploads first, then assets
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
  
  // If it's a timestamp-based filename, it's definitely an upload
  if (/^\d+\.(jpg|jpeg|png|gif|svg|webp)$/i.test(imagePath)) {
    return `${BASE_SERVER_URL}/uploads/${imagePath}`;
  }
  
  // For other filenames, try uploads first, then assets
  return `${BASE_SERVER_URL}/uploads/${imagePath}`;
};
