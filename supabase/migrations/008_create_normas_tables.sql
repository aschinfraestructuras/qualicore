-- =====================================================
-- SCRIPT SQL PARA SISTEMA DE NORMAS
-- =====================================================

-- Extensão para UUIDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- TABELA PRINCIPAL DE NORMAS
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
  observacoes TEXT,
  tags TEXT[],
  prioridade VARCHAR(20) NOT NULL DEFAULT 'MEDIA',
  ultima_atualizacao TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  criado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  atualizado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- TABELA DE VERSÕES DE NORMAS
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
-- TABELA DE APLICAÇÕES DE NORMAS
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
-- TABELA DE NOTIFICAÇÕES DE NORMAS
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
-- ÍNDICES PARA OTIMIZAÇÃO
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_normas_codigo ON normas(codigo);
CREATE INDEX IF NOT EXISTS idx_normas_categoria ON normas(categoria);
CREATE INDEX IF NOT EXISTS idx_normas_organismo ON normas(organismo);
CREATE INDEX IF NOT EXISTS idx_normas_status ON normas(status);
CREATE INDEX IF NOT EXISTS idx_normas_prioridade ON normas(prioridade);
CREATE INDEX IF NOT EXISTS idx_normas_data_publicacao ON normas(data_publicacao);
CREATE INDEX IF NOT EXISTS idx_normas_tags ON normas USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_normas_aplicabilidade ON normas USING GIN(aplicabilidade);

CREATE INDEX IF NOT EXISTS idx_versoes_norma_id ON versoes_normas(norma_id);
CREATE INDEX IF NOT EXISTS idx_versoes_status ON versoes_normas(status);

CREATE INDEX IF NOT EXISTS idx_aplicacoes_norma_id ON aplicacoes_normas(norma_id);
CREATE INDEX IF NOT EXISTS idx_aplicacoes_modulo ON aplicacoes_normas(modulo_id, modulo_tipo);
CREATE INDEX IF NOT EXISTS idx_aplicacoes_tipo ON aplicacoes_normas(aplicabilidade);

CREATE INDEX IF NOT EXISTS idx_notificacoes_destinatarios ON notificacoes_normas USING GIN(destinatarios);
CREATE INDEX IF NOT EXISTS idx_notificacoes_lida ON notificacoes_normas(lida);
CREATE INDEX IF NOT EXISTS idx_notificacoes_data_envio ON notificacoes_normas(data_envio);

-- =====================================================
-- FUNÇÃO PARA ATUALIZAR TIMESTAMP
-- =====================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.atualizado_em = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- =====================================================
-- TRIGGERS PARA ATUALIZAÇÃO AUTOMÁTICA
-- =====================================================
CREATE TRIGGER update_normas_updated_at 
  BEFORE UPDATE ON normas 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_aplicacoes_normas_updated_at 
  BEFORE UPDATE ON aplicacoes_normas 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- FUNÇÃO PARA ESTATÍSTICAS DE NORMAS
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
      ) cat_stats
    ),
    'distribuicao_organismos', (
      SELECT json_object_agg(organismo, count)
      FROM (
        SELECT organismo, COUNT(*) as count
        FROM normas
        GROUP BY organismo
      ) org_stats
    ),
    'normas_recentes', COUNT(*) FILTER (WHERE data_publicacao >= CURRENT_DATE - INTERVAL '30 days'),
    'normas_vencendo', COUNT(*) FILTER (WHERE data_entrada_vigor <= CURRENT_DATE + INTERVAL '90 days' AND data_entrada_vigor > CURRENT_DATE)
  ) INTO result
  FROM normas;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- POLÍTICAS DE SEGURANÇA (RLS)
-- =====================================================
ALTER TABLE normas ENABLE ROW LEVEL SECURITY;
ALTER TABLE versoes_normas ENABLE ROW LEVEL SECURITY;
ALTER TABLE aplicacoes_normas ENABLE ROW LEVEL SECURITY;
ALTER TABLE notificacoes_normas ENABLE ROW LEVEL SECURITY;

-- Políticas para utilizadores autenticados
CREATE POLICY "Utilizadores autenticados podem ver normas" ON normas
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Utilizadores autenticados podem inserir normas" ON normas
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Utilizadores autenticados podem atualizar normas" ON normas
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Utilizadores autenticados podem eliminar normas" ON normas
  FOR DELETE USING (auth.role() = 'authenticated');

-- Políticas para versões
CREATE POLICY "Utilizadores autenticados podem ver versões" ON versoes_normas
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Utilizadores autenticados podem gerir versões" ON versoes_normas
  FOR ALL USING (auth.role() = 'authenticated');

