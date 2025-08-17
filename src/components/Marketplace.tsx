'use client';

import { useState, useEffect } from 'react';
import { User, CartItem, Order } from '@/types/ecommerce';
import { getCurrentUser, loginUser, logoutUser, getCart } from '@/utils/ecommerce-api';
import ProductCatalog from './ProductCatalog';
import ShoppingCart from './ShoppingCart';
import Checkout from './Checkout';
import SellerDashboard from './SellerDashboard';

interface MarketplaceProps {
  initialView?: 'catalog' | 'seller-dashboard';
}

export default function Marketplace({ initialView = 'catalog' }: MarketplaceProps) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState<'catalog' | 'seller-dashboard' | 'orders'>(initialView);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isOrderComplete, setIsOrderComplete] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    setLoading(true);
    try {
      const user = await getCurrentUser();
      setCurrentUser(user);
      if (user) {
        setCartItems(getCart());
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (email: string, role: 'farmer' | 'customer') => {
    try {
      const user = await loginUser(email, role);
      if (user) {
        setCurrentUser(user);
        setCartItems(getCart());
        // Switch to appropriate view based on role
        if (role === 'farmer') {
          setCurrentView('seller-dashboard');
        } else {
          setCurrentView('catalog');
        }
      } else {
        alert('Login failed. User not found.');
      }
    } catch (error) {
      console.error('Error logging in:', error);
      alert('Login failed. Please try again.');
    }
  };

  const handleLogout = () => {
    logoutUser();
    setCurrentUser(null);
    setCartItems([]);
    setCurrentView('catalog');
    setIsCartOpen(false);
    setIsCheckoutOpen(false);
  };

  const handleCartUpdate = (newCart: CartItem[]) => {
    setCartItems(newCart);
  };

  const handleCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const handleOrderComplete = (order: Order) => {
    setCompletedOrder(order);
    setIsCheckoutOpen(false);
    setIsOrderComplete(true);
    setCartItems([]);
    
    // Auto-close success message after 5 seconds
    setTimeout(() => {
      setIsOrderComplete(false);
      setCompletedOrder(null);
    }, 5000);
  };

  const cartItemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <i className="fas fa-spinner fa-spin text-3xl text-blue-600 mb-4"></i>
          <p className="text-gray-600 dark:text-gray-400">Loading marketplace...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with User Controls */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          {/* Title and Description */}
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              Agricultural Marketplace
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Connect farmers with customers for fresh, quality produce
            </p>
          </div>

          {/* User Controls */}
          <div className="flex items-center gap-4">
            {currentUser ? (
              <>
                {/* User Info */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                    {currentUser.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="hidden lg:block">
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {currentUser.name}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400 capitalize">
                      {currentUser.role} • {currentUser.location}
                    </p>
                  </div>
                </div>

                {/* Navigation */}
                <div className="flex items-center gap-2">
                  {currentUser.role === 'farmer' ? (
                    <>
                      <button
                        onClick={() => setCurrentView('catalog')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors
                          ${currentView === 'catalog'
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                          }`}
                      >
                        <i className="fas fa-store mr-2"></i>
                        Shop
                      </button>
                      <button
                        onClick={() => setCurrentView('seller-dashboard')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors
                          ${currentView === 'seller-dashboard'
                            ? 'bg-green-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                          }`}
                      >
                        <i className="fas fa-seedling mr-2"></i>
                        My Farm
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => setCurrentView('orders')}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors
                        ${currentView === 'orders'
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                        }`}
                    >
                      <i className="fas fa-receipt mr-2"></i>
                      My Orders
                    </button>
                  )}

                  {/* Cart Button (only for customers) */}
                  {currentUser.role === 'customer' && (
                    <button
                      onClick={() => setIsCartOpen(true)}
                      className="relative px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg
                               transition-colors"
                    >
                      <i className="fas fa-shopping-cart mr-2"></i>
                      Cart
                      {cartItemCount > 0 && (
                        <span className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white text-xs 
                                       rounded-full flex items-center justify-center">
                          {cartItemCount}
                        </span>
                      )}
                    </button>
                  )}

                  {/* Logout */}
                  <button
                    onClick={handleLogout}
                    className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400
                             border border-gray-300 dark:border-gray-600 rounded-lg hover:border-red-300"
                  >
                    <i className="fas fa-sign-out-alt"></i>
                  </button>
                </div>
              </>
            ) : (
              /* Login Options */
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-600 dark:text-gray-400">Login as:</span>
                <button
                  onClick={() => handleLogin('david@example.com', 'customer')}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm"
                >
                  <i className="fas fa-user mr-2"></i>
                  Customer
                </button>
                <button
                  onClick={() => handleLogin('mary@kericho-farm.com', 'farmer')}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm"
                >
                  <i className="fas fa-seedling mr-2"></i>
                  Farmer
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Success Message */}
      {isOrderComplete && completedOrder && (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 
                      rounded-lg p-6 relative">
          <button
            onClick={() => setIsOrderComplete(false)}
            className="absolute top-4 right-4 text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-200"
          >
            <i className="fas fa-times"></i>
          </button>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center text-white text-xl">
              <i className="fas fa-check"></i>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-green-900 dark:text-green-100">
                Order Placed Successfully!
              </h3>
              <p className="text-green-700 dark:text-green-300">
                Order #{completedOrder.id.slice(-8)} has been placed. 
                Estimated delivery: {new Date(completedOrder.estimatedDelivery || '').toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      {!currentUser ? (
        /* Welcome/Login Screen */
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-12 text-center">
          <div className="text-6xl mb-6">🌾</div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Welcome to the Agricultural Marketplace
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
            Connect with local farmers to buy fresh produce directly from the source, 
            or join as a farmer to sell your quality agricultural products to customers in your area.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="p-6 border border-gray-200 dark:border-gray-700 rounded-lg">
              <div className="text-4xl mb-4">🛒</div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                Shop Fresh Produce
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Browse products from local farmers, add items to your cart, and get fresh produce delivered to your door.
              </p>
              <button
                onClick={() => handleLogin('david@example.com', 'customer')}
                className="btn btn-primary px-6 py-3"
              >
                Start Shopping
              </button>
            </div>
            
            <div className="p-6 border border-gray-200 dark:border-gray-700 rounded-lg">
              <div className="text-4xl mb-4">👨‍🌾</div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                Sell Your Products
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                List your agricultural products, manage inventory, track orders, and grow your farming business.
              </p>
              <button
                onClick={() => handleLogin('mary@kericho-farm.com', 'farmer')}
                className="btn btn-secondary px-6 py-3"
              >
                Start Selling
              </button>
            </div>
          </div>
        </div>
      ) : currentView === 'catalog' ? (
        <ProductCatalog onAddToCart={handleCartUpdate} />
      ) : currentView === 'seller-dashboard' ? (
        <SellerDashboard />
      ) : (
        /* Orders View (placeholder) */
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-8 text-center">
          <div className="text-6xl mb-4">📋</div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
            Order History
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Order history functionality coming soon. You can track your orders and view past purchases here.
          </p>
        </div>
      )}

      {/* Shopping Cart Sidebar */}
      <ShoppingCart
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onCheckout={handleCheckout}
        onCartUpdate={handleCartUpdate}
      />

      {/* Checkout Modal */}
      <Checkout
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        onOrderComplete={handleOrderComplete}
      />
    </div>
  );
}
