import React, { useState } from 'react';
import { MapPin } from 'lucide-react';

const AddressTab = ({ onNext }) => {
    const [addresses, setAddresses] = useState(() => {
        const saved = localStorage.getItem('addresses');
        return saved ? JSON.parse(saved) : [];
    });

    const [showAddForm, setShowAddForm] = useState(false);
    const [selectedAddress, setSelectedAddress] = useState(
        JSON.parse(localStorage.getItem('selectedAddress') || 'null')
    );
    const [newAddress, setNewAddress] = useState({
        fullName: '',
        fullAddress: '',
        city: '',
        state: '',
        zip: '',
        phone: ''
    });

    const handleAddressSubmit = (e) => {
        e.preventDefault();
        const updatedAddresses = [...addresses, { ...newAddress, id: Date.now() }];
        setAddresses(updatedAddresses);
        localStorage.setItem('addresses', JSON.stringify(updatedAddresses));
    
        // Save the new address as the selected one
        const selectedAddress = { ...newAddress, id: Date.now() };
        localStorage.setItem('selectedAddress', JSON.stringify(selectedAddress));
    
        console.log('Selected Address Saved:', selectedAddress);  // Debugging line
        setShowAddForm(false);
        setSelectedAddress(selectedAddress);
    };

    const handleAddressChange = (address) => {
        setSelectedAddress(address); // Select the clicked address
        localStorage.setItem('selectedAddress', JSON.stringify(address)); // Store in localStorage
    };

    return (
        <div className="p-4 max-w-2xl mx-auto">
            <h2 className="text-xl font-bold mb-6">Select Delivery Address</h2>
            
            {/* Saved Addresses */}
            <div className="space-y-4 mb-6">
                {addresses.map((address) => (
                    <div
                        key={address.id}
                        className="p-4 border rounded-lg cursor-pointer"
                    >
                        <label className="flex items-center">
                            <input
                                type="radio"
                                name="selectedAddress"
                                value={address.id}
                                checked={selectedAddress?.id === address.id}
                                onChange={() => handleAddressChange(address)} // Handle radio button change
                                className="mr-3 h-5 w-5"
                            />
                            <div>
                                <div className="flex items-center">
                                    <MapPin className="h-5 w-5 mr-2" />
                                    <p className="font-medium">{address.fullName}</p>
                                </div>
                                <p>{address.fullAddress}</p>
                                <p>{address.city}, {address.state} {address.zip}</p>
                                <p>{address.phone}</p>
                            </div>
                        </label>
                    </div>
                ))}
            </div>

            <button
                onClick={() => setShowAddForm(true)}
                className="w-full px-4 py-2 border rounded-lg text-blue-600 hover:bg-blue-50"
            >
                + Add New Address
            </button>

            {showAddForm && (
                <form onSubmit={handleAddressSubmit} className="mt-6 space-y-4">
                    <input
                        type="text"
                        placeholder="Full Name"
                        value={newAddress.fullName}
                        onChange={(e) => setNewAddress({...newAddress, fullName: e.target.value})}
                        className="w-full p-2 border rounded-lg"
                        required
                    />
                    <textarea
                        placeholder="Full Address"
                        value={newAddress.fullAddress}
                        onChange={(e) => setNewAddress({...newAddress, fullAddress: e.target.value})}
                        className="w-full p-2 border rounded-lg"
                        required
                    />
                    <div className="grid grid-cols-2 gap-4">
                        <input
                            type="text"
                            placeholder="City"
                            value={newAddress.city}
                            onChange={(e) => setNewAddress({...newAddress, city: e.target.value})}
                            className="w-full p-2 border rounded-lg"
                            required
                        />
                        <input
                            type="text"
                            placeholder="State"
                            value={newAddress.state}
                            onChange={(e) => setNewAddress({...newAddress, state: e.target.value})}
                            className="w-full p-2 border rounded-lg"
                            required
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <input
                            type="text"
                            placeholder="ZIP Code"
                            value={newAddress.zip}
                            onChange={(e) => setNewAddress({...newAddress, zip: e.target.value})}
                            className="w-full p-2 border rounded-lg"
                            required
                        />
                        <input
                            type="tel"
                            placeholder="Phone Number"
                            value={newAddress.phone}
                            onChange={(e) => setNewAddress({...newAddress, phone: e.target.value})}
                            className="w-full p-2 border rounded-lg"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full px-6 py-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
                    >
                        Save Address
                    </button>
                </form>
            )}

            <button
                onClick={onNext}
                disabled={!selectedAddress}
                className="w-full mt-6 px-6 py-3 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-lg disabled:opacity-50"
            >
                Continue to Payment
            </button>
        </div>
    );
};

export default AddressTab;