-- Políticas para aplicações
CREATE POLICY "Utilizadores autenticados podem ver aplicações" ON aplicacoes_normas
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Utilizadores autenticados podem gerir aplicações" ON aplicacoes_normas
  FOR ALL USING (auth.role() = 'authenticated');

-- Políticas para notificações
CREATE POLICY "Utilizadores podem ver suas notificações" ON notificacoes_normas
  FOR SELECT USING (
    auth.role() = 'authenticated' AND 
    auth.uid()::text = ANY(destinatarios)
  );

CREATE POLICY "Utilizadores autenticados podem gerir notificações" ON notificacoes_normas
  FOR ALL USING (auth.role() = 'authenticated');

-- =====================================================
-- DADOS DE EXEMPLO - NORMAS EUROPEIAS E PORTUGUESAS
-- =====================================================

-- Normas de Betão Estrutural
INSERT INTO normas (codigo, titulo, descricao, categoria, subcategoria, organismo, versao, data_publicacao, data_entrada_vigor, status, escopo, aplicabilidade, requisitos_principais, metodos_ensaio, limites_aceitacao, documentos_relacionados, observacoes, tags, prioridade) VALUES
('NP EN 206+A1', 'Betão - Especificação, propriedades, produção e conformidade', 'Especificação para betão estrutural e não estrutural', 'BETAO_ESTRUTURAL', 'Composição e Propriedades', 'NP EN', '2016+A1:2018', '2018-06-01', '2018-12-01', 'ATIVA', 'Betão estrutural e não estrutural para construção', ARRAY['Estruturas', 'Fundações', 'Pavimentos'], ARRAY['Resistência à compressão', 'Durabilidade', 'Trabalhabilidade'], ARRAY['EN 12390-3', 'EN 12390-5'], '{"resistencia_minima": 25, "durabilidade_classe": "XC1-XC4"}', ARRAY['NP EN 1992-1-1', 'NP EN 12390'], 'Norma fundamental para betão estrutural', ARRAY['betão', 'estrutural', 'resistência', 'durabilidade'], 'CRITICA'),

('NP EN 1992-1-1', 'Eurocódigo 2: Projeto de estruturas de betão - Parte 1-1: Regras gerais e regras para edifícios', 'Regras para projeto de estruturas de betão', 'BETAO_ESTRUTURAL', 'Estruturas', 'NP EN', '2010', '2010-04-01', '2010-10-01', 'ATIVA', 'Projeto de estruturas de betão armado e pré-esforçado', ARRAY['Estruturas', 'Pontes', 'Edifícios'], ARRAY['Estados limites', 'Durabilidade', 'Segurança estrutural'], ARRAY['EN 1990', 'EN 1991'], '{"coeficiente_seguranca": 1.5, "vida_util": 50}', ARRAY['NP EN 206', 'NP EN 1990'], 'Eurocódigo fundamental para estruturas', ARRAY['eurocódigo', 'estruturas', 'projeto', 'segurança'], 'CRITICA'),

('NP EN 12390-3', 'Ensaios de betão endurecido - Parte 3: Resistência à compressão de provetes', 'Método para determinação da resistência à compressão', 'BETAO_ESTRUTURAL', 'Ensaios e Controlo', 'NP EN', '2019', '2019-03-01', '2019-09-01', 'ATIVA', 'Ensaios de resistência à compressão', ARRAY['Controlo de qualidade', 'Ensaios'], ARRAY['Preparação de provetes', 'Condições de ensaio', 'Cálculo de resultados'], ARRAY['Preparação', 'Ensaio', 'Cálculo'], '{"idade_ensaio": 28, "incerteza_maxima": 0.05}', ARRAY['NP EN 206', 'NP EN 12390-1'], 'Método padrão para ensaios de resistência', ARRAY['ensaio', 'resistência', 'compressão', 'provetes'], 'ALTA'),

('NP EN 12390-5', 'Ensaios de betão endurecido - Parte 5: Resistência à flexão de provetes', 'Método para determinação da resistência à flexão', 'BETAO_ESTRUTURAL', 'Ensaios e Controlo', 'NP EN', '2019', '2019-03-01', '2019-09-01', 'ATIVA', 'Ensaios de resistência à flexão', ARRAY['Controlo de qualidade', 'Ensaios'], ARRAY['Preparação de provetes', 'Condições de ensaio', 'Cálculo de resultados'], ARRAY['Preparação', 'Ensaio', 'Cálculo'], '{"idade_ensaio": 28, "incerteza_maxima": 0.05}', ARRAY['NP EN 206', 'NP EN 12390-1'], 'Método para ensaios de flexão', ARRAY['ensaio', 'resistência', 'flexão', 'provetes'], 'ALTA');

