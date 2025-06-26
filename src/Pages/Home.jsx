import React, { useContext, useEffect, useState } from 'react';
import DashboardLayout from '../Layout/DashboardLayout';
import { Globalcontext } from '../MainLayout';
import { callApi } from '../Services/authApi';
import { useNavigate } from 'react-router';


function Home() {
    const {setIsLoading, cart} = useContext(Globalcontext);
    const [cartItems, setCartItems] = useState([]);
    const [product, setProduct] = useState([]);
    const navigate=useNavigate()

    // Fetch all products
    const fetchProducts = async () => {
        try {
            setIsLoading(true);
            const response = await callApi('get', '/products');
            setProduct(response.products || []);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);
    const handleAddToCart = async ({ productId, quantity }) => {
        const updatedCart = [...cartItems, { productId, quantity }];
        setCartItems(updatedCart);

        try {
            setIsLoading(true);
            const response = await callApi('post', '/add-to-cart', {
                items: updatedCart,
            });
            fetchProducts();
            const cartId = response.cartItems[0].cartId;
            localStorage.setItem('cartId', cartId);
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoToCart=()=>{
        navigate('/cart')
    }
    console.log(product)
    return (
        <DashboardLayout>
            <div className="min-h-screen bg-gray-50">
                <div className="container mx-auto px-4 py-8">
                    <h1 className="text-3xl font-bold text-center mb-8">Our Products</h1>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {product.length > 0 ?
                            product.map((items, index) => {
                                return (
                                    <React.Fragment key={index}>
                                        <Fetchproducts
                                            key={index}
                                            product={items}
                                            handleAddToCart={handleAddToCart}
                                            cart={cart}
                                            handleGoToCart={handleGoToCart}
                                        />
                                    </React.Fragment>
                                )
                            }) : (
                                <p>No product found</p>
                            )}
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}

export default Home;

// Single Product Card Component
function Fetchproducts({ product, handleAddToCart, handleGoToCart }) {
    const { name, image, price, productId, description, quantity, isCartItem } = product;
    console.log(isCartItem)
    return (
        <div>
            <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition duration-300">
                <div className="relative">
                    <img
                        src={image[0]?.url}
                        alt={name}
                        className="w-full h-48 object-cover"
                    />
                </div>
                <div className="p-4">
                    <h3 className="text-lg font-semibold mb-2">{name}</h3>
                    <h6 className="font-medium mb-2">Description : <span className='text-gray-500'>{description}</span></h6>
                    <div>
                        <p className="text-gray-600 mb-2">Price : ${price}</p>
                        <p className="text-gray-600 mb-2"> Quantity : {quantity}</p>
                    </div>

                    <div className="space-y-2">
                        {isCartItem == true
                            ? <button
                                onClick={() => handleGoToCart()}
                                className="w-full bg-red-600 text-white py-2 rounded hover:bg-red-700 transition duration-300">Go to Cart
                            </button>
                            : <button
                                onClick={() => handleAddToCart({ productId, quantity: 1 })}
                                className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition duration-300">Add to Cart
                            </button>

                        }
                    </div>
                </div>
            </div>
        </div>
    );
}
