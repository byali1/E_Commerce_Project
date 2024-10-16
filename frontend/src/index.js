import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import LayoutComponent from './pages/layout';
import HomeComponent from './pages/home';
import ProductComponent from './pages/product';
import OrderComponent from './pages/order';
import CartComponent from './pages/cart';
import LoginComponent from './pages/login';
import RegisterComponent from './pages/register';




function AppComponent() {
    return (
        <>

            <BrowserRouter>
                <Routes>
                    <Route path='/' element={<LayoutComponent />}>
                        <Route index element={<HomeComponent />}></Route>
                        <Route path='products' element={<ProductComponent />}></Route>
                        <Route path='orders' element={<OrderComponent />}></Route>
                        <Route path='cart' element={<CartComponent />}></Route>
                    </Route>

                    <Route path='login' element={<LoginComponent/>}></Route>
                    <Route path='register' element={<RegisterComponent/>}></Route>
                </Routes>

               
            </BrowserRouter>
        </>
    );
}


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <AppComponent />
);



