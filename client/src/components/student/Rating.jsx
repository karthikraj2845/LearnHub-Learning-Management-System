import React, { useEffect, useState } from 'react';

const Rating = ({ initialRating, onRate }) => {
  // 1. Local state for the rating value
  const [rating, setRating] = useState(initialRating || 0); // [1]

  // 2. Handler to visually update the stars and pass the value to the parent
  const handleRating = (value) => {
    setRating(value); // [1]
    if (onRate) {
      onRate(value); // [2]
    }
  };

  // 3. Effect to update the rating if the initialRating prop changes
  useEffect(() => {
    if (initialRating) {
      setRating(initialRating); // [2]
    }
  }, [initialRating]); // [2]

  return (
    <div>
      {/* 4. Create an array of 5 items to map the star icons */}
      {Array.from({ length: 5 }, (_, index) => { // [3]
        const starValue = index + 1; // [4]

        return (
          <span
            key={index} // [4]
            onClick={() => handleRating(starValue)} // [5]
            className={`text-xl sm:text-2xl cursor-pointer transition-colors ${starValue <= rating ? 'text-yellow-500' : 'text-gray-400'
              }`} // [1, 4]
          >
            {/* HTML entity for a star icon */}
            &#9733;
          </span>
        );
      })}
    </div>
  );
};
export default Rating;