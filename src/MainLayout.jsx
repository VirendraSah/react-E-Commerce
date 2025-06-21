import React, { useState } from 'react'
import { createContext } from 'react'
import { ToastContainer } from 'react-toastify';
import Loader from './Components/Common/Loader';
import { callApi } from './Services/authApi';

export let Globalcontext = createContext();

function MainLayout({ children }) {
    let [isLoading, setIsLoading] = useState(false);
    const [details, setDetails] = useState()
    const [userAddress, setuserAddress] = useState()

    const getUserDetails = async () => {
        try {
            setIsLoading(true)
            const response = await callApi('get', 'auth/userDetails')
            setDetails(response.data)
        } finally {
            setIsLoading(false)
        }
    };

    const getUserAddress = async () => {
        const response = await callApi('get', '/auth/users-address')
        setuserAddress(response.addresses)
    };


    const obj = {
        isLoading, setIsLoading, details, getUserDetails, userAddress, getUserAddress
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

// useEffect(() => {
//     getUserDetails()
// }, [])