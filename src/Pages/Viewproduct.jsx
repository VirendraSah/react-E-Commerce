import React, { useContext, useEffect, useState } from 'react'
import { callApi } from '../Services/authApi';
import { Globalcontext } from '../MainLayout';
import { useNavigate } from 'react-router';

function Viewproduct() {
    let { setIsLoading } = useContext(Globalcontext)
    const [product, setProduct] = useState([]);
    const fetchProducts = async () => {
        try {
            setIsLoading(true)
            const response = await callApi('get', '/products');
            setProduct(response.products);
            
        } catch (error) {
            console.error('Failed to fetch products:', error);
        } finally {
            setIsLoading(false)
        }
    }
    useEffect(() => {
        fetchProducts()
    }, [])
    console.log(product)
    const handleDelete=async(productId)=>{
        try{
            setIsLoading(true)
           await callApi('delete',`product/${productId}`)
           await fetchProducts()
        }finally{
            setIsLoading(false)
        }
    }
    
    return (
        <div>

            <div className="bg-white rounded-lg shadow-md p-6 max-w-4xl mx-auto">
                <h2 className="text-xl font-semibold text-gray-700 mb-4">Product List</h2>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {product.map((product, index) => {
                                return (
                                    <>
                                        <ViewproductCard key={index} product={product} id={index+1}  ondelete={handleDelete}/>
                                    </>
                                )
                            }

                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default Viewproduct

function ViewproductCard({ product , id ,ondelete}) {
    const navigate=useNavigate()
    let { name, price, quantity, description } = product
    const handleEdit=()=>{
        navigate('/dashboard/edit-product', {state : {product:product}})
    }
    return (
        <>
            <tr key={id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${price}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{description}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{quantity}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <button
                        className="px-3 py-1 bg-yellow-400 text-white rounded hover:bg-yellow-500 transition"
                        onClick={() => handleEdit(product)}
                    > Edit</button>
                    <button
                        className="px-3 py-1 bg-yellow-400 text-white rounded hover:bg-yellow-500 transition"
                        onClick={()=> ondelete(product.productId)}
                    > Delete</button>
                </td>
            </tr>
        </>
    )
}