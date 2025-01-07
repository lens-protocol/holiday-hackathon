import React from 'react';
import { Star } from 'lucide-react';

export const StarRating = ({ 
  rating = 0, 
  maxStars = 5, 
  size = 'medium',
  interactive = false,
  onRatingChange = () => {}
}) => {
  const getSizeClass = () => {
    switch(size) {
      case 'small':
        return 'w-3 h-3';
      case 'large':
        return 'w-6 h-6';
      default:
        return 'w-4 h-4';
    }
  };

  return (
    <div className="flex items-center gap-1">
      {[...Array(maxStars)].map((_, index) => (
        <button
          key={index}
          type="button"
          onClick={() => interactive && onRatingChange(index + 1)}
          className={`
            ${interactive ? 'cursor-pointer hover:scale-110' : 'cursor-default'}
            transition-transform duration-200
          `}
        >
          <Star
            className={`
              ${getSizeClass()}
              ${index < rating 
                ? 'fill-yellow-500 text-yellow-500' 
                : 'fill-transparent text-gray-500'}
              transition-colors duration-200
              ${interactive && 'hover:text-yellow-400'}
            `}
          />
        </button>
      ))}
    </div>
  );
};