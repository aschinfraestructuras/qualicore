-- =====================================================
-- SCRIPT SQL PARA SISTEMA DE SUBMISSÃO E APROVAÇÃO DE MATERIAIS
-- =====================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- 1. TABELA SUBMISSÕES DE MATERIAIS
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
-- 2. TABELA WORKFLOWS DE APROVAÇÃO
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
-- 3. TABELA ETAPAS DO WORKFLOW
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
-- 4. TABELA HISTÓRICO DE APROVAÇÕES
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
-- 5. TABELA COMENTÁRIOS DE SUBMISSÃO
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
-- ÍNDICES PARA PERFORMANCE
-- =====================================================

-- Submissões
CREATE INDEX idx_submissoes_codigo ON submissoes_materiais(codigo);
CREATE INDEX idx_submissoes_estado ON submissoes_materiais(estado);
CREATE INDEX idx_submissoes_tipo_material ON submissoes_materiais(tipo_material);
CREATE INDEX idx_submissoes_categoria ON submissoes_materiais(categoria);
CREATE INDEX idx_submissoes_prioridade ON submissoes_materiais(prioridade);
CREATE INDEX idx_submissoes_submissor_id ON submissoes_materiais(submissor_id);
CREATE INDEX idx_submissoes_aprovador_id ON submissoes_materiais(aprovador_id);
CREATE INDEX idx_submissoes_data_submissao ON submissoes_materiais(data_submissao);
CREATE INDEX idx_submissoes_data_limite ON submissoes_materiais(data_limite_aprovacao);
CREATE INDEX idx_submissoes_obra_id ON submissoes_materiais(obra_id);
CREATE INDEX idx_submissoes_user_id ON submissoes_materiais(user_id);

-- Workflows
CREATE INDEX idx_workflows_ativo ON workflows_aprovacao(ativo);
CREATE INDEX idx_workflows_user_id ON workflows_aprovacao(user_id);

-- Etapas
CREATE INDEX idx_etapas_workflow_id ON etapas_workflow(workflow_id);
CREATE INDEX idx_etapas_ordem ON etapas_workflow(ordem);

-- Histórico
CREATE INDEX idx_historico_submissao_id ON historico_aprovacoes(submissao_id);
CREATE INDEX idx_historico_data ON historico_aprovacoes(data);
CREATE INDEX idx_historico_aprovador_id ON historico_aprovacoes(aprovador_id);

-- Comentários
CREATE INDEX idx_comentarios_submissao_id ON comentarios_submissao(submissao_id);
CREATE INDEX idx_comentarios_data ON comentarios_submissao(data);
CREATE INDEX idx_comentarios_autor_id ON comentarios_submissao(autor_id);
CREATE INDEX idx_comentarios_tipo ON comentarios_submissao(tipo);

-- =====================================================
-- TRIGGERS PARA ATUALIZAÇÃO AUTOMÁTICA
-- =====================================================

-- Trigger para submissoes_materiais
CREATE OR REPLACE FUNCTION update_submissoes_materiais_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.atualizado_em = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_submissoes_materiais_updated_at
  BEFORE UPDATE ON submissoes_materiais
  FOR EACH ROW
  EXECUTE FUNCTION update_submissoes_materiais_updated_at();

-- Trigger para workflows_aprovacao
CREATE OR REPLACE FUNCTION update_workflows_aprovacao_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.atualizado_em = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_workflows_aprovacao_updated_at
  BEFORE UPDATE ON workflows_aprovacao
  FOR EACH ROW
  EXECUTE FUNCTION update_workflows_aprovacao_updated_at();

-- Trigger para etapas_workflow
CREATE OR REPLACE FUNCTION update_etapas_workflow_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.atualizado_em = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_etapas_workflow_updated_at
  BEFORE UPDATE ON etapas_workflow
  FOR EACH ROW
  EXECUTE FUNCTION update_etapas_workflow_updated_at();

