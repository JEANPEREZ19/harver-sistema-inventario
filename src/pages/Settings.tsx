import React from 'react';
import { useThemeStore } from '../stores/themeStore'; // Asegúrate que la ruta sea correcta
import { Sun, Moon, Globe } from 'lucide-react';

const Settings: React.FC = () => {
  const { theme, language, toggleTheme, setLanguage } = useThemeStore();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Configuración</h1>

      <div className="card p-6 space-y-8">
        <div>
          <h2 className="text-lg font-medium text-gray-900 mb-4">Apariencia</h2>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-700">Tema</p>
              <p className="text-sm text-gray-500">
                Cambia entre tema claro y oscuro
              </p>
            </div>
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full bg-gray-100 hover:bg-gray-200"
            >
              {theme === 'light' ? (
                <Sun className="h-5 w-5 text-amber-500" />
              ) : (
                <Moon className="h-5 w-5 text-blue-500" />
              )}
            </button>
          </div>
        </div>

        <div className="border-t pt-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Idioma</h2>
          <div className="flex items-center space-x-4">
            <Globe className="h-5 w-5 text-gray-400" />
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as 'es' | 'en')}
              className="input"
            >
              <option value="es">Español</option>
              <option value="en">English</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;