-- Normas de Solos e Fundações
INSERT INTO normas (codigo, titulo, descricao, categoria, subcategoria, organismo, versao, data_publicacao, data_entrada_vigor, status, escopo, aplicabilidade, requisitos_principais, metodos_ensaio, limites_aceitacao, documentos_relacionados, observacoes, tags, prioridade) VALUES
('NP EN ISO 14688-1', 'Investigações e ensaios geotécnicos - Identificação e classificação de solos - Parte 1: Identificação e descrição', 'Identificação e classificação de solos', 'SOLOS_FUNDACOES', 'Caracterização de Solos', 'NP EN ISO', '2018', '2018-05-01', '2018-11-01', 'ATIVA', 'Identificação e classificação de solos', ARRAY['Fundações', 'Aterros', 'Estabilização'], ARRAY['Descrição visual', 'Classificação', 'Identificação'], ARRAY['Descrição visual', 'Ensaios de identificação'], '{"granulometria": "definida", "plasticidade": "definida"}', ARRAY['NP EN ISO 14688-2', 'NP EN ISO 14689-1'], 'Norma fundamental para identificação de solos', ARRAY['solos', 'identificação', 'classificação', 'geotecnia'], 'CRITICA'),

('NP EN ISO 17892-4', 'Investigações e ensaios geotécnicos - Ensaios laboratoriais de solos - Parte 4: Determinação da distribuição granulométrica', 'Determinação da granulometria de solos', 'SOLOS_FUNDACOES', 'Ensaios de Laboratório', 'NP EN ISO', '2016', '2016-08-01', '2017-02-01', 'ATIVA', 'Ensaios de granulometria', ARRAY['Fundações', 'Aterros', 'Materiais'], ARRAY['Peneiração', 'Sedimentação', 'Análise granulométrica'], ARRAY['Peneiração', 'Sedimentação', 'Análise'], '{"peneiras": "série_normal", "sedimentacao": "método_hidrômetro"}', ARRAY['NP EN ISO 14688-1', 'NP EN ISO 17892-1'], 'Método para análise granulométrica', ARRAY['granulometria', 'peneiração', 'sedimentação', 'solos'], 'ALTA'),

('NP EN ISO 17892-6', 'Investigações e ensaios geotécnicos - Ensaios laboratoriais de solos - Parte 6: Ensaio de limite de consistência', 'Determinação dos limites de Atterberg', 'SOLOS_FUNDACOES', 'Ensaios de Laboratório', 'NP EN ISO', '2017', '2017-06-01', '2017-12-01', 'ATIVA', 'Ensaios de limites de consistência', ARRAY['Fundações', 'Aterros', 'Classificação'], ARRAY['Limite líquido', 'Limite plástico', 'Índice de plasticidade'], ARRAY['Ensaio de limite líquido', 'Ensaio de limite plástico'], '{"limite_liquido": "método_casagrande", "limite_plastico": "método_rolamento"}', ARRAY['NP EN ISO 14688-1', 'NP EN ISO 17892-1'], 'Método para limites de consistência', ARRAY['limites', 'consistência', 'atterberg', 'plasticidade'], 'ALTA');

-- Normas Ferroviárias
INSERT INTO normas (codigo, titulo, descricao, categoria, subcategoria, organismo, versao, data_publicacao, data_entrada_vigor, status, escopo, aplicabilidade, requisitos_principais, metodos_ensaio, limites_aceitacao, documentos_relacionados, observacoes, tags, prioridade) VALUES
('UIC 702', 'Características geométricas da via - Travessas', 'Especificações para travessas ferroviárias', 'FERROVIARIA', 'Via Férrea', 'UIC', '2019', '2019-01-01', '2019-07-01', 'ATIVA', 'Travessas para via férrea', ARRAY['Via Férrea', 'Manutenção'], ARRAY['Dimensões', 'Material', 'Resistência'], ARRAY['Ensaios mecânicos', 'Ensaios de durabilidade'], '{"resistencia_flexao": 300, "durabilidade": 50}', ARRAY['EN 13146', 'EN 13481'], 'Norma UIC para travessas', ARRAY['travessas', 'via', 'ferroviária', 'UIC'], 'ALTA'),

