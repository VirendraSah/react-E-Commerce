import React, { useContext} from 'react'
import { Link, useNavigate, useLocation } from 'react-router'
import { useForm } from 'react-hook-form'
import { Label } from '../../Components/Common/FormElement'
import { Validateinputbox } from '../../Components/Common/FormElement'
import { callApi } from '../../Services/authApi'
import { Globalcontext } from '../../MainLayout'


export default function Login() {
    const {setIsLoading}=useContext(Globalcontext)
    const navigate = useNavigate();
    const location = useLocation();
    const path = location.pathname;
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
        },
        {
            label: 'Password',
            placeholder: 'password',
            name: 'password',
            type: 'password',
            rules: {
                minLength: { value: 2, message: 'Password must be at least 6 characters' },
                maxLength: { value: 20, message: 'Password must be at most 20 characters' },
                pattern: { value: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{6,}$/, message: 'Password must contain letters and numbers' },
            }
        }
    ]


    const handleLogin = async (data) => {
        let { email, password } = data
        setIsLoading(true);
        try {
            const response = await callApi('post', '/auth/login', { email, password });
            const { token} = response || {};
            localStorage.setItem('token', token)
            localStorage.setItem('email', email)
            if (path=='/admin') {
                reset()
                navigate('/dashboard')
            }else{
                reset()
                navigate('/')
            }
        } finally {
            setIsLoading(false);
        }
    }
    return (
        <>
            <section className="bg-gray-50">
                <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
                    <a href="#" className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white">
                        <img src='/Logo.webp' alt='logo' className="max-w-[100px]" />
                    </a>
                    <div className="w-full bg-white rounded-lg shadow-lg md:mt-0 sm:max-w-md xl:p-0 dark:border-gray-700">
                        <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl">
                                Log in to your account
                            </h1>
                            <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit(handleLogin)}>
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
                                <div className="flex items-center justify-between">
                                    <div className="flex items-start">
                                        <div className="flex items-center h-5">
                                            <input id="remember" aria-describedby="remember" type="checkbox" className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800" required="" />
                                        </div>
                                        <div className="ml-3 text-sm">
                                            <label htmlFor="remember" className="text-gray-500 ">Remember me</label>
                                        </div>
                                    </div>
                                    <Link to='/forgot-password' className="text-sm font-medium text-blue-600 hover:underline">Forgot password?</Link>
                                </div>
                                <button type="submit" className="w-full text-white bg-blue-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">
                                    Sign in
                                </button>
                                <p className="text-sm font-light text-gray-500">
                                    Don't have an account yet? <Link to={path == '/admin' ? '/signup' : '/register'} className="font-medium text-blue-600 hover:underline">
                                        {path == '/admin' ? 'Sign up' : 'register'}
                                    </Link>
                                </p>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}
