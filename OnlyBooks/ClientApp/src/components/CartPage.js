import { React, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { clearCart, clearCartItem, updateTotalPrice } from '../redux/cartReducer'; 
import './CartPage.css';
import PaymentForm from './modal/PaymentForm';


const CartPage = () => {
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

    const openPaymentModal = () => {
        setIsPaymentModalOpen(true);
    };

    const closePaymentModal = () => {
        setIsPaymentModalOpen(false);
    };

    const cartItems = useSelector(state => state.cart.cart);
    const dispatch = useDispatch();

    // Очистка корзины
    const handleClearCart = () => {
        dispatch(clearCart());
    };
     // Удачение книги из корзины
    const handleRemoveFromCart = (id) => {
        dispatch(clearCartItem(id));
    };

    // Общая цена товаров 
    const totalPrice = cartItems.reduce((total, item) => {
        const itemPrice = item.discountPrice > 0 ? item.discountPrice : item.price;
        const itemTotalPrice = itemPrice * item.quantity; // Учитываем количество
        return total + itemTotalPrice;
    }, 0);

    dispatch(updateTotalPrice(totalPrice));

    return (
        <div className="cart-page">
            {cartItems.length > 0 ? (
                <div className="cart-container">
                <h2>Корзина</h2>
                <div className="cart books-list">
                        {cartItems.map(item => (
                            <div className="cart book" key={item.id}>
                                <button className="btn-del" onClick={() => handleRemoveFromCart(item.id)}><img alt="delete" src="/images/icons/icon-del.png" /></button>
                                <a href={`/book/${item.id}`} >
                                    <img src={item.image} alt={item.title} />
                                    <h3>{item.title}</h3>
                                    <span className="price">{(item.discountPrice > 0 ? item.discountPrice : item.price)}</span>
                                    <div className="quantity">{(item.quantity > 1 ? `Количество: ${item.quantity}` : '')}</div>
                                </a>
                            </div>
                        ))}
                    </div>
                    <div className="total-price">Общая цена: {totalPrice}</div>
                    <div className="btn">
                        <button onClick={openPaymentModal}>Оплатить</button>
                        {isPaymentModalOpen && (
                            <div className="modal" style={{ display: 'block' }}>
                                <div className="modal-content">
                                    <span className="close" onClick={closePaymentModal}>&times;</span>
                                    <PaymentForm closePaymentModal={closePaymentModal} />
                                </div>
                            </div>

                        )}
                        <button onClick={handleClearCart}>Очистить корзину</button>
                    </div>
                </div>
            ) : (
                <h2 className="cart-empty-title">Ваша корзина пуста</h2>
            )}
            
        </div>
    );
};

export default CartPage;
