import React, { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logout, updateUser } from '../../redux/userReducer';
import { format } from 'date-fns';
import './ClientProfile.css';

function ClientProfile() {
    const user = useSelector(state => state.auth.user);
    const dispatch = useDispatch();
    const [isEditing, setIsEditing] = useState(false);
    const [editedData, setEditedData] = useState({
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
        address: user.address,
    });
    const [image, setImage] = useState(user.imageUrl || '');
    const imageInputRef = useRef(null);
    const [orders, setOrders] = useState([]);
    const [clientLevel, setClientLevel] = useState(1);
    const [selectedPeriod, setSelectedPeriod] = useState('день'); // Хранит выбранный период
    const [expenses, setExpenses] = useState(0); // Хранит сумму потраченных средств
    localStorage.removeItem('currentPage');

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleChange = e => {
        const { name, value } = e.target;
        setEditedData({ ...editedData, [name]: value });
    };

    // Нажатия на кнопку выбора периода
    const handlePeriodClick = (period) => {
        setSelectedPeriod(period);
    };

    const calculateExpenses = () => {
        const currentDate = new Date();
        let startDate;

        if (selectedPeriod === 'день') {
            startDate = new Date(currentDate);
            startDate.setHours(0, 0, 0, 0); // Обнуляем время
        } else if (selectedPeriod === 'неделя') {
            startDate = new Date(currentDate);
            startDate.setDate(currentDate.getDate() - 7);
            startDate.setHours(0, 0, 0, 0); 
        } else if (selectedPeriod === 'месяц') {
            startDate = new Date(currentDate);
            startDate.setMonth(currentDate.getMonth() - 1);
            startDate.setHours(0, 0, 0, 0); 
        }

        // Фильтруем заказы, учитывая выбранный период
        const filteredOrders = orders.filter((order) => {
            const orderDate = new Date(order.orderDate);
            return orderDate >= startDate && orderDate <= currentDate && order.paymentStatus === 'Оплачено';
        });

        // Рассчитываем сумму потраченных средств
        const totalExpenses = filteredOrders.reduce((total, order) => total + order.totalAmount, 0);
        setExpenses(totalExpenses);

        console.log(startDate);
    };

    // Сумма потраченных средств
    useEffect(() => {
        calculateExpenses();
    }, [selectedPeriod, orders]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Берем заказы данного пользователя
                console.log('user.id:', user.id);
                const ordersResponse = await fetch(`/api/user/GetOrdersByUserId?id=${user.id}`);
                const ordersData = await ordersResponse.json();
                setOrders(ordersData);
                console.log(ordersData);

                // Рассчитываем уровень клиента по количеству заказов
                const numberOfOrders = ordersData.filter(order => order.paymentStatus === "Оплачено").length;
                const newClientLevel = Math.ceil(numberOfOrders / 5);

                setClientLevel(newClientLevel);

            } catch (error) {
                console.error('Ошибка при получении данных:', error);
            }
        };

        fetchData();
    }, []);

    // Обновление картинки
    const handleImageUpload = async e => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('image', file);

        try {
            const response = await fetch(`/api/user/upload-image?userEmail=${user.email}`, {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                const imageUrlUpdate = await response.text();
                setImage(imageUrlUpdate);
                dispatch(updateUser({ imageUrl: imageUrlUpdate }));
            } else {
                console.error('Ошибка при загрузке изображения на сервер');
            }
        } catch (error) {
            console.error('Ошибка при загрузке изображения:', error);
        }
    };

    // Редактирование данных
    const handleSave = async () => {
        const response = await fetch('/api/user/update', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: user.email,
                firstName: editedData.firstName,
                lastName: editedData.lastName,
                phone: editedData.phone,
                address: editedData.address,
            }),
        });

        if (response.ok) {
            dispatch(updateUser(editedData));
            setIsEditing(false);
        } else {
            console.error('Ошибка при обновлении данных на сервере');
        }
    };

    const handleLogout = () => {
        dispatch(logout());
    };

    return (
        <div className="client-profile">
        <div className="profile-container">
                <h2>Клиент</h2>
                <span>{`${clientLevel} уровень`}</span>
            {user && (
                <div className="profile-info">
                    <div className="profile-image">
                        <img src={image || '/img/profiles/default.png'} alt="Профиль" onClick={() => imageInputRef.current.click()} />
                        <input
                            ref={imageInputRef}
                            type="file"
                            accept="image/*"
                            style={{ display: 'none' }}
                            onChange={handleImageUpload}
                        />
                    </div>
                    <div className="profile-name">
                        <p className="name">{user.firstName} {user.lastName}</p>
                    </div>
                    <div className="profile-details">
                            <div className="info-row">
                                <p className="info-label">Почта:</p>
                                <p className="info-value">{user.email}</p>
                            </div>

                            <div className="info-row">
                                <p className="info-label">Телефон:</p>
                                <p className="info-value">{user.phone}</p>
                            </div>

                            <div className="info-row">
                                <p className="info-label">Адрес:</p>
                                <p className="info-value">{user.address}</p>
                            </div>
                    </div>
                    {!isEditing ? (
                        <button className="edit-button" onClick={handleEdit}>
                            Редактировать
                        </button>
                    ) : (
                        <div className="edit-form">
                            <input
                                type="text"
                                name="firstName"
                                value={editedData.firstName}
                                onChange={handleChange}
                                placeholder="Имя"
                                required
                            />
                            <input
                                type="text"
                                name="lastName"
                                value={editedData.lastName}
                                onChange={handleChange}
                                placeholder="Фамилия"
                                required
                            />
                            <input
                                type="text"
                                name="phone"
                                value={editedData.phone}
                                onChange={handleChange}
                                placeholder="Телефон"
                                required
                            />
                            <input
                                type="text"
                                name="address"
                                value={editedData.address}
                                onChange={handleChange}
                                placeholder="Адрес"
                                required
                            />
                            <button className="save-button" onClick={handleSave}>
                                Сохранить
                            </button>
                        </div>
                    )}
                </div>
            )}
            <button className="logout-button" onClick={handleLogout}>
                <a className="logout-link" href="/login">Выйти</a>
            </button>
            </div>
            <div className="profile-orders-container">
                <h3>История заказов</h3>
                {orders.length === 0 ? (
                    <p>Заказов нет</p>
                ) : (
                    <table>
                        <thead>
                            <tr>
                                <th>Дата заказа</th>
                                <th>Общая цена</th>
                                <th>Адрес доставки</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map((order) => (
                                order.paymentStatus === "Оплачено" && (
                                    <tr key={order.id}>
                                        <td className="order-date"> {format(new Date(order.orderDate), 'yyyy-MM-dd HH:mm')}</td> 
                                        <td className="totalAmount">{order.totalAmount}</td>
                                        <td>{order.shippingAddress}</td>
                                    </tr>
                                )
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
            <div>
            <div className="client-level">
                    <p>Уровень клиента: {clientLevel}</p>
                <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${(clientLevel / 5) * 100}%` }}>
                        </div>
                    </div>
                  <span>Заказов до следующего уровня: {` ${5 - clientLevel} `}</span>
                   
            </div>
            <div className="expenses-container">
                <h3>Покупок на</h3>
                <div className="period-selection">
                        <button onClick={() => handlePeriodClick('день')}>За день</button>
                        <button onClick={() => handlePeriodClick('неделя')}>За неделю</button>
                        <button onClick={() => handlePeriodClick('месяц')}>За месяц</button>
                </div>
                    <p>{expenses.toLocaleString('ru-RU')} рублей</p>
                </div>
            </div>
        </div>
    );
}

export default ClientProfile;
