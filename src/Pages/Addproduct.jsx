import React, { useContext } from 'react';
import { Label } from '../Components/Common/FormElement';
import { Validateinputbox } from '../Components/Common/FormElement';
import { useForm } from 'react-hook-form';
import { callApi } from '../Services/authApi';
import { Globalcontext } from '../MainLayout';
import { useLocation } from 'react-router';
import { useNavigate } from 'react-router';
import { useEffect } from 'react';

const Addproduct = () => {
    const { setIsLoading } = useContext(Globalcontext)
    const Navigate=useNavigate()
    const location = useLocation()
    const path = location.pathname;
    const product = location.state?.product
    console.log(product)
    const formFields = [
        {
            label: 'Name',
            placeholder: 'Enter product name',
            type: 'text',
            name: 'name',
            rules: {
                required: 'Name is required',
                minLength: { value: 2, message: 'Name must be at least 2 characters' },
                maxLength: { value: 50, message: 'Name must be at most 50 characters' },
            },
        },
        {
            label: 'Image',
            placeholder: 'Upload image',
            type: 'file',
            name: 'image',
            rules: {
                required: 'Image is required',
            },
        },
        {
            label: 'Price',
            placeholder: 'Enter price',
            type: 'number',
            name: 'price',
            rules: {
                required: 'Price is required',
                min: { value: 1, message: 'Price must be at least 1' },
                max: { value: 100000, message: 'Price must be less than 100000' },
            },
        },
        {
            label: 'Description',
            placeholder: 'Enter description',
            type: 'text',
            name: 'description',
            rules: {
                required: 'Description is required',
                minLength: { value: 10, message: 'Description must be at least 10 characters' },
                maxLength: { value: 500, message: 'Description must be at most 500 characters' },
            },
        },
        {
            label: 'Quantity',
            placeholder: 'Enter quantity',
            type: 'number',
            name: 'quantity',
            rules: {
                required: 'Quantity is required',
                validate: {
                    min: (value) => Number(value) >= 1 || 'Quantity must be at least 1',
                    max: (value) => Number(value) <= 1000 || 'Quantity must be less than 1000',
                },
            },
        },
        {
            label: 'Location',
            placeholder: 'Enter location',
            type: 'text',
            name: 'location',
            rules: {
                required: 'City is required',
                pattern: {
                    value: /^[a-zA-Z\u0080-\u024F\s.'-]{2,100}$/,
                    message: 'Enter a valid city name',
                },
                minLength: {
                    value: 2,
                    message: 'City name must be at least 2 characters',
                },
                maxLength: {
                    value: 100,
                    message: 'City name must be less than 100 characters',
                },
                validate: {
                    notFake: (value) => {
                        const trimmed = value.trim().toLowerCase();
                        return !['unknown', 'n/a', 'none'].includes(trimmed) || 'City name is invalid';
                    }
                }
            },
        },
    ];

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm()

    const Productform = async (data) => {
        const postData = new FormData();
        for (let key in data) {
            if (key == 'image') {
                postData.append("image", data[key][0])
            } else {
                postData.append(key, data[key]);
            }
        }
        try {
            setIsLoading(true);
            if(path=='/dashboard/add-product'){
                await callApi('post', '/add-product', postData, true)
            }else if(path=='/dashboard/edit-product'){
                await callApi('put', `/edit-product/${product.productId}`, postData, true)
                Navigate('/dashboard/view-product')
            }
            reset()
        } finally {
            setIsLoading(false);
        }

    };
    useEffect(() => {
        if (path ==='/dashboard/edit-product' && product) {
          reset({
            name: product.name || '',
            price: product.price || '',
            description: product.description || '',
            quantity: product.quantity || '',
            location: product.location || '',
          });
        } else if(path ==='/dashboard/add-product'){
            reset(
                {
                    name: '',
                    price:'',
                    description:'',
                    quantity:'',
                    location:'',
                  }
            );
        }
      }, [product, reset]);

    return (
        <div className="max-w-2xl mx-auto my-8 p-8 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-center text-gray-800 mb-8">{path== '/dashboard/add-product'? 'Add New Product' : 'Update Product'}</h2>
            <form onSubmit={handleSubmit(Productform)} className="space-y-6">
                {formFields.map((items, index) => {
                    let { label, placeholder, type, name, rules} = items
                    return (
                        <React.Fragment key={index}>
                            <div>
                                <Label label={label} />
                                <Validateinputbox rules={rules} register={register} errors={errors} name={name} placeholder={placeholder}
                                    type={type} classname={'border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'} />
                            </div>
                        </React.Fragment>
                    )
                })}

                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-3 px-4 rounded-md font-semibold hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                   {path=='/dashboard/add-product' ? 'Add Product' : 'Update product'} 
                </button>
            </form>
        </div>
    );
};

export default Addproduct;
