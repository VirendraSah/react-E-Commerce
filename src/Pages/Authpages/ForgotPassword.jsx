import React, { useContext } from 'react'
import { Label } from '../../Components/Common/FormElement';
import { useForm } from 'react-hook-form'
import { Validateinputbox } from '../../Components/Common/FormElement';
import { useNavigate } from 'react-router';
import { Globalcontext } from '../../MainLayout';
import { callApi } from '../../Services/authApi';

function ForgotPassword() {
    let { setIsLoading } = useContext(Globalcontext)
    const navigate = useNavigate();
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm()

    const validationConfig = [
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
        }]

    const onsubmit = async (data) => {
        setIsLoading(true)
        try {
            await callApi('post','/auth/reset',data);
            reset();
            navigate('/otp', { state: { email: data.email } });
        } catch (error) {
            toast.error(error.response?.data?.message || error.message || 'Reset failed!');
            reset();
        }
        finally {
            setIsLoading(false)
        }
    }
    return (
        <div>
            <section className="bg-gray-50">
                <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
                    <a href="#" className="flex items-center mb-6 text-2xl font-semibold text-gray-900">
                        <img src="Logo.webp" alt="logo" className='max-w-[50px]' />
                    </a>
                    <div className="w-full p-6 bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md sm:p-8">
                        <h2 className="mb-1 text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl">
                            Enter your Email
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

                            <div className="">
                                <label htmlFor="newsletter" className="font-bold text-[12px] text-gray-500">Only Email here, you will recive an OTP on the logged in Email</label>
                            </div>
                            <button type="submit" className="w-full text-white bg-blue-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">Send OTP</button>
                        </form>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default ForgotPassword