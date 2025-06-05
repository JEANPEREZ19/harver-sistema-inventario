import React from 'react';
import { Link } from 'react-router-dom';
import { useBookStore } from '../stores/bookStore';
import { Book as BookIcon, Plus } from 'lucide-react';
import { careerNames } from '../utils/mockData';

const Catalog: React.FC = () => {
  const { books } = useBookStore();
  
  // Group books by career
  const booksByCareer = books.reduce((acc, book) => {
    if (!acc[book.career]) {
      acc[book.career] = [];
    }
    acc[book.career].push(book);
    return acc;
  }, {} as Record<string, typeof books>);
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Catálogo de Libros</h1>
          <p className="mt-1 text-sm text-gray-500">
            Explora nuestro catálogo completo de libros por carrera
          </p>
        </div>
        
        <Link
          to="/catalog/add"
          className="btn btn-primary flex items-center"
        >
          <Plus className="h-5 w-5 mr-2" />
          Agregar Libro
        </Link>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Object.entries(careerNames).map(([career, name]) => (
          <div key={career} className="card overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-white">{name}</h2>
                <div className="flex items-center bg-white bg-opacity-20 rounded-full px-3 py-1">
                  <BookIcon className="h-4 w-4 text-white mr-1" />
                  <span className="text-sm text-white">
                    {booksByCareer[career]?.length || 0} libros
                  </span>
                </div>
              </div>
            </div>
            
            <div className="p-6">
              <div className="space-y-4">
                {booksByCareer[career]?.slice(0, 3).map((book) => (
                  <div key={book.id} className="flex items-center">
                    {book.coverImage && (
                      <img
                        src={book.coverImage}
                        alt={book.title}
                        className="h-16 w-12 object-cover rounded-sm shadow-sm"
                      />
                    )}
                    <div className="ml-4">
                      <h3 className="text-sm font-medium text-gray-900">{book.title}</h3>
                      <p className="text-xs text-gray-500">{book.author}</p>
                      <p className="text-xs text-gray-500">
                        Disponibles: {book.availableCopies} de {book.copies}
                      </p>
                    </div>
                  </div>
                ))}
                
                {(!booksByCareer[career] || booksByCareer[career].length === 0) && (
                  <p className="text-sm text-gray-500">No hay libros disponibles</p>
                )}
              </div>
              
              <div className="mt-6">
                <Link
                  to={`/catalog/${career}`}
                  className="w-full btn btn-secondary"
                >
                  Ver Todos
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Catalog;