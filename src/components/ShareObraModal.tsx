import React, { useState } from 'react';
import { X, Mail, Send, Loader2 } from 'lucide-react';
import { ShareService } from '@/services/shareService';
import toast from 'react-hot-toast';

interface ShareObraModalProps {
  obra: any;
  isOpen: boolean;
  onClose: () => void;
}

export function ShareObraModal({ obra, isOpen, onClose }: ShareObraModalProps) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleShare = async () => {
    if (!email.trim()) {
      toast.error('Por favor, insira um email válido');
      return;
    }

    setLoading(true);
    try {
      await ShareService.shareObraByEmail(obra, email);
      toast.success('Obra partilhada com sucesso!');
      setEmail('');
      onClose();
    } catch (error) {
      console.error('Erro ao partilhar obra:', error);
      toast.error('Erro ao partilhar obra');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Mail className="h-5 w-5 text-blue-600" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900">Partilhar Obra</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6">
          <div className="mb-4">
            <h3 className="font-medium text-gray-900 mb-2">Obra: {obra?.nome || obra?.codigo}</h3>
            <p className="text-sm text-gray-600">
              {obra?.tipo} - {obra?.localizacao}
            </p>
          </div>

          <div className="mb-6">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email do destinatário
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="exemplo@email.com"
              className="input w-full"
              disabled={loading}
            />
          </div>

          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="btn btn-outline flex-1"
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              onClick={handleShare}
              disabled={loading || !email.trim()}
              className="btn btn-primary flex-1 flex items-center justify-center space-x-2"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Partilhando...</span>
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  <span>Partilhar</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 