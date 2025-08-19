-- =====================================================
-- SCRIPT SQL PARA SISTEMA DE FORNECEDORES AVANÇADOS
-- =====================================================

-- Extensão para UUIDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- TABELA PRINCIPAL DE FORNECEDORES AVANÇADOS
-- =====================================================
CREATE TABLE IF NOT EXISTS fornecedores_avancados (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  codigo VARCHAR(50) UNIQUE NOT NULL,
  nome VARCHAR(200) NOT NULL,
  nif VARCHAR(20),
  morada TEXT,
  codigo_postal VARCHAR(10),
  cidade VARCHAR(100),
  pais VARCHAR(50) DEFAULT 'Portugal',
  telefone VARCHAR(20),
  email VARCHAR(100),
  website VARCHAR(200),
  contacto_principal VARCHAR(100),
  cargo_contacto VARCHAR(100),
  
  -- Informações de Qualificação
  status_qualificacao VARCHAR(20) NOT NULL DEFAULT 'pendente' CHECK (status_qualificacao IN ('pendente', 'qualificado', 'desqualificado', 'suspenso')),
  data_qualificacao DATE,
  data_reavaliacao DATE,
  criterios_qualificacao TEXT[],
  documentos_qualificacao TEXT[],
  
  -- Avaliação de Performance
  classificacao_geral DECIMAL(3,2) DEFAULT 0 CHECK (classificacao_geral >= 0 AND classificacao_geral <= 5),
  criterios_avaliacao JSONB DEFAULT '{"qualidade": 0, "prazo_entrega": 0, "preco": 0, "comunicacao": 0, "flexibilidade": 0, "inovacao": 0}'::jsonb,
  
  -- Categorias de Produtos/Serviços
  categorias TEXT[],
  produtos_principais TEXT[],
  
  -- Informações Financeiras
  limite_credito DECIMAL(12,2) DEFAULT 0,
  condicoes_pagamento VARCHAR(100),
  
  -- Informações de Segurança
  seguro_responsabilidade BOOLEAN DEFAULT FALSE,
  certificado_seguranca VARCHAR(200),
  politica_qualidade TEXT,
  
  -- Monitorização
  ultima_auditoria DATE,
  proxima_auditoria DATE,
  status_monitorizacao VARCHAR(20) DEFAULT 'ativo' CHECK (status_monitorizacao IN ('ativo', 'inativo', 'suspenso')),
  
  -- Metadados
  data_criacao TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  data_atualizacao TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  criado_por VARCHAR(100) DEFAULT 'Sistema',
  atualizado_por VARCHAR(100) DEFAULT 'Sistema',
  observacoes TEXT,
  tags TEXT[]
);

