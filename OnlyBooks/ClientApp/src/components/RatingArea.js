import React, { useState } from 'react';

const RatingArea = () => {
    const [rating, setRating] = useState(null);

    const handleRatingChange = (selectedRating) => {
        setRating(selectedRating);
    };

    return (
        <div className="rating-area">
            {[10, 9, 8, 7, 6, 5, 4, 3, 2, 1].map((value) => (
                <React.Fragment key={value}>
                    <input
                        type="radio"
                        id={`star-${value}`}
                        name="rating"
                        value={value}
                        onChange={() => handleRatingChange(value)}
                        checked={rating === value} 
                    />
                    <label htmlFor={`star-${value}`} title={`Оценка «${value}»`} />
                </React.Fragment>
            ))}
        </div>
    );
};

export default RatingArea;
