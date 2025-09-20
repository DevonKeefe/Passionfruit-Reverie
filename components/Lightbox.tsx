
import React from 'react';
import { Photo } from '../types';
import { XIcon, ChevronLeftIcon, ChevronRightIcon } from './Icons';

interface LightboxProps {
  photo: Photo;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}

const Lightbox: React.FC<LightboxProps> = ({ photo, onClose, onPrev, onNext }) => {
  if (!photo) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center" 
      onClick={onClose}
    >
      <div className="relative w-full h-full p-4 flex items-center justify-center">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors z-50 p-2 rounded-full bg-black/20 hover:bg-black/40"
          aria-label="Close"
        >
          <XIcon className="h-8 w-8" />
        </button>

        {/* Previous Button */}
        <button
          onClick={(e) => { e.stopPropagation(); onPrev(); }}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white transition-colors z-50 p-2 rounded-full bg-black/20 hover:bg-black/40"
          aria-label="Previous image"
        >
          <ChevronLeftIcon className="h-10 w-10" />
        </button>

        {/* Next Button */}
        <button
          onClick={(e) => { e.stopPropagation(); onNext(); }}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white transition-colors z-50 p-2 rounded-full bg-black/20 hover:bg-black/40"
          aria-label="Next image"
        >
          <ChevronRightIcon className="h-10 w-10" />
        </button>

        {/* Image and Caption */}
        <div 
          className="relative max-w-[90vw] max-h-[90vh] flex flex-col items-center"
          onClick={(e) => e.stopPropagation()}
        >
          <img
            src={photo.src}
            alt={photo.title}
            className="max-w-full max-h-[80vh] object-contain shadow-2xl rounded-lg"
          />
          {photo.caption && (
            <div className="mt-4 text-center text-white/90 p-2 rounded-md bg-black/20">
              <h3 className="font-bold text-lg">{photo.title}</h3>
              <p className="text-sm">{photo.caption}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Lightbox;
