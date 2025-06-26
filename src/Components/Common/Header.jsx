import React, { useContext, useEffect, useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router';
import { callApi } from '../../Services/authApi';
import { Globalcontext } from '../../MainLayout';


function Header() {
  const navigate=useNavigate()
  const{setIsLoading}=useContext(Globalcontext)
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  useEffect(() => {
    const email = localStorage.getItem('email');
    if (email && email.includes('@')) {
      setIsLoggedIn(true)
    } else {
      setIsLoggedIn(false)
    }
  },[])

  const handleLogout = async () => {
    try {
      setIsLoading(true);
      await callApi('post', 'auth/logout');
      localStorage.clear();               
      navigate('/');                      
      window.location.reload();        
    } finally {
      setIsLoading(false);
    }
  };
  

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="text-2xl font-bold text-gray-800 hover:text-blue-600 transition-colors">
              E-Shop
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex space-x-8">
            <NavLink to="/" className={({ isActive }) => ` hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive ? 'text-blue-600' : 'text-gray-600'}`}>
              Home
            </NavLink>
            <NavLink to="/cart" className={({ isActive }) => ` hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive ? 'text-blue-600' : 'text-gray-600'}`}>
              Cart
            </NavLink>
          </nav>

          {/* Auth Buttons */}
          <div className="flex items-center space-x-4">
            {isLoggedIn ? (
              <div className="flex items-center space-x-4">
                <Link  to="/user-profile" className={` hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors text-gray-600`}>
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <NavLink
                  to="/login"
                  className="text-blue-600 hover:text-blue-700 px-4 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Login
                </NavLink>
                <NavLink
                  to="/register"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                >
                  Register
                </NavLink>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden">
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          <Link to="/" className="text-gray-600 hover:text-blue-600 block px-3 py-2 rounded-md text-base font-medium">
            Home
          </Link>
          <Link to="/products" className="text-gray-600 hover:text-blue-600 block px-3 py-2 rounded-md text-base font-medium">
            Products
          </Link>
          <Link to="/categories" className="text-gray-600 hover:text-blue-600 block px-3 py-2 rounded-md text-base font-medium">
            Categories
          </Link>
          <Link to="/cart" className="text-gray-600 hover:text-blue-600 block px-3 py-2 rounded-md text-base font-medium">
            Cart
          </Link>
          {isLoggedIn ? (
            <>
              <Link to="/profile" className="text-gray-600 hover:text-blue-600 block px-3 py-2 rounded-md text-base font-medium">
                Profile
              </Link>
              <button
                onClick={handleLogout}
                className="w-full text-left text-red-600 hover:text-red-700 block px-3 py-2 rounded-md text-base font-medium"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-blue-600 hover:text-blue-700 block px-3 py-2 rounded-md text-base font-medium">
                Login
              </Link>
              <Link to="/register" className="text-blue-600 hover:text-blue-700 block px-3 py-2 rounded-md text-base font-medium">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