-- Trigger para comentarios_submissao
CREATE OR REPLACE FUNCTION update_comentarios_submissao_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.atualizado_em = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_comentarios_submissao_updated_at
  BEFORE UPDATE ON comentarios_submissao
  FOR EACH ROW
  EXECUTE FUNCTION update_comentarios_submissao_updated_at();

-- =====================================================
-- FUNÇÃO PARA ESTATÍSTICAS
-- =====================================================

CREATE OR REPLACE FUNCTION get_submissoes_materiais_stats()
RETURNS JSON AS $$
DECLARE
  resultado JSON;
  total_submissoes INTEGER;
  submissoes_por_estado JSON;
  submissoes_por_tipo JSON;
  submissoes_por_prioridade JSON;
  tempo_medio_aprovacao NUMERIC;
  taxa_aprovacao NUMERIC;
  submissoes_urgentes INTEGER;
  submissoes_atrasadas INTEGER;
  top_submissores JSON;
  top_aprovadores JSON;
  submissoes_mes_atual INTEGER;
  submissoes_mes_anterior INTEGER;
  crescimento_mensal NUMERIC;
BEGIN
  -- Total de submissões
  SELECT COUNT(*) INTO total_submissoes FROM submissoes_materiais;
  
  -- Submissões por estado
  SELECT json_object_agg(estado, count) INTO submissoes_por_estado
  FROM (
    SELECT estado, COUNT(*) as count
    FROM submissoes_materiais
    GROUP BY estado
  ) t;
  
  -- Submissões por tipo
  SELECT json_object_agg(tipo_material, count) INTO submissoes_por_tipo
  FROM (
    SELECT tipo_material, COUNT(*) as count
    FROM submissoes_materiais
    GROUP BY tipo_material
  ) t;
  
  -- Submissões por prioridade
  SELECT json_object_agg(prioridade, count) INTO submissoes_por_prioridade
  FROM (
    SELECT prioridade, COUNT(*) as count
    FROM submissoes_materiais
    GROUP BY prioridade
  ) t;
  
  -- Tempo médio de aprovação (em dias)
  SELECT AVG(EXTRACT(DAY FROM (data_aprovacao::date - data_submissao::date)))
  INTO tempo_medio_aprovacao
  FROM submissoes_materiais
  WHERE estado = 'aprovado' AND data_aprovacao IS NOT NULL;
  
  -- Taxa de aprovação
  SELECT (COUNT(*) FILTER (WHERE estado = 'aprovado') * 100.0 / COUNT(*))
  INTO taxa_aprovacao
  FROM submissoes_materiais
  WHERE estado IN ('aprovado', 'rejeitado');
  
  -- Submissões urgentes
  SELECT COUNT(*) INTO submissoes_urgentes
  FROM submissoes_materiais
  WHERE urgencia IN ('urgente', 'muito_urgente');
  
  -- Submissões atrasadas
  SELECT COUNT(*) INTO submissoes_atrasadas
  FROM submissoes_materiais
  WHERE data_limite_aprovacao < CURRENT_DATE
  AND estado NOT IN ('aprovado', 'rejeitado', 'cancelado', 'concluido');
  
  -- Top submissores
  SELECT json_agg(json_build_object('id', submissor_id, 'nome', submissor_nome, 'total', count))
  INTO top_submissores
  FROM (
    SELECT submissor_id, submissor_nome, COUNT(*) as count
    FROM submissoes_materiais
    GROUP BY submissor_id, submissor_nome
    ORDER BY count DESC
    LIMIT 5
  ) t;
  
  -- Top aprovadores
  SELECT json_agg(json_build_object('id', aprovador_id, 'nome', aprovador_nome, 'total', count))
  INTO top_aprovadores
  FROM (
    SELECT aprovador_id, aprovador_nome, COUNT(*) as count
    FROM submissoes_materiais
    WHERE aprovador_id IS NOT NULL
    GROUP BY aprovador_id, aprovador_nome
    ORDER BY count DESC
    LIMIT 5
  ) t;
  
  -- Submissões do mês atual
  SELECT COUNT(*) INTO submissoes_mes_atual
  FROM submissoes_materiais
  WHERE EXTRACT(YEAR FROM data_submissao) = EXTRACT(YEAR FROM CURRENT_DATE)
  AND EXTRACT(MONTH FROM data_submissao) = EXTRACT(MONTH FROM CURRENT_DATE);
  
  -- Submissões do mês anterior
  SELECT COUNT(*) INTO submissoes_mes_anterior
  FROM submissoes_materiais
  WHERE EXTRACT(YEAR FROM data_submissao) = EXTRACT(YEAR FROM CURRENT_DATE - INTERVAL '1 month')
  AND EXTRACT(MONTH FROM data_submissao) = EXTRACT(MONTH FROM CURRENT_DATE - INTERVAL '1 month');
  
  -- Crescimento mensal
  IF submissoes_mes_anterior > 0 THEN
    crescimento_mensal = ((submissoes_mes_atual - submissoes_mes_anterior) * 100.0 / submissoes_mes_anterior);
  ELSE
    crescimento_mensal = 0;
  END IF;
  
  -- Montar resultado
  resultado = json_build_object(
    'total_submissoes', total_submissoes,
    'submissoes_por_estado', submissoes_por_estado,
    'submissoes_por_tipo', submissoes_por_tipo,
    'submissoes_por_prioridade', submissoes_por_prioridade,
    'tempo_medio_aprovacao', COALESCE(tempo_medio_aprovacao, 0),
    'taxa_aprovacao', COALESCE(taxa_aprovacao, 0),
    'submissoes_urgentes', submissoes_urgentes,
    'submissoes_atrasadas', submissoes_atrasadas,
    'top_submissores', COALESCE(top_submissores, '[]'),
    'top_aprovadores', COALESCE(top_aprovadores, '[]'),
    'submissoes_mes_atual', submissoes_mes_atual,
    'submissoes_mes_anterior', submissoes_mes_anterior,
    'crescimento_mensal', crescimento_mensal
  );
  
  RETURN resultado;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================

