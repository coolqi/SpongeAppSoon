import { create } from "zustand";

// Define the interface for the amount store
interface AmountStore {
  amount: number; // The amount to be staked
  setAmount: (newAmount: number) => void; // Function to update the amount
}

// Create the store
const useAmountStore = create<AmountStore>((set) => ({
  amount: 0, // Default stake amount
  setAmount: (newAmount: number) => {
    set({ amount: newAmount });
  },
}));

export default useAmountStore;