-- =====================================================
-- TABELA DE AVALIAÇÕES DE FORNECEDORES
-- =====================================================
CREATE TABLE IF NOT EXISTS avaliacoes_fornecedores (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  fornecedor_id UUID NOT NULL REFERENCES fornecedores_avancados(id) ON DELETE CASCADE,
  data_avaliacao DATE NOT NULL,
  avaliador VARCHAR(100) NOT NULL,
  tipo_avaliacao VARCHAR(20) NOT NULL CHECK (tipo_avaliacao IN ('qualidade', 'entrega', 'servico', 'preco', 'geral')),
  
  criterios JSONB NOT NULL DEFAULT '{"qualidade": 0, "prazo_entrega": 0, "preco": 0, "comunicacao": 0, "flexibilidade": 0, "inovacao": 0}'::jsonb,
  classificacao_geral DECIMAL(3,2) NOT NULL CHECK (classificacao_geral >= 0 AND classificacao_geral <= 5),
  comentarios TEXT,
  acoes_melhoria TEXT[],
  prazo_acoes DATE,
  status_acoes VARCHAR(20) DEFAULT 'pendente' CHECK (status_acoes IN ('pendente', 'em_execucao', 'concluido')),
  
  documentos_anexos TEXT[],
  data_criacao TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- TABELA DE CERTIFICAÇÕES DE FORNECEDORES
-- =====================================================
CREATE TABLE IF NOT EXISTS certificacoes_fornecedores (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  fornecedor_id UUID NOT NULL REFERENCES fornecedores_avancados(id) ON DELETE CASCADE,
  tipo_certificacao VARCHAR(100) NOT NULL,
  organismo_certificador VARCHAR(100) NOT NULL,
  numero_certificado VARCHAR(100) NOT NULL,
  data_emissao DATE NOT NULL,
  data_validade DATE NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'valido' CHECK (status IN ('valido', 'expirado', 'suspenso')),
  documento_certificado VARCHAR(200),
  observacoes TEXT,
  data_criacao TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- TABELA DE HISTÓRICO DE PAGAMENTOS
-- =====================================================
CREATE TABLE IF NOT EXISTS historico_pagamentos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  fornecedor_id UUID NOT NULL REFERENCES fornecedores_avancados(id) ON DELETE CASCADE,
  data_vencimento DATE NOT NULL,
  data_pagamento DATE,
  valor DECIMAL(12,2) NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'pendente' CHECK (status IN ('pendente', 'pago', 'atrasado', 'cancelado')),
  observacoes TEXT,
  data_criacao TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- TABELA DE CRITÉRIOS DE AVALIAÇÃO
-- =====================================================
CREATE TABLE IF NOT EXISTS criterios_avaliacao (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nome VARCHAR(100) NOT NULL,
  descricao TEXT,
  peso INTEGER NOT NULL DEFAULT 1 CHECK (peso >= 1 AND peso <= 10),
  tipo VARCHAR(20) NOT NULL CHECK (tipo IN ('qualidade', 'entrega', 'servico', 'preco', 'geral')),
  ativo BOOLEAN DEFAULT TRUE,
  data_criacao TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- TABELA DE PLANOS DE AVALIAÇÃO
-- =====================================================
CREATE TABLE IF NOT EXISTS planos_avaliacao (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nome VARCHAR(200) NOT NULL,
  descricao TEXT,
  criterios UUID[],
  frequencia VARCHAR(20) NOT NULL CHECK (frequencia IN ('mensal', 'trimestral', 'semestral', 'anual')),
  fornecedores_alvo UUID[],
  responsavel VARCHAR(100) NOT NULL,
  data_inicio DATE NOT NULL,
  data_fim DATE,
  status VARCHAR(20) NOT NULL DEFAULT 'ativo' CHECK (status IN ('ativo', 'inativo', 'concluido')),
  data_criacao TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- ÍNDICES PARA OTIMIZAÇÃO
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_fornecedores_codigo ON fornecedores_avancados(codigo);
CREATE INDEX IF NOT EXISTS idx_fornecedores_nome ON fornecedores_avancados(nome);
CREATE INDEX IF NOT EXISTS idx_fornecedores_nif ON fornecedores_avancados(nif);
CREATE INDEX IF NOT EXISTS idx_fornecedores_status_qualificacao ON fornecedores_avancados(status_qualificacao);
CREATE INDEX IF NOT EXISTS idx_fornecedores_classificacao ON fornecedores_avancados(classificacao_geral);
CREATE INDEX IF NOT EXISTS idx_fornecedores_categorias ON fornecedores_avancados USING GIN(categorias);
CREATE INDEX IF NOT EXISTS idx_fornecedores_tags ON fornecedores_avancados USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_fornecedores_data_qualificacao ON fornecedores_avancados(data_qualificacao);
CREATE INDEX IF NOT EXISTS idx_fornecedores_data_reavaliacao ON fornecedores_avancados(data_reavaliacao);

CREATE INDEX IF NOT EXISTS idx_avaliacoes_fornecedor_id ON avaliacoes_fornecedores(fornecedor_id);
CREATE INDEX IF NOT EXISTS idx_avaliacoes_data ON avaliacoes_fornecedores(data_avaliacao);
CREATE INDEX IF NOT EXISTS idx_avaliacoes_tipo ON avaliacoes_fornecedores(tipo_avaliacao);
CREATE INDEX IF NOT EXISTS idx_avaliacoes_classificacao ON avaliacoes_fornecedores(classificacao_geral);

CREATE INDEX IF NOT EXISTS idx_certificacoes_fornecedor_id ON certificacoes_fornecedores(fornecedor_id);
CREATE INDEX IF NOT EXISTS idx_certificacoes_status ON certificacoes_fornecedores(status);
CREATE INDEX IF NOT EXISTS idx_certificacoes_data_validade ON certificacoes_fornecedores(data_validade);

CREATE INDEX IF NOT EXISTS idx_pagamentos_fornecedor_id ON historico_pagamentos(fornecedor_id);
CREATE INDEX IF NOT EXISTS idx_pagamentos_status ON historico_pagamentos(status);
CREATE INDEX IF NOT EXISTS idx_pagamentos_data_vencimento ON historico_pagamentos(data_vencimento);

CREATE INDEX IF NOT EXISTS idx_criterios_tipo ON criterios_avaliacao(tipo);
CREATE INDEX IF NOT EXISTS idx_criterios_ativo ON criterios_avaliacao(ativo);

CREATE INDEX IF NOT EXISTS idx_planos_status ON planos_avaliacao(status);
CREATE INDEX IF NOT EXISTS idx_planos_frequencia ON planos_avaliacao(frequencia);

-- =====================================================
-- FUNÇÃO PARA ATUALIZAR TIMESTAMP
-- =====================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.data_atualizacao = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- =====================================================
-- TRIGGERS PARA ATUALIZAÇÃO AUTOMÁTICA
-- =====================================================
CREATE TRIGGER update_fornecedores_updated_at 
  BEFORE UPDATE ON fornecedores_avancados 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- FUNÇÃO PARA CALCULAR CLASSIFICAÇÃO GERAL
-- =====================================================
CREATE OR REPLACE FUNCTION calcular_classificacao_geral()
RETURNS TRIGGER AS $$
BEGIN
  -- Calcular média dos critérios de avaliação
  NEW.classificacao_geral = (
    (NEW.criterios_avaliacao->>'qualidade')::DECIMAL +
    (NEW.criterios_avaliacao->>'prazo_entrega')::DECIMAL +
    (NEW.criterios_avaliacao->>'preco')::DECIMAL +
    (NEW.criterios_avaliacao->>'comunicacao')::DECIMAL +
    (NEW.criterios_avaliacao->>'flexibilidade')::DECIMAL +
    (NEW.criterios_avaliacao->>'inovacao')::DECIMAL
  ) / 6.0;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_calcular_classificacao
  BEFORE INSERT OR UPDATE ON fornecedores_avancados
  FOR EACH ROW EXECUTE FUNCTION calcular_classificacao_geral();

-- =====================================================
-- FUNÇÃO PARA ESTATÍSTICAS DE FORNECEDORES
-- =====================================================
CREATE OR REPLACE FUNCTION get_fornecedores_stats()
RETURNS JSON AS $$
DECLARE
  result JSON;
BEGIN
  SELECT json_build_object(
    'total_fornecedores', COUNT(*),
    'qualificados', COUNT(*) FILTER (WHERE status_qualificacao = 'qualificado'),
    'pendentes', COUNT(*) FILTER (WHERE status_qualificacao = 'pendente'),
    'suspensos', COUNT(*) FILTER (WHERE status_qualificacao = 'suspenso'),
    'desqualificados', COUNT(*) FILTER (WHERE status_qualificacao = 'desqualificado'),
    'media_classificacao', ROUND(AVG(classificacao_geral)::NUMERIC, 2),
    'com_certificacao', COUNT(*) FILTER (WHERE EXISTS (
      SELECT 1 FROM certificacoes_fornecedores cf WHERE cf.fornecedor_id = fornecedores_avancados.id
    )),
    'distribuicao_categorias', (
      SELECT json_object_agg(categoria, count)
      FROM (
        SELECT unnest(categorias) as categoria, COUNT(*) as count
        FROM fornecedores_avancados
        WHERE categorias IS NOT NULL
        GROUP BY categoria
      ) cat_stats
    ),
    'fornecedores_vencendo', COUNT(*) FILTER (WHERE data_reavaliacao <= CURRENT_DATE + INTERVAL '90 days' AND data_reavaliacao > CURRENT_DATE),
    'pagamentos_atrasados', (
      SELECT COUNT(*) FROM historico_pagamentos 
      WHERE status = 'atrasado'
    )
  ) INTO result
  FROM fornecedores_avancados;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- POLÍTICAS DE SEGURANÇA (RLS)
-- =====================================================
ALTER TABLE fornecedores_avancados ENABLE ROW LEVEL SECURITY;
ALTER TABLE avaliacoes_fornecedores ENABLE ROW LEVEL SECURITY;
ALTER TABLE certificacoes_fornecedores ENABLE ROW LEVEL SECURITY;
ALTER TABLE historico_pagamentos ENABLE ROW LEVEL SECURITY;
ALTER TABLE criterios_avaliacao ENABLE ROW LEVEL SECURITY;
ALTER TABLE planos_avaliacao ENABLE ROW LEVEL SECURITY;

-- Políticas para fornecedores
CREATE POLICY "Utilizadores autenticados podem ver fornecedores" ON fornecedores_avancados
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Utilizadores autenticados podem inserir fornecedores" ON fornecedores_avancados
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Utilizadores autenticados podem atualizar fornecedores" ON fornecedores_avancados
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Utilizadores autenticados podem eliminar fornecedores" ON fornecedores_avancados
  FOR DELETE USING (auth.role() = 'authenticated');

-- Políticas para avaliações
CREATE POLICY "Utilizadores autenticados podem gerir avaliações" ON avaliacoes_fornecedores
  FOR ALL USING (auth.role() = 'authenticated');

-- Políticas para certificações
CREATE POLICY "Utilizadores autenticados podem gerir certificações" ON certificacoes_fornecedores
  FOR ALL USING (auth.role() = 'authenticated');

-- Políticas para pagamentos
CREATE POLICY "Utilizadores autenticados podem gerir pagamentos" ON historico_pagamentos
  FOR ALL USING (auth.role() = 'authenticated');

-- Políticas para critérios
CREATE POLICY "Utilizadores autenticados podem gerir critérios" ON criterios_avaliacao
  FOR ALL USING (auth.role() = 'authenticated');

-- Políticas para planos
CREATE POLICY "Utilizadores autenticados podem gerir planos" ON planos_avaliacao
  FOR ALL USING (auth.role() = 'authenticated');

-- =====================================================
-- DADOS DE EXEMPLO - CRITÉRIOS DE AVALIAÇÃO
-- =====================================================
INSERT INTO criterios_avaliacao (nome, descricao, peso, tipo, ativo) VALUES
('Qualidade dos Produtos', 'Avaliação da qualidade dos produtos fornecidos', 10, 'qualidade', TRUE),
('Prazo de Entrega', 'Cumprimento dos prazos de entrega acordados', 8, 'entrega', TRUE),
('Preço Competitivo', 'Competitividade dos preços em relação ao mercado', 7, 'preco', TRUE),
('Comunicação', 'Eficácia na comunicação e resposta a solicitações', 6, 'servico', TRUE),
('Flexibilidade', 'Capacidade de adaptação a mudanças e solicitações especiais', 5, 'servico', TRUE),
('Inovação', 'Capacidade de inovação e melhoria contínua', 4, 'geral', TRUE);

-- =====================================================
-- DADOS DE EXEMPLO - FORNECEDORES AVANÇADOS
-- =====================================================

-- Fornecedor 1: Empresa de Materiais de Construção
INSERT INTO fornecedores_avancados (
  codigo, nome, nif, morada, codigo_postal, cidade, pais, telefone, email, website, 
  contacto_principal, cargo_contacto, status_qualificacao, data_qualificacao, data_reavaliacao,
  criterios_qualificacao, documentos_qualificacao, criterios_avaliacao, categorias, 
  produtos_principais, limite_credito, condicoes_pagamento, seguro_responsabilidade,
  certificado_seguranca, politica_qualidade, ultima_auditoria, proxima_auditoria,
  status_monitorizacao, observacoes, tags
) VALUES (
  'FORN-001', 'Cimentos de Portugal - Cimpor', '500123456', 'Rua Alexandre Herculano, 35', '1250-008', 'Lisboa', 'Portugal',
  '+351 213 100 100', 'comercial@cimpor.pt', 'https://www.cimpor.pt',
  'João Silva', 'Diretor Comercial', 'qualificado', '2023-01-15', '2024-01-15',
  ARRAY['ISO 9001', 'ISO 14001', 'OHSAS 18001'], ARRAY['certificado_iso9001.pdf', 'certificado_iso14001.pdf'],
  '{"qualidade": 4.5, "prazo_entrega": 4.2, "preco": 3.8, "comunicacao": 4.0, "flexibilidade": 4.3, "inovacao": 4.1}'::jsonb,
  ARRAY['materiais', 'construção', 'cimentos'], ARRAY['Cimento Portland', 'Cimento Composto', 'Cimento Especial'],
  500000.00, '30 dias', TRUE, 'certificado_seguranca_cimpor.pdf', 'Política de qualidade focada na excelência e sustentabilidade',
  '2023-06-15', '2024-06-15', 'ativo',
  'Fornecedor estratégico de cimentos com excelente histórico de qualidade e entrega',
  ARRAY['estratégico', 'cimentos', 'qualidade', 'sustentabilidade']
);

-- Fornecedor 2: Empresa de Aços e Armaduras
INSERT INTO fornecedores_avancados (
  codigo, nome, nif, morada, codigo_postal, cidade, pais, telefone, email, website,
  contacto_principal, cargo_contacto, status_qualificacao, data_qualificacao, data_reavaliacao,
  criterios_qualificacao, documentos_qualificacao, criterios_avaliacao, categorias,
  produtos_principais, limite_credito, condicoes_pagamento, seguro_responsabilidade,
  certificado_seguranca, politica_qualidade, ultima_auditoria, proxima_auditoria,
  status_monitorizacao, observacoes, tags
) VALUES (
  'FORN-002', 'Aços de Portugal - Açoreana', '500234567', 'Avenida da República, 123', '1050-189', 'Lisboa', 'Portugal',
  '+351 213 200 200', 'vendas@acoreana.pt', 'https://www.acoreana.pt',
  'Maria Santos', 'Responsável de Vendas', 'qualificado', '2023-02-20', '2024-02-20',
  ARRAY['ISO 9001', 'EN 10080', 'Certificação CE'], ARRAY['certificado_iso9001.pdf', 'certificado_en10080.pdf'],
  '{"qualidade": 4.8, "prazo_entrega": 4.5, "preco": 4.0, "comunicacao": 4.6, "flexibilidade": 4.4, "inovacao": 4.2}'::jsonb,
  ARRAY['materiais', 'aços', 'armaduras'], ARRAY['Aço B500B', 'Aço B500C', 'Arame Recozido', 'Tela Soldada'],
  750000.00, '45 dias', TRUE, 'certificado_seguranca_acoreana.pdf', 'Política de qualidade com foco na conformidade técnica',
  '2023-07-10', '2024-07-10', 'ativo',
  'Fornecedor líder em aços para construção com certificações europeias',
  ARRAY['líder', 'aços', 'armaduras', 'certificação']
);

-- Fornecedor 3: Empresa de Equipamentos
INSERT INTO fornecedores_avancados (
  codigo, nome, nif, morada, codigo_postal, cidade, pais, telefone, email, website,
  contacto_principal, cargo_contacto, status_qualificacao, data_qualificacao, data_reavaliacao,
  criterios_qualificacao, documentos_qualificacao, criterios_avaliacao, categorias,
  produtos_principais, limite_credito, condicoes_pagamento, seguro_responsabilidade,
  certificado_seguranca, politica_qualidade, ultima_auditoria, proxima_auditoria,
  status_monitorizacao, observacoes, tags
) VALUES (
  'FORN-003', 'Equipamentos Ferroviários Lda', '500345678', 'Rua das Indústrias, 456', '4470-000', 'Maia', 'Portugal',
  '+351 229 300 300', 'info@equipferro.pt', 'https://www.equipferro.pt',
  'Carlos Oliveira', 'Diretor Técnico', 'qualificado', '2023-03-10', '2024-03-10',
  ARRAY['ISO 9001', 'ISO 14001', 'Certificação Ferroviária'], ARRAY['certificado_iso9001.pdf', 'certificado_ferroviario.pdf'],
  '{"qualidade": 4.3, "prazo_entrega": 4.0, "preco": 3.9, "comunicacao": 4.1, "flexibilidade": 4.5, "inovacao": 4.7}'::jsonb,
  ARRAY['equipamentos', 'ferroviário', 'sinalização'], ARRAY['Sinais Ferroviários', 'Equipamentos de Via', 'Sistemas de Segurança'],
  300000.00, '30 dias', TRUE, 'certificado_seguranca_equipferro.pdf', 'Política de qualidade especializada em equipamentos ferroviários',
  '2023-08-05', '2024-08-05', 'ativo',
  'Especialista em equipamentos ferroviários com forte componente de inovação',
  ARRAY['especialista', 'ferroviário', 'equipamentos', 'inovação']
);

-- Fornecedor 4: Empresa de Serviços Laboratoriais
INSERT INTO fornecedores_avancados (
  codigo, nome, nif, morada, codigo_postal, cidade, pais, telefone, email, website,
  contacto_principal, cargo_contacto, status_qualificacao, data_qualificacao, data_reavaliacao,
  criterios_qualificacao, documentos_qualificacao, criterios_avaliacao, categorias,
  produtos_principais, limite_credito, condicoes_pagamento, seguro_responsabilidade,
  certificado_seguranca, politica_qualidade, ultima_auditoria, proxima_auditoria,
  status_monitorizacao, observacoes, tags
) VALUES (
  'FORN-004', 'Laboratório Nacional de Engenharia Civil - LNEC', '500456789', 'Avenida do Brasil, 101', '1700-066', 'Lisboa', 'Portugal',
  '+351 218 400 400', 'comercial@lnec.pt', 'https://www.lnec.pt',
  'Ana Costa', 'Responsável de Ensaios', 'qualificado', '2023-04-05', '2024-04-05',
  ARRAY['ISO 17025', 'ISO 9001', 'Acreditação IPAC'], ARRAY['certificado_iso17025.pdf', 'acreditacao_ipac.pdf'],
  '{"qualidade": 4.9, "prazo_entrega": 4.2, "preco": 3.5, "comunicacao": 4.8, "flexibilidade": 4.1, "inovacao": 4.6}'::jsonb,
  ARRAY['laboratório', 'ensaios', 'investigação'], ARRAY['Ensaios de Betão', 'Ensaios de Solos', 'Ensaios de Materiais', 'Investigação'],
  200000.00, '30 dias', TRUE, 'certificado_seguranca_lnec.pdf', 'Política de qualidade com acreditação internacional',
  '2023-09-20', '2024-09-20', 'ativo',
  'Laboratório de referência nacional com acreditação internacional',
  ARRAY['laboratório', 'referência', 'acreditado', 'investigação']
);

-- Fornecedor 5: Empresa Pendente de Qualificação
INSERT INTO fornecedores_avancados (
  codigo, nome, nif, morada, codigo_postal, cidade, pais, telefone, email, website,
  contacto_principal, cargo_contacto, status_qualificacao, data_qualificacao, data_reavaliacao,
  criterios_qualificacao, documentos_qualificacao, criterios_avaliacao, categorias,
  produtos_principais, limite_credito, condicoes_pagamento, seguro_responsabilidade,
  certificado_seguranca, politica_qualidade, ultima_auditoria, proxima_auditoria,
  status_monitorizacao, observacoes, tags
) VALUES (
  'FORN-005', 'Nova Tecnologia Construção Lda', '500567890', 'Parque Industrial, 789', '3800-000', 'Aveiro', 'Portugal',
  '+351 234 500 500', 'contacto@novatec.pt', 'https://www.novatec.pt',
  'Pedro Martins', 'Diretor Geral', 'pendente', NULL, '2024-01-15',
  ARRAY['ISO 9001'], ARRAY['certificado_iso9001.pdf'],
  '{"qualidade": 0, "prazo_entrega": 0, "preco": 0, "comunicacao": 0, "flexibilidade": 0, "inovacao": 0}'::jsonb,
  ARRAY['tecnologia', 'construção', 'inovação'], ARRAY['Sistemas Modulares', 'Tecnologia Verde', 'Automação'],
  100000.00, '30 dias', FALSE, NULL, 'Política de qualidade em desenvolvimento',
  NULL, '2024-01-15', 'ativo',
  'Empresa nova no mercado com potencial de inovação',
  ARRAY['nova', 'tecnologia', 'inovação', 'pendente']
);

-- =====================================================
-- DADOS DE EXEMPLO - AVALIAÇÕES
-- =====================================================
INSERT INTO avaliacoes_fornecedores (fornecedor_id, data_avaliacao, avaliador, tipo_avaliacao, criterios, classificacao_geral, comentarios, acoes_melhoria, prazo_acoes, status_acoes) 
SELECT 
  f.id,
  f.data_qualificacao + INTERVAL '6 months',
  'Eng. Responsável',
  'geral',
  f.criterios_avaliacao,
  f.classificacao_geral,
  'Avaliação semestral realizada com sucesso. Fornecedor mantém padrões de qualidade.',
  ARRAY['Continuar monitorização', 'Manter comunicação regular'],
  f.data_qualificacao + INTERVAL '12 months',
  'concluido'
FROM fornecedores_avancados f 
WHERE f.status_qualificacao = 'qualificado';

-- =====================================================
-- DADOS DE EXEMPLO - CERTIFICAÇÕES
-- =====================================================
INSERT INTO certificacoes_fornecedores (fornecedor_id, tipo_certificacao, organismo_certificador, numero_certificado, data_emissao, data_validade, status, observacoes)
SELECT 
  f.id,
  'ISO 9001:2015',
  'APCER',
  'CERT-' || f.codigo || '-001',
  f.data_qualificacao - INTERVAL '1 year',
  f.data_qualificacao + INTERVAL '3 years',
  'valido',
  'Certificação de qualidade válida'
FROM fornecedores_avancados f 
WHERE f.status_qualificacao = 'qualificado';

-- =====================================================
-- DADOS DE EXEMPLO - HISTÓRICO DE PAGAMENTOS
-- =====================================================
INSERT INTO historico_pagamentos (fornecedor_id, data_vencimento, data_pagamento, valor, status, observacoes)
SELECT 
  f.id,
  CURRENT_DATE - INTERVAL '30 days',
  CURRENT_DATE - INTERVAL '25 days',
  50000.00,
  'pago',
  'Pagamento realizado dentro do prazo'
FROM fornecedores_avancados f 
WHERE f.status_qualificacao = 'qualificado'
LIMIT 3;

-- =====================================================
-- DADOS DE EXEMPLO - PLANOS DE AVALIAÇÃO
-- =====================================================
INSERT INTO planos_avaliacao (nome, descricao, criterios, frequencia, fornecedores_alvo, responsavel, data_inicio, data_fim, status)
VALUES (
  'Plano de Avaliação Trimestral 2024',
  'Avaliação trimestral de todos os fornecedores qualificados',
  ARRAY[(SELECT id FROM criterios_avaliacao WHERE tipo = 'geral' LIMIT 1)],
  'trimestral',
  ARRAY[(SELECT id FROM fornecedores_avancados WHERE status_qualificacao = 'qualificado' LIMIT 1)],
  'Eng. Responsável',
  '2024-01-01',
  '2024-12-31',
  'ativo'
);

-- =====================================================
-- MENSAGEM DE CONFIRMAÇÃO
-- =====================================================
DO $$
BEGIN
  RAISE NOTICE 'Sistema de Fornecedores Avançados criado com sucesso!';
  RAISE NOTICE 'Tabelas criadas: fornecedores_avancados, avaliacoes_fornecedores, certificacoes_fornecedores, historico_pagamentos, criterios_avaliacao, planos_avaliacao';
  RAISE NOTICE 'Índices e políticas de segurança configurados';
  RAISE NOTICE 'Dados de exemplo inseridos: % fornecedores, % avaliações, % certificações, % pagamentos, % critérios, % planos', 
    (SELECT COUNT(*) FROM fornecedores_avancados),
    (SELECT COUNT(*) FROM avaliacoes_fornecedores),
    (SELECT COUNT(*) FROM certificacoes_fornecedores),
    (SELECT COUNT(*) FROM historico_pagamentos),
    (SELECT COUNT(*) FROM criterios_avaliacao),
    (SELECT COUNT(*) FROM planos_avaliacao);
END $$;
