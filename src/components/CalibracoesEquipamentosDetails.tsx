import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  X, 
  Edit, 
  Trash2, 
  Download, 
  Eye, 
  Calendar, 
  MapPin, 
  User, 
  Settings, 
  AlertTriangle,
  CheckCircle,
  Clock,
  Euro,
  FileText,
  Image,
  Building,
  Wrench,
  Activity,
  BarChart3,
  Info,
  AlertCircle
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { 
  Equipamento, 
  Calibracao, 
  Manutencao, 
  Inspecao,
  TIPOS_EQUIPAMENTO,
  CATEGORIAS_EQUIPAMENTO,
  ESTADOS_EQUIPAMENTO,
  STATUS_OPERACIONAL,
  TIPOS_CALIBRACAO,
  RESULTADOS_CALIBRACAO,
  TIPOS_MANUTENCAO,
  RESULTADOS_MANUTENCAO,
  TIPOS_INSPECAO,
  RESULTADOS_INSPECAO
} from '../types/calibracoes';
import { 
  getEquipamento,
  getCalibracoes,
  getManutencoes,
  getInspecoes,
  getCalibracao,
  getManutencao,
  getInspecao
} from '../lib/supabase-api/calibracoesAPI';
import DocumentUpload from './DocumentUpload';

interface CalibracoesEquipamentosDetailsProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: 'equipamentos' | 'calibracoes' | 'manutencoes' | 'inspecoes';
  itemId: string | null;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

