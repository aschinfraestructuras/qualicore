import React, { useState, useRef } from 'react';
import { FileText, Download, Printer, Filter, Calendar, Search, X, CheckCircle, AlertTriangle, Clock, MapPin, TestTube, Building } from 'lucide-react';
import { useReactToPrint } from 'react-to-print';

interface RelatorioEnsaiosProps {
  ensaios: any[];
  isOpen: boolean;
  onClose: () => void;
}

export function RelatorioEnsaios({ ensaios, isOpen, onClose }: RelatorioEnsaiosProps) {
  const [tipoRelatorio, setTipoRelatorio] = useState('completo');
  const [incluirCustos, setIncluirCustos] = useState(false);
  const componentRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  const estatisticas = {
    total: ensaios.length,
    conformes: ensaios.filter(e => e.conforme === 'sim').length,
    naoConformes: ensaios.filter(e => e.conforme === 'nao').length,
    pendentes: ensaios.filter(e => e.estado === 'pendente').length,
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-6xl h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Relatório Premium - Ensaios</h2>
            <p className="text-gray-600">Relatório profissional com layout institucional</p>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={handlePrint}
              className="btn btn-primary btn-md"
            >
              <Printer className="h-4 w-4 mr-2" />
              Imprimir
            </button>
            <button
              onClick={onClose}
              className="btn btn-secondary btn-md"
            >
              <X className="h-4 w-4 mr-2" />
              Fechar
            </button>
          </div>
        </div>

        {/* Conteúdo do Relatório */}
        <div className="flex-1 overflow-auto p-6">
          <div ref={componentRef} className="bg-white">
            {/* Cabeçalho Institucional */}
            <div className="text-center mb-8 border-b-2 border-gray-300 pb-6">
              <div className="flex items-center justify-center mb-4">
                <div className="w-16 h-16 bg-blue-600 rounded-lg flex items-center justify-center mr-4">
                  <Building className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">ASCH Infraestructuras y Servicios SA</h1>
                  <p className="text-lg text-gray-600">Sistema de Gestão da Qualidade</p>
                </div>
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Relatório de Ensaios Técnicos</h2>
              <p className="text-gray-600">Qualicore® - Software de Gestão da Qualidade</p>
              <p className="text-sm text-gray-500 mt-2">
                Gerado em: {new Date().toLocaleDateString('pt-PT')} às {new Date().toLocaleTimeString('pt-PT')}
              </p>
            </div>

            {/* Estatísticas Gerais */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <div className="text-2xl font-bold text-blue-600">{estatisticas.total}</div>
                <div className="text-sm text-blue-700">Total de Ensaios</div>
              </div>
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <div className="text-2xl font-bold text-green-600">{estatisticas.conformes}</div>
                <div className="text-sm text-green-700">Conformes</div>
              </div>
              <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                <div className="text-2xl font-bold text-red-600">{estatisticas.naoConformes}</div>
                <div className="text-sm text-red-700">Não Conformes</div>
              </div>
              <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                <div className="text-2xl font-bold text-yellow-600">{estatisticas.pendentes}</div>
                <div className="text-sm text-yellow-700">Pendentes</div>
              </div>
            </div>

            {/* Tabela de Ensaios */}
            <div className="mb-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Detalhamento dos Ensaios</h3>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border border-gray-300 px-3 py-2 text-left text-sm font-semibold">Código</th>
                      <th className="border border-gray-300 px-3 py-2 text-left text-sm font-semibold">Tipo</th>
                      <th className="border border-gray-300 px-3 py-2 text-left text-sm font-semibold">Data</th>
                      <th className="border border-gray-300 px-3 py-2 text-left text-sm font-semibold">Laboratório</th>
                      <th className="border border-gray-300 px-3 py-2 text-left text-sm font-semibold">Estado</th>
                      <th className="border border-gray-300 px-3 py-2 text-left text-sm font-semibold">Conforme</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ensaios.map((ensaio, index) => (
                      <tr key={ensaio.id || index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        <td className="border border-gray-300 px-3 py-2 text-sm">{ensaio.codigo || 'N/A'}</td>
                        <td className="border border-gray-300 px-3 py-2 text-sm">{ensaio.tipo || 'N/A'}</td>
                        <td className="border border-gray-300 px-3 py-2 text-sm">
                          {ensaio.data_ensaio ? new Date(ensaio.data_ensaio).toLocaleDateString('pt-PT') : 'N/A'}
                        </td>
                        <td className="border border-gray-300 px-3 py-2 text-sm">{ensaio.laboratorio || 'N/A'}</td>
                        <td className="border border-gray-300 px-3 py-2 text-sm">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            ensaio.estado === 'aprovado' ? 'bg-green-100 text-green-800' :
                            ensaio.estado === 'reprovado' ? 'bg-red-100 text-red-800' :
                            ensaio.estado === 'pendente' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {ensaio.estado || 'N/A'}
                          </span>
                        </td>
                        <td className="border border-gray-300 px-3 py-2 text-sm">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            ensaio.conforme === 'sim' ? 'bg-green-100 text-green-800' :
                            ensaio.conforme === 'nao' ? 'bg-red-100 text-red-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {ensaio.conforme || 'N/A'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Rodapé */}
            <div className="border-t-2 border-gray-300 pt-6 text-center">
              <p className="text-sm text-gray-600 mb-2">
                Relatório gerado pelo sistema Qualicore® - Desenvolvido por José Antunes
              </p>
              <p className="text-xs text-gray-500">
                © 2024 ASCH Infraestructuras y Servicios SA. Todos os direitos reservados.
              </p>
              <div className="mt-4 flex justify-center space-x-8 text-xs text-gray-500">
                <span>Página 1 de 1</span>
                <span>Data: {new Date().toLocaleDateString('pt-PT')}</span>
                <span>Hora: {new Date().toLocaleTimeString('pt-PT')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
