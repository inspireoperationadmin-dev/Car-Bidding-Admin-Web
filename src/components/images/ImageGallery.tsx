import React, { useState, useEffect, useCallback } from 'react';
import { X, ChevronLeft, ChevronRight, ImageOff } from 'lucide-react';
import { Button } from '../ui/button';

interface ImageGalleryProps {
  images: string[];
  onImageClick?: (index: number) => void;
}

export const ImageGallery: React.FC<ImageGalleryProps> = ({ images, onImageClick }) => {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const handleThumbnailClick = (index: number) => {
    setSelectedIndex(index);
    setLightboxOpen(true);
    onImageClick?.(index);
  };

  const handlePrev = useCallback(() => {
    setSelectedIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
  }, [images.length]);

  const handleNext = useCallback(() => {
    setSelectedIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
  }, [images.length]);

  // Handle ESC and arrow keys
  useEffect(() => {
    if (!lightboxOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightboxOpen(false);
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxOpen, handlePrev, handleNext]);

  if (!images || images.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-muted/40 rounded-xl border border-dashed text-center">
        <ImageOff className="w-10 h-10 text-muted-foreground/60 mb-2" />
        <p className="text-sm text-muted-foreground font-medium">No inspection photos available</p>
      </div>
    );
  }

  return (
    <>
      {/* Thumbnails Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {images.map((url, index) => (
          <div
            key={index}
            onClick={() => handleThumbnailClick(index)}
            className="group relative h-28 sm:h-32 rounded-lg overflow-hidden border bg-muted/30 cursor-pointer transition-all duration-200 hover:ring-2 hover:ring-primary/60 hover:shadow-md"
          >
            <img
              src={url}
              alt={`Vehicle inspection ${index + 1}`}
              loading="lazy"
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  'https://placehold.co/400x300?text=Inspection+Image';
              }}
            />
            <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-medium">
              View #{index + 1}
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {lightboxOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm animate-in fade-in-0 duration-200">
          {/* Header Bar */}
          <div className="absolute top-0 inset-x-0 p-4 flex items-center justify-between z-10">
            <span className="px-3 py-1 rounded-full bg-white/10 text-white text-xs font-semibold backdrop-blur-md">
              {selectedIndex + 1} of {images.length}
            </span>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setLightboxOpen(false)}
              className="text-white hover:bg-white/20 rounded-full h-10 w-10"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Navigation Controls */}
          {images.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handlePrev();
                }}
                aria-label="Previous image"
                className="absolute left-4 z-10 p-2 sm:p-3 rounded-full bg-white/10 hover:bg-white/25 text-white backdrop-blur-md transition-transform active:scale-95"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleNext();
                }}
                aria-label="Next image"
                className="absolute right-4 z-10 p-2 sm:p-3 rounded-full bg-white/10 hover:bg-white/25 text-white backdrop-blur-md transition-transform active:scale-95"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}

          {/* Main Image Display */}
          <div
            className="relative max-w-5xl max-h-[85vh] p-4 flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={images[selectedIndex]}
              alt={`Full view ${selectedIndex + 1}`}
              className="max-h-[80vh] max-w-full rounded-lg object-contain shadow-2xl"
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  'https://placehold.co/800x600?text=Inspection+Image';
              }}
            />
          </div>
        </div>
      )}
    </>
  );
};