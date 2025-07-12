// Sistema de armazenamento local como fallback quando PocketBase não está disponível

export interface LocalStorageData {
  ensaios: any[]
  documentos: any[]
  checklists: any[]
  materiais: any[]
  fornecedores: any[]
  nao_conformidades: any[]
  rfis: any[]
}

const STORAGE_KEY = 'qualicore_data'

// Inicializar dados padrão
const defaultData: LocalStorageData = {
  ensaios: [
    {
      id: '1',
      codigo: 'ENS-001',
      tipo: 'resistencia',
      material_id: '1',
      resultado: 'Conforme',
      valor_obtido: 35.2,
      valor_esperado: 30.0,
      unidade: 'MPa',
      laboratorio: 'LabTec',
      data_ensaio: '2024-01-18',
      conforme: true,
      responsavel: 'João Silva',
      zona: 'Zona A - Fundações',
      estado: 'aprovado',
      observacoes: 'Ensaio de resistência à compressão',
      created: new Date().toISOString(),
      updated: new Date().toISOString()
    }
  ],
  documentos: [
    {
      id: '1',
      codigo: 'DOC-001',
      tipo: 'projeto',
      versao: '1.0',
      data_validade: '2024-12-31',
      fornecedor_id: '1',
      responsavel: 'João Silva',
      zona: 'Zona A - Fundações',
      estado: 'aprovado',
      observacoes: 'Documento de projeto estrutural aprovado',
      created: new Date().toISOString(),
      updated: new Date().toISOString()
    }
  ],
  checklists: [
    {
      id: '1',
      codigo: 'CHK-001',
      tipo: 'inspecao',
      itens: [
        { item: 'Verificar equipamentos de segurança', obrigatorio: true },
        { item: 'Inspecionar qualidade do betão', obrigatorio: true },
        { item: 'Verificar limpeza do local', obrigatorio: false }
      ],
      percentual_conformidade: 95,
      data_inspecao: '2024-01-20',
      inspetor: 'Carlos Oliveira',
      responsavel: 'João Silva',
      zona: 'Zona A - Fundações',
      estado: 'aprovado',
      observacoes: 'Inspeção diária de obra',
      created: new Date().toISOString(),
      updated: new Date().toISOString()
    }
  ],
  materiais: [
    {
      id: '1',
      codigo: 'MAT-001',
      nome: 'Cimento CEM I 42.5R',
      tipo: 'cimento',
      fornecedor_id: '1',
      certificado_id: 'CERT-001',
      data_rececao: '2024-01-10',
      quantidade: 50,
      unidade: 'toneladas',
      lote: 'LOT-2024-001',
      responsavel: 'João Silva',
      zona: 'Armazém Central',
      estado: 'aprovado',
      observacoes: 'Material conforme especificações',
      created: new Date().toISOString(),
      updated: new Date().toISOString()
    }
  ],
  fornecedores: [
    {
      id: '1',
      nome: 'Cimentos de Portugal',
      nif: '500123456',
      morada: 'Rua das Indústrias, 123, Lisboa',
      telefone: '213456789',
      email: 'contacto@cimpor.pt',
      contacto: 'Eng. António Costa',
      estado: 'ativo',
      created: new Date().toISOString(),
      updated: new Date().toISOString()
    }
  ],
  nao_conformidades: [
    {
      id: '1',
      codigo: 'NC-001',
      tipo: 'material',
      severidade: 'media',
      data_deteccao: '2024-01-15',
      data_resolucao: '2024-01-18',
      acao_corretiva: 'Material substituído por lote conforme',
      responsavel_resolucao: 'João Silva',
      custo_estimado: 2500,
      relacionado_ensaio_id: '1',
      relacionado_material_id: '1',
      responsavel: 'João Silva',
      zona: 'Zona A - Fundações',
      estado: 'resolvido',
      observacoes: 'Não conformidade resolvida com sucesso',
      created: new Date().toISOString(),
      updated: new Date().toISOString()
    }
  ],
  rfis: [
    {
      id: '1',
      numero: 'RFI-2024-001',
      titulo: 'Dúvida sobre especificação de betão',
      descricao: 'Qual a resistência mínima exigida para o betão da laje?',
      solicitante: 'João Silva',
      destinatario: 'Eng. Responsável',
      data_solicitacao: '2024-01-15',
      prioridade: 'alta',
      status: 'pendente',
      impacto_custo: 0,
      impacto_prazo: 0,
      observacoes: 'Pendente de resposta técnica',
      created: new Date().toISOString(),
      updated: new Date().toISOString()
    }
  ]
}

// Funções para gerir dados locais
export const getLocalData = (): LocalStorageData => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      return JSON.parse(stored)
    }
    // Se não existir, inicializar com dados padrão
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultData))
    return defaultData
  } catch (error) {
    console.error('Erro ao carregar dados locais:', error)
    return defaultData
  }
}

export const saveLocalData = (data: LocalStorageData): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch (error) {
    console.error('Erro ao salvar dados locais:', error)
  }
}