('EN 13146-1', 'Aplicações ferroviárias - Via - Métodos de ensaio para fixações - Parte 1: Determinação da resistência ao deslizamento longitudinal', 'Ensaio de resistência ao deslizamento', 'FERROVIARIA', 'Via Férrea', 'EN', '2019', '2019-03-01', '2019-09-01', 'ATIVA', 'Ensaios de fixações ferroviárias', ARRAY['Via Férrea', 'Fixações'], ARRAY['Resistência ao deslizamento', 'Condições de ensaio'], ARRAY['Ensaio de deslizamento', 'Medição de forças'], '{"forca_minima": 25, "deslocamento_maximo": 2}', ARRAY['EN 13146', 'UIC 702'], 'Método para ensaio de fixações', ARRAY['fixações', 'deslizamento', 'via', 'ensaios'], 'ALTA'),

('EN 13481-1', 'Aplicações ferroviárias - Via - Produtos de fixação - Parte 1: Especificações', 'Especificações para produtos de fixação', 'FERROVIARIA', 'Via Férrea', 'EN', '2018', '2018-11-01', '2019-05-01', 'ATIVA', 'Produtos de fixação ferroviária', ARRAY['Via Férrea', 'Fixações'], ARRAY['Especificações técnicas', 'Materiais', 'Dimensões'], ARRAY['Ensaios mecânicos', 'Ensaios de corrosão'], '{"resistencia_tracao": 400, "resistencia_corrosao": "classe_C4"}', ARRAY['EN 13146', 'UIC 702'], 'Especificações para fixações', ARRAY['fixações', 'especificações', 'via', 'produtos'], 'ALTA');

-- Normas de Aços e Armaduras
INSERT INTO normas (codigo, titulo, descricao, categoria, subcategoria, organismo, versao, data_publicacao, data_entrada_vigor, status, escopo, aplicabilidade, requisitos_principais, metodos_ensaio, limites_aceitacao, documentos_relacionados, observacoes, tags, prioridade) VALUES
('NP EN 10080', 'Aços para armaduras de betão - Aços soldáveis para armaduras de betão - Geral', 'Especificações para aços de armadura', 'ACOS_ARMADURA', 'Aços para Betão', 'NP EN', '2005', '2005-09-01', '2006-03-01', 'ATIVA', 'Aços para armaduras de betão', ARRAY['Estruturas', 'Armaduras'], ARRAY['Composição química', 'Propriedades mecânicas', 'Soldabilidade'], ARRAY['EN 10002-1', 'EN ISO 6892-1'], '{"resistencia_escoamento": 500, "alongamento": 5}', ARRAY['NP EN 1992-1-1', 'NP EN 206'], 'Especificações para aços de armadura', ARRAY['aços', 'armadura', 'betão', 'soldabilidade'], 'CRITICA'),

('NP EN ISO 6892-1', 'Materiais metálicos - Ensaio de tração - Parte 1: Método de ensaio à temperatura ambiente', 'Método para ensaio de tração', 'ACOS_ARMADURA', 'Ensaios Mecânicos', 'NP EN ISO', '2019', '2019-12-01', '2020-06-01', 'ATIVA', 'Ensaios de tração de materiais metálicos', ARRAY['Aços', 'Materiais metálicos'], ARRAY['Preparação de provetes', 'Condições de ensaio', 'Cálculo de resultados'], ARRAY['Preparação', 'Ensaio', 'Cálculo'], '{"velocidade_ensaio": "controlada", "incerteza": 0.02}', ARRAY['NP EN 10080', 'NP EN 1992-1-1'], 'Método padrão para ensaios de tração', ARRAY['tração', 'ensaios', 'materiais', 'metálicos'], 'ALTA');

-- Normas de Segurança
INSERT INTO normas (codigo, titulo, descricao, categoria, subcategoria, organismo, versao, data_publicacao, data_entrada_vigor, status, escopo, aplicabilidade, requisitos_principais, metodos_ensaio, limites_aceitacao, documentos_relacionados, observacoes, tags, prioridade) VALUES
('NP 4397', 'Sinalização de segurança e saúde no trabalho - Cores e sinais de segurança', 'Sinalização de segurança em obras', 'SEGURANCA_OBRAS', 'Sinalização de Segurança', 'NP', '2008', '2008-05-01', '2008-11-01', 'ATIVA', 'Sinalização de segurança em locais de trabalho', ARRAY['Obras', 'Segurança'], ARRAY['Cores de segurança', 'Sinais de segurança', 'Aplicação'], ARRAY['Verificação visual', 'Ensaios de visibilidade'], '{"visibilidade": "mínima_10m", "contraste": "mínimo_70%"}', ARRAY['NP 4398', 'NP 4399'], 'Norma portuguesa para sinalização', ARRAY['sinalização', 'segurança', 'cores', 'sinais'], 'ALTA'),

