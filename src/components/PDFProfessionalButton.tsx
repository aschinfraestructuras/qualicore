import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Download, Loader2, ChevronDown, ChevronUp } from 'lucide-react';
import toast from 'react-hot-toast';
import { pdfProfessionalService } from '../services/pdfProfessionalService';
import type { Norma } from '../types/normas';

interface PDFProfessionalButtonProps {
  normas: Norma[];
  className?: string;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
}

type PDFType = 'completo' | 'executivo' | 'tabela' | 'estatisticas';

export default function PDFProfessionalButton({ 
  normas, 
  className = '', 
  variant = 'primary',
  size = 'md'
}: PDFProfessionalButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [generating, setGenerating] = useState<PDFType | null>(null);

  const buttonVariants = {
    primary: 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white',
    secondary: 'bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white',
    outline: 'border-2 border-blue-600 text-blue-600 hover:bg-blue-50'
  };

  const sizeVariants = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base'
  };

  const pdfOptions: { type: PDFType; label: string; description: string; icon: React.ReactNode }[] = [
    {
      type: 'completo',
      label: 'Relatório Completo',
      description: 'PDF com todas as normas, tabelas e estatísticas',
      icon: <FileText className="h-4 w-4" />
    },
    {
      type: 'executivo',
      label: 'Relatório Executivo',
      description: 'Resumo executivo com KPIs e alertas críticos',
      icon: <FileText className="h-4 w-4" />
    },
    {
      type: 'tabela',
      label: 'Tabela de Normas',
      description: 'Apenas a tabela principal de normas',
      icon: <FileText className="h-4 w-4" />
    },
    {
      type: 'estatisticas',
      label: 'Estatísticas',
      description: 'Análise estatística detalhada',
      icon: <FileText className="h-4 w-4" />
    }
  ];

  const generatePDF = async (type: PDFType) => {
    if (normas.length === 0) {
      toast.error('Não há normas para gerar relatório');
      return;
    }

    try {
      setGenerating(type);
      
      let result;
      switch (type) {
        case 'completo':
          result = await pdfProfessionalService.gerarPDFNormas(normas, 'Relatório Completo de Normas');
          break;
        case 'executivo':
          result = await pdfProfessionalService.gerarRelatorioExecutivo(normas);
          break;
        case 'tabela':
          result = await pdfProfessionalService.gerarPDFNormas(normas, 'Tabela de Normas');
          break;
        case 'estatisticas':
          result = await pdfProfessionalService.gerarPDFNormas(normas, 'Estatísticas de Normas');
          break;
        default:
          throw new Error('Tipo de PDF não suportado');
      }

      // Download do PDF
      const link = document.createElement('a');
      link.href = result.url;
      link.download = `normas_${type}_${new Date().toISOString().split('T')[0]}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success(`PDF ${type} gerado com sucesso!`);
      setIsOpen(false);
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      toast.error('Erro ao gerar PDF. Tente novamente.');
    } finally {
      setGenerating(null);
    }
  };

  return (
    <div className="relative">
      {/* Botão principal */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          flex items-center space-x-2 rounded-lg font-medium transition-all duration-200
          ${buttonVariants[variant]}
          ${sizeVariants[size]}
          ${className}
          ${isOpen ? 'ring-2 ring-blue-300 ring-offset-2' : ''}
        `}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <FileText className="h-4 w-4" />
        <span>PDF Profissional</span>
        {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
      </motion.button>

      {/* Dropdown de opções */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 top-full mt-2 w-80 rounded-lg bg-white shadow-xl border border-gray-200 z-50"
          >
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Tipo de Relatório</h3>
              <div className="space-y-2">
                {pdfOptions.map((option) => (
                  <motion.button
                    key={option.type}
                    onClick={() => generatePDF(option.type)}
                    disabled={generating === option.type}
                    className={`
                      w-full flex items-center space-x-3 p-3 rounded-lg text-left
                      transition-all duration-200 hover:bg-gray-50
                      ${generating === option.type ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-md'}
                    `}
                    whileHover={{ scale: generating === option.type ? 1 : 1.02 }}
                    whileTap={{ scale: generating === option.type ? 1 : 0.98 }}
                  >
                    <div className="flex-shrink-0 text-blue-600">
                      {generating === option.type ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        option.icon
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">{option.label}</p>
                      <p className="text-xs text-gray-500">{option.description}</p>
                    </div>
                    {generating === option.type && (
                      <Download className="h-4 w-4 text-blue-600 animate-pulse" />
                    )}
                  </motion.button>
                ))}
              </div>
              
              {/* Informações adicionais */}
              <div className="mt-4 pt-3 border-t border-gray-200">
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>Normas disponíveis: {normas.length}</span>
                  <span>Formato: PDF Profissional</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Overlay para fechar */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}


