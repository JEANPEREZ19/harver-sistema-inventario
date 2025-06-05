import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Book, BookFormData, Career } from '../types';
import { generateMockBooks } from '../utils/mockData';

interface BookState {
  books: Book[];
  isLoading: boolean;
  addBook: (book: BookFormData) => Promise<Book>;
  updateBook: (id: string, book: BookFormData) => Promise<Book | null>;
  deleteBook: (id: string) => Promise<boolean>;
  getBookById: (id: string) => Book | undefined;
  getBooksByCareer: (career: Career) => Book[];
  decreaseAvailableCopies: (id: string) => Promise<boolean>;
  increaseAvailableCopies: (id: string) => Promise<boolean>;
}

// Initialize with mock data
const initialBooks = generateMockBooks(40);

export const useBookStore = create<BookState>()(
  persist(
    (set, get) => ({
      books: initialBooks,
      isLoading: false,
      
      addBook: async (bookData: BookFormData) => {
        // Simulate API call delay
        await new Promise((resolve) => setTimeout(resolve, 500));
        
        const newBook: Book = {
          id: crypto.randomUUID(),
          ...bookData,
          availableCopies: bookData.copies,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        
        set((state) => ({
          books: [...state.books, newBook],
        }));
        
        return newBook;
      },
      
      updateBook: async (id: string, bookData: BookFormData) => {
        // Simulate API call delay
        await new Promise((resolve) => setTimeout(resolve, 500));
        
        const book = get().books.find((b) => b.id === id);
        
        if (!book) return null;
        
        const updatedBook: Book = {
          ...book,
          ...bookData,
          availableCopies: bookData.copies - (book.copies - book.availableCopies),
          updatedAt: new Date().toISOString(),
        };
        
        set((state) => ({
          books: state.books.map((b) => (b.id === id ? updatedBook : b)),
        }));
        
        return updatedBook;
      },
      
      deleteBook: async (id: string) => {
        // Simulate API call delay
        await new Promise((resolve) => setTimeout(resolve, 500));
        
        set((state) => ({
          books: state.books.filter((book) => book.id !== id),
        }));
        
        return true;
      },
      
      getBookById: (id: string) => {
        return get().books.find((book) => book.id === id);
      },
      
      getBooksByCareer: (career: Career) => {
        return get().books.filter((book) => book.career === career);
      },
      
      decreaseAvailableCopies: async (id: string) => {
        const book = get().books.find((b) => b.id === id);
        
        if (!book || book.availableCopies <= 0) return false;
        
        set((state) => ({
          books: state.books.map((b) =>
            b.id === id ? { ...b, availableCopies: b.availableCopies - 1 } : b
          ),
        }));
        
        return true;
      },
      
      increaseAvailableCopies: async (id: string) => {
        const book = get().books.find((b) => b.id === id);
        
        if (!book || book.availableCopies >= book.copies) return false;
        
        set((state) => ({
          books: state.books.map((b) =>
            b.id === id ? { ...b, availableCopies: b.availableCopies + 1 } : b
          ),
        }));
        
        return true;
      },
    }),
    {
      name: 'biblioteca-books',
    }
  )
);