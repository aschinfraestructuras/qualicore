-- =====================================================
-- SCRIPT SQL PARA SISTEMA DE CERTIFICADOS E REGISTOS
-- =====================================================

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
  atualizado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT fk_certificados_obra FOREIGN KEY (obra_id) REFERENCES obras(id) ON DELETE SET NULL,
  CONSTRAINT fk_certificados_fornecedor FOREIGN KEY (fornecedor_id) REFERENCES fornecedores(id) ON DELETE SET NULL,
  CONSTRAINT fk_certificados_material FOREIGN KEY (material_id) REFERENCES materiais(id) ON DELETE SET NULL,
  CONSTRAINT fk_certificados_user FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Índices para performance
CREATE INDEX idx_certificados_user_id ON certificados(user_id);
CREATE INDEX idx_certificados_tipo ON certificados(tipo_certificado);
CREATE INDEX idx_certificados_status ON certificados(status);
CREATE INDEX idx_certificados_data_validade ON certificados(data_validade);
CREATE INDEX idx_certificados_entidade ON certificados(entidade_certificadora);
CREATE INDEX idx_certificados_codigo ON certificados(codigo);

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
    'formacao', 'competencia', 'incidente', 'acidente', 'nao_conformidade',
    'acao_corretiva', 'acao_preventiva', 'melhoria', 'reclamacao', 
    'sugestao', 'observacao', 'medicao', 'controlo', 'verificacao', 'outro'
  )),
  categoria VARCHAR(50) NOT NULL CHECK (categoria IN (
    'qualidade', 'seguranca', 'ambiente', 'manutencao', 'formacao',
    'equipamento', 'processo', 'pessoal', 'fornecedor', 'cliente', 'outro'
  )),
  
  -- Informações do Registo
  data_registo DATE NOT NULL,
  hora_registo TIME,
  local_registo VARCHAR(200),
  zona_obra VARCHAR(100),
  
  -- Responsáveis
  registador_id UUID NOT NULL,
  registador_nome VARCHAR(200) NOT NULL,
  responsavel_id UUID,
  responsavel_nome VARCHAR(200),
  
  -- Status e Prioridade
  status VARCHAR(30) NOT NULL DEFAULT 'aberto' CHECK (status IN (
    'aberto', 'em_analise', 'em_execucao', 'concluido', 'fechado', 
    'cancelado', 'suspenso', 'aguardando_aprovacao', 'aprovado', 'rejeitado'
  )),
  prioridade VARCHAR(20) NOT NULL DEFAULT 'media' CHECK (prioridade IN (
    'baixa', 'media', 'alta', 'critica', 'urgente'
  )),
  
  -- Resultados e Conclusões
  resultado TEXT,
  conclusao TEXT,
  acoes_necessarias TEXT[] DEFAULT '{}',
  prazo_execucao DATE,
  
  -- Documentação
  documentos_anexos JSONB DEFAULT '{}',
  fotografias JSONB DEFAULT '{}',
  relatorios JSONB DEFAULT '{}',
  
  -- Relacionamentos
  certificado_id UUID,
  obra_id UUID,
  fornecedor_id UUID,
  material_id UUID,
  equipamento_id UUID,
  nao_conformidade_id UUID,
  
  -- Observações e Metadados
  observacoes TEXT,
  palavras_chave TEXT[] DEFAULT '{}',
  tags TEXT[] DEFAULT '{}',
  
  -- Metadados do Sistema
  user_id UUID NOT NULL,
  criado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  atualizado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT fk_registos_certificado FOREIGN KEY (certificado_id) REFERENCES certificados(id) ON DELETE SET NULL,
  CONSTRAINT fk_registos_obra FOREIGN KEY (obra_id) REFERENCES obras(id) ON DELETE SET NULL,
  CONSTRAINT fk_registos_fornecedor FOREIGN KEY (fornecedor_id) REFERENCES fornecedores(id) ON DELETE SET NULL,
  CONSTRAINT fk_registos_material FOREIGN KEY (material_id) REFERENCES materiais(id) ON DELETE SET NULL,
  CONSTRAINT fk_registos_user FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Índices para performance
