import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useBookStore } from '../stores/bookStore';
import { ArrowLeft, Save } from 'lucide-react';
import { BookFormData, Career } from '../types';
import { careerNames } from '../utils/mockData';
import toast from 'react-hot-toast';

const DEFAULT_COVER_IMAGES: Record<Career, string> = {
  accounting: 'https://images.pexels.com/photos/53621/calculator-calculation-insurance-finance-53621.jpeg',
  nursing: 'https://images.pexels.com/photos/4021775/pexels-photo-4021775.jpeg',
  agriculture: 'https://images.pexels.com/photos/2886937/pexels-photo-2886937.jpeg',
  computing: 'https://images.pexels.com/photos/1181675/pexels-photo-1181675.jpeg',
};

const BookForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getBookById, addBook, updateBook } = useBookStore();
  
  const isEditMode = !!id;
  const book = id ? getBookById(id) : null;
  
  const [formData, setFormData] = useState<BookFormData>({
    title: '',
    author: '',
    isbn: '',
    publishYear: new Date().getFullYear(),
    publisher: '',
    career: 'computing',
    copies: 1,
    coverImage: '',
    description: '',
    location: '',
  });
  
  const [errors, setErrors] = useState<Partial<Record<keyof BookFormData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  useEffect(() => {
    if (isEditMode && book) {
      setFormData({
        title: book.title,
        author: book.author,
        isbn: book.isbn,
        publishYear: book.publishYear,
        publisher: book.publisher,
        career: book.career,
        copies: book.copies,
        coverImage: book.coverImage || '',
        description: book.description || '',
        location: book.location || '',
      });
    } else if (isEditMode && !book) {
      toast.error('Libro no encontrado');
      navigate('/catalog');
    }
  }, [isEditMode, book, navigate]);
  
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    
    if (name === 'copies' || name === 'publishYear') {
      setFormData({
        ...formData,
        [name]: parseInt(value, 10) || 0,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
    
    // Clear error when field is edited
    if (errors[name as keyof BookFormData]) {
      setErrors({
        ...errors,
        [name]: undefined,
      });
    }
  };
  
  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof BookFormData, string>> = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'El título es requerido';
    }
    
    if (!formData.author.trim()) {
      newErrors.author = 'El autor es requerido';
    }
    
    if (!formData.isbn.trim()) {
      newErrors.isbn = 'El ISBN es requerido';
    }
    
    if (!formData.publisher.trim()) {
      newErrors.publisher = 'La editorial es requerida';
    }
    
    if (formData.publishYear < 1800 || formData.publishYear > new Date().getFullYear()) {
      newErrors.publishYear = 'El año de publicación es inválido';
    }
    
    if (formData.copies < 1) {
      newErrors.copies = 'Debe haber al menos una copia';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleCareerChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const career = e.target.value as Career;
    setFormData({
      ...formData,
      career,
      coverImage: formData.coverImage || DEFAULT_COVER_IMAGES[career],
    });
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Ensure we have a cover image
      const dataToSubmit = {
        ...formData,
        coverImage: formData.coverImage || DEFAULT_COVER_IMAGES[formData.career],
      };
      
      if (isEditMode && id) {
        await updateBook(id, dataToSubmit);
        toast.success('Libro actualizado correctamente');
      } else {
        await addBook(dataToSubmit);
        toast.success('Libro agregado correctamente');
      }
      
      navigate(`/catalog/${formData.career}`);
    } catch {
      toast.error('Ha ocurrido un error');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <button
          onClick={() => navigate(-1)}
          className="mr-3 p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {isEditMode ? 'Editar Libro' : 'Agregar Nuevo Libro'}
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            {isEditMode
              ? 'Actualiza la información del libro'
              : 'Completa el formulario para agregar un nuevo libro al catálogo'}
          </p>
        </div>
      </div>
      
      <div className="card overflow-hidden">
        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-6 md:col-span-1">
              <div className="form-group">
                <label htmlFor="title" className="form-label">
                  Título <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className={`input ${errors.title ? 'border-red-500' : ''}`}
                  placeholder="Introducción a la Programación"
                />
                {errors.title && (
                  <p className="mt-1 text-xs text-red-500">{errors.title}</p>
                )}
              </div>
              
              <div className="form-group">
                <label htmlFor="author" className="form-label">
                  Autor <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="author"
                  name="author"
                  value={formData.author}
                  onChange={handleChange}
                  className={`input ${errors.author ? 'border-red-500' : ''}`}
                  placeholder="Juan Pérez"
                />
                {errors.author && (
                  <p className="mt-1 text-xs text-red-500">{errors.author}</p>
                )}
              </div>
              
              <div className="form-group">
                <label htmlFor="isbn" className="form-label">
                  ISBN <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="isbn"
                  name="isbn"
                  value={formData.isbn}
                  onChange={handleChange}
                  className={`input ${errors.isbn ? 'border-red-500' : ''}`}
                  placeholder="978-3-16-148410-0"
                />
                {errors.isbn && <p className="mt-1 text-xs text-red-500">{errors.isbn}</p>}
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="form-group">
                  <label htmlFor="publishYear" className="form-label">
                    Año <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    id="publishYear"
                    name="publishYear"
                    value={formData.publishYear}
                    onChange={handleChange}
                    className={`input ${errors.publishYear ? 'border-red-500' : ''}`}
                    min="1800"
                    max={new Date().getFullYear()}
                  />
                  {errors.publishYear && (
                    <p className="mt-1 text-xs text-red-500">{errors.publishYear}</p>
                  )}
                </div>
                
                <div className="form-group">
                  <label htmlFor="copies" className="form-label">
                    Copias <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    id="copies"
                    name="copies"
                    value={formData.copies}
                    onChange={handleChange}
                    className={`input ${errors.copies ? 'border-red-500' : ''}`}
                    min="1"
                  />
                  {errors.copies && (
                    <p className="mt-1 text-xs text-red-500">{errors.copies}</p>
                  )}
                </div>
              </div>
              
              <div className="form-group">
                <label htmlFor="publisher" className="form-label">
                  Editorial <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="publisher"
                  name="publisher"
                  value={formData.publisher}
                  onChange={handleChange}
                  className={`input ${errors.publisher ? 'border-red-500' : ''}`}
                  placeholder="Editorial Académica"
                />
                {errors.publisher && (
                  <p className="mt-1 text-xs text-red-500">{errors.publisher}</p>
                )}
              </div>
            </div>
            
            <div className="space-y-6 md:col-span-1">
              <div className="form-group">
                <label htmlFor="career" className="form-label">
                  Carrera <span className="text-red-500">*</span>
                </label>
                <select
                  id="career"
                  name="career"
                  value={formData.career}
                  onChange={handleCareerChange}
                  className="input"
                >
                  {Object.entries(careerNames).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="form-group">
                <label htmlFor="coverImage" className="form-label">
                  URL de Portada
                </label>
                <input
                  type="text"
                  id="coverImage"
                  name="coverImage"
                  value={formData.coverImage}
                  onChange={handleChange}
                  className="input"
                  placeholder="https://ejemplo.com/imagen.jpg"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Deja en blanco para usar la portada predeterminada
                </p>
              </div>
              
              <div className="form-group">
                <label htmlFor="location" className="form-label">
                  Ubicación
                </label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="input"
                  placeholder="Estante 3, Sección B"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="description" className="form-label">
                  Descripción
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="input min-h-[100px]"
                  placeholder="Breve descripción del libro..."
                />
              </div>
            </div>
          </div>
          
          <div className="mt-8 flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="btn bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn btn-primary flex items-center"
            >
              <Save className="h-5 w-5 mr-2" />
              {isSubmitting
                ? 'Guardando...'
                : isEditMode
                ? 'Actualizar Libro'
                : 'Guardar Libro'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookForm;