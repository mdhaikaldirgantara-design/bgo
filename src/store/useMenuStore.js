import { create } from 'zustand';
import { db } from '../db/db';

export const useMenuStore = create((set) => ({
  categories: [],
  menuItems: [],
  isLoading: false,
  fetchMenu: async () => {
    set({ isLoading: true });
    try {
      const categories = await db.categories.orderBy('sortOrder').toArray();
      const menuItems = await db.menuItems.toArray();
      set({ categories, menuItems, isLoading: false });
    } catch (error) {
      console.error('Failed to fetch menu:', error);
      set({ isLoading: false });
    }
  }
}));
