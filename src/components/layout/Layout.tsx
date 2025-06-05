// src/components/layout/Layout.tsx

import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

const Layout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  
  return (
    // Contenedor principal del layout
    <div className="min-h-screen flex bg-gray-100 dark:bg-gray-900"> {/* Asegura el fondo para modo oscuro */}
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      
      {/* Contenedor del contenido principal (Navbar + main + footer) */}
      {/* Se eliminó lg:pl-64 de aquí */}
      <div className="flex-1 flex flex-col"> 
        <Navbar onMenuButtonClick={() => setSidebarOpen(true)} />
        
        <main className="flex-1 py-6 px-4 md:px-6 bg-gray-100 dark:bg-gray-900"> {/* Fondo para el contenido principal */}
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
        
        <footer className="bg-white dark:bg-gray-800 dark:border-gray-700 py-4 border-t border-gray-200"> {/* Estilos para el footer en modo oscuro */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <p className="text-center text-sm text-gray-500 dark:text-gray-400">
              © {new Date().getFullYear()} Sistema de Gestión Bibliotecaria. Todos los derechos reservados.
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Layout;