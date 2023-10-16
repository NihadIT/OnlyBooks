import { React, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { clearFavorite, clearFavoriteItem } from '../redux/favoriteReducer';
import './CartPage.css';


const FavoritePage = () => {
    const favoriteItems = useSelector(state => state.favorite.favorite);
    const dispatch = useDispatch();

    // Очистка
    const handleClearCart = () => {
        dispatch(clearFavorite());
    };
    // Удачение книги из избранного
    const handleRemoveFromFavorite = (id) => {
        dispatch(clearFavoriteItem(id));
    };

    return (
        <div className="cart-page">
            {favoriteItems.length > 0 ? (
                <div className="cart-container">
                    <h2>Избранное</h2>
                    <div className="cart books-list">
                        {favoriteItems.map(item => (
                            <div className="cart book" key={item.id}>
                                <button className="btn-del" onClick={() => handleRemoveFromFavorite(item.id)}><img alt="delete" src="/images/icons/icon-del.png" /></button>
                                <a href={`/book/${item.id}`} >
                                <img src={item.image} alt={item.title} />
                                <h3>{item.title}</h3>
                                <span className="price">{(item.discountPrice > 0 ? item.discountPrice : item.price)}</span>
                                </a>
                            </div>
                        ))}
                    </div>
                    <div className="btn">
                        <button onClick={handleClearCart}>Очистить избранное</button>
                    </div>
                </div>
            ) : (
                <h2 className="cart-empty-title">Нет книг в избранном</h2>
            )}
        </div>
    );
};

export default FavoritePage;
