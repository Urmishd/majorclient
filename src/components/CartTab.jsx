import React, { useState } from 'react';
import { Minus, Plus, Clock } from 'lucide-react';

const CartTab = ({ onNext }) => {
    const [cartItems, setCartItems] = useState(() => {
        const storedCart = localStorage.getItem('cart');
        return storedCart ? JSON.parse(storedCart) : [];
    });

    const updateQuantity = (id, newQuantity) => {
        if (newQuantity < 1) return;
        setCartItems(items =>
            items.map(item =>
                item.id === id ? { ...item, quantity: newQuantity } : item
            )
        );
    };

    const updateEMI = (id, emiHours) => {
        setCartItems(items =>
            items.map(item =>
                item.id === id ? { ...item, emiHours } : item
            )
        );
    };

    const removeItem = (id) => {
        setCartItems(items => items.filter(item => item.id !== id));
    };

    const total = cartItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );

    return (
        <div className="p-4">
            <h2 className="text-xl font-bold mb-4">Your Cart</h2>
            <div className="space-y-4">
                {cartItems.map(item => (
                    <div key={item.id} className="flex items-center p-4 border rounded-lg">
                        <img 
                            src={item.image} 
                            alt={item.name} 
                            className="w-20 h-20 object-cover rounded"
                        />
                        <div className="ml-4 flex-1">
                            <h3 className="font-medium">{item.name}</h3>
                            <p className="text-gray-600">${item.price}</p>
                            <div className="flex items-center mt-2">
                                <button
                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                    className="p-1 rounded-full hover:bg-gray-100"
                                >
                                    <Minus className="h-4 w-4" />
                                </button>
                                <span className="mx-2">{item.quantity}</span>
                                <button
                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                    className="p-1 rounded-full hover:bg-gray-100"
                                >
                                    <Plus className="h-4 w-4" />
                                </button>
                            </div>
                            <div className="mt-2 flex items-center">
                                <Clock className="h-4 w-4 mr-2" />
                                <select
                                    value={item.emiHours || '12'}
                                    onChange={(e) => updateEMI(item.id, e.target.value)}
                                    className="border rounded p-1"
                                >
                                    <option value="12">12 Hours</option>
                                    <option value="24">24 Hours</option>
                                    <option value="48">48 Hours</option>
                                    <option value="72">72 Hours</option>
                                </select>
                            </div>
                        </div>
                        <button
                            onClick={() => removeItem(item.id)}
                            className="text-red-500 hover:text-red-700"
                        >
                            Remove
                        </button>
                    </div>
                ))}
            </div>
            <div className="mt-6">
                <div className="flex justify-between text-lg font-bold">
                    <span>Total:</span>
                    <span>${total.toFixed(2)}</span>
                </div>
                <button
                    onClick={() => {
                        localStorage.setItem('cart', JSON.stringify(cartItems));
                        onNext();
                    }}
                    className="w-full mt-4 px-6 py-3 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-lg"
                >
                    Continue to Address
                </button>
            </div>
        </div>
    );
};

export default CartTab;