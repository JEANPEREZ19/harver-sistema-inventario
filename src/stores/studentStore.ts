import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Student, StudentFormData, Career } from '../types';
import { generateMockStudents } from '../utils/mockData';

interface StudentState {
  students: Student[];
  isLoading: boolean;
  addStudent: (student: StudentFormData) => Promise<Student>;
  updateStudent: (id: string, student: StudentFormData) => Promise<Student | null>;
  deleteStudent: (id: string) => Promise<boolean>;
  getStudentById: (id: string) => Student | undefined;
  getStudentsByCareer: (career: Career) => Student[];
  getStudentsByCycle: (career: Career, cycle: number) => Student[];
}

// Initialize with mock data
const initialStudents = generateMockStudents(100);

export const useStudentStore = create<StudentState>()(
  persist(
    (set, get) => ({
      students: initialStudents,
      isLoading: false,
      
      addStudent: async (studentData: StudentFormData) => {
        // Simulate API call delay
        await new Promise((resolve) => setTimeout(resolve, 500));
        
        const newStudent: Student = {
          id: crypto.randomUUID(),
          ...studentData,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        
        set((state) => ({
          students: [...state.students, newStudent],
        }));
        
        return newStudent;
      },
      
      updateStudent: async (id: string, studentData: StudentFormData) => {
        // Simulate API call delay
        await new Promise((resolve) => setTimeout(resolve, 500));
        
        const student = get().students.find((s) => s.id === id);
        
        if (!student) return null;
        
        const updatedStudent: Student = {
          ...student,
          ...studentData,
          updatedAt: new Date().toISOString(),
        };
        
        set((state) => ({
          students: state.students.map((s) => (s.id === id ? updatedStudent : s)),
        }));
        
        return updatedStudent;
      },
      
      deleteStudent: async (id: string) => {
        // Simulate API call delay
        await new Promise((resolve) => setTimeout(resolve, 500));
        
        set((state) => ({
          students: state.students.filter((student) => student.id !== id),
        }));
        
        return true;
      },
      
      getStudentById: (id: string) => {
        return get().students.find((student) => student.id === id);
      },
      
      getStudentsByCareer: (career: Career) => {
        return get().students.filter((student) => student.career === career);
      },
      
      getStudentsByCycle: (career: Career, cycle: number) => {
        return get().students.filter(
          (student) => student.career === career && student.cycle === cycle
        );
      },
    }),
    {
      name: 'biblioteca-students',
    }
  )
);