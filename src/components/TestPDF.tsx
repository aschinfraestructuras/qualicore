import React from 'react';
import { PDFService } from '../services/pdfService';
import toast from 'react-hot-toast';

const TestPDF: React.FC = () => {
  const handleTestPDF = async () => {
    try {
      console.log('🔍 Iniciando teste de PDF...');
      const pdfService = new PDFService();
      await pdfService.testPDFGeneration();
      toast.success('✅ PDF de teste gerado com sucesso!');
    } catch (error) {
      console.error('❌ Erro no teste de PDF:', error);
      toast.error('❌ Erro ao gerar PDF de teste');
    }
  };

  const handleSimplePDF = async () => {
    try {
      console.log('🔍 Gerando PDF simples...');
      
      // Importar jsPDF diretamente
      const { default: jsPDF } = await import('jspdf');
      
      // Criar PDF simples
      const doc = new jsPDF();
      
      // Adicionar conteúdo
      doc.setFontSize(20);
      doc.text('Teste PDF - Qualicore', 20, 20);
      
      doc.setFontSize(12);
      doc.text('Este é um teste de geração de PDF', 20, 40);
      doc.text('Se vires este PDF, a geração está a funcionar!', 20, 60);
      
      doc.text(`Data: ${new Date().toLocaleDateString('pt-PT')}`, 20, 80);
      doc.text(`Hora: ${new Date().toLocaleTimeString('pt-PT')}`, 20, 100);
      
      // Salvar o PDF
      doc.save('teste-simples-qualicore.pdf');
      
      toast.success('✅ PDF simples gerado com sucesso!');
      console.log('✅ PDF simples gerado com sucesso!');
    } catch (error) {
      console.error('❌ Erro ao gerar PDF simples:', error);
      toast.error('❌ Erro ao gerar PDF simples: ' + error.message);
    }
  };

  const handleArmadurasReport = async () => {
    try {
      console.log('🔍 Gerando relatório de Armaduras...');
      
      const pdfService = new PDFService();
      
      // Dados simulados para teste
      const armaduras = [
        {
          id: '1',
          nome: 'Armadura Teste 1',
          tipo: 'A500',
          diametro: 12,
          quantidade: 100,
          fornecedor_id: 'Fornecedor A',
          estado: 'Aprovado',
          data_fabricacao: '2024-01-15',
          certificado_qualidade: 'CQ001'
        },
        {
          id: '2', 
          nome: 'Armadura Teste 2',
          tipo: 'A400',
          diametro: 16,
          quantidade: 50,
          fornecedor_id: 'Fornecedor B',
          estado: 'Pendente',
          data_fabricacao: '2024-01-20',
          certificado_qualidade: 'CQ002'
        }
      ];

      // Gerar relatório executivo
      await pdfService.generateArmadurasExecutiveReport(armaduras);
      
      toast.success('✅ Relatório de Armaduras gerado com sucesso!');
      console.log('✅ Relatório de Armaduras gerado com sucesso!');
    } catch (error) {
      console.error('❌ Erro ao gerar relatório de Armaduras:', error);
      toast.error('❌ Erro ao gerar relatório: ' + error.message);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <h3 className="text-lg font-semibold mb-4 text-gray-900">🔧 Teste de PDF Generation</h3>
      <div className="space-y-3">
        <button
          onClick={handleTestPDF}
          className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          Testar PDF Completo
        </button>
        <button
          onClick={handleSimplePDF}
          className="w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
        >
          Testar PDF Simples
        </button>
        <button
          onClick={handleArmadurasReport}
          className="w-full px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors"
        >
          Testar Relatório Armaduras
        </button>
        <button 
          onClick={() => {
            console.log('🔍 Verificando console...');
            alert('Verifica o console (F12) para ver os logs de debug');
          }}
          className="w-full px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
        >
          Ver Console (F12)
        </button>
      </div>
    </div>
  );
};

export default TestPDF;
