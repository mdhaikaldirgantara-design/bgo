import { create } from 'zustand';
import { db } from '../db/db';

export const useOrderStore = create((set, get) => ({
  currentTable: null,
  cart: [], // { menuItem, quantity, notes }
  
  setTable: (table) => set({ currentTable: table, cart: [] }),
  
  addToCart: (menuItem) => {
    const { cart } = get();
    const existing = cart.find(item => item.menuItem.id === menuItem.id);
    if (existing) {
      set({
        cart: cart.map(item => 
          item.menuItem.id === menuItem.id 
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        )
      });
    } else {
      set({ cart: [...cart, { menuItem, quantity: 1, notes: '' }] });
    }
  },
  
  removeFromCart: (menuItemId) => {
    set({ cart: get().cart.filter(item => item.menuItem.id !== menuItemId) });
  },
  
  updateQuantity: (menuItemId, quantity) => {
    if (quantity <= 0) {
      get().removeFromCart(menuItemId);
      return;
    }
    set({
      cart: get().cart.map(item => 
        item.menuItem.id === menuItemId ? { ...item, quantity } : item
      )
    });
  },
  
  clearCart: () => set({ cart: [], currentTable: null }),
  
  submitOrder: async () => {
    const { cart } = get();
    if (cart.length === 0) return;
    
    try {
      const subtotal = cart.reduce((sum, item) => sum + (item.quantity * item.menuItem.price), 0);
      
      const orderId = await db.orders.add({
        tableId: 1, // placeholder
        orderNumber: `#${Math.floor(Math.random() * 1000).toString().padStart(4, '0')}`,
        status: 'open',
        type: 'dine_in',
        staffId: 1, // placeholder
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        notes: ''
      });

      const orderItems = cart.map(item => ({
        orderId,
        menuItemId: item.menuItem.id,
        itemName: item.menuItem.name,
        quantity: item.quantity,
        unitPrice: item.menuItem.price,
        subtotal: item.quantity * item.menuItem.price,
        notes: item.notes || '',
        status: 'in_kitchen',
        sentAt: new Date().toISOString()
      }));

      await db.orderItems.bulkAdd(orderItems);
      get().clearCart();
    } catch (error) {
      console.error('Failed to submit order:', error);
    }
  },
  
  chargeOrder: async (paymentMethod = 'cash') => {
    const { cart } = get();
    if (cart.length === 0) return;
    try {
      const subtotal = cart.reduce((sum, item) => sum + (item.quantity * item.menuItem.price), 0);
      const tax = Math.round(subtotal * 0.10);
      const total = subtotal + tax;

      await db.transactions.add({
        orderId: 1, // placeholder
        orderNumber: `#${Math.floor(Math.random() * 1000).toString().padStart(4, '0')}`,
        subtotal,
        tax,
        serviceCharge: 0,
        discount: 0,
        total,
        paymentMethod,
        amountPaid: total,
        change: 0,
        paidAt: new Date().toISOString(),
        staffId: 1,
        receiptNumber: `RCPT-${Math.floor(Math.random() * 100000)}`
      });

      get().clearCart();
    } catch (err) {
      console.error(err);
    }
  }
}));
