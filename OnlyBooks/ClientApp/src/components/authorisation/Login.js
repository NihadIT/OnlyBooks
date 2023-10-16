import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { setUser } from '../../redux/userReducer';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import "./Login.css";

function Login() {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [errorMessage, setErrorMessage] = useState(''); // Сообщения об ошибке
    const navigate = useNavigate();
    const dispatch = useDispatch();
    localStorage.removeItem('currentPage');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('api/user/login', formData);
            if (response.status === 200) {
                const user = response.data;

                // Добавляем логику определения роли и перенаправления
                if (user.role === 'Client') {
                    navigate('/profile');
                } else if (user.role === 'Admin') {
                    navigate('/admin/profile');
                } 

                dispatch(setUser(user));
            }
        } catch (error) {
            if (error.response && error.response.data && error.response.data.error) {
                setErrorMessage(error.response.data.error);
            } else {
                setErrorMessage(`Ошибка входа: ${error}`);
                console.error('Ошибка входа:', error);
            }
        }
    };

    return (
        <div className="login-container">
            <h2>Вход</h2>
            {errorMessage && <div className="error-message">{errorMessage}</div>}
            <form className="login-form" onSubmit={handleLogin}>
                <input
                    type="email"
                    className="login-input"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Почта"
                    required
                />
                <input
                    type="password"
                    className="login-input"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Пароль"
                    required
                />
                <button type="submit" className="login-button">Войти</button>
            </form>
            <p>Нет аккаунта? <a href="/register">Зарегистрироваться</a></p>
        </div>
    );
}

export default Login;
