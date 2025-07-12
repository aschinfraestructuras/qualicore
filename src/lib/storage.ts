// Remover imports e funções não utilizadas

// Chaves para LocalStorage
const STORAGE_KEYS = {
  DOCUMENTOS: 'qualicore_documentos',
  ENSAIOS: 'qualicore_ensaios',
  CHECKLISTS: 'qualicore_checklists',
  MATERIAIS: 'qualicore_materiais',
  FORNECEDORES: 'qualicore_fornecedores',
  NAO_CONFORMIDADES: 'qualicore_nao_conformidades',
  ANEXOS: 'qualicore_anexos',
  SETTINGS: 'qualicore_settings'
}

// Funções utilitárias
const generateId = () => Date.now().toString(36) + Math.random().toString(36).substr(2)

const getCurrentTimestamp = () => new Date().toISOString()

// Funções de armazenamento genéricas
const getFromStorage = <T>(key: string, defaultValue: T[] = []): T[] => {
  try {
    const item = localStorage.getItem(key)
    return item ? JSON.parse(item) : defaultValue
  } catch (error) {
    console.error(`Erro ao ler ${key}:`, error)
    return defaultValue
  }
}

const saveToStorage = <T>(key: string, data: T[]): void => {
  try {
    localStorage.setItem(key, JSON.stringify(data))
  } catch (error) {
    console.error(`Erro ao guardar ${key}:`, error)
  }
}

// Dados iniciais para demonstração
const initialData = {
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
      data_criacao: '2024-01-15T10:00:00Z',
      data_atualizacao: '2024-01-15T10:00:00Z'
    },
    {
      id: '2',
      codigo: 'DOC-002',
      tipo: 'especificacao',
      versao: '2.1',
      data_validade: '2024-06-30',
      fornecedor_id: '2',
      responsavel: 'Maria Santos',
      zona: 'Zona B - Estrutura',
      estado: 'em_analise',
      observacoes: 'Especificações técnicas para betão armado',
      data_criacao: '2024-01-20T14:30:00Z',
      data_atualizacao: '2024-01-20T14:30:00Z'
    }
  ],
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
      data_criacao: '2024-01-18T09:00:00Z',
      data_atualizacao: '2024-01-18T09:00:00Z'
    },
    {
      id: '2',
      codigo: 'ENS-002',
      tipo: 'densidade',
      material_id: '2',
      resultado: 'Não Conforme',
      valor_obtido: 2.1,
      valor_esperado: 2.4,
      unidade: 'g/cm³',
      laboratorio: 'LabTec',
      data_ensaio: '2024-01-19',
      conforme: false,
      responsavel: 'Maria Santos',
      zona: 'Zona B - Estrutura',
      estado: 'reprovado',
      observacoes: 'Densidade abaixo do especificado',
      data_criacao: '2024-01-19T11:00:00Z',
      data_atualizacao: '2024-01-19T11:00:00Z'
    }
  ],
  checklists: [
    {
      id: '1',
      codigo: 'CHK-001',
      tipo: 'inspecao',
      itens: [
        { id: '1', descricao: 'Verificar armaduras', conforme: true, observacoes: 'OK' },
        { id: '2', descricao: 'Verificar cofragem', conforme: true, observacoes: 'OK' },
        { id: '3', descricao: 'Verificar betão', conforme: false, observacoes: 'Falta cura' }
      ],
      percentual_conformidade: 66.7,
      data_inspecao: '2024-01-20',
      inspetor: 'João Silva',
      responsavel: 'João Silva',
      zona: 'Zona A - Fundações',
      estado: 'pendente',
      observacoes: 'Necessita correções na cura do betão',
      data_criacao: '2024-01-20T08:00:00Z',
      data_atualizacao: '2024-01-20T08:00:00Z'
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
      data_criacao: '2024-01-10T10:00:00Z',
      data_atualizacao: '2024-01-10T10:00:00Z'
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
      data_registo: '2024-01-01',
      estado: 'ativo'
    },
    {
      id: '2',
      nome: 'Aços de Portugal',
      nif: '500789123',
      morada: 'Av. da Siderurgia, 456, Porto',
      telefone: '225789123',
      email: 'info@acoportugal.pt',
      contacto: 'Dra. Ana Silva',
      data_registo: '2024-01-05',
      estado: 'ativo'
    }
  ],
  nao_conformidades: [
    {
      id: '1',
      codigo: 'NC-001',
      tipo: 'material',
      severidade: 'media',
      data_deteccao: '2024-01-19',
      data_resolucao: null,
      acao_corretiva: null,
      responsavel_resolucao: null,
      custo_estimado: 5000,
      relacionado_ensaio_id: '2',
      relacionado_material_id: '1',
      responsavel: 'Maria Santos',
      zona: 'Zona B - Estrutura',
      estado: 'pendente',
      observacoes: 'Densidade do agregado abaixo do especificado',
      data_criacao: '2024-01-19T15:00:00Z',
      data_atualizacao: '2024-01-19T15:00:00Z'
    }
  ],
  anexos: [
    {
      id: '1',
      nome: 'especificacao_betao.pdf',
      tipo: 'application/pdf',
      tamanho: 2048576,
      url: 'data:application/pdf;base64,JVBERi0xLjQKJcOkw7zDtsO...',
      data_upload: '2024-01-15T10:00:00Z',
      entidade_id: '1',
      entidade_tipo: 'documento'
    }
  ]
}

