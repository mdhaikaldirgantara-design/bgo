import Dexie from 'dexie';

export const db = new Dexie('BarRestoPOS');

db.version(2).stores({
  // Menu Management
  categories:   '++id, name, color, icon, isActive, sortOrder',
  menuItems:    '++id, categoryId, name, price, description, isAvailable, imageUrl, preparationTime',
  modifiers:    '++id, menuItemId, name, options', 

  // Operations
  tables:       '++id, name, capacity, zone, status, currentOrderId',

  orders:       '++id, tableId, orderNumber, status, type, staffId, createdAt, updatedAt, notes',

  orderItems:   '++id, orderId, menuItemId, itemName, quantity, unitPrice, subtotal, notes, status, sentAt',

  transactions: '++id, orderId, orderNumber, subtotal, tax, serviceCharge, discount, total, paymentMethod, amountPaid, change, paidAt, staffId, receiptNumber',

  // Shift & Staff
  staff:        '++id, name, pin, role, isActive',
  shifts:       '++id, staffId, openedAt, closedAt, openingCash, closingCash, notes',

  // Sync Queue
  syncQueue:    '++id, table, recordId, operation, payload, status, createdAt, attempts',
});
