export const APP_NAME = '在庫番';
export const APP_DESCRIPTION = '飲食店向け在庫管理システム';

export const ROUTES = {
  LOGIN: '/login',
  DASHBOARD: '/',
  INVENTORY: '/inventory',
  PRODUCTS: '/products',
  STOCK_IN_OUT: '/stock-movement',
  STOCKTAKING: '/stocktaking',
  ORDERS: '/orders',
  REPORTS: '/reports',
  SETTINGS: '/settings',
} as const;

export const CATEGORIES = [
  { id: '1', name: '肉類', icon: '🥩', color: 'red.500' },
  { id: '2', name: '野菜', icon: '🥬', color: 'green.500' },
  { id: '3', name: '調味料', icon: '🧂', color: 'orange.500' },
  { id: '4', name: '飲料', icon: '🍺', color: 'blue.500' },
  { id: '5', name: '備品', icon: '📦', color: 'purple.500' },
];

export const UNITS = [
  'kg',
  'g',
  'L',
  'ml',
  '個',
  '本',
  '枚',
  '箱',
  'パック',
  '袋',
];

export const TRANSACTION_TYPES = {
  IN: { label: '入庫', color: 'green' },
  OUT: { label: '出庫', color: 'blue' },
  DISPOSAL: { label: '廃棄', color: 'red' },
  ADJUSTMENT: { label: '調整', color: 'orange' },
} as const;

export const ORDER_STATUS = {
  DRAFT: { label: '下書き', color: 'gray' },
  ORDERED: { label: '発注済み', color: 'blue' },
  RECEIVED: { label: '受領済み', color: 'green' },
  CANCELLED: { label: 'キャンセル', color: 'red' },
} as const;

export const STOCK_STATUS = {
  NORMAL: { label: '適正', color: 'green' },
  LOW: { label: '不足', color: 'orange' },
  EXCESS: { label: '過剰', color: 'yellow' },
  EXPIRED: { label: '期限切れ', color: 'red' },
} as const;

export const ALERT_TYPES = {
  LOW_STOCK: { label: '在庫不足', icon: '⚠️' },
  EXCESS_STOCK: { label: '在庫過剰', icon: '📦' },
  EXPIRY: { label: '賞味期限', icon: '⏰' },
  ORDER_REQUIRED: { label: '発注必要', icon: '📝' },
} as const;

export const BREAKPOINTS = {
  mobile: '768px',
  tablet: '1024px',
  desktop: '1280px',
} as const;

export const TOUCH_TARGET_SIZE = '48px';

export const PAGE_SIZE = 20;
export const EXPIRY_WARNING_DAYS = 3;