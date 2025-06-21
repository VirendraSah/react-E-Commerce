import React from 'react'
import { NavLink } from 'react-router';

function Sidebar() {
    return (
        <>
            {/* Sidebar */}
            <div className="w-64 bg-white shadow-lg flex flex-col py-8 px-4">
                <h2 className="text-2xl font-bold text-blue-600 mb-8 text-center">Admin Panel</h2>
                <NavLink to='/dashboard'
                    type='button' className={`mb-4 px-4 py-2 rounded-md text-left font-medium bg-gray-100 text-gray-800 hover:bg-blue-500 hover:text-white transition`}
                >
                    Dashboard
                </NavLink>
                <NavLink to='add-product'
                    type='button' className={({isActive})=>`mb-4 px-4 py-2 rounded-md text-left font-medium ${isActive ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-800 hover:bg-blue-500 hover:text-white transition'}`}
                >
                    Add Product
                </NavLink>
                <NavLink to='view-product'
                    className={({isActive})=>`px-4 py-2 rounded-md text-left font-medium ${isActive ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-800 hover:bg-blue-500 hover:text-white transition'}`}
                >
                    View Product
                </NavLink>
            </div>
        </>
    )
}

export default Sidebar