// Inicializar dados se não existirem
const initializeData = () => {
  const hasData = localStorage.getItem(STORAGE_KEYS.DOCUMENTOS)
  if (!hasData) {
    saveToStorage(STORAGE_KEYS.DOCUMENTOS, initialData.documentos)
    saveToStorage(STORAGE_KEYS.ENSAIOS, initialData.ensaios)
    saveToStorage(STORAGE_KEYS.CHECKLISTS, initialData.checklists)
    saveToStorage(STORAGE_KEYS.MATERIAIS, initialData.materiais)
    saveToStorage(STORAGE_KEYS.FORNECEDORES, initialData.fornecedores)
    saveToStorage(STORAGE_KEYS.NAO_CONFORMIDADES, initialData.nao_conformidades)
    saveToStorage(STORAGE_KEYS.ANEXOS, initialData.anexos)
  }
}

// API para Documentos
export const documentosAPI = {
  getAll: () => {
    initializeData()
    return getFromStorage<any>(STORAGE_KEYS.DOCUMENTOS)
  },
  
  getById: (id: string) => {
    const documentos = documentosAPI.getAll()
    return documentos.find(d => d.id === id)
  },
  
  create: (documento: any) => {
    const documentos = documentosAPI.getAll()
    const newDocumento = {
      ...documento,
      id: generateId(),
      data_criacao: getCurrentTimestamp(),
      data_atualizacao: getCurrentTimestamp()
    }
    documentos.push(newDocumento)
    saveToStorage(STORAGE_KEYS.DOCUMENTOS, documentos)
    return newDocumento
  },
  
  update: (id: string, updates: any) => {
    const documentos = documentosAPI.getAll()
    const index = documentos.findIndex(d => d.id === id)
    if (index === -1) return null
    
    documentos[index] = {
      ...documentos[index],
      ...updates,
      data_atualizacao: getCurrentTimestamp()
    }
    saveToStorage(STORAGE_KEYS.DOCUMENTOS, documentos)
    return documentos[index]
  },
  
  delete: (id: string) => {
    const documentos = documentosAPI.getAll()
    const filtered = documentos.filter(d => d.id !== id)
    if (filtered.length === documentos.length) return false
    
    saveToStorage(STORAGE_KEYS.DOCUMENTOS, filtered)
    return true
  }
}

// API para Ensaios
export const ensaiosAPI = {
  getAll: () => {
    initializeData()
    return getFromStorage<any>(STORAGE_KEYS.ENSAIOS)
  },
  
  getById: (id: string) => {
    const ensaios = ensaiosAPI.getAll()
    return ensaios.find(e => e.id === id)
  },
  
  create: (ensaio: any) => {
    const ensaios = ensaiosAPI.getAll()
    const newEnsaio = {
      ...ensaio,
      id: generateId(),
      data_criacao: getCurrentTimestamp(),
      data_atualizacao: getCurrentTimestamp()
    }
    ensaios.push(newEnsaio)
    saveToStorage(STORAGE_KEYS.ENSAIOS, ensaios)
    return newEnsaio
  },
  
  update: (id: string, updates: any) => {
    const ensaios = ensaiosAPI.getAll()
    const index = ensaios.findIndex(e => e.id === id)
    if (index === -1) return null
    
    ensaios[index] = {
      ...ensaios[index],
      ...updates,
      data_atualizacao: getCurrentTimestamp()
    }
    saveToStorage(STORAGE_KEYS.ENSAIOS, ensaios)
    return ensaios[index]
  },
  
  delete: (id: string) => {
    const ensaios = ensaiosAPI.getAll()
    const filtered = ensaios.filter(e => e.id !== id)
    if (filtered.length === ensaios.length) return false
    
    saveToStorage(STORAGE_KEYS.ENSAIOS, filtered)
    return true
  }
}

