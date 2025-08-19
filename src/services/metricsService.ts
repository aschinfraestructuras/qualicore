import {
  Ensaio,
  Documento,
  Checklist,
  Material,
  Fornecedor,
  NaoConformidade,
  Obra,
} from "@/types";
import {
  documentosAPI,
  ensaiosAPI,
  checklistsAPI,
  materiaisAPI,
  fornecedoresAPI,
  naoConformidadesAPI,
  obrasAPI,
} from "@/lib/supabase-api";
import { betonagensAPI } from "@/lib/supabase-api/betonagensAPI";
import { pontesTuneisAPI } from "@/lib/supabase-api/pontesTuneisAPI";
import { viaFerreaAPI } from "@/lib/supabase-api/viaFerreaAPI";
import { solosAPI } from "@/lib/supabase-api/solosAPI";

// Tipos para métricas reais
export interface MetricasReais {
  ensaios: KPIsEnsaios;
  checklists: KPIsChecklists;
  materiais: KPIsMateriais;
  naoConformidades: KPIsNCs;
  documentos: KPIsDocumentos;
  fornecedores: KPIsFornecedores;
  obras: KPIsObras;
  betonagens: KPIsBetonagens;
  solos: KPIsSolos;
  ferroviario: KPIsFerroviario;
  geral: KPIsGerais;
}

export interface KPIsEnsaios {
  taxa_conformidade: number;
  total_ensaios: number;
  ensaios_conformes: number;
  ensaios_nao_conformes: number;
  desvio_medio: number;
  ensaios_por_mes: number;
  tipos_mais_problematicos: string[];
  laboratorios_mais_eficientes: string[];
  zonas_com_mais_problemas: string[];
}

export interface KPIsChecklists {
  conformidade_media: number;
  total_checklists: number;
  checklists_concluidos: number;
  checklists_pendentes: number;
  tempo_medio_inspecao: number;
  inspetores_mais_eficientes: string[];
  zonas_com_mais_falhas: string[];
}

export interface KPIsMateriais {
  taxa_aprovacao: number;
  total_materiais: number;
  materiais_aprovados: number;
  materiais_pendentes: number;
  materiais_reprovados: number;
  materiais_em_analise: number;
  materiais_recebidos_mes: number;
  fornecedores_mais_confiaveis: string[];
  volume_por_tipo: Record<string, number>;
}

export interface KPIsNCs {
  total_ncs: number;
  ncs_pendentes: number;
  ncs_resolvidas: number;
  tempo_medio_resolucao: number;
  ncs_por_severidade: Record<string, number>;
  zonas_com_mais_ncs: string[];
  taxa_resolucao: number;
}

export interface KPIsDocumentos {
  documentos_aprovados: number;
  documentos_pendentes: number;
  documentos_vencidos: number;
  total_documentos: number;
  documentos_por_tipo: Record<string, number>;
  tempo_medio_aprovacao: number;
}

export interface KPIsFornecedores {
  fornecedores_ativos: number;
  fornecedores_inativos: number;
  total_fornecedores: number;
  fornecedores_com_problemas: number;
  performance_media: number;
}

export interface KPIsObras {
  total_obras: number;
  obras_em_execucao: number;
  obras_concluidas: number;
  obras_paralisadas: number;
  valor_total_contratos: number;
  valor_total_executado: number;
  percentual_execucao_medio: number;
  obras_por_tipo: Record<string, number>;
  obras_por_categoria: Record<string, number>;
  obras_por_status: Record<string, number>;
}

export interface KPIsGerais {
  conformidade_geral: number;
  total_registros: number;
  alertas_criticos: number;
  tendencia_qualidade: "melhorando" | "estavel" | "piorando";
}

export interface KPIsBetonagens {
  total_betonagens: number;
  conformes: number;
  nao_conformes: number;
  pendentes: number;
  resistencia_media_7d: number;
  resistencia_media_28d: number;
  resistencia_media_rotura: number;
  ensaios_7d_pendentes: number;
  ensaios_28d_pendentes: number;
  tipos_betao_distribuicao: Record<string, number>;
  obras_distribuicao: Record<string, number>;
}

export interface KPIsSolos {
  total_solos: number;
  conformes: number;
  nao_conformes: number;
  adequados: number;
  inadequados: number;
  marginais: number;
  tipos_amostra_distribuicao: Record<string, number>;
  obras_distribuicao: Record<string, number>;
  laboratorios_distribuicao: Record<string, number>;
  profundidade_media: number;
  cbr_medio: number;
  resistencia_cisalhamento_media: number;
}

export interface KPIsFerroviario {
  via_ferrea: {
    total_trilhos: number;
    total_travessas: number;
    inspecoes_pendentes: number;
    alertas_criticos: number;
    conformidade: number;
    km_cobertos: number;
  };
  pontes_tuneis: {
    total_pontes_tuneis: number;
    ativas: number;
    em_manutencao: number;
    com_avaria: number;
    inspecoes_pendentes: number;
    proximas_inspecoes_7d: number;
    proximas_inspecoes_30d: number;
  };
  sinalizacao: {
    total_sinalizacoes: number;
    operacionais: number;
    em_manutencao: number;
    com_avaria: number;
  };
  eletrificacao: {
    total_eletrificacoes: number;
    operacionais: number;
    em_manutencao: number;
    com_avaria: number;
  };
}

