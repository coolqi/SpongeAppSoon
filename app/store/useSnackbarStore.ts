// useSnackbarStore.ts
import { create } from 'zustand';

interface SnackbarState {
  open: boolean;
  message: string;
  variant: 'success' | 'error' | 'warning' | 'info'; // Define the variant types
  showSnackbar: (message: string, variant?: 'success' | 'error' | 'warning' | 'info') => void;
  closeSnackbar: () => void;
  updateMessage: (message: string) => void;
  updateVariant: (variant: 'success' | 'error' | 'warning' | 'info') => void; // New method to update the variant
}

const useSnackbarStore = create<SnackbarState>((set) => ({
  open: false,
  message: '',
  variant: 'info', // Default variant
  showSnackbar: (message: string, variant: 'success' | 'error' | 'warning' | 'info' = 'info') => set({ open: true, message, variant }),
  closeSnackbar: () => set({ open: false, message: '', variant: 'info' }),
  updateMessage: (message: string) => set({ message }),
  updateVariant: (variant: 'success' | 'error' | 'warning' | 'info') => set({ variant }), // Update the variant
}));

export default useSnackbarStore;