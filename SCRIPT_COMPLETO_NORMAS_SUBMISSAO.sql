-- =====================================================
-- SCRIPT COMPLETO PARA NORMAS E SUBMISSÃO DE MATERIAIS
-- =====================================================
-- Execute este script diretamente no SQL Editor do Supabase Dashboard

-- =====================================================
-- 1. EXTENSÕES NECESSÁRIAS
-- =====================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- 2. TABELA NORMAS
-- =====================================================

CREATE TABLE IF NOT EXISTS normas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  codigo VARCHAR(50) UNIQUE NOT NULL,
  titulo VARCHAR(500) NOT NULL,
  descricao TEXT,
  categoria VARCHAR(100) NOT NULL,
  subcategoria VARCHAR(100),
  organismo VARCHAR(50) NOT NULL,
  versao VARCHAR(20) NOT NULL,
  data_publicacao DATE NOT NULL,
  data_entrada_vigor DATE NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'ATIVA',
  escopo TEXT,
  aplicabilidade TEXT[],
  requisitos_principais TEXT[],
  metodos_ensaio TEXT[],
  limites_aceitacao JSONB,
  documentos_relacionados TEXT[],
  documentos_anexos JSONB DEFAULT '[]',
  observacoes TEXT,
  tags TEXT[],
  prioridade VARCHAR(20) NOT NULL DEFAULT 'MEDIA',
  ultima_atualizacao TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  criado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  atualizado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 3. TABELA VERSÕES DE NORMAS
-- =====================================================

CREATE TABLE IF NOT EXISTS versoes_normas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  norma_id UUID NOT NULL REFERENCES normas(id) ON DELETE CASCADE,
  versao VARCHAR(20) NOT NULL,
  data_publicacao DATE NOT NULL,
  data_entrada_vigor DATE NOT NULL,
  alteracoes_principais TEXT[],
  status VARCHAR(20) NOT NULL DEFAULT 'ATUAL',
  documento_url TEXT,
  observacoes TEXT,
  criado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(norma_id, versao)
);

-- =====================================================
-- 4. TABELA APLICAÇÕES DE NORMAS
-- =====================================================

CREATE TABLE IF NOT EXISTS aplicacoes_normas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  norma_id UUID NOT NULL REFERENCES normas(id) ON DELETE CASCADE,
  modulo_id UUID NOT NULL,
  modulo_tipo VARCHAR(100) NOT NULL,
  aplicabilidade VARCHAR(30) NOT NULL,
  requisitos_especificos TEXT[],
  verificacoes_necessarias TEXT[],
  frequencia_verificacao VARCHAR(100),
  responsavel_verificacao VARCHAR(100),
  criado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  atualizado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 5. TABELA NOTIFICAÇÕES DE NORMAS
-- =====================================================

CREATE TABLE IF NOT EXISTS notificacoes_normas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  norma_id UUID REFERENCES normas(id) ON DELETE CASCADE,
  tipo VARCHAR(50) NOT NULL,
  titulo VARCHAR(200) NOT NULL,
  mensagem TEXT NOT NULL,
  prioridade VARCHAR(20) NOT NULL DEFAULT 'MEDIA',
  destinatarios TEXT[] NOT NULL,
  lida BOOLEAN DEFAULT FALSE,
  data_envio TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  data_leitura TIMESTAMP WITH TIME ZONE
);

-- =====================================================
-- 6. TABELA SUBMISSÕES DE MATERIAIS
-- =====================================================