CREATE INDEX idx_registos_user_id ON registos(user_id);
CREATE INDEX idx_registos_tipo ON registos(tipo_registo);
CREATE INDEX idx_registos_status ON registos(status);
CREATE INDEX idx_registos_data ON registos(data_registo);
CREATE INDEX idx_registos_certificado_id ON registos(certificado_id);

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
    'contrato', 'subcontrato', 'fornecimento', 'servico', 'licenca',
    'autorizacao', 'acordo', 'protocolo', 'memorando', 'termo_aceitacao',
    'termo_responsabilidade', 'termo_confidencialidade', 'outro'
  )),
  categoria VARCHAR(50) NOT NULL CHECK (categoria IN (
    'comercial', 'tecnico', 'legal', 'seguranca', 'ambiente', 
    'qualidade', 'recursos_humanos', 'fornecedor', 'cliente', 'outro'
  )),
  
  -- Informações do Termo
  versao VARCHAR(20) NOT NULL DEFAULT '1.0',
  data_emissao DATE NOT NULL,
  data_validade DATE,
  data_revisao DATE,
  
  -- Partes Envolvidas
  parte_1_nome VARCHAR(200) NOT NULL,
  parte_1_tipo VARCHAR(50) NOT NULL CHECK (parte_1_tipo IN ('empresa', 'pessoa', 'entidade', 'organismo')),
  parte_1_nif VARCHAR(50),
  parte_1_endereco TEXT,
  parte_1_contacto VARCHAR(200),
  
  parte_2_nome VARCHAR(200),
  parte_2_tipo VARCHAR(50) CHECK (parte_2_tipo IN ('empresa', 'pessoa', 'entidade', 'organismo')),
  parte_2_nif VARCHAR(50),
  parte_2_endereco TEXT,
  parte_2_contacto VARCHAR(200),
  
  -- Conteúdo e Condições
  objeto_contrato TEXT NOT NULL,
  condicoes_gerais TEXT,
  condicoes_especificas TEXT,
  obrigacoes_parte_1 TEXT[] DEFAULT '{}',
  obrigacoes_parte_2 TEXT[] DEFAULT '{}',
  
  -- Valores e Prazos
  valor_contrato DECIMAL(15,2),
  moeda VARCHAR(10) DEFAULT 'EUR',
  prazo_execucao DATE,
  prazo_pagamento VARCHAR(100),
  
  -- Status e Aprovação
  status VARCHAR(30) NOT NULL DEFAULT 'rascunho' CHECK (status IN (
    'rascunho', 'em_revisao', 'aguardando_aprovacao', 'aprovado', 
    'assinado', 'ativo', 'concluido', 'cancelado', 'suspenso'
  )),
  aprovador_id UUID,
  aprovador_nome VARCHAR(200),
  data_aprovacao DATE,
  
  -- Documentação
  documento_original JSONB DEFAULT '{}',
  anexos JSONB DEFAULT '{}',
  assinaturas JSONB DEFAULT '{}',
  
  -- Relacionamentos
  certificado_id UUID,
  obra_id UUID,
  fornecedor_id UUID,
  
  -- Observações e Metadados
  observacoes TEXT,
  palavras_chave TEXT[] DEFAULT '{}',
  tags TEXT[] DEFAULT '{}',
  classificacao_confidencialidade VARCHAR(20) DEFAULT 'confidencial' CHECK (classificacao_confidencialidade IN (
    'publico', 'interno', 'confidencial', 'restrito'
  )),
  
  -- Metadados do Sistema
  user_id UUID NOT NULL,
  criado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  atualizado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT fk_termos_certificado FOREIGN KEY (certificado_id) REFERENCES certificados(id) ON DELETE SET NULL,
  CONSTRAINT fk_termos_obra FOREIGN KEY (obra_id) REFERENCES obras(id) ON DELETE SET NULL,
  CONSTRAINT fk_termos_fornecedor FOREIGN KEY (fornecedor_id) REFERENCES fornecedores(id) ON DELETE SET NULL,
  CONSTRAINT fk_termos_user FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Índices para performance
