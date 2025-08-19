// Teste simples para verificar se o PDF generation funciona
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

console.log('🔍 Testando PDF generation...');

try {
  // Criar um PDF simples
  const doc = new jsPDF();
  
  // Adicionar texto
  doc.setFontSize(20);
  doc.text('Teste PDF - Qualicore', 20, 20);
  
  // Adicionar tabela
  autoTable(doc, {
    head: [['Nome', 'Email', 'Telefone']],
    body: [
      ['João Silva', 'joao@email.com', '123-456-789'],
      ['Maria Santos', 'maria@email.com', '987-654-321'],
    ],
    startY: 40,
  });
  
  // Salvar o PDF
  doc.save('teste-pdf.pdf');
  
  console.log('✅ PDF gerado com sucesso!');
} catch (error) {
  console.error('❌ Erro ao gerar PDF:', error);
}
