import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Download, 
  FileText, 
  FileSpreadsheet, 
  FileCode, 
  X, 
  CheckCircle,
  AlertCircle,
  Calendar,
  MapPin,
  Users,
  Shield
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { Auditoria } from '../types/auditorias';
import { auditoriasAPI } from '../lib/supabase-api/auditoriasAPI';

interface ExportarAuditoriaProps {
  auditoria: Auditoria;
  onClose: () => void;
}

export default function ExportarAuditoria({ auditoria, onClose }: ExportarAuditoriaProps) {
  const [formato, setFormato] = useState<'pdf' | 'excel' | 'csv'>('pdf');
  const [incluirEvidencias, setIncluirEvidencias] = useState(true);
  const [incluirNaoConformidades, setIncluirNaoConformidades] = useState(true);
  const [incluirObservacoes, setIncluirObservacoes] = useState(true);
  const [incluirAcoesCorretivas, setIncluirAcoesCorretivas] = useState(true);
  const [loading, setLoading] = useState(false);

  const formatos = [
    { 
      id: 'pdf', 
      label: 'PDF', 
      icon: FileText, 
      description: 'Documento formatado para impressão',
      color: 'text-red-600'
    },
    { 
      id: 'excel', 
      label: 'Excel', 
      icon: FileSpreadsheet, 
      description: 'Planilha com dados estruturados',
      color: 'text-green-600'
    },
    { 
      id: 'csv', 
      label: 'CSV', 
      icon: FileCode, 
      description: 'Dados em formato texto simples',
      color: 'text-blue-600'
    }
  ];

  const handleExport = async () => {
    setLoading(true);
    
    try {
      const url = await auditoriasAPI.exportarAuditoria(auditoria.id, formato);
      
      // Simular download
      const link = document.createElement('a');
      link.href = url;
      link.download = `auditoria-${auditoria.codigo}-${new Date().toISOString().split('T')[0]}.${formato}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success(`Auditoria exportada com sucesso em formato ${formato.toUpperCase()}`);
      onClose();
    } catch (error) {
      console.error('Erro ao exportar auditoria:', error);
      toast.error('Erro ao exportar auditoria');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'concluida': return 'text-green-600 bg-green-100';
      case 'em_curso': return 'text-blue-600 bg-blue-100';
      case 'programada': return 'text-yellow-600 bg-yellow-100';
      case 'cancelada': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getResultadoColor = (resultado: string) => {
    switch (resultado) {
      case 'conforme': return 'text-green-600 bg-green-100';
      case 'nao_conforme': return 'text-red-600 bg-red-100';
      case 'conforme_com_observacoes': return 'text-yellow-600 bg-yellow-100';
      case 'pendente': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Download className="h-8 w-8" />
              <div>
                <h2 className="text-2xl font-bold">Exportar Auditoria</h2>
                <p className="text-green-100">
                  {auditoria.codigo} - {auditoria.escopo}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Informações da Auditoria */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Informações da Auditoria</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-3">
                <Shield className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-sm font-medium text-gray-900">{auditoria.codigo}</p>
                  <p className="text-sm text-gray-500">{auditoria.tipo}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Calendar className="h-5 w-5 text-green-600" />
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {new Date(auditoria.data_inicio).toLocaleDateString('pt-PT')}
                  </p>
                  <p className="text-sm text-gray-500">{auditoria.duracao_horas}h</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <MapPin className="h-5 w-5 text-red-600" />
                <div>
                  <p className="text-sm font-medium text-gray-900">{auditoria.local}</p>
                  <p className="text-sm text-gray-500">{auditoria.obra_nome}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Users className="h-5 w-5 text-purple-600" />
                <div>
                  <p className="text-sm font-medium text-gray-900">{auditoria.auditor_principal}</p>
                  <p className="text-sm text-gray-500">{auditoria.auditores?.length || 0} auditores</p>
                </div>
              </div>
            </div>
            
            <div className="mt-4 flex items-center space-x-4">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(auditoria.status)}`}>
                {auditoria.status.replace('_', ' ')}
              </span>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getResultadoColor(auditoria.resultado)}`}>
                {auditoria.resultado.replace('_', ' ')}
              </span>
            </div>
          </div>

          {/* Formato de Exportação */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Formato de Exportação</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {formatos.map((fmt) => (
                <button
                  key={fmt.id}
                  onClick={() => setFormato(fmt.id as 'pdf' | 'excel' | 'csv')}
                  className={`p-4 border-2 rounded-lg text-left transition-all ${
                    formato === fmt.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <fmt.icon className={`h-6 w-6 ${fmt.color}`} />
                    <div>
                      <p className="font-medium text-gray-900">{fmt.label}</p>
                      <p className="text-sm text-gray-500">{fmt.description}</p>
                    </div>
                  </div>
                  {formato === fmt.id && (
                    <CheckCircle className="h-5 w-5 text-blue-600 mt-2" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Opções de Conteúdo */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Conteúdo a Incluir</h3>
            <div className="space-y-3">
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={incluirEvidencias}
                  onChange={(e) => setIncluirEvidencias(e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="text-gray-700">Evidências e documentos</span>
                <span className="text-sm text-gray-500">({auditoria.evidencias?.length || 0} ficheiros)</span>
              </label>
              
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={incluirNaoConformidades}
                  onChange={(e) => setIncluirNaoConformidades(e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="text-gray-700">Não conformidades</span>
                <span className="text-sm text-gray-500">({auditoria.nao_conformidades?.length || 0} itens)</span>
              </label>
              
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={incluirObservacoes}
                  onChange={(e) => setIncluirObservacoes(e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="text-gray-700">Observações</span>
                <span className="text-sm text-gray-500">({auditoria.observacoes?.length || 0} itens)</span>
              </label>
              
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={incluirAcoesCorretivas}
                  onChange={(e) => setIncluirAcoesCorretivas(e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="text-gray-700">Ações corretivas</span>
                <span className="text-sm text-gray-500">({auditoria.acoes_corretivas?.length || 0} itens)</span>
              </label>
            </div>
          </div>

          {/* Estatísticas */}
          <div className="bg-blue-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Resumo da Auditoria</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">{auditoria.criterios_auditoria?.length || 0}</p>
                <p className="text-sm text-gray-600">Critérios</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">
                  {auditoria.criterios_auditoria?.filter(c => c.conformidade === 'conforme').length || 0}
                </p>
                <p className="text-sm text-gray-600">Conformes</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-red-600">
                  {auditoria.criterios_auditoria?.filter(c => c.conformidade === 'nao_conforme').length || 0}
                </p>
                <p className="text-sm text-gray-600">Não Conformes</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-purple-600">
                  {auditoria.percentagem_conformidade || 0}%
                </p>
                <p className="text-sm text-gray-600">Conformidade</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <AlertCircle className="h-4 w-4" />
              <span>O ficheiro será descarregado automaticamente</span>
            </div>
            <div className="flex items-center space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleExport}
                disabled={loading}
                className="flex items-center space-x-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                  <Download className="h-4 w-4" />
                )}
                <span>{loading ? 'A exportar...' : `Exportar ${formato.toUpperCase()}`}</span>
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
