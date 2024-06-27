export const DEV_ENV = 'development'

export const PROD_ENV = 'production'

export const WHITE_LIST_DOMAINS = ['http://localhost:3000']

export const HEADER_KEYS = {
  USER_ID: 'x-user-id',
  AUTHORIZATION: 'authorization'
}

export const ROLES = {
  ADMIN: 'admin',
  CUSTOMER: 'customer'
}

export const DISCOUNT_TYPES = {
  PERCENTAGE: 'percentage',
  FIXED: 'fixed'
}

export const DISCOUNT_APPLY_TYPES = {
  ALL: 'all',
  SPECIFIC: 'specific'
}

export const PAYMENT_METHODS = {
  CASH_ON_DELIVERY: 'CASH_ON_DELIVERY',
  PAY_IN_STORE: 'PAY_IN_STORE',
  ONLINE_PAYMENT: 'ONLINE_PAYMENT'
}

export const ORDER_STATUSES = {
  PENDING: 'PENDING',
  PAID: 'PAID',
  CONFIRMED: 'CONFIRMED',
  SHIPPING: 'SHIPPING',
  COMPLETED: 'COMPLETED'
}

export const COLLECTION_NAMES = {
  USER: 'users',
  AUTHENTICATION_TOKEN: 'authentication_tokens',
  BRAND: 'brands',
  PRODUCT: 'products',
  CATEGORY: 'categories',
  DISCOUNT: 'discounts',
  ADDRESS: 'addresses',
  CART: 'carts',
  ORDER: 'orders',
  EMAIL_VERIFICATION_TOKEN: 'email_verification_tokens',
  PASSWORD_RESET_OTP: 'password_reset_otps',
  PASSWORD_HISTORY: 'password_history',
  PROVINCE: 'provinces',
  DISTRICT: 'districts',
  WARD: 'wards',
  PAYMENT_METHOD: 'payment_methods',
  ORDER_STATUS: 'order_statuses'
}

export const MODEL_NAMES = {
  USER: 'User',
  AUTHENTICATION_TOKEN: 'AuthenticationToken',
  BRAND: 'Brand',
  PRODUCT: 'Product',
  CATEGORY: 'Category',
  DISCOUNT: 'Discount',
  ADDRESS: 'Address',
  CART: 'Cart',
  ORDER: 'Order',
  EMAIL_VERIFICATION_TOKEN: 'EmailVerificationToken',
  PASSWORD_RESET_OTP: 'PasswordResetOTP',
  PASSWORD_HISTORY: 'PasswordHistory',
  PROVINCE: 'Province',
  DISTRICT: 'District',
  WARD: 'Ward',
  PAYMENT_METHOD: 'PaymentMethod',
  ORDER_STATUS: 'OrderStatus'
}

export const PARTNER_APIS = {
  GHN: {
    API_ROOT: 'https://dev-online-gateway.ghn.vn/shiip/public-api',
    APIS: {
      GET_PROVINCES: '/master-data/province',
      GET_DISTRICTS: '/master-data/district',
      GET_WARDS: '/master-data/ward',
      CALCULATE_FEE: '/v2/shipping-order/fee'
    },
    SERVICE_ID: 53321,
    SERVICE_TYPE_ID: 2
  },
  PAYPAL: {
    API_ROOT: 'https://api-m.sandbox.paypal.com',
    APIS: {
      GENERATE_ACCESS_TOKEN: '/v1/oauth2/token',
      CREATE_ORDER: '/v2/checkout/orders',
      CAPTURE_ORDER: '/v2/checkout/orders/:orderId/capture'
    }
  }
}