export const updateLocalCollection = <T>(
  collection: keyof LocalStorageData,
  data: T[],
  id: string,
  updates: Partial<T>
): T[] => {
  return data.map(item => 
    (item as any).id === id 
      ? { ...item, ...updates, updated: new Date().toISOString() }
      : item
  )
}

export const addToLocalCollection = <T>(
  collection: keyof LocalStorageData,
  data: T[],
  newItem: T
): T[] => {
  const itemWithId = {
    ...newItem,
    id: Date.now().toString(),
    created: new Date().toISOString(),
    updated: new Date().toISOString()
  }
  return [...data, itemWithId]
}

export const removeFromLocalCollection = <T>(
  collection: keyof LocalStorageData,
  data: T[],
  id: string
): T[] => {
  return data.filter(item => (item as any).id !== id)
}

// API local para ensaios
export const localEnsaiosAPI = {
  getAll: async (): Promise<any[]> => {
    const data = getLocalData()
    return data.ensaios
  },
  
  getById: async (id: string): Promise<any | null> => {
    const data = getLocalData()
    return data.ensaios.find(e => e.id === id) || null
  },
  
  create: async (newEnsaio: any): Promise<any | null> => {
    const data = getLocalData()
    const updatedEnsaios = addToLocalCollection('ensaios', data.ensaios, newEnsaio)
    const newData = { ...data, ensaios: updatedEnsaios }
    saveLocalData(newData)
    return updatedEnsaios[updatedEnsaios.length - 1]
  },
  
  update: async (id: string, updates: any): Promise<any | null> => {
    const data = getLocalData()
    const updatedEnsaios = updateLocalCollection('ensaios', data.ensaios, id, updates)
    const newData = { ...data, ensaios: updatedEnsaios }
    saveLocalData(newData)
    return updatedEnsaios.find(e => e.id === id) || null
  },
  
  delete: async (id: string): Promise<boolean> => {
    const data = getLocalData()
    const updatedEnsaios = removeFromLocalCollection('ensaios', data.ensaios, id)
    const newData = { ...data, ensaios: updatedEnsaios }
    saveLocalData(newData)
    return true
  }
}

// API local para documentos
export const localDocumentosAPI = {
  getAll: async (): Promise<any[]> => {
    const data = getLocalData()
    return data.documentos
  },
  
  getById: async (id: string): Promise<any | null> => {
    const data = getLocalData()
    return data.documentos.find(d => d.id === id) || null
  },
  
  create: async (newDocumento: any): Promise<any | null> => {
    const data = getLocalData()
    const updatedDocumentos = addToLocalCollection('documentos', data.documentos, newDocumento)
    const newData = { ...data, documentos: updatedDocumentos }
    saveLocalData(newData)
    return updatedDocumentos[updatedDocumentos.length - 1]
  },
  
  update: async (id: string, updates: any): Promise<any | null> => {
    const data = getLocalData()
    const updatedDocumentos = updateLocalCollection('documentos', data.documentos, id, updates)
    const newData = { ...data, documentos: updatedDocumentos }
    saveLocalData(newData)
    return updatedDocumentos.find(d => d.id === id) || null
  },
  
  delete: async (id: string): Promise<boolean> => {
    const data = getLocalData()
    const updatedDocumentos = removeFromLocalCollection('documentos', data.documentos, id)
    const newData = { ...data, documentos: updatedDocumentos }
    saveLocalData(newData)
    return true
  }
}

// API local para checklists
export const localChecklistsAPI = {
  getAll: async (): Promise<any[]> => {
    const data = getLocalData()
    return data.checklists
  },
  
  getById: async (id: string): Promise<any | null> => {
    const data = getLocalData()
    return data.checklists.find(c => c.id === id) || null
  },
  
  create: async (newChecklist: any): Promise<any | null> => {
    const data = getLocalData()
    const updatedChecklists = addToLocalCollection('checklists', data.checklists, newChecklist)
    const newData = { ...data, checklists: updatedChecklists }
    saveLocalData(newData)
    return updatedChecklists[updatedChecklists.length - 1]
  },
  
  update: async (id: string, updates: any): Promise<any | null> => {
    const data = getLocalData()
    const updatedChecklists = updateLocalCollection('checklists', data.checklists, id, updates)
    const newData = { ...data, checklists: updatedChecklists }
    saveLocalData(newData)
    return updatedChecklists.find(c => c.id === id) || null
  },
  
  delete: async (id: string): Promise<boolean> => {
    const data = getLocalData()
    const updatedChecklists = removeFromLocalCollection('checklists', data.checklists, id)
    const newData = { ...data, checklists: updatedChecklists }
    saveLocalData(newData)
    return true
  }
}