-- Submissões de Materiais
ALTER TABLE submissoes_materiais ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Submissoes: usuário pode ver suas submissões" ON submissoes_materiais
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Submissoes: usuário pode criar suas submissões" ON submissoes_materiais
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Submissoes: usuário pode editar suas submissões" ON submissoes_materiais
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Submissoes: usuário pode deletar suas submissões" ON submissoes_materiais
  FOR DELETE USING (auth.uid() = user_id);

-- Workflows de Aprovação
ALTER TABLE workflows_aprovacao ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Workflows: usuário pode ver workflows" ON workflows_aprovacao
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Workflows: usuário pode criar workflows" ON workflows_aprovacao
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Workflows: usuário pode editar workflows" ON workflows_aprovacao
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Workflows: usuário pode deletar workflows" ON workflows_aprovacao
  FOR DELETE USING (auth.uid() = user_id);

-- Etapas do Workflow
ALTER TABLE etapas_workflow ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Etapas: usuário pode ver etapas" ON etapas_workflow
  FOR SELECT USING (EXISTS (
    SELECT 1 FROM workflows_aprovacao w 
    WHERE w.id = etapas_workflow.workflow_id AND w.user_id = auth.uid()
  ));

CREATE POLICY "Etapas: usuário pode criar etapas" ON etapas_workflow
  FOR INSERT WITH CHECK (EXISTS (
    SELECT 1 FROM workflows_aprovacao w 
    WHERE w.id = etapas_workflow.workflow_id AND w.user_id = auth.uid()
  ));

CREATE POLICY "Etapas: usuário pode editar etapas" ON etapas_workflow
  FOR UPDATE USING (EXISTS (
    SELECT 1 FROM workflows_aprovacao w 
    WHERE w.id = etapas_workflow.workflow_id AND w.user_id = auth.uid()
  ));

