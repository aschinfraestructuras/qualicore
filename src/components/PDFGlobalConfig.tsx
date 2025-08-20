import React, { useState, useEffect } from 'react';
import PDFConfigService from '../services/pdfConfigService';
import toast from 'react-hot-toast';

const PDFGlobalConfig: React.FC = () => {
  const [config, setConfig] = useState(PDFConfigService.getInstance().getConfig());
  const [isOpen, setIsOpen] = useState(false);

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
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64 = e.target?.result as string;
        handleConfigChange('empresa', 'logotipo', base64);
        toast.success('✅ Logotipo carregado com sucesso!');
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
      {/* Botão para abrir configuração */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 p-3 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-colors"
        title="Configurar PDFs Globais"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      </button>

      {/* Modal de configuração */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">⚙️ Configuração Global de PDFs</h2>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Dados da Empresa */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-4 text-gray-800">🏢 Dados da Empresa</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nome da Empresa</label>
                    <input
                      type="text"
                      value={config.empresa.nome}
                      onChange={(e) => handleConfigChange('empresa', 'nome', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">NIF</label>
                    <input
                      type="text"
                      value={config.empresa.nif}
                      onChange={(e) => handleConfigChange('empresa', 'nif', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Morada</label>
                    <input
                      type="text"
                      value={config.empresa.morada}
                      onChange={(e) => handleConfigChange('empresa', 'morada', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Telefone</label>
                    <input
                      type="text"
                      value={config.empresa.telefone}
                      onChange={(e) => handleConfigChange('empresa', 'telefone', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      value={config.empresa.email}
                      onChange={(e) => handleConfigChange('empresa', 'email', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
                    <input
                      type="text"
                      value={config.empresa.website}
                      onChange={(e) => handleConfigChange('empresa', 'website', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* Upload de Logotipo */}
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">🖼️ Logotipo da Empresa</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogotipoUpload}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">Formatos aceites: PNG, JPG, SVG (máx. 2MB)</p>
                  {config.empresa.logotipo && (
                    <div className="mt-2">
                      <p className="text-xs text-green-600">✅ Logotipo carregado</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Dados da Obra */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-4 text-gray-800">🏗️ Dados da Obra</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nome da Obra</label>
                    <input
                      type="text"
                      value={config.obra?.nome || ''}
                      onChange={(e) => handleConfigChange('obra', 'nome', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Referência</label>
                    <input
                      type="text"
                      value={config.obra?.referencia || ''}
                      onChange={(e) => handleConfigChange('obra', 'referencia', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Localização</label>
                    <input
                      type="text"
                      value={config.obra?.localizacao || ''}
                      onChange={(e) => handleConfigChange('obra', 'localizacao', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Cliente</label>
                    <input
                      type="text"
                      value={config.obra?.cliente || ''}
                      onChange={(e) => handleConfigChange('obra', 'cliente', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Cores do Design */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-4 text-gray-800">🎨 Cores do Design</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Cor Primária</label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="color"
                        value={config.design.corPrimaria}
                        onChange={(e) => handleConfigChange('design', 'corPrimaria', e.target.value)}
                        className="w-12 h-10 border border-gray-300 rounded-md"
                      />
                      <input
                        type="text"
                        value={config.design.corPrimaria}
                        onChange={(e) => handleConfigChange('design', 'corPrimaria', e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Cor Secundária</label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="color"
                        value={config.design.corSecundaria}
                        onChange={(e) => handleConfigChange('design', 'corSecundaria', e.target.value)}
                        className="w-12 h-10 border border-gray-300 rounded-md"
                      />
                      <input
                        type="text"
                        value={config.design.corSecundaria}
                        onChange={(e) => handleConfigChange('design', 'corSecundaria', e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Preview */}
              <div className="border-t pt-4">
                <h4 className="text-md font-medium mb-3 text-gray-800">👁️ Preview da Configuração</h4>
                <div className="bg-gray-50 p-4 rounded-md">
                  <div className="text-sm">
                    <p><strong>Empresa:</strong> {config.empresa.nome}</p>
                    <p><strong>Obra:</strong> {config.obra?.nome} ({config.obra?.referencia})</p>
                    <p><strong>Cores:</strong> Primária: {config.design.corPrimaria} | Secundária: {config.design.corSecundaria}</p>
                  </div>
                </div>
              </div>

              {/* Botões de ação */}
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={handleReset}
                  className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
                >
                  🔄 Reset
                </button>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                >
                  💾 Guardar
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
