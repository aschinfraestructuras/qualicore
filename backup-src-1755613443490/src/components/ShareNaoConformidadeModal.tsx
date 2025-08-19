import React, { useState } from 'react';
import { ShareService, ShareOptions } from '@/services/shareService';
import { NaoConformidade } from '@/types';

interface ShareNaoConformidadeModalProps {
  isOpen: boolean;
  onClose: () => void;
  naoConformidade: NaoConformidade | null;
}

export const ShareNaoConformidadeModal: React.FC<ShareNaoConformidadeModalProps> = ({
  isOpen,
  onClose,
  naoConformidade
}) => {
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [saveToBackend, setSaveToBackend] = useState(false);
  const [downloadLocal, setDownloadLocal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<any[]>([]);

  const shareService = new ShareService();

  const handleShare = async () => {
    if (!naoConformidade) return;

    setIsLoading(true);
    setResults([]);

    try {
      const options: ShareOptions = {
        email: email || undefined,
        subject: subject || undefined,
        message: message || undefined,
        saveToBackend,
        downloadLocal
      };

      const results = await shareService.shareNaoConformidade(naoConformidade, options);
      setResults(results);

      // Se pelo menos uma operação foi bem-sucedida, fechar modal após delay
      const hasSuccess = results.some(result => result.success);
      if (hasSuccess) {
        setTimeout(() => {
          onClose();
          resetForm();
        }, 2000);
      }
    } catch (error) {
      console.error('Erro ao partilhar:', error);
      setResults([{
        success: false,
        message: 'Erro inesperado ao partilhar'
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setEmail('');
    setSubject('');
    setMessage('');
    setSaveToBackend(false);
    setDownloadLocal(false);
    setResults([]);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  if (!isOpen || !naoConformidade) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">
            Partilhar Não Conformidade
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Informações da Não Conformidade */}
        <div className="bg-gray-50 p-4 rounded-lg mb-4">
          <h3 className="font-medium text-gray-800 mb-2">Não Conformidade</h3>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div><span className="font-medium">Código:</span> {naoConformidade.codigo}</div>
            <div><span className="font-medium">Tipo:</span> {naoConformidade.tipo}</div>
            <div><span className="font-medium">Severidade:</span> {naoConformidade.severidade}</div>
            <div><span className="font-medium">Categoria:</span> {naoConformidade.categoria}</div>
          </div>
        </div>

        {/* Ações Rápidas */}
        <div className="mb-6">
          <h3 className="font-medium text-gray-800 mb-3">Ações Rápidas</h3>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => {
                setEmail('');
                setSubject('');
                setMessage('');
                setSaveToBackend(true);
                setDownloadLocal(false);
                handleShare();
              }}
              disabled={isLoading}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
            >
              Salvar no Backend
            </button>
            <button
              onClick={() => {
                setEmail('');
                setSubject('');
                setMessage('');
                setSaveToBackend(false);
                setDownloadLocal(true);
                handleShare();
              }}
              disabled={isLoading}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
            >
              Download Local
            </button>
          </div>
        </div>

        {/* Opções Avançadas */}
        <div className="mb-6">
          <h3 className="font-medium text-gray-800 mb-3">Opções Avançadas</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@exemplo.com"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Assunto
              </label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder={`Não Conformidade ${naoConformidade.codigo} - ${naoConformidade.tipo}`}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mensagem
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Mensagem personalizada..."
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex items-center space-x-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={saveToBackend}
                  onChange={(e) => setSaveToBackend(e.target.checked)}
                  className="mr-2"
                />
                <span className="text-sm text-gray-700">Salvar no Backend</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={downloadLocal}
                  onChange={(e) => setDownloadLocal(e.target.checked)}
                  className="mr-2"
                />
                <span className="text-sm text-gray-700">Download Local</span>
              </label>
            </div>
          </div>
        </div>

        {/* Botões de Ação */}
        <div className="flex justify-end space-x-3">
          <button
            onClick={handleClose}
            className="px-4 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-50"
          >
            Cancelar
          </button>
          <button
            onClick={handleShare}
            disabled={isLoading || (!email && !saveToBackend && !downloadLocal)}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {isLoading ? 'A processar...' : 'Partilhar'}
          </button>
        </div>

        {/* Resultados */}
        {results.length > 0 && (
          <div className="mt-4">
            <h3 className="font-medium text-gray-800 mb-2">Resultados</h3>
            <div className="space-y-2">
              {results.map((result, index) => (
                <div
                  key={index}
                  className={`p-3 rounded ${
                    result.success
                      ? 'bg-green-50 text-green-800 border border-green-200'
                      : 'bg-red-50 text-red-800 border border-red-200'
                  }`}
                >
                  {result.message}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}; 