// API para Checklists
export const checklistsAPI = {
  getAll: () => {
    initializeData()
    return getFromStorage<any>(STORAGE_KEYS.CHECKLISTS)
  },
  
  getById: (id: string) => {
    const checklists = checklistsAPI.getAll()
    return checklists.find(c => c.id === id)
  },
  
  create: (checklist: any) => {
    const checklists = checklistsAPI.getAll()
    const newChecklist = {
      ...checklist,
      id: generateId(),
      data_criacao: getCurrentTimestamp(),
      data_atualizacao: getCurrentTimestamp()
    }
    checklists.push(newChecklist)
    saveToStorage(STORAGE_KEYS.CHECKLISTS, checklists)
    return newChecklist
  },
  
  update: (id: string, updates: any) => {
    const checklists = checklistsAPI.getAll()
    const index = checklists.findIndex(c => c.id === id)
    if (index === -1) return null
    
    checklists[index] = {
      ...checklists[index],
      ...updates,
      data_atualizacao: getCurrentTimestamp()
    }
    saveToStorage(STORAGE_KEYS.CHECKLISTS, checklists)
    return checklists[index]
  },
  
  delete: (id: string) => {
    const checklists = checklistsAPI.getAll()
    const filtered = checklists.filter(c => c.id !== id)
    if (filtered.length === checklists.length) return false
    
    saveToStorage(STORAGE_KEYS.CHECKLISTS, filtered)
    return true
  }
}

// API para Materiais
export const materiaisAPI = {
  getAll: () => {
    initializeData()
    return getFromStorage<any>(STORAGE_KEYS.MATERIAIS)
  },
  
  getById: (id: string) => {
    const materiais = materiaisAPI.getAll()
    return materiais.find(m => m.id === id)
  },
  
  create: (material: any) => {
    const materiais = materiaisAPI.getAll()
    const newMaterial = {
      ...material,
      id: generateId(),
      data_criacao: getCurrentTimestamp(),
      data_atualizacao: getCurrentTimestamp()
    }
    materiais.push(newMaterial)
    saveToStorage(STORAGE_KEYS.MATERIAIS, materiais)
    return newMaterial
  },
  
  update: (id: string, updates: any) => {
    const materiais = materiaisAPI.getAll()
    const index = materiais.findIndex(m => m.id === id)
    if (index === -1) return null
    
    materiais[index] = {
      ...materiais[index],
      ...updates,
      data_atualizacao: getCurrentTimestamp()
    }
    saveToStorage(STORAGE_KEYS.MATERIAIS, materiais)
    return materiais[index]
  },
  
  delete: (id: string) => {
    const materiais = materiaisAPI.getAll()
    const filtered = materiais.filter(m => m.id !== id)
    if (filtered.length === materiais.length) return false
    
    saveToStorage(STORAGE_KEYS.MATERIAIS, filtered)
    return true
  }
}

// API para Fornecedores
export const fornecedoresAPI = {
  getAll: () => {
    initializeData()
    return getFromStorage<any>(STORAGE_KEYS.FORNECEDORES)
  },
  
  getById: (id: string) => {
    const fornecedores = fornecedoresAPI.getAll()
    return fornecedores.find(f => f.id === id)
  },
  
  create: (fornecedor: any) => {
    const fornecedores = fornecedoresAPI.getAll()
    const newFornecedor = {
      ...fornecedor,
      id: generateId(),
      data_registo: getCurrentTimestamp()
    }
    fornecedores.push(newFornecedor)
    saveToStorage(STORAGE_KEYS.FORNECEDORES, fornecedores)
    return newFornecedor
  },
  
  update: (id: string, updates: any) => {
    const fornecedores = fornecedoresAPI.getAll()
    const index = fornecedores.findIndex(f => f.id === id)
    if (index === -1) return null
    
    fornecedores[index] = {
      ...fornecedores[index],
      ...updates
    }
    saveToStorage(STORAGE_KEYS.FORNECEDORES, fornecedores)
    return fornecedores[index]
  },
  
  delete: (id: string) => {
    const fornecedores = fornecedoresAPI.getAll()
    const filtered = fornecedores.filter(f => f.id !== id)
    if (filtered.length === fornecedores.length) return false
    
    saveToStorage(STORAGE_KEYS.FORNECEDORES, filtered)
    return true
  }
}

