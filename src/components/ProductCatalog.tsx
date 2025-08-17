'use client';

import { useState, useEffect } from 'react';
import { Product, ProductCategory } from '@/types/ecommerce';
import { getProducts, addToCart } from '@/utils/ecommerce-api';

interface ProductCatalogProps {
  onAddToCart?: (product: Product, quantity: number) => void;
}

const categories: { value: ProductCategory | 'all'; label: string; icon: string }[] = [
  { value: 'all', label: 'All Products', icon: '🌿' },
  { value: 'fruits', label: 'Fruits', icon: '🍎' },
  { value: 'vegetables', label: 'Vegetables', icon: '🥬' },
  { value: 'grains', label: 'Grains', icon: '🌾' },
  { value: 'herbs', label: 'Herbs', icon: '🌿' },
  { value: 'dairy', label: 'Dairy', icon: '🥛' },
  { value: 'meat', label: 'Meat', icon: '🥩' },
  { value: 'nuts', label: 'Nuts', icon: '🥜' },
  { value: 'other', label: 'Other', icon: '📦' },
];

export default function ProductCatalog({ onAddToCart }: ProductCatalogProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'price' | 'rating'>('name');
  const [addingToCart, setAddingToCart] = useState<string | null>(null);

  useEffect(() => {
    loadProducts();
  }, [selectedCategory, searchQuery]);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const fetchedProducts = await getProducts(
        selectedCategory === 'all' ? undefined : selectedCategory,
        searchQuery || undefined
      );
      setProducts(fetchedProducts);
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (product: Product, quantity: number = 1) => {
    setAddingToCart(product.id);
    try {
      addToCart(product, quantity);
      if (onAddToCart) {
        onAddToCart(product, quantity);
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
    } finally {
      setAddingToCart(null);
    }
  };

  const sortedProducts = [...products].sort((a, b) => {
    switch (sortBy) {
      case 'price':
        return a.price - b.price;
      case 'rating':
        return b.rating - a.rating;
      case 'name':
      default:
        return a.name.localeCompare(b.name);
    }
  });

  const formatPrice = (price: number) => {
    return `KES ${price.toLocaleString()}`;
  };

  const getStockStatus = (stock: number) => {
    if (stock === 0) return { text: 'Out of Stock', color: 'text-red-600', bg: 'bg-red-100' };
    if (stock < 10) return { text: 'Low Stock', color: 'text-orange-600', bg: 'bg-orange-100' };
    return { text: 'In Stock', color: 'text-green-600', bg: 'bg-green-100' };
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Fresh from the Farm
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Discover quality agricultural products directly from local farmers
          </p>
        </div>
        
        {/* Search and Sort */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative">
            <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                       bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
                       focus:ring-2 focus:ring-blue-500 focus:border-transparent
                       w-full sm:w-64"
            />
          </div>
          
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'name' | 'price' | 'rating')}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                     bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
                     focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="name">Sort by Name</option>
            <option value="price">Sort by Price</option>
            <option value="rating">Sort by Rating</option>
          </select>
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <button
            key={category.value}
            onClick={() => setSelectedCategory(category.value)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all
              ${selectedCategory === category.value
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
          >
            <span>{category.icon}</span>
            {category.label}
          </button>
        ))}
      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, index) => (
            <div key={index} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 animate-pulse">
              <div className="h-40 bg-gray-200 dark:bg-gray-700 rounded-lg mb-4"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
              <div className="flex justify-between items-center">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
              </div>
            </div>
          ))}
        </div>
      ) : sortedProducts.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
            No products found
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Try adjusting your search or category filter
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {sortedProducts.map((product) => {
            const stockStatus = getStockStatus(product.stock);
            return (
              <div
                key={product.id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden 
                         hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
              >
                {/* Product Image */}
                <div className="h-40 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900 dark:to-green-800 
                              flex items-center justify-center text-6xl">
                  {product.images[0]}
                </div>
                
                <div className="p-4">
                  {/* Product Header */}
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-lg leading-tight">
                      {product.name}
                    </h3>
                    {product.isOrganic && (
                      <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-medium ml-2">
                        Organic
                      </span>
                    )}
                  </div>
                  
                  {/* Description */}
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 line-clamp-2">
                    {product.description}
                  </p>
                  
                  {/* Seller Info */}
                  <div className="flex items-center gap-2 mb-3">
                    <i className="fas fa-user-tie text-gray-400 text-xs"></i>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {product.sellerName}
                    </span>
                    <i className="fas fa-map-marker-alt text-gray-400 text-xs"></i>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {product.sellerLocation}
                    </span>
                  </div>
                  
                  {/* Rating and Reviews */}
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <i
                          key={i}
                          className={`fas fa-star text-xs ${
                            i < Math.floor(product.rating) 
                              ? 'text-yellow-400' 
                              : 'text-gray-300 dark:text-gray-600'
                          }`}
                        ></i>
                      ))}
                    </div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {product.rating.toFixed(1)} ({product.reviewCount})
                    </span>
                  </div>
                  
                  {/* Stock Status */}
                  <div className="mb-3">
                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${stockStatus.bg} ${stockStatus.color}`}>
                      {stockStatus.text}
                    </span>
                  </div>
                  
                  {/* Price and Add to Cart */}
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xl font-bold text-gray-900 dark:text-gray-100">
                        {formatPrice(product.price)}
                      </span>
                      <span className="text-sm text-gray-500 dark:text-gray-400 ml-1">
                        {product.unit}
                      </span>
                    </div>
                    
                    <button
                      onClick={() => handleAddToCart(product)}
                      disabled={product.stock === 0 || addingToCart === product.id}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all
                        ${product.stock === 0
                          ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                          : addingToCart === product.id
                          ? 'bg-blue-400 text-white cursor-wait'
                          : 'bg-blue-600 hover:bg-blue-700 text-white hover:shadow-md'
                        }`}
                    >
                      {addingToCart === product.id ? (
                        <i className="fas fa-spinner fa-spin"></i>
                      ) : product.stock === 0 ? (
                        'Sold Out'
                      ) : (
                        <i className="fas fa-cart-plus"></i>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
