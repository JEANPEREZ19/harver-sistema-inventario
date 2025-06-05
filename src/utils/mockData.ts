import { Book, Student, Loan, Career } from '../types';
import { addDays, subDays } from 'date-fns';

// Career names in Spanish
export const careerNames: Record<Career, string> = {
  accounting: 'Contabilidad',
  nursing: 'Enfermería',
  agriculture: 'Agropecuaria',
  computing: 'Apsti',
};

// Book covers by career
const bookCoversByCareer: Record<Career, string[]> = {
  accounting: [
    'https://images.pexels.com/photos/53621/calculator-calculation-insurance-finance-53621.jpeg',
    'https://images.pexels.com/photos/4386321/pexels-photo-4386321.jpeg',
    'https://images.pexels.com/photos/5849577/pexels-photo-5849577.jpeg',
  ],
  nursing: [
    'https://images.pexels.com/photos/4021775/pexels-photo-4021775.jpeg',
    'https://images.pexels.com/photos/5214958/pexels-photo-5214958.jpeg',
    'https://images.pexels.com/photos/3938022/pexels-photo-3938022.jpeg',
  ],
  agriculture: [
    'https://images.pexels.com/photos/2886937/pexels-photo-2886937.jpeg',
    'https://images.pexels.com/photos/2132250/pexels-photo-2132250.jpeg',
    'https://images.pexels.com/photos/2165688/pexels-photo-2165688.jpeg',
  ],
  computing: [
    'https://images.pexels.com/photos/1181675/pexels-photo-1181675.jpeg',
    'https://images.pexels.com/photos/577585/pexels-photo-577585.jpeg',
    'https://images.pexels.com/photos/4709285/pexels-photo-4709285.jpeg',
  ],
};

// Random selection helper
const randomItem = <T>(array: T[]): T => {
  return array[Math.floor(Math.random() * array.length)];
};

// Random boolean with probability
const randomBool = (probability = 0.5): boolean => {
  return Math.random() < probability;
};

// Random number within range
const randomInt = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Book titles by career
const bookTitlesByCareer: Record<Career, string[]> = {
  accounting: [
    'Contabilidad Financiera',
    'Auditoría y Control Interno',
    'Costos y Presupuestos',
    'Finanzas Corporativas',
    'Tributación Empresarial',
    'Análisis de Estados Financieros',
    'Normas Internacionales de Contabilidad',
    'Matemáticas Financieras',
    'Contabilidad Gerencial',
    'Sistemas Contables Computarizados',
  ],
  nursing: [
    'Anatomía y Fisiología Humana',
    'Farmacología Clínica',
    'Cuidados Intensivos',
    'Enfermería Materno-Infantil',
    'Nutrición y Dietética',
    'Salud Pública y Epidemiología',
    'Psicología de la Salud',
    'Emergencias y Primeros Auxilios',
    'Ética y Legislación en Enfermería',
    'Geriatría y Cuidados Paliativos',
  ],
  agriculture: [
    'Producción Animal',
    'Cultivos Agrícolas',
    'Suelos y Fertilización',
    'Sistemas de Riego',
    'Agronegocios y Comercialización',
    'Sanidad Vegetal',
    'Agricultura Sostenible',
    'Maquinaria Agrícola',
    'Genética y Mejoramiento Animal',
    'Manejo Post-Cosecha',
  ],
  computing: [
    'Fundamentos de Programación',
    'Bases de Datos Relacionales',
    'Redes y Comunicaciones',
    'Desarrollo Web Avanzado',
    'Seguridad Informática',
    'Inteligencia Artificial',
    'Sistemas Operativos',
    'Arquitectura de Computadoras',
    'Desarrollo de Aplicaciones Móviles',
    'Ingeniería de Software',
  ],
};

// Publishers
const publishers = [
  'Editorial Académica',
  'Educación Superior',
  'Publicaciones Universitarias',
  'Libros Técnicos S.A.',
  'Editorial Científica',
  'Grupo Editorial Profesional',
  'Ediciones Educativas',
];

// Authors
const authors = [
  'María Rodríguez',
  'Juan Carlos Pérez',
  'Ana Sofía Mendoza',
  'Roberto Gómez',
  'Laura Fernández',
  'Carlos Alberto Torres',
  'Patricia Ramírez',
  'Miguel Ángel Sánchez',
  'Gabriela López',
  'Fernando Martínez',
];