-- Histórico de Aprovações
ALTER TABLE historico_aprovacoes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Historico: usuário pode ver histórico" ON historico_aprovacoes
  FOR SELECT USING (EXISTS (
    SELECT 1 FROM submissoes_materiais s 
    WHERE s.id = historico_aprovacoes.submissao_id AND s.user_id = auth.uid()
  ));

CREATE POLICY "Historico: usuário pode criar histórico" ON historico_aprovacoes
  FOR INSERT WITH CHECK (EXISTS (
    SELECT 1 FROM submissoes_materiais s 
    WHERE s.id = historico_aprovacoes.submissao_id AND s.user_id = auth.uid()
  ));

-- Comentários de Submissão
ALTER TABLE comentarios_submissao ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Comentarios: usuário pode ver comentários" ON comentarios_submissao
  FOR SELECT USING (EXISTS (
    SELECT 1 FROM submissoes_materiais s 
    WHERE s.id = comentarios_submissao.submissao_id AND s.user_id = auth.uid()
  ));

CREATE POLICY "Comentarios: usuário pode criar comentários" ON comentarios_submissao
  FOR INSERT WITH CHECK (EXISTS (
    SELECT 1 FROM submissoes_materiais s 
    WHERE s.id = comentarios_submissao.submissao_id AND s.user_id = auth.uid()
  ));

CREATE POLICY "Comentarios: usuário pode editar comentários" ON comentarios_submissao
  FOR UPDATE USING (autor_id = auth.uid());

CREATE POLICY "Comentarios: usuário pode deletar comentários" ON comentarios_submissao
  FOR DELETE USING (autor_id = auth.uid());

-- =====================================================
-- DADOS DE EXEMPLO
-- =====================================================

-- Workflow padrão de aprovação
INSERT INTO workflows_aprovacao (id, nome, descricao, etapas, aprovadores_por_etapa, tempo_limite_etapa, ativo, user_id) VALUES
(
  '550e8400-e29b-41d4-a716-446655440001',
  'Workflow Padrão de Aprovação',
  'Workflow padrão para aprovação de materiais',
  '[
    {"id": "etapa1", "nome": "Revisão Técnica", "ordem": 1, "tipo_aprovacao": "unica"},
    {"id": "etapa2", "nome": "Aprovação Financeira", "ordem": 2, "tipo_aprovacao": "unica"},
    {"id": "etapa3", "nome": "Aprovação Final", "ordem": 3, "tipo_aprovacao": "unica"}
  ]',
  '{
    "etapa1": ["responsavel_tecnico"],
    "etapa2": ["responsavel_financeiro"],
    "etapa3": ["diretor_obra"]
  }',
  '{
    "etapa1": 3,
    "etapa2": 2,
    "etapa3": 1
  }',
  true,
  (SELECT id FROM auth.users LIMIT 1)
);