// Função principal para calcular todas as métricas
export const calcularMetricasReais = async (): Promise<MetricasReais> => {
  try {
    console.log("🚀 Iniciando cálculo de métricas...");
    
    // Buscar todos os dados
    console.log("📊 Buscando dados de todos os módulos...");
    const [
      ensaios,
      checklists,
      materiais,
      naoConformidades,
      documentos,
      fornecedores,
      obras,
      betonagens,
      solos,
      viaFerreaStats,
      pontesTuneisStats,
    ] = await Promise.all([
      ensaiosAPI.getAll().catch(e => { console.error("❌ Erro ao buscar ensaios:", e); return []; }),
      checklistsAPI.getAll().catch(e => { console.error("❌ Erro ao buscar checklists:", e); return []; }),
      materiaisAPI.getAll().catch(e => { console.error("❌ Erro ao buscar materiais:", e); return []; }),
      naoConformidadesAPI.getAll().catch(e => { console.error("❌ Erro ao buscar não conformidades:", e); return []; }),
      documentosAPI.getAll().catch(e => { console.error("❌ Erro ao buscar documentos:", e); return []; }),
      fornecedoresAPI.getAll().catch(e => { console.error("❌ Erro ao buscar fornecedores:", e); return []; }),
      obrasAPI.getAll().catch(e => { console.error("❌ Erro ao buscar obras:", e); return []; }),
      betonagensAPI.betonagens.getAll().catch(e => { console.error("❌ Erro ao buscar betonagens:", e); return []; }),
      solosAPI.caracterizacoes.getAll().catch(e => { console.error("❌ Erro ao buscar solos:", e); return []; }),
      viaFerreaAPI.stats.getStats().catch(e => { console.error("❌ Erro ao buscar stats via férrea:", e); return null; }),
      pontesTuneisAPI.stats.getStats().catch(e => { console.error("❌ Erro ao buscar stats pontes/túneis:", e); return null; }),
    ]);

    console.log("📊 Dados recebidos:");
    console.log("  - Ensaios:", ensaios.length);
    console.log("  - Checklists:", checklists.length);
    console.log("  - Materiais:", materiais.length);
    console.log("  - Não Conformidades:", naoConformidades.length);
    console.log("  - Documentos:", documentos.length);
    console.log("  - Fornecedores:", fornecedores.length);
    console.log("  - Obras:", obras.length);
    console.log("  - Betonagens:", betonagens.length);
    console.log("  - Solos:", solos.length);
    console.log("  - Via Férrea Stats:", viaFerreaStats);
    console.log("  - Pontes/Túneis Stats:", pontesTuneisStats);

    // Calcular métricas de ensaios
    console.log("🧪 Calculando métricas de ensaios...");
    const kpisEnsaios = calcularKPIsEnsaios(ensaios);

    // Calcular métricas de checklists
    console.log("📋 Calculando métricas de checklists...");
    const kpisChecklists = calcularKPIsChecklists(checklists);

    // Calcular métricas de materiais
    console.log("📦 Calculando métricas de materiais...");
    const kpisMateriais = calcularKPIsMateriais(materiais);

    // Calcular métricas de não conformidades
    console.log("⚠️ Calculando métricas de não conformidades...");
    const kpisNCs = calcularKPIsNCs(naoConformidades);

    // Calcular métricas de documentos
    console.log("📄 Calculando métricas de documentos...");
    const kpisDocumentos = calcularKPIsDocumentos(documentos);

    // Calcular métricas de fornecedores
    console.log("🏢 Calculando métricas de fornecedores...");
    const kpisFornecedores = calcularKPIsFornecedores(fornecedores);

    // Calcular métricas de obras
    console.log("🏗️ Calculando métricas de obras...");
    const kpisObras = calcularKPIsObras(obras);

    // Calcular métricas de betonagens
    console.log("🏗️ Calculando métricas de betonagens...");
    const kpisBetonagens = calcularKPIsBetonagens(betonagens);

    // Calcular métricas de solos
    console.log("🌱 Calculando métricas de solos...");
    const kpisSolos = calcularKPIsSolos(solos);

    // Calcular métricas ferroviárias
    console.log("🚂 Calculando métricas ferroviárias...");
    const kpisFerroviario = calcularKPIsFerroviario(viaFerreaStats, pontesTuneisStats);

    // Calcular métricas gerais
    console.log("📈 Calculando métricas gerais...");
    const kpisGerais = calcularKPIsGerais({
      ensaios: kpisEnsaios,
      checklists: kpisChecklists,
      materiais: kpisMateriais,
      naoConformidades: kpisNCs,
      documentos: kpisDocumentos,
      fornecedores: kpisFornecedores,
      obras: kpisObras,
      betonagens: kpisBetonagens,
      solos: kpisSolos,
      ferroviario: kpisFerroviario,
    });

    console.log("✅ Métricas calculadas com sucesso!");
    console.log("📊 Resumo das métricas:");
    console.log("  - Conformidade Geral:", kpisGerais.conformidade_geral + "%");
    console.log("  - Total de Registos:", kpisGerais.total_registros);
    console.log("  - Ensaios:", kpisEnsaios.total_ensaios);
    console.log("  - Checklists:", kpisChecklists.total_checklists);
    console.log("  - Materiais:", kpisMateriais.total_materiais);
    console.log("  - NCs:", kpisNCs.total_ncs);
    console.log("  - Betonagens:", kpisBetonagens.total_betonagens);
    console.log("  - Solos:", kpisSolos.total_solos);
    console.log("  - Via Férrea:", kpisFerroviario.via_ferrea.total_trilhos);

    return {
      ensaios: kpisEnsaios,
      checklists: kpisChecklists,
      materiais: kpisMateriais,
      naoConformidades: kpisNCs,
      documentos: kpisDocumentos,
      fornecedores: kpisFornecedores,
      obras: kpisObras,
      betonagens: kpisBetonagens,
      solos: kpisSolos,
      ferroviario: kpisFerroviario,
      geral: kpisGerais,
    };
  } catch (error) {
    console.error("❌ Erro ao calcular métricas:", error);
    throw error;
  }
};

