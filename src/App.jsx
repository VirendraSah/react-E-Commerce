import React from 'react'
import { AuthLayout } from './AuthLayout';
import Login from './Pages/Authpages/Login'
import Signup from './Pages/Authpages/Signup';
import ForgotPassword from './Pages/Authpages/ForgotPassword';
import OneTimePassword from './Pages/Authpages/OneTimePassword';
import ChangePassword from './Pages/Authpages/Changepassword';
import { Routes, Route } from "react-router";
import Home from './Pages/Home';
import Cart from './Pages/Cart';
import Checkout from './Pages/Checkout';
import Userprofile from './Pages/Userprofile';
import Addproduct from './Pages/Addproduct';
import AdminDashboard from './Layout/Admindashboard';
import Dashboard from './Pages/Dashboard';
import Viewproduct from './Pages/Viewproduct';
import AddressForm from './Pages/AddressForm';

function App() {
    return (
        <div>
            <Routes>
                <Route element={<AuthLayout />}>
                    <Route path='/admin' element={<Login />} />
                    <Route path='/login' element={<Login />} />
                    <Route path='/signup' element={<Signup />} />
                    <Route path='/register' element={<Signup />} />
                    <Route path='/Edit-profile' element={<Signup />} />
                    <Route path='/forgot-password' element={<ForgotPassword />} />
                    <Route path='/otp' element={<OneTimePassword />} />
                    <Route path='/change-password' element={<ChangePassword />} />
                </Route>

                {/* Admin Dashboard layout routes */}
                <Route path="/dashboard" element={<AdminDashboard />}>
                    <Route index element={<Dashboard />} />
                    <Route path="add-product" element={<Addproduct />} />
                    <Route path="edit-product" element={<Addproduct />} />
                    <Route path="view-product" element={<Viewproduct />} />
                </Route>

                {/* user layout routes */}
                <Route index element={<Home />} />
                <Route path='/cart' element={<Cart />} />
                <Route path='/checkout' element={<Checkout />} />
                <Route path='/user-profile' element={<Userprofile />} />
                <Route path='/add-address' element={<AddressForm />} />
                <Route path='/update-address' element={<AddressForm />} />
            </Routes>

        </div >
    )
}

export default App