CREATE INDEX idx_termos_user_id ON termos_condicoes(user_id);
CREATE INDEX idx_termos_tipo ON termos_condicoes(tipo_termo);
CREATE INDEX idx_termos_status ON termos_condicoes(status);
CREATE INDEX idx_termos_data_emissao ON termos_condicoes(data_emissao);

-- =====================================================
-- 4. TABELA CABEÇALHOS DE DOCUMENTOS
-- =====================================================

CREATE TABLE IF NOT EXISTS cabecalhos_documentos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  codigo VARCHAR(100) UNIQUE NOT NULL,
  nome VARCHAR(200) NOT NULL,
  descricao TEXT,
  
  -- Tipo de Cabeçalho
  tipo_cabecalho VARCHAR(50) NOT NULL CHECK (tipo_cabecalho IN (
    'relatorio', 'certificado', 'registro', 'formulario', 'checklist',
    'procedimento', 'instrucao', 'manual', 'especificacao', 'outro'
  )),
  
  -- Informações da Empresa
  empresa_nome VARCHAR(200) NOT NULL,
  empresa_logo_url TEXT,
  empresa_nif VARCHAR(50),
  empresa_endereco TEXT,
  empresa_telefone VARCHAR(50),
  empresa_email VARCHAR(200),
  empresa_website VARCHAR(200),
  
  -- Informações do Projeto/Obra
  projeto_nome VARCHAR(200),
  projeto_codigo VARCHAR(100),
  obra_nome VARCHAR(200),
  obra_codigo VARCHAR(100),
  localizacao VARCHAR(200),
  
  -- Informações do Documento
  documento_titulo VARCHAR(500),
  documento_codigo VARCHAR(100),
  documento_versao VARCHAR(20),
  documento_data DATE,
  
  -- Informações do Responsável
  responsavel_nome VARCHAR(200),
  responsavel_cargo VARCHAR(100),
  responsavel_assinatura_url TEXT,
  
  -- Configurações do Cabeçalho
  incluir_logo BOOLEAN DEFAULT true,
  incluir_empresa BOOLEAN DEFAULT true,
  incluir_projeto BOOLEAN DEFAULT true,
  incluir_responsavel BOOLEAN DEFAULT true,
  incluir_data BOOLEAN DEFAULT true,
  incluir_versao BOOLEAN DEFAULT true,
  
  -- Estilo e Formatação
  cor_primaria VARCHAR(7) DEFAULT '#3B82F6',
  cor_secundaria VARCHAR(7) DEFAULT '#1E40AF',
  fonte_principal VARCHAR(50) DEFAULT 'Arial',
  tamanho_fonte INTEGER DEFAULT 12,
  
  -- Status
  ativo BOOLEAN DEFAULT true,
  padrao BOOLEAN DEFAULT false,
  
  -- Metadados do Sistema
  user_id UUID NOT NULL,
  criado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  atualizado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT fk_cabecalhos_user FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Índices para performance
