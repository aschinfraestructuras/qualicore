import { useRef } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// Exemplo de dados de materiais (mock)
const materiaisExemplo = [
  {
    codigo: "MAT001",
    nome: "Cimento",
    tipo: "cimento",
    quantidade: 100,
    unidade: "kg",
    estado: "aprovado",
    responsavel: "João",
    data_rececao: "2024-06-01",
  },
  {
    codigo: "MAT002",
    nome: "Areia",
    tipo: "agregado",
    quantidade: 200,
    unidade: "kg",
    estado: "pendente",
    responsavel: "Maria",
    data_rececao: "2024-06-02",
  },
  {
    codigo: "MAT003",
    nome: "Aço",
    tipo: "aco",
    quantidade: 50,
    unidade: "kg",
    estado: "reprovado",
    responsavel: "Carlos",
    data_rececao: "2024-06-03",
  },
];

export default function ExportarPDFMateriais() {
  const ref = useRef<HTMLDivElement>(null);

  const exportarPDF = () => {
    const doc = new jsPDF("p", "mm", "a4");

    // Cabeçalho premium com espaço para logotipo
    doc.setFillColor(30, 60, 114); // azul escuro
    doc.rect(0, 0, 210, 32, "F");
    // Espaço reservado para logotipo
    doc.setDrawColor(255, 255, 255);
    doc.setLineWidth(0.5);
    doc.rect(12, 8, 32, 16, "S");
    doc.setFontSize(10);
    doc.setTextColor(255, 255, 255);
    doc.text("Logotipo", 28, 17, { align: "center" });
    // Nome da empresa e relatório
    doc.setFontSize(18);
    doc.text("ASCH INFRAESTRUCTURAS Y SERVICIOS", 55, 16);
    doc.setFontSize(13);
    doc.text("Relatório de Materiais", 55, 25);
    // Data e obra
    doc.setFontSize(10);
    doc.text(`Data: ${new Date().toLocaleDateString("pt-PT")}`, 170, 12);
    doc.text("Obra: [Nome da Obra]", 170, 18);
    doc.text("Responsável: [Seu Nome]", 170, 24);

    // Tabela de Materiais
    autoTable(doc, {
      startY: 40,
      head: [
        [
          "Código",
          "Nome",
          "Tipo",
          "Quantidade",
          "Unidade",
          "Estado",
          "Responsável",
          "Data Receção",
        ],
      ],
      body: materiaisExemplo.map((mat) => [
        mat.codigo,
        mat.nome,
        mat.tipo,
        mat.quantidade,
        mat.unidade,
        mat.estado,
        mat.responsavel,
        mat.data_rececao,
      ]),
      styles: {
        font: "helvetica",
        fontSize: 10,
        cellPadding: 3,
        valign: "middle",
      },
      headStyles: {
        fillColor: [30, 60, 114],
        textColor: 255,
        fontStyle: "bold",
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245],
      },
      margin: { left: 10, right: 10 },
    });

    // Rodapé premium
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(10);
      doc.setTextColor(120, 120, 120);
      doc.text(`Página ${i} de ${pageCount}`, 105, 287, { align: "center" });
      doc.text("ASCH Infraestructuras y Servicios - NIF: 123456789", 10, 287);
      doc.text("www.asch.pt", 170, 287);
    }

    doc.save("relatorio_materiais.pdf");
  };

  return (
    <div
      ref={ref}
      style={{
        padding: 24,
        background: "#f9f9f9",
        borderRadius: 8,
        maxWidth: 600,
        margin: "40px auto",
      }}
    >
      <h2 style={{ fontSize: 22, marginBottom: 16 }}>
        Exportar PDF de Materiais (Premium)
      </h2>
      <p style={{ marginBottom: 16 }}>
        PDF premium com espaço para logotipo, cabeçalho azul, tabela formatada e
        rodapé profissional.
        <br />
        <b>Nota:</b> O logotipo pode ser adicionado depois facilmente.
      </p>
      <button
        onClick={exportarPDF}
        style={{
          padding: "10px 24px",
          background: "#1e3c72",
          color: "#fff",
          border: "none",
          borderRadius: 4,
          fontSize: 16,
          cursor: "pointer",
        }}
      >
        Exportar PDF
      </button>
      <div style={{ marginTop: 32, fontSize: 14, color: "#888" }}>
        <b>Nota:</b> Este componente não altera nada no site. Pode apagar a
        qualquer momento.
      </div>
    </div>
  );
}
