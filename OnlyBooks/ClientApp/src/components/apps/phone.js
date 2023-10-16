import React from 'react';
import "./phone.css";

const CenteredImage = ({ imageUrl }) => {
    return (
        <div className="phone-app">
        <div className="phone">
            <img src={"/img/phone/phone.png"} alt="Centered Image" />
            </div>
            <div className="markets">
                <a href="#">
                    <img src={"/img/phone/markets.png"} alt="Centered Image" />
                </a>
            </div>
        </div>
    );
};

export default CenteredImage;
