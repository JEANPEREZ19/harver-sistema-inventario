import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Loan, LoanFormData, Student } from '../types';
import { useBookStore } from './bookStore';
import { generateMockLoans } from '../utils/mockData';

interface LoanState {
  loans: Loan[];
  isLoading: boolean;
  addLoan: (loan: LoanFormData) => Promise<Loan | null>;
  returnLoan: (id: string) => Promise<Loan | null>;
  deleteLoan: (id: string) => Promise<boolean>;
  deleteAllLoans: () => Promise<boolean>;
  getLoanById: (id: string) => Loan | undefined;
  getActiveLoans: () => Loan[];
  getOverdueLoans: () => Loan[];
  getReturnedLoans: () => Loan[];
}

// Initialize with mock data
const initialLoans = generateMockLoans(30);

export const useLoanStore = create<LoanState>()(
  persist(
    (set, get) => ({
      loans: initialLoans,
      isLoading: false,
      
      addLoan: async (loanData: LoanFormData) => {
        // Simulate API call delay
        await new Promise((resolve) => setTimeout(resolve, 500));
        
        // Check if book exists and has available copies
        const bookStore = useBookStore.getState();
        const book = bookStore.getBookById(loanData.bookId);
        
        if (!book || book.availableCopies <= 0) {
          return null;
        }
        
        // Decrease available copies
        await bookStore.decreaseAvailableCopies(loanData.bookId);
        
        const newLoan: Loan = {
          id: crypto.randomUUID(),
          ...loanData,
          book,
          student: {} as Student, // This would be filled in a real application
          status: 'active',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        
        set((state) => ({
          loans: [...state.loans, newLoan],
        }));
        
        return newLoan;
      },
      
      returnLoan: async (id: string) => {
        // Simulate API call delay
        await new Promise((resolve) => setTimeout(resolve, 500));
        
        const loan = get().loans.find((l) => l.id === id);
        
        if (!loan || loan.status === 'returned') {
          return null;
        }
        
        // Increase available copies
        const bookStore = useBookStore.getState();
        await bookStore.increaseAvailableCopies(loan.bookId);
        
        const updatedLoan: Loan = {
          ...loan,
          returnDate: new Date().toISOString(),
          status: 'returned',
          updatedAt: new Date().toISOString(),
        };
        
        set((state) => ({
          loans: state.loans.map((l) => (l.id === id ? updatedLoan : l)),
        }));
        
        return updatedLoan;
      },
      
      deleteLoan: async (id: string) => {
        // Simulate API call delay
        await new Promise((resolve) => setTimeout(resolve, 500));
        
        const loan = get().loans.find((l) => l.id === id);
        
        if (loan && loan.status === 'active') {
          // Increase available copies
          const bookStore = useBookStore.getState();
          await bookStore.increaseAvailableCopies(loan.bookId);
        }
        
        set((state) => ({
          loans: state.loans.filter((loan) => loan.id !== id),
        }));
        
        return true;
      },
      
      deleteAllLoans: async () => {
        // Simulate API call delay
        await new Promise((resolve) => setTimeout(resolve, 500));
        
        // Restore all books' available copies
        const bookStore = useBookStore.getState();
        const activeLoans = get().loans.filter((l) => l.status === 'active');
        
        for (const loan of activeLoans) {
          await bookStore.increaseAvailableCopies(loan.bookId);
        }
        
        set({ loans: [] });
        
        return true;
      },
      
      getLoanById: (id: string) => {
        return get().loans.find((loan) => loan.id === id);
      },
      
      getActiveLoans: () => {
        return get().loans.filter((loan) => loan.status === 'active');
      },
      
      getOverdueLoans: () => {
        const today = new Date();
        
        return get().loans.filter((loan) => {
          if (loan.status !== 'active') return false;
          
          const dueDate = new Date(loan.dueDate);
          return dueDate < today;
        });
      },
      
      getReturnedLoans: () => {
        return get().loans.filter((loan) => loan.status === 'returned');
      },
    }),
    {
      name: 'biblioteca-loans',
    }
  )
);