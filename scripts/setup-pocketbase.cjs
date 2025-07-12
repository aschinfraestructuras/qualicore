// Script para criar as coleções do Qualicore no PocketBase
// Uso: node scripts/setup-pocketbase.js

const PocketBase = require('pocketbase');

// Configuration
const POCKETBASE_URL = 'http://127.0.0.1:8090';
const ADMIN_EMAIL = 'sitecore.quality@gmail.com';
const ADMIN_PASSWORD = 'Hercules2.1';

// Collection schemas
const collections = [
  {
    name: 'documentos',
    type: 'base',
    schema: [
      {
        name: 'titulo',
        type: 'text',
        required: true,
        options: { min: 1, max: 200 }
      },
      {
        name: 'descricao',
        type: 'text',
        required: false,
        options: { max: 1000 }
      },
      {
        name: 'tipo',
        type: 'select',
        required: true,
        options: {
          values: ['procedimento', 'instrucao', 'formulario', 'manual', 'outro']
        }
      },
      {
        name: 'versao',
        type: 'text',
        required: true,
        options: { min: 1, max: 20 }
      },
      {
        name: 'status',
        type: 'select',
        required: true,
        options: {
          values: ['rascunho', 'em_revisao', 'aprovado', 'obsoleto']
        }
      },
      {
        name: 'data_criacao',
        type: 'date',
        required: true
      },
      {
        name: 'data_aprovacao',
        type: 'date',
        required: false
      },
      {
        name: 'responsavel',
        type: 'text',
        required: true,
        options: { min: 1, max: 100 }
      },
      {
        name: 'departamento',
        type: 'text',
        required: true,
        options: { min: 1, max: 100 }
      },
      {
        name: 'tags',
        type: 'text',
        required: false,
        options: { max: 500 }
      },
      {
        name: 'arquivo',
        type: 'file',
        required: false,
        options: { maxSelect: 1, maxSize: 52428800, mimeTypes: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'] }
      }
    ]
  },
  {
    name: 'checklists',
    type: 'base',
    schema: [
      {
        name: 'titulo',
        type: 'text',
        required: true,
        options: { min: 1, max: 200 }
      },
      {
        name: 'descricao',
        type: 'text',
        required: false,
        options: { max: 1000 }
      },
      {
        name: 'tipo',
        type: 'select',
        required: true,
        options: {
          values: ['inspecao', 'auditoria', 'verificacao', 'manutencao', 'outro']
        }
      },
      {
        name: 'status',
        type: 'select',
        required: true,
        options: {
          values: ['ativo', 'inativo', 'em_revisao']
        }
      },
      {
        name: 'frequencia',
        type: 'select',
        required: true,
        options: {
          values: ['diario', 'semanal', 'mensal', 'trimestral', 'semestral', 'anual', 'sob_demanda']
        }
      },
      {
        name: 'responsavel',
        type: 'text',
        required: true,
        options: { min: 1, max: 100 }
      },
      {
        name: 'departamento',
        type: 'text',
        required: true,
        options: { min: 1, max: 100 }
      },
      {
        name: 'data_criacao',
        type: 'date',
        required: true
      },
      {
        name: 'data_ultima_revisao',
        type: 'date',
        required: false
      },
      {
        name: 'itens',
        type: 'json',
        required: true
      }
    ]
  },
  {
    name: 'ensaios',
    type: 'base',
    schema: [
      {
        name: 'titulo',
        type: 'text',
        required: true,
        options: { min: 1, max: 200 }
      },
      {
        name: 'descricao',
        type: 'text',
        required: false,
        options: { max: 1000 }
      },
      {
        name: 'tipo_ensaio',
        type: 'select',
        required: true,
        options: {
          values: ['destrutivo', 'nao_destrutivo', 'visual', 'dimensional', 'quimico', 'fisico', 'outro']
        }
      },
      {
        name: 'status',
        type: 'select',
        required: true,
        options: {
          values: ['agendado', 'em_andamento', 'concluido', 'cancelado', 'reagendado']
        }
      },
      {
        name: 'data_agendamento',
        type: 'date',
        required: true
      },
      {
        name: 'data_inicio',
        type: 'date',
        required: false
      },
      {
        name: 'data_conclusao',
        type: 'date',
        required: false
      },
      {
        name: 'responsavel',
        type: 'text',
        required: true,
        options: { min: 1, max: 100 }
      },
      {
        name: 'laboratorio',
        type: 'text',
        required: true,
        options: { min: 1, max: 100 }
      },
      {
        name: 'amostra',
        type: 'text',
        required: true,
        options: { min: 1, max: 100 }
      },
      {
        name: 'resultado',
        type: 'select',
        required: false,
        options: {
          values: ['aprovado', 'reprovado', 'condicional', 'pendente']
        }
      },
      {
        name: 'observacoes',
        type: 'text',
        required: false,
        options: { max: 1000 }
      },
      {
        name: 'relatorio',
        type: 'file',
        required: false,
        options: { maxSelect: 1, maxSize: 52428800, mimeTypes: ['application/pdf'] }
      }
    ]
  },
  {
    name: 'fornecedores',
    type: 'base',
    schema: [
      {
        name: 'nome',
        type: 'text',
        required: true,
        options: { min: 1, max: 200 }
      },
      {
        name: 'nif',
        type: 'text',
        required: true,
        options: { min: 9, max: 9 }
      },
      {
        name: 'endereco',
        type: 'text',
        required: true,
        options: { max: 500 }
      },
      {
        name: 'cidade',
        type: 'text',
        required: true,
        options: { min: 1, max: 100 }
      },
      {
        name: 'codigo_postal',
        type: 'text',
        required: true,
        options: { min: 4, max: 8 }
      },
      {
        name: 'pais',
        type: 'text',
        required: true,
        options: { min: 1, max: 100 }
      },
      {
        name: 'telefone',
        type: 'text',
        required: true,
        options: { min: 9, max: 20 }
      },
      {
        name: 'email',
        type: 'email',
        required: true
      },
      {
        name: 'website',
        type: 'url',
        required: false
      },
      {
        name: 'tipo_servico',
        type: 'select',
        required: true,
        options: {
          values: ['materiais', 'servicos', 'equipamentos', 'consultoria', 'outro']
        }
      },
      {
        name: 'status',
        type: 'select',
        required: true,
        options: {
          values: ['ativo', 'inativo', 'suspenso', 'em_avaliacao']
        }
      },
      {
        name: 'data_registro',
        type: 'date',
        required: true
      },
      {
        name: 'data_ultima_avaliacao',
        type: 'date',
        required: false
      },
      {
        name: 'classificacao',
        type: 'number',
        required: false,
        options: { min: 1, max: 5 }
      },
      {
        name: 'observacoes',
        type: 'text',
        required: false,
        options: { max: 1000 }
      }
    ]
  },
  {
    name: 'materiais',
    type: 'base',
    schema: [
      {
        name: 'codigo',
        type: 'text',
        required: true,
        options: { min: 1, max: 50 }
      },
      {
        name: 'nome',
        type: 'text',
        required: true,
        options: { min: 1, max: 200 }
      },
      {
        name: 'descricao',
        type: 'text',
        required: false,
        options: { max: 1000 }
      },
      {
        name: 'categoria',
        type: 'select',
        required: true,
        options: {
          values: ['cimento', 'betao', 'aco', 'madeira', 'isolamento', 'impermeabilizacao', 'acabamentos', 'equipamentos', 'ferramentas', 'outro']
        }
      },
      {
        name: 'unidade',
        type: 'select',
        required: true,
        options: {
          values: ['kg', 'ton', 'm', 'm2', 'm3', 'l', 'un', 'caixa', 'rolo', 'outro']
        }
      },
      {
        name: 'fornecedor',
        type: 'relation',
        required: true,
        options: {
          collectionId: 'fornecedores',
          cascadeDelete: false
        }
      },
      {
        name: 'preco_unitario',
        type: 'number',
        required: true,
        options: { min: 0 }
      },
      {
        name: 'stock_minimo',
        type: 'number',
        required: true,
        options: { min: 0 }
      },
      {
        name: 'stock_atual',
        type: 'number',
        required: true,
        options: { min: 0 }
      },
      {
        name: 'localizacao',
        type: 'text',
        required: true,
        options: { min: 1, max: 100 }
      },
      {
        name: 'data_entrada',
        type: 'date',
        required: true
      },
      {
        name: 'data_validade',
        type: 'date',
        required: false
      },
      {
        name: 'status',
        type: 'select',
        required: true,
        options: {
          values: ['disponivel', 'esgotado', 'reservado', 'obsoleto']
        }
      },
      {
        name: 'certificacoes',
        type: 'text',
        required: false,
        options: { max: 500 }
      },
      {
        name: 'observacoes',
        type: 'text',
        required: false,
        options: { max: 1000 }
      }
    ]
  },
  {
    name: 'nao_conformidades',
    type: 'base',
    schema: [
      {
        name: 'titulo',
        type: 'text',
        required: true,
        options: { min: 1, max: 200 }
      },
      {
        name: 'descricao',
        type: 'text',
        required: true,
        options: { max: 1000 }
      },
      {
        name: 'tipo',
        type: 'select',
        required: true,
        options: {
          values: ['produto', 'processo', 'sistema', 'documentacao', 'outro']
        }
      },
      {
        name: 'severidade',
        type: 'select',
        required: true,
        options: {
          values: ['baixa', 'media', 'alta', 'critica']
        }
      },
      {
        name: 'status',
        type: 'select',
        required: true,
        options: {
          values: ['aberta', 'em_analise', 'em_correcao', 'verificada', 'fechada']
        }
      },
      {
        name: 'data_deteccao',
        type: 'date',
        required: true
      },
      {
        name: 'data_limite',
        type: 'date',
        required: true
      },
      {
        name: 'data_fechamento',
        type: 'date',
        required: false
      },
      {
        name: 'responsavel_deteccao',
        type: 'text',
        required: true,
        options: { min: 1, max: 100 }
      },
      {
        name: 'responsavel_correcao',
        type: 'text',
        required: true,
        options: { min: 1, max: 100 }
      },
      {
        name: 'departamento',
        type: 'text',
        required: true,
        options: { min: 1, max: 100 }
      },
      {
        name: 'causa_raiz',
        type: 'text',
        required: false,
        options: { max: 1000 }
      },
      {
        name: 'acao_corretiva',
        type: 'text',
        required: false,
        options: { max: 1000 }
      },
      {
        name: 'acao_preventiva',
        type: 'text',
        required: false,
        options: { max: 1000 }
      },
      {
        name: 'custo_estimado',
        type: 'number',
        required: false,
        options: { min: 0 }
      },
      {
        name: 'observacoes',
        type: 'text',
        required: false,
        options: { max: 1000 }
      },
      {
        name: 'evidencias',
        type: 'file',
        required: false,
        options: { maxSelect: 5, maxSize: 52428800, mimeTypes: ['image/*', 'application/pdf'] }
      }
    ]
  }
];

// Demo data
const demoData = {
  documentos: [
    {
      titulo: 'Procedimento de Controlo de Qualidade',
      descricao: 'Procedimento para controlo de qualidade em obras de construção civil',
      tipo: 'procedimento',
      versao: '1.0',
      status: 'aprovado',
      data_criacao: '2024-01-15',
      data_aprovacao: '2024-01-20',
      responsavel: 'João Silva',
      departamento: 'Qualidade',
      tags: 'qualidade, controlo, procedimento'
    },
    {
      titulo: 'Instrução de Trabalho - Betão',
      descricao: 'Instruções para aplicação e cura de betão',
      tipo: 'instrucao',
      versao: '2.1',
      status: 'aprovado',
      data_criacao: '2024-01-10',
      data_aprovacao: '2024-01-12',
      responsavel: 'Maria Santos',
      departamento: 'Produção',
      tags: 'betão, aplicação, cura'
    }
  ],
  checklists: [
    {
      titulo: 'Checklist de Inspeção de Obra',
      descricao: 'Checklist para inspeção diária de obra',
      tipo: 'inspecao',
      status: 'ativo',
      frequencia: 'diario',
      responsavel: 'Carlos Oliveira',
      departamento: 'Qualidade',
      data_criacao: '2024-01-01',
      itens: [
        { item: 'Verificar equipamentos de segurança', obrigatorio: true },
        { item: 'Inspecionar qualidade do betão', obrigatorio: true },
        { item: 'Verificar limpeza do local', obrigatorio: false }
      ]
    }
  ],
  ensaios: [
    {
      titulo: 'Ensaio de Resistência do Betão',
      descricao: 'Ensaio de resistência à compressão',
      tipo_ensaio: 'destrutivo',
      status: 'concluido',
      data_agendamento: '2024-01-15',
      data_inicio: '2024-01-15',
      data_conclusao: '2024-01-16',
      responsavel: 'Ana Costa',
      laboratorio: 'LabTec',
      amostra: 'BET-001',
      resultado: 'aprovado',
      observacoes: 'Resistência superior ao especificado'
    }
  ],
  fornecedores: [
    {
      nome: 'Cimentos de Portugal',
      nif: '123456789',
      endereco: 'Rua das Indústrias, 123',
      cidade: 'Lisboa',
      codigo_postal: '1000-001',
      pais: 'Portugal',
      telefone: '+351 213 456 789',
      email: 'contacto@cimentos.pt',
      website: 'https://www.cimentos.pt',
      tipo_servico: 'materiais',
      status: 'ativo',
      data_registro: '2024-01-01',
      classificacao: 4
    },
    {
      nome: 'Aços e Metais Lda',
      nif: '987654321',
      endereco: 'Avenida da Indústria, 456',
      cidade: 'Porto',
      codigo_postal: '4000-001',
      pais: 'Portugal',
      telefone: '+351 225 789 123',
      email: 'info@acosemetais.pt',
      website: 'https://www.acosemetais.pt',
      tipo_servico: 'materiais',
      status: 'ativo',
      data_registro: '2024-01-05',
      classificacao: 5
    }
  ],
  materiais: [
    {
      codigo: 'CEM-001',
      nome: 'Cimento Portland CEM I 42.5R',
      descricao: 'Cimento Portland de alta resistência',
      categoria: 'cimento',
      unidade: 'kg',
      preco_unitario: 0.15,
      stock_minimo: 1000,
      stock_atual: 2500,
      localizacao: 'Armazém A - Piso 1',
      data_entrada: '2024-01-10',
      status: 'disponivel',
      certificacoes: 'CE, NP EN 197-1'
    },
    {
      codigo: 'ACO-001',
      nome: 'Aço A500NR',
      descricao: 'Aço estrutural para betão armado',
      categoria: 'aco',
      unidade: 'ton',
      preco_unitario: 850,
      stock_minimo: 5,
      stock_atual: 12,
      localizacao: 'Armazém B - Piso 2',
      data_entrada: '2024-01-12',
      status: 'disponivel',
      certificacoes: 'CE, NP EN 10080'
    }
  ],
  nao_conformidades: [
    {
      titulo: 'Betão com resistência inferior',
      descricao: 'Ensaio revelou resistência 15% inferior ao especificado',
      tipo: 'produto',
      severidade: 'alta',
      status: 'em_correcao',
      data_deteccao: '2024-01-20',
      data_limite: '2024-01-27',
      responsavel_deteccao: 'João Silva',
      responsavel_correcao: 'Maria Santos',
      departamento: 'Qualidade',
      causa_raiz: 'Mistura incorreta dos componentes',
      acao_corretiva: 'Refazer a mistura com proporções corretas',
      custo_estimado: 2500
    }
  ]
};

async function setupPocketBase() {
  const pb = new PocketBase(POCKETBASE_URL);
  
  try {
    console.log('🔗 Conectando ao PocketBase...');
    
    // Authenticate as admin
    console.log('🔐 Autenticando como administrador...');
    await pb.admins.authWithPassword(ADMIN_EMAIL, ADMIN_PASSWORD);
    console.log('✅ Autenticação bem-sucedida!');
    
    // Create collections
    console.log('\n📋 Criando coleções...');
    for (const collection of collections) {
      try {
        console.log(`📝 Criando coleção: ${collection.name}`);
        
        // Check if collection already exists
        try {
          await pb.collections.getOne(collection.name);
          console.log(`⚠️  Coleção ${collection.name} já existe, saltando...`);
          continue;
        } catch (error) {
          // Collection doesn't exist, create it
        }
        
        // Create collection
        await pb.collections.create({
          name: collection.name,
          type: collection.type,
          schema: collection.schema
        });
        
        console.log(`✅ Coleção ${collection.name} criada com sucesso!`);
      } catch (error) {
        console.error(`❌ Erro ao criar coleção ${collection.name}:`, error.message);
      }
    }
    
    // Insert demo data
    console.log('\n📊 Inserindo dados de demonstração...');
    for (const [collectionName, items] of Object.entries(demoData)) {
      try {
        console.log(`📝 Inserindo dados em: ${collectionName}`);
        
        for (const item of items) {
          try {
            await pb.collection(collectionName).create(item);
            console.log(`✅ Item criado em ${collectionName}`);
          } catch (error) {
            console.error(`❌ Erro ao criar item em ${collectionName}:`, error.message);
          }
        }
      } catch (error) {
        console.error(`❌ Erro ao inserir dados em ${collectionName}:`, error.message);
      }
    }
    
    console.log('\n🎉 Setup do PocketBase concluído com sucesso!');
    console.log('\n📋 Coleções criadas:');
    collections.forEach(col => console.log(`  - ${col.name}`));
    
    console.log('\n👥 Dados de demonstração inseridos em todas as coleções');
    console.log('\n🔗 URL do PocketBase Admin:', `${POCKETBASE_URL}/_/`);
    console.log('📧 Email:', ADMIN_EMAIL);
    console.log('🔑 Password:', ADMIN_PASSWORD);
    
  } catch (error) {
    console.error('❌ Erro durante o setup:', error.message);
    
    if (error.message.includes('Failed to fetch')) {
      console.log('\n💡 Certifique-se de que:');
      console.log('   1. O PocketBase está a correr em', POCKETBASE_URL);
      console.log('   2. O servidor está acessível');
      console.log('   3. Não há firewall a bloquear a conexão');
    }
    
    if (error.message.includes('Invalid login credentials')) {
      console.log('\n💡 Certifique-se de que:');
      console.log('   1. O admin existe no PocketBase');
      console.log('   2. As credenciais estão corretas');
      console.log('   3. Execute primeiro: node scripts/create-admin.js');
    }
  }
}

// Run the setup
setupPocketBase(); 