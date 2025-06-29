import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { Loan } from '../types';
import { format } from 'date-fns';
import { careerNames } from './mockData';

// Type definition for jspdf-autotable
// Type definition for jspdf-autotable options
interface AutoTableOptions {
  head?: (string | number)[][];
  body?: (string | number)[][];
  startY?: number;
  styles?: Record<string, string | number>;
  headStyles?: Record<string, string | number>;
  alternateRowStyles?: Record<string, string | number>;
  margin?: Record<string, string | number>;
  // Add other options used by autoTable if necessary
}

declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: AutoTableOptions) => jsPDF;
  }
}

export const generateLoanRecordsPDF = (loans: Loan[], title: string = 'Registro de Préstamos'): void => {
  const doc = new jsPDF();
  
  // Add title
  doc.setFontSize(18);
  doc.text(title, 14, 22);
  
  // Add date
  doc.setFontSize(11);
  doc.text(`Generado: ${format(new Date(), 'dd/MM/yyyy HH:mm')}`, 14, 30);
  
  // Define table headers
  const headers = [
    { header: 'ID Préstamo', dataKey: 'id' },
    { header: 'Estudiante', dataKey: 'student' },
    { header: 'Libro', dataKey: 'book' },
    { header: 'Carrera', dataKey: 'career' },
    { header: 'Fecha Préstamo', dataKey: 'loanDate' },
    { header: 'Fecha Devolución', dataKey: 'dueDate' },
    { header: 'Estado', dataKey: 'status' },
  ];
  
  // Prepare table data
  const tableData = loans.map((loan) => {
    const statusMap: Record<string, string> = {
      active: 'Activo',
      returned: 'Devuelto',
      overdue: 'Atrasado',
    };
    
    return {
      id: loan.id.substring(0, 8),
      student: `${loan.student.name} ${loan.student.lastName}`,
      book: loan.book.title,
      career: careerNames[loan.book.career],
      loanDate: format(new Date(loan.loanDate), 'dd/MM/yyyy'),
      dueDate: format(new Date(loan.dueDate), 'dd/MM/yyyy'),
      status: statusMap[loan.status],
    };
  });
  
  // Generate table
  doc.autoTable({
    head: [headers.map((h) => h.header)],
    body: tableData.map((row) => headers.map((h) => row[h.dataKey as keyof typeof row])),
    startY: 40,
    styles: { fontSize: 8, cellPadding: 2 },
    headStyles: { fillColor: [41, 98, 255], textColor: 255 },
    alternateRowStyles: { fillColor: [240, 240, 240] },
    margin: { top: 40 },
  });
  
  // Add footer
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.text(
      `Página ${i} de ${pageCount}`,
      doc.internal.pageSize.width / 2,
      doc.internal.pageSize.height - 10,
      { align: 'center' }
    );
  }
  
  // Save the PDF
  doc.save(`registro-prestamos-${format(new Date(), 'yyyy-MM-dd')}.pdf`);
};