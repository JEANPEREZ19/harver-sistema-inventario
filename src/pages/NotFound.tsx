import React from 'react';
import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';

const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center px-4 py-12">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-blue-600">404</h1>
        <h2 className="mt-4 text-3xl font-bold text-gray-900">Página no encontrada</h2>
        <p className="mt-2 text-lg text-gray-600">
          Lo sentimos, la página que estás buscando no existe o ha sido movida.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="btn btn-primary inline-flex items-center"
          >
            <Home className="h-5 w-5 mr-2" />
            Volver al Inicio
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;