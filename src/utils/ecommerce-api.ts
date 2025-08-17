// Mock e-commerce API service with realistic agricultural data

import { Product, User, Order, CartItem, OrderStatus, SellerStats, Address } from '@/types/ecommerce';

// Mock data storage (in production, this would be a database)
let products: Product[] = [];
let users: User[] = [];
const orders: Order[] = [];
let currentUser: User | null = null;
let cart: CartItem[] = [];

// Initialize mock data
function initializeMockData() {
  // Sample farmers
  const farmers: User[] = [
    {
      id: 'farmer-1',
      name: 'Mary Wanjiku',
      email: 'mary@kericho-farm.com',
      phone: '+254701234567',
      role: 'farmer',
      location: 'Kericho County',
      joinedAt: '2023-01-15',
      farmName: 'Green Valley Farm',
      farmSize: '25 hectares',
      certifications: ['Organic', 'Fair Trade']
    },
    {
      id: 'farmer-2',
      name: 'John Kimani',
      email: 'john@naivasha-produce.com',
      phone: '+254702345678',
      role: 'farmer',
      location: 'Nakuru County',
      joinedAt: '2023-03-20',
      farmName: 'Lake View Gardens',
      farmSize: '18 hectares',
      certifications: ['Organic']
    },
    {
      id: 'farmer-3',
      name: 'Grace Achieng',
      email: 'grace@kisumu-fresh.com',
      phone: '+254703456789',
      role: 'farmer',
      location: 'Kisumu County',
      joinedAt: '2023-02-10',
      farmName: 'Fresh Fields Farm',
      farmSize: '12 hectares',
      certifications: ['GlobalGAP']
    }
  ];

  // Sample customer
  const customer: User = {
    id: 'customer-1',
    name: 'David Mwangi',
    email: 'david@example.com',
    phone: '+254704567890',
    role: 'customer',
    location: 'Nairobi',
    joinedAt: '2023-06-01',
    addresses: [
      {
        id: 'addr-1',
        name: 'Home',
        street: '123 Kimathi Street',
        city: 'Nairobi',
        county: 'Nairobi',
        postalCode: '00100',
        phone: '+254704567890',
        isDefault: true
      }
    ]
  };

  users = [...farmers, customer];
  currentUser = customer; // Default to customer view

  // Sample products
  products = [
    {
      id: 'prod-1',
      name: 'Fresh Tomatoes',
      description: 'Organic Roma tomatoes, perfectly ripe and ideal for cooking and salads.',
      price: 120,
      unit: 'per kg',
      category: 'vegetables',
      sellerId: 'farmer-1',
      sellerName: 'Mary Wanjiku',
      sellerLocation: 'Kericho County',
      images: ['🍅'],
      stock: 150,
      isOrganic: true,
      harvestDate: '2024-01-10',
      expiryDate: '2024-01-25',
      tags: ['fresh', 'organic', 'local'],
      rating: 4.5,
      reviewCount: 23,
      createdAt: '2024-01-10',
      updatedAt: '2024-01-10'
    },
    {
      id: 'prod-2',
      name: 'Sweet Bananas',
      description: 'Premium quality bananas, naturally sweet and perfect for snacking.',
      price: 80,
      unit: 'per dozen',
      category: 'fruits',
      sellerId: 'farmer-2',
      sellerName: 'John Kimani',
      sellerLocation: 'Nakuru County',
      images: ['🍌'],
      stock: 200,
      isOrganic: false,
      harvestDate: '2024-01-08',
      expiryDate: '2024-01-22',
      tags: ['sweet', 'fresh', 'nutritious'],
      rating: 4.2,
      reviewCount: 15,
      createdAt: '2024-01-08',
      updatedAt: '2024-01-08'
    },
    {
      id: 'prod-3',
      name: 'Baby Spinach',
      description: 'Tender baby spinach leaves, perfect for salads and smoothies.',
      price: 250,
      unit: 'per kg',
      category: 'vegetables',
      sellerId: 'farmer-3',
      sellerName: 'Grace Achieng',
      sellerLocation: 'Kisumu County',
      images: ['🥬'],
      stock: 80,
      isOrganic: true,
      harvestDate: '2024-01-12',
      expiryDate: '2024-01-19',
      tags: ['organic', 'fresh', 'leafy'],
      rating: 4.7,
      reviewCount: 31,
      createdAt: '2024-01-12',
      updatedAt: '2024-01-12'
    },
    {
      id: 'prod-4',
      name: 'Avocados',
      description: 'Hass avocados, creamy and rich, perfect for guacamole and toast.',
      price: 300,
      unit: 'per kg',
      category: 'fruits',
      sellerId: 'farmer-1',
      sellerName: 'Mary Wanjiku',
      sellerLocation: 'Kericho County',
      images: ['🥑'],
      stock: 120,
      isOrganic: true,
      harvestDate: '2024-01-05',
      expiryDate: '2024-01-30',
      tags: ['premium', 'organic', 'healthy'],
      rating: 4.8,
      reviewCount: 42,
      createdAt: '2024-01-05',
      updatedAt: '2024-01-05'
    },
    {
      id: 'prod-5',
      name: 'White Maize',
      description: 'Locally grown white maize, perfect for ugali and other traditional dishes.',
      price: 45,
      unit: 'per kg',
      category: 'grains',
      sellerId: 'farmer-2',
      sellerName: 'John Kimani',
      sellerLocation: 'Nakuru County',
      images: ['🌽'],
      stock: 500,
      isOrganic: false,
      harvestDate: '2023-12-20',
      expiryDate: '2024-06-20',
      tags: ['staple', 'local', 'traditional'],
      rating: 4.3,
      reviewCount: 18,
      createdAt: '2023-12-20',
      updatedAt: '2023-12-20'
    },
    {
      id: 'prod-6',
      name: 'Fresh Carrots',
      description: 'Crisp orange carrots, sweet and crunchy, great for cooking and snacking.',
      price: 100,
      unit: 'per kg',
      category: 'vegetables',
      sellerId: 'farmer-3',
      sellerName: 'Grace Achieng',
      sellerLocation: 'Kisumu County',
      images: ['🥕'],
      stock: 180,
      isOrganic: false,
      harvestDate: '2024-01-09',
      expiryDate: '2024-02-09',
      tags: ['fresh', 'crunchy', 'nutritious'],
      rating: 4.4,
      reviewCount: 27,
      createdAt: '2024-01-09',
      updatedAt: '2024-01-09'
    }
  ];
}