CREATE INDEX idx_cabecalhos_user_id ON cabecalhos_documentos(user_id);
CREATE INDEX idx_cabecalhos_tipo ON cabecalhos_documentos(tipo_cabecalho);
CREATE INDEX idx_cabecalhos_ativo ON cabecalhos_documentos(ativo);

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
    'auditoria', 'inspecao', 'ensaio', 'calibracao', 'manutencao',
    'formacao', 'competencia', 'incidente', 'acidente', 'nao_conformidade',
    'acao_corretiva', 'acao_preventiva', 'melhoria', 'reclamacao',
    'sugestao', 'observacao', 'medicao', 'controlo', 'verificacao',
    'certificacao', 'renovacao', 'suspensao', 'cancelamento', 'outro'
  )),
  categoria VARCHAR(50) NOT NULL CHECK (categoria IN (
    'qualidade', 'seguranca', 'ambiente', 'manutencao', 'formacao',
    'equipamento', 'processo', 'pessoal', 'fornecedor', 'cliente', 'outro'
  )),
  
  -- Informações do Relatório
  data_relatorio DATE NOT NULL,
  periodo_inicio DATE,
  periodo_fim DATE,
  local_relatorio VARCHAR(200),
  
  -- Responsáveis
  autor_id UUID NOT NULL,
  autor_nome VARCHAR(200) NOT NULL,
  revisor_id UUID,
  revisor_nome VARCHAR(200),
  aprovador_id UUID,
  aprovador_nome VARCHAR(200),
  
  -- Status e Aprovação
  status VARCHAR(30) NOT NULL DEFAULT 'rascunho' CHECK (status IN (
    'rascunho', 'em_revisao', 'aguardando_aprovacao', 'aprovado',
    'publicado', 'arquivado', 'cancelado'
  )),
  data_aprovacao DATE,
  data_publicacao DATE,
  
  -- Conteúdo do Relatório
  resumo_executivo TEXT,
  introducao TEXT,
  metodologia TEXT,
  resultados TEXT,
  conclusoes TEXT,
  recomendacoes TEXT[] DEFAULT '{}',
  acoes_necessarias TEXT[] DEFAULT '{}',
  
  -- Documentação
  documentos_anexos JSONB DEFAULT '{}',
  tabelas_dados JSONB DEFAULT '{}',
  graficos_imagens JSONB DEFAULT '{}',
  
  -- Cabeçalho e Formatação
  cabecalho_id UUID,
  formato_saida VARCHAR(20) DEFAULT 'pdf' CHECK (formato_saida IN ('pdf', 'docx', 'html', 'txt')),
  
  -- Relacionamentos
  certificado_id UUID,
  registro_id UUID,
  obra_id UUID,
  fornecedor_id UUID,
  
  -- Observações e Metadados
  observacoes TEXT,
  palavras_chave TEXT[] DEFAULT '{}',
  tags TEXT[] DEFAULT '{}',
  classificacao_confidencialidade VARCHAR(20) DEFAULT 'interno' CHECK (classificacao_confidencialidade IN (
    'publico', 'interno', 'confidencial', 'restrito'
  )),
  
  -- Metadados do Sistema
  user_id UUID NOT NULL,
  criado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  atualizado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT fk_relatorios_cabecalho FOREIGN KEY (cabecalho_id) REFERENCES cabecalhos_documentos(id) ON DELETE SET NULL,
  CONSTRAINT fk_relatorios_certificado FOREIGN KEY (certificado_id) REFERENCES certificados(id) ON DELETE SET NULL,
  CONSTRAINT fk_relatorios_registro FOREIGN KEY (registro_id) REFERENCES registos(id) ON DELETE SET NULL,
  CONSTRAINT fk_relatorios_obra FOREIGN KEY (obra_id) REFERENCES obras(id) ON DELETE SET NULL,
  CONSTRAINT fk_relatorios_fornecedor FOREIGN KEY (fornecedor_id) REFERENCES fornecedores(id) ON DELETE SET NULL,
  CONSTRAINT fk_relatorios_user FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Índices para performance
CREATE INDEX idx_relatorios_user_id ON relatorios(user_id);
CREATE INDEX idx_relatorios_tipo ON relatorios(tipo_relatorio);
CREATE INDEX idx_relatorios_status ON relatorios(status);
CREATE INDEX idx_relatorios_data ON relatorios(data_relatorio);
CREATE INDEX idx_relatorios_certificado_id ON relatorios(certificado_id);

