// src/pages/Students.tsx

import React, { useMemo, useState } from 'react';
// No es necesario Link aquí si toda la gestión es modal y no hay navegación a una página de formulario separada.
// Si necesitas Link para otras cosas (ej. ir a Dashboard), mantenlo.
// import { Link } from 'react-router-dom'; 
import { useStudentStore } from '../stores/studentStore';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  X,
  Briefcase, 
  Hash, 
  Users as UsersIcon, // Para el ícono de "No hay estudiantes"
  Save
} from 'lucide-react';
import toast from 'react-hot-toast';
import { Student, StudentFormData, Career } from '../types';
import { careerNames } from '../utils/mockData';

const Students: React.FC = () => {
  const { students, addStudent, updateStudent, deleteStudent } = useStudentStore();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [careerFilter, setCareerFilter] = useState<string>('all');
  const [cycleFilter, setCycleFilter] = useState<string>('all');

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [formData, setFormData] = useState<StudentFormData>({
    studentId: '',
    name: '',
    lastName: '',
    email: '',
    career: 'computing', // Valor por defecto
    cycle: 1,
    phone: '',
  });
  const [formErrors, setFormErrors] = useState<Partial<Record<keyof StudentFormData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const filteredStudents = useMemo(() => {
    return students.filter(student => {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = searchTerm === '' ||
        student.name.toLowerCase().includes(searchLower) ||
        student.lastName.toLowerCase().includes(searchLower) ||
        student.studentId.toLowerCase().includes(searchLower) ||
        (student.email && student.email.toLowerCase().includes(searchLower));
      
      const matchesCareer = careerFilter === 'all' || student.career === careerFilter;
      const matchesCycle = cycleFilter === 'all' || student.cycle.toString() === cycleFilter;
      
      return matchesSearch && matchesCareer && matchesCycle;
    });
  }, [students, searchTerm, careerFilter, cycleFilter]);

  const groupedStudents = useMemo(() => {
    return filteredStudents.reduce((acc, student) => {
      const careerKey = student.career || 'unknown';
      if (!acc[careerKey]) {
        acc[careerKey] = {};
      }
      const cycleKey = student.cycle?.toString() || 'unknown';
      if (!acc[careerKey][cycleKey]) {
        acc[careerKey][cycleKey] = [];
      }
      acc[careerKey][cycleKey].push(student);
      return acc;
    }, {} as Record<string, Record<string, Student[]>>);
  }, [filteredStudents]);

  const resetForm = () => {
    setFormData({
      studentId: '',
      name: '',
      lastName: '',
      email: '',
      career: 'computing',
      cycle: 1,
      phone: '',
    });
    setFormErrors({});
    setEditingStudent(null);
  };

  const openAddForm = () => {
    resetForm();
    setIsFormOpen(true);
  };

  const openEditForm = (student: Student) => {
    setEditingStudent(student);
    setFormData({
      studentId: student.studentId,
      name: student.name,
      lastName: student.lastName,
      email: student.email,
      career: student.career,
      cycle: student.cycle,
      phone: student.phone || '',
    });
    setFormErrors({});
    setIsFormOpen(true);
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === 'cycle') {
      setFormData(prev => ({ ...prev, [name]: parseInt(value, 10) || 1 }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value as string | Career }));
    }
    
    if (formErrors[name as keyof StudentFormData]) {
      setFormErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof StudentFormData, string>> = {};
    if (!formData.studentId.trim()) newErrors.studentId = 'El ID de estudiante es requerido';
    if (!formData.name.trim()) newErrors.name = 'El nombre es requerido';
    if (!formData.lastName.trim()) newErrors.lastName = 'El apellido es requerido';
    if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'El email es inválido';
    }
    if (formData.cycle < 1 || formData.cycle > 12) newErrors.cycle = 'El ciclo debe estar entre 1 y 12';

    setFormErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      if (editingStudent && editingStudent.id) {
        await updateStudent(editingStudent.id, formData);
        toast.success('Estudiante actualizado correctamente');
      } else {
        await addStudent(formData);
        toast.success('Estudiante agregado correctamente');
      }
      setIsFormOpen(false);
      // resetForm(); // Reset form ya se llama en openAddForm y openEditForm al inicio.
                   // Si se quiere resetear después de enviar, está bien aquí.
                   // Por ahora, lo dejaré para que el modal se cierre con los datos.
                   // Si el usuario vuelve a abrir, se reseteará.
    } catch (error) {
      toast.error('Ha ocurrido un error al guardar el estudiante');
      console.error("Error submitting form:", error); // Log para depuración
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (window.confirm(`¿Está seguro de eliminar a ${name}? Esta acción no se puede deshacer.`)) {
      setIsSubmitting(true);
      try {
        await deleteStudent(id);
        toast.success('Estudiante eliminado correctamente');
      } catch (error) {
        toast.error('Error al eliminar el estudiante');
        console.error("Error deleting student:", error); // Log para depuración
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const allCycles = useMemo(() => {
    const cycles = new Set(students.map(s => s.cycle.toString()));
    return Array.from(cycles).sort((a, b) => parseInt(a) - parseInt(b));
  }, [students]);

  return (
    <div className="space-y-6 p-4 md:p-6">
      {isFormOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-gray-900 bg-opacity-75 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[95vh] flex flex-col">
            <div className="flex justify-between items-center p-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800">
                {editingStudent ? 'Editar Estudiante' : 'Agregar Nuevo Estudiante'}
              </h2>
              <button 
                onClick={() => {
                  setIsFormOpen(false);
                  resetForm(); // Resetear el form al cerrar con X o Cancelar
                }} 
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full"
                aria-label="Cerrar formulario"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleFormSubmit} className="p-6 space-y-4 overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-3">
                <div>
                  <label htmlFor="form-name" className="form-label">Nombre <span className="text-red-500">*</span></label>
                  <input type="text" id="form-name" name="name" value={formData.name} onChange={handleFormChange} className={`input ${formErrors.name ? 'border-red-500' : ''}`} />
                  {formErrors.name && <p className="mt-1 text-xs text-red-500">{formErrors.name}</p>}
                </div>
                <div>
                  <label htmlFor="form-lastName" className="form-label">Apellido <span className="text-red-500">*</span></label>
                  <input type="text" id="form-lastName" name="lastName" value={formData.lastName} onChange={handleFormChange} className={`input ${formErrors.lastName ? 'border-red-500' : ''}`} />
                  {formErrors.lastName && <p className="mt-1 text-xs text-red-500">{formErrors.lastName}</p>}
                </div>
                <div>
                  <label htmlFor="form-studentId" className="form-label">ID Estudiante <span className="text-red-500">*</span></label>
                  <input type="text" id="form-studentId" name="studentId" value={formData.studentId} onChange={handleFormChange} className={`input ${formErrors.studentId ? 'border-red-500' : ''}`} />
                  {formErrors.studentId && <p className="mt-1 text-xs text-red-500">{formErrors.studentId}</p>}
                </div>
                <div>
                  <label htmlFor="form-email" className="form-label">Email <span className="text-red-500">*</span></label>
                  <input type="email" id="form-email" name="email" value={formData.email} onChange={handleFormChange} className={`input ${formErrors.email ? 'border-red-500' : ''}`} />
                  {formErrors.email && <p className="mt-1 text-xs text-red-500">{formErrors.email}</p>}
                </div>
                <div>
                  <label htmlFor="form-career" className="form-label">Carrera <span className="text-red-500">*</span></label>
                  <select id="form-career" name="career" value={formData.career} onChange={handleFormChange} className="input">
                    {Object.entries(careerNames).map(([value, label]) => (
                      <option key={value} value={value as Career}>{label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="form-cycle" className="form-label">Ciclo <span className="text-red-500">*</span></label>
                  <input type="number" id="form-cycle" name="cycle" value={formData.cycle} onChange={handleFormChange} className={`input ${formErrors.cycle ? 'border-red-500' : ''}`} min="1" max="12" />
                  {formErrors.cycle && <p className="mt-1 text-xs text-red-500">{formErrors.cycle}</p>}
                </div>
                <div className="md:col-span-2">
                  <label htmlFor="form-phone" className="form-label">Teléfono (Opcional)</label>
                  <input type="tel" id="form-phone" name="phone" value={formData.phone} onChange={handleFormChange} className="input" />
                </div>
              </div>
              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 mt-4">
                <button
                  type="button"
                  onClick={() => {
                    setIsFormOpen(false);
                    resetForm(); // Resetear el form al cerrar con X o Cancelar
                  }}
                  className="btn bg-gray-100 border border-gray-300 text-gray-700 hover:bg-gray-200"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn btn-primary flex items-center"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {isSubmitting ? 'Guardando...' : (editingStudent ? 'Actualizar' : 'Guardar')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Directorio de Estudiantes</h1>
          <p className="mt-1 text-sm text-gray-500">{students.length} estudiantes registrados</p>
        </div>
        <button onClick={openAddForm} className="btn btn-primary flex items-center mt-4 sm:mt-0">
          <Plus className="h-5 w-5 mr-2" />
          Agregar Estudiante
        </button>
      </div>

      <div className="card p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="relative">
             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
            <input
              type="text"
              placeholder="Buscar estudiante..."
              className="input pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select
            className="input"
            value={careerFilter}
            onChange={(e) => setCareerFilter(e.target.value)}
          >
            <option value="all">Todas las carreras</option>
            {Object.entries(careerNames).map(([key, name]) => (
              <option key={key} value={key as Career}>{name}</option>
            ))}
          </select>
          <select
            className="input"
            value={cycleFilter}
            onChange={(e) => setCycleFilter(e.target.value)}
          >
            <option value="all">Todos los ciclos</option>
            {allCycles.map(cycle => (
              <option key={cycle} value={cycle}>Ciclo {cycle}</option>
            ))}
          </select>
        </div>

        {Object.keys(groupedStudents).length === 0 && students.length > 0 && (
            <div className="text-center py-10">
                <Search className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500">No se encontraron estudiantes con los filtros aplicados.</p>
            </div>
        )}
        {students.length === 0 && (
            <div className="text-center py-10">
                <UsersIcon className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500">No hay estudiantes registrados. ¡Agrega el primero!</p>
            </div>
        )}

        {Object.entries(groupedStudents).map(([career, cycles]) => (
          <div key={career} className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-3 flex items-center">
              <Briefcase className="h-5 w-5 mr-2 text-blue-600"/> 
              {careerNames[career as Career] || 'Carrera Desconocida'}
            </h2>
            {Object.entries(cycles).map(([cycle, studentsInCycle]) => (
              <div key={cycle} className="mb-5">
                <h3 className="text-md font-medium text-gray-700 mb-2 ml-2 flex items-center">
                  <Hash className="h-4 w-4 mr-1 text-gray-500"/>
                  Ciclo {cycle} 
                  <span className="ml-2 text-xs bg-gray-200 text-gray-700 px-1.5 py-0.5 rounded-full">
                    {studentsInCycle.length}
                  </span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {studentsInCycle.map((student) => {
                    const initials = `${student.name[0] || ''}${student.lastName[0] || ''}`.toUpperCase();
                    return (
                      <div key={student.id} className="p-3 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-150 ease-in-out">
                        <div className="flex items-center space-x-3">
                          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm font-semibold">
                            {initials}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-gray-900 truncate" title={`${student.name} ${student.lastName}`}>{student.name} {student.lastName}</p>
                            <p className="text-xs text-gray-500 truncate" title={student.studentId}>ID: {student.studentId}</p>
                          </div>
                        </div>
                        <div className="mt-2 space-y-0.5 text-xs">
                            <p className="text-gray-600 truncate" title={student.email}>
                                <span className="font-medium">Email:</span> {student.email}
                            </p>
                            {student.phone && (
                                <p className="text-gray-600 truncate" title={student.phone}>
                                    <span className="font-medium">Tel:</span> {student.phone}
                                </p>
                            )}
                        </div>
                        <div className="mt-3 pt-2 border-t border-gray-100 flex justify-end space-x-1">
                          <button
                            onClick={() => openEditForm(student)}
                            disabled={isSubmitting}
                            className="p-1.5 text-indigo-600 hover:text-indigo-900 hover:bg-indigo-100 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            title="Editar Estudiante"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(student.id, `${student.name} ${student.lastName}`)}
                            disabled={isSubmitting}
                            className="p-1.5 text-red-600 hover:text-red-900 hover:bg-red-100 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                            title="Eliminar Estudiante"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Students;