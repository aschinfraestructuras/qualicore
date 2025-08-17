import React, { useState, useEffect, useCallback } from 'react';
import { Plus, Search, Edit, Trash2, Download, Share2, Cloud, Building, FileText, BarChart3, Eye, X } from 'lucide-react';
import { EnsaioCompactacao } from '../types';
import { ensaioCompactacaoService } from '../services/ensaioCompactacaoService';
import EnsaioCompactacaoForm from '../components/forms/EnsaioCompactacaoForm';
import RelatorioEnsaiosCompactacaoPremium from '../components/RelatorioEnsaiosCompactacaoPremium';
import { PDFService } from '../services/pdfService';
import { obrasAPI } from '../lib/supabase-api';
import toast from 'react-hot-toast';

export default function EnsaiosCompactacao() {
  const [ensaios, setEnsaios] = useState<EnsaioCompactacao[]>([]);
  const [obras, setObras] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [showRelatorio, setShowRelatorio] = useState(false);
  const [showDocumentsModal, setShowDocumentsModal] = useState(false);
  const [editingEnsaio, setEditingEnsaio] = useState<EnsaioCompactacao | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterObra, setFilterObra] = useState('');
  const [filterLocalizacao, setFilterLocalizacao] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [ensaiosData, obrasData] = await Promise.all([
        ensaioCompactacaoService.getAll(),
        obrasAPI.getAll()
      ]);
      setEnsaios(ensaiosData);
      setObras(obrasData);
    } catch (error: any) {
      console.error('Erro ao carregar dados:', error);
      
      // Verificar se é erro de tabela não encontrada
      if (error.message?.includes('404') || error.message?.includes('relation "ensaios_compactacao" does not exist')) {
        toast.error('Tabela de ensaios de compactação não encontrada. Execute a migração no Supabase primeiro.');
      } else {
        toast.error('Erro ao carregar dados. Verifique sua conexão.');
      }
      
      setEnsaios([]);
      setObras([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingEnsaio(null);
    setShowForm(true);
  };

  const handleEdit = (ensaio: EnsaioCompactacao) => {
    setEditingEnsaio(ensaio);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este ensaio?')) {
      try {
        await ensaioCompactacaoService.delete(id);
        await loadData();
      } catch (error) {
        console.error('Erro ao deletar ensaio:', error);
      }
    }
  };

    const handleSubmit = async (ensaio: EnsaioCompactacao) => {
    try {
      if (editingEnsaio) {
        await ensaioCompactacaoService.update(editingEnsaio.id!, ensaio);
      } else {
        await ensaioCompactacaoService.create(ensaio);
      }

      setShowForm(false);
      await loadData();
    } catch (error) {
      console.error('Erro ao salvar ensaio:', error);
      toast.error('Erro ao salvar ensaio de compactação');
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingEnsaio(null);
  };

  const handleExportEnsaio = async (ensaio: EnsaioCompactacao) => {
    try {
      const pdfUrl = await PDFService.exportEnsaioCompactacao(ensaio);
      const link = document.createElement('a');
      link.href = pdfUrl;
      link.download = `${ensaio.numeroEnsaio}-${ensaio.codigo}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success('Ensaio de compactação exportado com sucesso!');
    } catch (error) {
      console.error('Erro ao exportar ensaio:', error);
      toast.error('Erro ao exportar ensaio de compactação.');
    }
  };

  const handleExportObra = async (obraNome: string) => {
    try {
      const obra = obras.find(o => o.nome === obraNome);
      if (!obra) {
        toast.error('Obra não encontrada');
        return;
      }

      const pdfService = new PDFService();
      await pdfService.generateObrasIndividualReport([obra]);
      toast.success('Relatório individual da obra gerado com sucesso!');
    } catch (error) {
      console.error('Erro ao gerar relatório individual:', error);
      toast.error('Erro ao gerar relatório individual');
    }
  };

  const handleViewDocuments = (ensaio: EnsaioCompactacao) => {
    if (ensaio.documents && ensaio.documents.length > 0) {
      // Abrir modal para visualizar documentos
      setEditingEnsaio(ensaio);
      setShowDocumentsModal(true);
    } else {
      toast("Este ensaio não possui documentos carregados");
    }
  };

  const filteredEnsaios = ensaios.filter(ensaio => {
    const matchesSearch = (ensaio.numeroEnsaio?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
                         (ensaio.codigo?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
                         (ensaio.elemento?.toLowerCase() || '').includes(searchTerm.toLowerCase());
    const matchesObra = !filterObra || ensaio.obra === filterObra;
    const matchesLocalizacao = !filterLocalizacao || ensaio.localizacao === filterLocalizacao;
    
    return matchesSearch && matchesObra && matchesLocalizacao;
  });

  const obrasUnicas = [...new Set(ensaios.map(e => e.obra))];
  const localizacoes = [...new Set(ensaios.map(e => e.localizacao))];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-lg">Carregando ensaios de compactação...</div>
      </div>
    );
  }

  return (
    <div className="h-full w-full flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 pt-12">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Ensaios de Compactação</h1>
          <div className="flex gap-3">
            <button 
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
              onClick={() => setShowRelatorio(true)}
            >
              <FileText className="h-4 w-4" />
              Relatórios
            </button>
            <button 
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
              onClick={handleCreate}
            >
              <Plus className="h-4 w-4" />
              Novo Ensaio
            </button>
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Pesquisar
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Número, código ou elemento..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Obra
            </label>
            <select
              value={filterObra}
              onChange={(e) => setFilterObra(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Todas as obras</option>
              {obrasUnicas.map(obra => (
                <option key={obra} value={obra}>{obra}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Localização
            </label>
            <select
              value={filterLocalizacao}
              onChange={(e) => setFilterLocalizacao(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Todas as localizações</option>
              {localizacoes.map(localizacao => (
                <option key={localizacao} value={localizacao}>{localizacao}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Conteúdo Principal */}
      <div className="flex-1 overflow-hidden">
        {/* Lista de Ensaios */}
        <div className="h-full bg-white">
          <div className="overflow-x-auto h-full">
            <table className="w-full">
              <thead className="bg-gray-50 sticky top-0">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ensaio
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Obra
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Localização
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Elemento
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Pontos
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Densidade Média
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Grau Compactação
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Data
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ref. Laboratório
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredEnsaios.map((ensaio) => (
                  <tr key={ensaio.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {ensaio.numeroEnsaio}
                        </div>
                        <div className="text-sm text-gray-500">
                          {ensaio.codigo}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-900">{ensaio.obra}</span>
                        <button
                          onClick={() => handleExportObra(ensaio.obra)}
                          className="text-blue-600 hover:text-blue-900"
                          title="Exportar Obra"
                        >
                          <Building className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {ensaio.localizacao}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {ensaio.elemento}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {ensaio.pontos.length} pontos
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {ensaio.densidadeSecaMedia?.toFixed(3)} g/cm³
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        ensaio.grauCompactacaoMedio >= 95 ? 'bg-green-100 text-green-800' :
                        ensaio.grauCompactacaoMedio >= 90 ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {ensaio.grauCompactacaoMedio?.toFixed(1)}%
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(ensaio.dataAmostra).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {ensaio.referenciaLaboratorioExterno || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleEdit(ensaio)}
                          className="text-blue-600 hover:text-blue-900"
                          title="Editar"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleViewDocuments(ensaio)}
                          className="text-cyan-600 hover:text-cyan-900"
                          title="Ver Documentos"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(ensaio.id!)}
                          className="text-red-600 hover:text-red-900"
                          title="Excluir"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleExportEnsaio(ensaio)}
                          className="text-green-600 hover:text-green-900"
                          title="Exportar PDF"
                        >
                          <Download className="h-4 w-4" />
                        </button>
                        <button
                          className="text-purple-600 hover:text-purple-900"
                          title="Partilhar"
                        >
                          <Share2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredEnsaios.length === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-500 text-lg">
                  {searchTerm || filterObra || filterLocalizacao 
                    ? 'Nenhum ensaio encontrado com os filtros aplicados.'
                    : 'Nenhum ensaio de compactação registado ainda.'}
                </div>
                {!searchTerm && !filterObra && !filterLocalizacao && (
                  <button
                    onClick={handleCreate}
                    className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 mx-auto"
                  >
                    <Plus className="h-4 w-4" />
                    Criar Primeiro Ensaio
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Estatísticas */}
        {ensaios.length > 0 && (
          <div className="bg-white border-t border-gray-200 px-6 py-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="text-sm font-medium text-gray-500">Total de Ensaios</div>
                <div className="text-2xl font-bold text-gray-900">{ensaios.length}</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="text-sm font-medium text-gray-500">Obras</div>
                <div className="text-2xl font-bold text-gray-900">{obrasUnicas.length}</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="text-sm font-medium text-gray-500">Localizações</div>
                <div className="text-2xl font-bold text-gray-900">{localizacoes.length}</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="text-sm font-medium text-gray-500">Grau Médio</div>
                <div className="text-2xl font-bold text-gray-900">
                  {(ensaios.reduce((sum, e) => sum + (e.grauCompactacaoMedio || 0), 0) / ensaios.length).toFixed(1)}%
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal do Formulário */}
      {showForm && (
        <>
          {console.log('Renderizando modal - showForm:', showForm)}
          <EnsaioCompactacaoForm
            ensaio={editingEnsaio || undefined}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
          />
        </>
      )}


      {/* Modal de Relatórios */}
      {showRelatorio && (
        <RelatorioEnsaiosCompactacaoPremium
          ensaios={filteredEnsaios}
          onClose={() => setShowRelatorio(false)}
        />
      )}

      {/* Modal de Visualização de Documentos */}
      {showDocumentsModal && editingEnsaio && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">
                  Documentos do Ensaio: {editingEnsaio.numeroEnsaio}
                </h2>
                <button
                  onClick={() => setShowDocumentsModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div className="mb-4">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Documentos Carregados ({editingEnsaio.documents?.length || 0})
                  </h3>
                  <p className="text-sm text-gray-600">
                    Visualize e faça download dos documentos associados a este ensaio de compactação.
                  </p>
                </div>
                
                {editingEnsaio.documents && editingEnsaio.documents.length > 0 ? (
                  <div className="space-y-3">
                    {editingEnsaio.documents.map((doc: any, index: number) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-blue-100 rounded-lg">
                            <FileText className="h-5 w-5 text-blue-600" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">
                              {doc.name || `Documento ${index + 1}`}
                            </p>
                            <p className="text-sm text-gray-500">
                              {(doc.size / 1024).toFixed(2)} KB
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => window.open(doc.url, '_blank')}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Visualizar"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => {
                              const link = document.createElement('a');
                              link.href = doc.url;
                              link.download = doc.name || `documento_${index + 1}`;
                              link.click();
                            }}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                            title="Download"
                          >
                            <Download className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">Nenhum documento carregado para este ensaio</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 