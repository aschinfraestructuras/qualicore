import React, { useState, useEffect } from 'react';
import PDFConfigService from '../services/pdfConfigService';
import toast from 'react-hot-toast';

const PDFGlobalConfig: React.FC = () => {
  const [config, setConfig] = useState(PDFConfigService.getInstance().getConfig());
  const [isOpen, setIsOpen] = useState(false);

  // Listener para abrir o modal quando o botão da navbar for clicado
  useEffect(() => {
    const handleOpenPDFConfig = () => {
      setIsOpen(true);
    };

    window.addEventListener('openPDFConfig', handleOpenPDFConfig);

    return () => {
      window.removeEventListener('openPDFConfig', handleOpenPDFConfig);
    };
  }, []);

  const handleConfigChange = (section: string, field: string, value: string) => {
    const newConfig = {
      ...config,
      [section]: {
        ...config[section as keyof typeof config],
        [field]: value
      }
    };
    setConfig(newConfig);
    PDFConfigService.getInstance().updateConfig(newConfig);
  };

  const handleLogotipoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Verificar tamanho do ficheiro (máx 2MB)
      if (file.size > 2 * 1024 * 1024) {
        toast.error('❌ Ficheiro muito grande. Máximo 2MB.');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const base64 = e.target?.result as string;
        handleConfigChange('empresa', 'logotipo', base64);
        toast.success('✅ Logotipo carregado com sucesso!');
      };
      reader.onerror = () => {
        toast.error('❌ Erro ao carregar ficheiro.');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleReset = () => {
    PDFConfigService.getInstance().resetToDefault();
    setConfig(PDFConfigService.getInstance().getConfig());
    toast.success('✅ Configuração resetada para padrão!');
  };

  const handleSave = () => {
    PDFConfigService.getInstance().updateConfig(config);
    toast.success('✅ Configuração guardada com sucesso!');
    setIsOpen(false);
  };

  return (
    <>
      {/* Modal premium de configuração - CORRIGIDO */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-2xl w-full max-w-6xl h-[90vh] flex flex-col border border-gray-200">
            {/* Header do modal - FIXO */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 rounded-t-2xl flex-shrink-0">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-white bg-opacity-20 rounded-lg">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold">Configuração Premium de PDFs</h2>
                    <p className="text-blue-100 text-sm">Personalize todos os relatórios com a sua identidade</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            
            {/* Conteúdo com scroll - CORRIGIDO */}
            <div className="flex-1 overflow-y-auto p-8">
              {/* Dados da Empresa */}
              <div className="mb-10">
                <div className="flex items-center mb-6">
                  <div className="p-3 bg-blue-100 rounded-lg mr-4">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">🏢 Dados da Empresa</h3>
                    <p className="text-gray-600">Informações que aparecerão no cabeçalho dos PDFs</p>
                  </div>
                </div>
                <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Nome da Empresa</label>
                      <input
                        type="text"
                        value={config.empresa.nome}
                        onChange={(e) => handleConfigChange('empresa', 'nome', e.target.value)}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 hover:bg-white"
                        placeholder="Ex: QUALICORE"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">NIF</label>
                      <input
                        type="text"
                        value={config.empresa.nif}
                        onChange={(e) => handleConfigChange('empresa', 'nif', e.target.value)}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 hover:bg-white"
                        placeholder="Ex: 123456789"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Morada</label>
                      <input
                        type="text"
                        value={config.empresa.morada}
                        onChange={(e) => handleConfigChange('empresa', 'morada', e.target.value)}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 hover:bg-white"
                        placeholder="Ex: Rua da Qualidade, 123"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Telefone</label>
                      <input
                        type="text"
                        value={config.empresa.telefone}
                        onChange={(e) => handleConfigChange('empresa', 'telefone', e.target.value)}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 hover:bg-white"
                        placeholder="Ex: +351 123 456 789"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                      <input
                        type="email"
                        value={config.empresa.email}
                        onChange={(e) => handleConfigChange('empresa', 'email', e.target.value)}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 hover:bg-white"
                        placeholder="Ex: info@qualicore.pt"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Website</label>
                      <input
                        type="text"
                        value={config.empresa.website}
                        onChange={(e) => handleConfigChange('empresa', 'website', e.target.value)}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 hover:bg-white"
                        placeholder="Ex: www.qualicore.pt"
                      />
                    </div>
                  </div>

                  {/* Upload de Logotipo - MELHORADO */}
                  <div className="mt-6">
                    <label className="block text-sm font-semibold text-gray-700 mb-3">🖼️ Logotipo da Empresa</label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                      <div className="flex flex-col items-center">
                        <svg className="w-12 h-12 text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <p className="text-sm text-gray-600 mb-2">Clique para carregar o logótipo da empresa</p>
                        <p className="text-xs text-gray-500 mb-3">Formatos aceites: PNG, JPG, SVG (máx. 2MB)</p>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleLogotipoUpload}
                          className="hidden"
                          id="logotipo-upload"
                        />
                        <label
                          htmlFor="logotipo-upload"
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
                        >
                          Escolher Ficheiro
                        </label>
                      </div>
                    </div>
                    {config.empresa.logotipo && (
                      <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                        <div className="flex items-center">
                          <svg className="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <p className="text-sm text-green-700 font-medium">✅ Logótipo carregado com sucesso!</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Dados da Obra */}
              <div className="mb-10">
                <div className="flex items-center mb-6">
                  <div className="p-3 bg-green-100 rounded-lg mr-4">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">🏗️ Dados da Obra</h3>
                    <p className="text-gray-600">Informações do projeto que aparecerão nos relatórios</p>
                  </div>
                </div>
                <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Nome da Obra</label>
                      <input
                        type="text"
                        value={config.obra?.nome || ''}
                        onChange={(e) => handleConfigChange('obra', 'nome', e.target.value)}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 hover:bg-white"
                        placeholder="Ex: Construção Ponte X"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Referência</label>
                      <input
                        type="text"
                        value={config.obra?.referencia || ''}
                        onChange={(e) => handleConfigChange('obra', 'referencia', e.target.value)}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 hover:bg-white"
                        placeholder="Ex: OBRA-2024-001"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Localização</label>
                      <input
                        type="text"
                        value={config.obra?.localizacao || ''}
                        onChange={(e) => handleConfigChange('obra', 'localizacao', e.target.value)}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 hover:bg-white"
                        placeholder="Ex: Lisboa, Portugal"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Cliente</label>
                      <input
                        type="text"
                        value={config.obra?.cliente || ''}
                        onChange={(e) => handleConfigChange('obra', 'cliente', e.target.value)}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 hover:bg-white"
                        placeholder="Ex: Cliente Principal S.A."
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Cores do Design */}
              <div className="mb-10">
                <div className="flex items-center mb-6">
                  <div className="p-3 bg-purple-100 rounded-lg mr-4">
                    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">🎨 Cores do Design</h3>
                    <p className="text-gray-600">Personalize as cores dos cabeçalhos e elementos dos PDFs</p>
                  </div>
                </div>
                <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-3">Cor Primária</label>
                      <div className="flex items-center space-x-3">
                        <div className="relative">
                          <input
                            type="color"
                            value={config.design.corPrimaria}
                            onChange={(e) => handleConfigChange('design', 'corPrimaria', e.target.value)}
                            className="w-16 h-16 border-2 border-gray-200 rounded-lg cursor-pointer shadow-sm"
                          />
                          <div className="absolute inset-0 rounded-lg border-2 border-gray-300 pointer-events-none"></div>
                        </div>
                        <input
                          type="text"
                          value={config.design.corPrimaria}
                          onChange={(e) => handleConfigChange('design', 'corPrimaria', e.target.value)}
                          className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 hover:bg-white font-mono text-sm"
                          placeholder="#3B82F6"
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-2">Cor principal dos cabeçalhos e elementos principais</p>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-3">Cor Secundária</label>
                      <div className="flex items-center space-x-3">
                        <div className="relative">
                          <input
                            type="color"
                            value={config.design.corSecundaria}
                            onChange={(e) => handleConfigChange('design', 'corSecundaria', e.target.value)}
                            className="w-16 h-16 border-2 border-gray-200 rounded-lg cursor-pointer shadow-sm"
                          />
                          <div className="absolute inset-0 rounded-lg border-2 border-gray-300 pointer-events-none"></div>
                        </div>
                        <input
                          type="text"
                          value={config.design.corSecundaria}
                          onChange={(e) => handleConfigChange('design', 'corSecundaria', e.target.value)}
                          className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 hover:bg-white font-mono text-sm"
                          placeholder="#1E40AF"
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-2">Cor de destaque para elementos secundários</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Preview Premium */}
              <div className="mb-10">
                <div className="flex items-center mb-6">
                  <div className="p-3 bg-orange-100 rounded-lg mr-4">
                    <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">👁️ Preview da Configuração</h3>
                    <p className="text-gray-600">Visualize como ficará o seu relatório personalizado</p>
                  </div>
                </div>
                <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-6 shadow-lg border border-gray-200">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-3">🏢 Informações da Empresa</h4>
                      <div className="space-y-2 text-sm">
                        <p><span className="font-medium">Nome:</span> {config.empresa.nome || 'Não definido'}</p>
                        <p><span className="font-medium">NIF:</span> {config.empresa.nif || 'Não definido'}</p>
                        <p><span className="font-medium">Morada:</span> {config.empresa.morada || 'Não definido'}</p>
                        <p><span className="font-medium">Telefone:</span> {config.empresa.telefone || 'Não definido'}</p>
                        <p><span className="font-medium">Email:</span> {config.empresa.email || 'Não definido'}</p>
                        <p><span className="font-medium">Website:</span> {config.empresa.website || 'Não definido'}</p>
                        <p><span className="font-medium">Logótipo:</span> {config.empresa.logotipo ? '✅ Carregado' : '❌ Não carregado'}</p>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-3">🏗️ Informações da Obra</h4>
                      <div className="space-y-2 text-sm">
                        <p><span className="font-medium">Nome:</span> {config.obra?.nome || 'Não definido'}</p>
                        <p><span className="font-medium">Referência:</span> {config.obra?.referencia || 'Não definido'}</p>
                        <p><span className="font-medium">Localização:</span> {config.obra?.localizacao || 'Não definido'}</p>
                        <p><span className="font-medium">Cliente:</span> {config.obra?.cliente || 'Não definido'}</p>
                      </div>
                      <div className="mt-4">
                        <h4 className="font-semibold text-gray-800 mb-3">🎨 Cores do Design</h4>
                        <div className="flex space-x-3">
                          <div className="flex items-center space-x-2">
                            <div className="w-6 h-6 rounded border border-gray-300" style={{ backgroundColor: config.design.corPrimaria }}></div>
                            <span className="text-xs font-mono">{config.design.corPrimaria}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="w-6 h-6 rounded border border-gray-300" style={{ backgroundColor: config.design.corSecundaria }}></div>
                            <span className="text-xs font-mono">{config.design.corSecundaria}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Botões de ação premium - FIXOS */}
            <div className="bg-white p-6 rounded-b-2xl border-t border-gray-200 flex-shrink-0">
              <div className="flex justify-between items-center">
                <button
                  onClick={handleReset}
                  className="px-6 py-3 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-lg hover:from-gray-600 hover:to-gray-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  <div className="flex items-center space-x-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    <span className="font-semibold">🔄 Reset para Padrão</span>
                  </div>
                </button>
                <button
                  onClick={handleSave}
                  className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  <div className="flex items-center space-x-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="font-semibold">💾 Guardar Configuração</span>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PDFGlobalConfig;
