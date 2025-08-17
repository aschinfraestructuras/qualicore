import React from 'react';

interface SinalizacaoFormProps {
  isOpen: boolean;
  onClose: () => void;
  editData: any;
  onSuccess: () => void;
  type: 'sinalizacao' | 'inspecao';
}

export function SinalizacaoForm({ isOpen, onClose, editData, onSuccess, type }: SinalizacaoFormProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 max-w-2xl w-full mx-4">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          {editData ? 'Editar' : 'Nova'} {type === 'sinalizacao' ? 'Sinalização' : 'Inspeção'}
        </h2>
        <p className="text-gray-600 mb-6">
          Formulário em desenvolvimento. Esta funcionalidade será implementada em breve.
        </p>
        <div className="flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-6 py-3 bg-gray-500 text-white rounded-xl hover:bg-gray-600 transition-all duration-200"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}