// Initialize data
initializeMockData();

// API functions
export async function getProducts(category?: string, search?: string): Promise<Product[]> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  let filteredProducts = [...products];
  
  if (category && category !== 'all') {
    filteredProducts = filteredProducts.filter(p => p.category === category);
  }
  
  if (search) {
    const searchLower = search.toLowerCase();
    filteredProducts = filteredProducts.filter(p => 
      p.name.toLowerCase().includes(searchLower) ||
      p.description.toLowerCase().includes(searchLower) ||
      p.tags.some(tag => tag.toLowerCase().includes(searchLower))
    );
  }
  
  return filteredProducts;
}

export async function getProduct(id: string): Promise<Product | null> {
  await new Promise(resolve => setTimeout(resolve, 300));
  return products.find(p => p.id === id) || null;
}

export async function getSellerProducts(sellerId: string): Promise<Product[]> {
  await new Promise(resolve => setTimeout(resolve, 400));
  return products.filter(p => p.sellerId === sellerId);
}

export async function addProduct(product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<Product> {
  await new Promise(resolve => setTimeout(resolve, 600));
  
  const newProduct: Product = {
    ...product,
    id: `prod-${Date.now()}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  products.push(newProduct);
  return newProduct;
}

export async function updateProduct(id: string, updates: Partial<Product>): Promise<Product | null> {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const index = products.findIndex(p => p.id === id);
  if (index === -1) return null;
  
  products[index] = {
    ...products[index],
    ...updates,
    updatedAt: new Date().toISOString()
  };
  
  return products[index];
}

export async function deleteProduct(id: string): Promise<boolean> {
  await new Promise(resolve => setTimeout(resolve, 400));
  
  const index = products.findIndex(p => p.id === id);
  if (index === -1) return false;
  
  products.splice(index, 1);
  return true;
}

// Cart functions
export function getCart(): CartItem[] {
  return [...cart];
}

export function addToCart(product: Product, quantity: number = 1): CartItem[] {
  const existingItemIndex = cart.findIndex(item => item.product.id === product.id);
  
  if (existingItemIndex >= 0) {
    cart[existingItemIndex].quantity += quantity;
  } else {
    cart.push({
      product,
      quantity,
      addedAt: new Date().toISOString()
    });
  }
  
  return [...cart];
}

export function updateCartItem(productId: string, quantity: number): CartItem[] {
  const index = cart.findIndex(item => item.product.id === productId);
  
  if (index >= 0) {
    if (quantity <= 0) {
      cart.splice(index, 1);
    } else {
      cart[index].quantity = quantity;
    }
  }
  
  return [...cart];
}

export function removeFromCart(productId: string): CartItem[] {
  const index = cart.findIndex(item => item.product.id === productId);
  if (index >= 0) {
    cart.splice(index, 1);
  }
  return [...cart];
}

export function clearCart(): void {
  cart = [];
}

export function getCartTotal(): number {
  return cart.reduce((total, item) => total + (item.product.price * item.quantity), 0);
}

// Order functions
export async function createOrder(shippingAddress: Address, paymentMethod: string): Promise<Order> {
  await new Promise(resolve => setTimeout(resolve, 800));
  
  if (!currentUser || cart.length === 0) {
    throw new Error('Invalid order data');
  }
  
  const order: Order = {
    id: `order-${Date.now()}`,
    customerId: currentUser.id,
    customerName: currentUser.name,
    items: cart.map(item => ({
      productId: item.product.id,
      productName: item.product.name,
      sellerId: item.product.sellerId,
      sellerName: item.product.sellerName,
      quantity: item.quantity,
      price: item.product.price,
      total: item.product.price * item.quantity
    })),
    totalAmount: getCartTotal(),
    status: 'pending',
    shippingAddress,
    paymentMethod,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    estimatedDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString() // 3 days
  };
  
  orders.push(order);
  clearCart();
  
  return order;
}

export async function getUserOrders(userId: string): Promise<Order[]> {
  await new Promise(resolve => setTimeout(resolve, 400));
  return orders.filter(order => order.customerId === userId);
}

export async function getSellerOrders(sellerId: string): Promise<Order[]> {
  await new Promise(resolve => setTimeout(resolve, 400));
  return orders.filter(order => 
    order.items.some(item => item.sellerId === sellerId)
  );
}

export async function updateOrderStatus(orderId: string, status: OrderStatus): Promise<Order | null> {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const index = orders.findIndex(order => order.id === orderId);
  if (index === -1) return null;
  
  orders[index].status = status;
  orders[index].updatedAt = new Date().toISOString();
  
  return orders[index];
}

// User functions
export async function getCurrentUser(): Promise<User | null> {
  await new Promise(resolve => setTimeout(resolve, 200));
  return currentUser;
}

export async function loginUser(email: string, role: 'farmer' | 'customer'): Promise<User | null> {
  await new Promise(resolve => setTimeout(resolve, 600));
  
  const user = users.find(u => u.email === email && u.role === role);
  if (user) {
    currentUser = user;
    cart = []; // Clear cart on login
  }
  return user || null;
}

export function logoutUser(): void {
  currentUser = null;
  cart = [];
}

export async function getSellerStats(sellerId: string): Promise<SellerStats> {
  await new Promise(resolve => setTimeout(resolve, 400));
  
  const sellerProducts = products.filter(p => p.sellerId === sellerId);
  const sellerOrders = orders.filter(order => 
    order.items.some(item => item.sellerId === sellerId)
  );
  
  const totalRevenue = sellerOrders.reduce((total, order) => 
    total + order.items
      .filter(item => item.sellerId === sellerId)
      .reduce((itemTotal, item) => itemTotal + item.total, 0), 0
  );
  
  const averageRating = sellerProducts.reduce((total, product) => 
    total + product.rating, 0) / sellerProducts.length || 0;
  
  const pendingOrders = sellerOrders.filter(order => 
    order.status === 'pending' || order.status === 'confirmed'
  ).length;
  
  return {
    totalProducts: sellerProducts.length,
    totalOrders: sellerOrders.length,
    totalRevenue,
    averageRating,
    pendingOrders
  };
}
