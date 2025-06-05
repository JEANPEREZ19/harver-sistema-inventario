import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LibraryBig, AlertCircle, Lock, User } from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import toast from 'react-hot-toast';

const MatrixBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const matrixChars = "アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユュルグズブヅプエェケセテネヘメレヱゲゼデベペオォコソトノホモヨョロヲゴゾドボポヴッン0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ#$%&()*+,-./:;<=>?@[\\]^_`{|}~";
    const fontSize = 14;
    const columns = Math.floor(canvas.width / fontSize);
    const drops: number[] = Array(columns).fill(0);

    ctx.font = `${fontSize}px monospace`;

    const draw = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#0f0'; // Color de los caracteres Matrix
      
      for (let i = 0; i < drops.length; i++) {
        const text = matrixChars.charAt(Math.floor(Math.random() * matrixChars.length));
        const x = i * fontSize;
        const y = drops[i] * fontSize;
        ctx.fillText(text, x, y);
        
        if (y > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
      animationRef.current = requestAnimationFrame(draw);
    };

    draw();

    const handleResize = () => {
      if (canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        // Re-calcular columnas y reiniciar 'drops' podría ser necesario para un resize perfecto
        // const newColumns = Math.floor(canvas.width / fontSize);
        // drops.length = 0; // Vaciar
        // for (let i = 0; i < newColumns; i++) drops.push(0); // Rellenar
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="fixed top-0 left-0 w-full h-full z-0 pointer-events-none"
      aria-hidden="true"
    />
  );
};

interface Credentials {
  username: string;
  password: string;
  remember: boolean;
}

const Login: React.FC = () => {
  const [credentials, setCredentials] = useState<Credentials>({
    username: '',
    password: '',
    remember: false, // El estado del checkbox se maneja aquí
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  
  // CORRECCIÓN: Cambiado el tipo de HTMLFormElement a HTMLDivElement
  // ya que la ref se aplica al div contenedor de la tarjeta de login.
  const cardRef = useRef<HTMLDivElement>(null); 

  const { login } = useAuthStore();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setCredentials(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!credentials.username || !credentials.password) {
      setError('Por favor, complete todos los campos');
      return;
    }

    setIsLoading(true);

    try {
      const success = await login({
        username: credentials.username,
        password: credentials.password,
      });

      if (success) {
        // El toast se muestra independientemente del estado 'remember'.
        // La persistencia real es manejada por el middleware 'persist' en authStore.
        toast.success(`Bienvenido, ${credentials.username}!`, {
          icon: '👋',
          style: {
            background: '#4ade80', // Tailwind green-400
            color: '#fff',
          },
        });
        navigate('/');
      } else {
        setError('Credenciales incorrectas. Intente nuevamente.');
        // Aplicar animación de shake definida en tailwind.config.js
        cardRef.current?.classList.add('animate-shake');
        setTimeout(() => {
          cardRef.current?.classList.remove('animate-shake');
        }, 500);
      }
    } catch (err) {
      setError('Error al conectar con el servidor.');
      console.error('Login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = (type: 'admin' | 'librarian') => {
    setCredentials({
      username: type === 'admin' ? 'admin' : 'librarian',
      password: type === 'admin' ? 'admin123' : 'lib123',
      remember: false, // Puede ser true si quieres que el check se marque por defecto
    });
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 overflow-hidden bg-black">
      <MatrixBackground />
      
      <div className="relative z-10 w-full max-w-md">
        <div 
          ref={cardRef} // Aplicada la ref corregida
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className={`bg-gray-900/90 backdrop-blur-lg p-8 rounded-2xl shadow-xl transition-all duration-500 ${isHovered ? 'shadow-2xl' : ''}`}
        >
          <div className="flex flex-col items-center mb-8">
            <div className="relative">
              <LibraryBig className="h-16 w-16 text-green-400" />
              <div className="absolute -bottom-1 -right-1 bg-green-900/50 rounded-full p-1.5">
                <Lock className="h-4 w-4 text-green-400" />
              </div>
            </div>
            <h1 className="mt-4 text-3xl font-bold text-gray-100 bg-gradient-to-r from-green-400 to-green-600 bg-clip-text text-transparent">
              Sistema Bibliotecario
            </h1>
            <p className="mt-2 text-gray-400 text-center">
              Gestión integral de préstamos
            </p>
          </div>

          {error && (
            <div className="mb-6 p-3 rounded-lg bg-red-900/50 border border-red-700 flex items-start">
              <AlertCircle className="flex-shrink-0 h-5 w-5 text-red-400 mt-0.5" />
              <p className="ml-3 text-sm text-red-200">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1">
              <label htmlFor="username" className="block text-sm font-medium text-gray-300 flex items-center">
                <User className="h-4 w-4 mr-1 text-gray-400" />
                Usuario
              </label>
              <div className="relative">
                <input
                  id="username"
                  name="username"
                  type="text"
                  autoComplete="username"
                  required
                  value={credentials.username}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-2.5 bg-gray-800 border border-gray-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 text-gray-200"
                  placeholder="Ingrese su usuario"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-500" />
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 flex items-center">
                <Lock className="h-4 w-4 mr-1 text-gray-400" />
                Contraseña
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={credentials.password}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-2.5 bg-gray-800 border border-gray-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 text-gray-200"
                  placeholder="••••••••"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-500" />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember"
                  name="remember"
                  type="checkbox"
                  checked={credentials.remember}
                  onChange={handleChange}
                  className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-600 rounded bg-gray-800"
                />
                <label htmlFor="remember" className="ml-2 block text-sm text-gray-300">
                  Recordar sesión
                </label>
              </div>
              {/* Nota: El checkbox 'Recordar sesión' actualiza el estado local.
                  La persistencia de la sesión (mantener al usuario logueado)
                  es manejada por el middleware 'persist' en authStore.ts,
                  que por defecto usa localStorage y "recuerda" la sesión hasta el logout.
                  Una lógica más compleja para que este checkbox controle la persistencia
                  requeriría modificar authStore.ts. */}

              <div className="text-sm">
                <a 
                  href="#" 
                  className="font-medium text-green-400 hover:text-green-300 transition-colors duration-200"
                  onClick={(e) => {
                    e.preventDefault();
                    toast('Contacte con Jean el administrador del sistema.', {
                      icon: 'ℹ️',
                      style: {
                        background: '#1e293b', // Tailwind slate-800
                        color: '#f8fafc',    // Tailwind slate-50
                      },
                    });
                  }}
                >
                  ¿Olvidó su contraseña?
                </a>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200 ${isLoading ? 'bg-green-700 cursor-not-allowed' : 'bg-green-400 hover:bg-green-500'}`}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Iniciando sesión...
                </>
              ) : (
                <>
                  <Lock className="-ml-1 mr-2 h-5 w-5" />
                  Iniciar Sesión
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-5 border-t border-gray-800">
            <div className="relative">
              <div className="absolute inset-0 flex items-center" aria-hidden="true">
                <div className="w-full border-t border-gray-700" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-gray-900/90 text-gray-500">ACCESOS DE DEMO</span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => handleDemoLogin('admin')}
                className="inline-flex justify-center items-center px-4 py-2 border border-gray-700 shadow-sm text-sm font-medium rounded-lg text-gray-300 bg-gray-800 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-green-500 transition-all duration-200"
              >
                <User className="-ml-1 mr-2 h-4 w-4 text-gray-400" />
                Admin
              </button>
              <button
                type="button"
                onClick={() => handleDemoLogin('librarian')}
                className="inline-flex justify-center items-center px-4 py-2 border border-gray-700 shadow-sm text-sm font-medium rounded-lg text-gray-300 bg-gray-800 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-green-500 transition-all duration-200"
              >
                <LibraryBig className="-ml-1 mr-2 h-4 w-4 text-gray-400" />
                Bibliotecario
              </button>
            </div>
          </div>
        </div>

        <div className="mt-6 text-center text-xs text-gray-600">
          <p>Sistema de Gestión Bibliotecaria v0.1.0</p> {/* Actualizado a la versión de package.json */}
          <p className="mt-1">© {new Date().getFullYear()} Todos los derechos reservados</p>
        </div>
      </div>
      
      {/* Eliminado el bloque <style jsx global> */}
    </div>
  );
};

export default Login;