-- Submissões de exemplo
INSERT INTO submissoes_materiais (codigo, titulo, descricao, tipo_material, categoria, especificacoes_tecnicas, normas_referencia, certificados_necessarios, submissor_id, submissor_nome, data_submissao, prioridade, urgencia, estado, especificacoes_detalhadas, justificativa_necessidade, impacto_custo, impacto_prazo, obra_id, obra_nome, fornecedor_sugerido, tags, data_limite_aprovacao, user_id) VALUES
(
  'SM-2024-001',
  'Betão de Alta Resistência C50/60',
  'Submissão para aprovação de betão de alta resistência para pilares principais',
  'betao',
  'estrutural',
  'Resistência característica: 50 MPa, Consistência: S3, Agregado máximo: 20mm',
  '{"EN 206-1", "NP EN 206-1"}',
  '{"Certificado de conformidade", "Relatório de ensaios"}',
  (SELECT id FROM auth.users LIMIT 1),
  'João Silva',
  '2024-01-15',
  'alta',
  'urgente',
  'aguardando_aprovacao',
  'Betão C50/60 com aditivos superplastificantes para melhor trabalhabilidade. Resistência à compressão aos 28 dias: 50 MPa. Consistência S3 para facilitar a aplicação em pilares de grande altura.',
  'Necessário para pilares principais da estrutura que suportam cargas elevadas. O betão C30/37 atual não atende aos requisitos de projeto.',
  15000.00,
  5,
  (SELECT id FROM auth.users LIMIT 1),
  'Edifício Comercial Centro',
  'Cimpor',
  '{"alta-resistencia", "estrutural", "pilares"}',
  '2024-01-25',
  (SELECT id FROM auth.users LIMIT 1)
),
(
  'SM-2024-002',
  'Aço de Armadura B500B',
  'Submissão para aprovação de aço de armadura para lajes e vigas',
  'aco',
  'estrutural',
  'Classe: B500B, Diâmetros: 6mm, 8mm, 10mm, 12mm, 16mm, 20mm, 25mm',
  '{"EN 10080", "NP EN 10080"}',
  '{"Certificado de conformidade", "Relatório de ensaios de tração"}',
  (SELECT id FROM auth.users LIMIT 1),
  'Maria Santos',
  '2024-01-10',
  'media',
  'normal',
  'aprovado',
  'Aço de armadura B500B com limite de escoamento de 500 MPa. Fornecimento em barras de 12m de comprimento. Certificação CE obrigatória.',
  'Material padrão para armaduras de lajes e vigas. Substituição do stock atual que está em fim de vida.',
  25000.00,
  3,
  (SELECT id FROM auth.users LIMIT 1),
  'Residencial Parque Verde',
  'Megasa',
  '{"armadura", "estrutural", "lajes"}',
  '2024-01-20',
  (SELECT id FROM auth.users LIMIT 1)
),
(
  'SM-2024-003',
  'Agregados para Betão',
  'Submissão para aprovação de agregados naturais para betão',
  'agregado',
  'estrutural',
  'Agregado fino: 0/4mm, Agregado grosso: 4/12mm e 12/20mm, Granulometria contínua',
  '{"EN 12620", "NP EN 12620"}',
  '{"Certificado de conformidade", "Relatório de ensaios de granulometria"}',
  (SELECT id FROM auth.users LIMIT 1),
  'Pedro Costa',
  '2024-01-08',
  'baixa',
  'normal',
  'em_revisao',
  'Agregados naturais de origem sedimentar. Limpeza e classificação conforme EN 12620. Teor de finos controlado para otimizar o consumo de cimento.',
  'Renovação do contrato de fornecimento de agregados. Preços competitivos e qualidade comprovada.',
  8000.00,
  2,
  (SELECT id FROM auth.users LIMIT 1),
  'Ponte Rio Douro',
  'Pedreira do Norte',
  '{"agregados", "betao", "granulometria"}',
  '2024-01-18',
  (SELECT id FROM auth.users LIMIT 1)
),
(
  'SM-2024-004',
  'Sistema de Impermeabilização',
  'Submissão para aprovação de sistema de impermeabilização para fundações',
  'impermeabilizacao',
  'acabamento',
  'Membrana bituminosa modificada com polímeros, Espessura: 4mm, Resistência à tração: 800 N/50mm',
  '{"EN 13967", "NP EN 13967"}',
  '{"Certificado de conformidade", "Relatório de ensaios de resistência"}',
  (SELECT id FROM auth.users LIMIT 1),
  'Ana Ferreira',
  '2024-01-12',
  'alta',
  'urgente',
  'submetido',
  'Sistema de impermeabilização composto por membrana bituminosa modificada com polímeros SBS. Aplicação por soldadura com maçarico. Resistência à tração de 800 N/50mm e alongamento de 40%.',
  'Proteção das fundações contra infiltrações de água. O sistema atual está danificado e necessita de substituição urgente.',
  12000.00,
  7,
  (SELECT id FROM auth.users LIMIT 1),
  'Centro Comercial Plaza',
  'Sika',
  '{"impermeabilizacao", "fundacoes", "membrana"}',
  '2024-01-22',
  (SELECT id FROM auth.users LIMIT 1)
),
(
  'SM-2024-005',
  'Equipamento de Segurança',
  'Submissão para aprovação de equipamentos de proteção individual',
  'equipamento',
  'seguranca',
  'Capacetes, Cintos de segurança, Luvas, Calçado de segurança, Óculos de proteção',
  '{"EN 397", "EN 361", "EN 388", "EN ISO 20345", "EN 166"}',
  '{"Certificado de conformidade CE", "Relatório de ensaios"}',
  (SELECT id FROM auth.users LIMIT 1),
  'Carlos Mendes',
  '2024-01-05',
  'critica',
  'muito_urgente',
  'aprovado',
  'Equipamentos de proteção individual conforme legislação em vigor. Capacetes com certificação EN 397, cintos de segurança EN 361, luvas EN 388, calçado EN ISO 20345, óculos EN 166.',
  'Renovação obrigatória dos EPIs da equipa. Os equipamentos atuais estão fora de validade e não cumprem as normas de segurança.',
  5000.00,
  1,
  (SELECT id FROM auth.users LIMIT 1),
  'Túnel Ferroviário',
  'Mestre Segurança',
  '{"epi", "seguranca", "protecao"}',
  '2024-01-10',
  (SELECT id FROM auth.users LIMIT 1)
);

