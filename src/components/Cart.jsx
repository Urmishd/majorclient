import React, { useState, useEffect } from 'react';
import { X, Minus, Plus, ShoppingBag, ArrowRight } from 'lucide-react';
// import Payment from './Payment';
import { useNavigate } from 'react-router-dom';
import CheckoutContainer from './CheckoutContainer';

const CartItem = ({ item, onUpdateQuantity, onRemove }) => {
    return (
        <div className="flex items-center py-4 border-b border-gray-200">
            <div className="h-20 w-20 flex-shrink-0 rounded-lg bg-gray-100 flex items-center justify-center">
                <img
                    src={item.image}
                    alt={item.name}
                    className="h-full w-full object-cover rounded-lg"
                />
            </div>
            <div className="ml-4 flex-1">
                <h3 className="text-sm font-medium text-gray-900">{item.name}</h3>
                <p className="text-sm text-gray-500">${item.price}</p>
                <div className="flex items-center mt-2">
                    <button
                        onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                        className="p-1 rounded-full hover:bg-gray-100 disabled:opacity-50"
                    >
                        <Minus className="h-4 w-4" />
                    </button>
                    <span className="mx-2 w-8 text-center">{item.quantity}</span>
                    <button
                        onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                        className="p-1 rounded-full hover:bg-gray-100"
                    >
                        <Plus className="h-4 w-4" />
                    </button>
                </div>
            </div>
            <div className="ml-4">
                <p className="text-sm font-medium text-gray-900">
                    ${(item.price * item.quantity).toFixed(2)}
                </p>
                <button
                    onClick={() => onRemove(item.id)}
                    className="mt-1 text-sm text-red-600 hover:text-red-500"
                >
                    Remove
                </button>
            </div>
        </div>
    );
};


const Cart = ({ isOpen, onClose }) => {
    const [cartItems, setCartItems] = useState(() => {
        const storedCart = localStorage.getItem('cart');
        return storedCart ? JSON.parse(storedCart) : [];
    });
    const [isCheckout, setIsCheckout] = useState(false); 
    const navigate = useNavigate();
    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cartItems));
    }, [cartItems]);

    const updateQuantity = (id, newQuantity) => {
        if (newQuantity < 1) return;
        setCartItems(items =>
            items.map(item =>
                item.id === id ? { ...item, quantity: newQuantity } : item
            )
        );
    };

    const removeItem = (id) => {
        setCartItems(items => {
            const updatedCart = items.filter(item => item.id !== id);
            localStorage.setItem('cart', JSON.stringify(updatedCart));
            return updatedCart;
        });
    };

    const addItem = (item) => {
        setCartItems((currentItems) => {
            const existingItemIndex = currentItems.findIndex((i) => i.id === item.id);
            if (existingItemIndex > -1) {
                const updatedItems = [...currentItems];
                updatedItems[existingItemIndex].quantity += item.quantity;
                localStorage.setItem('cart', JSON.stringify(updatedItems));
                return updatedItems;
            } else {
                const updatedItems = [...currentItems, item];
                localStorage.setItem('cart', JSON.stringify(updatedItems));
                return updatedItems;
            }
        });
    };

    const total = cartItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );

    const handleCheckout = () => {
        setIsCheckout(true); 
        navigate('/checkout');
        onClose();
    };

    return (
        <div
            className={`fixed inset-0 z-50 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
                }`}
        >
            <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose} />
            <div
                className={`absolute top-0 right-0 h-full w-full max-w-md bg-white shadow-xl transform transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'
                    }`}
            >
                <div className="flex flex-col h-full">
                    <div className="flex items-center justify-between p-4 border-b border-gray-200">
                        <h2 className="text-lg font-medium text-gray-900">Shopping Cart</h2>
                        <button
                            onClick={onClose}
                            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4">
                        {cartItems.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-full text-gray-500">
                                <ShoppingBag className="h-12 w-12 mb-4" />
                                <p>Your cart is empty</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {cartItems.map(item => (
                                    <CartItem
                                        key={item.id}
                                        item={item}
                                        onUpdateQuantity={updateQuantity}
                                        onRemove={removeItem}
                                    />
                                ))}
                            </div>
                        )}
                    </div>

                    {isCheckout ? (
                        <CheckoutContainer />
                    ) : (
                        <div className="p-4 border-t border-gray-200">
                            <div className="flex justify-between mb-4">
                                <span className="text-base font-medium text-gray-900">Total</span>
                                <span className="text-base font-medium text-gray-900">
                                    ${total.toFixed(2)}
                                </span>
                            </div>
                            <button
                                className="w-full px-6 py-3 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-lg transition-all duration-200 flex items-center justify-center"
                                onClick={handleCheckout}
                            >
                                Checkout
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Cart;
