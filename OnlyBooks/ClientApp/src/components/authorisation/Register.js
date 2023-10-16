import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import "./Register.css";

function Register() {
    const [errorMessage, setErrorMessage] = useState(''); // Сообщения об ошибке
    const [registrationSuccess, setRegistrationSuccess] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        phone: '',
        address: '',
        firstName: '',
        lastName: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleRegister = async (e) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            setErrorMessage('Пароли не совпадают');
            return;
        }

        try {
            const response = await axios.post('api/user/register', formData);
            setRegistrationSuccess(true);
            setErrorMessage('');
        } catch (error) {
            setErrorMessage('Ошибка регистрации: ' +  error);
        }
    };

    return (
        <div className="registration-container">
            {errorMessage && <div className="error-message">{errorMessage}</div>}
            {registrationSuccess ? (
                <div>
                    <p>Пользователь успешно создан, теперь можно войти.</p>
                    <p><a href="/login">Войти</a></p>
                </div>
            ) : (
                <div>
                    <h2>Регистрация</h2>
                    <form className="registration-form" onSubmit={handleRegister}>
                        <input
                            type="text"
                            className="registration-input"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleChange}
                            placeholder="Имя"
                            required
                        />
                        <input
                            type="text"
                            className="registration-input"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleChange}
                            placeholder="Фамилия"
                            required
                        />
                        <input
                            type="email"
                            className="registration-input"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Почтовый ящик"
                            required
                        />
                        <input
                            type="text"
                            className="registration-input"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder="Номер телефона"
                            required
                        />
                        <input
                            type="text"
                            className="registration-input"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            placeholder="Адрес"
                            required
                        />
                        <input
                            type="password"
                            className="registration-input"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Пароль"
                            required
                        />
                        <input
                            type="password"
                            className="registration-input"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            placeholder="Повторить пароль"
                            required
                        />
                        <button type="submit" className="registration-button">Зарегистрироваться</button>
                        </form>
                        <p>Есть аккаунт? <a href="/login">Войти</a></p>
                </div>
            )}
        </div>

    );
}

export default Register;
