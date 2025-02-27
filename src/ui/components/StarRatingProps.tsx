import  { useState } from 'react';

interface StarRatingProps {
  /** The current rating value */
  rating: number;
  /** Callback to update the rating */
  onRatingChange: (rating: number) => void;
  /** Maximum number of stars (default is 5) */
  maxStars?: number;
}

export default function StarRating(  
   { rating,
    onRatingChange,
    maxStars = 5} : StarRatingProps){

  // For hover effect: if a star is hovered, that value is temporarily shown.
  const [hoverRating, setHoverRating] = useState<number | null>(null);

  return (
    <div style={{ display: 'flex', flexDirection: 'row' }}>
      {Array.from({ length: maxStars }, (_, i) => {
        const starValue = i + 1;
        const isFilled = hoverRating !== null ? starValue <= hoverRating : starValue <= rating;
        return (
          <span
            key={i}
            style={{
              fontSize: '2rem',
              color: isFilled ? '#ffc107' : '#e4e5e9',
              cursor: 'pointer',
              transition: 'color 200ms',
              marginRight: '5px'
            }}
            onMouseEnter={() => setHoverRating(starValue)}
            onMouseLeave={() => setHoverRating(null)}
            onClick={() => onRatingChange(starValue)}
          >
            {isFilled ? '★' : '☆'}
          </span>
        );
      })}
    </div>
  );
};

