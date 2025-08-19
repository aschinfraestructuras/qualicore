import { useState } from "react";
import { printService, PrintOptions } from "@/services/printService";
import { MetricasReais } from "@/services/metricsService";
import toast from "react-hot-toast";

interface UsePrintSystemOptions {
  modulo: string;
  titulo?: string;
  subtitulo?: string;
}

export const usePrintSystem = (options: UsePrintSystemOptions) => {
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [loading, setLoading] = useState(false);

  // Imprimir página atual
  const printCurrentPage = () => {
    try {
      printService.printCurrentPage();
      toast.success("Página atual enviada para impressão!");
    } catch (error) {
      console.error("Erro ao imprimir página atual:", error);
      toast.error("Erro ao imprimir página atual");
    }
  };

  // Imprimir relatório específico
  const printRelatorio = async (
    tipo: "executivo" | "detalhado" | "comparativo" | "individual",
    dados: any[],
    metricas?: MetricasReais,
    configuracao?: Partial<PrintOptions>
  ) => {
    try {
      setLoading(true);

      const printOptions: PrintOptions = {
        titulo: options.titulo || `Relatório de ${getModuloTitle(options.modulo)}`,
        subtitulo: options.subtitulo || `${getTipoTitle(tipo)} - ${new Date().toLocaleDateString('pt-PT')}`,
        tipo,
        modulo: options.modulo as any,
        dados,
        metricas,
        incluirKPIs: true,
        incluirTabelas: true,
        incluirGraficos: tipo === 'comparativo',
        ...configuracao
      };

      await printService.printRelatorio(printOptions);
      toast.success("Relatório enviado para impressão!");
    } catch (error) {
      console.error("Erro ao imprimir relatório:", error);
      toast.error("Erro ao gerar relatório para impressão");
    } finally {
      setLoading(false);
    }
  };

  // Imprimir dashboard
  const printDashboard = async (metricas: MetricasReais) => {
    try {
      setLoading(true);
      await printService.printDashboard(metricas);
      toast.success("Dashboard enviado para impressão!");
    } catch (error) {
      console.error("Erro ao imprimir dashboard:", error);
      toast.error("Erro ao gerar dashboard para impressão");
    } finally {
      setLoading(false);
    }
  };

  // Imprimir relatório executivo rápido
  const printExecutivo = async (dados: any[], metricas?: MetricasReais) => {
    await printRelatorio("executivo", dados, metricas);
  };

  // Imprimir relatório detalhado
  const printDetalhado = async (dados: any[], metricas?: MetricasReais) => {
    await printRelatorio("detalhado", dados, metricas);
  };

  // Imprimir relatório comparativo
  const printComparativo = async (dados: any[], metricas?: MetricasReais) => {
    await printRelatorio("comparativo", dados, metricas);
  };

  // Imprimir relatório individual
  const printIndividual = async (dados: any[], metricas?: MetricasReais) => {
    if (dados.length !== 1) {
      toast.error("Relatório individual deve conter apenas um item");
      return;
    }
    await printRelatorio("individual", dados, metricas);
  };

  // Abrir modal de impressão
  const openPrintModal = () => {
    setShowPrintModal(true);
  };

  // Fechar modal de impressão
  const closePrintModal = () => {
    setShowPrintModal(false);
  };

  return {
    // Estados
    showPrintModal,
    loading,
    
    // Ações
    printCurrentPage,
    printRelatorio,
    printDashboard,
    printExecutivo,
    printDetalhado,
    printComparativo,
    printIndividual,
    openPrintModal,
    closePrintModal
  };
};

// Funções auxiliares
const getModuloTitle = (modulo: string): string => {
  const titles: Record<string, string> = {
    'geral': 'Geral',
    'ensaios': 'Ensaios',
    'checklists': 'Checklists',
    'materiais': 'Materiais',
    'ncs': 'Não Conformidades',
    'documentos': 'Documentos',
    'fornecedores': 'Fornecedores',
    'obras': 'Obras'
  };
  return titles[modulo] || modulo;
};

const getTipoTitle = (tipo: string): string => {
  const titles: Record<string, string> = {
    'executivo': 'Relatório Executivo',
    'detalhado': 'Relatório Detalhado',
    'comparativo': 'Relatório Comparativo',
    'individual': 'Relatório Individual'
  };
  return titles[tipo] || tipo;
}; 
