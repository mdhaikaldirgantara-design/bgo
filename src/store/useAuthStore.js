import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      shiftId: null,
      login: (user) => set({ user }),
      logout: () => set({ user: null, shiftId: null }),
      setShift: (shiftId) => set({ shiftId })
    }),
    { name: 'pos-auth' }
  )
);
