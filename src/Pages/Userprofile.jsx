import React, { useContext, useEffect} from 'react';
import { FiEdit2, FiPlus} from 'react-icons/fi';
import { Link, useNavigate } from 'react-router';
import { Globalcontext } from '../MainLayout';
import userimage from '../../public/userimage.png'
const Userprofile = () => {
    const{details, getUserDetails, userAddress, getUserAddress}=useContext(Globalcontext)
    const navigate = useNavigate();

      useEffect(()=>{
        getUserDetails()
        getUserAddress()
      },[])

    const editProfilehandler=()=>{
        navigate('/edit-profile', {state:{data:details}})
    }

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

                                {/* Main Address */}
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600">Main Address</span>
                                    <div className="flex items-center space-x-2">
                                        <span className="text-gray-900">{details?.address || "No address Found"}</span>
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
                                    {Array.isArray(userAddress) && userAddress.length > 0
                                        ? userAddress.map((item, index) => {

                                            return (
                                                <>
                                                    <AddressCard item={item} key={index} />
                                                </>
                                            )
                                        })
                                        : "No address found"
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Userprofile;

function AddressCard({ item }) {
    let navigate = useNavigate()
    let {street, city, state, zipCode, address } = item
    const updateAddressfun = async () => {
        navigate('/update-address', {state: {data: item}});
    }
    return (
        <>
            <div className=' border border-gray-300 rounded px-2 py-3'>
                {address} {street} {city} {state} {zipCode}
                <button type='button' onClick={updateAddressfun} className='bg-blue-700 rounded block w-max px-3 py-1 text-white cursor-pointer'>Update</button>
            </div>
        </>
    )
}
