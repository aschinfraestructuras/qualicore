import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Download, 
  FileSpreadsheet, 
  FileText, 
  FileDown, 
  Loader2,
  ChevronDown,
  CheckCircle
} from 'lucide-react';
import toast from 'react-hot-toast';
import {
  exportToExcel,
  exportToCSV,
  exportToPDF,
  ExportData,
  generateFilename
} from '../utils/exportUtils';
import { AnimatePresence } from 'framer-motion';

interface ExportButtonsProps {
  data: ExportData;
  entityType: 'trilhos' | 'travessas' | 'inspecoes';
  className?: string;
}

export function ExportButtons({ data, entityType, className = '' }: ExportButtonsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [lastExportType, setLastExportType] = useState<string | null>(null);

  const handleExport = async (type: 'excel' | 'csv' | 'pdf') => {
    if (isExporting) return;

    setIsExporting(true);
    setLastExportType(type);

    try {
      const filename = generateFilename(entityType, type);
      
      switch (type) {
        case 'excel':
          exportToExcel(data, { filename });
          break;
        case 'csv':
          exportToCSV(data, { filename });
          break;
        case 'pdf':
          await exportToPDF(data, { filename });
          break;
      }

      toast.success(`✅ ${type.toUpperCase()} exportado com sucesso!`, {
        icon: '📊',
        duration: 3000,
        style: {
          background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
          color: 'white',
          borderRadius: '12px',
          padding: '16px',
          fontSize: '14px',
          fontWeight: '600'
        }
      });
    } catch (error) {
      console.error(`Erro ao exportar ${type}:`, error);
      toast.error(`❌ Erro ao exportar ${type.toUpperCase()}`, {
        icon: '❌',
        duration: 4000,
        style: {
          background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
          color: 'white',
          borderRadius: '12px',
          padding: '16px',
          fontSize: '14px',
          fontWeight: '600'
        }
      });
    } finally {
      setIsExporting(false);
      setIsOpen(false);
      
      // Reset do último tipo exportado após 2 segundos
      setTimeout(() => setLastExportType(null), 2000);
    }
  };

  const exportOptions = [
    {
      type: 'excel' as const,
      label: 'Excel (.xlsx)',
      icon: FileSpreadsheet,
      description: 'Formato Excel com formatação',
      color: 'from-green-500 to-emerald-600'
    },
    {
      type: 'csv' as const,
      label: 'CSV (.csv)',
      icon: FileText,
      description: 'Arquivo de texto separado por vírgulas',
      color: 'from-blue-500 to-indigo-600'
    },
    {
      type: 'pdf' as const,
      label: 'PDF (.pdf)',
      icon: FileDown,
      description: 'Documento PDF formatado',
      color: 'from-red-500 to-pink-600'
    }
  ];

  return (
    <div className={`relative ${className}`}>
      {/* Botão Principal */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setIsOpen(!isOpen)}
        disabled={isExporting}
        className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-xl hover:from-blue-600 hover:to-indigo-600 transition-all duration-200 flex items-center space-x-2 disabled:opacity-50 shadow-lg"
      >
        {isExporting ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : lastExportType ? (
          <CheckCircle className="h-4 w-4" />
        ) : (
          <Download className="h-4 w-4" />
        )}
        <span>
          {isExporting 
            ? 'Exportando...' 
            : lastExportType 
              ? 'Exportado!' 
              : 'Exportar'
          }
        </span>
        <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </motion.button>

      {/* Dropdown de Opções */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-200 z-50 overflow-hidden"
          >
            <div className="p-2">
              <div className="text-xs font-medium text-gray-500 px-3 py-2 border-b border-gray-100">
                Escolha o formato de exportação
              </div>
              
              {exportOptions.map((option) => {
                const Icon = option.icon;
                const isLastExport = lastExportType === option.type;
                
                return (
                  <motion.button
                    key={option.type}
                    whileHover={{ backgroundColor: '#f8fafc' }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleExport(option.type)}
                    disabled={isExporting}
                    className={`w-full p-3 rounded-lg transition-all duration-200 flex items-start space-x-3 text-left ${
                      isExporting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'
                    } ${isLastExport ? 'bg-green-50 border border-green-200' : ''}`}
                  >
                    <div className={`p-2 rounded-lg bg-gradient-to-r ${option.color} text-white`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-gray-900">
                          {option.label}
                        </span>
                        {isLastExport && (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        )}
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        {option.description}
                      </p>
                    </div>
                  </motion.button>
                );
              })}
            </div>
            
            {/* Informações do arquivo */}
            <div className="px-3 py-2 bg-gray-50 border-t border-gray-100">
              <div className="text-xs text-gray-500">
                <div>📊 {data.data.length} registros</div>
                <div>📅 {new Date().toLocaleDateString('pt-BR')}</div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Overlay para fechar */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}

// Componente simplificado para exportação rápida
export function QuickExportButton({ data, entityType, format = 'excel' }: {
  data: ExportData;
  entityType: 'trilhos' | 'travessas' | 'inspecoes';
  format?: 'excel' | 'csv' | 'pdf';
}) {
  const [isExporting, setIsExporting] = useState(false);

  const handleQuickExport = async () => {
    if (isExporting) return;

    setIsExporting(true);

    try {
      const filename = generateFilename(entityType, format);
      
      switch (format) {
        case 'excel':
          exportToExcel(data, { filename });
          break;
        case 'csv':
          exportToCSV(data, { filename });
          break;
        case 'pdf':
          await exportToPDF(data, { filename });
          break;
      }

      toast.success(`✅ Exportado com sucesso!`, {
        icon: '📊',
        duration: 2000
      });
    } catch (error) {
      console.error(`Erro ao exportar:`, error);
      toast.error(`❌ Erro ao exportar`);
    } finally {
      setIsExporting(false);
    }
  };

  const getIcon = () => {
    switch (format) {
      case 'excel': return FileSpreadsheet;
      case 'csv': return FileText;
      case 'pdf': return FileDown;
      default: return Download;
    }
  };

  const Icon = getIcon();

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={handleQuickExport}
      disabled={isExporting}
      className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-all duration-200 disabled:opacity-50"
      title={`Exportar para ${format.toUpperCase()}`}
    >
      {isExporting ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Icon className="h-4 w-4" />
      )}
    </motion.button>
  );
}
