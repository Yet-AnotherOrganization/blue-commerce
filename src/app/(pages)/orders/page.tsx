'use client'
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { FaChevronDown, FaChevronUp, FaShoppingBasket } from 'react-icons/fa';
import Link from 'next/link';
import { Order } from '@/generated/prisma';
import { shimmer, toBase64 } from '@/utils/clientOnlyUtils';

// --- TypeScript Interfaces matching your API Payload ---

const OrderRow = ({ order }: { order: any }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="bg-white border border-stone-200 rounded-lg overflow-hidden mb-4 shadow-sm">
            <div
                onClick={() => setIsOpen(!isOpen)}
                className="bg-stone-50 hover:bg-stone-100 cursor-pointer p-4 flex justify-between items-center text-xs select-none"
            >
                <div className="flex gap-6">
                    <div>
                        <p className="text-stone-400 uppercase font-medium mb-1">Date</p>
                        <p className="font-semibold text-stone-700">{new Date(order.createdAt).toLocaleDateString('tr-TR')} - {new Date(order.createdAt).toLocaleTimeString('tr-TR')}</p>
                    </div>
                    
                    <div>
                        <p className="text-stone-400 uppercase font-medium mb-1">Total</p>
                        <p className="font-bold text-stone-900">${order.totalAmount.toFixed(2)}</p>
                    </div>
                    <div className="hidden sm:block">
                        <p className="text-stone-400 uppercase font-medium mb-1">ID</p>
                        <p className="font-mono text-stone-600">{order.id}</p>
                    </div>
                </div>
                <div className="flex items-center gap-2 font-semibold text-stone-600">
                    <span>{order.status == 'PENDING' ? 'ON CARGO' : order.status}</span>
                    {isOpen ? <FaChevronUp /> : <FaChevronDown />}
                </div>
            </div>

            {isOpen && (
                <div className="divide-y divide-stone-100 border-t border-stone-200 bg-white">
                    {order.items.map((item: any) => (
                        <div key={item.id} className="p-4 flex items-center justify-between gap-4 text-sm">
                            <div className="flex gap-4 items-center">
                                <div className="relative w-12 h-12 bg-stone-100 rounded border flex-shrink-0 overflow-hidden">
                                    <Image width={50} height={50} placeholder="blur" blurDataURL={`data:image/svg+xml;base64,${toBase64(shimmer(70, 70))}`} src={item.product.imageUrl} alt={item.product.name} fill className="object-cover" unoptimized />
                                </div>
                                <div>
                                    <h4 className="font-semibold text-stone-900">{item.product.name}</h4>
                                    <p className="text-xs text-stone-400">Qty: {item.quantity}</p>
                                </div>
                            </div>
                            <p className="font-semibold text-stone-900">${(Number(item.price) * item.quantity).toFixed(2)}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

const OrdersPage = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const res = await axios.get('/api/my-orders');

                console.log(res)
                // Path maps directly to your payload: res.data (Axios wrapper) -> .data (Your utility wrapper) -> .data (The array)
                setOrders(res.data?.data || []);
            } catch (err: any) {
                console.error("Error fetching orders:", err);
                setError(err.response?.data?.message || "Failed to load orders.");
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    if (loading) {
        return (
            <div className="max-w-5xl mx-auto mt-20 px-4 text-center text-stone-600">
                <span className="text-sm font-medium animate-pulse">Loading your orders...</span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-5xl mx-auto mt-20 px-4">
                <div className="bg-rose-50 border border-rose-200 text-rose-700 p-4 rounded-md text-sm">
                    {error}
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto mt-16 px-10 pb-20 bg-white shadow-xl lg:min-h-[70vh] rounded-xl border border-stone-200 pt-10 relative">
            <h1 className="text-xl font-bold text-stone-900 mb-6">My Orders</h1>
            <div className='overflow-y-auto'>
                {orders.map((order) => <OrderRow key={order.id} order={order} />)}
            </div>
            <Link className='inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-400 transition-all text-white px-4 py-2 rounded-xl absolute bottom-4 right-4' href={'/'}>Back to Shopping <FaShoppingBasket /></Link>
        </div>
    );
};

export default OrdersPage;