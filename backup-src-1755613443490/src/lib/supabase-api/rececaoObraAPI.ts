import { 
  RececaoObra, 
  Garantia, 
  Defeito, 
  ManutencaoPreventiva, 
  Seguro, 
  Sinistro, 
  PunchList,
  EstatisticasRececao,
  FiltrosRececao 
} from '../../types/rececaoObra';

export const rececaoObraAPI = {
  // RECEÇÃO DE OBRA
  async getRececoes(): Promise<RececaoObra[]> {
    // Mock data para demonstração
    return [
      {
        id: '1',
        obra_id: 'obra-1',
        codigo: 'REC-2024-001',
        data_rececao: '2024-01-15',
        status: 'concluida',
        tipo_rececao: 'definitiva',
        responsavel_rececao: 'Eng. João Silva',
        coordenador_seguranca: 'Eng. Maria Santos',
        diretor_obra: 'Eng. Pedro Costa',
        fiscal_obra: 'Eng. Ana Ferreira',
        observacoes: 'Receção concluída com sucesso',
        reservas: ['Verificar acabamentos'],
        documentos_anexos: [],
        created_at: '2024-01-15T10:00:00Z',
        updated_at: '2024-01-15T10:00:00Z'
      },
      {
        id: '2',
        obra_id: 'obra-2',
        codigo: 'REC-2024-002',
        data_rececao: '2024-02-20',
        status: 'em_curso',
        tipo_rececao: 'provisoria',
        responsavel_rececao: 'Eng. Carlos Lima',
        coordenador_seguranca: 'Eng. Sofia Martins',
        diretor_obra: 'Eng. Ricardo Alves',
        fiscal_obra: 'Eng. Luísa Pereira',
        observacoes: 'Receção em andamento',
        reservas: [],
        documentos_anexos: [],
        created_at: '2024-02-20T14:30:00Z',
        updated_at: '2024-02-20T14:30:00Z'
      }
    ];
  },

  async getRececao(id: string): Promise<RececaoObra> {
    // Mock data
    return {
      id: '1',
      obra_id: 'obra-1',
      codigo: 'REC-2024-001',
      data_rececao: '2024-01-15',
      status: 'concluida',
      tipo_rececao: 'definitiva',
      responsavel_rececao: 'Eng. João Silva',
      coordenador_seguranca: 'Eng. Maria Santos',
      diretor_obra: 'Eng. Pedro Costa',
      fiscal_obra: 'Eng. Ana Ferreira',
      observacoes: 'Receção concluída com sucesso',
      reservas: ['Verificar acabamentos'],
      documentos_anexos: [],
      created_at: '2024-01-15T10:00:00Z',
      updated_at: '2024-01-15T10:00:00Z'
    };
  },

  async createRececao(rececao: Partial<RececaoObra>): Promise<RececaoObra> {
    // Mock create
    return {
      id: '3',
      obra_id: rececao.obra_id || 'obra-3',
      codigo: rececao.codigo || 'REC-2024-003',
      data_rececao: rececao.data_rececao || '2024-03-01',
      status: rececao.status || 'pendente',
      tipo_rececao: rececao.tipo_rececao || 'provisoria',
      responsavel_rececao: rececao.responsavel_rececao || 'Eng. Teste',
      coordenador_seguranca: rececao.coordenador_seguranca || 'Eng. Teste',
      diretor_obra: rececao.diretor_obra || 'Eng. Teste',
      fiscal_obra: rececao.fiscal_obra || 'Eng. Teste',
      observacoes: rececao.observacoes || '',
      reservas: rececao.reservas || [],
      documentos_anexos: rececao.documentos_anexos || [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
  },

  async updateRececao(id: string, rececao: Partial<RececaoObra>): Promise<RececaoObra> {
    // Mock update
    return {
      id,
      obra_id: rececao.obra_id || 'obra-1',
      codigo: rececao.codigo || 'REC-2024-001',
      data_rececao: rececao.data_rececao || '2024-01-15',
      status: rececao.status || 'concluida',
      tipo_rececao: rececao.tipo_rececao || 'definitiva',
      responsavel_rececao: rececao.responsavel_rececao || 'Eng. João Silva',
      coordenador_seguranca: rececao.coordenador_seguranca || 'Eng. Maria Santos',
      diretor_obra: rececao.diretor_obra || 'Eng. Pedro Costa',
      fiscal_obra: rececao.fiscal_obra || 'Eng. Ana Ferreira',
      observacoes: rececao.observacoes || '',
      reservas: rececao.reservas || [],
      documentos_anexos: rececao.documentos_anexos || [],
      created_at: '2024-01-15T10:00:00Z',
      updated_at: new Date().toISOString()
    };
  },

  async deleteRececao(id: string): Promise<void> {
    // Mock delete
    console.log('Deleting rececao:', id);
  },

  // GARANTIAS
  async getGarantias(rececaoId?: string): Promise<Garantia[]> {
    // Mock data
    return [
      {
        id: '1',
        rececao_id: '1',
        tipo_garantia: '10_anos',
        descricao: 'Garantia estrutural 10 anos',
        data_inicio: '2024-01-15',
        data_fim: '2034-01-15',
        valor_garantia: 500000,
        seguradora: 'Seguros Portugal',
        apolice: 'AP-2024-001',
        status: 'ativa',
        cobertura: 'Estrutura, fundações e elementos estruturais',
        observacoes: 'Garantia válida',
        created_at: '2024-01-15T10:00:00Z',
        updated_at: '2024-01-15T10:00:00Z'
      },
      {
        id: '2',
        rececao_id: '1',
        tipo_garantia: '2_anos',
        descricao: 'Garantia acabamentos 2 anos',
        data_inicio: '2024-01-15',
        data_fim: '2026-01-15',
        valor_garantia: 100000,
        seguradora: 'Seguros Europa',
        apolice: 'AP-2024-002',
        status: 'ativa',
        cobertura: 'Acabamentos, pinturas e revestimentos',
        observacoes: 'Garantia válida',
        created_at: '2024-01-15T10:00:00Z',
        updated_at: '2024-01-15T10:00:00Z'
      }
    ];
  },

  async createGarantia(garantia: Partial<Garantia>): Promise<Garantia> {
    // Mock create
    return {
      id: '3',
      rececao_id: garantia.rececao_id || '1',
      tipo_garantia: garantia.tipo_garantia || '5_anos',
      descricao: garantia.descricao || 'Nova garantia',
      data_inicio: garantia.data_inicio || '2024-03-01',
      data_fim: garantia.data_fim || '2029-03-01',
      valor_garantia: garantia.valor_garantia || 250000,
      seguradora: garantia.seguradora || 'Seguros Teste',
      apolice: garantia.apolice || 'AP-2024-003',
      status: garantia.status || 'ativa',
      cobertura: garantia.cobertura || 'Cobertura padrão',
      observacoes: garantia.observacoes || '',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
  },

  async updateGarantia(id: string, garantia: Partial<Garantia>): Promise<Garantia> {
    // Mock update
    return {
      id,
      rececao_id: garantia.rececao_id || '1',
      tipo_garantia: garantia.tipo_garantia || '10_anos',
      descricao: garantia.descricao || 'Garantia estrutural 10 anos',
      data_inicio: garantia.data_inicio || '2024-01-15',
      data_fim: garantia.data_fim || '2034-01-15',
      valor_garantia: garantia.valor_garantia || 500000,
      seguradora: garantia.seguradora || 'Seguros Portugal',
      apolice: garantia.apolice || 'AP-2024-001',
      status: garantia.status || 'ativa',
      cobertura: garantia.cobertura || 'Estrutura, fundações e elementos estruturais',
      observacoes: garantia.observacoes || '',
      created_at: '2024-01-15T10:00:00Z',
      updated_at: new Date().toISOString()
    };
  },

  async deleteGarantia(id: string): Promise<void> {
    // Mock delete
    console.log('Deleting garantia:', id);
  },

  // DEFEITOS
  async getDefeitos(garantiaId?: string): Promise<Defeito[]> {
    // Mock data
    return [
      {
        id: '1',
        garantia_id: '1',
        titulo: 'Fissura na parede',
        descricao: 'Fissura vertical na parede do piso térreo',
        localizacao: 'Parede norte, piso térreo',
        severidade: 'media',
        status: 'em_correcao',
        data_reportado: '2024-02-01',
        data_correcao: '2024-02-15',
        responsavel_correcao: 'Eng. Correções',
        custo_correcao: 5000,
        observacoes: 'Em processo de correção',
        fotos: [],
        created_at: '2024-02-01T10:00:00Z',
        updated_at: '2024-02-15T10:00:00Z'
      },
      {
        id: '2',
        garantia_id: '2',
        titulo: 'Pintura descascada',
        descricao: 'Pintura descascada no teto da sala',
        localizacao: 'Teto da sala principal',
        severidade: 'baixa',
        status: 'reportado',
        data_reportado: '2024-02-10',
        responsavel_correcao: 'Eng. Acabamentos',
        custo_correcao: 1500,
        observacoes: 'Aguardando análise',
        fotos: [],
        created_at: '2024-02-10T10:00:00Z',
        updated_at: '2024-02-10T10:00:00Z'
      }
    ];
  },

  async createDefeito(defeito: Partial<Defeito>): Promise<Defeito> {
    // Mock create
    return {
      id: '3',
      garantia_id: defeito.garantia_id || '1',
      titulo: defeito.titulo || 'Novo defeito',
      descricao: defeito.descricao || 'Descrição do defeito',
      localizacao: defeito.localizacao || 'Localização não especificada',
      severidade: defeito.severidade || 'baixa',
      status: defeito.status || 'reportado',
      data_reportado: defeito.data_reportado || new Date().toISOString().split('T')[0],
      responsavel_correcao: defeito.responsavel_correcao || 'Eng. Responsável',
      custo_correcao: defeito.custo_correcao || 0,
      observacoes: defeito.observacoes || '',
      fotos: defeito.fotos || [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
  },

  async updateDefeito(id: string, defeito: Partial<Defeito>): Promise<Defeito> {
    // Mock update
    return {
      id,
      garantia_id: defeito.garantia_id || '1',
      titulo: defeito.titulo || 'Fissura na parede',
      descricao: defeito.descricao || 'Fissura vertical na parede do piso térreo',
      localizacao: defeito.localizacao || 'Parede norte, piso térreo',
      severidade: defeito.severidade || 'media',
      status: defeito.status || 'em_correcao',
      data_reportado: defeito.data_reportado || '2024-02-01',
      responsavel_correcao: defeito.responsavel_correcao || 'Eng. Correções',
      custo_correcao: defeito.custo_correcao || 5000,
      observacoes: defeito.observacoes || '',
      fotos: defeito.fotos || [],
      created_at: '2024-02-01T10:00:00Z',
      updated_at: new Date().toISOString()
    };
  },

  async deleteDefeito(id: string): Promise<void> {
    // Mock delete
    console.log('Deleting defeito:', id);
  },

  // MANUTENÇÃO PREVENTIVA
  async getManutencoes(garantiaId?: string): Promise<ManutencaoPreventiva[]> {
    // Mock data
    return [
      {
        id: '1',
        garantia_id: '1',
        titulo: 'Inspeção estrutural anual',
        descricao: 'Inspeção anual da estrutura do edifício',
        tipo: 'preventiva',
        frequencia: 'anual',
        proxima_manutencao: '2025-01-15',
        ultima_manutencao: '2024-01-15',
        responsavel: 'Eng. Manutenção',
        custo_estimado: 2000,
        status: 'agendada',
        observacoes: 'Manutenção preventiva programada',
        created_at: '2024-01-15T10:00:00Z',
        updated_at: '2024-01-15T10:00:00Z'
      }
    ];
  },

  async createManutencao(manutencao: Partial<ManutencaoPreventiva>): Promise<ManutencaoPreventiva> {
    // Mock create
    return {
      id: '2',
      garantia_id: manutencao.garantia_id || '1',
      titulo: manutencao.titulo || 'Nova manutenção',
      descricao: manutencao.descricao || 'Descrição da manutenção',
      tipo: manutencao.tipo || 'preventiva',
      frequencia: manutencao.frequencia || 'mensal',
      proxima_manutencao: manutencao.proxima_manutencao || '2024-04-01',
      responsavel: manutencao.responsavel || 'Eng. Responsável',
      custo_estimado: manutencao.custo_estimado || 1000,
      status: manutencao.status || 'agendada',
      observacoes: manutencao.observacoes || '',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
  },

  async updateManutencao(id: string, manutencao: Partial<ManutencaoPreventiva>): Promise<ManutencaoPreventiva> {
    // Mock update
    return {
      id,
      garantia_id: manutencao.garantia_id || '1',
      titulo: manutencao.titulo || 'Inspeção estrutural anual',
      descricao: manutencao.descricao || 'Inspeção anual da estrutura do edifício',
      tipo: manutencao.tipo || 'preventiva',
      frequencia: manutencao.frequencia || 'anual',
      proxima_manutencao: manutencao.proxima_manutencao || '2025-01-15',
      responsavel: manutencao.responsavel || 'Eng. Manutenção',
      custo_estimado: manutencao.custo_estimado || 2000,
      status: manutencao.status || 'agendada',
      observacoes: manutencao.observacoes || '',
      created_at: '2024-01-15T10:00:00Z',
      updated_at: new Date().toISOString()
    };
  },

  async deleteManutencao(id: string): Promise<void> {
    // Mock delete
    console.log('Deleting manutencao:', id);
  },

  // SEGUROS
  async getSeguros(garantiaId?: string): Promise<Seguro[]> {
    // Mock data
    return [
      {
        id: '1',
        garantia_id: '1',
        tipo_seguro: 'garantia',
        seguradora: 'Seguros Portugal',
        apolice: 'AP-2024-001',
        data_inicio: '2024-01-15',
        data_fim: '2034-01-15',
        valor_segurado: 500000,
        premio: 5000,
        cobertura: 'Estrutura, fundações e elementos estruturais',
        exclusoes: ['Danos por negligência'],
        status: 'ativa',
        observacoes: 'Seguro ativo',
        created_at: '2024-01-15T10:00:00Z',
        updated_at: '2024-01-15T10:00:00Z'
      }
    ];
  },

  async createSeguro(seguro: Partial<Seguro>): Promise<Seguro> {
    // Mock create
    return {
      id: '2',
      garantia_id: seguro.garantia_id || '1',
      tipo_seguro: seguro.tipo_seguro || 'garantia',
      seguradora: seguro.seguradora || 'Seguros Teste',
      apolice: seguro.apolice || 'AP-2024-002',
      data_inicio: seguro.data_inicio || '2024-03-01',
      data_fim: seguro.data_fim || '2029-03-01',
      valor_segurado: seguro.valor_segurado || 250000,
      premio: seguro.premio || 2500,
      cobertura: seguro.cobertura || 'Cobertura padrão',
      exclusoes: seguro.exclusoes || [],
      status: seguro.status || 'ativa',
      observacoes: seguro.observacoes || '',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
  },

  async updateSeguro(id: string, seguro: Partial<Seguro>): Promise<Seguro> {
    // Mock update
    return {
      id,
      garantia_id: seguro.garantia_id || '1',
      tipo_seguro: seguro.tipo_seguro || 'garantia',
      seguradora: seguro.seguradora || 'Seguros Portugal',
      apolice: seguro.apolice || 'AP-2024-001',
      data_inicio: seguro.data_inicio || '2024-01-15',
      data_fim: seguro.data_fim || '2034-01-15',
      valor_segurado: seguro.valor_segurado || 500000,
      premio: seguro.premio || 5000,
      cobertura: seguro.cobertura || 'Estrutura, fundações e elementos estruturais',
      exclusoes: seguro.exclusoes || ['Danos por negligência'],
      status: seguro.status || 'ativa',
      observacoes: seguro.observacoes || '',
      created_at: '2024-01-15T10:00:00Z',
      updated_at: new Date().toISOString()
    };
  },

  async deleteSeguro(id: string): Promise<void> {
    // Mock delete
    console.log('Deleting seguro:', id);
  },

  // SINISTROS
  async getSinistros(seguroId?: string): Promise<Sinistro[]> {
    // Mock data
    return [
      {
        id: '1',
        seguro_id: '1',
        titulo: 'Danos por infiltração',
        descricao: 'Infiltração de água causou danos na parede',
        data_ocorrencia: '2024-02-01',
        data_reportado: '2024-02-02',
        valor_sinistro: 15000,
        valor_indemnizacao: 12000,
        status: 'pago',
        observacoes: 'Sinistro liquidado',
        documentos: [],
        created_at: '2024-02-02T10:00:00Z',
        updated_at: '2024-02-15T10:00:00Z'
      }
    ];
  },

  async createSinistro(sinistro: Partial<Sinistro>): Promise<Sinistro> {
    // Mock create
    return {
      id: '2',
      seguro_id: sinistro.seguro_id || '1',
      titulo: sinistro.titulo || 'Novo sinistro',
      descricao: sinistro.descricao || 'Descrição do sinistro',
      data_ocorrencia: sinistro.data_ocorrencia || new Date().toISOString().split('T')[0],
      data_reportado: sinistro.data_reportado || new Date().toISOString().split('T')[0],
      valor_sinistro: sinistro.valor_sinistro || 0,
      status: sinistro.status || 'reportado',
      observacoes: sinistro.observacoes || '',
      documentos: sinistro.documentos || [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
  },

  async updateSinistro(id: string, sinistro: Partial<Sinistro>): Promise<Sinistro> {
    // Mock update
    return {
      id,
      seguro_id: sinistro.seguro_id || '1',
      titulo: sinistro.titulo || 'Danos por infiltração',
      descricao: sinistro.descricao || 'Infiltração de água causou danos na parede',
      data_ocorrencia: sinistro.data_ocorrencia || '2024-02-01',
      data_reportado: sinistro.data_reportado || '2024-02-02',
      valor_sinistro: sinistro.valor_sinistro || 15000,
      status: sinistro.status || 'pago',
      observacoes: sinistro.observacoes || '',
      documentos: sinistro.documentos || [],
      created_at: '2024-02-02T10:00:00Z',
      updated_at: new Date().toISOString()
    };
  },

  async deleteSinistro(id: string): Promise<void> {
    // Mock delete
    console.log('Deleting sinistro:', id);
  },

  // PUNCH LIST
  async getPunchLists(rececaoId?: string): Promise<PunchList[]> {
    // Mock data
    return [
      {
        id: '1',
        rececao_id: '1',
        titulo: 'Acabamento da porta',
        descricao: 'Acabamento da porta da entrada principal',
        localizacao: 'Entrada principal',
        categoria: 'acabamentos',
        prioridade: 'alta',
        responsavel: 'Eng. Acabamentos',
        data_limite: '2024-03-15',
        status: 'pendente',
        observacoes: 'Aguardando correção',
        fotos: [],
        created_at: '2024-02-01T10:00:00Z',
        updated_at: '2024-02-01T10:00:00Z'
      },
      {
        id: '2',
        rececao_id: '1',
        titulo: 'Instalação elétrica',
        descricao: 'Verificação da instalação elétrica',
        localizacao: 'Sala principal',
        categoria: 'instalacoes',
        prioridade: 'media',
        responsavel: 'Eng. Elétrico',
        data_limite: '2024-03-20',
        status: 'em_curso',
        observacoes: 'Em processo de verificação',
        fotos: [],
        created_at: '2024-02-05T10:00:00Z',
        updated_at: '2024-02-10T10:00:00Z'
      }
    ];
  },

  async createPunchList(punchList: Partial<PunchList>): Promise<PunchList> {
    // Mock create
    return {
      id: '3',
      rececao_id: punchList.rececao_id || '1',
      titulo: punchList.titulo || 'Novo item punch list',
      descricao: punchList.descricao || 'Descrição do item',
      localizacao: punchList.localizacao || 'Localização não especificada',
      categoria: punchList.categoria || 'outros',
      prioridade: punchList.prioridade || 'baixa',
      responsavel: punchList.responsavel || 'Eng. Responsável',
      data_limite: punchList.data_limite || '2024-04-01',
      status: punchList.status || 'pendente',
      observacoes: punchList.observacoes || '',
      fotos: punchList.fotos || [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
  },

  async updatePunchList(id: string, punchList: Partial<PunchList>): Promise<PunchList> {
    // Mock update
    return {
      id,
      rececao_id: punchList.rececao_id || '1',
      titulo: punchList.titulo || 'Acabamento da porta',
      descricao: punchList.descricao || 'Acabamento da porta da entrada principal',
      localizacao: punchList.localizacao || 'Entrada principal',
      categoria: punchList.categoria || 'acabamentos',
      prioridade: punchList.prioridade || 'alta',
      responsavel: punchList.responsavel || 'Eng. Acabamentos',
      data_limite: punchList.data_limite || '2024-03-15',
      status: punchList.status || 'pendente',
      observacoes: punchList.observacoes || '',
      fotos: punchList.fotos || [],
      created_at: '2024-02-01T10:00:00Z',
      updated_at: new Date().toISOString()
    };
  },

  async deletePunchList(id: string): Promise<void> {
    // Mock delete
    console.log('Deleting punch list:', id);
  },

  // ESTATÍSTICAS
  async getEstatisticas(): Promise<EstatisticasRececao> {
    // Mock data para demonstração
    return {
      total_rececoes: 15,
      rececoes_concluidas: 12,
      rececoes_com_reservas: 3,
      garantias_ativas: 45,
      garantias_a_expirar: 8,
      defeitos_abertos: 23,
      manutencoes_pendentes: 17,
      sinistros_ativos: 5,
      valor_total_garantias: 2500000,
      custo_total_defeitos: 125000,
      por_status: [
        { status: 'concluida', quantidade: 12 },
        { status: 'em_curso', quantidade: 2 },
        { status: 'com_reservas', quantidade: 1 }
      ],
      por_tipo_garantia: [
        { tipo: '10_anos', quantidade: 25 },
        { tipo: '2_anos', quantidade: 15 },
        { tipo: '5_anos', quantidade: 5 }
      ],
      por_severidade_defeitos: [
        { severidade: 'baixa', quantidade: 12 },
        { severidade: 'media', quantidade: 8 },
        { severidade: 'alta', quantidade: 3 }
      ],
      por_categoria_punchlist: [
        { categoria: 'acabamentos', quantidade: 15 },
        { categoria: 'instalacoes', quantidade: 8 },
        { categoria: 'estrutura', quantidade: 5 }
      ]
    };
  },

  // FILTROS
  async filtrarRececoes(filtros: FiltrosRececao): Promise<RececaoObra[]> {
    // Mock filter - return all rececoes for now
    return [
      {
        id: '1',
        obra_id: 'obra-1',
        codigo: 'REC-2024-001',
        data_rececao: '2024-01-15',
        status: 'concluida',
        tipo_rececao: 'definitiva',
        responsavel_rececao: 'Eng. João Silva',
        coordenador_seguranca: 'Eng. Maria Santos',
        diretor_obra: 'Eng. Pedro Costa',
        fiscal_obra: 'Eng. Ana Ferreira',
        observacoes: 'Receção concluída com sucesso',
        reservas: ['Verificar acabamentos'],
        documentos_anexos: [],
        created_at: '2024-01-15T10:00:00Z',
        updated_at: '2024-01-15T10:00:00Z'
      }
    ];
  },

  // EXPORTAÇÃO
  async exportarRececao(id: string, formato: 'pdf' | 'excel'): Promise<string> {
    // Simular exportação
    await new Promise(resolve => setTimeout(resolve, 2000));
    return `rececao-obra-${id}-${new Date().toISOString().split('T')[0]}.${formato}`;
  }
};
