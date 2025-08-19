import { Printer, Download, FileText, Eye } from "lucide-react";
import { usePrintSystem } from "@/hooks/usePrintSystem";
import UniversalPrintModal from "./UniversalPrintModal";

interface UniversalPrintButtonProps {
  modulo: string;
  dados?: any[];
  metricas?: any;
  titulo?: string;
  subtitulo?: string;
  variant?: "button" | "icon" | "dropdown";
  size?: "sm" | "md" | "lg";
  className?: string;
  showQuickActions?: boolean;
}

export default function UniversalPrintButton({
  modulo,
  dados = [],
  metricas,
  titulo,
  subtitulo,
  variant = "button",
  size = "md",
  className = "",
  showQuickActions = false
}: UniversalPrintButtonProps) {
  const {
    showPrintModal,
    loading,
    printCurrentPage,
    printExecutivo,
    printDetalhado,
    printComparativo,
    printIndividual,
    openPrintModal,
    closePrintModal
  } = usePrintSystem({
    modulo,
    titulo,
    subtitulo
  });

  const sizeClasses = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2",
    lg: "px-6 py-3 text-lg"
  };

  const iconSizes = {
    sm: "h-4 w-4",
    md: "h-5 w-5",
    lg: "h-6 w-6"
  };

  // Botão simples
  if (variant === "button") {
    return (
      <>
        <button
          onClick={openPrintModal}
          disabled={loading}
          className={`inline-flex items-center space-x-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 ${sizeClasses[size]} ${className}`}
        >
          {loading ? (
            <div className={`animate-spin rounded-full border-b-2 border-white ${iconSizes[size]}`}></div>
          ) : (
            <Printer className={iconSizes[size]} />
          )}
          <span>Imprimir</span>
        </button>

        <UniversalPrintModal
          isOpen={showPrintModal}
          onClose={closePrintModal}
          modulo={modulo}
          dados={dados}
          metricas={metricas}
          titulo={titulo}
          subtitulo={subtitulo}
        />
      </>
    );
  }

  // Botão de ícone
  if (variant === "icon") {
    return (
      <>
        <button
          onClick={openPrintModal}
          disabled={loading}
          className={`p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors disabled:opacity-50 ${className}`}
          title="Impressão Universal"
        >
          {loading ? (
            <div className={`animate-spin rounded-full border-b-2 border-blue-600 ${iconSizes[size]}`}></div>
          ) : (
            <Printer className={iconSizes[size]} />
          )}
        </button>

        <UniversalPrintModal
          isOpen={showPrintModal}
          onClose={closePrintModal}
          modulo={modulo}
          dados={dados}
          metricas={metricas}
          titulo={titulo}
          subtitulo={subtitulo}
        />
      </>
    );
  }

  // Dropdown com ações rápidas
  if (variant === "dropdown") {
    return (
      <>
        <div className="relative inline-block text-left">
          <button
            onClick={openPrintModal}
            disabled={loading}
            className={`inline-flex items-center space-x-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 ${sizeClasses[size]} ${className}`}
          >
            {loading ? (
              <div className={`animate-spin rounded-full border-b-2 border-white ${iconSizes[size]}`}></div>
            ) : (
              <Printer className={iconSizes[size]} />
            )}
            <span>Imprimir</span>
          </button>

          {showQuickActions && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-50">
              <div className="py-1">
                <button
                  onClick={printCurrentPage}
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <Eye className="h-4 w-4 mr-3" />
                  Imprimir Página Atual
                </button>
                <button
                  onClick={() => printExecutivo(dados, metricas)}
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <FileText className="h-4 w-4 mr-3" />
                  Relatório Executivo
                </button>
                <button
                  onClick={() => printDetalhado(dados, metricas)}
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <Download className="h-4 w-4 mr-3" />
                  Relatório Detalhado
                </button>
                <button
                  onClick={() => printComparativo(dados, metricas)}
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <FileText className="h-4 w-4 mr-3" />
                  Relatório Comparativo
                </button>
                {dados.length === 1 && (
                  <button
                    onClick={() => printIndividual(dados, metricas)}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <Eye className="h-4 w-4 mr-3" />
                    Relatório Individual
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        <UniversalPrintModal
          isOpen={showPrintModal}
          onClose={closePrintModal}
          modulo={modulo}
          dados={dados}
          metricas={metricas}
          titulo={titulo}
          subtitulo={subtitulo}
        />
      </>
    );
  }

  return null;
} 
