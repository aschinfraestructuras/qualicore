import React, { useState } from 'react';
import { PDFService } from '../services/pdfService';

interface PDFConfigPanelProps {
  onConfigChange: (config: any) => void;
  initialConfig?: any;
}

const PDFConfigPanel: React.FC<PDFConfigPanelProps> = ({ onConfigChange, initialConfig }) => {
  const [config, setConfig] = useState({
    empresa: {
      nome: initialConfig?.empresa?.nome || 'QUALICORE',
      morada: initialConfig?.empresa?.morada || 'Rua da Qualidade, 123',
      telefone: initialConfig?.empresa?.telefone || '+351 123 456 789',
      email: initialConfig?.empresa?.email || 'info@qualicore.pt',
      website: initialConfig?.empresa?.website || 'www.qualicore.pt',
      nif: initialConfig?.empresa?.nif || '123456789',
      logotipo: initialConfig?.empresa?.logotipo || ''
    },
    obra: {
      nome: initialConfig?.obra?.nome || 'Obra Principal',
      localizacao: initialConfig?.obra?.localizacao || 'Lisboa, Portugal',
      referencia: initialConfig?.obra?.referencia || 'OBRA-2024-001',
      cliente: initialConfig?.obra?.cliente || 'Cliente Principal'
    },
    design: {
      corPrimaria: initialConfig?.design?.corPrimaria || '#3B82F6',
      corSecundaria: initialConfig?.design?.corSecundaria || '#1E40AF',
      corTexto: initialConfig?.design?.corTexto || '#1F2937',
      corFundo: initialConfig?.design?.corFundo || '#F8FAFC'
    }
  });

  const handleConfigChange = (section: string, field: string, value: string) => {
    const newConfig = {
      ...config,
      [section]: {
        ...config[section as keyof typeof config],
        [field]: value
      }
    };
    setConfig(newConfig);
    onConfigChange(newConfig);
  };

  const handleLogotipoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64 = e.target?.result as string;
        handleConfigChange('empresa', 'logotipo', base64);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h3 className="text-lg font-semibold mb-4 text-gray-900">⚙️ Configuração de PDFs Premium</h3>
      
      {/* Dados da Empresa */}
      <div className="mb-6">
        <h4 className="text-md font-medium mb-3 text-gray-800">🏢 Dados da Empresa</h4>
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
        </div>
      </div>

      {/* Dados da Obra */}
      <div className="mb-6">
        <h4 className="text-md font-medium mb-3 text-gray-800">🏗️ Dados da Obra</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nome da Obra</label>
            <input
              type="text"
              value={config.obra.nome}
              onChange={(e) => handleConfigChange('obra', 'nome', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Referência</label>
            <input
              type="text"
              value={config.obra.referencia}
              onChange={(e) => handleConfigChange('obra', 'referencia', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Localização</label>
            <input
              type="text"
              value={config.obra.localizacao}
              onChange={(e) => handleConfigChange('obra', 'localizacao', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Cliente</label>
            <input
              type="text"
              value={config.obra.cliente}
              onChange={(e) => handleConfigChange('obra', 'cliente', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Cores do Design */}
      <div className="mb-6">
        <h4 className="text-md font-medium mb-3 text-gray-800">🎨 Cores do Design</h4>
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
            <p><strong>Obra:</strong> {config.obra.nome} ({config.obra.referencia})</p>
            <p><strong>Cores:</strong> Primária: {config.design.corPrimaria} | Secundária: {config.design.corSecundaria}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PDFConfigPanel;
