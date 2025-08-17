'use client';

import { useState, useEffect } from 'react';
import { CartItem } from '@/types/ecommerce';
import { getCart, updateCartItem, removeFromCart, getCartTotal } from '@/utils/ecommerce-api';

interface ShoppingCartProps {
  isOpen: boolean;
  onClose: () => void;
  onCheckout: () => void;
  onCartUpdate?: (cart: CartItem[]) => void;
}

export default function ShoppingCart({ isOpen, onClose, onCheckout, onCartUpdate }: ShoppingCartProps) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isUpdating, setIsUpdating] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setCartItems(getCart());
    }
  }, [isOpen]);

  const handleUpdateQuantity = async (productId: string, newQuantity: number) => {
    setIsUpdating(productId);
    try {
      const updatedCart = updateCartItem(productId, newQuantity);
      setCartItems(updatedCart);
      if (onCartUpdate) {
        onCartUpdate(updatedCart);
      }
    } catch (error) {
      console.error('Error updating cart:', error);
    } finally {
      setIsUpdating(null);
    }
  };

  const handleRemoveItem = async (productId: string) => {
    setIsUpdating(productId);
    try {
      const updatedCart = removeFromCart(productId);
      setCartItems(updatedCart);
      if (onCartUpdate) {
        onCartUpdate(updatedCart);
      }
    } catch (error) {
      console.error('Error removing item:', error);
    } finally {
      setIsUpdating(null);
    }
  };

  const formatPrice = (price: number) => {
    return `KES ${price.toLocaleString()}`;
  };

  const total = getCartTotal();
  const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
      />
      
      {/* Cart Sidebar */}
      <div className="fixed right-0 top-0 h-full w-96 bg-white dark:bg-gray-800 shadow-xl z-50 
                    transform transition-transform duration-300 ease-in-out flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
            Shopping Cart
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200
                     p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <i className="fas fa-times"></i>
          </button>
        </div>
        
        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-6">
          {cartItems.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🛒</div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                Your cart is empty
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Add some fresh products from local farmers
              </p>
              <button
                onClick={onClose}
                className="btn btn-primary px-6 py-2"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div
                  key={item.product.id}
                  className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4"
                >
                  <div className="flex items-start gap-4">
                    {/* Product Image */}
                    <div className="w-16 h-16 bg-gradient-to-br from-green-50 to-green-100 
                                  dark:from-green-900 dark:to-green-800 rounded-lg 
                                  flex items-center justify-center text-2xl flex-shrink-0">
                      {item.product.images[0]}
                    </div>
                    
                    {/* Product Details */}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-900 dark:text-gray-100 truncate">
                        {item.product.name}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {item.product.sellerName}
                      </p>
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100 mt-1">
                        {formatPrice(item.product.price)} {item.product.unit}
                      </p>
                      
                      {/* Quantity Controls */}
                      <div className="flex items-center gap-3 mt-3">
                        <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-lg">
                          <button
                            onClick={() => handleUpdateQuantity(item.product.id, item.quantity - 1)}
                            disabled={isUpdating === item.product.id || item.quantity <= 1}
                            className="w-8 h-8 flex items-center justify-center text-gray-600 dark:text-gray-400
                                     hover:text-gray-800 dark:hover:text-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <i className="fas fa-minus text-xs"></i>
                          </button>
                          
                          <span className="w-12 text-center text-sm font-medium text-gray-900 dark:text-gray-100">
                            {isUpdating === item.product.id ? (
                              <i className="fas fa-spinner fa-spin text-xs"></i>
                            ) : (
                              item.quantity
                            )}
                          </span>
                          
                          <button
                            onClick={() => handleUpdateQuantity(item.product.id, item.quantity + 1)}
                            disabled={isUpdating === item.product.id || item.quantity >= item.product.stock}
                            className="w-8 h-8 flex items-center justify-center text-gray-600 dark:text-gray-400
                                     hover:text-gray-800 dark:hover:text-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <i className="fas fa-plus text-xs"></i>
                          </button>
                        </div>
                        
                        <button
                          onClick={() => handleRemoveItem(item.product.id)}
                          disabled={isUpdating === item.product.id}
                          className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300
                                   disabled:opacity-50 disabled:cursor-not-allowed p-1"
                          title="Remove item"
                        >
                          <i className="fas fa-trash text-sm"></i>
                        </button>
                      </div>
                      
                      {/* Item Total */}
                      <p className="text-right text-lg font-bold text-gray-900 dark:text-gray-100 mt-2">
                        {formatPrice(item.product.price * item.quantity)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Footer with Total and Checkout */}
        {cartItems.length > 0 && (
          <div className="border-t border-gray-200 dark:border-gray-700 p-6 space-y-4">
            {/* Order Summary */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                <span>Items ({itemCount})</span>
                <span>{formatPrice(total)}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                <span>Delivery</span>
                <span className="text-green-600">FREE</span>
              </div>
              <div className="border-t border-gray-200 dark:border-gray-700 pt-2">
                <div className="flex justify-between text-lg font-bold text-gray-900 dark:text-gray-100">
                  <span>Total</span>
                  <span>{formatPrice(total)}</span>
                </div>
              </div>
            </div>
            
            {/* Checkout Button */}
            <button
              onClick={onCheckout}
              className="w-full btn btn-primary py-3 text-lg font-semibold"
            >
              Proceed to Checkout
              <i className="fas fa-arrow-right ml-2"></i>
            </button>
            
            {/* Continue Shopping */}
            <button
              onClick={onClose}
              className="w-full text-center text-sm text-gray-600 dark:text-gray-400 
                       hover:text-gray-800 dark:hover:text-gray-200 py-2"
            >
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </>
  );
}