CREATE TABLE IF NOT EXISTS submissoes_materiais (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  codigo VARCHAR(50) UNIQUE NOT NULL,
  titulo VARCHAR(500) NOT NULL,
  descricao TEXT,
  
  -- Informações do Material
  tipo_material VARCHAR(50) NOT NULL CHECK (tipo_material IN ('betao', 'aco', 'agregado', 'cimento', 'madeira', 'vidro', 'isolamento', 'impermeabilizacao', 'pavimento', 'sinalizacao', 'equipamento', 'ferramenta', 'outro')),
  categoria VARCHAR(50) NOT NULL CHECK (categoria IN ('estrutural', 'acabamento', 'instalacao', 'equipamento', 'consumivel', 'seguranca', 'ambiente', 'outro')),
  especificacoes_tecnicas TEXT,
  normas_referencia TEXT[] DEFAULT '{}',
  certificados_necessarios TEXT[] DEFAULT '{}',
  
  -- Informações da Submissão
  submissor_id UUID NOT NULL,
  submissor_nome VARCHAR(200) NOT NULL,
  data_submissao DATE NOT NULL,
  prioridade VARCHAR(20) NOT NULL DEFAULT 'media' CHECK (prioridade IN ('baixa', 'media', 'alta', 'critica')),
  urgencia VARCHAR(20) NOT NULL DEFAULT 'normal' CHECK (urgencia IN ('normal', 'urgente', 'muito_urgente')),
  
  -- Estado e Aprovação
  estado VARCHAR(30) NOT NULL DEFAULT 'rascunho' CHECK (estado IN ('rascunho', 'submetido', 'em_revisao', 'aguardando_aprovacao', 'aprovado', 'rejeitado', 'solicitado_alteracao', 'cancelado', 'concluido')),
  aprovador_id UUID,
  aprovador_nome VARCHAR(200),
  data_aprovacao DATE,
  data_rejeicao DATE,
  motivo_rejeicao TEXT,
  
  -- Documentação
  documentos_anexos JSONB DEFAULT '[]',
  especificacoes_detalhadas TEXT,
  justificativa_necessidade TEXT,
  impacto_custo DECIMAL(15,2),
  impacto_prazo INTEGER,
  
  -- Workflow
  etapa_atual JSONB,
  historico_aprovacoes JSONB DEFAULT '[]',
  comentarios JSONB DEFAULT '[]',
  
  -- Relacionamentos
  obra_id UUID,
  obra_nome VARCHAR(200),
  fornecedor_sugerido VARCHAR(200),
  fornecedor_alternativo VARCHAR(200),
  
  -- Metadados
  tags TEXT[] DEFAULT '{}',
  observacoes TEXT,
  data_limite_aprovacao DATE,
  
  -- Auditoria
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  criado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  atualizado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 7. TABELA WORKFLOWS DE APROVAÇÃO
-- =====================================================

CREATE TABLE IF NOT EXISTS workflows_aprovacao (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nome VARCHAR(200) NOT NULL,
  descricao TEXT,
  etapas JSONB DEFAULT '[]',
  aprovadores_por_etapa JSONB DEFAULT '{}',
  tempo_limite_etapa JSONB DEFAULT '{}',
  ativo BOOLEAN DEFAULT TRUE,
  
  -- Auditoria
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  criado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  atualizado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 8. TABELA ETAPAS DO WORKFLOW
-- =====================================================

CREATE TABLE IF NOT EXISTS etapas_workflow (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workflow_id UUID NOT NULL REFERENCES workflows_aprovacao(id) ON DELETE CASCADE,
  nome VARCHAR(200) NOT NULL,
  descricao TEXT,
  ordem INTEGER NOT NULL,
  tipo_aprovacao VARCHAR(20) NOT NULL DEFAULT 'unica' CHECK (tipo_aprovacao IN ('unica', 'multipla', 'paralela')),
  aprovadores_obrigatorios INTEGER DEFAULT 1,
  aprovadores_opcionais INTEGER DEFAULT 0,
  criterios_aprovacao TEXT[] DEFAULT '{}',
  acoes_disponiveis JSONB DEFAULT '[]',
  
  -- Auditoria
  criado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  atualizado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 9. TABELA HISTÓRICO DE APROVAÇÕES
-- =====================================================

CREATE TABLE IF NOT EXISTS historico_aprovacoes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  submissao_id UUID NOT NULL REFERENCES submissoes_materiais(id) ON DELETE CASCADE,
  data TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  aprovador_id UUID NOT NULL,
  aprovador_nome VARCHAR(200) NOT NULL,
  acao VARCHAR(30) NOT NULL CHECK (acao IN ('aprovado', 'rejeitado', 'solicitado_alteracao', 'encaminhado')),
  comentario TEXT,
  alteracoes_solicitadas TEXT[] DEFAULT '{}',
  
  -- Auditoria
  criado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 10. TABELA COMENTÁRIOS DE SUBMISSÃO
-- =====================================================

CREATE TABLE IF NOT EXISTS comentarios_submissao (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  submissao_id UUID NOT NULL REFERENCES submissoes_materiais(id) ON DELETE CASCADE,
  data TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  autor_id UUID NOT NULL,
  autor_nome VARCHAR(200) NOT NULL,
  comentario TEXT NOT NULL,
  tipo VARCHAR(20) NOT NULL DEFAULT 'observacao' CHECK (tipo IN ('pergunta', 'sugestao', 'observacao', 'correcao')),
  resolvido BOOLEAN DEFAULT FALSE,
  
  -- Auditoria
  criado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  atualizado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 11. ÍNDICES PARA PERFORMANCE
-- =====================================================

-- Índices para normas
CREATE INDEX IF NOT EXISTS idx_normas_codigo ON normas(codigo);
CREATE INDEX IF NOT EXISTS idx_normas_categoria ON normas(categoria);
CREATE INDEX IF NOT EXISTS idx_normas_organismo ON normas(organismo);
CREATE INDEX IF NOT EXISTS idx_normas_status ON normas(status);
CREATE INDEX IF NOT EXISTS idx_normas_data_publicacao ON normas(data_publicacao);

-- Índices para submissões
CREATE INDEX IF NOT EXISTS idx_submissoes_codigo ON submissoes_materiais(codigo);
CREATE INDEX IF NOT EXISTS idx_submissoes_estado ON submissoes_materiais(estado);
CREATE INDEX IF NOT EXISTS idx_submissoes_tipo_material ON submissoes_materiais(tipo_material);
CREATE INDEX IF NOT EXISTS idx_submissoes_submissor_id ON submissoes_materiais(submissor_id);
CREATE INDEX IF NOT EXISTS idx_submissoes_data_submissao ON submissoes_materiais(data_submissao);

-- =====================================================
-- 12. FUNÇÃO PARA ATUALIZAR TIMESTAMP
-- =====================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.atualizado_em = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- =====================================================
-- 13. TRIGGERS PARA ATUALIZAR TIMESTAMP
-- =====================================================

CREATE TRIGGER update_normas_updated_at BEFORE UPDATE ON normas FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_aplicacoes_normas_updated_at BEFORE UPDATE ON aplicacoes_normas FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_submissoes_materiais_updated_at BEFORE UPDATE ON submissoes_materiais FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_workflows_aprovacao_updated_at BEFORE UPDATE ON workflows_aprovacao FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_etapas_workflow_updated_at BEFORE UPDATE ON etapas_workflow FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_comentarios_submissao_updated_at BEFORE UPDATE ON comentarios_submissao FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- 14. FUNÇÃO PARA ESTATÍSTICAS DE NORMAS
-- =====================================================

CREATE OR REPLACE FUNCTION get_normas_stats()
RETURNS JSON AS $$
DECLARE
    result JSON;
BEGIN
    SELECT json_build_object(
        'total_normas', COUNT(*),
        'normas_ativas', COUNT(*) FILTER (WHERE status = 'ATIVA'),
        'normas_revisao', COUNT(*) FILTER (WHERE status = 'REVISAO'),
        'normas_obsoletas', COUNT(*) FILTER (WHERE status = 'OBSOLETA'),
        'distribuicao_categorias', (
            SELECT json_object_agg(categoria, count)
            FROM (
                SELECT categoria, COUNT(*) as count
                FROM normas
                GROUP BY categoria
            ) t
        ),
        'distribuicao_organismos', (
            SELECT json_object_agg(organismo, count)
            FROM (
                SELECT organismo, COUNT(*) as count
                FROM normas
                GROUP BY organismo
            ) t
        ),
        'normas_recentes', COUNT(*) FILTER (WHERE data_publicacao >= CURRENT_DATE - INTERVAL '30 days'),
        'normas_vencendo', COUNT(*) FILTER (WHERE data_entrada_vigor <= CURRENT_DATE + INTERVAL '90 days' AND data_entrada_vigor > CURRENT_DATE)
    ) INTO result
    FROM normas;
    
    RETURN result;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- 15. FUNÇÃO PARA ESTATÍSTICAS DE SUBMISSÕES
-- =====================================================

CREATE OR REPLACE FUNCTION get_submissoes_materiais_stats()
RETURNS JSON AS $$
DECLARE
    result JSON;
BEGIN
    SELECT json_build_object(
        'total_submissoes', COUNT(*),
        'submissoes_por_estado', (
            SELECT json_object_agg(estado, count)
            FROM (
                SELECT estado, COUNT(*) as count
                FROM submissoes_materiais
                GROUP BY estado
            ) t
        ),
        'submissoes_por_tipo', (
            SELECT json_object_agg(tipo_material, count)
            FROM (
                SELECT tipo_material, COUNT(*) as count
                FROM submissoes_materiais
                GROUP BY tipo_material
            ) t
        ),
        'submissoes_por_prioridade', (
            SELECT json_object_agg(prioridade, count)
            FROM (
                SELECT prioridade, COUNT(*) as count
                FROM submissoes_materiais
                GROUP BY prioridade
            ) t
        ),
        'tempo_medio_aprovacao', 0,
        'taxa_aprovacao', (
            CASE 
                WHEN COUNT(*) = 0 THEN 0
                ELSE ROUND((COUNT(*) FILTER (WHERE estado = 'aprovado')::DECIMAL / COUNT(*)) * 100, 2)
            END
        ),
        'submissoes_urgentes', COUNT(*) FILTER (WHERE urgencia IN ('urgente', 'muito_urgente')),
        'submissoes_atrasadas', COUNT(*) FILTER (WHERE data_limite_aprovacao < CURRENT_DATE AND estado NOT IN ('aprovado', 'rejeitado', 'cancelado')),
        'submissoes_mes_atual', COUNT(*) FILTER (WHERE data_submissao >= DATE_TRUNC('month', CURRENT_DATE)),
        'submissoes_mes_anterior', COUNT(*) FILTER (WHERE data_submissao >= DATE_TRUNC('month', CURRENT_DATE - INTERVAL '1 month') AND data_submissao < DATE_TRUNC('month', CURRENT_DATE))
    ) INTO result
    FROM submissoes_materiais;
    
    RETURN result;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- 16. ROW LEVEL SECURITY (RLS)
-- =====================================================

-- Ativar RLS em todas as tabelas
ALTER TABLE normas ENABLE ROW LEVEL SECURITY;
ALTER TABLE versoes_normas ENABLE ROW LEVEL SECURITY;
ALTER TABLE aplicacoes_normas ENABLE ROW LEVEL SECURITY;
ALTER TABLE notificacoes_normas ENABLE ROW LEVEL SECURITY;
ALTER TABLE submissoes_materiais ENABLE ROW LEVEL SECURITY;
ALTER TABLE workflows_aprovacao ENABLE ROW LEVEL SECURITY;
ALTER TABLE etapas_workflow ENABLE ROW LEVEL SECURITY;
ALTER TABLE historico_aprovacoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE comentarios_submissao ENABLE ROW LEVEL SECURITY;

-- Políticas para normas
CREATE POLICY "Normas são visíveis para todos os usuários autenticados" ON normas FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Usuários autenticados podem criar normas" ON normas FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Usuários autenticados podem atualizar normas" ON normas FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Usuários autenticados podem deletar normas" ON normas FOR DELETE USING (auth.role() = 'authenticated');

-- Políticas para submissões
CREATE POLICY "Submissões são visíveis para todos os usuários autenticados" ON submissoes_materiais FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Usuários autenticados podem criar submissões" ON submissoes_materiais FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Usuários autenticados podem atualizar submissões" ON submissoes_materiais FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Usuários autenticados podem deletar submissões" ON submissoes_materiais FOR DELETE USING (auth.role() = 'authenticated');

-- Políticas para outras tabelas
CREATE POLICY "Versões são visíveis para todos os usuários autenticados" ON versoes_normas FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Aplicações são visíveis para todos os usuários autenticados" ON aplicacoes_normas FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Notificações são visíveis para todos os usuários autenticados" ON notificacoes_normas FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Workflows são visíveis para todos os usuários autenticados" ON workflows_aprovacao FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Etapas são visíveis para todos os usuários autenticados" ON etapas_workflow FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Histórico é visível para todos os usuários autenticados" ON historico_aprovacoes FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Comentários são visíveis para todos os usuários autenticados" ON comentarios_submissao FOR ALL USING (auth.role() = 'authenticated');

-- =====================================================
-- 17. DADOS DE EXEMPLO - NORMAS
-- =====================================================

INSERT INTO normas (codigo, titulo, descricao, categoria, subcategoria, organismo, versao, data_publicacao, data_entrada_vigor, status, escopo, aplicabilidade, requisitos_principais, tags, prioridade) VALUES
('NP EN 206-1', 'Betão - Especificação, desempenho, produção e conformidade - Parte 1: Especificação', 'Norma que especifica requisitos para betão em termos de especificação, desempenho, produção e conformidade.', 'BETAO_ESTRUTURAL', 'Especificações', 'NP EN', '1.0', '2020-01-01', '2020-07-01', 'ATIVA', 'Aplicável a betão estrutural e não estrutural', ARRAY['Estruturas de betão', 'Fundações', 'Pavimentos'], ARRAY['Resistência à compressão', 'Durabilidade', 'Trabalhabilidade'], ARRAY['betão', 'estrutural', 'especificação']),
('NP EN 1992-1-1', 'Eurocódigo 2: Projeto de estruturas de betão - Parte 1-1: Regras gerais e regras para edifícios', 'Norma para projeto de estruturas de betão armado e pré-esforçado.', 'BETAO_ESTRUTURAL', 'Projeto Estrutural', 'NP EN', '1.0', '2010-01-01', '2010-07-01', 'ATIVA', 'Projeto de estruturas de betão', ARRAY['Edifícios', 'Pontes', 'Estruturas especiais'], ARRAY['Estados limites', 'Durabilidade', 'Segurança estrutural'], ARRAY['eurocódigo', 'projeto', 'estrutural']),
('NP EN 10025-1', 'Produtos laminados a quente de aços estruturais - Parte 1: Condições técnicas gerais de entrega', 'Especificações para produtos laminados a quente de aços estruturais.', 'ACOS_ARMADURA', 'Aços Estruturais', 'NP EN', '1.0', '2005-01-01', '2005-07-01', 'ATIVA', 'Produtos laminados de aço estrutural', ARRAY['Estruturas metálicas', 'Construção civil'], ARRAY['Propriedades mecânicas', 'Composição química', 'Tratamento térmico'], ARRAY['aço', 'estrutural', 'laminado']),
('NP EN 1993-1-1', 'Eurocódigo 3: Projeto de estruturas de aço - Parte 1-1: Regras gerais e regras para edifícios', 'Norma para projeto de estruturas de aço.', 'ACOS_ARMADURA', 'Projeto Estrutural', 'NP EN', '1.0', '2006-01-01', '2006-07-01', 'ATIVA', 'Projeto de estruturas de aço', ARRAY['Edifícios', 'Pontes', 'Estruturas especiais'], ARRAY['Estados limites', 'Estabilidade', 'Resistência'], ARRAY['eurocódigo', 'aço', 'projeto']),
('NP EN 1997-1', 'Eurocódigo 7: Projeto geotécnico - Parte 1: Regras gerais', 'Norma para projeto geotécnico de estruturas.', 'SOLOS_FUNDACOES', 'Projeto Geotécnico', 'NP EN', '1.0', '2007-01-01', '2007-07-01', 'ATIVA', 'Projeto geotécnico', ARRAY['Fundações', 'Muros de suporte', 'Taludes'], ARRAY['Estados limites', 'Análise geotécnica', 'Segurança'], ARRAY['geotécnico', 'fundações', 'eurocódigo']),
('NP EN 1990', 'Eurocódigo: Bases para o projeto de estruturas', 'Norma base para projeto de estruturas de construção.', 'CONSTRUCAO_CIVIL', 'Bases de Projeto', 'NP EN', '1.0', '2002-01-01', '2002-07-01', 'ATIVA', 'Bases para projeto estrutural', ARRAY['Todas as estruturas', 'Construção civil'], ARRAY['Estados limites', 'Combinações de ações', 'Segurança'], ARRAY['eurocódigo', 'bases', 'projeto']),
('NP EN 1991-1-1', 'Eurocódigo 1: Ações em estruturas - Parte 1-1: Ações gerais - Pesos volúmicos, pesos próprios e cargas impostas em edifícios', 'Norma para ações em estruturas de edifícios.', 'CONSTRUCAO_CIVIL', 'Ações', 'NP EN', '1.0', '2002-01-01', '2002-07-01', 'ATIVA', 'Ações em edifícios', ARRAY['Edifícios', 'Construção civil'], ARRAY['Pesos próprios', 'Cargas impostas', 'Combinações'], ARRAY['ações', 'cargas', 'edifícios']),
('NP EN 1991-2', 'Eurocódigo 1: Ações em estruturas - Parte 2: Cargas de tráfego em pontes', 'Norma para cargas de tráfego em pontes.', 'FERROVIARIA', 'Ações Ferroviárias', 'NP EN', '1.0', '2003-01-01', '2003-07-01', 'ATIVA', 'Cargas de tráfego em pontes', ARRAY['Pontes ferroviárias', 'Pontes rodoviárias'], ARRAY['Cargas de comboios', 'Cargas de veículos', 'Combinações'], ARRAY['pontes', 'tráfego', 'cargas']),
('NP EN 1991-4', 'Eurocódigo 1: Ações em estruturas - Parte 4: Ações em silos e reservatórios', 'Norma para ações em silos e reservatórios.', 'CONSTRUCAO_CIVIL', 'Ações Especiais', 'NP EN', '1.0', '2006-01-01', '2006-07-01', 'ATIVA', 'Ações em silos e reservatórios', ARRAY['Silos', 'Reservatórios', 'Estruturas especiais'], ARRAY['Pressões de enchimento', 'Pressões de descarga', 'Ações térmicas'], ARRAY['silos', 'reservatórios', 'ações']),
('NP EN 1998-1', 'Eurocódigo 8: Projeto de estruturas para resistência aos sismos - Parte 1: Regras gerais, ações sísmicas e regras para edifícios', 'Norma para projeto sísmico de estruturas.', 'CONSTRUCAO_CIVIL', 'Projeto Sísmico', 'NP EN', '1.0', '2010-01-01', '2010-07-01', 'ATIVA', 'Projeto sísmico de estruturas', ARRAY['Edifícios', 'Estruturas especiais'], ARRAY['Ações sísmicas', 'Capacidade de deformação', 'Ductilidade'], ARRAY['sísmico', 'terramoto', 'projeto']),
('NP EN 1999-1-1', 'Eurocódigo 9: Projeto de estruturas de alumínio - Parte 1-1: Regras gerais', 'Norma para projeto de estruturas de alumínio.', 'CONSTRUCAO_CIVIL', 'Projeto Estrutural', 'NP EN', '1.0', '2007-01-01', '2007-07-01', 'ATIVA', 'Projeto de estruturas de alumínio', ARRAY['Estruturas de alumínio', 'Construção civil'], ARRAY['Estados limites', 'Resistência', 'Estabilidade'], ARRAY['alumínio', 'estruturas', 'projeto']),
('NP EN 1996-1-1', 'Eurocódigo 6: Projeto de estruturas de alvenaria - Parte 1-1: Regras gerais para alvenaria armada e não armada', 'Norma para projeto de estruturas de alvenaria.', 'CONSTRUCAO_CIVIL', 'Projeto Estrutural', 'NP EN', '1.0', '2005-01-01', '2005-07-01', 'ATIVA', 'Projeto de estruturas de alvenaria', ARRAY['Alvenaria', 'Edifícios'], ARRAY['Resistência à compressão', 'Estabilidade', 'Durabilidade'], ARRAY['alvenaria', 'masonry', 'projeto']);

-- =====================================================
-- 18. DADOS DE EXEMPLO - SUBMISSÕES DE MATERIAIS
-- =====================================================

INSERT INTO submissoes_materiais (codigo, titulo, descricao, tipo_material, categoria, especificacoes_tecnicas, normas_referencia, certificados_necessarios, submissor_id, submissor_nome, data_submissao, prioridade, urgencia, estado, especificacoes_detalhadas, justificativa_necessidade, impacto_custo, impacto_prazo, obra_nome, fornecedor_sugerido, tags) VALUES
('SM-2024-001', 'Betão de Alta Resistência C60/75', 'Submissão para aprovação de betão de alta resistência para pilares principais', 'betao', 'estrutural', 'Resistência característica: 60 MPa, Consistência: S3, Classe de exposição: XC3', ARRAY['NP EN 206-1', 'NP EN 1992-1-1'], ARRAY['Certificado de conformidade', 'Relatório de ensaios'], '123e4567-e89b-12d3-a456-426614174000', 'Eng. João Silva', '2024-01-15', 'alta', 'urgente', 'aguardando_aprovacao', 'Betão com agregados especiais e aditivos superplastificantes', 'Necessário para pilares de elevada carga axial', 15000.00, 5, 'Edifício Comercial Centro', 'Cimpor', ARRAY['alta resistência', 'estrutural', 'pilares']),
('SM-2024-002', 'Aço Estrutural S355J2+N', 'Submissão para aprovação de aço estrutural para vigas principais', 'aco', 'estrutural', 'Limite de cedência: 355 MPa, Alongamento: 22%, Resistência ao impacto: 27J a -20°C', ARRAY['NP EN 10025-1', 'NP EN 1993-1-1'], ARRAY['Certificado de material', 'Ensaio de impacto'], '123e4567-e89b-12d3-a456-426614174001', 'Eng. Maria Santos', '2024-01-20', 'media', 'normal', 'em_revisao', 'Aço laminado a quente com tratamento térmico normalizado', 'Substituição de material existente por melhor qualidade', 25000.00, 3, 'Ponte Ferroviária Norte', 'ArcelorMittal', ARRAY['aço estrutural', 'vigas', 'ferroviário']),
('SM-2024-003', 'Agregado Caliço 4/20mm', 'Submissão para aprovação de agregado caliço para betão estrutural', 'agregado', 'estrutural', 'Granulometria: 4-20mm, Resistência à fragmentação: LA45, Absorção: <2%', ARRAY['NP EN 12620'], ARRAY['Certificado de conformidade', 'Ensaio de granulometria'], '123e4567-e89b-12d3-a456-426614174002', 'Eng. Pedro Costa', '2024-01-25', 'baixa', 'normal', 'aprovado', 'Agregado de pedreira local com características superiores', 'Redução de custos de transporte', 8000.00, 0, 'Residencial Parque Verde', 'Pedreira Local', ARRAY['agregado', 'pedreira', 'local']),
('SM-2024-004', 'Sistema de Impermeabilização', 'Submissão para sistema de impermeabilização de cobertura', 'impermeabilizacao', 'acabamento', 'Membrana líquida poliuretânica, Espessura: 2mm, Resistência: UV e intempéries', ARRAY['NP EN 13967'], ARRAY['Certificado de conformidade', 'Ensaio de resistência'], '123e4567-e89b-12d3-a456-426614174003', 'Eng. Ana Ferreira', '2024-02-01', 'media', 'normal', 'submetido', 'Sistema de impermeabilização de alta durabilidade', 'Melhoria da durabilidade da cobertura', 12000.00, 2, 'Centro Comercial Plaza', 'Sika', ARRAY['impermeabilização', 'cobertura', 'durabilidade']),
('SM-2024-005', 'Equipamento de Segurança', 'Submissão para equipamentos de segurança para obra', 'equipamento', 'seguranca', 'Capacetes, coletes, botas de segurança conforme EN 397, EN 471, EN ISO 20345', ARRAY['EN 397', 'EN 471', 'EN ISO 20345'], ARRAY['Certificado CE', 'Relatório de ensaios'], '123e4567-e89b-12d3-a456-426614174004', 'Téc. Segurança Carlos', '2024-02-05', 'alta', 'urgente', 'rascunho', 'Equipamentos de proteção individual de alta qualidade', 'Cumprimento de requisitos de segurança', 5000.00, 1, 'Obra Múltipla', 'Mestre Segurança', ARRAY['segurança', 'EPI', 'proteção']);

-- =====================================================
-- 19. WORKFLOW PADRÃO DE APROVAÇÃO
-- =====================================================

INSERT INTO workflows_aprovacao (nome, descricao, etapas, aprovadores_por_etapa, tempo_limite_etapa, ativo) VALUES
('Workflow Padrão', 'Workflow padrão para aprovação de materiais', 
'[
  {"id": "etapa_1", "nome": "Submissão Inicial", "ordem": 1, "tipo_aprovacao": "unica"},
  {"id": "etapa_2", "nome": "Revisão Técnica", "ordem": 2, "tipo_aprovacao": "unica"},
  {"id": "etapa_3", "nome": "Aprovação Final", "ordem": 3, "tipo_aprovacao": "unica"}
]',
'{
  "etapa_1": ["submissor"],
  "etapa_2": ["engenheiro_tecnico"],
  "etapa_3": ["diretor_obra"]
}',
'{
  "etapa_1": 1,
  "etapa_2": 3,
  "etapa_3": 2
}',
true);

-- =====================================================
-- 20. MENSAGEM DE CONCLUSÃO
-- =====================================================

-- Script executado com sucesso!
-- Tabelas criadas: normas, versoes_normas, aplicacoes_normas, notificacoes_normas, submissoes_materiais, workflows_aprovacao, etapas_workflow, historico_aprovacoes, comentarios_submissao
-- Funções criadas: get_normas_stats(), get_submissoes_materiais_stats()
-- Dados de exemplo inseridos: 12 normas, 5 submissões de materiais, 1 workflow padrão
-- RLS ativado em todas as tabelas
-- Índices criados para otimização de performance
