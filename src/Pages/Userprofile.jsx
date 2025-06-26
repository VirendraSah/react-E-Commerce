import React, { useContext, useEffect, useState} from 'react';
import { FiEdit2, FiPlus } from 'react-icons/fi';
import { Link, useNavigate } from 'react-router';
import { Globalcontext } from '../MainLayout';
import userimage from '../../public/userimage.png'
import { callApi } from '../Services/authApi';
import noImage from '../../public/no_image_found.png'

const Userprofile = () => {
    const {setIsLoading} = useContext(Globalcontext)
    const [details, setDetails] = useState()
    const navigate = useNavigate();

    const getUserDetails = async () => {
        try {
            setIsLoading(true)
            const response = await callApi('get', '/user/details')
            setDetails(response.user)
        } finally {
            setIsLoading(false)
        }
    };

    const editProfilehandler = () => {
        navigate('/edit-profile', { state: { data: details } })
    }

    useEffect(() => {
        getUserDetails()
    }, [])

    const updateAddressfun = async (item) => {
        navigate('/update-address', { state: { data: item } });
    }

    const orders = details?.Orders
    return (

        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                    {/* Profile Header */}
                    <div className="relative h-48 bg-gradient-to-r from-blue-500 to-indigo-600">
                        <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2">
                            <div className="relative group">
                                <div className="h-32 w-32 rounded-full border-4 border-white overflow-hidden bg-white shadow-lg">
                                    <img
                                        src={details?.image || userimage}
                                        alt="Profile"
                                        className="h-full w-full object-cover"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Profile Content */}
                    <div className="pt-20 pb-8 px-8 relative">
                        <button onClick={editProfilehandler} className="absolute cursor-pointer right-[20px] top-[10px] flex items-center space-x-2 bg-blue-500 text-white px-4 py-2 rounded-lg">
                            <FiEdit2 className="h-5 w-5" />
                            <span>Edit Profile</span>
                        </button>
                        {/* Name Section */}
                        <div className="text-center mb-8">
                            <div className="flex justify-center items-center space-x-2">
                                <h2 className="text-2xl font-bold text-gray-900">
                                    {details?.firstName} {details?.lastName}
                                </h2>
                            </div>
                        </div>

                        {/* Contact Information */}
                        <div className="max-w-2xl mx-auto space-y-6">
                            <div className="bg-gray-50 rounded-xl p-6 space-y-4">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>

                                {/* Phone */}
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600">Phone</span>
                                    <div className="flex items-center space-x-2">
                                        <span className="text-gray-900">{details?.countryCode} {details?.phoneno}</span>
                                    </div>
                                </div>

                                {/* Email */}
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600">Email</span>
                                    <div className="flex items-center space-x-2">
                                        <span className="text-gray-900">{details?.email}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Addresses Section */}
                            <div className="bg-gray-50 rounded-xl p-6">
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="text-lg font-semibold text-gray-900">Addresses</h3>
                                    <Link to='/add-address' className="flex items-center space-x-2 bg-blue-500 text-white px-4 py-2 rounded-lg">
                                        <FiPlus className="h-5 w-5" />
                                        <span>Add Address</span>
                                    </Link>
                                </div>
                                <div className='grid grid-cols-2 gap-3'>
                                    {Array.isArray(details?.Addresses) && details?.Addresses.length > 0
                                        ? details?.Addresses.map((item, index) => {

                                            return (
                                                <React.Fragment key={index}>
                                                    <AddressCard item={item} index={index} key={index} updateAddressfun={updateAddressfun}/>
                                                </React.Fragment>
                                            )
                                        })
                                        : "No address found"
                                    }
                                </div>
                            </div>

                            {/* Orders Section */}
                            <div className="bg-gray-50 rounded-xl p-6 mt-8">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Order History</h3>
                                {Array.isArray(orders) && orders.length > 0 ? (
                                    <div className="overflow-x-scroll">
                                        <table className="min-w-full divide-y divide-gray-200">
                                            <thead className="bg-gray-100">
                                                <tr>
                                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Order ID</th>
                                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Address</th>
                                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Order Items</th>
                                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Subtotal</th>
                                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                                </tr>
                                            </thead>
                                            <Orderrow orders={orders} />
                                        </table>
                                    </div>
                                ) : (
                                    <div className="text-gray-500">No orders found.</div>
                                )}
                            </div>
                        </div>
                    </div>


                </div>
            </div>
        </div>
    );
};

export default Userprofile;

function AddressCard({ item, updateAddressfun }) {
    let { street, city, state, address, pinCode, sector } = item
    return (
        <>
            <div className=' border border-gray-300 rounded px-2 py-3'>
                {address} {street} {sector} {city} {state} {pinCode}
                <button type='button' onClick={()=>updateAddressfun(item)} className='bg-blue-700 rounded block w-max px-3 py-1 text-white cursor-pointer'>Update</button>
            </div>
        </>
    )
}

function Orderrow({ orders }) {
    return (
        <>
            <tbody>
                {orders.map((order, index) => {
                    const { Address, orderItems, id, status, totalAmount } = order;
                    console.log(order)
                    return (
                        <tr
                            key={id || index}
                            className="bg-blue-50 shadow-md rounded-xl my-4 border border-blue-200 hover:shadow-lg transition-all">
                            <td className="px-4 py-4 text-sm text-blue-900 font-semibold rounded-l-xl border-r border-blue-100">
                                <span className="inline-block bg-white px-3 py-1 rounded-full shadow text-blue-700 font-bold tracking-widest">
                                    #{id.slice(-4)}
                                </span>
                            </td>
                            <td className="px-4 py-4 text-sm text-blue-800 border-r border-blue-100">
                                <div className="font-medium">{Address?.city || 'N/A'}</div>
                                <div className="text-xs text-blue-400">{Address?.pinCode}</div>
                            </td>
                            <td className="px-4 py-4 text-sm text-blue-900 border-r border-blue-100">
                                {orderItems.length > 0 ? (
                                    <ul className="space-y-2">
                                        {orderItems.map((item, i) => {
                                           const image=item?.Product?.productImages[0]?.url || noImage
                                            return (
                                                <li key={i} className="flex items-center gap-2">
                                                    <img src={image} alt={item?.Product?.name} className="w-8 h-8 object-cover rounded-full border-2 border-blue-200 shadow" />
                                                    <span className="font-semibold">{item?.Product?.name || 'Product xyz'}</span>
                                                    <span className="text-blue-500">${item?.price}</span>
                                                    <span className="text-xs text-blue-400">x {item?.quantity}</span>
                                                </li>
                                            );
                                        })}
                                    </ul>
                                ) : 'No items'}
                            </td>
                            <td className="px-4 py-4 text-lg font-bold text-blue-800 border-r border-blue-100">
                                <span className="bg-blue-100 px-3 py-1 rounded-full shadow">${totalAmount.toFixed(2)}</span>
                            </td>
                            <td className={`px-4 py-4 text-sm font-semibold rounded-r-xl text-center`}>
                                <span className={`px-3 py-1 rounded-full shadow`}>{status || 'Pending'}</span>
                            </td>
                        </tr>
                    );
                })}
            </tbody>
        </>
    );
}
