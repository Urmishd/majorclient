import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CartTab from './CartTab';
import AddressTab from './AddressTab';
import PaymentTab from './PaymentTab';

const CheckoutContainer = () => {
    const [activeTab, setActiveTab] = useState('cart');
    const navigate = useNavigate();

    const handleNext = (nextTab) => {
        if (nextTab === 'payment') {
            setActiveTab('payment');  // Move to the payment tab
        } else {
            setActiveTab(nextTab);
        }
    };

    return (
        <div className="max-w-3xl mx-auto p-4">
            {activeTab === 'cart' && (
                <CartTab onNext={() => handleNext('address')} />
            )}
            {activeTab === 'address' && (
                <AddressTab onNext={() => handleNext('payment')} />
            )}
            {activeTab === 'payment' && (
                <PaymentTab />
            )}
        </div>
    );
};

export default CheckoutContainer;
