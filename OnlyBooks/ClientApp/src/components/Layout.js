import React, { useState, useEffect } from 'react';
import  NavMenu  from './NavMenu';
import Footer from './Footer';
import "../custom.css";

const Layout = (props) => {
    const [showPage, setShowPage] = useState(true); // true, так как должна загрузиться при первой загрузке

    useEffect(() => {
        const handlePopState = () => {
            setShowPage(false); // Скрываем страницу при изменении истории
        };

        window.addEventListener('popstate', handlePopState);

        return () => {
            window.removeEventListener('popstate', handlePopState);
        };
    }, []);

    useEffect(() => {
        if (!showPage) {
            setShowPage(true); // Показываем страницу после изменения истории
        }
    }, [showPage]);

    return (
        <div className={`page ${showPage ? 'show' : ''}`}>
            <NavMenu />
                {props.children}
             <Footer />
        </div>
    );
};

export default Layout;
