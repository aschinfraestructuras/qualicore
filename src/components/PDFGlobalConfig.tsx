import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import PDFConfigService from '../services/pdfConfigService';

interface Obra {
  id: string;
  codigo: string;
  nome: string;
  cliente: string;
  localizacao: string;
  responsavel_tecnico: string;
  coordenador_obra: string;
  fiscal_obra: string;
  engenheiro_responsavel: string;
  arquiteto: string;
  valor_contrato: number;
  percentual_execucao: number;
}

const PDFGlobalConfig: React.FC = () => {
  const [config, setConfig] = useState(() => {
    try {
      return PDFConfigService.getInstance().getConfig();
    } catch (error) {
      console.error('Erro ao carregar configuração inicial:', error);
      return PDFConfigService.getInstance().getDefaultConfig();
    }
  });
  const [isOpen, setIsOpen] = useState(false);
  const [obras, setObras] = useState<Obra[]>([]);
  const [selectedObraId, setSelectedObraId] = useState<string>('');
  const [loading, setLoading] = useState(false);

  // Listener para abrir o modal quando o botão da navbar for clicado
  useEffect(() => {
    const handleOpenPDFConfig = () => {
      console.log('🎯 Evento openPDFConfig recebido!');
      setIsOpen(true);
    };

    window.addEventListener('openPDFConfig', handleOpenPDFConfig);

    return () => {
      window.removeEventListener('openPDFConfig', handleOpenPDFConfig);
    };
  }, []);

  // Carregar obras disponíveis
  useEffect(() => {
    const loadObras = async () => {
      try {
        setLoading(true);
        // Primeiro tentar carregar obras reais do módulo obras
        const { obrasAPI } = await import('../lib/supabase-api');
        const obrasReais = await obrasAPI.getAll();
        
        if (obrasReais && obrasReais.length > 0) {
          console.log('✅ Carregando obras reais:', obrasReais);
          const obrasFormatadas = obrasReais.map((obra: any) => ({
            id: obra.id,
            codigo: obra.codigo,
            nome: obra.nome,
            cliente: obra.cliente,
            localizacao: obra.localizacao,
            responsavel_tecnico: obra.responsavel_tecnico,
            coordenador_obra: obra.coordenador_obra,
            fiscal_obra: obra.fiscal_obra,
            engenheiro_responsavel: obra.engenheiro_responsavel,
            arquiteto: obra.arquiteto,
            valor_contrato: obra.valor_contrato || 0,
            percentual_execucao: obra.percentual_execucao || 0
          }));
          setObras(obrasFormatadas);
        } else {
          // Fallback para dados mock se não houver obras reais
          const mockObras: Obra[] = [
            {
              id: "1",
              codigo: "1000",
              nome: "Linha do Sado - Setúbal",
              cliente: "Infraestruturas de Portugal",
              localizacao: "Setúbal",
              responsavel_tecnico: "Mario Cristiano",
              coordenador_obra: "Eng. Maria Santos",
              fiscal_obra: "Eng. Carlos Mendes",
              engenheiro_responsavel: "Eng. Ana Costa",
              arquiteto: "Arq. Pedro Alves",
              valor_contrato: 17500000,
              percentual_execucao: 0
            }
          ];
          setObras(mockObras);
        }
      } catch (error) {
        console.error('Erro ao carregar obras:', error);
        // Fallback para Linha do Sado - Setúbal
        const mockObras: Obra[] = [
          {
            id: "1",
            codigo: "1000", 
            nome: "Linha do Sado - Setúbal",
            cliente: "Infraestruturas de Portugal",
            localizacao: "Setúbal",
            responsavel_tecnico: "Mario Cristiano",
            coordenador_obra: "Eng. Maria Santos",
            fiscal_obra: "Eng. Carlos Mendes",
            engenheiro_responsavel: "Eng. Ana Costa",
            arquiteto: "Arq. Pedro Alves",
            valor_contrato: 17500000,
            percentual_execucao: 0
          }
        ];
        setObras(mockObras);
      } finally {
        setLoading(false);
      }
    };

    if (isOpen) {
      loadObras();
    }
  }, [isOpen]);

  // Selecionar obra automaticamente
  const handleObraSelect = (obraId: string) => {
    setSelectedObraId(obraId);
    const obra = obras.find(o => o.id === obraId);
    if (obra) {
      setConfig(prev => ({
        ...prev,
        obra: {
          id: obra.id,
          nome: obra.nome,
          localizacao: obra.localizacao,
          referencia: obra.codigo,
          cliente: obra.cliente,
          responsavel_tecnico: obra.responsavel_tecnico,
          coordenador_obra: obra.coordenador_obra,
          fiscal_obra: obra.fiscal_obra,
          engenheiro_responsavel: obra.engenheiro_responsavel,
          arquiteto: obra.arquiteto,
          valor_contrato: obra.valor_contrato,
          percentual_execucao: obra.percentual_execucao
        }
      }));
    }
  };

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validar tamanho (máximo 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast.error('O arquivo é muito grande. Máximo 2MB permitido.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setConfig(prev => ({
        ...prev,
        empresa: {
          ...prev.empresa,
          logotipo: result
        }
      }));
      toast.success('Logotipo carregado com sucesso!');
    };

    reader.onerror = () => {
      toast.error('Erro ao carregar o logotipo. Tente novamente.');
    };

    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    try {
      console.log('💾 Salvando configuração:', config);
      PDFConfigService.getInstance().updateConfig(config);
      toast.success('Configuração salva com sucesso!', {
        icon: '✅',
        duration: 3000,
        style: {
          background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
          color: 'white',
          borderRadius: '12px',
          padding: '16px',
          fontSize: '14px',
          fontWeight: '600'
        }
      });
      setIsOpen(false);
    } catch (error) {
      console.error('Erro ao salvar configuração:', error);
      toast.error('Erro ao salvar configuração');
    }
  };

  const handleReset = () => {
    try {
      const defaultConfig = PDFConfigService.getInstance().getDefaultConfig();
      setConfig(defaultConfig);
      setSelectedObraId('');
      toast.success('Configuração resetada para valores padrão!');
    } catch (error) {
      console.error('Erro ao resetar configuração:', error);
      toast.error('Erro ao resetar configuração');
    }
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  // Fechar modal com ESC
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        handleClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
      return () => document.removeEventListener('keydown', handleEsc);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-6xl h-[90vh] flex flex-col bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex-shrink-0 bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">⚙️ Configuração Global de PDFs</h2>
              <p className="text-blue-100 mt-1">Personalize cabeçalhos, rodapés e design dos relatórios</p>
            </div>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Coluna Esquerda */}
            <div className="space-y-8">
              {/* Dados da Empresa */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-200">
                <h3 className="text-lg font-bold text-blue-900 mb-4 flex items-center">
                  🏢 Dados da Empresa
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-blue-800 mb-2">Nome da Empresa</label>
                    <input
                      type="text"
                      value={config.empresa.nome}
                      onChange={(e) => setConfig(prev => ({
                        ...prev,
                        empresa: { ...prev.empresa, nome: e.target.value }
                      }))}
                      className="w-full px-4 py-3 border-2 border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white hover:bg-blue-50"
                      placeholder="Nome da sua empresa"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-blue-800 mb-2">NIF</label>
                    <input
                      type="text"
                      value={config.empresa.nif || ''}
                      onChange={(e) => setConfig(prev => ({
                        ...prev,
                        empresa: { ...prev.empresa, nif: e.target.value }
                      }))}
                      className="w-full px-4 py-3 border-2 border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white hover:bg-blue-50"
                      placeholder="Número de Identificação Fiscal"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-blue-800 mb-2">Morada</label>
                    <input
                      type="text"
                      value={config.empresa.morada}
                      onChange={(e) => setConfig(prev => ({
                        ...prev,
                        empresa: { ...prev.empresa, morada: e.target.value }
                      }))}
                      className="w-full px-4 py-3 border-2 border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white hover:bg-blue-50"
                      placeholder="Endereço completo"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-blue-800 mb-2">Telefone</label>
                      <input
                        type="tel"
                        value={config.empresa.telefone}
                        onChange={(e) => setConfig(prev => ({
                          ...prev,
                          empresa: { ...prev.empresa, telefone: e.target.value }
                        }))}
                        className="w-full px-4 py-3 border-2 border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white hover:bg-blue-50"
                        placeholder="+351 123 456 789"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-blue-800 mb-2">Email</label>
                      <input
                        type="email"
                        value={config.empresa.email}
                        onChange={(e) => setConfig(prev => ({
                          ...prev,
                          empresa: { ...prev.empresa, email: e.target.value }
                        }))}
                        className="w-full px-4 py-3 border-2 border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white hover:bg-blue-50"
                        placeholder="info@empresa.pt"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-blue-800 mb-2">Website</label>
                    <input
                      type="url"
                      value={config.empresa.website || ''}
                      onChange={(e) => setConfig(prev => ({
                        ...prev,
                        empresa: { ...prev.empresa, website: e.target.value }
                      }))}
                      className="w-full px-4 py-3 border-2 border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white hover:bg-blue-50"
                      placeholder="www.empresa.pt"
                    />
                  </div>

                  {/* Upload de Logotipo */}
                  <div>
                    <label className="block text-sm font-medium text-blue-800 mb-2">Logotipo da Empresa</label>
                    <div className="border-2 border-dashed border-blue-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleLogoUpload}
                        className="hidden"
                        id="logo-upload"
                      />
                      <label htmlFor="logo-upload" className="cursor-pointer">
                        <div className="space-y-2">
                          <svg className="mx-auto h-12 w-12 text-blue-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                            <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                          <div className="text-blue-600">
                            <span className="font-medium">Clique para carregar</span> ou arraste e solte
                          </div>
                          <p className="text-xs text-blue-500">PNG, JPG até 2MB</p>
                        </div>
                      </label>
                    </div>
                    {config.empresa.logotipo && (
                      <div className="mt-2 text-sm text-green-600">✅ Logotipo carregado</div>
                    )}
                  </div>
                </div>
              </div>

              {/* Seleção de Obra */}
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-xl border border-green-200">
                <h3 className="text-lg font-bold text-green-900 mb-4 flex items-center">
                  🏗️ Selecionar Obra
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-green-800 mb-2">Obra para Relatórios</label>
                    <select
                      value={selectedObraId}
                      onChange={(e) => handleObraSelect(e.target.value)}
                      disabled={loading}
                      className="w-full px-4 py-3 border-2 border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 bg-white hover:bg-green-50 disabled:opacity-50"
                    >
                      <option value="">{loading ? 'Carregando obras...' : 'Selecione uma obra...'}</option>
                      {obras.map(obra => (
                        <option key={obra.id} value={obra.id}>
                          {obra.codigo} - {obra.nome}
                        </option>
                      ))}
                    </select>
                  </div>

                  {config.obra && (
                    <div className="bg-white p-4 rounded-lg border border-green-200">
                      <h4 className="font-semibold text-green-800 mb-2">Obra Selecionada:</h4>
                      <div className="text-sm space-y-1">
                        <p><strong>Nome:</strong> {config.obra.nome}</p>
                        <p><strong>Cliente:</strong> {config.obra.cliente}</p>
                        <p><strong>Localização:</strong> {config.obra.localizacao}</p>
                        <p><strong>Responsável:</strong> {config.obra.responsavel_tecnico}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Coluna Direita */}
            <div className="space-y-8">
              {/* Cores do Design */}
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-xl border border-purple-200">
                <h3 className="text-lg font-bold text-purple-900 mb-4 flex items-center">
                  🎨 Cores do Design
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-purple-800 mb-2">Cor Primária</label>
                    <div className="flex items-center space-x-3">
                      <input
                        type="color"
                        value={config.design.corPrimaria}
                        onChange={(e) => setConfig(prev => ({
                          ...prev,
                          design: { ...prev.design, corPrimaria: e.target.value }
                        }))}
                        className="w-16 h-12 rounded-lg border-2 border-purple-200 cursor-pointer"
                      />
                      <input
                        type="text"
                        value={config.design.corPrimaria}
                        onChange={(e) => setConfig(prev => ({
                          ...prev,
                          design: { ...prev.design, corPrimaria: e.target.value }
                        }))}
                        className="flex-1 px-4 py-3 border-2 border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 bg-white"
                        placeholder="#3B82F6"
                      />
                    </div>
                    <p className="text-xs text-purple-600 mt-1">Cor principal para cabeçalhos e elementos destacados</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-purple-800 mb-2">Cor Secundária</label>
                    <div className="flex items-center space-x-3">
                      <input
                        type="color"
                        value={config.design.corSecundaria}
                        onChange={(e) => setConfig(prev => ({
                          ...prev,
                          design: { ...prev.design, corSecundaria: e.target.value }
                        }))}
                        className="w-16 h-12 rounded-lg border-2 border-purple-200 cursor-pointer"
                      />
                      <input
                        type="text"
                        value={config.design.corSecundaria}
                        onChange={(e) => setConfig(prev => ({
                          ...prev,
                          design: { ...prev.design, corSecundaria: e.target.value }
                        }))}
                        className="flex-1 px-4 py-3 border-2 border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 bg-white"
                        placeholder="#1E40AF"
                      />
                    </div>
                    <p className="text-xs text-purple-600 mt-1">Cor de destaque para elementos secundários</p>
                  </div>
                </div>
              </div>

              {/* Preview Premium */}
              <div className="bg-gradient-to-br from-gray-50 to-slate-50 p-6 rounded-xl border border-gray-200">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                  👁️ Preview do Design
                </h3>
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <div 
                    className="h-20 rounded-lg mb-4 flex items-center justify-between px-4"
                    style={{ backgroundColor: config.design.corPrimaria }}
                  >
                    <div className="text-white">
                      <div className="font-bold text-lg">{config.empresa.nome || 'Nome da Empresa'}</div>
                      <div className="text-sm opacity-90">Relatório de Qualidade</div>
                    </div>
                    <div className="text-white text-right text-sm">
                      <div>{config.empresa.telefone || 'Telefone'}</div>
                      <div>{config.empresa.email || 'Email'}</div>
                    </div>
                  </div>
                  
                  {config.obra && (
                    <div className="bg-gray-100 p-3 rounded-lg mb-4">
                      <div className="text-sm font-medium text-gray-700">Obra: {config.obra.nome}</div>
                      <div className="text-xs text-gray-600">{config.obra.localizacao} | {config.obra.cliente}</div>
                    </div>
                  )}
                  
                  <div className="text-xs text-gray-500">
                    Este é um preview aproximado do cabeçalho dos seus PDFs
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex-shrink-0 bg-gray-50 p-6 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              As alterações serão aplicadas a todos os relatórios PDF gerados
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={handleReset}
                className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors font-medium"
              >
                🔄 Reset
              </button>
              <button
                onClick={handleSave}
                className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                💾 Guardar Configuração
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PDFGlobalConfig;
