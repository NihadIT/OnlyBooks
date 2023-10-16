import React, { useState, useEffect } from 'react';
import { Collapse, Navbar, NavbarBrand, NavbarToggler} from 'reactstrap';
import { Link } from 'react-router-dom';
import './NavMenu.css';
import MenuHeader from './MenuHeader';
import SearchBar from './SearchBar';
import { useSelector } from 'react-redux';

function NavMenu() {
    const [collapsed, setCollapsed] = useState(true);
    const cart = useSelector(state => state.cart.cart);

    const toggleNavbar = () => {
        setCollapsed(!collapsed);
    };

    const user = useSelector(state => state.auth.user);
    console.log(user);

    return (
        <header>
            <div className="wrapper">
                <Navbar className="navbar-expand-sm ng-white box-shadow mb-3">
                    <NavbarBrand tag={Link} to="/">
                        <img className="logo" src="/images/logo.png" alt="" />
                    </NavbarBrand>
                    <div className="tools-header">
                        <NavbarToggler onClick={toggleNavbar} className="mr-2" />
                        <SearchBar />
                        <div className="personal-tools">
                            <button className="btn-message">
                                <img src="/images/icons/icon-message-static.png" alt="" />
                                Сообщение
                            </button>
                            <button className="btn-office">
                                {user ? (   
                                    user.role === 'Admin' ? (
                                        <a href="/admin/profile">
                                            <img src="/images/icons/icon-office.png" alt="" />
                                            Мой профиль 
                                        </a>) : (
                                        <a href="/profile">
                                            <img src="/images/icons/icon-office.png" alt="" />
                                            Мой профиль 
                                        </a>)
                                ) : (<a href="/login">
                                        <img src="/images/icons/icon-office.png" alt="" />
                                    Вход
                                </a>)}
                            </button>
                            <button className="btn-favorite">
                                <a href="/favorite">
                                    <img src="/images/icons/icon-favorite.png" alt="" />
                                    Избранное
                                </a>
                            </button>
                            <button className="btn-cart" >
                                <a href="/cart">
                                <img src="/images/icons/icon-cart.png" />
                                    Корзина {(cart.length > 0 && <span className="cart-count">{cart.length}</span>)}
                                </a>
                            </button>
                        </div>
                        <MenuHeader />
                    </div>
                </Navbar>
            </div>
        </header>
    );
}

export default NavMenu;
