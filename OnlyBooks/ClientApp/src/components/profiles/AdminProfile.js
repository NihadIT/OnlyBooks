import React, { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logout, updateUser } from '../../redux/userReducer';
import { format } from 'date-fns';
import "./AdminProfile.css";
import { updateUserInAdmin, deleteUserInAdmin } from '../../utils/api';

function AdminProfile() {
    const user = useSelector(state => state.auth.user);
    const dispatch = useDispatch();
    const [isEditing, setIsEditing] = useState(false);
    const [image, setImage] = useState(user.imageUrl || '');
    const imageInputRef = useRef(null);
    const [orders, setOrders] = useState([]);
    const [showPaidOrders, setShowPaidOrders] = useState(false);
    const [selectedPeriod, setSelectedPeriod] = useState('день'); // Хранит выбранный период
    const [expenses, setExpenses] = useState(0);                  // Хранит сумму потраченных средств
    const [isModalVisible, setIsModalVisible] = useState(false);  // Видимость модального окна
    const [selectedUser, setSelectedUser] = useState(null);
    const [users, setUsers] = useState([]);
    localStorage.removeItem('currentPage');

    // Данные профиля
    const [editedData, setEditedData] = useState({
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
        address: user.address,
    });

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditedData({ ...editedData, [name]: value });
    };

    // Выход из аккаунта
    const handleLogout = () => {
        dispatch(logout());
    };

    // Нажатия на кнопку выбора периода
    const handlePeriodClick = (period) => {
        setSelectedPeriod(period);
    };

    const openModal = (user) => {
        setSelectedUser(user);
        setIsModalVisible(true);
    };

    const closeModal = () => {
        setSelectedUser(null);
        setIsModalVisible(false);
    };

    // Модальное окно с информацией пользователя
    function UserModal({ user, onClose }) {
        const [editedUserData, setEditedUserData] = useState(user);

        const handleChange = (e) => {
            const { name, value } = e.target;
            setEditedUserData({
                ...editedUserData,
                [name]: value,
            });
        };

        const handleSave = async () => {
            try {
                const success = await updateUserInAdmin(editedUserData);
                if (success) {
                    console.log(editedUserData);
                    onClose();
                } else {
                    console.error('Ошибка при обновлении пользователя на сервере');
                }
            } catch (error) {
                console.error('Ошибка при обновлении пользователя:', error);
            }
        };

        const handleDelete = async () => {
            if (window.confirm('Вы уверены, что хотите удалить этого пользователя?')) {
                try {
                    const success = await deleteUserInAdmin(editedUserData.email);
                    console.log(success);
                    if (success) {
                        onClose();
                    } else {
                        console.error('Ошибка при удалении пользователя');
                    }
                } catch (error) {
                    console.error('Ошибка при удалении пользователя:', error);
                }
            }
        };

        return (
            <div className="user-modal">
                <h2>Информация о пользователе</h2>
                <div className="name-group" >
                <label>
                    <input
                        type="text"
                        name="firstName"
                        value={editedUserData.firstName}
                        onChange={handleChange}
                        placeholder="Имя"
                    />
                </label>
                <label>
                    <input
                        type="text"
                        name="lastName"
                        value={editedUserData.lastName}
                        onChange={handleChange}
                        placeholder="Фамилия"
                    />
                    </label>
                </div>
                <label>
                    <input
                        type="text"
                        name="phone"
                        value={editedUserData.phone}
                        onChange={handleChange}
                        placeholder="Телефон"
                    />
                </label>
                <label>
                    <input
                        type="text"
                        name="address"
                        value={editedUserData.address}
                        onChange={handleChange}
                        placeholder="Адрес"
                    />
                </label>
                <button onClick={handleSave}>Сохранить</button>
                <button onClick={handleDelete}>Удалить</button>
                <button onClick={onClose}>Закрыть</button>
            </div>
        );
    }

    const calculateExpenses = () => {
        const currentDate = new Date();
        let startDate;

        if (selectedPeriod === 'день') {
            startDate = new Date(currentDate);
            startDate.setHours(0, 0, 0, 0); 
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
    };

    // Сумма заработанных средств
    useEffect(() => {
        calculateExpenses();
    }, [selectedPeriod, orders]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const ordersResponse = await fetch('/api/admin/orders');
                const ordersData = await ordersResponse.json();
                setOrders(ordersData);

                const usersResponse = await fetch('/api/admin/users');  
                const usersData = await usersResponse.json();
                setUsers(usersData);

            } catch (error) {
                console.error('Ошибка при получении данных:', error);
            }
            };

        fetchData();
    }, [isModalVisible]);

    // Меняем статус оплаты таблицы Order
    const handlePaymentStatusChange = async(orderId, status) => {
        try {
            const response = await fetch(`/api/admin/update-payment-status/${orderId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ paymentStatus: status }),
            });

            console.log(orderId);

            if (response.ok) {
                const updatedOrders = [...orders];
                const orderIndex = updatedOrders.findIndex(order => order.orderId === orderId);
                updatedOrders[orderIndex].paymentStatus = status;
                setOrders(updatedOrders);

            } else {
                console.error('Ошибка при обновлении статуса оплаты');
            }
        } catch (error) {
            console.error('Ошибка при обновлении статуса оплаты:', error);
        }
    };

    // Удаляем запись из таблицы Order
    const handleDeleteOrder = async (orderId) => {
        try {
            const response = await fetch(`/api/admin/delete-order/${orderId}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                const updatedOrders = [...orders];
                const orderIndex = updatedOrders.findIndex(order => order.orderId === orderId);
                updatedOrders.splice(orderIndex, 1);
                setOrders(updatedOrders);
            } else {
                console.error('Ошибка при удалении заказа');
            }
        } catch (error) {
            console.error('Ошибка при удалении заказа:', error);
        }
    };

    // Обновляем фото профиля
    const handleImageUpload = async (e) => {
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
                console.log('user.imageUrl = ' + user.imageUrl);
            } else {
                console.error('Ошибка при загрузке изображения на сервер');
            }
        } catch (error) {
            console.error('Ошибка при загрузке изображения:', error);
        }
    };

    const handleSave = async () => {
        // Отправляем изменения на сервер
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
            // Обработка ошибки обновления на сервере
            console.error('Ошибка при обновлении данных на сервере');
        }
    };


    return (
        <div className="admin-profile">
        <div className="admin-profile-container">
            <h2>Администратор</h2>
            {user && (
                <div className="admin-profile-info">
                    <div className="admin-profile-image">
                        <img
                            src={image || '/img/profiles/default.png'} 
                            alt="Профиль"
                            onClick={() => imageInputRef.current.click()} 
                        />
                        <input
                            ref={imageInputRef}
                            type="file"
                            accept="image/*"
                            style={{ display: 'none' }}
                            onChange={handleImageUpload}
                        />
                    </div>
                    <div className="admin-profile-name">
                        <p className="name">{user.firstName} {user.lastName}</p>
                    </div>
                    <div className="admin-profile-details">
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
                        <button className="admin-edit-button" onClick={handleEdit}>
                            Редактировать
                        </button>
                    ) : (
                        <div className="admin-edit-form">
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
                            <button className="admin-save-button" onClick={handleSave}>
                                Сохранить
                            </button>
                        </div>
                    )}
                </div>
            )}
            <button className="admin-logout-button" onClick={handleLogout}>
                <a className="admin-logout-link" href="/login">Выйти</a>
            </button>
        </div>
            <div className="admin-orders-container">
                <h3>Заказы</h3>
                <ul>
                    {orders
                        .filter(order => order.paymentStatus !== 'Оплачено')
                        .map((order, index) => (
                            <li key={order.orderId}>
                                <strong>Email:</strong> {order.email}<br />
                                <strong>Дата заказа:</strong> {format(new Date(order.orderDate), 'yyyy-MM-dd HH:mm')} <br />
                                <strong>Сумма заказа:</strong><span className="totalAmount"> {order.totalAmount}</span><br />
                                <strong>Статус оплаты:</strong> {order.paymentStatus}<br />
                                <strong>Адрес доставки:</strong> {order.shippingAddress}<br />
                                <button onClick={() => handlePaymentStatusChange(order.orderId, 'Оплачено')}>Оплачено</button>
                                <button onClick={() => handleDeleteOrder(order.orderId)}>Отмена</button>
                            </li>
                        ))}
                </ul>
                <button className="btn-paid-order" onClick={() => setShowPaidOrders(!showPaidOrders)}>
                    {showPaidOrders ? 'Скрыть оплаченные заказы' : 'Показать оплаченные заказы'}
                </button>
                {showPaidOrders && (
                <div className="unpaid-orders-section">
                    <h3>Оплаченные заказы</h3>
                    <ul>
                        {orders
                            .filter(order => order.paymentStatus === 'Оплачено')
                            .map((order, index) => (
                                <li key={order.orderId}>
                                    <strong>Email:</strong> {order.email}<br />
                                    <strong>Дата заказа:</strong> {format(new Date(order.orderDate), 'yyyy-MM-dd HH:mm')} <br />
                                    <strong>Сумма заказа:</strong><span className="totalAmount"> {order.totalAmount}</span><br />
                                    <strong>Статус оплаты:</strong> {order.paymentStatus}<br />
                                    <strong>Адрес доставки:</strong> {order.shippingAddress}<br />
                                    <button onClick={() => handlePaymentStatusChange(order.orderId, 'Оплачено')}>Оплачено</button>
                                    <button onClick={() => handleDeleteOrder(order.orderId)}>Удалить</button>
                                </li>
                            ))}
                    </ul>
                    </div>
                )}
            </div>
            <div>
            <div className="admin-users-container">
                <h3>Пользователи</h3>
                <table className="user-table">
                    <thead>
                        <tr>
                            <th>Клиент</th>
                            <th>Почта</th>
                            <th>Телефон</th>
                            <th>Адрес</th>
                        </tr>
                    </thead>
                    <tbody>
                            {users.map((user, index) => (
                                <tr key={index} onClick={() => openModal(user)}>
                                <td className="truncate">{user.firstName + ' ' + user.lastName}</td>
                                <td className="truncate">{user.email}</td>
                                <td className="truncate">{user.phone}</td>
                                <td className="truncate">{user.address}</td>
                            </tr>
                        ))}
                    </tbody>
                    </table>
                    {isModalVisible && (
                        <UserModal user={selectedUser} onClose={closeModal} />
                    )}
            </div>
            <div className="expenses-container">
                <h3>Заработано</h3>
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

export default AdminProfile;