-- Histórico de aprovações de exemplo
INSERT INTO historico_aprovacoes (submissao_id, aprovador_id, aprovador_nome, acao, comentario) VALUES
(
  (SELECT id FROM submissoes_materiais WHERE codigo = 'SM-2024-002'),
  (SELECT id FROM auth.users LIMIT 1),
  'Eng. Responsável Técnico',
  'aprovado',
  'Material aprovado. Especificações técnicas adequadas e preço competitivo.'
),
(
  (SELECT id FROM submissoes_materiais WHERE codigo = 'SM-2024-005'),
  (SELECT id FROM auth.users LIMIT 1),
  'Responsável Segurança',
  'aprovado',
  'EPIs aprovados com urgência. Cumprem todas as normas de segurança.'
);

-- Comentários de exemplo
INSERT INTO comentarios_submissao (submissao_id, autor_id, autor_nome, comentario, tipo) VALUES
(
  (SELECT id FROM submissoes_materiais WHERE codigo = 'SM-2024-001'),
  (SELECT id FROM auth.users LIMIT 1),
  'Eng. Técnico',
  'Verificar se o fornecedor tem experiência com betões de alta resistência.',
  'sugestao'
),
(
  (SELECT id FROM submissoes_materiais WHERE codigo = 'SM-2024-003'),
  (SELECT id FROM auth.users LIMIT 1),
  'Responsável Qualidade',
  'Solicitar amostras para ensaios de granulometria antes da aprovação.',
  'pergunta'
);

-- =====================================================
-- MENSAGEM DE CONFIRMAÇÃO
-- =====================================================

DO $$
BEGIN
  RAISE NOTICE '✅ SISTEMA DE SUBMISSÃO E APROVAÇÃO DE MATERIAIS CRIADO COM SUCESSO!';
  RAISE NOTICE '📊 Tabelas criadas: submissoes_materiais, workflows_aprovacao, etapas_workflow, historico_aprovacoes, comentarios_submissao';
  RAISE NOTICE '🔐 Políticas de segurança (RLS) configuradas';
  RAISE NOTICE '📈 Função de estatísticas criada: get_submissoes_materiais_stats()';
  RAISE NOTICE '📝 Dados de exemplo inseridos: 5 submissões, 2 aprovações, 2 comentários';
  RAISE NOTICE '🚀 Sistema pronto para uso!';
END $$;
