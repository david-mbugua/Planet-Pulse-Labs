'use client';

import { useState, useEffect } from 'react';
import { Product, Order, SellerStats, User, ProductCategory } from '@/types/ecommerce';
import { 
  getSellerProducts, 
  getSellerOrders, 
  getSellerStats, 
  addProduct, 
  updateProduct, 
  deleteProduct,
  updateOrderStatus,
  getCurrentUser
} from '@/utils/ecommerce-api';

export default function SellerDashboard() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'orders' | 'add-product'>('overview');
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState<SellerStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Add Product Form State
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: '',
    unit: 'per kg',
    category: 'vegetables' as ProductCategory,
    stock: '',
    isOrganic: false,
    harvestDate: '',
    expiryDate: '',
    tags: '',
    images: ['🥬'] // Default emoji
  });

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const user = await getCurrentUser();
      if (!user || user.role !== 'farmer') {
        return;
      }

      setCurrentUser(user);
      
      const [sellerProducts, sellerOrders, sellerStats] = await Promise.all([
        getSellerProducts(user.id),
        getSellerOrders(user.id),
        getSellerStats(user.id)
      ]);

      setProducts(sellerProducts);
      setOrders(sellerOrders);
      setStats(sellerStats);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    setActionLoading('add-product');
    try {
      const productData = {
        name: newProduct.name,
        description: newProduct.description,
        price: parseFloat(newProduct.price),
        unit: newProduct.unit,
        category: newProduct.category,
        sellerId: currentUser.id,
        sellerName: currentUser.name,
        sellerLocation: currentUser.location,
        images: newProduct.images,
        stock: parseInt(newProduct.stock),
        isOrganic: newProduct.isOrganic,
        harvestDate: newProduct.harvestDate,
        expiryDate: newProduct.expiryDate,
        tags: newProduct.tags.split(',').map(tag => tag.trim()).filter(Boolean),
        rating: 0,
        reviewCount: 0
      };

      await addProduct(productData);
      
      // Reset form
      setNewProduct({
        name: '',
        description: '',
        price: '',
        unit: 'per kg',
        category: 'vegetables',
        stock: '',
        isOrganic: false,
        harvestDate: '',
        expiryDate: '',
        tags: '',
        images: ['🥬']
      });

      // Refresh products
      const updatedProducts = await getSellerProducts(currentUser.id);
      setProducts(updatedProducts);
      
      setActiveTab('products');
    } catch (error) {
      console.error('Error adding product:', error);
      alert('Failed to add product. Please try again.');
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    setActionLoading(productId);
    try {
      await deleteProduct(productId);
      setProducts(products.filter(p => p.id !== productId));
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Failed to delete product. Please try again.');
    } finally {
      setActionLoading(null);
    }
  };

  const handleUpdateOrderStatus = async (orderId: string, newStatus: Order['status']) => {
    setActionLoading(orderId);
    try {
      await updateOrderStatus(orderId, newStatus);
      setOrders(orders.map(order => 
        order.id === orderId ? { ...order, status: newStatus } : order
      ));
    } catch (error) {
      console.error('Error updating order status:', error);
      alert('Failed to update order status. Please try again.');
    } finally {
      setActionLoading(null);
    }
  };

  const formatPrice = (price: number) => {
    return `KES ${price.toLocaleString()}`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'confirmed': return 'text-blue-600 bg-blue-100';
      case 'preparing': return 'text-purple-600 bg-purple-100';
      case 'shipped': return 'text-indigo-600 bg-indigo-100';
      case 'delivered': return 'text-green-600 bg-green-100';
      case 'cancelled': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <i className="fas fa-spinner fa-spin text-3xl text-blue-600 mb-4"></i>
          <p className="text-gray-600 dark:text-gray-400">Loading seller dashboard...</p>
        </div>
      </div>
    );
  }

  if (!currentUser || currentUser.role !== 'farmer') {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">👨‍🌾</div>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
          Seller Access Required
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          Please log in as a farmer to access the seller dashboard.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center text-white text-2xl">
            👨‍🌾
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {currentUser.farmName || 'Seller Dashboard'}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Welcome back, {currentUser.name} • {currentUser.location}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'overview', label: 'Overview', icon: 'fas fa-chart-pie' },
              { id: 'products', label: 'Products', icon: 'fas fa-boxes' },
              { id: 'orders', label: 'Orders', icon: 'fas fa-shopping-cart' },
              { id: 'add-product', label: 'Add Product', icon: 'fas fa-plus' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm
                  ${activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
              >
                <i className={tab.icon}></i>
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {/* Overview Tab */}
          {activeTab === 'overview' && stats && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Business Overview</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-600 dark:text-blue-400 text-sm font-medium">Total Products</p>
                      <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">{stats.totalProducts}</p>
                    </div>
                    <i className="fas fa-boxes text-blue-500 text-2xl"></i>
                  </div>
                </div>

                <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-green-600 dark:text-green-400 text-sm font-medium">Total Orders</p>
                      <p className="text-2xl font-bold text-green-900 dark:text-green-100">{stats.totalOrders}</p>
                    </div>
                    <i className="fas fa-shopping-cart text-green-500 text-2xl"></i>
                  </div>
                </div>

                <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-purple-600 dark:text-purple-400 text-sm font-medium">Total Revenue</p>
                      <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">
                        {formatPrice(stats.totalRevenue)}
                      </p>
                    </div>
                    <i className="fas fa-money-bill-wave text-purple-500 text-2xl"></i>
                  </div>
                </div>

                <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-yellow-600 dark:text-yellow-400 text-sm font-medium">Average Rating</p>
                      <p className="text-2xl font-bold text-yellow-900 dark:text-yellow-100">
                        {stats.averageRating.toFixed(1)} ⭐
                      </p>
                    </div>
                    <i className="fas fa-star text-yellow-500 text-2xl"></i>
                  </div>
                </div>
              </div>

              {/* Recent Orders */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Recent Orders</h3>
                <div className="space-y-3">
                  {orders.slice(0, 5).map((order) => (
                    <div key={order.id} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900 dark:text-gray-100">
                            Order #{order.id.slice(-8)}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {order.customerName} • {formatPrice(order.totalAmount)}
                          </p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Products Tab */}
          {activeTab === 'products' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">My Products</h2>
                <button
                  onClick={() => setActiveTab('add-product')}
                  className="btn btn-primary px-4 py-2"
                >
                  <i className="fas fa-plus mr-2"></i>
                  Add Product
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <div key={product.id} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-green-50 to-green-100 
                                    dark:from-green-900 dark:to-green-800 rounded-lg 
                                    flex items-center justify-center text-2xl">
                        {product.images[0]}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                          {product.name}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {formatPrice(product.price)} {product.unit}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Stock:</span>
                        <span className="text-gray-900 dark:text-gray-100">{product.stock}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Rating:</span>
                        <span className="text-gray-900 dark:text-gray-100">
                          {product.rating.toFixed(1)} ({product.reviewCount})
                        </span>
                      </div>
                    </div>

                    <div className="flex gap-2 mt-4">
                      <button className="flex-1 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 
                                       rounded hover:bg-gray-100 dark:hover:bg-gray-600">
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(product.id)}
                        disabled={actionLoading === product.id}
                        className="px-3 py-2 text-sm text-red-600 border border-red-300 rounded 
                                 hover:bg-red-50 dark:hover:bg-red-900/20 disabled:opacity-50"
                      >
                        {actionLoading === product.id ? (
                          <i className="fas fa-spinner fa-spin"></i>
                        ) : (
                          <i className="fas fa-trash"></i>
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Orders Tab */}
          {activeTab === 'orders' && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Order Management</h2>

              <div className="space-y-4">
                {orders.map((order) => (
                  <div key={order.id} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                          Order #{order.id.slice(-8)}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {order.customerName} • {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                        <select
                          value={order.status}
                          onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value as Order['status'])}
                          disabled={actionLoading === order.id}
                          className="text-sm border border-gray-300 dark:border-gray-600 rounded px-2 py-1
                                   bg-white dark:bg-gray-800 disabled:opacity-50"
                        >
                          <option value="pending">Pending</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="preparing">Preparing</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      {order.items.filter(item => item.sellerId === currentUser?.id).map((item) => (
                        <div key={item.productId} className="flex justify-between text-sm">
                          <span className="text-gray-600 dark:text-gray-400">
                            {item.productName} × {item.quantity}
                          </span>
                          <span className="text-gray-900 dark:text-gray-100">
                            {formatPrice(item.total)}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="border-t border-gray-200 dark:border-gray-600 pt-2 mt-3">
                      <div className="flex justify-between font-semibold">
                        <span className="text-gray-900 dark:text-gray-100">Total</span>
                        <span className="text-gray-900 dark:text-gray-100">
                          {formatPrice(order.items
                            .filter(item => item.sellerId === currentUser?.id)
                            .reduce((sum, item) => sum + item.total, 0)
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Add Product Tab */}
          {activeTab === 'add-product' && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Add New Product</h2>

              <form onSubmit={handleAddProduct} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Product Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={newProduct.name}
                      onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                               bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                      placeholder="e.g., Fresh Tomatoes"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Category *
                    </label>
                    <select
                      required
                      value={newProduct.category}
                      onChange={(e) => setNewProduct({...newProduct, category: e.target.value as ProductCategory})}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                               bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    >
                      <option value="vegetables">Vegetables</option>
                      <option value="fruits">Fruits</option>
                      <option value="grains">Grains</option>
                      <option value="herbs">Herbs</option>
                      <option value="dairy">Dairy</option>
                      <option value="meat">Meat</option>
                      <option value="nuts">Nuts</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Description *
                    </label>
                    <textarea
                      required
                      value={newProduct.description}
                      onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                               bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                      placeholder="Describe your product..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Price (KES) *
                    </label>
                    <input
                      type="number"
                      required
                      min="0"
                      step="0.01"
                      value={newProduct.price}
                      onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                               bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                      placeholder="100"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Unit *
                    </label>
                    <select
                      required
                      value={newProduct.unit}
                      onChange={(e) => setNewProduct({...newProduct, unit: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                               bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    >
                      <option value="per kg">per kg</option>
                      <option value="per piece">per piece</option>
                      <option value="per bunch">per bunch</option>
                      <option value="per dozen">per dozen</option>
                      <option value="per bag">per bag</option>
                      <option value="per liter">per liter</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Stock Quantity *
                    </label>
                    <input
                      type="number"
                      required
                      min="0"
                      value={newProduct.stock}
                      onChange={(e) => setNewProduct({...newProduct, stock: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                               bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                      placeholder="100"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Tags (comma-separated)
                    </label>
                    <input
                      type="text"
                      value={newProduct.tags}
                      onChange={(e) => setNewProduct({...newProduct, tags: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                               bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                      placeholder="fresh, organic, local"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={newProduct.isOrganic}
                        onChange={(e) => setNewProduct({...newProduct, isOrganic: e.target.checked})}
                        className="mr-2"
                      />
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        This is an organic product
                      </span>
                    </label>
                  </div>
                </div>

                <div className="flex justify-end gap-4">
                  <button
                    type="button"
                    onClick={() => setActiveTab('products')}
                    className="px-6 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                             text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={actionLoading === 'add-product'}
                    className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg
                             disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    {actionLoading === 'add-product' ? (
                      <>
                        <i className="fas fa-spinner fa-spin mr-2"></i>
                        Adding...
                      </>
                    ) : (
                      'Add Product'
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