// API para Não Conformidades
export const naoConformidadesAPI = {
  getAll: () => {
    initializeData()
    return getFromStorage<any>(STORAGE_KEYS.NAO_CONFORMIDADES)
  },
  
  getById: (id: string) => {
    const ncs = naoConformidadesAPI.getAll()
    return ncs.find(nc => nc.id === id)
  },
  
  create: (nc: any) => {
    const ncs = naoConformidadesAPI.getAll()
    const newNC = {
      ...nc,
      id: generateId(),
      data_criacao: getCurrentTimestamp(),
      data_atualizacao: getCurrentTimestamp()
    }
    ncs.push(newNC)
    saveToStorage(STORAGE_KEYS.NAO_CONFORMIDADES, ncs)
    return newNC
  },
  
  update: (id: string, updates: any) => {
    const ncs = naoConformidadesAPI.getAll()
    const index = ncs.findIndex(nc => nc.id === id)
    if (index === -1) return null
    
    ncs[index] = {
      ...ncs[index],
      ...updates,
      data_atualizacao: getCurrentTimestamp()
    }
    saveToStorage(STORAGE_KEYS.NAO_CONFORMIDADES, ncs)
    return ncs[index]
  },
  
  delete: (id: string) => {
    const ncs = naoConformidadesAPI.getAll()
    const filtered = ncs.filter(nc => nc.id !== id)
    if (filtered.length === ncs.length) return false
    
    saveToStorage(STORAGE_KEYS.NAO_CONFORMIDADES, filtered)
    return true
  }
}

// API para Anexos
export const anexosAPI = {
  getAll: () => {
    initializeData()
    return getFromStorage<any>(STORAGE_KEYS.ANEXOS)
  },
  
  getByEntity: (entidadeId: string, entidadeTipo: string) => {
    const anexos = anexosAPI.getAll()
    return anexos.filter(a => a.entidade_id === entidadeId && a.entidade_tipo === entidadeTipo)
  },
  
  create: (anexo: any) => {
    const anexos = anexosAPI.getAll()
    const newAnexo = {
      ...anexo,
      id: generateId(),
      data_upload: getCurrentTimestamp()
    }
    anexos.push(newAnexo)
    saveToStorage(STORAGE_KEYS.ANEXOS, anexos)
    return newAnexo
  },
  
  delete: (id: string) => {
    const anexos = anexosAPI.getAll()
    const filtered = anexos.filter(a => a.id !== id)
    if (filtered.length === anexos.length) return false
    
    saveToStorage(STORAGE_KEYS.ANEXOS, filtered)
    return true
  }
}

// Funções de exportação/importação
export const exportData = () => {
  const data = {
    documentos: documentosAPI.getAll(),
    ensaios: ensaiosAPI.getAll(),
    checklists: checklistsAPI.getAll(),
    materiais: materiaisAPI.getAll(),
    fornecedores: fornecedoresAPI.getAll(),
    nao_conformidades: naoConformidadesAPI.getAll(),
    anexos: anexosAPI.getAll(),
    exportDate: new Date().toISOString()
  }
  
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `qualicore_backup_${new Date().toISOString().split('T')[0]}.json`
  a.click()
  URL.revokeObjectURL(url)
}

export const importData = (file: File): Promise<boolean> => {
  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string)
        
        if (data.documentos) saveToStorage(STORAGE_KEYS.DOCUMENTOS, data.documentos)
        if (data.ensaios) saveToStorage(STORAGE_KEYS.ENSAIOS, data.ensaios)
        if (data.checklists) saveToStorage(STORAGE_KEYS.CHECKLISTS, data.checklists)
        if (data.materiais) saveToStorage(STORAGE_KEYS.MATERIAIS, data.materiais)
        if (data.fornecedores) saveToStorage(STORAGE_KEYS.FORNECEDORES, data.fornecedores)
        if (data.nao_conformidades) saveToStorage(STORAGE_KEYS.NAO_CONFORMIDADES, data.nao_conformidades)
        if (data.anexos) saveToStorage(STORAGE_KEYS.ANEXOS, data.anexos)
        
        resolve(true)
      } catch (error) {
        console.error('Erro ao importar dados:', error)
        resolve(false)
      }
    }
    reader.readAsText(file)
  })
}

// Limpar todos os dados
export const clearAllData = () => {
  Object.values(STORAGE_KEYS).forEach(key => {
    localStorage.removeItem(key)
  })
} 