import { create } from 'zustand';
import { db } from '../db/db';

export const useTableStore = create((set) => ({
  tables: [],
  isLoading: false,
  fetchTables: async () => {
    set({ isLoading: true });
    try {
      const tables = await db.tables.toArray();
      set({ tables, isLoading: false });
    } catch (error) {
      console.error('Failed to fetch tables:', error);
      set({ isLoading: false });
    }
  },
  updateTableStatus: async (id, status) => {
    await db.tables.update(id, { status });
    const tables = await db.tables.toArray();
    set({ tables });
  }
}));
