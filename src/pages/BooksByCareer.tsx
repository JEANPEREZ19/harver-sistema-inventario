import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useBookStore } from '../stores/bookStore';
import { 
  Edit, 
  Trash2, 
  Plus, 
  Search, 
  ArrowLeft,
  BookOpen
} from 'lucide-react';
import { careerNames } from '../utils/mockData';
import toast from 'react-hot-toast';

const BooksByCareer: React.FC = () => {
  const { career } = useParams<{ career: string }>();
  const navigate = useNavigate();
  const { books, deleteBook } = useBookStore();
  const [searchTerm, setSearchTerm] = useState('');
  
  if (!career || !Object.keys(careerNames).includes(career)) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-xl font-semibold text-gray-700">Carrera no encontrada</h2>
        <p className="mt-2 text-gray-500">La carrera especificada no existe.</p>
        <Link to="/catalog" className="mt-4 btn btn-primary inline-block">
          Volver al Catálogo
        </Link>
      </div>
    );
  }
  
  const careerBooks = books
    .filter((book) => book.career === career)
    .filter((book) => 
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.isbn.includes(searchTerm)
    );
  
  const handleDeleteBook = async (id: string, title: string) => {
    if (window.confirm(`¿Está seguro de eliminar el libro "${title}"?`)) {
      await deleteBook(id);
      toast.success('Libro eliminado correctamente');
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <button
          onClick={() => navigate('/catalog')}
          className="mr-3 p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Libros de {careerNames[career as keyof typeof careerNames]}
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            {careerBooks.length} libros disponibles
          </p>
        </div>
      </div>
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="relative w-full sm:w-64">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="pl-10 pr-3 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Buscar libros..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <Link to="/catalog/add" className="btn btn-primary flex items-center">
          <Plus className="h-5 w-5 mr-2" />
          Agregar Libro
        </Link>
      </div>
      
      {careerBooks.length === 0 ? (
        <div className="bg-white p-8 rounded-lg shadow text-center">
          <BookOpen className="h-12 w-12 text-gray-400 mx-auto" />
          <h3 className="mt-4 text-lg font-medium text-gray-900">No se encontraron libros</h3>
          <p className="mt-1 text-gray-500">
            {searchTerm
              ? 'No hay resultados para tu búsqueda. Intenta con otros términos.'
              : 'Aún no hay libros registrados para esta carrera.'}
          </p>
          <Link to="/catalog/add" className="mt-4 btn btn-primary inline-flex items-center">
            <Plus className="h-5 w-5 mr-2" />
            Agregar Nuevo Libro
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {careerBooks.map((book) => (
            <div key={book.id} className="card overflow-hidden flex flex-col">
              <div className="h-40 bg-gray-200 overflow-hidden">
                {book.coverImage ? (
                  <img
                    src={book.coverImage}
                    alt={book.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-100">
                    <BookOpen className="h-12 w-12 text-gray-400" />
                  </div>
                )}
              </div>
              
              <div className="p-4 flex-1 flex flex-col">
                <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">{book.title}</h3>
                <p className="text-sm text-gray-600 mt-1">{book.author}</p>
                
                <div className="mt-2 space-y-1 text-sm text-gray-500">
                  <p>ISBN: {book.isbn}</p>
                  <p>Editorial: {book.publisher}</p>
                  <p>Año: {book.publishYear}</p>
                </div>
                
                <div className="mt-3 flex items-center">
                  <div className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium">
                    {book.availableCopies} de {book.copies} disponibles
                  </div>
                </div>
                
                <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between">
                  <Link
                    to={`/catalog/edit/${book.id}`}
                    className="text-indigo-600 hover:text-indigo-800 inline-flex items-center text-sm"
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Editar
                  </Link>
                  
                  <button
                    onClick={() => handleDeleteBook(book.id, book.title)}
                    className="text-red-600 hover:text-red-800 inline-flex items-center text-sm"
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Eliminar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BooksByCareer;