-- =====================================================
-- 6. FUNÇÕES DE ATUALIZAÇÃO AUTOMÁTICA
-- =====================================================

-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.atualizado_em = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para atualizar updated_at
CREATE TRIGGER update_certificados_updated_at BEFORE UPDATE ON certificados
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_registos_updated_at BEFORE UPDATE ON registos
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_termos_condicoes_updated_at BEFORE UPDATE ON termos_condicoes
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_cabecalhos_documentos_updated_at BEFORE UPDATE ON cabecalhos_documentos
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_relatorios_updated_at BEFORE UPDATE ON relatorios
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- 7. FUNÇÕES DE ESTATÍSTICAS
-- =====================================================

-- Função para obter estatísticas de certificados
CREATE OR REPLACE FUNCTION get_certificados_stats()
RETURNS JSON AS $$
DECLARE
    result JSON;
BEGIN
    SELECT json_build_object(
        'total_certificados', COUNT(*),
        'certificados_ativos', COUNT(*) FILTER (WHERE status = 'ativo'),
        'certificados_suspensos', COUNT(*) FILTER (WHERE status = 'suspenso'),
        'certificados_cancelados', COUNT(*) FILTER (WHERE status = 'cancelado'),
        'certificados_expirados', COUNT(*) FILTER (WHERE status = 'expirado'),
        'proximos_expiracao', COUNT(*) FILTER (WHERE data_validade BETWEEN CURRENT_DATE AND (CURRENT_DATE + INTERVAL '30 days')),
        'distribuicao_tipos', (
            SELECT json_object_agg(tipo_certificado, count)
            FROM (
                SELECT tipo_certificado, COUNT(*) as count
                FROM certificados
                GROUP BY tipo_certificado
            ) t
        ),
        'distribuicao_entidades', (
            SELECT json_object_agg(entidade_certificadora, count)
            FROM (
                SELECT entidade_certificadora, COUNT(*) as count
                FROM certificados
                GROUP BY entidade_certificadora
            ) t
        )
    ) INTO result
    FROM certificados;
    
    RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Função para obter estatísticas de registos
CREATE OR REPLACE FUNCTION get_registos_stats()
RETURNS JSON AS $$
DECLARE
    result JSON;
BEGIN
    SELECT json_build_object(
        'total_registos', COUNT(*),
        'registos_abertos', COUNT(*) FILTER (WHERE status = 'aberto'),
        'registos_em_execucao', COUNT(*) FILTER (WHERE status = 'em_execucao'),
        'registos_concluidos', COUNT(*) FILTER (WHERE status = 'concluido'),
        'registos_fechados', COUNT(*) FILTER (WHERE status = 'fechado'),
        'registos_urgentes', COUNT(*) FILTER (WHERE prioridade = 'urgente'),
        'registos_criticos', COUNT(*) FILTER (WHERE prioridade = 'critica'),
        'distribuicao_tipos', (
            SELECT json_object_agg(tipo_registo, count)
            FROM (
                SELECT tipo_registo, COUNT(*) as count
                FROM registos
                GROUP BY tipo_registo
            ) t
        ),
        'registos_ultimos_30_dias', COUNT(*) FILTER (WHERE data_registo >= CURRENT_DATE - INTERVAL '30 days')
    ) INTO result
    FROM registos;
    
    RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Função para obter estatísticas de relatórios
CREATE OR REPLACE FUNCTION get_relatorios_stats()
RETURNS JSON AS $$
DECLARE
    result JSON;