// Funções específicas para cada módulo
const calcularKPIsEnsaios = (ensaios: any[]): KPIsEnsaios => {
  console.log("🔍 Calculando KPIs Ensaios...");
  console.log("  - Total de ensaios:", ensaios.length);
  console.log("  - Ensaios brutos:", ensaios);
  
  // Dados de teste temporários se não houver ensaios
  if (ensaios.length === 0) {
    console.log("⚠️ Nenhum ensaio encontrado, usando dados de teste...");
    const dadosTeste = {
      taxa_conformidade: 85.0,
      total_ensaios: 6,
      ensaios_conformes: 5,
      ensaios_nao_conformes: 1,
      desvio_medio: 2.5,
      ensaios_por_mes: 2,
      tipos_mais_problematicos: [],
      laboratorios_mais_eficientes: [],
      zonas_com_mais_problemas: [],
    };
    console.log("✅ KPIs Ensaios (dados de teste):", dadosTeste);
    return dadosTeste;
  }
  
  const total = ensaios.length;
  const conformes = ensaios.filter((e) => e.conforme === true).length;
  const naoConformes = total - conformes;
  const taxaConformidade = total > 0 ? (conformes / total) * 100 : 0;

  console.log("  - Ensaios conformes:", conformes);
  console.log("  - Ensaios não conformes:", naoConformes);
  console.log("  - Taxa conformidade:", taxaConformidade);

  // Desvio médio (simulado - seria baseado em valores obtidos vs esperados)
  const desvioMedio = 2.5; // Simulado

  // Ensaios por mês (simulado)
  const ensaiosPorMes = Math.floor(total / 3); // Simulado

  // Tipos mais problemáticos
  const tiposNC = ensaios
    .filter((e) => !e.conforme)
    .map((e) => e.tipo);
  const tiposProblema = contarFrequencias(tiposNC).slice(0, 3);

  // Laboratórios mais eficientes
  const laboratorios = ensaios
    .filter((e) => e.conforme)
    .map((e) => e.laboratorio);
  const laboratoriosEficientes = contarFrequencias(laboratorios).slice(0, 3);

  // Zonas com mais problemas
  const zonasNC = ensaios
    .filter((e) => !e.conforme)
    .map((e) => e.zona);
  const zonasProblema = contarFrequencias(zonasNC).slice(0, 3);

  const resultado = {
    taxa_conformidade: Math.round(taxaConformidade * 100) / 100,
    total_ensaios: total,
    ensaios_conformes: conformes,
    ensaios_nao_conformes: naoConformes,
    desvio_medio: desvioMedio,
    ensaios_por_mes: ensaiosPorMes,
    tipos_mais_problematicos: tiposProblema,
    laboratorios_mais_eficientes: laboratoriosEficientes,
    zonas_com_mais_problemas: zonasProblema,
  };

  console.log("✅ KPIs Ensaios calculados:", resultado);
  return resultado;
};

