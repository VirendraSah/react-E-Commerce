import React, { useState, useEffect, useContext } from 'react';
import { FaLock } from 'react-icons/fa';
import { Globalcontext } from '../MainLayout';
import { callApi } from '../Services/authApi';
import { useForm } from 'react-hook-form';
import { useLocation, useNavigate } from 'react-router';


function Checkout() {
    const navigate = useNavigate()
    const { setIsLoading, userAddress, getUserAddress, details} = useContext(Globalcontext);
    const [selectedAddressId, setSelectedAddressId] = useState(null);
    const location = useLocation();
    const totalAmount = location.state?.totalAmount || 0;
    const {
        trigger,
        handleSubmit
    } = useForm()

    useEffect(() => {
        getUserAddress();
    }, []);
    const userId = details?.userId

    const onSubmit = async () => {
        const isValid = await trigger();
        if (!isValid || !selectedAddressId) {
            alert("select an address.");
            return;
        }

        const finalData = {
            userId: userId,
            addressId: selectedAddressId,
        };

        try {
            setIsLoading(true)
            await callApi('post', '/checkout', finalData)
            navigate('/')
        } finally {
            setIsLoading(false)
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-semibold text-gray-800">Checkout</h1>
                <div className="flex items-center gap-2 text-green-600 font-medium">
                    <FaLock /> Secure Checkout
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Shipping Form */}
                <div className="lg:col-span-2 space-y-6">
                    <section className="bg-white p-6 rounded-lg shadow-sm">
                        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Shipping Information</h2>
                        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
                            {/* Address Selection */}
                            <div>
                                <h4 className="font-semibold mb-2">Choose Your Address</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {Array.isArray(userAddress) && userAddress.length === 0 && (
                                        <div className="col-span-2 text-gray-500">No saved user address found.</div>
                                    )}
                                    {Array.isArray(userAddress) && userAddress.map((item, idx) => (
                                        <label key={item.id || idx} className={`cursor-pointer border p-3 rounded ${selectedAddressId === item.id ? 'border-green-500' : 'hover:border-gray-300'}`}>
                                            <input
                                                type="radio"
                                                name="address"
                                                className="mr-2"
                                                value={item.id}
                                                checked={selectedAddressId === item.id}
                                                onChange={() => setSelectedAddressId(item.id)}
                                            />
                                            <span className="text-sm text-gray-700">
                                                {item.address}, {item.street}, {item.city}, {item.state} - {item.pinCode}
                                            </span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </form>
                    </section>
                </div>

                {/* Order Summary */}
                <div className="lg:col-span-1">
                    <section className="bg-white p-6 rounded-lg shadow-sm sticky top-8">
                        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Order Summary</h2>
                        <div className="space-y-4">
                            <div className="flex justify-between text-gray-600">
                                <span>Subtotal</span>
                                <span>${totalAmount}</span>
                            </div>
                            <div className="flex justify-between text-gray-600">
                                <span>Shipping</span>
                                <span>Free</span>
                            </div>
                            <div className="flex justify-between text-gray-600">
                                <span>Tax</span>
                                <span>$0</span>
                            </div>
                            <div className="border-t border-gray-200 pt-4 mt-4">
                                <div className="flex justify-between text-lg font-semibold text-gray-800">
                                    <span>Total</span>
                                    <span>${totalAmount}</span>
                                </div>
                            </div>
                            <button
                                type="submit"
                                onClick={handleSubmit(onSubmit)}
                                className="w-full bg-green-600 text-white py-3 px-4 rounded-md font-medium hover:bg-green-700 transition-colors duration-200"
                            >
                                Place Order
                            </button>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}

export default Checkout;