// Generate a mock book
const generateMockBook = (id: string, career: Career): Book => {
  const copies = randomInt(1, 10);
  const loanedCopies = randomInt(0, copies);
  
  return {
    id,
    title: randomItem(bookTitlesByCareer[career]),
    author: randomItem(authors),
    isbn: `978-${randomInt(1000000000, 9999999999)}`,
    publishYear: randomInt(2000, 2023),
    publisher: randomItem(publishers),
    career,
    copies,
    availableCopies: copies - loanedCopies,
    coverImage: randomItem(bookCoversByCareer[career]),
    description: 'Libro de texto para estudiantes universitarios',
    location: `Estante ${randomInt(1, 20)}`,
    createdAt: subDays(new Date(), randomInt(30, 365)).toISOString(),
    updatedAt: subDays(new Date(), randomInt(0, 30)).toISOString(),
  };
};

// Generate mock books
export const generateMockBooks = (count: number): Book[] => {
  const books: Book[] = [];
  const careers: Career[] = ['accounting', 'nursing', 'agriculture', 'computing'];
  
  for (let i = 0; i < count; i++) {
    const career = careers[i % careers.length];
    books.push(generateMockBook(crypto.randomUUID(), career));
  }
  
  return books;
};

// Student names and last names
const studentFirstNames = [
  'Ana', 'Luis', 'María', 'Carlos', 'Laura', 'José', 'Sofía', 'Miguel',
  'Sara', 'Diego', 'Valentina', 'Pedro', 'Jean', 'Jorge', 'Valeria',
];

const studentLastNames = [
  'González', 'Rodríguez', 'López', 'Martínez', 'Pérez', 'Sánchez', 'Romero',
  'Torres', 'Ramírez', 'Flores', 'Vargas', 'Mendoza', 'Díaz', 'Herrera', 'Silva',
];

// Generate a mock student
const generateMockStudent = (id: string): Student => {
  const career = randomItem(['accounting', 'nursing', 'agriculture', 'computing'] as Career[]);
  const name = randomItem(studentFirstNames);
  const lastName = randomItem(studentLastNames);
  const cycle = randomInt(1, 6);
  
  return {
    id,
    studentId: `${randomItem(['A', 'B', 'C', 'D'])}${randomInt(10000, 99999)}`,
    name,
    lastName,
    email: `${name.toLowerCase()}.${lastName.toLowerCase()}@alumnos.edu.pe`,
    career,
    cycle,
    phone: randomBool(0.7) ? `9${randomInt(10000000, 99999999)}` : undefined,
    createdAt: subDays(new Date(), randomInt(30, 365)).toISOString(),
    updatedAt: subDays(new Date(), randomInt(0, 30)).toISOString(),
  };
};

// Generate mock students
export const generateMockStudents = (count: number): Student[] => {
  const students: Student[] = [];
  
  for (let i = 0; i < count; i++) {
    students.push(generateMockStudent(crypto.randomUUID()));
  }
  
  return students;
};

// Generate a mock loan
const generateMockLoan = (id: string, books: Book[], students: Student[]): Loan => {
  const book = randomItem(books);
  const student = randomItem(students.filter((s) => s.career === book.career));
  
  const loanDate = subDays(new Date(), randomInt(1, 30));
  const dueDate = addDays(loanDate, randomInt(7, 21));
  const isReturned = randomBool(0.6);
  
  let returnDate: string | undefined = undefined;
  let status: 'active' | 'returned' | 'overdue' = 'active';
  
  if (isReturned) {
    returnDate = addDays(loanDate, randomInt(1, 20)).toISOString();
    status = 'returned';
  } else if (dueDate < new Date()) {
    status = 'overdue';
  }
  
  return {
    id,
    bookId: book.id,
    book,
    studentId: student.id,
    student,
    loanDate: loanDate.toISOString(),
    dueDate: dueDate.toISOString(),
    returnDate,
    status,
    notes: randomBool(0.3) ? 'Préstamo para proyecto de clase' : undefined,
    createdAt: loanDate.toISOString(),
    updatedAt: returnDate || new Date().toISOString(),
  };
};

// Generate mock loans
export const generateMockLoans = (count: number): Loan[] => {
  const books = generateMockBooks(20);
  const students = generateMockStudents(30);
  const loans: Loan[] = [];
  
  for (let i = 0; i < count; i++) {
    loans.push(generateMockLoan(crypto.randomUUID(), books, students));
  }
  
  return loans;
};