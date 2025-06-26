import React, { useState } from 'react'
import { createContext } from 'react'
import { ToastContainer } from 'react-toastify';
import Loader from './Components/Common/Loader';
import { callApi } from './Services/authApi';

export let Globalcontext = createContext();

function MainLayout({ children }) {
    let [isLoading, setIsLoading] = useState(false);
    const [userAddress, setuserAddress] = useState()

    const getUserAddress = async () => {
        const response = await callApi('get', '/auth/users-address')
        setuserAddress(response.addresses)
    };


    const obj = {
        isLoading, setIsLoading, userAddress, getUserAddress, fetchcartItems, cart
    }
    return (
        <Globalcontext.Provider value={obj}>
            {isLoading && <Loader />}
            {children}
            <ToastContainer />
        </Globalcontext.Provider>
    )
}

export default MainLayout