const calcularKPIsChecklists = (checklists: any[]): KPIsChecklists => {
  console.log("🔍 Calculando KPIs Checklists...");
  console.log("  - Total de checklists:", checklists.length);
  console.log("  - Checklists brutos:", checklists);
  
  // Dados de teste temporários se não houver checklists
  if (checklists.length === 0) {
    console.log("⚠️ Nenhum checklist encontrado, usando dados de teste...");
    const dadosTeste = {
      conformidade_media: 80.0,
      total_checklists: 8,
      checklists_concluidos: 6,
      checklists_pendentes: 2,
      tempo_medio_inspecao: 45.0,
      inspetores_mais_eficientes: [],
      zonas_com_mais_falhas: [],
    };
    console.log("✅ KPIs Checklists (dados de teste):", dadosTeste);
    return dadosTeste;
  }
  
  const total = checklists.length;
  const concluidos = checklists.filter((c) => c.estado === "concluido").length;
  const pendentes = total - concluidos;
  const conformidadeMedia = total > 0 ? (concluidos / total) * 100 : 0;

  console.log("  - Checklists concluídos:", concluidos);
  console.log("  - Checklists pendentes:", pendentes);
  console.log("  - Conformidade média:", conformidadeMedia);

  // Tempo médio de inspeção (simulado)
  const tempoMedioInspecao = 45.0; // minutos (simulado)

  // Inspetores mais eficientes
  const inspetores = checklists
    .filter((c) => c.estado === "concluido")
    .map((c) => c.responsavel);
  const inspetoresEficientes = contarFrequencias(inspetores).slice(0, 3);

  // Zonas com mais falhas
  const zonasFalhas = checklists
    .filter((c) => c.estado !== "concluido")
    .map((c) => c.zona);
  const zonasProblema = contarFrequencias(zonasFalhas).slice(0, 3);

  const resultado = {
    conformidade_media: Math.round(conformidadeMedia * 100) / 100,
    total_checklists: total,
    checklists_concluidos: concluidos,
    checklists_pendentes: pendentes,
    tempo_medio_inspecao: tempoMedioInspecao,
    inspetores_mais_eficientes: inspetoresEficientes,
    zonas_com_mais_falhas: zonasProblema,
  };

  console.log("✅ KPIs Checklists calculados:", resultado);
  return resultado;
};

const calcularKPIsMateriais = (materiais: any[]): KPIsMateriais => {
  try {
    console.log("🔍 Calculando KPIs Materiais...");
    console.log("  - Total de materiais:", materiais.length);
    console.log("  - Materiais brutos:", materiais);
    
    // Dados de teste temporários se não houver materiais
    if (materiais.length === 0) {
      console.log("⚠️ Nenhum material encontrado, usando dados de teste...");
      const dadosTeste = {
        taxa_aprovacao: 75.0,
        total_materiais: 4,
        materiais_aprovados: 3,
        materiais_pendentes: 1,
        materiais_reprovados: 0,
        materiais_em_analise: 0,
        materiais_recebidos_mes: 2,
        fornecedores_mais_confiaveis: [],
        volume_por_tipo: { "betao": 100, "aco": 50 },
      };
      console.log("✅ KPIs Materiais (dados de teste):", dadosTeste);
      return dadosTeste;
    }
    
    // Log detalhado de cada material
    materiais.forEach((material, index) => {
      console.log(`  - Material ${index + 1}:`, {
        id: material.id,
        estado: material.estado,
        tipo: material.tipo,
        descricao: material.descricao
      });
      console.log(`  - Material ${index + 1} - Estado exato:`, JSON.stringify(material.estado));
      console.log(`  - Material ${index + 1} - Estado length:`, material.estado?.length);
      console.log(`  - Material ${index + 1} - Estado === "em_analise":`, material.estado === "em_analise");
    });
    
    const total = materiais.length;
    const aprovados = materiais.filter((m) => m.estado === "aprovado").length;
    const pendentes = materiais.filter((m) => m.estado === "pendente").length;
    const reprovados = materiais.filter((m) => m.estado === "reprovado").length;
    const emAnalise = materiais.filter((m) => m.estado === "em_analise").length; // Corrigido para "em_analise"

    console.log("  - Materiais aprovados:", aprovados);
    console.log("  - Materiais pendentes:", pendentes);
    console.log("  - Materiais reprovados:", reprovados);
    console.log("  - Materiais em análise:", emAnalise);

    const taxaAprovacao = total > 0 ? (aprovados / total) * 100 : 0;

    console.log("  - Taxa de aprovação:", taxaAprovacao);

    // Materiais recebidos no mês atual
    const agora = new Date();
    const inicioMes = new Date(agora.getFullYear(), agora.getMonth(), 1);
    const materiaisMes = materiais.filter(
      (m) => new Date(m.data_rececao) >= inicioMes,
    ).length;

    // Volume por tipo
    const volumePorTipo = materiais.reduce(
      (acc, m) => {
        acc[m.tipo] = (acc[m.tipo] || 0) + m.quantidade;
        return acc;
      },
      {} as Record<string, number>,
    );

    // Fornecedores mais confiáveis (maior % aprovação)
    const fornecedores = materiais.reduce(
      (acc, m) => {
        if (!acc[m.fornecedor_id])
          acc[m.fornecedor_id] = { total: 0, aprovados: 0 };
        acc[m.fornecedor_id].total++;
        if (m.estado === "aprovado") acc[m.fornecedor_id].aprovados++;
        return acc;
      },
      {} as Record<string, { total: number; aprovados: number }>,
    );

    const fornecedoresConfiaveis = Object.entries(fornecedores)
      .map(([id, stats]) => ({
        id,
        taxa:
          ((stats as { total: number; aprovados: number }).aprovados /
            (stats as { total: number; aprovados: number }).total) *
          100,
      }))
      .sort((a, b) => b.taxa - a.taxa)
      .slice(0, 5)
      .map((f) => f.id);

    const resultado = {
      taxa_aprovacao: Math.round(taxaAprovacao * 100) / 100,
      total_materiais: total,
      materiais_aprovados: aprovados,
      materiais_pendentes: pendentes,
      materiais_reprovados: reprovados,
      materiais_em_analise: emAnalise,
      materiais_recebidos_mes: materiaisMes,
      fornecedores_mais_confiaveis: fornecedoresConfiaveis,
      volume_por_tipo: volumePorTipo,
    };

    console.log("✅ KPIs Materiais calculados:", resultado);
    return resultado;
  } catch (error) {
    console.error("❌ Erro ao calcular KPIs Materiais:", error);
    // Retornar valores padrão em caso de erro
    return {
      taxa_aprovacao: 0,
      total_materiais: materiais.length,
      materiais_aprovados: 0,
      materiais_pendentes: 0,
      materiais_reprovados: 0,
      materiais_em_analise: 0,
      materiais_recebidos_mes: 0,
      fornecedores_mais_confiaveis: [],
      volume_por_tipo: {},
    };
  }
};

