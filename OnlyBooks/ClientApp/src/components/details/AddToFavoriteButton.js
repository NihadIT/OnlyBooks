import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addToFavorite } from '../../redux/favoriteReducer';

function AddToFavoriteButton({ book }) {
    const dispatch = useDispatch();
    const favorite = useSelector((state) => state.favorite.favorite);
    const [showFavoriteNotification, setShowFavoriteNotification] = useState(false);

    const addToFavoriteHandler = () => {
        let discountPercentage = (book.discounts && book.discounts.length > 0)
            ? book.discounts[0].discountPercentage
            : 0;


        if (discountPercentage === 0 && book.discount > 0) {
            discountPercentage = book.discount;
        }

        const newItem = {
            id: book.bookId,
            image: book.coverImage,
            title: book.title,
            price: book.price,
            discountPrice: Math.floor(book.price * (1 - discountPercentage / 100)),
        };

        // Проверка дублирования
        const existingItem = favorite.find((item) => item.id === newItem.id);
        if (existingItem) {
            return;
        } else {
            dispatch(addToFavorite(newItem));
            setShowFavoriteNotification(true);
            setTimeout(() => setShowFavoriteNotification(false), 2000);
        }
    };

    return (
        <>
            <button className="postpone-button" onClick={addToFavoriteHandler}>
                <img src="/images/icons/icon-like.png" alt="отложить" />
            </button>
            {showFavoriteNotification && (
                <div className="favorite-notification">
                    Книга добавлена в избранное!
                </div>
            )}
        </>
    );
}

export default AddToFavoriteButton;
