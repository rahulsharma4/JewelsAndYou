import React from 'react';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
const BASE_SERVER_URL = API_BASE_URL.replace('/api', '');

export const getImageUrl = (imagePath) => {
  if (!imagePath) return '/placeholder.svg';
  
  // Clean up any double slashes in URL
  const cleanUrl = `${BASE_SERVER_URL}/uploads/${imagePath}`.replace(/([^:]\/)\/+/g, '$1');
  return cleanUrl;
};

export const ImageWithFallback = ({ src, alt, className, ...props }) => {
  const [imgSrc, setImgSrc] = React.useState(getImageUrl(src));
  const [hasError, setHasError] = React.useState(false);

  React.useEffect(() => {
    setImgSrc(getImageUrl(src));
    setHasError(false);
  }, [src]);

  const handleError = () => {
    if (!hasError) {
      console.warn("Image load failed for:", imgSrc, "Original src:", src);
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

export const getImageUrlWithFallback = getImageUrl;