const CalibracoesEquipamentosDetails: React.FC<CalibracoesEquipamentosDetailsProps> = ({
  isOpen,
  onClose,
  activeTab,
  itemId,
  onEdit,
  onDelete
}) => {
  const [loading, setLoading] = useState(false);
  const [equipamento, setEquipamento] = useState<Equipamento | null>(null);
  const [calibracao, setCalibracao] = useState<Calibracao | null>(null);
  const [manutencao, setManutencao] = useState<Manutencao | null>(null);
  const [inspecao, setInspecao] = useState<Inspecao | null>(null);
  const [relatedData, setRelatedData] = useState<any>(null);

  useEffect(() => {
    if (isOpen && itemId) {
      loadItemDetails();
    }
  }, [isOpen, itemId, activeTab]);

  const loadItemDetails = async () => {
    if (!itemId) return;
    
    setLoading(true);
    try {
      switch (activeTab) {
        case 'equipamentos':
                                const equip = await getEquipamento(itemId);
                      setEquipamento(equip);
                      // Carregar dados relacionados
                      const calibracoes = await getCalibracoes({ equipamento_id: itemId });
                      const manutencoes = await getManutencoes({ equipamento_id: itemId });
                      const inspecoes = await getInspecoes({ equipamento_id: itemId });
          setRelatedData({ calibracoes, manutencoes, inspecoes });
          break;
                            case 'calibracoes':
                      const calib = await getCalibracao(itemId);
                      setCalibracao(calib);
                      break;
                    case 'manutencoes':
                      const manut = await getManutencao(itemId);
                      setManutencao(manut);
                      break;
                    case 'inspecoes':
                      const insp = await getInspecao(itemId);
                      setInspecao(insp);
                      break;
      }
    } catch (error) {
      console.error('Erro ao carregar detalhes:', error);
      toast.error('Erro ao carregar detalhes do item');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Aprovado':
      case 'Operacional':
      case 'Concluída':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'Reprovado':
      case 'Não Operacional':
      case 'Cancelada':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'Condicional':
      case 'Em Teste':
      case 'Em Andamento':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'Pendente':
      case 'Em Calibração':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Aprovado':
      case 'Operacional':
      case 'Concluída':
        return <CheckCircle className="w-4 h-4" />;
      case 'Reprovado':
      case 'Não Operacional':
      case 'Cancelada':
        return <AlertTriangle className="w-4 h-4" />;
      case 'Condicional':
      case 'Em Teste':
      case 'Em Andamento':
        return <Clock className="w-4 h-4" />;
      case 'Pendente':
      case 'Em Calibração':
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <Info className="w-4 h-4" />;
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-PT', {
      style: 'currency',
      currency: 'EUR'
    }).format(value);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('pt-PT');
  };

  const renderEquipamentoDetails = () => {
    if (!equipamento) return null;

    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{equipamento.nome}</h3>
            <p className="text-sm text-gray-500">Código: {equipamento.codigo}</p>
          </div>
          <div className="flex items-center space-x-2">
            <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(equipamento.status_operacional)}`}>
              {getStatusIcon(equipamento.status_operacional)}
              <span className="ml-1">{equipamento.status_operacional}</span>
            </span>
          </div>
        </div>

        {/* Informações Básicas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900 flex items-center">
              <Settings className="w-4 h-4 mr-2" />
              Informações Técnicas
            </h4>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Tipo:</span>
                <span className="text-sm font-medium">{equipamento.tipo}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Categoria:</span>
                <span className="text-sm font-medium">{equipamento.categoria}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Marca:</span>
                <span className="text-sm font-medium">{equipamento.marca}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Modelo:</span>
                <span className="text-sm font-medium">{equipamento.modelo}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Número de Série:</span>
                <span className="text-sm font-medium">{equipamento.numero_serie}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Estado:</span>
                <span className="text-sm font-medium">{equipamento.estado}</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-medium text-gray-900 flex items-center">
              <MapPin className="w-4 h-4 mr-2" />
              Localização e Responsável
            </h4>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Departamento:</span>
                <span className="text-sm font-medium">{equipamento.departamento}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Responsável:</span>
                <span className="text-sm font-medium">{equipamento.responsavel}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Localização:</span>
                <span className="text-sm font-medium">{equipamento.localizacao}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Fabricante:</span>
                <span className="text-sm font-medium">{equipamento.fabricante}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Fornecedor:</span>
                <span className="text-sm font-medium">{equipamento.fornecedor}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Informações Financeiras */}
        <div className="space-y-4">
          <h4 className="font-medium text-gray-900 flex items-center">
            <Euro className="w-4 h-4 mr-2" />
            Informações Financeiras
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-sm text-blue-600">Valor de Aquisição</span>
                <Euro className="w-4 h-4 text-blue-600" />
              </div>
              <p className="text-lg font-semibold text-blue-900">{formatCurrency(equipamento.valor_aquisicao)}</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-sm text-green-600">Valor Atual</span>
                <BarChart3 className="w-4 h-4 text-green-600" />
              </div>
              <p className="text-lg font-semibold text-green-900">{formatCurrency(equipamento.valor_atual)}</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-sm text-purple-600">Vida Útil</span>
                <Calendar className="w-4 h-4 text-purple-600" />
              </div>
              <p className="text-lg font-semibold text-purple-900">{equipamento.vida_util_anos || 'N/A'} anos</p>
            </div>
          </div>
        </div>

        {/* Datas Importantes */}
        <div className="space-y-4">
          <h4 className="font-medium text-gray-900 flex items-center">
            <Calendar className="w-4 h-4 mr-2" />
            Datas Importantes
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">Data de Aquisição:</span>
              <span className="text-sm font-medium">{formatDate(equipamento.data_aquisicao)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">Data de Instalação:</span>
              <span className="text-sm font-medium">{equipamento.data_instalacao ? formatDate(equipamento.data_instalacao) : 'N/A'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">Fim de Garantia:</span>
              <span className="text-sm font-medium">{equipamento.garantia_ate ? formatDate(equipamento.garantia_ate) : 'N/A'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">Última Atualização:</span>
              <span className="text-sm font-medium">{formatDate(equipamento.updated_at)}</span>
            </div>
          </div>
        </div>

        {/* Especificações Técnicas */}
        {equipamento.especificacoes_tecnicas && (
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900 flex items-center">
              <FileText className="w-4 h-4 mr-2" />
              Especificações Técnicas
            </h4>
            <div className="bg-gray-50 p-4 rounded-lg">
              <pre className="text-sm text-gray-700 whitespace-pre-wrap">{equipamento.especificacoes_tecnicas}</pre>
            </div>
          </div>
        )}

        {/* Observações */}
        {equipamento.observacoes && (
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900 flex items-center">
              <Info className="w-4 h-4 mr-2" />
              Observações
            </h4>
            <div className="bg-yellow-50 p-4 rounded-lg">
              <p className="text-sm text-yellow-800">{equipamento.observacoes}</p>
            </div>
          </div>
        )}

        {/* Dados Relacionados */}
        {relatedData && (
          <div className="space-y-6">
            <h4 className="font-medium text-gray-900">Dados Relacionados</h4>
            
            {/* Calibrações */}
            <div className="space-y-3">
              <h5 className="text-sm font-medium text-gray-700 flex items-center">
                <Settings className="w-4 h-4 mr-2" />
                Calibrações ({relatedData.calibracoes.length})
              </h5>
              <div className="space-y-2">
                {relatedData.calibracoes.slice(0, 3).map((cal: any) => (
                  <div key={cal.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-sm font-medium">{cal.tipo}</p>
                      <p className="text-xs text-gray-500">{formatDate(cal.data_calibracao)}</p>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(cal.resultado)}`}>
                      {cal.resultado}
                    </span>
                  </div>
                ))}
                {relatedData.calibracoes.length > 3 && (
                  <p className="text-xs text-gray-500 text-center">+{relatedData.calibracoes.length - 3} mais calibrações</p>
                )}
              </div>
            </div>

            {/* Manutenções */}
            <div className="space-y-3">
              <h5 className="text-sm font-medium text-gray-700 flex items-center">
                <Wrench className="w-4 h-4 mr-2" />
                Manutenções ({relatedData.manutencoes.length})
              </h5>
              <div className="space-y-2">
                {relatedData.manutencoes.slice(0, 3).map((man: any) => (
                  <div key={man.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-sm font-medium">{man.tipo}</p>
                      <p className="text-xs text-gray-500">{formatDate(man.data_inicio)}</p>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(man.resultado)}`}>
                      {man.resultado}
                    </span>
                  </div>
                ))}
                {relatedData.manutencoes.length > 3 && (
                  <p className="text-xs text-gray-500 text-center">+{relatedData.manutencoes.length - 3} mais manutenções</p>
                )}
              </div>
            </div>

            {/* Inspeções */}
            <div className="space-y-3">
              <h5 className="text-sm font-medium text-gray-700 flex items-center">
                <Shield className="w-4 h-4 mr-2" />
                Inspeções ({relatedData.inspecoes.length})
              </h5>
              <div className="space-y-2">
                {relatedData.inspecoes.slice(0, 3).map((insp: any) => (
                  <div key={insp.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-sm font-medium">{insp.tipo}</p>
                      <p className="text-xs text-gray-500">{formatDate(insp.data_inspecao)}</p>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(insp.resultado)}`}>
                      {insp.resultado}
                    </span>
                  </div>
                ))}
                {relatedData.inspecoes.length > 3 && (
                  <p className="text-xs text-gray-500 text-center">+{relatedData.inspecoes.length - 3} mais inspeções</p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderCalibracaoDetails = () => {
    if (!calibracao) return null;

    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Calibração #{calibracao.id}</h3>
            <p className="text-sm text-gray-500">Equipamento: {calibracao.equipamento_nome}</p>
          </div>
          <div className="flex items-center space-x-2">
            <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(calibracao.resultado)}`}>
              {getStatusIcon(calibracao.resultado)}
              <span className="ml-1">{calibracao.resultado}</span>
            </span>
          </div>
        </div>

        {/* Informações da Calibração */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900">Detalhes da Calibração</h4>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Tipo:</span>
                <span className="text-sm font-medium">{calibracao.tipo}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Laboratório:</span>
                <span className="text-sm font-medium">{calibracao.laboratorio}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Técnico:</span>
                <span className="text-sm font-medium">{calibracao.tecnico}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Certificado:</span>
                <span className="text-sm font-medium">{calibracao.numero_certificado}</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-medium text-gray-900">Datas e Custos</h4>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Data de Calibração:</span>
                <span className="text-sm font-medium">{formatDate(calibracao.data_calibracao)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Próxima Calibração:</span>
                <span className="text-sm font-medium">{formatDate(calibracao.proxima_calibracao)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Custo:</span>
                <span className="text-sm font-medium">{formatCurrency(calibracao.custo)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Incerteza:</span>
                <span className="text-sm font-medium">{calibracao.incerteza}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Observações */}
        {calibracao.observacoes && (
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900">Observações</h4>
            <div className="bg-yellow-50 p-4 rounded-lg">
              <p className="text-sm text-yellow-800">{calibracao.observacoes}</p>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderManutencaoDetails = () => {
    if (!manutencao) return null;

    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Manutenção #{manutencao.id}</h3>
            <p className="text-sm text-gray-500">Equipamento: {manutencao.equipamento_nome}</p>
          </div>
          <div className="flex items-center space-x-2">
            <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(manutencao.resultado)}`}>
              {getStatusIcon(manutencao.resultado)}
              <span className="ml-1">{manutencao.resultado}</span>
            </span>
          </div>
        </div>

        {/* Informações da Manutenção */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900">Detalhes da Manutenção</h4>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Tipo:</span>
                <span className="text-sm font-medium">{manutencao.tipo}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Técnico:</span>
                <span className="text-sm font-medium">{manutencao.tecnico_responsavel}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Fornecedor:</span>
                <span className="text-sm font-medium">{manutencao.fornecedor}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Prioridade:</span>
                <span className="text-sm font-medium">{manutencao.prioridade}</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-medium text-gray-900">Datas e Custos</h4>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Data de Início:</span>
                <span className="text-sm font-medium">{formatDate(manutencao.data_inicio)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Data de Fim:</span>
                <span className="text-sm font-medium">{manutencao.data_fim ? formatDate(manutencao.data_fim) : 'Em andamento'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Custo:</span>
                <span className="text-sm font-medium">{formatCurrency(manutencao.custo)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Duração:</span>
                <span className="text-sm font-medium">{manutencao.duracao_horas}h</span>
              </div>
            </div>
          </div>
        </div>

        {/* Descrição e Ações */}
        <div className="space-y-4">
          <h4 className="font-medium text-gray-900">Descrição</h4>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-700">{manutencao.descricao}</p>
          </div>
        </div>

        {manutencao.acoes_realizadas && (
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900">Ações Realizadas</h4>
            <div className="bg-blue-50 p-4 rounded-lg">
              <pre className="text-sm text-blue-800 whitespace-pre-wrap">{manutencao.acoes_realizadas}</pre>
            </div>
          </div>
        )}

        {manutencao.observacoes && (
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900">Observações</h4>
            <div className="bg-yellow-50 p-4 rounded-lg">
              <p className="text-sm text-yellow-800">{manutencao.observacoes}</p>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderInspecaoDetails = () => {
    if (!inspecao) return null;

    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Inspeção #{inspecao.id}</h3>
            <p className="text-sm text-gray-500">Equipamento: {inspecao.equipamento_nome}</p>
          </div>
          <div className="flex items-center space-x-2">
            <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(inspecao.resultado)}`}>
              {getStatusIcon(inspecao.resultado)}
              <span className="ml-1">{inspecao.resultado}</span>
            </span>
          </div>
        </div>

        {/* Informações da Inspeção */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900">Detalhes da Inspeção</h4>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Tipo:</span>
                <span className="text-sm font-medium">{inspecao.tipo}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Inspetor:</span>
                <span className="text-sm font-medium">{inspecao.inspetor}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Data da Inspeção:</span>
                <span className="text-sm font-medium">{formatDate(inspecao.data_inspecao)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Duração:</span>
                <span className="text-sm font-medium">{inspecao.duracao_horas}h</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-medium text-gray-900">Critérios Avaliados</h4>
            <div className="space-y-2">
              {inspecao.criterios_avaliados?.map((criterio: any, index: number) => (
                <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <span className="text-sm">{criterio.nome}</span>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(criterio.resultado)}`}>
                    {criterio.resultado}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Observações */}
        {inspecao.observacoes && (
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900">Observações</h4>
            <div className="bg-yellow-50 p-4 rounded-lg">
              <p className="text-sm text-yellow-800">{inspecao.observacoes}</p>
            </div>
          </div>
        )}

        {/* Ações Corretivas */}
        {inspecao.acoes_corretivas && (
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900">Ações Corretivas</h4>
            <div className="bg-red-50 p-4 rounded-lg">
              <pre className="text-sm text-red-800 whitespace-pre-wrap">{inspecao.acoes_corretivas}</pre>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
        </div>
      );
    }

    switch (activeTab) {
      case 'equipamentos':
        return renderEquipamentoDetails();
      case 'calibracoes':
        return renderCalibracaoDetails();
      case 'manutencoes':
        return renderManutencaoDetails();
      case 'inspecoes':
        return renderInspecaoDetails();
      default:
        return <div>Selecionar um item para ver os detalhes</div>;
    }
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 overflow-y-auto"
    >
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:flex sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>

        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-600 to-purple-700 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                  <Settings className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-white">
                    Detalhes - {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
                  </h2>
                  <p className="text-sm text-purple-100">
                    Visualizar informações detalhadas
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {itemId && (
                  <>
                    <button
                      onClick={() => onEdit(itemId)}
                      className="p-2 text-white hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
                      title="Editar"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDelete(itemId)}
                      className="p-2 text-white hover:bg-red-500 rounded-lg transition-colors"
                      title="Eliminar"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </>
                )}
                <button
                  onClick={onClose}
                  className="p-2 text-white hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
                  title="Fechar"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="px-6 py-6 max-h-96 overflow-y-auto">
            {renderContent()}
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-6 py-4 flex items-center justify-between">
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <Info className="w-4 h-4" />
              <span>Detalhes completos do item selecionado</span>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Fechar
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default CalibracoesEquipamentosDetails;
