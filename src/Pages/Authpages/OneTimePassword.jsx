import React, { useContext } from 'react'
import { Label } from '../../Components/Common/FormElement';
import { useForm } from 'react-hook-form'
import { Validateinputbox } from '../../Components/Common/FormElement';
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate, useLocation } from 'react-router';
import { callApi } from '../../Services/authApi';
import { Globalcontext } from '../../MainLayout';


function OneTimePassword() {
    const { setIsLoading } = useContext(Globalcontext)
    const navigate = useNavigate();
    const location = useLocation();
    let email = location.state.email;
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm()

    const validationConfig = [
        {
            label: 'OTP',
            placeholder: '123456',
            name: 'otp',
            type: 'text',
            rules: {
                required: 'OTP is required',
                pattern: { value: /^[0-9]+$/, message: 'OTP must contain only numbers' },
            }
        }
    ];

    const onsubmit = async (data) => {
        let emailotp = { ...data, email }
        setIsLoading(true)
        try {
            await callApi('post', '/auth/verify-otp', emailotp);
            reset();
            navigate('/change-password', { state: { data: emailotp } });
        } finally {
            setIsLoading(false)
        }
    }
    return (
        <div>
            <ToastContainer />
            <section className="bg-gray-50">
                <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
                    <a href="#" className="flex items-center mb-6 text-2xl font-semibold text-gray-900">
                        <img src="wscube-tech-logo-2.svg" alt="logo" />
                    </a>
                    <div className="w-full p-6 bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md sm:p-8">
                        <h2 className="mb-1 text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl">
                            Verify OTP
                        </h2>
                        <form className="mt-4 space-y-4 lg:mt-5 md:space-y-5" onSubmit={handleSubmit(onsubmit)}>
                            <div className='-mx-[12px]'>
                                {validationConfig.map((items, index) => {
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
                            </div>
                            <button type="submit" className="w-full text-white bg-blue-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">Verify OTP</button>
                        </form>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default OneTimePassword