('NP EN ISO 7010', 'Símbolos gráficos - Cores e sinais de segurança - Sinais de segurança registados', 'Símbolos de segurança padronizados', 'SEGURANCA_OBRAS', 'Sinalização de Segurança', 'NP EN ISO', '2020', '2020-03-01', '2020-09-01', 'ATIVA', 'Símbolos gráficos de segurança', ARRAY['Obras', 'Segurança', 'Sinalização'], ARRAY['Símbolos padronizados', 'Cores', 'Formas'], ARRAY['Verificação visual', 'Ensaios de compreensão'], '{"compreensao": "mínima_85%", "visibilidade": "mínima_15m"}', ARRAY['NP 4397', 'ISO 3864'], 'Símbolos internacionais de segurança', ARRAY['símbolos', 'segurança', 'padronização', 'internacional'], 'ALTA');

-- =====================================================
-- DADOS DE EXEMPLO - VERSÕES
-- =====================================================
INSERT INTO versoes_normas (norma_id, versao, data_publicacao, data_entrada_vigor, alteracoes_principais, status, observacoes) 
SELECT 
  n.id,
  n.versao,
  n.data_publicacao,
  n.data_entrada_vigor,
  ARRAY['Versão inicial'],
  'ATUAL',
  'Versão atual da norma'
FROM normas n;

-- =====================================================
-- DADOS DE EXEMPLO - APLICAÇÕES
-- =====================================================
INSERT INTO aplicacoes_normas (norma_id, modulo_id, modulo_tipo, aplicabilidade, requisitos_especificos, verificacoes_necessarias, frequencia_verificacao, responsavel_verificacao)
SELECT 
  n.id,
  '00000000-0000-0000-0000-000000000001'::UUID,
  'betonagens',
  'OBRIGATORIA',
  ARRAY['Aplicar em todas as betonagens estruturais'],
  ARRAY['Verificar resistência', 'Verificar durabilidade'],
  'Por betonagem',
  'Engenheiro responsável'
FROM normas n 
WHERE n.categoria = 'BETAO_ESTRUTURAL';

INSERT INTO aplicacoes_normas (norma_id, modulo_id, modulo_tipo, aplicabilidade, requisitos_especificos, verificacoes_necessarias, frequencia_verificacao, responsavel_verificacao)
SELECT 
  n.id,
  '00000000-0000-0000-0000-000000000002'::UUID,
  'solos',
  'OBRIGATORIA',
  ARRAY['Aplicar em todas as caracterizações de solos'],
  ARRAY['Verificar classificação', 'Verificar ensaios'],
  'Por amostra',
  'Geólogo/Geotécnico'
FROM normas n 
WHERE n.categoria = 'SOLOS_FUNDACOES';

-- =====================================================
-- DADOS DE EXEMPLO - NOTIFICAÇÕES
-- =====================================================
INSERT INTO notificacoes_normas (norma_id, tipo, titulo, mensagem, prioridade, destinatarios)
VALUES
(
  (SELECT id FROM normas WHERE codigo = 'NP EN 206+A1'),
  'NOVA_NORMA',
  'Nova norma de betão publicada',
  'A norma NP EN 206+A1 foi publicada e está em vigor desde 2018-12-01',
  'ALTA',
  ARRAY['admin@qualicore.pt', 'engenheiro@qualicore.pt']
),
(
  (SELECT id FROM normas WHERE codigo = 'NP EN 1992-1-1'),
  'ATUALIZACAO_NORMA',
  'Atualização da norma Eurocódigo 2',
  'A norma NP EN 1992-1-1 foi atualizada com novas regras de projeto',
  'CRITICA',
  ARRAY['admin@qualicore.pt', 'projeto@qualicore.pt']
);

-- =====================================================
-- MENSAGEM DE CONFIRMAÇÃO
-- =====================================================
DO $$
BEGIN
  RAISE NOTICE 'Sistema de Normas criado com sucesso!';
  RAISE NOTICE 'Tabelas criadas: normas, versoes_normas, aplicacoes_normas, notificacoes_normas';
  RAISE NOTICE 'Índices e políticas de segurança configurados';
  RAISE NOTICE 'Dados de exemplo inseridos: % normas, % versões, % aplicações, % notificações', 
    (SELECT COUNT(*) FROM normas),
    (SELECT COUNT(*) FROM versoes_normas),
    (SELECT COUNT(*) FROM aplicacoes_normas),
    (SELECT COUNT(*) FROM notificacoes_normas);
END $$;
