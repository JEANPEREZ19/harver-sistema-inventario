// src/pages/Dashboard.tsx

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpen,
  Users,
  Calendar,
  AlertTriangle,
  ArrowRight,
  // TrendingUp, // No se usa en el código actual del Dashboard
  Activity,
  CheckCircle,
  Clock,
} from 'lucide-react';
import { useBookStore } from '../stores/bookStore';
import { useStudentStore } from '../stores/studentStore';
import { useLoanStore } from '../stores/loanStore';
import { careerNames } from '../utils/mockData';
import { Loan } from '../types'; // Importar el tipo Loan si no está ya

const Dashboard: React.FC = () => {
  const { books } = useBookStore();
  const { students } = useStudentStore();
  const { loans } = useLoanStore();
  
  const [stats, setStats] = useState({
    totalBooks: 0,
    totalStudents: 0,
    totalLoans: 0, // Total de todos los préstamos registrados
    activeLoans: 0, // Préstamos 'activos' que NO están vencidos
    overdueLoans: 0, // Préstamos 'vencidos' (ya sea por status o por fecha)
    booksPerCareer: {} as Record<string, number>,
  });
  
  useEffect(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalizar 'hoy' al inicio del día para comparaciones consistentes

    let currentActiveLoans = 0;
    let currentOverdueLoans = 0;

    loans.forEach((loan: Loan) => { // Especificar el tipo de 'loan'
      if (loan.status === 'returned') {
        // Los préstamos devueltos no cuentan como activos ni vencidos para el dashboard
        return;
      }

      const dueDate = new Date(loan.dueDate);
      dueDate.setHours(0, 0, 0, 0); // Normalizar 'dueDate' al inicio del día

      // Un préstamo se considera vencido si su estado ya es 'overdue'
      // o si su estado es 'active' y la fecha de devolución ya pasó.
      if (loan.status === 'overdue' || (loan.status === 'active' && dueDate < today)) {
        currentOverdueLoans++;
      } else if (loan.status === 'active') {
        // Si es 'active' y no cayó en la condición de vencido anterior, es un activo no vencido.
        currentActiveLoans++;
      }
    });
    
    const booksPerCareer = books.reduce((acc, book) => {
      const career = book.career;
      acc[career] = (acc[career] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    setStats({ // Actualizar el estado
      totalBooks: books.length,
      totalStudents: students.length,
      totalLoans: loans.length,
      activeLoans: currentActiveLoans,
      overdueLoans: currentOverdueLoans,
      booksPerCareer,
    });

  }, [books, students, loans]); // Dependencias del efecto
  
  // Recent loans for display (showing the last 5)
  const recentLoans = [...loans]
    .sort((a, b) => new Date(b.loanDate).getTime() - new Date(a.loanDate).getTime())
    .slice(0, 5);
  
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-gray-900">PANEL DE CONTROL</h1>
        <p className="mt-1 text-sm text-gray-500">
          Bienvenido al Sistema de Gestión Bibliotecaria
        </p>
      </header>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card p-6 flex items-center">
          <div className="p-3 rounded-full bg-blue-100 text-blue-600">
            <BookOpen className="h-6 w-6" />
          </div>
          <div className="ml-4">
            <h2 className="text-sm font-medium text-gray-500">Total Libros</h2>
            <p className="text-2xl font-semibold text-gray-900">{stats.totalBooks}</p>
          </div>
        </div>
        
        <div className="card p-6 flex items-center">
          <div className="p-3 rounded-full bg-green-100 text-green-600">
            <Users className="h-6 w-6" />
          </div>
          <div className="ml-4">
            <h2 className="text-sm font-medium text-gray-500">Estudiantes</h2>
            <p className="text-2xl font-semibold text-gray-900">{stats.totalStudents}</p>
          </div>
        </div>
        
        <div className="card p-6 flex items-center">
          <div className="p-3 rounded-full bg-indigo-100 text-indigo-600">
            <Calendar className="h-6 w-6" />
          </div>
          <div className="ml-4">
            <h2 className="text-sm font-medium text-gray-500">Préstamos Activos</h2>
            <p className="text-2xl font-semibold text-gray-900">{stats.activeLoans}</p>
          </div>
        </div>
        
        <div className="card p-6 flex items-center">
          <div className="p-3 rounded-full bg-red-100 text-red-600">
            <AlertTriangle className="h-6 w-6" />
          </div>
          <div className="ml-4">
            <h2 className="text-sm font-medium text-gray-500">Préstamos Vencidos</h2>
            <p className="text-2xl font-semibold text-gray-900">{stats.overdueLoans}</p>
          </div>
        </div>
      </div>
      
      {/* Main Dashboard Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Books by Career */}
        <div className="card p-6 lg:col-span-1">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium text-gray-900">Libros por Carrera</h2>
            <Link
              to="/catalog"
              className="text-sm text-blue-600 hover:text-blue-700 flex items-center"
            >
              Ver todos
              <ArrowRight className="h-4 w-4 ml-1" />
            </Link>
          </div>
          
          <div className="space-y-4">
            {Object.entries(careerNames).map(([career, name]) => (
              <div key={career} className="flex items-center">
                <div className="w-full">
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">{name}</span>
                    <span className="text-sm text-gray-500">
                      {stats.booksPerCareer[career] || 0} libros
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-blue-600 h-2.5 rounded-full"
                      style={{
                        width: `${
                          stats.totalBooks > 0 // Evitar división por cero
                            ? ((stats.booksPerCareer[career] || 0) / stats.totalBooks) * 100
                            : 0
                        }%`,
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Activity & Loan Stats */}
        <div className="lg:col-span-2 space-y-6">
          {/* Activity Summary */}
          <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium text-gray-900">Actividad Reciente</h2>
              <div className="p-1 rounded-full bg-blue-50">
                <Activity className="h-5 w-5 text-blue-600" />
              </div>
            </div>
            
            <div className="space-y-3">
              {recentLoans.length > 0 ? (
                recentLoans.map((loan) => (
                  <div key={loan.id} className="flex items-start">
                    <div
                      className={`p-2 rounded-full ${
                        loan.status === 'returned'
                          ? 'bg-green-100 text-green-600'
                          : loan.status === 'overdue' // Asumimos que `recentLoans` puede tener status 'overdue'
                          ? 'bg-red-100 text-red-600'
                          : (new Date(loan.dueDate) < new Date() && loan.status === 'active') // Chequeo adicional para el ícono si es activo pero vencido
                          ? 'bg-red-100 text-red-600'
                          : 'bg-blue-100 text-blue-600'
                      }`}
                    >
                      {loan.status === 'returned' ? (
                        <CheckCircle className="h-4 w-4" />
                      ) : loan.status === 'overdue' || (new Date(loan.dueDate) < new Date() && loan.status === 'active') ? (
                        <AlertTriangle className="h-4 w-4" />
                      ) : (
                        <Clock className="h-4 w-4" />
                      )}
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">
                        {loan.student.name} {loan.student.lastName}
                      </p>
                      <p className="text-xs text-gray-500">{loan.book.title}</p>
                      <div className="flex items-center mt-1">
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full ${
                            loan.status === 'returned'
                              ? 'bg-green-100 text-green-800'
                              : loan.status === 'overdue' || (new Date(loan.dueDate) < new Date() && loan.status === 'active')
                              ? 'bg-red-100 text-red-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}
                        >
                          {loan.status === 'returned'
                            ? 'Devuelto'
                            : loan.status === 'overdue' || (new Date(loan.dueDate) < new Date() && loan.status === 'active')
                            ? 'Vencido'
                            : 'Activo'}
                        </span>
                        <span className="text-xs text-gray-500 ml-2">
                          {new Date(loan.loanDate).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500">No hay préstamos recientes</p>
              )}
            </div>
            
            <div className="mt-4 pt-4 border-t border-gray-200">
              <Link
                to="/loans/records"
                className="text-sm text-blue-600 hover:text-blue-700 flex items-center justify-center"
              >
                Ver todos los préstamos
                <ArrowRight className="h-4 w-4 ml-1" />
              </Link>
            </div>
          </div>
          
          {/* Quick Actions */}
          <div className="card p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Acciones Rápidas</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Link
                to="/loans/register"
                className="btn btn-primary flex items-center justify-center"
              >
                <Calendar className="h-5 w-5 mr-2" />
                Registrar Préstamo
              </Link>
              
              <Link
                to="/catalog/add"
                className="btn btn-secondary flex items-center justify-center"
              >
                <BookOpen className="h-5 w-5 mr-2" />
                Agregar Libro
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;