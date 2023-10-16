import React, { useState, useEffect } from 'react';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { PhoneNumberUtil, PhoneNumberFormat, CountryCodeSource } from 'google-libphonenumber';
import { useSelector, useDispatch } from 'react-redux';
import { clearCart} from '../../redux/cartReducer'; 

function PaymentForm({ closePaymentModal }) {
    const [phoneNumber, setPhoneNumber] = useState('');
    const [selectedCountry, setSelectedCountry] = useState(''); // Выбранная страна
    const [error, setError] = useState('');
    const [isPaymentCompleted, setIsPaymentCompleted] = useState(false);
    const phoneNumberUtil = PhoneNumberUtil.getInstance();
    const { DateTime } = require('luxon');

    const user = useSelector(state => state.auth.user);
    const totalPrice = useSelector(state => state.cart.totalPrice);
    const dispatch = useDispatch();

    useEffect(() => {
        if (user !== null) { setPhoneNumber(user.phone); }
    }, []);

 
    const handlePayment = async () => {
        if (!phoneNumber) {
            setError('Пожалуйста, введите номер телефона.');
            return;
        }

        if (user !== null) {
            const currentDateTime = new Date();
            const formattedDateTime = currentDateTime.toISOString(); 

            // Добавить в таблицу Orders
            const response = await fetch('/api/books/postOrder', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId: user.id,
                    orderDate: formattedDateTime,
                    totalAmount: totalPrice,
                    paymentStatus: "Ожидает оплаты",
                    shippingAddress: user.address
                }),
            });

            console.log(user.id);
            console.log(formattedDateTime);
            console.log(totalPrice);

            if (response.ok) {
                console.log('Заказ добавлен в базу! ' + response);
            } else {
                const responseText = await response.text();
                console.error(`Ошибка при обновлении данных на сервере: ${responseText}`);
            }
        }

        try {
            let phoneNumberWithCountryCode = phoneNumber;
            if (!phoneNumber.startsWith('+')) {
                phoneNumberWithCountryCode = `+${phoneNumber}`;
            }

            const parsedPhoneNumber = phoneNumberUtil.parse(phoneNumberWithCountryCode);
            if (!phoneNumberUtil.isValidNumber(parsedPhoneNumber)) {
                setError('Номер телефона недействителен.');
                return;
            }

            const formattedPhoneNumber = phoneNumberUtil.format(parsedPhoneNumber, PhoneNumberFormat.E164);
            console.log('Номер телефона:', formattedPhoneNumber);

            // Успешно выполнена оплата
            setIsPaymentCompleted(true);
         
            setTimeout(() => {
                setIsPaymentCompleted(false); 
                dispatch(clearCart());
                closePaymentModal();
            }, 5000); 

            // Если прошел все проверки, очищаем ошибку
            setError('');
        } catch (error) {
            console.log('Заказ добавлен в базу! ' + user.Id, + " " + totalPrice + " " + user.address + " " + user);
            setError('Произошла ошибка при валидации номера телефона.');
            return;
        }
    };

    const handleCountryChange = (value, countryData) => {
        setSelectedCountry(countryData.iso2); // Сохраняем выбранную страну
    };
    return (
        <div>
            <h2>Оплата</h2>
            {isPaymentCompleted ? (
                <div>
                    <p>Запрос отправлен. Ожидайте звонка оператора.</p>
                </div>
            ) : (
                <div className="number-form">
                    <PhoneInput
                        defaultCountry="RU"
                        placeholder="Введите номер телефона"
                        value={phoneNumber}
                        onChange={(value) => setPhoneNumber(value)}
                    />
                    {error && <p className="error">{error}</p>}
                    <button onClick={handlePayment}>Оплатить</button>
                </div>
            )}
        </div>
    );
}

export default PaymentForm;
