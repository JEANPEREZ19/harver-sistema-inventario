// src/components/layout/Sidebar.tsx
import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  X,
  Home,
  BookOpen,
  Users,
  Calendar,
  BarChart2,
  Settings,
  LibraryBig,
  Database,
  DollarSign, 
  Monitor,
  HeartPulse,
  Leaf,
} from 'lucide-react';
// import { useTranslations } from '../../hooks/useTranslations'; // Descomenta si usas i18n

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, setIsOpen }) => {
  // const { t } = useTranslations(); // Descomenta si usas i18n
  const t = (key: string) => { // Placeholder para t()
    const texts: Record<string, string> = {
      "sidebar.almacen": "ALMACEN",
      "sidebar.inicio": "Inicio",
      "sidebar.catalogo.titulo": "Catálogo",
      "sidebar.catalogo.general": "Catálogo General",
      "sidebar.catalogo.contabilidad": "Contabilidad",
      "sidebar.catalogo.enfermeria": "Enfermería",
      "sidebar.catalogo.agropecuaria": "Agropecuaria",
      "sidebar.catalogo.apsti": "Apsti",
      "sidebar.prestamos.titulo": "Préstamos",
      "sidebar.prestamos.registrar": "Registrar Préstamo",
      "sidebar.prestamos.registros": "Registro de Préstamos",
      "sidebar.estudiantes.titulo": "Estudiantes",
      "sidebar.estudiantes.ver": "Estudiantes",
      "sidebar.sistema.titulo": "Sistema",
      "sidebar.reportes": "Reportes",
      "sidebar.configuracion": "Configuración",
      "sidebar.perfil.ver": "Ver perfil",
      "sidebar.cerrarMenu": "Cerrar menú"
    };
    return texts[key] || key;
  };

  const iconColors = {
    inicio: "text-sky-500 dark:text-sky-400",
    catalogoGeneral: "text-green-500 dark:text-green-400",
    contabilidad: "text-orange-500 dark:text-orange-400",
    enfermeria: "text-red-500 dark:text-red-400",
    agropecuaria: "text-yellow-600 dark:text-yellow-500",
    apsti: "text-purple-500 dark:text-purple-400",
    registrarPrestamo: "text-yellow-400 dark:text-yellow-300",
    registroPrestamos: "text-teal-500 dark:text-teal-400",
    estudiantes: "text-blue-700 dark:text-blue-500",
    reportes: "text-lime-500 dark:text-lime-400",
    configuracion: "text-slate-500 dark:text-slate-400",
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}
      
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:z-auto ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="h-full flex flex-col">
          {/* Sidebar header - MODIFICADO */}
          <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200 dark:border-gray-700"> {/* Fondo quitado, altura original */}
            <div className="flex items-center">
              <LibraryBig className="w-8 h-8 text-blue-600 dark:text-blue-400" /> {/* Ícono azul */}
              {/* Aplicando el estilo de gradiente al texto "ALMACEN" */}
              <h2 className="ml-2 text-2xl sm:text-3xl font-extrabold whitespace-nowrap bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 dark:from-blue-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
                {t('sidebar.almacen')}
              </h2>
            </div>
            <button
              className="p-1 text-gray-500 dark:text-gray-400 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 lg:hidden"
              onClick={() => setIsOpen(false)}
              aria-label={t('sidebar.cerrarMenu')}
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          
          {/* Resto del Sidebar (contenido del menú) sin cambios respecto a la versión anterior con colores de íconos */}
          <div className="flex-1 overflow-y-auto py-4">
            <nav className="px-2 space-y-1">
              <NavLink to="/" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`} onClick={() => isOpen && setIsOpen(false)}>
                <Home className={`mr-3 w-5 h-5 ${iconColors.inicio}`} />
                {t('sidebar.inicio')}
              </NavLink>
              
              <div className="pt-2 pb-1">
                <p className="px-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  {t('sidebar.catalogo.titulo')}
                </p>
              </div>
              
              <NavLink to="/catalog" end className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`} onClick={() => isOpen && setIsOpen(false)}>
                <BookOpen className={`mr-3 w-5 h-5 ${iconColors.catalogoGeneral}`} />
                {t('sidebar.catalogo.general')}
              </NavLink>
              <NavLink to="/catalog/accounting" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''} pl-8`} onClick={() => isOpen && setIsOpen(false)}>
                <DollarSign className={`mr-3 w-5 h-5 ${iconColors.contabilidad}`} />
                {t('sidebar.catalogo.contabilidad')}
              </NavLink>
              <NavLink to="/catalog/nursing" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''} pl-8`} onClick={() => isOpen && setIsOpen(false)}>
                <HeartPulse className={`mr-3 w-5 h-5 ${iconColors.enfermeria}`} />
                {t('sidebar.catalogo.enfermeria')}
              </NavLink>
              <NavLink to="/catalog/agriculture" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''} pl-8`} onClick={() => isOpen && setIsOpen(false)}>
                <Leaf className={`mr-3 w-5 h-5 ${iconColors.agropecuaria}`} />
                {t('sidebar.catalogo.agropecuaria')}
              </NavLink>
              <NavLink to="/catalog/computing" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''} pl-8`} onClick={() => isOpen && setIsOpen(false)}>
                <Monitor className={`mr-3 w-5 h-5 ${iconColors.apsti}`} />
                {t('sidebar.catalogo.apsti')}
              </NavLink>
              
              <div className="pt-2 pb-1">
                <p className="px-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  {t('sidebar.prestamos.titulo')}
                </p>
              </div>
              
              <NavLink to="/loans/register" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`} onClick={() => isOpen && setIsOpen(false)}>
                <Calendar className={`mr-3 w-5 h-5 ${iconColors.registrarPrestamo}`} />
                {t('sidebar.prestamos.registrar')}
              </NavLink>
              <NavLink to="/loans/records" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`} onClick={() => isOpen && setIsOpen(false)}>
                <Database className={`mr-3 w-5 h-5 ${iconColors.registroPrestamos}`} />
                {t('sidebar.prestamos.registros')}
              </NavLink>
              
              <div className="pt-2 pb-1">
                <p className="px-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  {t('sidebar.estudiantes.titulo')}
                </p>
              </div>
              
              <NavLink to="/students" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`} onClick={() => isOpen && setIsOpen(false)}>
                <Users className={`mr-3 w-5 h-5 ${iconColors.estudiantes}`} />
                {t('sidebar.estudiantes.ver')}
              </NavLink>
              
              <div className="pt-2 pb-1">
                <p className="px-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  {t('sidebar.sistema.titulo')}
                </p>
              </div>
              
              <NavLink to="/reports" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`} onClick={() => isOpen && setIsOpen(false)}>
                <BarChart2 className={`mr-3 w-5 h-5 ${iconColors.reportes}`} />
                {t('sidebar.reportes')}
              </NavLink>
              <NavLink to="/settings" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`} onClick={() => isOpen && setIsOpen(false)}>
                <Settings className={`mr-3 w-5 h-5 ${iconColors.configuracion}`} />
                {t('sidebar.configuracion')}
              </NavLink>
            </nav>
          </div>
          
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-8 w-8 rounded-full bg-blue-600 dark:bg-blue-500 flex items-center justify-center text-white font-bold">
                  A
                </div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-200">Admin</p> 
                <p className="text-xs text-gray-500 dark:text-gray-400">{t('sidebar.perfil.ver')}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;