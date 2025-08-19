import React from 'react';
import { PDFService } from '../services/pdfService';
import toast from 'react-hot-toast';

const TestPDF: React.FC = () => {
  const handleTestPDF = async () => {
    try {
      console.log('🔍 Iniciando teste de PDF...');
      const pdfService = new PDFService();
      await pdfService.testPDFGeneration();
      toast.success('PDF de teste gerado com sucesso!');
    } catch (error) {
      console.error('❌ Erro no teste de PDF:', error);
      toast.error('Erro ao gerar PDF de teste');
    }
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4">Teste de PDF Generation</h3>
      <button
        onClick={handleTestPDF}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Testar Geração de PDF
      </button>
    </div>
  );
};

export default TestPDF;
