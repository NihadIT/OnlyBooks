import React from 'react';
import './Loader.css'; // Подключите стили для прелоадера

const Loader = () => {
    return (
        <div className="loader-container">
            <div className="loader"><img src="/images/logo_2.png"/></div>
        </div>
    );
};

export default Loader;