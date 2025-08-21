// Sistema de Pesquisa Avançada para Módulo Normas
// Funcionalidades semânticas e filtros técnicos especializados

import { Norma, FiltrosNormas, CategoriaNorma, OrganismoNormativo, StatusNorma, PrioridadeNorma } from '../types/normas';
import { NormasCacheService } from './normas-cache';

interface PesquisaResultado {
  norma: Norma;
  score: number;
  matches: string[];
  highlights: string[];
}

interface PesquisaAvancadaOptions {
  limit?: number;
  includeObsoletas?: boolean;
  priorizarRecentes?: boolean;
  fuzzyMatch?: boolean;
}

interface SugestaoPesquisa {
  termo: string;
  frequencia: number;
  categoria?: string;
  organismo?: string;
}

class NormasPesquisaAvancada {
  private historicoPesquisas: string[] = [];
  private sugestoesCache = new Map<string, SugestaoPesquisa[]>();

  // Pesquisa principal
  async pesquisar(
    query: string, 
    normas: Norma[], 
    filtros: FiltrosNormas = {}, 
    options: PesquisaAvancadaOptions = {}
  ): Promise<PesquisaResultado[]> {
    const {
      limit = 50,
      includeObsoletas = false,
      priorizarRecentes = true,
      fuzzyMatch = true
    } = options;

    // Verificar cache primeiro
    const cacheKey = this.generateCacheKey(query, filtros, options);
    const cached = NormasCacheService.getCachedPesquisa(cacheKey);
    if (cached) {
      return cached;
    }

    // Filtrar normas baseado nos filtros
    let normasFiltradas = this.aplicarFiltros(normas, filtros);

    // Aplicar filtro de obsoletas
    if (!includeObsoletas) {
      normasFiltradas = normasFiltradas.filter(norma => norma.status !== 'OBSOLETA');
    }

    // Realizar pesquisa
    const resultados = this.realizarPesquisa(query, normasFiltradas, fuzzyMatch);

    // Ordenar resultados
    const resultadosOrdenados = this.ordenarResultados(resultados, priorizarRecentes);

    // Limitar resultados
    const resultadosLimitados = resultadosOrdenados.slice(0, limit);

    // Atualizar histórico
    this.atualizarHistorico(query);

    // Cache dos resultados
    NormasCacheService.cachePesquisa(cacheKey, resultadosLimitados);

    return resultadosLimitados;
  }

  // Pesquisa semântica
  private realizarPesquisa(query: string, normas: Norma[], fuzzyMatch: boolean): PesquisaResultado[] {
    const termos = this.tokenizarQuery(query);
    const resultados: PesquisaResultado[] = [];

    for (const norma of normas) {
      const score = this.calcularScore(norma, termos, fuzzyMatch);
      
      if (score > 0) {
        const matches = this.encontrarMatches(norma, termos);
        const highlights = this.gerarHighlights(norma, termos);
        
        resultados.push({
          norma,
          score,
          matches,
          highlights
        });
      }
    }

    return resultados;
  }

  // Cálculo de score semântico
  private calcularScore(norma: Norma, termos: string[], fuzzyMatch: boolean): number {
    let score = 0;
    const textoCompleto = this.normalizarTexto(
      `${norma.codigo} ${norma.titulo} ${norma.descricao} ${norma.categoria} ${norma.subcategoria} ${norma.organismo} ${norma.tags.join(' ')}`
    );

    for (const termo of termos) {
      const termoNormalizado = this.normalizarTexto(termo);
      
      // Pesquisa exata (maior peso)
      if (textoCompleto.includes(termoNormalizado)) {
        score += 10;
        
        // Bônus para matches em campos importantes
        if (norma.codigo.toLowerCase().includes(termoNormalizado)) score += 5;
        if (norma.titulo.toLowerCase().includes(termoNormalizado)) score += 3;
        if (norma.categoria.toLowerCase().includes(termoNormalizado)) score += 2;
      }
      
      // Pesquisa fuzzy (menor peso)
      else if (fuzzyMatch && this.fuzzyMatch(textoCompleto, termoNormalizado)) {
        score += 3;
      }
      
      // Pesquisa por sinônimos técnicos
      const sinonimos = this.obterSinonimosTecnicos(termo);
      for (const sinonimo of sinonimos) {
        if (textoCompleto.includes(sinonimo)) {
          score += 2;
          break;
        }
      }
    }

    // Bônus por prioridade
    if (norma.prioridade === 'CRITICA') score += 5;
    else if (norma.prioridade === 'ALTA') score += 3;
    else if (norma.prioridade === 'MEDIA') score += 1;

    // Bônus por status ativo
    if (norma.status === 'ATIVA') score += 2;

    return score;
  }