BEGIN
    SELECT json_build_object(
        'total_relatorios', COUNT(*),
        'relatorios_rascunho', COUNT(*) FILTER (WHERE status = 'rascunho'),
        'relatorios_aprovados', COUNT(*) FILTER (WHERE status = 'aprovado'),
        'relatorios_publicados', COUNT(*) FILTER (WHERE status = 'publicado'),
        'relatorios_ultimos_30_dias', COUNT(*) FILTER (WHERE data_relatorio >= CURRENT_DATE - INTERVAL '30 days'),
        'distribuicao_tipos', (
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
$$ LANGUAGE plpgsql;

-- =====================================================
-- 8. ROW LEVEL SECURITY (RLS)
-- =====================================================

-- Habilitar RLS em todas as tabelas
ALTER TABLE certificados ENABLE ROW LEVEL SECURITY;
ALTER TABLE registos ENABLE ROW LEVEL SECURITY;
ALTER TABLE termos_condicoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE cabecalhos_documentos ENABLE ROW LEVEL SECURITY;
ALTER TABLE relatorios ENABLE ROW LEVEL SECURITY;

-- Políticas para certificados
CREATE POLICY "Certificados: usuário pode ver seus certificados" ON certificados
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Certificados: usuário pode criar seus certificados" ON certificados
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Certificados: usuário pode editar seus certificados" ON certificados
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Certificados: usuário pode deletar seus certificados" ON certificados
  FOR DELETE USING (auth.uid() = user_id);

-- Políticas para registos
CREATE POLICY "Registos: usuário pode ver seus registos" ON registos
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Registos: usuário pode criar seus registos" ON registos
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Registos: usuário pode editar seus registos" ON registos
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Registos: usuário pode deletar seus registos" ON registos
  FOR DELETE USING (auth.uid() = user_id);

-- Políticas para termos e condições
CREATE POLICY "Termos: usuário pode ver seus termos" ON termos_condicoes
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Termos: usuário pode criar seus termos" ON termos_condicoes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Termos: usuário pode editar seus termos" ON termos_condicoes
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Termos: usuário pode deletar seus termos" ON termos_condicoes
  FOR DELETE USING (auth.uid() = user_id);

-- Políticas para cabeçalhos
CREATE POLICY "Cabecalhos: usuário pode ver seus cabeçalhos" ON cabecalhos_documentos
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Cabecalhos: usuário pode criar seus cabeçalhos" ON cabecalhos_documentos
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Cabecalhos: usuário pode editar seus cabeçalhos" ON cabecalhos_documentos
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Cabecalhos: usuário pode deletar seus cabeçalhos" ON cabecalhos_documentos
  FOR DELETE USING (auth.uid() = user_id);

-- Políticas para relatórios
CREATE POLICY "Relatorios: usuário pode ver seus relatórios" ON relatorios
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Relatorios: usuário pode criar seus relatórios" ON relatorios
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Relatorios: usuário pode editar seus relatórios" ON relatorios
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Relatorios: usuário pode deletar seus relatórios" ON relatorios
  FOR DELETE USING (auth.uid() = user_id);

-- =====================================================
-- 9. DADOS INICIAIS (OPCIONAL)
-- =====================================================

-- Inserir cabeçalho padrão
INSERT INTO cabecalhos_documentos (
  codigo, nome, descricao, tipo_cabecalho,
  empresa_nome, empresa_nif, empresa_endereco, empresa_telefone, empresa_email,
  documento_titulo, documento_codigo, documento_versao,
  ativo, padrao, user_id
) VALUES (
  'CAB-001', 'Cabeçalho Padrão Qualicore', 'Cabeçalho padrão para documentos da Qualicore',
  'relatorio',
  'Qualicore - Gestão de Qualidade', '123456789', 'Rua da Qualidade, 123, Lisboa', '+351 123 456 789', 'info@qualicore.pt',
  'Relatório de Certificação', 'REL-CERT-001', '1.0',
  true, true, (SELECT id FROM auth.users LIMIT 1)
) ON CONFLICT (codigo) DO NOTHING;

-- =====================================================
-- FIM DO SCRIPT
-- =====================================================
