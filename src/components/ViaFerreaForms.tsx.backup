import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Save, Loader2, Upload, Camera } from 'lucide-react';
import toast from 'react-hot-toast';
import { viaFerreaAPI } from '../lib/supabase-api/viaFerreaAPI';

interface TrilhoFormData {
  codigo: string;
  tipo: string;
  material: string;
  comprimento: number;
  peso: number;
  fabricante: string;
  data_fabricacao: string;
  data_instalacao: string;
  km_inicial: number;
  km_final: number;
  estado: string;
  tensao: number;
  geometria: {
    alinhamento: number;
    nivel: number;
    bitola: number;
  };
  proxima_inspecao: string;
}

interface TravessaFormData {
  codigo: string;
  tipo: string;
  material: string;
  comprimento: number;
  largura: number;
  altura: number;
  peso: number;
  fabricante: string;
  data_fabricacao: string;
  data_instalacao: string;
  km_inicial: number;
  km_final: number;
  estado: string;
  proxima_inspecao: string;
}

interface InspecaoFormData {
  data_inspecao: string;
  tipo: string;
  inspector: string;
  resultado: string;
  observacoes: string;
  acoes_corretivas: string;
  proxima_inspecao: string;
  trilho_id?: string;
  travessa_id?: string;
  parametros_medidos: any;
}

interface FormModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'trilho' | 'travessa' | 'inspecao';
  editData?: any;
  onSuccess: () => void;
}

