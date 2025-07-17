import React, { useState, useEffect } from 'react';
import { X, Plus, Calculator } from 'lucide-react';
import { EnsaioCompactacao, PontoEnsaioCompactacao } from '../../types';
import { obrasAPI } from '../../lib/supabase-api';

interface EnsaioCompactacaoFormProps {
  ensaio?: EnsaioCompactacao;
  onSubmit: (ensaio: EnsaioCompactacao) => void;
  onCancel: () => void;
}

export default function EnsaioCompactacaoForm({ ensaio, onSubmit, onCancel }: EnsaioCompactacaoFormProps) {
  const [formData, setFormData] = useState<EnsaioCompactacao>({
    obra: '',
    localizacao: '',
    elemento: '',
    numeroEnsaio: '',
    codigo: '',
    dataAmostra: '',
    densidadeMaximaReferencia: 0,
    humidadeOtimaReferencia: 0,
    pontos: [],
    densidadeSecaMedia: 0,
    humidadeMedia: 0,
    grauCompactacaoMedio: 0,
    referenciaLaboratorioExterno: '',
    observacoes: ''
  });

  const [densidadeMaximaRef, setDensidadeMaximaRef] = useState(0);
  const [obras, setObras] = useState<any[]>([]);
  const [loadingObras, setLoadingObras] = useState(true);

  useEffect(() => {
    if (ensaio) {
      setFormData(ensaio);
      setDensidadeMaximaRef(ensaio.densidadeMaximaReferencia);
    }
    loadObras();
  }, [ensaio]);

  const loadObras = async () => {
    try {
      setLoadingObras(true);
      const obrasData = await obrasAPI.getAll();
      setObras(obrasData);
    } catch (error) {
      console.error('Erro ao carregar obras:', error);
    } finally {
      setLoadingObras(false);
    }
  };

  const addPonto = () => {
    if (formData.pontos.length < 20) {
      const novoPonto: PontoEnsaioCompactacao = {
        numero: formData.pontos.length + 1,
        densidadeSeca: 0,
        humidade: 0,
        grauCompactacao: 0
      };
      setFormData(prev => ({
        ...prev,
        pontos: [...prev.pontos, novoPonto]
      }));
    }
  };

  const removePonto = (index: number) => {
    setFormData(prev => ({
      ...prev,
      pontos: prev.pontos.filter((_, i) => i !== index).map((p, i) => ({ ...p, numero: i + 1 }))
    }));
  };

  const updatePonto = (index: number, field: keyof PontoEnsaioCompactacao, value: number) => {
    setFormData(prev => {
      const novosPontos = [...prev.pontos];
      novosPontos[index] = { ...novosPontos[index], [field]: value };
      
      // Calcular grau de compactação se temos densidade máxima de referência
      if (densidadeMaximaRef > 0 && field === 'densidadeSeca') {
        novosPontos[index].grauCompactacao = (value / densidadeMaximaRef) * 100;
      }
      
      return { ...prev, pontos: novosPontos };
    });
  };

  const calcularMedias = () => {
    if (formData.pontos.length === 0) return;

    const totalDensidade = formData.pontos.reduce((sum, p) => sum + p.densidadeSeca, 0);
    const totalHumidade = formData.pontos.reduce((sum, p) => sum + p.humidade, 0);
    const totalGrauCompactacao = formData.pontos.reduce((sum, p) => sum + p.grauCompactacao, 0);

    const mediaDensidade = totalDensidade / formData.pontos.length;
    const mediaHumidade = totalHumidade / formData.pontos.length;
    const mediaGrauCompactacao = totalGrauCompactacao / formData.pontos.length;

    setFormData(prev => ({
      ...prev,
      densidadeSecaMedia: Number(mediaDensidade.toFixed(3)),
      humidadeMedia: Number(mediaHumidade.toFixed(2)),
      grauCompactacaoMedio: Number(mediaGrauCompactacao.toFixed(2))
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    calcularMedias();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-6xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Ensaio de Compactação</h2>
          <button onClick={onCancel} className="text-gray-500 hover:text-gray-700">
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Seção de Traçabilidade */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Obra *
              </label>
              <select
                value={formData.obra}
                onChange={(e) => setFormData(prev => ({ ...prev, obra: e.target.value }))}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
                disabled={loadingObras}
              >
                <option value="">Selecionar obra...</option>
                {obras.map(obra => (
                  <option key={obra.id} value={obra.nome}>
                    {obra.codigo} - {obra.nome}
                  </option>
                ))}
              </select>
              {loadingObras && (
                <p className="text-sm text-gray-500 mt-1">Carregando obras...</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Localização (PK) *
              </label>
              <input
                type="text"
                value={formData.localizacao}
                onChange={(e) => setFormData(prev => ({ ...prev, localizacao: e.target.value }))}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ex: PK 0+000 a PK 0+100"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Elemento *
              </label>
              <input
                type="text"
                value={formData.elemento}
                onChange={(e) => setFormData(prev => ({ ...prev, elemento: e.target.value }))}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ex: Aterro, Sub-base, Base"
                required
              />
            </div>
          </div>

          {/* Seção de Referências do Ensaio */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Número do Ensaio *
              </label>
              <input
                type="text"
                value={formData.numeroEnsaio}
                onChange={(e) => setFormData(prev => ({ ...prev, numeroEnsaio: e.target.value }))}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ex: EC-2024-001"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Código *
              </label>
              <input
                type="text"
                value={formData.codigo}
                onChange={(e) => setFormData(prev => ({ ...prev, codigo: e.target.value }))}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ex: CÓD-001"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Data da Amostra *
              </label>
              <input
                type="date"
                value={formData.dataAmostra}
                onChange={(e) => setFormData(prev => ({ ...prev, dataAmostra: e.target.value }))}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Densidade Máxima Seca (g/cm³) *
              </label>
              <input
                type="number"
                step="0.001"
                value={densidadeMaximaRef}
                onChange={(e) => {
                  const value = parseFloat(e.target.value) || 0;
                  setDensidadeMaximaRef(value);
                  setFormData(prev => ({ ...prev, densidadeMaximaReferencia: value }));
                }}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ex: 2.150"
                required
              />
            </div>
          </div>

          {/* Seção de Dados Proctor de Referência */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Humidade Ótima (%) *
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.humidadeOtimaReferencia}
                onChange={(e) => setFormData(prev => ({ ...prev, humidadeOtimaReferencia: parseFloat(e.target.value) || 0 }))}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ex: 12.5"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Referência Laboratório Externo
              </label>
              <input
                type="text"
                value={formData.referenciaLaboratorioExterno || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, referenciaLaboratorioExterno: e.target.value }))}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ex: REL-2024-001, Relatório Proctor"
              />
            </div>
          </div>

          {/* Seção de Pontos de Ensaio */}
          <div className="border-t pt-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Pontos de Ensaio</h3>
              <button
                type="button"
                onClick={addPonto}
                disabled={formData.pontos.length >= 20}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors disabled:bg-gray-400"
              >
                <Plus className="h-4 w-4" />
                Adicionar Ponto
              </button>
            </div>

            {formData.pontos.length > 0 && (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border border-gray-300 p-2">Ponto</th>
                      <th className="border border-gray-300 p-2">Densidade Seca (g/cm³)</th>
                      <th className="border border-gray-300 p-2">Humidade (%)</th>
                      <th className="border border-gray-300 p-2">Grau Compactação (%)</th>
                      <th className="border border-gray-300 p-2">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {formData.pontos.map((ponto, index) => (
                      <tr key={index}>
                        <td className="border border-gray-300 p-2 text-center font-medium">
                          {ponto.numero}
                        </td>
                        <td className="border border-gray-300 p-2">
                          <input
                            type="number"
                            step="0.001"
                            value={ponto.densidadeSeca}
                            onChange={(e) => updatePonto(index, 'densidadeSeca', parseFloat(e.target.value) || 0)}
                            className="w-full p-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </td>
                        <td className="border border-gray-300 p-2">
                          <input
                            type="number"
                            step="0.01"
                            value={ponto.humidade}
                            onChange={(e) => updatePonto(index, 'humidade', parseFloat(e.target.value) || 0)}
                            className="w-full p-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </td>
                        <td className="border border-gray-300 p-2">
                          <input
                            type="number"
                            step="0.01"
                            value={ponto.grauCompactacao}
                            onChange={(e) => updatePonto(index, 'grauCompactacao', parseFloat(e.target.value) || 0)}
                            className="w-full p-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </td>
                        <td className="border border-gray-300 p-2 text-center">
                          <button
                            type="button"
                            onClick={() => removePonto(index)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Botão para calcular médias */}
            {formData.pontos.length > 0 && (
              <div className="mt-4">
                <button
                  type="button"
                  onClick={calcularMedias}
                  className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                >
                  <Calculator className="h-4 w-4" />
                  Calcular Médias
                </button>
              </div>
            )}
          </div>

          {/* Seção de Valores Médios */}
          {formData.pontos.length > 0 && (
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold mb-4">Valores Médios</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Densidade Seca Média (g/cm³)
                  </label>
                  <input
                    type="number"
                    step="0.001"
                    value={formData.densidadeSecaMedia}
                    readOnly
                    className="w-full p-2 border border-gray-300 rounded-md bg-gray-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Humidade Média (%)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.humidadeMedia}
                    readOnly
                    className="w-full p-2 border border-gray-300 rounded-md bg-gray-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Grau de Compactação Médio (%)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.grauCompactacaoMedio}
                    readOnly
                    className="w-full p-2 border border-gray-300 rounded-md bg-gray-50"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Observações */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Observações
            </label>
            <textarea
              value={formData.observacoes || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, observacoes: e.target.value }))}
              rows={3}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Observações adicionais sobre o ensaio..."
            />
          </div>

          {/* Botões de ação */}
          <div className="flex justify-end space-x-4 pt-6 border-t">
            <button
              type="button"
              onClick={onCancel}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-lg transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              {ensaio ? 'Atualizar' : 'Criar'} Ensaio
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 