import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart, increaseQuantity } from '../../redux/cartReducer';

function AddToCartButton({ book }) {
    const dispatch = useDispatch();
    const cart = useSelector((state) => state.cart.cart);

    const addToCartHandler = () => {
        let discountPercentage = (book.discounts && book.discounts.length > 0)
            ? book.discounts[0].discountPercentage
            : 0;


        const newItem = {
            id: book.bookId,
            image: book.coverImage,
            title: book.title,
            price: book.price,
            discountPrice: Math.floor(book.price * (1 - discountPercentage / 100)),
        };

        console.log(discountPercentage);

        // Проверка дублирования
        const existingItem = cart.find((item) => item.id === newItem.id);
        if (existingItem) {
            // Если товар уже есть, увеличиваем его количество на 1
            dispatch(increaseQuantity(existingItem.id));
        } else {
            // Если товара нет в корзине, добавляем его
            dispatch(addToCart(newItem));
        }
    };

    return (
        <button className="basket-button" onClick={addToCartHandler}>
            В корзину
        </button>
    );
}

export default AddToCartButton;