  // Filtros técnicos avançados
  private aplicarFiltros(normas: Norma[], filtros: FiltrosNormas): Norma[] {
    return normas.filter(norma => {
      // Filtro por categoria
      if (filtros.categoria && norma.categoria !== filtros.categoria) {
        return false;
      }

      // Filtro por subcategoria
      if (filtros.subcategoria && norma.subcategoria !== filtros.subcategoria) {
        return false;
      }

      // Filtro por organismo
      if (filtros.organismo && norma.organismo !== filtros.organismo) {
        return false;
      }

      // Filtro por status
      if (filtros.status && norma.status !== filtros.status) {
        return false;
      }

      // Filtro por prioridade
      if (filtros.prioridade && norma.prioridade !== filtros.prioridade) {
        return false;
      }

      // Filtro por aplicabilidade
      if (filtros.aplicabilidade && !norma.aplicabilidade.includes(filtros.aplicabilidade)) {
        return false;
      }

      // Filtro por data
      if (filtros.data_inicio) {
        const dataNorma = new Date(norma.data_publicacao);
        const dataInicio = new Date(filtros.data_inicio);
        if (dataNorma < dataInicio) return false;
      }

      if (filtros.data_fim) {
        const dataNorma = new Date(norma.data_publicacao);
        const dataFim = new Date(filtros.data_fim);
        if (dataNorma > dataFim) return false;
      }

      // Filtro por tags
      if (filtros.tags && filtros.tags.length > 0) {
        const temTag = filtros.tags.some(tag => norma.tags.includes(tag));
        if (!temTag) return false;
      }

      // Filtro por texto livre
      if (filtros.texto_livre) {
        const textoCompleto = `${norma.codigo} ${norma.titulo} ${norma.descricao}`.toLowerCase();
        if (!textoCompleto.includes(filtros.texto_livre.toLowerCase())) {
          return false;
        }
      }

      return true;
    });
  }

  // Ordenação inteligente
  private ordenarResultados(resultados: PesquisaResultado[], priorizarRecentes: boolean): PesquisaResultado[] {
    return resultados.sort((a, b) => {
      // Primeiro por score
      if (b.score !== a.score) {
        return b.score - a.score;
      }

      // Depois por data (se priorizarRecentes)
      if (priorizarRecentes) {
        const dataA = new Date(a.norma.data_publicacao);
        const dataB = new Date(b.norma.data_publicacao);
        return dataB.getTime() - dataA.getTime();
      }

      // Por código
      return a.norma.codigo.localeCompare(b.norma.codigo);
    });
  }

  // Sugestões inteligentes
  async gerarSugestoes(query: string, normas: Norma[]): Promise<SugestaoPesquisa[]> {
    const cacheKey = `sugestoes_${query}`;
    const cached = this.sugestoesCache.get(cacheKey);
    if (cached) return cached;

    const sugestoes: SugestaoPesquisa[] = [];
    const termo = query.toLowerCase();

    // Sugestões baseadas em códigos
    const codigos = normas
      .filter(n => n.codigo.toLowerCase().includes(termo))
      .map(n => n.codigo)
      .slice(0, 5);

    // Sugestões baseadas em títulos
    const titulos = normas
      .filter(n => n.titulo.toLowerCase().includes(termo))
      .map(n => n.titulo.split(' ').slice(0, 3).join(' '))
      .slice(0, 5);

    // Sugestões baseadas em categorias
    const categorias = normas
      .filter(n => n.categoria.toLowerCase().includes(termo))
      .map(n => n.categoria)
      .slice(0, 3);

    // Sugestões baseadas em organismos
    const organismos = normas
      .filter(n => n.organismo.toLowerCase().includes(termo))
      .map(n => n.organismo)
      .slice(0, 3);

    // Combinar e ordenar sugestões
    const todasSugestoes = [...codigos, ...titulos, ...categorias, ...organismos];
    const sugestoesUnicas = [...new Set(todasSugestoes)];

    for (const sugestao of sugestoesUnicas) {
      const frequencia = this.calcularFrequencia(sugestao, normas);
      sugestoes.push({
        termo: sugestao,
        frequencia
      });
    }

    // Ordenar por frequência
    sugestoes.sort((a, b) => b.frequencia - a.frequencia);

    // Cache das sugestões
    this.sugestoesCache.set(cacheKey, sugestoes);

    return sugestoes.slice(0, 10);
  }

  // Pesquisa por código específico
  async pesquisarPorCodigo(codigo: string, normas: Norma[]): Promise<Norma | null> {
    const codigoNormalizado = codigo.toUpperCase().trim();
    
    // Pesquisa exata
    const normaExata = normas.find(n => 
      n.codigo.toUpperCase() === codigoNormalizado
    );
    
    if (normaExata) return normaExata;

    // Pesquisa parcial
    const normaParcial = normas.find(n => 
      n.codigo.toUpperCase().includes(codigoNormalizado)
    );

    return normaParcial || null;
  }

  // Pesquisa por aplicabilidade
  async pesquisarPorAplicabilidade(aplicabilidade: string, normas: Norma[]): Promise<Norma[]> {
    return normas.filter(norma => 
      norma.aplicabilidade.some(app => 
        app.toLowerCase().includes(aplicabilidade.toLowerCase())
      )
    );
  }