// API local para materiais
export const localMateriaisAPI = {
  getAll: async (): Promise<any[]> => {
    const data = getLocalData()
    return data.materiais
  },
  
  getById: async (id: string): Promise<any | null> => {
    const data = getLocalData()
    return data.materiais.find(m => m.id === id) || null
  },
  
  create: async (newMaterial: any): Promise<any | null> => {
    const data = getLocalData()
    const updatedMateriais = addToLocalCollection('materiais', data.materiais, newMaterial)
    const newData = { ...data, materiais: updatedMateriais }
    saveLocalData(newData)
    return updatedMateriais[updatedMateriais.length - 1]
  },
  
  update: async (id: string, updates: any): Promise<any | null> => {
    const data = getLocalData()
    const updatedMateriais = updateLocalCollection('materiais', data.materiais, id, updates)
    const newData = { ...data, materiais: updatedMateriais }
    saveLocalData(newData)
    return updatedMateriais.find(m => m.id === id) || null
  },
  
  delete: async (id: string): Promise<boolean> => {
    const data = getLocalData()
    const updatedMateriais = removeFromLocalCollection('materiais', data.materiais, id)
    const newData = { ...data, materiais: updatedMateriais }
    saveLocalData(newData)
    return true
  }
}

// API local para fornecedores
export const localFornecedoresAPI = {
  getAll: async (): Promise<any[]> => {
    const data = getLocalData()
    return data.fornecedores
  },
  
  getById: async (id: string): Promise<any | null> => {
    const data = getLocalData()
    return data.fornecedores.find(f => f.id === id) || null
  },
  
  create: async (newFornecedor: any): Promise<any | null> => {
    const data = getLocalData()
    const updatedFornecedores = addToLocalCollection('fornecedores', data.fornecedores, newFornecedor)
    const newData = { ...data, fornecedores: updatedFornecedores }
    saveLocalData(newData)
    return updatedFornecedores[updatedFornecedores.length - 1]
  },
  
  update: async (id: string, updates: any): Promise<any | null> => {
    const data = getLocalData()
    const updatedFornecedores = updateLocalCollection('fornecedores', data.fornecedores, id, updates)
    const newData = { ...data, fornecedores: updatedFornecedores }
    saveLocalData(newData)
    return updatedFornecedores.find(f => f.id === id) || null
  },
  
  delete: async (id: string): Promise<boolean> => {
    const data = getLocalData()
    const updatedFornecedores = removeFromLocalCollection('fornecedores', data.fornecedores, id)
    const newData = { ...data, fornecedores: updatedFornecedores }
    saveLocalData(newData)
    return true
  }
}

// API local para não conformidades
export const localNaoConformidadesAPI = {
  getAll: async (): Promise<any[]> => {
    const data = getLocalData()
    return data.nao_conformidades
  },
  
  getById: async (id: string): Promise<any | null> => {
    const data = getLocalData()
    return data.nao_conformidades.find(nc => nc.id === id) || null
  },
  
  create: async (newNaoConformidade: any): Promise<any | null> => {
    const data = getLocalData()
    const updatedNaoConformidades = addToLocalCollection('nao_conformidades', data.nao_conformidades, newNaoConformidade)
    const newData = { ...data, nao_conformidades: updatedNaoConformidades }
    saveLocalData(newData)
    return updatedNaoConformidades[updatedNaoConformidades.length - 1]
  },
  
  update: async (id: string, updates: any): Promise<any | null> => {
    const data = getLocalData()
    const updatedNaoConformidades = updateLocalCollection('nao_conformidades', data.nao_conformidades, id, updates)
    const newData = { ...data, nao_conformidades: updatedNaoConformidades }
    saveLocalData(newData)
    return updatedNaoConformidades.find(nc => nc.id === id) || null
  },
  
  delete: async (id: string): Promise<boolean> => {
    const data = getLocalData()
    const updatedNaoConformidades = removeFromLocalCollection('nao_conformidades', data.nao_conformidades, id)
    const newData = { ...data, nao_conformidades: updatedNaoConformidades }
    saveLocalData(newData)
    return true
  }
}

// API local para RFIs
export const localRFIsAPI = {
  getAll: async (): Promise<any[]> => {
    const data = getLocalData()
    return data.rfis
  },
  
  getById: async (id: string): Promise<any | null> => {
    const data = getLocalData()
    return data.rfis.find(rfi => rfi.id === id) || null
  },
  
  create: async (newRFI: any): Promise<any | null> => {
    const data = getLocalData()
    const updatedRFIs = addToLocalCollection('rfis', data.rfis, newRFI)
    const newData = { ...data, rfis: updatedRFIs }
    saveLocalData(newData)
    return updatedRFIs[updatedRFIs.length - 1]
  },
  
  update: async (id: string, updates: any): Promise<any | null> => {
    const data = getLocalData()
    const updatedRFIs = updateLocalCollection('rfis', data.rfis, id, updates)
    const newData = { ...data, rfis: updatedRFIs }
    saveLocalData(newData)
    return updatedRFIs.find(rfi => rfi.id === id) || null
  },
  
  delete: async (id: string): Promise<boolean> => {
    const data = getLocalData()
    const updatedRFIs = removeFromLocalCollection('rfis', data.rfis, id)
    const newData = { ...data, rfis: updatedRFIs }
    saveLocalData(newData)
    return true
  }
} 