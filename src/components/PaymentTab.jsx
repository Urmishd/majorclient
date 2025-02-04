import React, { useState } from 'react';
import { CreditCard, Wallet, BanknoteIcon } from 'lucide-react';

const PaymentTab = ({ addPaymentNotification }) => {
    const [selectedMethod, setSelectedMethod] = useState('');
    const handlePayment = (method) => {
        let cart, address;

        
        try {
            cart = JSON.parse(localStorage.getItem('cart') || '[]');
            address = JSON.parse(localStorage.getItem('selectedAddress') || '{}');
        } catch {
            alert('Error loading cart data');
            return;
        }

        // Basic validations
        if (!cart.length) {
            alert('Your cart is empty!');
            return;
        }

        if (!address || !Object.keys(address).length) {
            alert('Please select a delivery address!');
            return;
        }

        
        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

      
        alert(`Order placed successfully with ${method}!`);

       
        if (addPaymentNotification) {
            const newNotification = {
                message: 'Your order is confirmed!',
                amount:total.toFixed(2),
                timestamp: new Date().toLocaleTimeString(),
            };
            addPaymentNotification(newNotification);
            console.log('Updated Notifications:', notifications);  
        }

        // Clear data after successful payment
        localStorage.removeItem('cart');
        localStorage.removeItem('selectedAddress');
        setSelectedMethod('');
    };


    return (
        <div className="p-4">
            <h2 className="text-xl font-bold mb-4">Payment Method</h2>
            <div className="space-y-3">
                <button
                    onClick={() => setSelectedMethod('Credit Card')}
                    className={`w-full p-4 border rounded-lg ${selectedMethod === 'Credit Card' ? 'border-blue-500 bg-blue-50' : 'hover:border-blue-500 hover:bg-blue-50'} flex items-center transition-all`}
                >
                    <CreditCard className="h-6 w-6 mr-3" />
                    Pay with Card
                </button>
                <button
                    onClick={() => setSelectedMethod('UPI')}
                    className={`w-full p-4 border rounded-lg ${selectedMethod === 'UPI' ? 'border-blue-500 bg-blue-50' : 'hover:border-blue-500 hover:bg-blue-50'} flex items-center transition-all`}
                >
                    <Wallet className="h-6 w-6 mr-3" />
                    Pay with UPI
                </button>
                <button
                    onClick={() => setSelectedMethod('Cash on Delivery')}
                    className={`w-full p-4 border rounded-lg ${selectedMethod === 'Cash on Delivery' ? 'border-blue-500 bg-blue-50' : 'hover:border-blue-500 hover:bg-blue-50'} flex items-center transition-all`}
                >
                    <BanknoteIcon className="h-6 w-6 mr-3" />
                    Cash on Delivery
                </button>
            </div>
            <button
                onClick={() => handlePayment(selectedMethod)}
                disabled={!selectedMethod}
                className="w-full mt-6 py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed font-medium transition-colors"
            >
                {selectedMethod ? `Confirm Payment with ${selectedMethod}` : 'Select a Payment Method'}
            </button>
        </div>
    );
};

export default PaymentTab;
