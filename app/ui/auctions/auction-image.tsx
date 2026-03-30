'use client';

import { useState } from 'react';

const PLACEHOLDER_IMAGE = '/car-placeholder.svg';

type AuctionImageProps = {
  imageUrl: string | null;
  alt: string;
  className?: string;
};

export default function AuctionImage({
  imageUrl,
  alt,
  className,
}: AuctionImageProps) {
  const [hasError, setHasError] = useState(false);
  const src = hasError || !imageUrl ? PLACEHOLDER_IMAGE : imageUrl;

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={() => {
        if (!hasError) {
          setHasError(true);
        }
      }}
    />
  );
}