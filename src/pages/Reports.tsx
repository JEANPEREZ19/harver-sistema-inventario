import React, { useState, useMemo } from 'react';
// Eliminados Search, ChevronLeft, ChevronRight de la importación si no se usan.
// Si los necesitas, asegúrate de usarlos en el JSX.
import { 
  BarChart2, 
  Download, 
  Calendar
  // Search, // Eliminado si no se usa
  // ChevronLeft, // Eliminado si no se usa
  // ChevronRight // Eliminado si no se usa
} from 'lucide-react';
import { format, startOfDay, endOfDay, eachDayOfInterval, subDays } from 'date-fns';
// Eliminada la importación de 'es' si no se está usando explícitamente en format()
// import { es } from 'date-fns/locale'; 
import { generateLoanRecordsPDF } from '../utils/pdf'; // Asumiendo que la ruta es correcta
import { useLoanStore } from '../stores/loanStore'; // Asumiendo que la ruta es correcta
import toast from 'react-hot-toast';

const Reports: React.FC = () => {
  const { loans } = useLoanStore();
  const [startDate, setStartDate] = useState(format(subDays(new Date(), 7), 'yyyy-MM-dd'));
  const [endDate, setEndDate] = useState(format(new Date(), 'yyyy-MM-dd'));

  const dailyLoans = useMemo(() => {
    const start = startOfDay(new Date(startDate));
    const end = endOfDay(new Date(endDate));
    
    // Asegurarse de que la fecha final no sea anterior a la inicial
    if (end < start) {
      return []; // O manejar como un error, o ajustar fechas
    }
    
    const days = eachDayOfInterval({ start, end });
    
    return days.map(day => {
      const dayLoans = loans.filter(loan => {
        const loanDate = new Date(loan.loanDate);
        // Compara solo las fechas, ignorando la hora para la inclusión del día completo
        return (
          loanDate >= startOfDay(day) &&
          loanDate <= endOfDay(day)
        );
      });

      return {
        date: format(day, 'dd/MM/yyyy'), // Si quieres formato español explícito: format(day, 'dd/MM/yyyy', { locale: es }) y re-añade la importación de 'es'
        total: dayLoans.length,
        active: dayLoans.filter(l => l.status === 'active').length,
        returned: dayLoans.filter(l => l.status === 'returned').length,
        overdue: dayLoans.filter(l => l.status === 'overdue').length, // Asumiendo que el status 'overdue' ya está calculado en el store o aquí
      };
    });
  }, [loans, startDate, endDate]); // Si usaras 'es', añádelo a las dependencias

  const handleExportPDF = () => {
    try {
      const filteredLoans = loans.filter(loan => {
        const loanDate = new Date(loan.loanDate);
        // Asegurarse de que las fechas son válidas para el filtro
        const start = startOfDay(new Date(startDate));
        const end = endOfDay(new Date(endDate));
        if (end < start) return false;

        return (
          loanDate >= start &&
          loanDate <= end
        );
      });

      if (filteredLoans.length === 0) {
        toast.error('No hay datos para exportar en el rango de fechas seleccionado.');
        return;
      }

      generateLoanRecordsPDF(
        filteredLoans,
        `Reporte de Préstamos (${format(new Date(startDate), 'dd/MM/yyyy')} - ${format(new Date(endDate), 'dd/MM/yyyy')})`
        // Si quieres formato español explícito: format(new Date(startDate), 'dd/MM/yyyy', { locale: es }) etc.
      );
    } catch (error) {
      console.error("Error al generar el PDF:", error); // Se utiliza la variable 'error'
      toast.error('Error al generar el PDF');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Reportes de Préstamos</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Análisis detallado de préstamos por día
          </p>
        </div>

        <button
          onClick={handleExportPDF}
          className="btn btn-primary flex items-center"
          disabled={dailyLoans.length === 0} // Deshabilitar si no hay datos que mostrar/exportar
        >
          <Download className="h-5 w-5 mr-2" />
          Exportar PDF
        </button>
      </div>

      <div className="card p-6">
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1">
            <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Fecha Inicial
            </label>
            <input
              type="date"
              id="startDate"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="input" // Asumo que 'input' ya tiene estilos para dark mode definidos en index.css
            />
          </div>
          <div className="flex-1">
            <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Fecha Final
            </label>
            <input
              type="date"
              id="endDate"
              value={endDate}
              min={startDate} // Evita que la fecha final sea anterior a la inicial
              onChange={(e) => setEndDate(e.target.value)}
              className="input"
            />
          </div>
        </div>

        {dailyLoans.length === 0 ? (
          <div className="text-center py-10">
            <Calendar className="h-12 w-12 text-gray-400 dark:text-gray-500 mx-auto mb-2" />
            <p className="text-gray-500 dark:text-gray-400">No hay datos de préstamos en el rango de fechas seleccionado.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead>
                <tr>
                  <th className="table-header dark:bg-gray-700 dark:text-gray-300"> {/* Asumo que 'table-header' se adapta a dark mode */}
                    Fecha
                  </th>
                  <th className="table-header dark:bg-gray-700 dark:text-gray-300">
                    Total Préstamos
                  </th>
                  <th className="table-header dark:bg-gray-700 dark:text-gray-300">
                    Activos
                  </th>
                  <th className="table-header dark:bg-gray-700 dark:text-gray-300">
                    Devueltos
                  </th>
                  <th className="table-header dark:bg-gray-700 dark:text-gray-300">
                    Vencidos
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {dailyLoans.map((day) => (
                  <tr key={day.date} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                      {day.date}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                      {day.total}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                        {day.active}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                        {day.returned}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                        {day.overdue}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {dailyLoans.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Préstamos</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                  {dailyLoans.reduce((sum, day) => sum + day.total, 0)}
                </p>
              </div>
              <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-full">
                <BarChart2 className="h-6 w-6 text-blue-600 dark:text-blue-300" />
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Promedio Diario</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                  {(dailyLoans.reduce((sum, day) => sum + day.total, 0) / (dailyLoans.length || 1)).toFixed(1)}
                </p>
              </div>
              <div className="p-3 bg-green-100 dark:bg-green-900 rounded-full">
                <Calendar className="h-6 w-6 text-green-600 dark:text-green-300" />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reports;