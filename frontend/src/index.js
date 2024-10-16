import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import LayoutComponent from './pages/layout';
import HomeComponent from './pages/home';
import ProductComponent from './pages/product';
import OrderComponent from './pages/order';
import CartComponent from './pages/cart';
import LoginComponent from './pages/login';
import RegisterComponent from './pages/register';
import AdminHomePageComponent from './adminPages/adminHomePage';
import ProductEditComponent from './adminPages/productEdit';




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

                    <Route path='login' element={<LoginComponent />}></Route>
                    <Route path='register' element={<RegisterComponent />}></Route>


                    <Route path='/admin' element={<LayoutComponent />}>
                        <Route index element={<AdminHomePageComponent />}></Route>
                        <Route path='edit-products' element={<ProductEditComponent />}></Route>
                    </Route>

                </Routes>


            </BrowserRouter>
        </>
    );
}


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <AppComponent />
);



