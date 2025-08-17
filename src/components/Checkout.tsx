'use client';

import { useState } from 'react';
import { Address, Order } from '@/types/ecommerce';
import { getCart, getCartTotal, createOrder } from '@/utils/ecommerce-api';

interface CheckoutProps {
  isOpen: boolean;
  onClose: () => void;
  onOrderComplete: (order: Order) => void;
}

export default function Checkout({ isOpen, onClose, onOrderComplete }: CheckoutProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [shippingAddress, setShippingAddress] = useState<Address>({
    id: '',
    name: '',
    street: '',
    city: '',
    county: '',
    postalCode: '',
    phone: '',
    isDefault: false
  });
  const [paymentMethod, setPaymentMethod] = useState('mpesa');

  const cartItems = getCart();
  const total = getCartTotal();

  const formatPrice = (price: number) => {
    return `KES ${price.toLocaleString()}`;
  };

  const handleAddressChange = (field: keyof Address, value: string) => {
    setShippingAddress(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateAddress = () => {
    return shippingAddress.name &&
           shippingAddress.street &&
           shippingAddress.city &&
           shippingAddress.county &&
           shippingAddress.phone;
  };

  const handlePlaceOrder = async () => {
    if (!validateAddress()) {
      alert('Please fill in all required address fields');
      return;
    }

    setLoading(true);
    try {
      const order = await createOrder(shippingAddress, paymentMethod);
      onOrderComplete(order);
    } catch (error) {
      console.error('Error placing order:', error);
      alert('Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
      />
      
      {/* Checkout Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] 
                      overflow-hidden flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              Checkout
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200
                       p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <i className="fas fa-times"></i>
            </button>
          </div>
          
          {/* Progress Steps */}
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-center space-x-8">
              <div className={`flex items-center ${currentStep >= 1 ? 'text-blue-600' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 
                  ${currentStep >= 1 ? 'border-blue-600 bg-blue-600 text-white' : 'border-gray-300'}`}>
                  1
                </div>
                <span className="ml-2 font-medium">Review Order</span>
              </div>
              
              <div className={`w-12 h-px ${currentStep >= 2 ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
              
              <div className={`flex items-center ${currentStep >= 2 ? 'text-blue-600' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 
                  ${currentStep >= 2 ? 'border-blue-600 bg-blue-600 text-white' : 'border-gray-300'}`}>
                  2
                </div>
                <span className="ml-2 font-medium">Shipping</span>
              </div>
              
              <div className={`w-12 h-px ${currentStep >= 3 ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
              
              <div className={`flex items-center ${currentStep >= 3 ? 'text-blue-600' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 
                  ${currentStep >= 3 ? 'border-blue-600 bg-blue-600 text-white' : 'border-gray-300'}`}>
                  3
                </div>
                <span className="ml-2 font-medium">Payment</span>
              </div>
            </div>
          </div>
          
          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {currentStep === 1 && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  Order Summary
                </h3>
                
                {/* Order Items */}
                <div className="space-y-4">
                  {cartItems.map((item) => (
                    <div key={item.product.id} className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div className="w-16 h-16 bg-gradient-to-br from-green-50 to-green-100 
                                    dark:from-green-900 dark:to-green-800 rounded-lg 
                                    flex items-center justify-center text-2xl">
                        {item.product.images[0]}
                      </div>
                      
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                          {item.product.name}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          From {item.product.sellerName} • {item.product.sellerLocation}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Quantity: {item.quantity} × {formatPrice(item.product.price)}
                        </p>
                      </div>
                      
                      <div className="text-right">
                        <p className="font-semibold text-gray-900 dark:text-gray-100">
                          {formatPrice(item.product.price * item.quantity)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Order Total */}
                <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                  <div className="flex justify-between text-lg font-bold text-gray-900 dark:text-gray-100">
                    <span>Total</span>
                    <span>{formatPrice(total)}</span>
                  </div>
                </div>
              </div>
            )}
            
            {currentStep === 2 && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  Shipping Address
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      value={shippingAddress.name}
                      onChange={(e) => handleAddressChange('name', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                               bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100
                               focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter your full name"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      value={shippingAddress.phone}
                      onChange={(e) => handleAddressChange('phone', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                               bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100
                               focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="+254..."
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Street Address *
                    </label>
                    <input
                      type="text"
                      value={shippingAddress.street}
                      onChange={(e) => handleAddressChange('street', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                               bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100
                               focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter street address"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      City *
                    </label>
                    <input
                      type="text"
                      value={shippingAddress.city}
                      onChange={(e) => handleAddressChange('city', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                               bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100
                               focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter city"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      County *
                    </label>
                    <select
                      value={shippingAddress.county}
                      onChange={(e) => handleAddressChange('county', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                               bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100
                               focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select County</option>
                      <option value="Nairobi">Nairobi</option>
                      <option value="Kiambu">Kiambu</option>
                      <option value="Nakuru">Nakuru</option>
                      <option value="Kisumu">Kisumu</option>
                      <option value="Mombasa">Mombasa</option>
                      <option value="Machakos">Machakos</option>
                      <option value="Kajiado">Kajiado</option>
                      <option value="Murang'a">Murang&apos;a</option>
                      <option value="Nyeri">Nyeri</option>
                      <option value="Kericho">Kericho</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Postal Code
                    </label>
                    <input
                      type="text"
                      value={shippingAddress.postalCode}
                      onChange={(e) => handleAddressChange('postalCode', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                               bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100
                               focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="00100"
                    />
                  </div>
                </div>
              </div>
            )}
            
            {currentStep === 3 && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  Payment Method
                </h3>
                
                <div className="space-y-3">
                  <label className="flex items-center p-4 border border-gray-300 dark:border-gray-600 rounded-lg 
                                  cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700">
                    <input
                      type="radio"
                      name="payment"
                      value="mpesa"
                      checked={paymentMethod === 'mpesa'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="mr-3"
                    />
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-green-600 rounded flex items-center justify-center text-white font-bold text-sm">
                        M
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-gray-100">M-Pesa</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Pay with M-Pesa mobile money</p>
                      </div>
                    </div>
                  </label>
                  
                  <label className="flex items-center p-4 border border-gray-300 dark:border-gray-600 rounded-lg 
                                  cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700">
                    <input
                      type="radio"
                      name="payment"
                      value="cod"
                      checked={paymentMethod === 'cod'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="mr-3"
                    />
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center text-white">
                        <i className="fas fa-money-bill-wave text-sm"></i>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-gray-100">Cash on Delivery</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Pay when you receive your order</p>
                      </div>
                    </div>
                  </label>
                </div>
                
                {/* Final Order Summary */}
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">Order Summary</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
                      <span className="text-gray-900 dark:text-gray-100">{formatPrice(total)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Delivery</span>
                      <span className="text-green-600">FREE</span>
                    </div>
                    <div className="border-t border-gray-200 dark:border-gray-600 pt-2">
                      <div className="flex justify-between font-semibold text-lg">
                        <span className="text-gray-900 dark:text-gray-100">Total</span>
                        <span className="text-gray-900 dark:text-gray-100">{formatPrice(total)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Footer */}
          <div className="border-t border-gray-200 dark:border-gray-700 p-6 flex justify-between">
            <button
              onClick={currentStep === 1 ? onClose : () => setCurrentStep(currentStep - 1)}
              className="px-6 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200
                       border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              {currentStep === 1 ? 'Cancel' : 'Back'}
            </button>
            
            {currentStep < 3 ? (
              <button
                onClick={() => setCurrentStep(currentStep + 1)}
                disabled={currentStep === 2 && !validateAddress()}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg
                         disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                Continue
              </button>
            ) : (
              <button
                onClick={handlePlaceOrder}
                disabled={loading}
                className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg
                         disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <i className="fas fa-spinner fa-spin"></i>
                    Processing...
                  </>
                ) : (
                  <>
                    <i className="fas fa-credit-card"></i>
                    Place Order
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
