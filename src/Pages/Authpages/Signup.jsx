import React, { useContext } from 'react'
import { Link, useLocation } from 'react-router'
import { Label } from '../../Components/Common/FormElement'
import { useForm } from "react-hook-form"
import { Validateinputbox } from '../../Components/Common/FormElement'
import { useNavigate } from 'react-router'
import { callApi } from '../../Services/authApi'
import { Globalcontext } from '../../MainLayout'
import { useEffect } from 'react'

function Signup() {
    const { setIsLoading } = useContext(Globalcontext)
    const navigate = useNavigate();
    const location = useLocation();
    const path = location.pathname;
    const userData = location.state?.data;
    console.log(userData)
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm()

    const onSubmit = async (data, event) => {
        event.preventDefault();

        const postData = new FormData();

        Object.entries(data).forEach(([key, value]) => {
            if (key === "image" && value?.[0]) {
                postData.append("image", value[0]);
            } else {
                postData.append(key, value);
            }
        });

        setIsLoading(true);
        try {
            if (path === '/edit-profile') {
                const { userId } = userData
                if (userId) {
                    await callApi('put', `auth/edit-user/${userId}`, postData, true);
                    navigate('/user-profile')
                }
            } else {
                await callApi('post', 'auth/signup', postData, true);
                console.log("Signup successful");
                reset();
                navigate('/login');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const validationConfig = [
        {
            label: 'FirstName',
            placeholder: 'firstName',
            type: 'text',
            name: 'firstName',
            rules: {
                minLength: { value: 2, message: 'First name must be at least 2 characters' },
                maxLength: { value: 30, message: 'First name must be at most 30 characters' },
                pattern: { value: /^[A-Za-z]+$/, message: 'First name must contain only letters' },
            }
        },
        {
            label: 'LastName',
            placeholder: 'lastname',
            type: 'text',
            name: 'lastName',
            rules: {
                minLength: { value: 2, message: 'Last name must be at least 2 characters' },
                maxLength: { value: 30, message: 'Last name must be at most 30 characters' },
                pattern: { value: /^[A-Za-z]+$/, message: 'Last name must contain only letters' },
            }
        },
        {
            label: 'UserName',
            placeholder: '@userName',
            type: 'text',
            name: 'username',
            rules: {
                minLength: { value: 3, message: 'Username must be at least 3 characters' },
                maxLength: { value: 20, message: 'Username must be at most 20 characters' },
                pattern: { value: /^[a-zA-Z0-9_]+$/, message: 'Username can only contain letters, numbers, and underscores' },
            }
        },
        {
            label: 'Code',
            placeholder: '+91',
            type: 'text',
            name: 'countryCode',
            rules: {
                minLength: { value: 1, message: 'Country code is required' },
                maxLength: { value: 5, message: 'Country code is too long' },
                pattern: { value: /^\+\d+$/, message: 'Country code must start with + and numbers' },
            }
        },
        {
            label: 'Mobile Number',
            placeholder: 'mobile number',
            type: 'number',
            name: 'phoneno',
            rules: {
                minLength: { value: 10, message: 'Phone number must be at least 10 digits' },
                maxLength: { value: 15, message: 'Phone number must be at most 15 digits' },
                pattern: { value: /^[0-9]+$/, message: 'Phone number must contain only digits' },
            }
        },
        {
            label: 'Email id',
            placeholder: 'xyz@gmail.com',
            name: 'email',
            type: 'email',
            rules: {
                minLength: { value: 5, message: 'Email must be at least 5 characters' },
                maxLength: { value: 50, message: 'Email must be at most 50 characters' },
                pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Invalid email address' },
            }
        },
        {
            label: 'Password',
            placeholder: 'password',
            name: 'password',
            type: 'password',
            rules: {
                minLength: { value: 6, message: 'Password must be at least 6 characters' },
                maxLength: { value: 20, message: 'Password must be at most 20 characters' },
                pattern: { value: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{6,}$/, message: 'Password must contain letters and numbers' },
            }
        },
        {
            label: 'image',
            placeholder: 'image here',
            name: 'image',
            type: 'file',
            rules: {
                required: 'Image is required',
                validate: {
                    validType: (files) =>
                        files?.[0] &&
                            ['image/jpeg', 'image/png', 'image/gif'].includes(files[0]?.type)
                            ? true
                            : 'Invalid image type. Only JPEG, PNG, and GIF are allowed.',
                },
            },
        },
        {
            label: 'Address',
            placeholder: 'Enter your address',
            name: 'address',
            type: 'text',
            rules: {
                required: 'Address is required',
                minLength: {
                    value: 10,
                    message: 'Address must be at least 10 characters long',
                },
                maxLength: {
                    value: 100,
                    message: 'Address must not exceed 100 characters',
                },
            },
        }

    ];

    useEffect(() => {
        if (path === '/edit-profile' && userData) {
            reset({
                address: userData.address || '',
                countryCode: userData.countryCode || '',
                email: userData.email || '',
                firstName: userData.firstName || '',
                lastName: userData.lastName || '',
                phoneno: userData.phoneno || '',
                username: userData.username || '',
            });
        } else {
            reset(
                {
                    address: '',
                    countryCode: '',
                    email: '',
                    firstName: '',
                    lastName: '',
                    phoneno: '',
                    username: '',
                }
            );
        }
    }, [userData, reset]);

    const finalFields = path === '/edit-profile'
        ? validationConfig.filter((_, index) =>[0,1,2,3,4,7,8].includes(index)) 
        : validationConfig.slice(0, 8);

    return (
        <div>
            <section className="bg-gray-50">
                <div className="flex flex-col items-center justify-center px-6 py-10 mx-auto">
                    <a href="#" className="flex items-center mb-6 text-2xl font-semibold text-gray-900">
                        <img src="Logo.webp" alt="logo" className='max-w-[50px]' />
                    </a>
                    <div className="w-full bg-white rounded-lg shadow-lg md:mt-0 sm:max-w-md xl:p-0">
                        <div className="p-6 space-y-4 md:space-y-6 sm:p-8">

                            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl">
                                {path == '/edit-profile' ? 'Edit Profile' : 'Create an account'}
                            </h1>
                            <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit(onSubmit)}>
                                {finalFields.map((items, index) => {
                                    let { type, label, name, placeholder, rules } = items
                                    return (
                                        <React.Fragment key={index}>
                                            <div>
                                                <Label label={label} />
                                                <Validateinputbox rules={rules} register={register} errors={errors} name={name} placeholder={placeholder}
                                                    type={type} />
                                            </div>
                                        </React.Fragment>
                                    )
                                })}
                                <div className="flex items-start">
                                    <div className="flex items-center h-5">
                                        <input id="terms" aria-describedby="terms" type="checkbox" className="w-4 h-4 border border-gray-300 rounded bg-gray-50" required />
                                    </div>
                                    <div className="ml-3 text-sm">
                                        <label htmlFor="terms" className="font-light text-gray-500">I accept the <a className="font-medium text-blue-600 hover:underline" href="#">Terms and Conditions</a></label>
                                    </div>
                                </div>
                                <button type="submit" className="w-full text-white bg-blue-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800 cursor-pointer">{path == '/edit-profile' ? 'Update Profile' : 'Create an account'}</button>
                                {path == '/edit-profile'
                                    ? ''
                                    : <p className="text-sm font-light text-gray-500">
                                        Already have an account? <Link to={path == '/signup' ? '/admin' : '/login'} className="font-medium text-blue-600 hover:underline">Login here</Link>
                                    </p>
                                }
                            </form>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default Signup