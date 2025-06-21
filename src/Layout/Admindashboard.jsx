import React, { useContext, useState } from 'react';
import Sidebar from '../Pages/Sidebar';
import { Outlet, useNavigate } from 'react-router';
import { Globalcontext } from '../MainLayout';
import { callApi } from '../Services/authApi';

const AdminDashboard = () => {
  const Navigate=useNavigate()

  const { setIsLoading } = useContext(Globalcontext)
  const handleLogout = async() => {
    try {
      setIsLoading(true)
      await callApi('post','auth/logout')
      localStorage.removeItem('email')
      localStorage.removeItem('token')
      Navigate('/admin')
    }finally{
      setIsLoading(false)
    }

}
  return (
    <div className="flex min-h-screen bg-gray-100" >
      <Sidebar />
      {/* Main Content */}
      <div className="flex-1 pb-8 h-lvh relative">
        <div className='w-[-webkit-fill-available] pt-8 bg-white h-[100px] fixed top-0'>
          <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">Admin Dashboard</h1>
          <button onClick={handleLogout} className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 absolute top-[30px] right-[30px]">
            Logout
          </button>
        </div>
        <div className='h-[calc(100vh-100px)] w-full overflow-y-scroll absolute top-[100px]'>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
