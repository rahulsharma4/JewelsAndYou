import React from 'react';
import { ImageWithFallback, getImageUrl } from '../utils/imageUtils';

const ImageTest = () => {
  const testImages = [
    'Jevel1.jpg',           // Asset image
    '1759162167137.png',    // Uploaded image
    '1758881670530.svg',    // Uploaded SVG
    '1758816399073.png',    // Uploaded image
    'nonexistent.jpg'       // Non-existent image
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Image Test Page</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {testImages.map((imagePath, index) => {
          const imageUrl = getImageUrl(imagePath);
          return (
            <div key={index} className="bg-brand-tealDark rounded-lg p-4 border border-brand-gold/20">
              <h3 className="text-lg font-semibold mb-2">{imagePath}</h3>
              <p className="text-sm text-brand-off/70 mb-3">URL: {imageUrl}</p>
              
              <div className="aspect-square bg-gray-200 rounded-lg overflow-hidden">
                <ImageWithFallback
                  src={imagePath}
                  alt={`Test image ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="mt-3">
                <a 
                  href={imageUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-brand-gold hover:underline text-sm"
                >
                  Open in new tab
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ImageTest;
