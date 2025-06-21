import React, { useContext, useEffect, useState } from 'react';
import DashboardLayout from '../Layout/DashboardLayout';
import { FaTrash } from 'react-icons/fa';
import { callApi } from '../Services/authApi';
import { Globalcontext } from '../MainLayout';
import { useNavigate } from 'react-router';

function Cart() {
    const navigate=useNavigate()
    const { setIsLoading } = useContext(Globalcontext)
    const cartId = localStorage.getItem('cartId')
    const [cartItem, setCartItems] = useState([])
    const [productquantity, setProductQuantity] = useState(1)
    console.log(productquantity)
    const fetchcartItems = async () => {
        try {
            setIsLoading(true)
            const response = await callApi('get', `/cart/${cartId}`)
            setCartItems(response.cart.CartItems)
        } finally {
            setIsLoading(false)
        }
    }
    useEffect(() => {
        fetchcartItems()
    }, [])

    const handlecartDetele = async (productId) => {
        try {
            setIsLoading(true)
            await callApi('delete', `/cart/${productId}`)
            await fetchcartItems()

        } finally {
            setIsLoading(false)
        }
    }

    const handleIncrease = async (id) => {
        const item = cartItem.find(i => i.Product.productId === id);
        const data = {
            cartId: cartId,
            productId: id,
            quantity: item.quantity + 1
        }
        await callApi('post', '/cart/update', data)
        fetchcartItems()
    };

    const handleDecrease = async (id) => {
        const item = cartItem.find(i => i.Product.productId === id);
        const newQuantity = Math.max(1, item.quantity - 1);

        setProductQuantity(prev => Math.max(1, prev - 1));
        const data = {
            cartId: cartId,
            productId: id,
            quantity: newQuantity
        }
        await callApi('post', '/cart/update', data)
        fetchcartItems()

    };
    const calculateTotal = () => {
        return cartItem.reduce((total, item) => {
            return total + item.Product.price * item.quantity;
        }, 0)
    };
    const totalAmount=calculateTotal().toFixed(2)
    console.log(typeof(totalAmount))
    const handleCheckout = () => {
        const email = localStorage.getItem('email');
    
        if (!email) {
            alert('Please login and then come back here.');
            return;
        }
    
        if (totalAmount === '0.00') {
            alert('Please add some items to your cart.');
            return;
        }
    
        navigate('/checkout', { state: { totalAmount: totalAmount } });
    };
    

    return (
        <DashboardLayout>
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold mb-8">Cart</h1>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Cart Items Table */}
                    <div className="w-full lg:w-2/3">
                        <div className="bg-white rounded-lg shadow overflow-hidden">
                            <table className="w-full">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">

                                    {Array.isArray(cartItem) && cartItem.length > 0 ? (
                                        cartItem.map((item, index) => {
                                            const { quantity, Product: product } = item;
                                            return (
                                                <CartItemRow
                                                    key={product?.productId || index}
                                                    quantity={quantity}
                                                    product={product}
                                                    handlecartDetele={handlecartDetele}
                                                    setQuantity={setProductQuantity}
                                                    productquantity={productquantity}
                                                    handleDecrease={handleDecrease}
                                                    handleIncrease={handleIncrease}
                                                />
                                            );
                                        })
                                    )
                                        : 'No product Found'
                                    }
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div className="w-full lg:w-1/3">
                        <div className="bg-white rounded-lg shadow p-6">
                            <h2 className="text-xl font-bold mb-4">ORDER SUMMARY</h2>
                            <div className="space-y-4">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Subtotal</span>
                                    <span className="font-semibold">${calculateTotal().toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Shipping</span>
                                    <span className="font-semibold">Free</span>
                                </div>
                                <div className="border-t pt-4">
                                    <div className="flex justify-between">
                                        <span className="text-lg font-bold">Total</span>
                                        <span className="text-lg font-bold">${calculateTotal().toFixed(2)}</span>
                                    </div>
                                </div>
                                <button onClick={handleCheckout} className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition duration-300">
                                    Proceed to checkout
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}

export default Cart;

function CartItemRow({ product, handlecartDetele, quantity, handleDecrease, handleIncrease }) {
    const { name, price, image, description, productId } = product
    return (
        <>
            <tr key={productId}>
                <td className="px-6 py-4">
                    <div className="flex items-center">
                        <img
                            src={image}
                            alt={name}
                            className="w-20 h-20 object-cover rounded"
                        />
                        <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{name}</div>
                            <div className="text-sm text-gray-500">{description}</div>
                        </div>
                    </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">${price}</td>
                <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                        <button onClick={() => handleDecrease(productId)} className="px-2 py-1 bg-gray-100 rounded hover:bg-gray-200">-</button>
                        <span className="w-8 text-center">{quantity}</span>
                        <button onClick={() => handleIncrease(productId)} className="px-2 py-1 bg-gray-100 rounded hover:bg-gray-200">+</button>
                    </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">${(price * quantity).toFixed(2)}</td>
                <td className="px-6 py-4 text-right">
                    <button onClick={() => handlecartDetele(productId)} className="text-red-500 hover:text-red-700">
                        <FaTrash />
                    </button>
                </td>
            </tr>
        </>
    )
}