  // Métodos de utilidade
  private tokenizarQuery(query: string): string[] {
    return query
      .toLowerCase()
      .split(/\s+/)
      .filter(termo => termo.length > 2)
      .map(termo => termo.replace(/[^\w\s]/g, ''));
  }

  private normalizarTexto(texto: string): string {
    return texto
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^\w\s]/g, ' ');
  }

  private fuzzyMatch(texto: string, termo: string): boolean {
    const distancia = this.calcularDistanciaLevenshtein(texto, termo);
    const maxDistancia = Math.max(termo.length * 0.3, 2);
    return distancia <= maxDistancia;
  }

  private calcularDistanciaLevenshtein(str1: string, str2: string): number {
    const matrix = Array(str2.length + 1).fill(null).map(() => Array(str1.length + 1).fill(null));

    for (let i = 0; i <= str1.length; i++) matrix[0][i] = i;
    for (let j = 0; j <= str2.length; j++) matrix[j][0] = j;

    for (let j = 1; j <= str2.length; j++) {
      for (let i = 1; i <= str1.length; i++) {
        const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
        matrix[j][i] = Math.min(
          matrix[j][i - 1] + 1,
          matrix[j - 1][i] + 1,
          matrix[j - 1][i - 1] + indicator
        );
      }
    }

    return matrix[str2.length][str1.length];
  }

  private encontrarMatches(norma: Norma, termos: string[]): string[] {
    const matches: string[] = [];
    const textoCompleto = `${norma.codigo} ${norma.titulo} ${norma.descricao}`.toLowerCase();

    for (const termo of termos) {
      if (textoCompleto.includes(termo)) {
        matches.push(termo);
      }
    }

    return matches;
  }

  private gerarHighlights(norma: Norma, termos: string[]): string[] {
    const highlights: string[] = [];
    const campos = [norma.codigo, norma.titulo, norma.descricao];

    for (const campo of campos) {
      for (const termo of termos) {
        if (campo.toLowerCase().includes(termo)) {
          highlights.push(campo);
          break;
        }
      }
    }

    return highlights;
  }

  private obterSinonimosTecnicos(termo: string): string[] {
    const sinonimos: Record<string, string[]> = {
      'betão': ['concreto', 'concrete', 'cimento'],
      'aço': ['steel', 'ferro', 'metal'],
      'solo': ['soil', 'terra', 'geotecnia'],
      'fundação': ['foundation', 'base', 'alicerce'],
      'estrutura': ['structure', 'construção', 'edifício'],
      'pavimento': ['pavement', 'piso', 'superfície'],
      'segurança': ['safety', 'proteção', 'prevenção'],
      'qualidade': ['quality', 'controlo', 'verificação']
    };

    return sinonimos[termo] || [];
  }

  private calcularFrequencia(termo: string, normas: Norma[]): number {
    return normas.filter(norma => 
      `${norma.codigo} ${norma.titulo} ${norma.descricao}`.toLowerCase().includes(termo.toLowerCase())
    ).length;
  }

  private atualizarHistorico(query: string): void {
    if (query.trim()) {
      this.historicoPesquisas.unshift(query);
      this.historicoPesquisas = this.historicoPesquisas.slice(0, 10);
    }
  }

  private generateCacheKey(query: string, filtros: FiltrosNormas, options: PesquisaAvancadaOptions): string {
    return btoa(`${query}_${JSON.stringify(filtros)}_${JSON.stringify(options)}`).replace(/[^a-zA-Z0-9]/g, '');
  }

  // Métodos públicos adicionais
  getHistoricoPesquisas(): string[] {
    return [...this.historicoPesquisas];
  }

  limparCache(): void {
    this.sugestoesCache.clear();
    NormasCacheService.invalidatePesquisa();
  }
}

// Instância global
export const normasPesquisaAvancada = new NormasPesquisaAvancada();

// Serviços de pesquisa para Normas
export const NormasPesquisaService = {
  // Pesquisa principal
  pesquisar: (query: string, normas: Norma[], filtros?: FiltrosNormas, options?: PesquisaAvancadaOptions) =>
    normasPesquisaAvancada.pesquisar(query, normas, filtros, options),

  // Pesquisa por código
  pesquisarPorCodigo: (codigo: string, normas: Norma[]) =>
    normasPesquisaAvancada.pesquisarPorCodigo(codigo, normas),

  // Pesquisa por aplicabilidade
  pesquisarPorAplicabilidade: (aplicabilidade: string, normas: Norma[]) =>
    normasPesquisaAvancada.pesquisarPorAplicabilidade(aplicabilidade, normas),

  // Sugestões
  gerarSugestoes: (query: string, normas: Norma[]) =>
    normasPesquisaAvancada.gerarSugestoes(query, normas),

  // Histórico
  getHistorico: () => normasPesquisaAvancada.getHistoricoPesquisas(),

  // Cache
  limparCache: () => normasPesquisaAvancada.limparCache()
};
