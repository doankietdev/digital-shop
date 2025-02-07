export const DEV_ENV = 'dev'

export const PROD_ENV = 'prod'

export const TEST_ENV = 'test'

export const WHITE_LIST_DOMAINS = ['http://localhost:3000']

export const HEADER_KEYS = {
  CLIENT_ID: 'x-client-id',
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
  ONLINE_PAYMENT: 'ONLINE_PAYMENT',
  MOMO: 'MOMO',
  PAYPAL: 'PAYPAL',
  CASH: 'CASH'
}

export const TRANSACTION_STATUS = {
  PENDING: 'PENDING',
  COMPLETED: 'COMPLETED',
  FAILED: 'FAILED',
  REFUNDED: 'REFUNDED'
}

export const ORDER_STATUSES = {
  PENDING: 'PENDING',
  PAID: 'PAID',
  CONFIRMED: 'CONFIRMED',
  SHIPPING: 'SHIPPING',
  COMPLETED: 'COMPLETED',
  CANCELED: 'CANCELED'
}

export const COLLECTION_NAMES = {
  USER: 'users',
  LOGIN_SESSION: 'login_sessions',
  USED_REFRESH_TOKEN: 'used_refresh_tokens',
  BRAND: 'brands',
  PRODUCT: 'products',
  CATEGORY: 'categories',
  DISCOUNT: 'discounts',
  ADDRESS: 'addresses',
  CART: 'carts',
  ORDER: 'orders',
  EMAIL_TOKEN: 'email_tokens',
  PASSWORD_RESET_OTP: 'password_reset_otps',
  PASSWORD_RESET_TOKEN: 'password_reset_tokens',
  PASSWORD_HISTORY: 'password_history',
  PAYMENT_METHOD: 'payment_methods',
  TRANSACTION: 'transactions'
}

export const MODEL_NAMES = {
  USER: 'User',
  LOGIN_SESSION: 'LoginSession',
  USED_REFRESH_TOKEN: 'UsedRefreshToken',
  BRAND: 'Brand',
  PRODUCT: 'Product',
  CATEGORY: 'Category',
  DISCOUNT: 'Discount',
  ADDRESS: 'Address',
  CART: 'Cart',
  ORDER: 'Order',
  EMAIL_TOKEN: 'EmailToken',
  PASSWORD_RESET_OTP: 'PasswordResetOTP',
  PASSWORD_RESET_TOKEN: 'PasswordResetToken',
  PASSWORD_HISTORY: 'PasswordHistory',
  PAYMENT_METHOD: 'PaymentMethod',
  TRANSACTION: 'Transaction'
}

export const PARTNER_APIS = {
  GHN: {
    API_ROOT: 'https://dev-online-gateway.ghn.vn/shiip/public-api',
    APIS: {
      GET_PROVINCES: '/master-data/province',
      GET_DISTRICTS: '/master-data/district',
      GET_WARDS: '/master-data/ward',
      GET_AVAILABLE_SERVICES: '/v2/shipping-order/available-services',
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
  },
  CURRENCY_FREAKS: {
    API_ROOT: 'https://api.currencyfreaks.com/v2.0',
    APIS: {
      GET_LATEST_CURRENCY_EXCHANGE_RATES: '/rates/latest'
    }
  },
  MOMO: {
    API_ROOT: 'https://test-payment.momo.vn',
    APIS: {
      INIT_PAYMENT: '/v2/gateway/api/create'
    }
  }
}

export const REDIS_CONNECT_TIMEOUT = 10000
export const REDIS_CONNECT_MESSAGE = {
  statusCode: -9999,
  message: 'Redis service connect error'
}

export const INVALID_REDIS_KEY = {
  INVALID_CACHE_PRODUCT: 'INVALID_CACHE_PRODUCT',
  INVALID_CACHE_ADDRESS: 'INVALID_CACHE_ADDRESS',
  INVALID_CACHE_BRAND: 'INVALID_CACHE_BRAND',
  INVALID_CACHE_CART: 'INVALID_CACHE_CART',
  INVALID_CACHE_CATEGORY: 'INVALID_CACHE_CATEGORY',
  INVALID_CACHE_DISCOUNT: 'INVALID_CACHE_DISCOUNT'
}

export const REDIS_KEYS = {
  EXCHANGE_RATES: 'EXCHANGE_RATES'
}

export const BIG_DISCOUNTS_PRICE_CONDITION = 50
