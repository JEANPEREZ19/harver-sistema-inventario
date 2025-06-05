import React, { useState, useEffect, useMemo } from 'react'; // Se añadió useMemo
import { useNavigate } from 'react-router-dom';
import { useBookStore } from '../stores/bookStore';
import { useStudentStore } from '../stores/studentStore';
import { useLoanStore } from '../stores/loanStore';
import { format, addDays } from 'date-fns';
import { Search, CalendarPlus, BookOpen, User, Filter } from 'lucide-react'; // Se añadió Filter para el icono
import { LoanFormData, Book, Student, Career } from '../types'; // Se añadió Career
import { careerNames } from '../utils/mockData';
import toast from 'react-hot-toast';

const LoanRegistry: React.FC = () => {
  const navigate = useNavigate();
  const { books } = useBookStore();
  const { students } = useStudentStore();
  const { addLoan } = useLoanStore();

  const [formData, setFormData] = useState<LoanFormData>({
    bookId: '',
    studentId: '',
    loanDate: format(new Date(), 'yyyy-MM-dd'),
    dueDate: format(addDays(new Date(), 14), 'yyyy-MM-dd'),
    notes: '',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof LoanFormData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Search and filter states
  const [bookSearchTerm, setBookSearchTerm] = useState('');
  const [studentSearchTerm, setStudentSearchTerm] = useState('');
  const [studentCareerFilter, setStudentCareerFilter] = useState<string>('all'); // Renombrado para claridad
  const [bookCareerFilter, setBookCareerFilter] = useState<string>('all'); // Nuevo estado para filtro de carrera de libros

  // Selected items
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  // Filter books with available copies and by search term and career
  const availableBooks = useMemo(() => {
    return books.filter(
      (book) =>
        book.availableCopies > 0 &&
        (bookSearchTerm === '' ||
          book.title.toLowerCase().includes(bookSearchTerm.toLowerCase()) ||
          book.author.toLowerCase().includes(bookSearchTerm.toLowerCase()) ||
          book.isbn.includes(bookSearchTerm)) &&
        (bookCareerFilter === 'all' || book.career === bookCareerFilter) // Filtrar por carrera del libro
    );
  }, [books, bookSearchTerm, bookCareerFilter]); // Dependencias actualizadas

  // Filter students by search term and career
  const filteredStudents = useMemo(() => { // Añadido useMemo aquí también por consistencia y buena práctica
    return students.filter(
      (student) =>
        (studentSearchTerm === '' ||
          student.name.toLowerCase().includes(studentSearchTerm.toLowerCase()) ||
          student.lastName.toLowerCase().includes(studentSearchTerm.toLowerCase()) ||
          student.studentId.includes(studentSearchTerm)) &&
        (studentCareerFilter === 'all' || student.career === studentCareerFilter)
    );
  }, [students, studentSearchTerm, studentCareerFilter]); // Dependencias actualizadas

  // Update form when selections change
  useEffect(() => {
    if (selectedBook) {
      setFormData((prev) => ({
        ...prev,
        bookId: selectedBook.id,
      }));
    } else { // Si no hay libro seleccionado, limpiar el bookId del formulario
      setFormData((prev) => ({
        ...prev,
        bookId: '',
      }));
    }
  }, [selectedBook]);

  useEffect(() => {
    if (selectedStudent) {
      setFormData((prev) => ({
        ...prev,
        studentId: selectedStudent.id,
      }));
    } else { // Si no hay estudiante seleccionado, limpiar el studentId del formulario
      setFormData((prev) => ({
        ...prev,
        studentId: '',
      }));
    }
  }, [selectedStudent]);


  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });

    if (errors[name as keyof LoanFormData]) {
      setErrors({
        ...errors,
        [name]: undefined,
      });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof LoanFormData, string>> = {};

    if (!formData.bookId) {
      newErrors.bookId = 'Debe seleccionar un libro';
    }

    if (!formData.studentId) {
      newErrors.studentId = 'Debe seleccionar un estudiante';
    }

    if (!formData.loanDate) {
      newErrors.loanDate = 'La fecha de préstamo es requerida';
    }

    if (!formData.dueDate) {
      newErrors.dueDate = 'La fecha de devolución es requerida';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await addLoan(formData);

      if (result) {
        toast.success('Préstamo registrado correctamente');
        navigate('/loans/records');
      } else {
        toast.error('Error al registrar el préstamo (posiblemente no hay copias o el libro no existe)');
      }
    } catch (error) {
      toast.error('Ha ocurrido un error al conectar con el servicio');
      console.error("Loan submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectBook = (book: Book) => {
    setSelectedBook(book);
    // No limpiar bookSearchTerm para que el usuario vea qué filtró
  };

  const selectStudent = (student: Student) => {
    setSelectedStudent(student);
    // No limpiar studentSearchTerm
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Registrar Nuevo Préstamo</h1>
        <p className="mt-1 text-sm text-gray-500">
          Selecciona un libro y un estudiante para registrar el préstamo
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Book Selection */}
        <div className="lg:col-span-1 space-y-4">
          <div className="card p-4">
            <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <BookOpen className="h-5 w-5 text-blue-600 mr-2" />
              Seleccionar Libro
            </h2>

            <div className="relative mb-2"> {/* Reducido mb */}
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="pl-10 pr-3 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Buscar por título, autor o ISBN..."
                value={bookSearchTerm}
                onChange={(e) => {
                  setBookSearchTerm(e.target.value);
                  setSelectedBook(null); // Deseleccionar libro si se cambia el término de búsqueda
                }}
              />
            </div>

            <div className="relative mb-4"> {/* Añadido div para el select */}
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Filter className="h-5 w-5 text-gray-400" />
              </div>
              <select
                className="w-full border border-gray-300 rounded-md pl-10 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={bookCareerFilter}
                onChange={(e) => {
                  setBookCareerFilter(e.target.value);
                  setSelectedBook(null); // Deseleccionar libro si se cambia el filtro de carrera
                }}
              >
                <option value="all">Todas las carreras</option>
                {Object.entries(careerNames).map(([value, label]) => (
                  <option key={value} value={value as Career}>
                    {label}
                  </option>
                ))}
              </select>
            </div>

            {errors.bookId && <p className="text-sm text-red-500 mb-2">{errors.bookId}</p>}

            <div className="h-72 overflow-y-auto border border-gray-200 rounded-md">
              {availableBooks.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full p-4 text-center">
                  <BookOpen className="h-8 w-8 text-gray-400 mb-2" />
                  <p className="text-gray-500">
                    {bookSearchTerm || bookCareerFilter !== 'all'
                      ? 'No se encontraron libros disponibles con los filtros aplicados.'
                      : 'No hay libros disponibles.'}
                  </p>
                </div>
              ) : (
                <ul className="divide-y divide-gray-200">
                  {availableBooks.map((book) => (
                    <li
                      key={book.id}
                      className={`p-3 hover:bg-blue-50 cursor-pointer ${
                        selectedBook?.id === book.id ? 'bg-blue-100 border-l-4 border-blue-500' : 'border-l-4 border-transparent'
                      }`}
                      onClick={() => selectBook(book)}
                    >
                      <div className="flex items-start">
                        {book.coverImage && (
                          <img
                            src={book.coverImage}
                            alt={book.title}
                            className="h-12 w-9 object-cover rounded mr-3 flex-shrink-0"
                          />
                        )}
                        <div className="flex-grow min-w-0">
                          <h3 className="text-sm font-medium text-gray-900 line-clamp-1">
                            {book.title}
                          </h3>
                          <p className="text-xs text-gray-500 line-clamp-1">{book.author}</p>
                          <div className="flex items-center mt-1 flex-wrap">
                            <span className="text-xs text-gray-500 mr-2">
                              {careerNames[book.career]}
                            </span>
                            <span className="text-xs text-green-600 font-semibold">
                              {book.availableCopies} disponibles
                            </span>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>

        {/* Student Selection */}
        <div className="lg:col-span-1 space-y-4">
          <div className="card p-4">
            <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <User className="h-5 w-5 text-blue-600 mr-2" />
              Seleccionar Estudiante
            </h2>

            <div className="space-y-2 mb-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="pl-10 pr-3 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Buscar por nombre o ID..."
                  value={studentSearchTerm}
                  onChange={(e) => {
                    setStudentSearchTerm(e.target.value);
                    setSelectedStudent(null); // Deseleccionar estudiante si se cambia el término de búsqueda
                  }}
                />
              </div>

              <div className="relative"> {/* Añadido div para el select de carrera de estudiante */}
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Filter className="h-5 w-5 text-gray-400" />
                </div>
                <select
                  className="w-full border border-gray-300 rounded-md pl-10 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={studentCareerFilter}
                  onChange={(e) => {
                    setStudentCareerFilter(e.target.value);
                    setSelectedStudent(null); // Deseleccionar estudiante si se cambia el filtro de carrera
                  }}
                >
                  <option value="all">Todas las carreras</option>
                  {Object.entries(careerNames).map(([value, label]) => (
                    <option key={value} value={value as Career}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {errors.studentId && (
              <p className="text-sm text-red-500 mb-2">{errors.studentId}</p>
            )}

            <div className="h-72 overflow-y-auto border border-gray-200 rounded-md">
              {filteredStudents.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full p-4 text-center">
                  <User className="h-8 w-8 text-gray-400 mb-2" />
                  <p className="text-gray-500">
                    {studentSearchTerm || studentCareerFilter !== 'all'
                      ? 'No se encontraron estudiantes con los filtros aplicados.'
                      : 'No hay estudiantes registrados.'}
                  </p>
                </div>
              ) : (
                <ul className="divide-y divide-gray-200">
                  {filteredStudents.map((student) => (
                    <li
                      key={student.id}
                      className={`p-3 hover:bg-blue-50 cursor-pointer ${
                        selectedStudent?.id === student.id ? 'bg-blue-100 border-l-4 border-blue-500' : 'border-l-4 border-transparent'
                      }`}
                      onClick={() => selectStudent(student)}
                    >
                      <div className="min-w-0">
                        <h3 className="text-sm font-medium text-gray-900 line-clamp-1">
                          {student.name} {student.lastName}
                        </h3>
                        <p className="text-xs text-gray-500">ID: {student.studentId}</p>
                        <div className="flex items-center mt-1 flex-wrap">
                          <span className="text-xs text-gray-500 mr-2">
                            {careerNames[student.career]}
                          </span>
                           <span className="text-xs text-gray-500">
                            Ciclo {student.cycle}
                          </span>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>

        {/* Loan Form */}
        <div className="lg:col-span-1 space-y-4">
          <div className="card p-4">
            <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <CalendarPlus className="h-5 w-5 text-blue-600 mr-2" />
              Detalles del Préstamo
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              {selectedBook && (
                <div className="mb-4 p-3 bg-blue-50 rounded-md border border-blue-200">
                  <h3 className="text-sm font-medium text-gray-900">Libro Seleccionado:</h3>
                  <p className="text-sm text-gray-700">{selectedBook.title}</p>
                  <p className="text-xs text-gray-500">
                    {selectedBook.author} • {careerNames[selectedBook.career]}
                  </p>
                </div>
              )}

              {selectedStudent && (
                <div className="mb-4 p-3 bg-blue-50 rounded-md border border-blue-200">
                  <h3 className="text-sm font-medium text-gray-900">Estudiante Seleccionado:</h3>
                  <p className="text-sm text-gray-700">
                    {selectedStudent.name} {selectedStudent.lastName}
                  </p>
                  <p className="text-xs text-gray-500">
                    ID: {selectedStudent.studentId} • {careerNames[selectedStudent.career]}
                  </p>
                </div>
              )}

              <div className="form-group">
                <label htmlFor="loanDate" className="form-label">
                  Fecha de Préstamo <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  id="loanDate"
                  name="loanDate"
                  value={formData.loanDate}
                  onChange={handleDateChange}
                  className={`input ${errors.loanDate ? 'border-red-500' : ''}`}
                />
                {errors.loanDate && (
                  <p className="mt-1 text-xs text-red-500">{errors.loanDate}</p>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="dueDate" className="form-label">
                  Fecha de Devolución <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  id="dueDate"
                  name="dueDate"
                  value={formData.dueDate}
                  onChange={handleDateChange}
                  className={`input ${errors.dueDate ? 'border-red-500' : ''}`}
                  min={formData.loanDate}
                />
                {errors.dueDate && (
                  <p className="mt-1 text-xs text-red-500">{errors.dueDate}</p>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="notes" className="form-label">
                  Notas (Opcional)
                </label>
                <textarea
                  id="notes"
                  name="notes"
                  value={formData.notes || ''}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="input min-h-[80px]"
                  placeholder="Añadir notas sobre el préstamo..."
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting || !selectedBook || !selectedStudent}
                className="w-full btn btn-primary mt-6 disabled:opacity-50"
              >
                {isSubmitting ? 'Registrando...' : 'Registrar Préstamo'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoanRegistry;