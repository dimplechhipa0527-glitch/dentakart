export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  role: 'DOCTOR' | 'ADMIN';
  status: 'ACTIVE' | 'PENDING' | 'BLOCKED';
  doctorProfile?: DoctorProfile;
  addresses?: Address[];
  stats?: {
    orders: number;
    wishlistItems: number;
    cartItems: number;
  };
}

export interface DoctorProfile {
  id: string;
  userId: string;
  clinicName: string;
  gstNumber?: string;
  regNumber?: string;
  clinicPhone?: string;
  clinicEmail?: string;
  addressLine?: string;
  city?: string;
  state?: string;
  pincode?: string;
  totalSpent: number;
  orderCount: number;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon?: string;
  description?: string;
  parentId?: string;
  parent?: Category;
  subcategories?: Category[];
  _count?: {
    products: number;
  };
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  brand: string;
  sku: string;
  hsnCode: string;
  description: string;
  specifications: Record<string, string>;
  price: number;
  mrp: number;
  discount: number;
  gstPercent: number;
  stock: number;
  lowStockThreshold: number;
  packSize: string;
  manufacturer?: string;
  expiryInfo?: string;
  isFeatured: boolean;
  isBestseller: boolean;
  isActive: boolean;
  images: string[];
  categoryId: string;
  category?: Category;
  avgRating?: number;
  reviewCount?: number;
  reviews?: Review[];
  relatedProducts?: Product[];
}

export interface Address {
  id: string;
  userId: string;
  type: 'SHIPPING' | 'BILLING';
  name: string;
  clinicName?: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pincode: string;
  gstNumber?: string;
  isDefault: boolean;
}

export interface CartItem {
  id: string;
  productId: string;
  quantity: number;
  product: Product;
  itemTotal: number;
  itemGst: number;
}

export interface CartSummary {
  subtotal: number;
  gst: number;
  shipping: number;
  finalTotal: number;
  freeShippingThreshold: number;
  amountToFreeShipping: number;
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  productName: string;
  brand: string;
  sku: string;
  price: number;
  mrp: number;
  gstPercent: number;
  quantity: number;
  total: number;
  productImages?: string[];
  product?: Product;
}

export interface OrderStatusLog {
  id: string;
  orderId: string;
  status: string;
  note?: string;
  updatedBy?: string;
  createdAt: string;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  orderId: string;
  invoiceDate: string;
  subtotal: number;
  gstAmount: number;
  discountAmount: number;
  shippingFee: number;
  totalAmount: number;
  clinicName: string;
  doctorName: string;
  gstNumber?: string;
  clinicAddress: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  user?: User;
  status: 'PLACED' | 'CONFIRMED' | 'PROCESSING' | 'SHIPPED' | 'OUT_FOR_DELIVERY' | 'DELIVERED' | 'CANCELLED' | 'RETURN_REQUESTED' | 'RETURNED';
  subtotal: number;
  gstAmount: number;
  discountAmount: number;
  shippingFee: number;
  totalAmount: number;
  paymentStatus: 'PENDING' | 'SUCCESS' | 'FAILED' | 'REFUNDED';
  paymentMethod: 'UPI' | 'CARD' | 'NETBANKING' | 'RAZORPAY' | 'COD';
  transactionId?: string;
  trackingNumber?: string;
  courierName?: string;
  shippingAddress: any;
  billingAddress: any;
  couponCode?: string;
  doctorNotes?: string;
  adminNotes?: string;
  items: OrderItem[];
  statusLogs?: OrderStatusLog[];
  invoice?: Invoice;
  createdAt: string;
  updatedAt: string;
}

export interface Coupon {
  id: string;
  code: string;
  description: string;
  discountType: 'PERCENTAGE' | 'FIXED';
  discountValue: number;
  minOrderValue: number;
  maxDiscount?: number;
  validFrom: string;
  validTo?: string;
  usageLimit?: number;
  usageCount: number;
  isActive: boolean;
}

export interface Review {
  id: string;
  productId: string;
  userId: string;
  doctorName: string;
  clinicName?: string;
  rating: number;
  title?: string;
  comment: string;
  isApproved: boolean;
  createdAt: string;
  product?: {
    name: string;
    sku: string;
    brand: string;
  };
  user?: {
    email: string;
  };
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'ORDER' | 'STOCK' | 'PROMO' | 'SYSTEM';
  isRead: boolean;
  link?: string;
  createdAt: string;
}
