// E-commerce data types for the agricultural marketplace

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  unit: string; // e.g., "per kg", "per piece", "per bundle"
  category: ProductCategory;
  sellerId: string;
  sellerName: string;
  sellerLocation: string;
  images: string[];
  stock: number;
  isOrganic: boolean;
  harvestDate?: string;
  expiryDate?: string;
  tags: string[];
  rating: number;
  reviewCount: number;
  createdAt: string;
  updatedAt: string;
}

export type ProductCategory = 
  | 'fruits' 
  | 'vegetables' 
  | 'grains' 
  | 'herbs' 
  | 'dairy' 
  | 'meat' 
  | 'nuts' 
  | 'other';

export interface CartItem {
  product: Product;
  quantity: number;
  addedAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'farmer' | 'customer';
  location: string;
  avatar?: string;
  joinedAt: string;
  // Farmer-specific fields
  farmName?: string;
  farmSize?: string;
  certifications?: string[];
  // Customer-specific fields
  addresses?: Address[];
}

export interface Address {
  id: string;
  name: string;
  street: string;
  city: string;
  county: string;
  postalCode: string;
  phone: string;
  isDefault: boolean;
}

export interface Order {
  id: string;
  customerId: string;
  customerName: string;
  items: OrderItem[];
  totalAmount: number;
  status: OrderStatus;
  shippingAddress: Address;
  paymentMethod: string;
  createdAt: string;
  updatedAt: string;
  estimatedDelivery?: string;
  trackingNumber?: string;
  notes?: string;
}

export interface OrderItem {
  productId: string;
  productName: string;
  sellerId: string;
  sellerName: string;
  quantity: number;
  price: number;
  total: number;
}

export type OrderStatus = 
  | 'pending' 
  | 'confirmed' 
  | 'preparing' 
  | 'shipped' 
  | 'delivered' 
  | 'cancelled';

export interface Review {
  id: string;
  productId: string;
  customerId: string;
  customerName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface SellerStats {
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  averageRating: number;
  pendingOrders: number;
}
