import React from 'react';
import jevel1 from '../Assets/Jevel1.jpg';
import jevel2 from '../Assets/Jevel2.jpg';
import jevel3 from '../Assets/Jevel3.jpg';
import jevel4 from '../Assets/Jevel4.jpg';
import jevel5 from '../Assets/Jevel5.jpg';
import jevel6 from '../Assets/Jevel6.jpg';
import jevel7 from '../Assets/Jevel7.jpg';
import jevel8 from '../Assets/Jevel8.jpg';
import jevel9 from '../Assets/Jevel9.jpg';
import jevel10 from '../Assets/Jevel10.jpg';
import jevel11 from '../Assets/Jevel11.jpg';
import jevel12 from '../Assets/Jevel12.jpg';
import jevel13 from '../Assets/Jevel13.jpg';
import jevel14 from '../Assets/Jevel14.jpg';
import jevel15 from '../Assets/Jevel15.jpg';
import jevel16 from '../Assets/Jevel16.jpg';
import jevel17 from '../Assets/Jevel17.jpg';
import jevel18 from '../Assets/Jevel18.jpg';
import jevel19 from '../Assets/Jevel19.jpg';
import jevel20 from '../Assets/Jevel20.jpg';
import jevel21 from '../Assets/Jevel21.jpg';
import jevel22 from '../Assets/Jevel22.jpg';
import jevel23 from '../Assets/Jevel23.jpg';
import logo from '../Assets/Logo.png';

const assetMap = {
  'Jevel1.jpg': jevel1,
  'Jevel2.jpg': jevel2,
  'Jevel3.jpg': jevel3,
  'Jevel4.jpg': jevel4,
  'Jevel5.jpg': jevel5,
  'Jevel6.jpg': jevel6,
  'Jevel7.jpg': jevel7,
  'Jevel8.jpg': jevel8,
  'Jevel9.jpg': jevel9,
  'Jevel10.jpg': jevel10,
  'Jevel11.jpg': jevel11,
  'Jevel12.jpg': jevel12,
  'Jevel13.jpg': jevel13,
  'Jevel14.jpg': jevel14,
  'Jevel15.jpg': jevel15,
  'Jevel16.jpg': jevel16,
  'Jevel17.jpg': jevel17,
  'Jevel18.jpg': jevel18,
  'Jevel19.jpg': jevel19,
  'Jevel20.jpg': jevel20,
  'Jevel21.jpg': jevel21,
  'Jevel22.jpg': jevel22,
  'Jevel23.jpg': jevel23,
  'Logo.png': logo
};

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
const BASE_SERVER_URL = API_BASE_URL.replace('/api', '');

export const getImageUrl = (imagePath) => {
  if (!imagePath) return '/placeholder.svg';
  
  if (assetMap[imagePath]) return assetMap[imagePath];
  
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
      console.warn("Image load failed for:", imgSrc);
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
