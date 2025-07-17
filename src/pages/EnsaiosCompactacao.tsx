import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2, Download, Share2, Cloud } from 'lucide-react';
import { EnsaioCompactacao } from '../types';
import { ensaioCompactacaoService } from '../services/ensaioCompactacaoService';
import EnsaioCompactacaoForm from '../components/forms/EnsaioCompactacaoForm';

export default function EnsaiosCompactacao() {
  const [ensaios, setEnsaios] = useState<EnsaioCompactacao[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingEnsaio, setEditingEnsaio] = useState<EnsaioCompactacao | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterObra, setFilterObra] = useState('');
  const [filterLocalizacao, setFilterLocalizacao] = useState('');

  useEffect(() => {
    loadEnsaios();
  }, []);

  const loadEnsaios = async () => {
    try {
      setLoading(true);
      const data = await ensaioCompactacaoService.getAll();
      setEnsaios(data);
    } catch (error) {
      console.error('Erro ao carregar ensaios:', error);
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
        await loadEnsaios();
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
      await loadEnsaios();
    } catch (error) {
      console.error('Erro ao salvar ensaio:', error);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingEnsaio(null);
  };

  const filteredEnsaios = ensaios.filter(ensaio => {
    const matchesSearch = ensaio.numeroEnsaio.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ensaio.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ensaio.elemento.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesObra = !filterObra || ensaio.obra === filterObra;
    const matchesLocalizacao = !filterLocalizacao || ensaio.localizacao === filterLocalizacao;
    
    return matchesSearch && matchesObra && matchesLocalizacao;
  });

  const obras = [...new Set(ensaios.map(e => e.obra))];
  const localizacoes = [...new Set(ensaios.map(e => e.localizacao))];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Carregando ensaios de compactação...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Ensaios de Compactação</h1>
        <button className="btn btn-primary" onClick={handleCreate}>
          <Plus className="h-4 w-4 mr-2" />
          Novo Ensaio
        </button>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
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
              {obras.map(obra => (
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

      {/* Lista de Ensaios */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
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
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {ensaio.obra}
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
                        onClick={() => handleDelete(ensaio.id!)}
                        className="text-red-600 hover:text-red-900"
                        title="Excluir"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                      <button
                        className="text-green-600 hover:text-green-900"
                        title="Download PDF"
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
        </div>

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
                className="mt-4 btn btn-primary"
              >
                <Plus className="h-4 w-4 mr-2" />
                Criar Primeiro Ensaio
              </button>
            )}
          </div>
        )}
      </div>

      {/* Estatísticas */}
      {ensaios.length > 0 && (
        <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-sm font-medium text-gray-500">Total de Ensaios</div>
            <div className="text-2xl font-bold text-gray-900">{ensaios.length}</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-sm font-medium text-gray-500">Obras</div>
            <div className="text-2xl font-bold text-gray-900">{obras.length}</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-sm font-medium text-gray-500">Localizações</div>
            <div className="text-2xl font-bold text-gray-900">{localizacoes.length}</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-sm font-medium text-gray-500">Grau Médio</div>
            <div className="text-2xl font-bold text-gray-900">
              {(ensaios.reduce((sum, e) => sum + (e.grauCompactacaoMedio || 0), 0) / ensaios.length).toFixed(1)}%
            </div>
          </div>
        </div>
      )}

      {/* Modal do Formulário */}
      {showForm && (
        <EnsaioCompactacaoForm
          ensaio={editingEnsaio || undefined}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      )}
    </div>
  );
} 