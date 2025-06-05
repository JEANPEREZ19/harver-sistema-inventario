// Authentication types
export interface User {
  id: string;
  username: string;
  name: string;
  role: 'admin' | 'librarian';
}

export interface LoginCredentials {
  username: string;
  password: string;
}

// Book types
export interface Book {
  id: string;
  title: string;
  author: string;
  isbn: string;
  publishYear: number;
  publisher: string;
  career: Career;
  copies: number;
  availableCopies: number;
  coverImage?: string;
  description?: string;
  location?: string;
  createdAt: string;
  updatedAt: string;
}

export type Career = 'accounting' | 'nursing' | 'agriculture' | 'computing';

export interface BookFormData {
  title: string;
  author: string;
  isbn: string;
  publishYear: number;
  publisher: string;
  career: Career;
  copies: number;
  coverImage?: string;
  description?: string;
  location?: string;
}

// Student types
export interface Student {
  id: string;
  studentId: string;
  name: string;
  lastName: string;
  email: string;
  career: Career;
  cycle: number;
  phone?: string;
  createdAt: string;
  updatedAt: string;
}

export interface StudentFormData {
  studentId: string;
  name: string;
  lastName: string;
  email: string;
  career: Career;
  cycle: number;
  phone?: string;
}

// Loan types
export interface Loan {
  id: string;
  bookId: string;
  book: Book;
  studentId: string;
  student: Student;
  loanDate: string;
  dueDate: string;
  returnDate?: string;
  status: 'active' | 'returned' | 'overdue';
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface LoanFormData {
  bookId: string;
  studentId: string;
  loanDate: string;
  dueDate: string;
  notes?: string;
}