import { create } from 'zustand'

export const useScrollStore = create((set) => ({
  offset: 0,
  setOffset: (val) => set({ offset: val }),
}))
