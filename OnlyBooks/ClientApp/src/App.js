import React, { useState, useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import AppRoutes from './AppRoutes';
import  Layout  from './components/Layout';
import './custom.css';
import { Provider } from 'react-redux';
import store from './redux/store';

export default function App() {

    return (
        <Provider store={store}>
            <Layout>
                <Routes>
                    {AppRoutes.map((route, index) => {
                        const { element, ...rest } = route;
                        return <Route key={index} {...rest} element={element} />;
                    })}
                </Routes>
            </Layout>
        </Provider>
    );
}

