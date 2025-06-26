import React, { useContext, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDropzone } from 'react-dropzone';
import { useNavigate, useLocation } from 'react-router';
import { Label, Validateinputbox } from '../Components/Common/FormElement';
import { callApi } from '../Services/authApi';
import { Globalcontext } from '../MainLayout';
import noImage from '../../public/no_image_found.png'

const AddProduct = () => {
    const { setIsLoading } = useContext(Globalcontext);
    const navigate = useNavigate();
    const location = useLocation();
    const path = location.pathname;
    const product = location.state?.product;

    const [previews, setPreviews] = useState([]);
    const [existingImages, setExistingImages] = useState([]);

    const {
        register,
        handleSubmit,
        reset,
        watch,
        formState: { errors },
        setValue,
    } = useForm();

    const onDrop = (acceptedFiles) => {
        setValue('images', acceptedFiles, { shouldValidate: true });
        setPreviews(acceptedFiles.map(file => Object.assign(file, { preview: URL.createObjectURL(file) })));
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { 'image/*': [] },
        multiple: true,
    });

    useEffect(() => {
        return () => previews.forEach(file => URL.revokeObjectURL(file.preview));
    }, [previews]);

    const handleRemoveImage = (i) => {
        const newPreviews = previews.filter((_, index) => index !== i);
        const currentImages = watch('images', []);
        const newImages = currentImages.filter((_, index) => index !== i);
        setPreviews(newPreviews);
        setValue('images', newImages, { shouldValidate: true });
    };

    const handleRemoveExistingImage = async (id) => {
        setIsLoading(false)
        await callApi('delete', `/delete-image/${id}`)
        setExistingImages(existingImages.filter((item) => item?.id !== id));

    };
    console.log(existingImages)


    const formFields = [
        { label: 'Name',
             name: 'name', type: 'text', placeholder: 'Enter product name', rules: { required: 'Name is required', minLength: { value: 2, message: 'At least 2 characters' }, maxLength: { value: 50, message: 'At most 50 characters' } } },

        { label: 'Price', name: 'price', type: 'number', placeholder: 'Enter price', rules: { required: 'Price is required', min: { value: 1, message: 'Min 1' }, max: { value: 100000, message: 'Max 100000' } } },
        { label: 'Description', name: 'description', type: 'text', placeholder: 'Enter description', rules: { required: 'Description is required', minLength: { value: 10, message: 'At least 10 characters' }, maxLength: { value: 500, message: 'At most 500 characters' } } },
        { label: 'Quantity', name: 'quantity', type: 'number', placeholder: 'Enter quantity', rules: { required: 'Quantity is required', validate: { min: (v) => Number(v) >= 1 || 'Min 1', max: (v) => Number(v) <= 1000 || 'Max 1000' } } },
        { label: 'Location', name: 'location', type: 'text', placeholder: 'Enter location', rules: { required: 'City is required', pattern: { value: /^[a-zA-Z\u0080-\u024F\s.'-]{2,100}$/, message: 'Invalid city name' }, minLength: { value: 2, message: 'Min 2 characters' }, maxLength: { value: 100, message: 'Max 100 characters' }, validate: { notFake: (v) => !['unknown', 'n/a', 'none'].includes(v.trim().toLowerCase()) || 'Invalid name' } } },
    ];

    const onSubmit = async (data) => {
        const formData = new FormData();

        // Append new images
        if (Array.isArray(data.images)) {
            data.images.forEach(img => formData.append('image', img));
        }

        // Append other fields
        Object.keys(data).forEach(key => {
            if (key !== 'images') {
                formData.append(key, data[key]);
            }
        });

        try {
            setIsLoading(true);
            if (path === '/dashboard/add-product') {
                await callApi('post', '/add-product', formData, true);
            } else {
                await callApi('put', `/edit-product/${product.productId}`, formData, true);
                navigate('/dashboard/view-product');
            }
            reset();
            setPreviews([]);
            setExistingImages({});
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (path === '/dashboard/edit-product' && product) {
            reset({
                name: product.name || '',
                price: product.price || '',
                description: product.description || '',
                quantity: product.quantity || '',
                location: product.location || '',
            });

            if (product?.image?.length > 0) {
                const imgArray = product.productImages.map(img => ({
                    url: img.url,
                    id: img.id,
                }));
                setExistingImages(imgArray);
            } else {
                setExistingImages([{ url: noImage, id: null }]);
            }
        }
    }, [product, path, reset]);
    console.log(product)
    return (
        <div className="max-w-2xl mx-auto my-8 p-8 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-center text-gray-800 mb-8">
                {path === '/dashboard/add-product' ? 'Add New Product' : 'Update Product'}
            </h2>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div>
                    <Label label="Product Images" />
                    <div {...getRootProps()} className={`border-2 border-dashed rounded-md p-4 text-center cursor-pointer ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}`}>
                        <input {...getInputProps()} name="images" />
                        <p className="text-gray-500">Drag & drop images here, or click to select</p>
                    </div>
                    {errors.images && <span className="text-red-600">{errors.images.message}</span>}

                    <div className="flex gap-2 mt-2 flex-wrap">
                        {existingImages.length > 0 && existingImages.map((item) => (
                            <div key={`existing-${item.id}`} className="relative inline-block">
                                <img src={item?.url} alt="existing" className="h-20 w-20 object-cover rounded border" />
                                <button
                                    type="button"
                                    onClick={() => handleRemoveExistingImage(item?.id)}
                                    className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-700"
                                    style={{ transform: 'translate(40%,-40%)' }}
                                >
                                    &times;
                                </button>
                            </div>
                        ))}

                        {previews.map((file, index) => (
                            <div key={`preview-${index}`} className="relative inline-block">
                                <img src={`/${file.name}`} alt="preview" className="h-20 w-20 object-cover rounded border" />
                                <button
                                    type="button"
                                    onClick={() => handleRemoveImage(index)}
                                    className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-700"
                                    style={{ transform: 'translate(40%,-40%)' }}
                                >
                                    &times;
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {formFields.map(({ label, name, placeholder, type, rules }, index) => (
                    <div key={index}>
                        <Label label={label} />
                        <Validateinputbox
                            rules={rules}
                            register={register}
                            errors={errors}
                            name={name}
                            placeholder={placeholder}
                            type={type}
                            classname="border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>
                ))}

                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-3 px-4 rounded-md font-semibold hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                    {path === '/dashboard/add-product' ? 'Add Product' : 'Update Product'}
                </button>
            </form>
        </div>
    );
};

export default AddProduct;