export function TrilhoForm({ isOpen, onClose, editData, onSuccess }: FormModalProps) {
  const [formData, setFormData] = useState<TrilhoFormData>({
    codigo: editData?.codigo || '',
    tipo: editData?.tipo || 'UIC60',
    material: editData?.material || 'Aço endurecido',
    comprimento: editData?.comprimento || 25,
    peso: editData?.peso || 60.3,
    fabricante: editData?.fabricante || '',
    data_fabricacao: editData?.data_fabricacao || '',
    data_instalacao: editData?.data_instalacao || '',
    km_inicial: editData?.km_inicial || 0,
    km_final: editData?.km_final || 0,
    estado: editData?.estado || 'Bom',
    tensao: editData?.tensao || 850,
    geometria: {
      alinhamento: editData?.geometria?.alinhamento || 2.0,
      nivel: editData?.geometria?.nivel || 1.5,
      bitola: editData?.geometria?.bitola || 1435
    },
    proxima_inspecao: editData?.proxima_inspecao || ''
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editData) {
        await viaFerreaAPI.trilhos.update(editData.id, formData);
        toast.success('Trilho atualizado com sucesso!');
      } else {
        await viaFerreaAPI.trilhos.create(formData);
        toast.success('Trilho criado com sucesso!');
      }
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Erro ao salvar trilho:', error);
      toast.error('Erro ao salvar trilho');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-2xl p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            {editData ? 'Editar Trilho' : 'Novo Trilho'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Código *
              </label>
              <input
                type="text"
                required
                value={formData.codigo}
                onChange={(e) => setFormData({ ...formData, codigo: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="TR-001-2024"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo *
              </label>
              <select
                required
                value={formData.tipo}
                onChange={(e) => setFormData({ ...formData, tipo: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="UIC60">UIC60</option>
                <option value="UIC54">UIC54</option>
                <option value="S49">S49</option>
                <option value="S54">S54</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Material *
              </label>
              <select
                required
                value={formData.material}
                onChange={(e) => setFormData({ ...formData, material: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="Aço">Aço</option>
                <option value="Aço endurecido">Aço endurecido</option>
                <option value="Aço especial">Aço especial</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Estado *
              </label>
              <select
                required
                value={formData.estado}
                onChange={(e) => setFormData({ ...formData, estado: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="Excelente">Excelente</option>
                <option value="Bom">Bom</option>
                <option value="Regular">Regular</option>
                <option value="Mau">Mau</option>
                <option value="Crítico">Crítico</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Comprimento (m) *
              </label>
              <input
                type="number"
                required
                step="0.1"
                value={formData.comprimento}
                onChange={(e) => setFormData({ ...formData, comprimento: parseFloat(e.target.value) })}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Peso (kg/m) *
              </label>
              <input
                type="number"
                required
                step="0.1"
                value={formData.peso}
                onChange={(e) => setFormData({ ...formData, peso: parseFloat(e.target.value) })}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fabricante *
              </label>
              <input
                type="text"
                required
                value={formData.fabricante}
                onChange={(e) => setFormData({ ...formData, fabricante: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tensão (MPa) *
              </label>
              <input
                type="number"
                required
                value={formData.tensao}
                onChange={(e) => setFormData({ ...formData, tensao: parseInt(e.target.value) })}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Data de Fabricação *
              </label>
              <input
                type="date"
                required
                value={formData.data_fabricacao}
                onChange={(e) => setFormData({ ...formData, data_fabricacao: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Data de Instalação *
              </label>
              <input
                type="date"
                required
                value={formData.data_instalacao}
                onChange={(e) => setFormData({ ...formData, data_instalacao: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                KM Inicial *
              </label>
              <input
                type="number"
                required
                step="0.001"
                value={formData.km_inicial}
                onChange={(e) => setFormData({ ...formData, km_inicial: parseFloat(e.target.value) })}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                KM Final *
              </label>
              <input
                type="number"
                required
                step="0.001"
                value={formData.km_final}
                onChange={(e) => setFormData({ ...formData, km_final: parseFloat(e.target.value) })}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Próxima Inspeção *
              </label>
              <input
                type="date"
                required
                value={formData.proxima_inspecao}
                onChange={(e) => setFormData({ ...formData, proxima_inspecao: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Geometria */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Parâmetros de Geometria</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Alinhamento (mm)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.geometria.alinhamento}
                  onChange={(e) => setFormData({
                    ...formData,
                    geometria: { ...formData.geometria, alinhamento: parseFloat(e.target.value) }
                  })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nível (mm)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.geometria.nivel}
                  onChange={(e) => setFormData({
                    ...formData,
                    geometria: { ...formData.geometria, nivel: parseFloat(e.target.value) }
                  })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bitola (mm)
                </label>
                <input
                  type="number"
                  value={formData.geometria.bitola}
                  onChange={(e) => setFormData({
                    ...formData,
                    geometria: { ...formData.geometria, bitola: parseInt(e.target.value) }
                  })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-4 pt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 bg-gray-500 text-white rounded-xl hover:bg-gray-600 transition-all duration-200"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl hover:from-orange-600 hover:to-red-600 transition-all duration-200 flex items-center space-x-2 disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Save className="h-5 w-5" />
              )}
              <span>{editData ? 'Atualizar' : 'Criar'} Trilho</span>
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

export function TravessaForm({ isOpen, onClose, editData, onSuccess }: FormModalProps) {
  const [formData, setFormData] = useState<TravessaFormData>({
    codigo: editData?.codigo || '',
    tipo: editData?.tipo || 'Betão',
    material: editData?.material || 'Betão armado pré-esforçado',
    comprimento: editData?.comprimento || 2.6,
    largura: editData?.largura || 0.25,
    altura: editData?.altura || 0.22,
    peso: editData?.peso || 320,
    fabricante: editData?.fabricante || '',
    data_fabricacao: editData?.data_fabricacao || '',
    data_instalacao: editData?.data_instalacao || '',
    km_inicial: editData?.km_inicial || 0,
    km_final: editData?.km_final || 0,
    estado: editData?.estado || 'Bom',
    proxima_inspecao: editData?.proxima_inspecao || ''
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editData) {
        await viaFerreaAPI.travessas.update(editData.id, formData);
        toast.success('Travessa atualizada com sucesso!');
      } else {
        await viaFerreaAPI.travessas.create(formData);
        toast.success('Travessa criada com sucesso!');
      }
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Erro ao salvar travessa:', error);
      toast.error('Erro ao salvar travessa');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-2xl p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            {editData ? 'Editar Travessa' : 'Nova Travessa'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Código *
              </label>
              <input
                type="text"
                required
                value={formData.codigo}
                onChange={(e) => setFormData({ ...formData, codigo: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="TV-001-2024"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo *
              </label>
              <select
                required
                value={formData.tipo}
                onChange={(e) => setFormData({ ...formData, tipo: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="Betão">Betão</option>
                <option value="Madeira">Madeira</option>
                <option value="Aço">Aço</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Material *
              </label>
              <input
                type="text"
                required
                value={formData.material}
                onChange={(e) => setFormData({ ...formData, material: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Estado *
              </label>
              <select
                required
                value={formData.estado}
                onChange={(e) => setFormData({ ...formData, estado: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="Excelente">Excelente</option>
                <option value="Bom">Bom</option>
                <option value="Regular">Regular</option>
                <option value="Mau">Mau</option>
                <option value="Crítico">Crítico</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Comprimento (m) *
              </label>
              <input
                type="number"
                required
                step="0.1"
                value={formData.comprimento}
                onChange={(e) => setFormData({ ...formData, comprimento: parseFloat(e.target.value) })}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Largura (m) *
              </label>
              <input
                type="number"
                required
                step="0.01"
                value={formData.largura}
                onChange={(e) => setFormData({ ...formData, largura: parseFloat(e.target.value) })}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Altura (m) *
              </label>
              <input
                type="number"
                required
                step="0.01"
                value={formData.altura}
                onChange={(e) => setFormData({ ...formData, altura: parseFloat(e.target.value) })}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Peso (kg) *
              </label>
              <input
                type="number"
                required
                step="0.1"
                value={formData.peso}
                onChange={(e) => setFormData({ ...formData, peso: parseFloat(e.target.value) })}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fabricante *
              </label>
              <input
                type="text"
                required
                value={formData.fabricante}
                onChange={(e) => setFormData({ ...formData, fabricante: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Data de Fabricação *
              </label>
              <input
                type="date"
                required
                value={formData.data_fabricacao}
                onChange={(e) => setFormData({ ...formData, data_fabricacao: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Data de Instalação *
              </label>
              <input
                type="date"
                required
                value={formData.data_instalacao}
                onChange={(e) => setFormData({ ...formData, data_instalacao: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                KM Inicial *
              </label>
              <input
                type="number"
                required
                step="0.001"
                value={formData.km_inicial}
                onChange={(e) => setFormData({ ...formData, km_inicial: parseFloat(e.target.value) })}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                KM Final *
              </label>
              <input
                type="number"
                required
                step="0.001"
                value={formData.km_final}
                onChange={(e) => setFormData({ ...formData, km_final: parseFloat(e.target.value) })}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Próxima Inspeção *
              </label>
              <input
                type="date"
                required
                value={formData.proxima_inspecao}
                onChange={(e) => setFormData({ ...formData, proxima_inspecao: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-4 pt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 bg-gray-500 text-white rounded-xl hover:bg-gray-600 transition-all duration-200"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-xl hover:from-blue-600 hover:to-indigo-600 transition-all duration-200 flex items-center space-x-2 disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Save className="h-5 w-5" />
              )}
              <span>{editData ? 'Atualizar' : 'Criar'} Travessa</span>
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

export function InspecaoForm({ isOpen, onClose, editData, onSuccess }: FormModalProps) {
  const [formData, setFormData] = useState<InspecaoFormData>({
    data_inspecao: editData?.data_inspecao || new Date().toISOString().split('T')[0],
    tipo: editData?.tipo || 'Visual',
    inspector: editData?.inspector || '',
    resultado: editData?.resultado || 'Conforme',
    observacoes: editData?.observacoes || '',
    acoes_corretivas: editData?.acoes_corretivas || '',
    proxima_inspecao: editData?.proxima_inspecao || '',
    trilho_id: editData?.trilho_id || '',
    travessa_id: editData?.travessa_id || '',
    parametros_medidos: editData?.parametros_medidos || {}
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editData) {
        await viaFerreaAPI.inspecoes.update(editData.id, formData);
        toast.success('Inspeção atualizada com sucesso!');
      } else {
        await viaFerreaAPI.inspecoes.create(formData);
        toast.success('Inspeção criada com sucesso!');
      }
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Erro ao salvar inspeção:', error);
      toast.error('Erro ao salvar inspeção');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-2xl p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            {editData ? 'Editar Inspeção' : 'Nova Inspeção'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Data da Inspeção *
              </label>
              <input
                type="date"
                required
                value={formData.data_inspecao}
                onChange={(e) => setFormData({ ...formData, data_inspecao: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo de Inspeção *
              </label>
              <select
                required
                value={formData.tipo}
                onChange={(e) => setFormData({ ...formData, tipo: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="Visual">Visual</option>
                <option value="Geometria">Geometria</option>
                <option value="Ultrassom">Ultrassom</option>
                <option value="Magnetoscopia">Magnetoscopia</option>
                <option value="Penetrantes">Penetrantes</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Inspector *
              </label>
              <input
                type="text"
                required
                value={formData.inspector}
                onChange={(e) => setFormData({ ...formData, inspector: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Resultado *
              </label>
              <select
                required
                value={formData.resultado}
                onChange={(e) => setFormData({ ...formData, resultado: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="Conforme">Conforme</option>
                <option value="Não Conforme">Não Conforme</option>
                <option value="Crítico">Crítico</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Próxima Inspeção *
              </label>
              <input
                type="date"
                required
                value={formData.proxima_inspecao}
                onChange={(e) => setFormData({ ...formData, proxima_inspecao: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Observações
            </label>
            <textarea
              rows={3}
              value={formData.observacoes}
              onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Descreva as observações da inspeção..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ações Corretivas
            </label>
            <textarea
              rows={3}
              value={formData.acoes_corretivas}
              onChange={(e) => setFormData({ ...formData, acoes_corretivas: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Descreva as ações corretivas necessárias..."
            />
          </div>

          <div className="flex justify-end space-x-4 pt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 bg-gray-500 text-white rounded-xl hover:bg-gray-600 transition-all duration-200"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl hover:from-green-600 hover:to-emerald-600 transition-all duration-200 flex items-center space-x-2 disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Save className="h-5 w-5" />
              )}
              <span>{editData ? 'Atualizar' : 'Criar'} Inspeção</span>
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
