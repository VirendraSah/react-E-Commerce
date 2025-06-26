import React, { useContext, useEffect, useState } from 'react';
import { Validateinputbox } from '../Components/Common/FormElement';
import { Label } from '../Components/Common/FormElement';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router';
import { useLocation } from 'react-router';
import { callApi } from '../Services/authApi';
import { Globalcontext } from '../MainLayout';


const AddressForm = () => {
    const { setIsLoading } = useContext(Globalcontext)
    const navigate = useNavigate();
    const location = useLocation();
    const path = location.pathname;
    const addressData=location.state?.data || {}
    const addressFormFields = [
        {
            label: 'Address',
            placeholder: 'Enter address',
            type: 'text',
            name: 'address',
            rules: {
                required: 'Address is required'
            }
        },
        {
            label: 'Street',
            placeholder: 'Enter street',
            type: 'text',
            name: 'street',
            rules: {
                required: 'Street is required'
            }
        },
        {
            label: 'Sector',
            placeholder: 'Enter sector',
            type: 'text',
            name: 'sector',
            rules: {
                required: 'Sector is required'
            }
        },
        {
            label: 'City',
            placeholder: 'Enter city',
            type: 'text',
            name: 'city',
            rules: {
                required: 'City is required'
            }
        },
        {
            label: 'PIN Code',
            placeholder: 'Enter PIN code',
            type: 'text',
            name: 'pinCode',
            rules: {
                required: 'PIN code is required',
                pattern: { value: /^\d{6}$/, message: 'PIN code must be 6 digits' }
            }
        },
        {
            label: 'State',
            placeholder: 'Enter state',
            type: 'text',
            name: 'state',
            rules: {
                required: 'State is required'
            }
        }
    ];

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm()

    useEffect(() => {
        if (path === '/update-address' && addressData) {
            reset({
                address: addressData.address || '',
                pinCode: addressData.pinCode || '',
                sector: addressData.sector || '',
                state: addressData.state || '',
                street: addressData.street || '',
                city: addressData.city || '',
            });
        } else if(path =='/add-address'){
            reset(
                {
                    address: '',
                    pinCode: '',
                    sector: '',
                    state: '',
                    street: '',
                }
            );
        }
    }, [path, reset]);


    const Submitform = async (data) => {
        if (path == '/add-address') {
            try {
                setIsLoading(true)
                await callApi('post', '/auth/add-address', data)
                navigate('/user-profile')
            } finally {
                setIsLoading(false)
            }
        }
        else {
            try {
                await callApi('put', `/auth/users/addresses/${addressData?.id}`, data)
                reset();
                navigate('/user-profile')
            } finally {
                setIsLoading(false)
            }
        }

    }




    return (
        <div className="max-w-2xl mx-auto my-8 p-8 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold text-center text-gray-800 mb-8">Add Delivery Address</h2>
            <form onSubmit={handleSubmit(Submitform)} className="space-y-6">

                {addressFormFields.slice(0, 1).map((items, index) => {
                    let { type, label, name, placeholder, rules } = items
                    return (
                        <React.Fragment key={index}>
                            <div>
                                <Label label={label} />
                                <AddressTextarea rules={rules} register={register} errors={errors} name={name} placeholder={placeholder}
                                    type={type} />
                            </div>
                        </React.Fragment>
                    )
                })}

                {addressFormFields.slice(1,).map((items, index) => {
                    let { type, label, name, placeholder, rules } = items
                    return (
                        <React.Fragment key={index}>
                            <div className='space-y-2'>
                                <Label label={label} />
                                <Validateinputbox rules={rules} register={register} errors={errors} name={name} placeholder={placeholder}
                                    type={type} />
                            </div>
                        </React.Fragment>
                    )
                })}

                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200">
                    {path == '/add-address'
                        ? 'Save Address'
                        : 'Update Address'
                    }
                </button>
            </form>
        </div>
    );
};

export default AddressForm;


function AddressTextarea({ label, rules, name, register, placeholder, type, errors }) {

    return (
        <div className="space-y-2">
            <label htmlFor={name} className="block text-sm font-medium text-gray-700">
                {label}
            </label>
            <textarea
                id={name}
                {...register(name, { required: `${name} is required`, ...rules })}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="3"
                type={type}
                placeholder={placeholder}
                name={name}
            ></textarea>
            {errors[name] && <span className="text-red-600 z-3">{errors[name].message}</span>}
        </div>
    );
}

