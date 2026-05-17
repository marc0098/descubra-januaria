import React, { useState } from 'react';
import { ImgHTMLAttributes } from 'react';

type SafeImageProps = ImgHTMLAttributes<HTMLImageElement> & {
  fallbackSrc?: string;
};

export default function SafeImage({ 
  src, 
  alt, 
  fallbackSrc,
  className,
  ...props 
}: SafeImageProps) {
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const handleError = () => {
    setHasError(true);
  };

  const handleLoad = () => {
    setIsLoaded(true);
  };

  if (hasError && !fallbackSrc) {
    return (
      <div 
        className={`bg-surface-container flex items-center justify-center ${className || ''}`}
        {...props}
      >
        <span className="text-on-surface-variant/30 text-xs">Sem imagem</span>
      </div>
    );
  }

  return (
    <img
      src={hasError ? fallbackSrc : src}
      alt={alt}
      onError={handleError}
      onLoad={handleLoad}
      className={`${className || ''} ${!isLoaded && !hasError ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
      {...props}
    />
  );
}