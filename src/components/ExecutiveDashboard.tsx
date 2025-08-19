import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Building, TestTube, Package, FileText, TrendingUp, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface KPICardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  color: 'blue' | 'green' | 'orange' | 'red' | 'purple';
  trend?: number;
  subtitle?: string;
}

const KPICard: React.FC<KPICardProps> = ({ title, value, icon, color, trend, subtitle }) => {
  const colorClasses = {
    blue: 'bg-blue-50 border-blue-200 text-blue-700',
    green: 'bg-green-50 border-green-200 text-green-700',
    orange: 'bg-orange-50 border-orange-200 text-orange-700',
    red: 'bg-red-50 border-red-200 text-red-700',
    purple: 'bg-purple-50 border-purple-200 text-purple-700'
  };

  const iconColors = {
    blue: 'text-blue-600',
    green: 'text-green-600',
    orange: 'text-orange-600',
    red: 'text-red-600',
    purple: 'text-purple-600'
  };

  return (
    <div className={`p-6 rounded-lg border ${colorClasses[color]} transition-all duration-200 hover:shadow-md`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium opacity-80">{title}</p>
          <p className="text-2xl font-bold mt-1">{value}</p>
          {subtitle && <p className="text-xs opacity-70 mt-1">{subtitle}</p>}
          {trend !== undefined && (
            <div className="flex items-center mt-2">
              <TrendingUp className={`w-4 h-4 ${trend > 0 ? 'text-green-600' : 'text-red-600'}`} />
              <span className={`text-sm ml-1 ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {trend > 0 ? '+' : ''}{trend}%
              </span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-full bg-white ${iconColors[color]}`}>
          {icon}
        </div>
      </div>
    </div>
  );
};

export const ExecutiveDashboard: React.FC = () => {
  const { data: kpis, isLoading, error } = useQuery({
    queryKey: ['executive-kpis'],
    queryFn: async () => {
      const [
        { count: obrasAtivas },
        { count: ensaiosPendentes },
        { count: totalMateriais },
        { count: totalDocumentos },
        { count: naoConformidades },
        { count: obrasConcluidas }
      ] = await Promise.all([
        supabase.from('obras').select('*', { count: 'exact', head: true }).eq('status', 'ativo'),
        supabase.from('ensaios').select('*', { count: 'exact', head: true }).eq('status', 'pendente'),
        supabase.from('materiais').select('*', { count: 'exact', head: true }),
        supabase.from('documentos').select('*', { count: 'exact', head: true }),
        supabase.from('nao_conformidades').select('*', { count: 'exact', head: true }).eq('status', 'aberta'),
        supabase.from('obras').select('*', { count: 'exact', head: true }).eq('status', 'concluida')
      ]);

      return {
        obrasAtivas: obrasAtivas || 0,
        ensaiosPendentes: ensaiosPendentes || 0,
        totalMateriais: totalMateriais || 0,
        totalDocumentos: totalDocumentos || 0,
        naoConformidades: naoConformidades || 0,
        obrasConcluidas: obrasConcluidas || 0
      };
    },
    staleTime: 5 * 60 * 1000, // 5 minutos
    refetchInterval: 5 * 60 * 1000 // Refetch a cada 5 minutos
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="p-6 rounded-lg border bg-gray-50 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-8 bg-gray-200 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <p className="text-red-600">Erro ao carregar dados do dashboard</p>
      </div>
    );
  }

  const complianceRate = kpis?.obrasConcluidas && kpis?.obrasAtivas 
    ? Math.round((kpis.obrasConcluidas / (kpis.obrasConcluidas + kpis.obrasAtivas)) * 100)
    : 0;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <KPICard 
          title="Obras Ativas"
          value={kpis?.obrasAtivas || 0}
          icon={<Building className="w-6 h-6" />}
          color="blue"
          subtitle="Em progresso"
        />
        <KPICard 
          title="Ensaios Pendentes"
          value={kpis?.ensaiosPendentes || 0}
          icon={<TestTube className="w-6 h-6" />}
          color="orange"
          subtitle="Aguardando análise"
        />
        <KPICard 
          title="Total Materiais"
          value={kpis?.totalMateriais || 0}
          icon={<Package className="w-6 h-6" />}
          color="green"
          subtitle="Registados"
        />
        <KPICard 
          title="Documentos"
          value={kpis?.totalDocumentos || 0}
          icon={<FileText className="w-6 h-6" />}
          color="purple"
          subtitle="Armazenados"
        />
        <KPICard 
          title="Não Conformidades"
          value={kpis?.naoConformidades || 0}
          icon={<AlertTriangle className="w-6 h-6" />}
          color="red"
          subtitle="Em aberto"
        />
        <KPICard 
          title="Taxa de Conformidade"
          value={`${complianceRate}%`}
          icon={<CheckCircle className="w-6 h-6" />}
          color="green"
          subtitle="Obras concluídas"
        />
      </div>

      {/* Gráfico de tendências */}
      <div className="bg-white rounded-lg border p-6">
        <h3 className="text-lg font-semibold mb-4">Tendências dos Últimos 30 Dias</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{kpis?.obrasAtivas || 0}</div>
            <div className="text-sm text-gray-600">Obras Ativas</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">{kpis?.ensaiosPendentes || 0}</div>
            <div className="text-sm text-gray-600">Ensaios Pendentes</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{complianceRate}%</div>
            <div className="text-sm text-gray-600">Conformidade</div>
          </div>
        </div>
      </div>
    </div>
  );
};
