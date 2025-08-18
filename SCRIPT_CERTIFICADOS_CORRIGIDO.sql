-- =====================================================
-- SCRIPT SQL CORRIGIDO - SISTEMA DE CERTIFICADOS E REGISTOS
-- =====================================================
-- Execute este script diretamente no SQL Editor do Supabase

-- Habilitar extensões necessárias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- 1. TABELA CERTIFICADOS
-- =====================================================

CREATE TABLE IF NOT EXISTS certificados (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  codigo VARCHAR(100) UNIQUE NOT NULL,
  titulo VARCHAR(500) NOT NULL,
  descricao TEXT,
  
  -- Informações do Certificado
  tipo_certificado VARCHAR(50) NOT NULL CHECK (tipo_certificado IN (
    'qualidade_sistema', 'qualidade_produto', 'ambiente', 'seguranca', 
    'energia', 'alimentar', 'construcao', 'laboratorio', 'calibracao', 
    'inspectao', 'manutencao', 'formacao', 'competencia', 'outro'
  )),
  categoria VARCHAR(50) NOT NULL CHECK (categoria IN (
    'sistema_gestao', 'produto_servico', 'pessoal', 'equipamento', 
    'processo', 'fornecedor', 'cliente', 'regulamentar', 'voluntario', 'outro'
  )),
  escopo TEXT NOT NULL,
  normas_referencia TEXT[] DEFAULT '{}',
  
  -- Entidade Certificadora
  entidade_certificadora VARCHAR(200) NOT NULL,
  organismo_acreditacao VARCHAR(200),
  numero_acreditacao VARCHAR(100),
  
  -- Datas Importantes
  data_emissao DATE NOT NULL,
  data_validade DATE NOT NULL,
  data_renovacao DATE,
  data_suspensao DATE,
  data_cancelamento DATE,
  
  -- Status e Estado
  status VARCHAR(30) NOT NULL DEFAULT 'ativo' CHECK (status IN (
    'ativo', 'suspenso', 'cancelado', 'expirado', 'em_renovacao', 
    'em_suspensao', 'cancelado_voluntario', 'cancelado_obrigatorio'
  )),
  estado VARCHAR(30) NOT NULL DEFAULT 'valido' CHECK (estado IN (
    'valido', 'proximo_expiracao', 'expirado', 'suspenso', 'cancelado'
  )),
  
  -- Responsáveis
  responsavel_id UUID NOT NULL,
  responsavel_nome VARCHAR(200) NOT NULL,
  responsavel_email VARCHAR(200),
  responsavel_telefone VARCHAR(50),
  
  -- Informações Adicionais
  nivel_certificacao VARCHAR(50),
  ambito_geografico VARCHAR(100),
  restricoes TEXT,
  condicoes_especiais TEXT,
  
  -- Documentação
  documentos_anexos JSONB DEFAULT '[]',
  certificado_original_url TEXT,
  certificado_digital_url TEXT,
  
  -- Auditorias e Renovações
  ultima_auditoria DATE,
  proxima_auditoria DATE,
  frequencia_auditorias VARCHAR(50),
  historico_renovacoes JSONB DEFAULT '[]',
  
  -- Custos e Informações Financeiras
  custo_emissao DECIMAL(15,2),
  custo_manutencao DECIMAL(15,2),
  custo_renovacao DECIMAL(15,2),
  moeda VARCHAR(10) DEFAULT 'EUR',
  
  -- Observações e Metadados
  observacoes TEXT,
  palavras_chave TEXT[] DEFAULT '{}',
  tags TEXT[] DEFAULT '{}',
  classificacao_confidencialidade VARCHAR(20) DEFAULT 'interno' CHECK (classificacao_confidencialidade IN (
    'publico', 'interno', 'confidencial', 'restrito'
  )),
  
  -- Relacionamentos
  obra_id UUID,
  fornecedor_id UUID,
  material_id UUID,
  equipamento_id UUID,
  
  -- Controle de Versões
  versao VARCHAR(20) DEFAULT '1.0',
  versao_anterior_id UUID,
  
  -- Metadados do Sistema
  user_id UUID NOT NULL,
  criado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  atualizado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 2. TABELA REGISTOS
-- =====================================================

CREATE TABLE IF NOT EXISTS registos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  codigo VARCHAR(100) UNIQUE NOT NULL,
  titulo VARCHAR(500) NOT NULL,
  descricao TEXT,
  
  -- Tipo de Registo
  tipo_registo VARCHAR(50) NOT NULL CHECK (tipo_registo IN (
    'auditoria', 'inspecao', 'ensaio', 'calibracao', 'manutencao',
    'formacao', 'competencia', 'acidente', 'incidente', 'nao_conformidade',
    'acao_corretiva', 'acao_preventiva', 'melhoria', 'outro'
  )),
  categoria VARCHAR(50) NOT NULL CHECK (categoria IN (
    'qualidade', 'ambiente', 'seguranca', 'saude', 'energia',
    'manutencao', 'formacao', 'equipamento', 'processo', 'outro'
  )),
  
  -- Datas
  data_registo DATE NOT NULL,
  data_ocorrencia DATE,
  data_limite DATE,
  data_conclusao DATE,
  
  -- Status e Prioridade
  status VARCHAR(30) NOT NULL DEFAULT 'pendente' CHECK (status IN (
    'pendente', 'em_andamento', 'concluido', 'cancelado', 'suspenso'
  )),
  prioridade VARCHAR(20) NOT NULL DEFAULT 'media' CHECK (prioridade IN (
    'baixa', 'media', 'alta', 'critica'
  )),
  
  -- Responsáveis
  responsavel_id UUID NOT NULL,
  responsavel_nome VARCHAR(200) NOT NULL,
  responsavel_email VARCHAR(200),
  responsavel_telefone VARCHAR(50),
  
  -- Localização e Contexto
  localizacao VARCHAR(200),
  departamento VARCHAR(100),
  equipamento VARCHAR(200),
  processo VARCHAR(200),
  
  -- Detalhes Técnicos
  especificacoes_tecnicas TEXT,
  resultados TEXT,
  conclusoes TEXT,
  recomendacoes TEXT,
  
  -- Documentação
  documentos_anexos JSONB DEFAULT '[]',
  fotografias JSONB DEFAULT '[]',
  
  -- Relacionamentos
  certificado_id UUID REFERENCES certificados(id) ON DELETE SET NULL,
  obra_id UUID,
  fornecedor_id UUID,
  material_id UUID,
  
  -- Observações
  observacoes TEXT,
  tags TEXT[] DEFAULT '{}',
  
  -- Metadados do Sistema
  user_id UUID NOT NULL,
  criado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  atualizado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 3. TABELA TERMOS E CONDIÇÕES
-- =====================================================

CREATE TABLE IF NOT EXISTS termos_condicoes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  codigo VARCHAR(100) UNIQUE NOT NULL,
  titulo VARCHAR(500) NOT NULL,
  descricao TEXT,
  
  -- Tipo de Termo
  tipo_termo VARCHAR(50) NOT NULL CHECK (tipo_termo IN (
    'contrato', 'acordo', 'protocolo', 'memorando', 'declaracao',
    'compromisso', 'politica', 'procedimento', 'instrucao', 'outro'
  )),
  categoria VARCHAR(50) NOT NULL CHECK (categoria IN (
    'comercial', 'tecnico', 'legal', 'operacional', 'seguranca',
    'qualidade', 'ambiente', 'formacao', 'manutencao', 'outro'
  )),
  
  -- Datas
  data_criacao DATE NOT NULL,
  data_entrada_vigor DATE NOT NULL,
  data_fim_vigor DATE,
  data_revisao DATE,
  
  -- Status
  status VARCHAR(30) NOT NULL DEFAULT 'ativo' CHECK (status IN (
    'ativo', 'inativo', 'suspenso', 'cancelado', 'em_revisao'
  )),
  
  -- Versão
  versao VARCHAR(20) DEFAULT '1.0',
  versao_anterior_id UUID,
  
  -- Conteúdo
  conteudo TEXT NOT NULL,
  clausulas JSONB DEFAULT '[]',
  anexos JSONB DEFAULT '[]',
  
  -- Aplicabilidade
  ambito_aplicacao TEXT,
  excecoes TEXT,
  condicoes_especiais TEXT,
  
  -- Responsáveis
  responsavel_id UUID NOT NULL,
  responsavel_nome VARCHAR(200) NOT NULL,
  responsavel_email VARCHAR(200),
  
  -- Relacionamentos
  certificado_id UUID REFERENCES certificados(id) ON DELETE SET NULL,
  obra_id UUID,
  fornecedor_id UUID,
  
  -- Observações
  observacoes TEXT,
  tags TEXT[] DEFAULT '{}',
  
  -- Metadados do Sistema
  user_id UUID NOT NULL,
  criado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  atualizado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 4. TABELA CABEÇALHOS DE DOCUMENTOS
-- =====================================================

CREATE TABLE IF NOT EXISTS cabecalhos_documentos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  codigo VARCHAR(100) UNIQUE NOT NULL,
  titulo VARCHAR(500) NOT NULL,
  descricao TEXT,
  
  -- Tipo de Cabeçalho
  tipo_cabecalho VARCHAR(50) NOT NULL CHECK (tipo_cabecalho IN (
    'relatorio', 'certificado', 'declaracao', 'formulario', 'checklist',
    'procedimento', 'instrucao', 'manual', 'especificacao', 'outro'
  )),
  
  -- Informações da Empresa
  nome_empresa VARCHAR(200) NOT NULL,
  logotipo_url TEXT,
  endereco TEXT,
  telefone VARCHAR(50),
  email VARCHAR(200),
  website VARCHAR(200),
  
  -- Informações do Projeto/Obra
  nome_projeto VARCHAR(200),
  codigo_projeto VARCHAR(100),
  localizacao_projeto TEXT,
  cliente VARCHAR(200),
  
  -- Informações do Documento
  numero_documento VARCHAR(100),
  versao_documento VARCHAR(20),
  data_emissao DATE,
  data_revisao DATE,
  
  -- Configuração do Cabeçalho
  configuracao JSONB DEFAULT '{}',
  campos_personalizados JSONB DEFAULT '[]',
  
  -- Status
  status VARCHAR(30) NOT NULL DEFAULT 'ativo' CHECK (status IN (
    'ativo', 'inativo', 'em_revisao'
  )),
  
  -- Observações
  observacoes TEXT,
  
  -- Metadados do Sistema
  user_id UUID NOT NULL,
  criado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  atualizado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 5. TABELA RELATÓRIOS
-- =====================================================

CREATE TABLE IF NOT EXISTS relatorios (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  codigo VARCHAR(100) UNIQUE NOT NULL,
  titulo VARCHAR(500) NOT NULL,
  descricao TEXT,
  
  -- Tipo de Relatório
  tipo_relatorio VARCHAR(50) NOT NULL CHECK (tipo_relatorio IN (
    'auditoria', 'inspecao', 'ensaio', 'manutencao', 'formacao',
    'acidente', 'incidente', 'nao_conformidade', 'melhoria', 'estatistico',
    'executivo', 'tecnico', 'comercial', 'financeiro', 'outro'
  )),
  categoria VARCHAR(50) NOT NULL CHECK (categoria IN (
    'qualidade', 'ambiente', 'seguranca', 'manutencao', 'formacao',
    'equipamento', 'processo', 'comercial', 'financeiro', 'outro'
  )),
  
  -- Datas
  data_criacao DATE NOT NULL,
  data_periodo_inicio DATE,
  data_periodo_fim DATE,
  data_aprovacao DATE,
  
  -- Status
  status VARCHAR(30) NOT NULL DEFAULT 'rascunho' CHECK (status IN (
    'rascunho', 'em_revisao', 'aprovado', 'rejeitado', 'publicado'
  )),
  
  -- Conteúdo
  conteudo TEXT,
  resumo_executivo TEXT,
  conclusoes TEXT,
  recomendacoes TEXT,
  
  -- Dados e Métricas
  dados_estatisticos JSONB DEFAULT '{}',
  tabelas_dados JSONB DEFAULT '[]',
  graficos_imagens JSONB DEFAULT '[]',
  
  -- Documentação
  documentos_anexos JSONB DEFAULT '[]',
  relatorio_pdf_url TEXT,
  
  -- Aprovadores
  aprovador_id UUID,
  aprovador_nome VARCHAR(200),
  aprovador_cargo VARCHAR(100),
  
  -- Relacionamentos
  certificado_id UUID REFERENCES certificados(id) ON DELETE SET NULL,
  registo_id UUID REFERENCES registos(id) ON DELETE SET NULL,
  cabecalho_id UUID REFERENCES cabecalhos_documentos(id) ON DELETE SET NULL,
  obra_id UUID,
  
  -- Observações
  observacoes TEXT,
  tags TEXT[] DEFAULT '{}',
  
  -- Metadados do Sistema
  user_id UUID NOT NULL,
  criado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  atualizado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 6. ÍNDICES PARA PERFORMANCE
-- =====================================================

-- Índices para certificados
CREATE INDEX IF NOT EXISTS idx_certificados_codigo ON certificados(codigo);
CREATE INDEX IF NOT EXISTS idx_certificados_tipo ON certificados(tipo_certificado);
CREATE INDEX IF NOT EXISTS idx_certificados_status ON certificados(status);
CREATE INDEX IF NOT EXISTS idx_certificados_data_validade ON certificados(data_validade);
CREATE INDEX IF NOT EXISTS idx_certificados_user_id ON certificados(user_id);

-- Índices para registos
CREATE INDEX IF NOT EXISTS idx_registos_codigo ON registos(codigo);
CREATE INDEX IF NOT EXISTS idx_registos_tipo ON registos(tipo_registo);
CREATE INDEX IF NOT EXISTS idx_registos_status ON registos(status);
CREATE INDEX IF NOT EXISTS idx_registos_data_registo ON registos(data_registo);
CREATE INDEX IF NOT EXISTS idx_registos_user_id ON registos(user_id);

-- Índices para termos
CREATE INDEX IF NOT EXISTS idx_termos_codigo ON termos_condicoes(codigo);
CREATE INDEX IF NOT EXISTS idx_termos_tipo ON termos_condicoes(tipo_termo);
CREATE INDEX IF NOT EXISTS idx_termos_status ON termos_condicoes(status);
CREATE INDEX IF NOT EXISTS idx_termos_user_id ON termos_condicoes(user_id);

-- Índices para cabeçalhos
CREATE INDEX IF NOT EXISTS idx_cabecalhos_codigo ON cabecalhos_documentos(codigo);
CREATE INDEX IF NOT EXISTS idx_cabecalhos_tipo ON cabecalhos_documentos(tipo_cabecalho);
CREATE INDEX IF NOT EXISTS idx_cabecalhos_user_id ON cabecalhos_documentos(user_id);

-- Índices para relatórios
CREATE INDEX IF NOT EXISTS idx_relatorios_codigo ON relatorios(codigo);
CREATE INDEX IF NOT EXISTS idx_relatorios_tipo ON relatorios(tipo_relatorio);
CREATE INDEX IF NOT EXISTS idx_relatorios_status ON relatorios(status);
CREATE INDEX IF NOT EXISTS idx_relatorios_user_id ON relatorios(user_id);

-- =====================================================
-- 7. TRIGGERS PARA ATUALIZAÇÃO AUTOMÁTICA
-- =====================================================

-- Função para atualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.atualizado_em = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para todas as tabelas
CREATE TRIGGER update_certificados_updated_at BEFORE UPDATE ON certificados FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_registos_updated_at BEFORE UPDATE ON registos FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_termos_updated_at BEFORE UPDATE ON termos_condicoes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_cabecalhos_updated_at BEFORE UPDATE ON cabecalhos_documentos FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_relatorios_updated_at BEFORE UPDATE ON relatorios FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- 8. FUNÇÕES RPC PARA ESTATÍSTICAS
-- =====================================================

-- Estatísticas de Certificados
CREATE OR REPLACE FUNCTION get_certificados_stats()
RETURNS JSON AS $$
DECLARE
    result JSON;
BEGIN
    SELECT json_build_object(
        'total_certificados', COUNT(*),
        'certificados_ativos', COUNT(*) FILTER (WHERE status = 'ativo'),
        'certificados_suspensos', COUNT(*) FILTER (WHERE status = 'suspenso'),
        'certificados_expirados', COUNT(*) FILTER (WHERE status = 'expirado'),
        'certificados_em_renovacao', COUNT(*) FILTER (WHERE status = 'em_renovacao'),
        'proximos_expiracao', COUNT(*) FILTER (WHERE data_validade BETWEEN CURRENT_DATE AND CURRENT_DATE + INTERVAL '30 days'),
        'por_tipo', (
            SELECT json_object_agg(tipo_certificado, count)
            FROM (
                SELECT tipo_certificado, COUNT(*) as count
                FROM certificados
                GROUP BY tipo_certificado
            ) t
        ),
        'por_categoria', (
            SELECT json_object_agg(categoria, count)
            FROM (
                SELECT categoria, COUNT(*) as count
                FROM certificados
                GROUP BY categoria
            ) c
        )
    ) INTO result
    FROM certificados;
    
    RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Estatísticas de Registos
CREATE OR REPLACE FUNCTION get_registos_stats()
RETURNS JSON AS $$
DECLARE
    result JSON;
BEGIN
    SELECT json_build_object(
        'total_registos', COUNT(*),
        'registos_pendentes', COUNT(*) FILTER (WHERE status = 'pendente'),
        'registos_em_andamento', COUNT(*) FILTER (WHERE status = 'em_andamento'),
        'registos_concluidos', COUNT(*) FILTER (WHERE status = 'concluido'),
        'registos_ultimos_30_dias', COUNT(*) FILTER (WHERE data_registo >= CURRENT_DATE - INTERVAL '30 days'),
        'por_tipo', (
            SELECT json_object_agg(tipo_registo, count)
            FROM (
                SELECT tipo_registo, COUNT(*) as count
                FROM registos
                GROUP BY tipo_registo
            ) t
        ),
        'por_prioridade', (
            SELECT json_object_agg(prioridade, count)
            FROM (
                SELECT prioridade, COUNT(*) as count
                FROM registos
                GROUP BY prioridade
            ) p
        )
    ) INTO result
    FROM registos;
    
    RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Estatísticas de Relatórios
CREATE OR REPLACE FUNCTION get_relatorios_stats()
RETURNS JSON AS $$
DECLARE
    result JSON;
BEGIN
    SELECT json_build_object(
        'total_relatorios', COUNT(*),
        'relatorios_rascunho', COUNT(*) FILTER (WHERE status = 'rascunho'),
        'relatorios_aprovados', COUNT(*) FILTER (WHERE status = 'aprovado'),
        'relatorios_ultimos_30_dias', COUNT(*) FILTER (WHERE data_criacao >= CURRENT_DATE - INTERVAL '30 days'),
        'por_tipo', (
            SELECT json_object_agg(tipo_relatorio, count)
            FROM (
                SELECT tipo_relatorio, COUNT(*) as count
                FROM relatorios
                GROUP BY tipo_relatorio
            ) t
        )
    ) INTO result
    FROM relatorios;
    
    RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- 9. POLÍTICAS RLS (ROW LEVEL SECURITY)
-- =====================================================

-- Habilitar RLS em todas as tabelas
ALTER TABLE certificados ENABLE ROW LEVEL SECURITY;
ALTER TABLE registos ENABLE ROW LEVEL SECURITY;
ALTER TABLE termos_condicoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE cabecalhos_documentos ENABLE ROW LEVEL SECURITY;
ALTER TABLE relatorios ENABLE ROW LEVEL SECURITY;

-- Políticas para certificados
CREATE POLICY "Usuários podem ver seus próprios certificados" ON certificados
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem inserir seus próprios certificados" ON certificados
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuários podem atualizar seus próprios certificados" ON certificados
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem deletar seus próprios certificados" ON certificados
    FOR DELETE USING (auth.uid() = user_id);

-- Políticas para registos
CREATE POLICY "Usuários podem ver seus próprios registos" ON registos
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem inserir seus próprios registos" ON registos
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuários podem atualizar seus próprios registos" ON registos
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem deletar seus próprios registos" ON registos
    FOR DELETE USING (auth.uid() = user_id);

-- Políticas para termos
CREATE POLICY "Usuários podem ver seus próprios termos" ON termos_condicoes
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem inserir seus próprios termos" ON termos_condicoes
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuários podem atualizar seus próprios termos" ON termos_condicoes
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem deletar seus próprios termos" ON termos_condicoes
    FOR DELETE USING (auth.uid() = user_id);

-- Políticas para cabeçalhos
CREATE POLICY "Usuários podem ver seus próprios cabeçalhos" ON cabecalhos_documentos
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem inserir seus próprios cabeçalhos" ON cabecalhos_documentos
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuários podem atualizar seus próprios cabeçalhos" ON cabecalhos_documentos
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem deletar seus próprios cabeçalhos" ON cabecalhos_documentos
    FOR DELETE USING (auth.uid() = user_id);

-- Políticas para relatórios
CREATE POLICY "Usuários podem ver seus próprios relatórios" ON relatorios
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem inserir seus próprios relatórios" ON relatorios
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuários podem atualizar seus próprios relatórios" ON relatorios
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem deletar seus próprios relatórios" ON relatorios
    FOR DELETE USING (auth.uid() = user_id);

-- =====================================================
-- 10. DADOS DE EXEMPLO (SIMPLIFICADOS)
-- =====================================================

-- Inserir dados de exemplo para certificados (apenas se não existirem)
INSERT INTO certificados (
    codigo, titulo, descricao, tipo_certificado, categoria, escopo,
    entidade_certificadora, data_emissao, data_validade, status, estado,
    responsavel_id, responsavel_nome, responsavel_email, user_id
) 
SELECT 
    'CERT-001', 'Certificado de Qualidade ISO 9001:2015', 
    'Certificação do Sistema de Gestão da Qualidade conforme norma ISO 9001:2015',
    'qualidade_sistema', 'sistema_gestao', 'Gestão da Qualidade em toda a organização',
    'Bureau Veritas Portugal', '2024-01-15', '2027-01-15', 'ativo', 'valido',
    uuid_generate_v4(), 'João Silva', 'joao.silva@empresa.pt', 
    (SELECT id FROM auth.users LIMIT 1)
WHERE NOT EXISTS (SELECT 1 FROM certificados WHERE codigo = 'CERT-001');

-- Inserir dados de exemplo para registos (apenas se não existirem)
INSERT INTO registos (
    codigo, titulo, descricao, tipo_registo, categoria, data_registo,
    status, prioridade, responsavel_id, responsavel_nome, responsavel_email, user_id
)
SELECT 
    'REG-001', 'Auditoria Interna de Qualidade', 
    'Auditoria interna do sistema de gestão da qualidade',
    'auditoria', 'qualidade', '2024-12-15', 'concluido', 'alta',
    uuid_generate_v4(), 'Ana Oliveira', 'ana.oliveira@empresa.pt',
    (SELECT id FROM auth.users LIMIT 1)
WHERE NOT EXISTS (SELECT 1 FROM registos WHERE codigo = 'REG-001');

-- Inserir dados de exemplo para termos (apenas se não existirem)
INSERT INTO termos_condicoes (
    codigo, titulo, descricao, tipo_termo, categoria, data_criacao, data_entrada_vigor,
    status, conteudo, responsavel_id, responsavel_nome, responsavel_email, user_id
)
SELECT 
    'TERM-001', 'Termos e Condições de Fornecimento',
    'Termos e condições aplicáveis ao fornecimento de materiais e serviços',
    'contrato', 'comercial', '2024-01-01', '2024-01-01', 'ativo',
    'Este documento estabelece os termos e condições gerais aplicáveis ao fornecimento de materiais e serviços...',
    uuid_generate_v4(), 'Luísa Mendes', 'luisa.mendes@empresa.pt',
    (SELECT id FROM auth.users LIMIT 1)
WHERE NOT EXISTS (SELECT 1 FROM termos_condicoes WHERE codigo = 'TERM-001');

-- Inserir dados de exemplo para cabeçalhos (apenas se não existirem)
INSERT INTO cabecalhos_documentos (
    codigo, titulo, descricao, tipo_cabecalho, nome_empresa, endereco, telefone, email,
    status, user_id
)
SELECT 
    'CAB-001', 'Cabeçalho Padrão Relatórios',
    'Cabeçalho padrão para todos os relatórios da empresa',
    'relatorio', 'Qualicore Lda', 'Rua das Flores, 123, Lisboa', '+351 213 456 789', 'info@qualicore.pt',
    'ativo', (SELECT id FROM auth.users LIMIT 1)
WHERE NOT EXISTS (SELECT 1 FROM cabecalhos_documentos WHERE codigo = 'CAB-001');

-- Inserir dados de exemplo para relatórios (apenas se não existirem)
INSERT INTO relatorios (
    codigo, titulo, descricao, tipo_relatorio, categoria, data_criacao,
    status, conteudo, resumo_executivo, user_id
)
SELECT 
    'REL-001', 'Relatório Anual de Qualidade 2024',
    'Relatório anual sobre o desempenho do sistema de gestão da qualidade',
    'executivo', 'qualidade', '2024-12-01', 'aprovado',
    'Este relatório apresenta uma análise detalhada do desempenho do sistema de gestão da qualidade...',
    'O sistema de gestão da qualidade demonstrou excelente desempenho em 2024...',
    (SELECT id FROM auth.users LIMIT 1)
WHERE NOT EXISTS (SELECT 1 FROM relatorios WHERE codigo = 'REL-001');

-- =====================================================
-- 11. MENSAGEM DE CONCLUSÃO
-- =====================================================

-- Esta função retorna uma mensagem de sucesso
CREATE OR REPLACE FUNCTION certificados_setup_complete()
RETURNS TEXT AS $$
BEGIN
    RETURN '✅ Setup do módulo de Certificados e Registos concluído com sucesso!
    
📊 Tabelas criadas:
- certificados
- registos  
- termos_condicoes
- cabecalhos_documentos
- relatorios

🔧 Funcionalidades implementadas:
- Índices para performance
- Triggers para atualização automática
- Funções RPC para estatísticas
- Políticas RLS para segurança
- Dados de exemplo

🎯 Próximos passos:
1. Teste o módulo no frontend
2. Configure buckets de storage se necessário
3. Personalize conforme suas necessidades';
END;
$$ LANGUAGE plpgsql;

-- Executar a função para mostrar a mensagem
SELECT certificados_setup_complete();
