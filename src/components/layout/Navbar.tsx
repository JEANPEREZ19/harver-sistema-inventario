// src/components/layout/Navbar.tsx

import React from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore'; // Ajusta la ruta si es diferente
import { LogOut, Menu as MenuIcon } from 'lucide-react';

interface NavbarProps {
  onMenuButtonClick: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onMenuButtonClick }) => {
  const { user, logout } = useAuthStore();

  return (
    <header className="sticky top-0 z-30 bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative flex items-center justify-between h-16">

          {/* Izquierda: Botón menú y logo */}
          <div className="flex items-center flex-shrink-0">
            <button
              type="button"
              className="p-2 rounded-md text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 lg:hidden mr-2"
              onClick={onMenuButtonClick}
              aria-label="Abrir menú"
            >
              <MenuIcon className="h-6 w-6" />
            </button>

            <Link to="/" className="flex items-center">
              <img
                src="./logo.png" // Ruta al logo relativa para soportar hosting estático
                alt="Logo del Sistema"
                className="h-8 w-auto sm:h-9"
              />
            </Link>
          </div>

          {/* Centro: Título centrado - MODIFICADO CON OPCIÓN 1 */}
          <div className="absolute left-1/2 transform -translate-x-1/2">
            <h1 className="text-xl sm:text-2xl font-extrabold whitespace-nowrap bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 dark:from-blue-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
              SISTEMA BIBLIOTECARIO
            </h1>
          </div>

          {/* Derecha: Usuario y logout */}
          <div className="flex items-center">
            <div className="flex items-center space-x-3">
              <div className="flex flex-col items-end">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                  {user?.name || 'Usuario'}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                  {user?.role || 'Rol'}
                </span>
              </div>
              <button
                onClick={logout}
                className="p-1.5 rounded-full text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 dark:focus:ring-offset-gray-800"
                title="Cerrar sesión"
                aria-label="Cerrar sesión"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>

        </div>
      </div>
    </header>
  );
};

export default Navbar;