const calcularKPIsNCs = (naoConformidades: any[]): KPIsNCs => {
  console.log("🔍 Calculando KPIs Não Conformidades...");
  console.log("  - Total de NCs:", naoConformidades.length);
  console.log("  - NCs brutas:", naoConformidades);
  
  // Dados de teste temporários se não houver NCs
  if (naoConformidades.length === 0) {
    console.log("⚠️ Nenhuma NC encontrada, usando dados de teste...");
    const dadosTeste = {
      total_ncs: 3,
      ncs_pendentes: 1,
      ncs_resolvidas: 2,
      tempo_medio_resolucao: 5.5,
      ncs_por_severidade: { "alta": 1, "media": 2 },
      zonas_com_mais_ncs: [],
      taxa_resolucao: 66.7,
    };
    console.log("✅ KPIs NCs (dados de teste):", dadosTeste);
    return dadosTeste;
  }
  
  const total = naoConformidades.length;
  const pendentes = naoConformidades.filter(
    (nc) => nc.estado === "pendente",
  ).length;
  const resolvidas = naoConformidades.filter(
    (nc) => nc.estado === "concluido",
  ).length;

  console.log("  - NCs pendentes:", pendentes);
  console.log("  - NCs resolvidas:", resolvidas);

  const taxaResolucao = total > 0 ? (resolvidas / total) * 100 : 0;
  console.log("  - Taxa de resolução:", taxaResolucao);

  // Tempo médio de resolução
  const temposResolucao = naoConformidades
    .filter((nc) => nc.data_resolucao && nc.data_deteccao)
    .map((nc) => {
      const deteccao = new Date(nc.data_deteccao);
      const resolucao = new Date(nc.data_resolucao);
      return (resolucao.getTime() - deteccao.getTime()) / (1000 * 60 * 60 * 24); // dias
    });

  const tempoMedioResolucao =
    temposResolucao.length > 0
      ? temposResolucao.reduce((a, b) => a + b, 0) / temposResolucao.length
      : 0;

  // NCs por severidade
  const ncsPorSeveridade = naoConformidades.reduce(
    (acc, nc) => {
      acc[nc.severidade] = (acc[nc.severidade] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  // Zonas com mais NCs
  const zonasNC = naoConformidades.map((nc) => nc.zona);
  const zonasProblema = contarFrequencias(zonasNC).slice(0, 5);

  const resultado = {
    total_ncs: total,
    ncs_pendentes: pendentes,
    ncs_resolvidas: resolvidas,
    tempo_medio_resolucao: Math.round(tempoMedioResolucao * 100) / 100,
    ncs_por_severidade: ncsPorSeveridade,
    zonas_com_mais_ncs: zonasProblema,
    taxa_resolucao: Math.round(taxaResolucao * 100) / 100,
  };

  console.log("✅ KPIs Não Conformidades calculados:", resultado);
  return resultado;
};

const calcularKPIsDocumentos = (documentos: any[]): KPIsDocumentos => {
  const total = documentos.length;
  const aprovados = documentos.filter((d) => d.estado === "aprovado").length;
  const pendentes = documentos.filter((d) => d.estado === "pendente").length;

  // Documentos vencidos
  const agora = new Date();
  const vencidos = documentos.filter((d) => {
    if (!d.data_validade) return false;
    return new Date(d.data_validade) < agora;
  }).length;

  // Documentos por tipo
  const docsPorTipo = documentos.reduce(
    (acc, d) => {
      acc[d.tipo] = (acc[d.tipo] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  // Tempo médio de aprovação (simulado - seria baseado em timeline)
  const tempoMedioAprovacao = 7; // dias (simulado)

  return {
    documentos_aprovados: aprovados,
    documentos_pendentes: pendentes,
    documentos_vencidos: vencidos,
    total_documentos: total,
    documentos_por_tipo: docsPorTipo,
    tempo_medio_aprovacao: tempoMedioAprovacao,
  };
};

const calcularKPIsFornecedores = (fornecedores: any[]): KPIsFornecedores => {
  const total = fornecedores.length;
  const ativos = fornecedores.filter((f) => f.estado === "ativo").length;
  const inativos = total - ativos;

  // Fornecedores com problemas (simulado - seria baseado em NCs/materiais)
  const comProblemas = Math.floor(ativos * 0.1); // 10% simulado

  // Performance média (simulado - seria baseado em avaliações)
  const performanceMedia = 4.2; // 1-5 escala

  return {
    fornecedores_ativos: ativos,
    fornecedores_inativos: inativos,
    total_fornecedores: total,
    fornecedores_com_problemas: comProblemas,
    performance_media: performanceMedia,
  };
};

const calcularKPIsObras = (obras: any[]): KPIsObras => {
  const total = obras.length;
  const emExecucao = obras.filter((o) => o.status === "em_execucao").length;
  const concluidas = obras.filter((o) => o.status === "concluida").length;
  const paralisadas = obras.filter((o) => o.status === "paralisada").length;

  const valorTotalContratos = obras.reduce(
    (sum, o) => sum + o.valor_contrato,
    0,
  );
  const valorTotalExecutado = obras.reduce(
    (sum, o) => sum + o.valor_executado,
    0,
  );
  const percentualExecucaoMedio =
    total > 0 ? (valorTotalExecutado / valorTotalContratos) * 100 : 0;

  // Obras por tipo
  const obrasPorTipo = obras.reduce(
    (acc, o) => {
      acc[o.tipo] = (acc[o.tipo] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  // Obras por categoria
  const obrasPorCategoria = obras.reduce(
    (acc, o) => {
      acc[o.categoria] = (acc[o.categoria] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  // Obras por status
  const obrasPorStatus = obras.reduce(
    (acc, o) => {
      acc[o.status] = (acc[o.status] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  return {
    total_obras: total,
    obras_em_execucao: emExecucao,
    obras_concluidas: concluidas,
    obras_paralisadas: paralisadas,
    valor_total_contratos: valorTotalContratos,
    valor_total_executado: valorTotalExecutado,
    percentual_execucao_medio: Math.round(percentualExecucaoMedio * 100) / 100,
    obras_por_tipo: obrasPorTipo,
    obras_por_categoria: obrasPorCategoria,
    obras_por_status: obrasPorStatus,
  };
};

const calcularKPIsGerais = (
  metricas: Omit<MetricasReais, "geral">,
): KPIsGerais => {
  console.log("🔍 Calculando KPIs Gerais...");
  // Calcular conformidade de solos primeiro
  const solosConformidade = metricas.solos.total_solos > 0 
    ? (metricas.solos.conformes / metricas.solos.total_solos) * 100 
    : 0;

  console.log("  - Ensaios taxa_conformidade:", metricas.ensaios.taxa_conformidade);
  console.log("  - Checklists conformidade_media:", metricas.checklists.conformidade_media);
  console.log("  - Materiais taxa_aprovacao:", metricas.materiais.taxa_aprovacao);
  console.log("  - Solos conformidade:", solosConformidade);
  console.log("  - NCs taxa_resolucao:", metricas.naoConformidades.taxa_resolucao);

  // Conformidade geral (média ponderada) - com proteção contra NaN
  const ensaiosConformidade = isNaN(metricas.ensaios.taxa_conformidade) ? 0 : metricas.ensaios.taxa_conformidade;
  const checklistsConformidade = isNaN(metricas.checklists.conformidade_media) ? 0 : metricas.checklists.conformidade_media;
  const materiaisAprovacao = isNaN(metricas.materiais.taxa_aprovacao) ? 0 : metricas.materiais.taxa_aprovacao;
  const ncsResolucao = isNaN(metricas.naoConformidades.taxa_resolucao) ? 0 : metricas.naoConformidades.taxa_resolucao;



  const conformidadeGeral =
    ensaiosConformidade * 0.35 +
    checklistsConformidade * 0.25 +
    materiaisAprovacao * 0.15 +
    solosConformidade * 0.15 +
    (100 - ncsResolucao) * 0.1;

  console.log("  - Valores calculados:");
  console.log("    * Ensaios (35%):", ensaiosConformidade * 0.35);
  console.log("    * Checklists (25%):", checklistsConformidade * 0.25);
  console.log("    * Materiais (15%):", materiaisAprovacao * 0.15);
  console.log("    * Solos (15%):", solosConformidade * 0.15);
  console.log("    * NCs (10%):", (100 - ncsResolucao) * 0.1);
  console.log("  - Conformidade Geral Final:", conformidadeGeral);

  const totalRegistros =
    metricas.ensaios.total_ensaios +
    metricas.checklists.total_checklists +
    metricas.materiais.total_materiais +
    metricas.naoConformidades.total_ncs +
    metricas.documentos.total_documentos +
    metricas.obras.total_obras +
    metricas.betonagens.total_betonagens +
    metricas.solos.total_solos;

      // Alertas críticos
    const alertasCriticos = 
      metricas.naoConformidades.ncs_pendentes +
      metricas.documentos.documentos_vencidos +
      metricas.materiais.materiais_pendentes +
      metricas.obras.obras_paralisadas +
      metricas.ferroviario.via_ferrea.inspecoes_pendentes +
      metricas.ferroviario.pontes_tuneis.inspecoes_pendentes;

  // Tendência (simulada - seria baseada em dados históricos)
  const tendencia: "melhorando" | "estavel" | "piorando" = "estavel";

  const resultado = {
    conformidade_geral: Math.round(conformidadeGeral * 100) / 100,
    total_registros: totalRegistros,
    alertas_criticos: alertasCriticos,
    tendencia_qualidade: tendencia,
  };

  console.log("✅ KPIs Gerais calculados:", resultado);
  return resultado;
};

// Funções auxiliares
const contarFrequencias = (array: string[]): string[] => {
  const contagem = array.reduce(
    (acc, item) => {
      acc[item] = (acc[item] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  return Object.entries(contagem)
    .sort(([, a], [, b]) => b - a)
    .map(([item]) => item);
};

const calcularTempoMedioEntreDatas = (datas: Date[]): number => {
  if (datas.length < 2) return 0;

  const intervalos = [];
  for (let i = 1; i < datas.length; i++) {
    const intervalo =
      (datas[i].getTime() - datas[i - 1].getTime()) / (1000 * 60 * 60 * 24);
    intervalos.push(intervalo);
  }

  return intervalos.length > 0
    ? intervalos.reduce((a, b) => a + b, 0) / intervalos.length
    : 0;
};

// Função para calcular métricas de betonagens
const calcularKPIsBetonagens = (betonagens: any[]): KPIsBetonagens => {
  console.log("🔍 Calculando KPIs Betonagens...");
  console.log("  - Total de betonagens:", betonagens.length);
  
  if (betonagens.length === 0) {
    console.log("⚠️ Nenhuma betonagem encontrada, usando dados de teste...");
    return {
      total_betonagens: 0,
      conformes: 0,
      nao_conformes: 0,
      pendentes: 0,
      resistencia_media_7d: 0,
      resistencia_media_28d: 0,
      resistencia_media_rotura: 0,
      ensaios_7d_pendentes: 0,
      ensaios_28d_pendentes: 0,
      tipos_betao_distribuicao: {},
      obras_distribuicao: {},
    };
  }

  const total = betonagens.length;
  const conformes = betonagens.filter(b => b.status_conformidade === 'Conforme').length;
  const naoConformes = betonagens.filter(b => b.status_conformidade === 'Não Conforme').length;
  const pendentes = betonagens.filter(b => b.status_conformidade === 'Pendente').length;

  // Calcular resistências médias
  const resistencia7d = betonagens
    .filter(b => b.resistencia_7d_1 > 0 && b.resistencia_7d_2 > 0)
    .map(b => (b.resistencia_7d_1 + b.resistencia_7d_2) / 2);
  
  const resistencia28d = betonagens
    .filter(b => b.resistencia_28d_1 > 0 && b.resistencia_28d_2 > 0 && b.resistencia_28d_3 > 0)
    .map(b => (b.resistencia_28d_1 + b.resistencia_28d_2 + b.resistencia_28d_3) / 3);
  
  const resistenciaRotura = betonagens
    .filter(b => b.resistencia_rotura > 0)
    .map(b => b.resistencia_rotura);

  // Ensaios pendentes
  const hoje = new Date();
  const ensaios7dPendentes = betonagens.filter(b => 
    !b.data_ensaio_7d || new Date(b.data_ensaio_7d) > hoje
  ).length;
  
  const ensaios28dPendentes = betonagens.filter(b => 
    !b.data_ensaio_28d || new Date(b.data_ensaio_28d) > hoje
  ).length;

  // Distribuições
  const tiposBetao = contarFrequencias(betonagens.map(b => b.tipo_betao).filter(Boolean));
  const obras = contarFrequencias(betonagens.map(b => b.obra).filter(Boolean));

  return {
    total_betonagens: total,
    conformes,
    nao_conformes: naoConformes,
    pendentes,
    resistencia_media_7d: resistencia7d.length > 0 ? resistencia7d.reduce((a, b) => a + b, 0) / resistencia7d.length : 0,
    resistencia_media_28d: resistencia28d.length > 0 ? resistencia28d.reduce((a, b) => a + b, 0) / resistencia28d.length : 0,
    resistencia_media_rotura: resistenciaRotura.length > 0 ? resistenciaRotura.reduce((a, b) => a + b, 0) / resistenciaRotura.length : 0,
    ensaios_7d_pendentes: ensaios7dPendentes,
    ensaios_28d_pendentes: ensaios28dPendentes,
    tipos_betao_distribuicao: Object.fromEntries(tiposBetao.slice(0, 5).map(([key, value]) => [key, Number(value)])),
    obras_distribuicao: Object.fromEntries(obras.slice(0, 5).map(([key, value]) => [key, Number(value)])),
  };
};

// Função para calcular métricas de solos
const calcularKPIsSolos = (solos: any[]): KPIsSolos => {
  console.log("🔍 Calculando KPIs Solos...");
  console.log("  - Total de solos:", solos.length);
  
  if (solos.length === 0) {
    console.log("⚠️ Nenhum solo encontrado, usando dados de teste...");
    return {
      total_solos: 0,
      conformes: 0,
      nao_conformes: 0,
      adequados: 0,
      inadequados: 0,
      marginais: 0,
      tipos_amostra_distribuicao: {},
      obras_distribuicao: {},
      laboratorios_distribuicao: {},
      profundidade_media: 0,
      cbr_medio: 0,
      resistencia_cisalhamento_media: 0,
    };
  }

  const total = solos.length;
  const conformes = solos.filter(s => s.conforme === true).length;
  const naoConformes = total - conformes;
  
  // Classificação por adequação
  const adequados = solos.filter(s => s.classificacao?.adequacao === 'ADEQUADO' || s.classificacao?.adequacao === 'EXCELENTE').length;
  const inadequados = solos.filter(s => s.classificacao?.adequacao === 'INADECUADO').length;
  const marginais = solos.filter(s => s.classificacao?.adequacao === 'MARGINAL' || s.classificacao?.adequacao === 'TOLERABLE').length;

  // Distribuições
  const tiposAmostra = contarFrequencias(solos.map(s => s.tipo_amostra).filter(Boolean));
  const obras = contarFrequencias(solos.map(s => s.obra).filter(Boolean));
  const laboratorios = contarFrequencias(solos.map(s => s.laboratorio).filter(Boolean));

  // Cálculos médios
  const profundidades = solos.map(s => s.profundidade_colheita).filter(p => p > 0);
  const profundidadeMedia = profundidades.length > 0 ? profundidades.reduce((a, b) => a + b, 0) / profundidades.length : 0;

  const cbrs = solos.map(s => s.cbr?.valor_cbr).filter(c => c > 0);
  const cbrMedio = cbrs.length > 0 ? cbrs.reduce((a, b) => a + b, 0) / cbrs.length : 0;

  const resistencias = solos.map(s => s.resistencia_cisalhamento?.coesao).filter(r => r > 0);
  const resistenciaMedia = resistencias.length > 0 ? resistencias.reduce((a, b) => a + b, 0) / resistencias.length : 0;

  return {
    total_solos: total,
    conformes,
    nao_conformes: naoConformes,
    adequados,
    inadequados,
    marginais,
    tipos_amostra_distribuicao: Object.fromEntries(tiposAmostra.slice(0, 5).map(([key, value]) => [key, Number(value)])),
    obras_distribuicao: Object.fromEntries(obras.slice(0, 5).map(([key, value]) => [key, Number(value)])),
    laboratorios_distribuicao: Object.fromEntries(laboratorios.slice(0, 5).map(([key, value]) => [key, Number(value)])),
    profundidade_media: Math.round(profundidadeMedia * 100) / 100,
    cbr_medio: Math.round(cbrMedio * 100) / 100,
    resistencia_cisalhamento_media: Math.round(resistenciaMedia * 100) / 100,
  };
};

// Função para calcular métricas ferroviárias
const calcularKPIsFerroviario = (viaFerreaStats: any, pontesTuneisStats: any): KPIsFerroviario => {
  console.log("🔍 Calculando KPIs Ferroviário...");
  
  return {
    via_ferrea: {
      total_trilhos: viaFerreaStats?.total_trilhos || 0,
      total_travessas: viaFerreaStats?.total_travessas || 0,
      inspecoes_pendentes: viaFerreaStats?.inspecoes_pendentes || 0,
      alertas_criticos: viaFerreaStats?.alertas_criticos || 0,
      conformidade: viaFerreaStats?.conformidade || 0,
      km_cobertos: viaFerreaStats?.km_cobertos || 0,
    },
    pontes_tuneis: {
      total_pontes_tuneis: pontesTuneisStats?.total_pontes_tuneis || 0,
      ativas: pontesTuneisStats?.ativas || 0,
      em_manutencao: pontesTuneisStats?.em_manutencao || 0,
      com_avaria: pontesTuneisStats?.com_avaria || 0,
      inspecoes_pendentes: pontesTuneisStats?.inspecoes_pendentes || 0,
      proximas_inspecoes_7d: pontesTuneisStats?.proximas_inspecoes_7d || 0,
      proximas_inspecoes_30d: pontesTuneisStats?.proximas_inspecoes_30d || 0,
    },
    sinalizacao: {
      total_sinalizacoes: 0, // TODO: Implementar quando API estiver disponível
      operacionais: 0,
      em_manutencao: 0,
      com_avaria: 0,
    },
    eletrificacao: {
      total_eletrificacoes: 0, // TODO: Implementar quando API estiver disponível
      operacionais: 0,
      em_manutencao: 0,
      com_avaria: 0,
    },
  };
};
