import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLoanStore } from '../stores/loanStore';
import { 
  Download, 
  Trash2, 
  Search, 
  Filter, 
  CheckCircle, 
  Clock, 
  AlertTriangle,
  Plus
} from 'lucide-react';
import { format, isAfter, parseISO } from 'date-fns';
import { generateLoanRecordsPDF } from '../utils/pdf';
import { Loan } from '../types';
import { careerNames } from '../utils/mockData';
import toast from 'react-hot-toast';

type LoanStatus = 'all' | 'active' | 'returned' | 'overdue';

const LoanRecords: React.FC = () => {
  const { loans, returnLoan, deleteLoan, deleteAllLoans } = useLoanStore();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<LoanStatus>('all');
  const [careerFilter, setCareerFilter] = useState<string>('all');
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Calculate overdue loans
  const [processedLoans, setProcessedLoans] = useState<Loan[]>([]);
  
  useEffect(() => {
    // Process loans to update overdue status based on current date
    const today = new Date();
    
    const updatedLoans = loans.map((loan) => {
      if (loan.status === 'active' && isAfter(today, parseISO(loan.dueDate))) {
        return { ...loan, status: 'overdue' as const };
      }
      return loan;
    });
    
    setProcessedLoans(updatedLoans);
  }, [loans]);
  
  // Apply filters to loans
  const filteredLoans = processedLoans.filter((loan) => {
    // Filter by search term
    const matchesSearch =
      searchTerm === '' ||
      loan.student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      loan.student.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      loan.book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      loan.book.author.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Filter by status
    const matchesStatus = statusFilter === 'all' || loan.status === statusFilter;
    
    // Filter by career
    const matchesCareer = careerFilter === 'all' || loan.book.career === careerFilter;
    
    return matchesSearch && matchesStatus && matchesCareer;
  });
  
  const handleReturn = async (id: string) => {
    setIsProcessing(true);
    
    try {
      const result = await returnLoan(id);
      
      if (result) {
        toast.success('Libro devuelto correctamente');
      } else {
        toast.error('Error al procesar la devolución');
      }
    } catch {
      toast.error('Ha ocurrido un error');
    } finally {
      setIsProcessing(false);
    }
  };
  
  const handleDelete = async (id: string) => {
    if (window.confirm('¿Está seguro de eliminar este registro?')) {
      setIsProcessing(true);
      
      try {
        await deleteLoan(id);
        toast.success('Registro eliminado correctamente');
      } catch {
        toast.error('Ha ocurrido un error');
      } finally {
        setIsProcessing(false);
      }
    }
  };
  
  const handleDeleteAll = async () => {
    if (window.confirm('¿Está seguro de eliminar todos los registros? Esta acción no se puede deshacer.')) {
      setIsProcessing(true);
      
      try {
        await deleteAllLoans();
        toast.success('Todos los registros han sido eliminados');
      } catch {
        toast.error('Ha ocurrido un error');
      } finally {
        setIsProcessing(false);
      }
    }
  };
  
  const handleExportPDF = () => {
    try {
      generateLoanRecordsPDF(
        filteredLoans,
        `Registro de Préstamos - ${
          statusFilter !== 'all'
            ? statusFilter === 'active'
              ? 'Activos'
              : statusFilter === 'returned'
              ? 'Devueltos'
              : 'Vencidos'
            : 'Todos'
        }`
      );
    } catch {
      toast.error('Error al generar el PDF');
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Registro de Préstamos</h1>
          <p className="mt-1 text-sm text-gray-500">
            {filteredLoans.length} {filteredLoans.length === 1 ? 'registro' : 'registros'} encontrados
          </p>
        </div>
        
        <div className="mt-4 sm:mt-0 flex space-x-2">
          <button
            onClick={handleExportPDF}
            className="btn bg-green-600 text-white hover:bg-green-700 focus:ring-green-500 flex items-center"
            disabled={filteredLoans.length === 0}
          >
            <Download className="h-5 w-5 mr-2" />
            Exportar PDF
          </button>
          
          <Link
            to="/loans/register"
            className="btn btn-primary flex items-center"
          >
            <Plus className="h-5 w-5 mr-2" />
            Nuevo Préstamo
          </Link>
        </div>
      </div>
      
      <div className="card p-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 md:space-x-4 mb-4">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="pl-10 pr-3 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Buscar por nombre, título..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
            <div className="flex items-center">
              <Filter className="h-5 w-5 text-gray-400 mr-2" />
              <select
                className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as LoanStatus)}
              >
                <option value="all">Todos</option>
                <option value="active">Activos</option>
                <option value="returned">Devueltos</option>
                <option value="overdue">Vencidos</option>
              </select>
            </div>
            
            <select
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={careerFilter}
              onChange={(e) => setCareerFilter(e.target.value)}
            >
              <option value="all">Todas las carreras</option>
              {Object.entries(careerNames).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        {loans.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No hay registros de préstamos</p>
            <Link to="/loans/register" className="mt-4 btn btn-primary inline-block">
              Registrar Nuevo Préstamo
            </Link>
          </div>
        ) : filteredLoans.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No se encontraron resultados para los filtros seleccionados</p>
            <button
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('all');
                setCareerFilter('all');
              }}
              className="mt-4 text-blue-600 hover:text-blue-800"
            >
              Limpiar filtros
            </button>
          </div>
        ) : (
          <>
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="table-header">Estudiante</th>
                    <th className="table-header">Libro</th>
                    <th className="table-header">Carrera</th>
                    <th className="table-header">Fecha Préstamo</th>
                    <th className="table-header">Fecha Devolución</th>
                    <th className="table-header">Estado</th>
                    <th className="table-header">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredLoans.map((loan) => (
                    <tr key={loan.id} className="hover:bg-gray-50">
                      <td className="table-cell">
                        <div>
                          <div className="font-medium text-gray-900">
                            {loan.student.name} {loan.student.lastName}
                          </div>
                          <div className="text-gray-500">{loan.student.studentId}</div>
                        </div>
                      </td>
                      <td className="table-cell">
                        <div className="font-medium text-gray-900">{loan.book.title}</div>
                        <div className="text-gray-500">{loan.book.author}</div>
                      </td>
                      <td className="table-cell">
                        {careerNames[loan.book.career]}
                      </td>
                      <td className="table-cell">
                        {format(new Date(loan.loanDate), 'dd/MM/yyyy')}
                      </td>
                      <td className="table-cell">
                        {format(new Date(loan.dueDate), 'dd/MM/yyyy')}
                      </td>
                      <td className="table-cell">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            loan.status === 'active'
                              ? 'bg-blue-100 text-blue-800'
                              : loan.status === 'returned'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {loan.status === 'active' ? (
                            <>
                              <Clock className="h-3 w-3 mr-1" />
                              Activo
                            </>
                          ) : loan.status === 'returned' ? (
                            <>
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Devuelto
                            </>
                          ) : (
                            <>
                              <AlertTriangle className="h-3 w-3 mr-1" />
                              Vencido
                            </>
                          )}
                        </span>
                      </td>
                      <td className="table-cell">
                        <div className="flex items-center space-x-2">
                          {loan.status !== 'returned' && (
                            <button
                              onClick={() => handleReturn(loan.id)}
                              disabled={isProcessing}
                              className="text-green-600 hover:text-green-800"
                              title="Marcar como devuelto"
                            >
                              <CheckCircle className="h-5 w-5" />
                            </button>
                          )}
                          <button
                            onClick={() => handleDelete(loan.id)}
                            disabled={isProcessing}
                            className="text-red-600 hover:text-red-800"
                            title="Eliminar registro"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="mt-4 text-right">
              <button
                onClick={handleDeleteAll}
                disabled={isProcessing}
                className="text-red-600 hover:text-red-800 font-medium text-sm flex items-center justify-center ml-auto"
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Eliminar Todos los Registros
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default LoanRecords;