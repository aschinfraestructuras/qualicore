-- =====================================================
-- SCRIPT SQL PARA TABELAS DE CARACTERIZAÇÃO DE SOLOS
-- Seguindo Normativas Portuguesas e Europeias
-- =====================================================

-- Habilitar extensões necessárias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- TABELA PRINCIPAL: caracterizacoes_solos
-- =====================================================
CREATE TABLE IF NOT EXISTS caracterizacoes_solos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  codigo VARCHAR(50) UNIQUE NOT NULL,
  obra VARCHAR(255) NOT NULL,
  localizacao TEXT NOT NULL,
  coordenadas_gps VARCHAR(100),
  data_colheita DATE NOT NULL,
  data_rececao_laboratorio DATE NOT NULL,
  data_resultados DATE NOT NULL,
  laboratorio VARCHAR(150) NOT NULL,
  responsavel_tecnico VARCHAR(150) NOT NULL,
  fiscal_obra VARCHAR(150) NOT NULL,
  
  -- Identificação da Amostra
  profundidade_colheita DECIMAL(5,2) NOT NULL,
  tipo_amostra VARCHAR(50) NOT NULL CHECK (tipo_amostra IN ('Disturbada', 'Indeformada', 'Sondagem')),
  numero_amostra VARCHAR(50) NOT NULL,
  descricao_visual TEXT,
  
  -- Características Físicas
  humidade_natural DECIMAL(5,2), -- %
  densidade_natural DECIMAL(6,3), -- g/cm³
  densidade_seca DECIMAL(6,3), -- g/cm³
  indice_vazios DECIMAL(5,3),
  porosidade DECIMAL(5,2), -- %
  
  -- Granulometria (JSONB para flexibilidade)
  granulometria JSONB DEFAULT '{}',
  
  -- Limites de Consistência (JSONB)
  limites_consistencia JSONB DEFAULT '{}',
  
  -- Ensaios de Compactação (JSONB)
  proctor_normal JSONB DEFAULT '{}',
  proctor_modificado JSONB DEFAULT '{}',
  
  -- Ensaios de Resistência (JSONB)
  cbr JSONB DEFAULT '{}',
  resistencia_cisalhamento JSONB DEFAULT '{}',
  
  -- Características Químicas (JSONB)
  caracteristicas_quimicas JSONB DEFAULT '{}',
  
  -- Classificação (JSONB)
  classificacao JSONB DEFAULT '{}',
  
  -- Ensaios Específicos (JSONB)
  ensaios_especificos JSONB DEFAULT '{}',
  
  -- Conformidade e Observações
  conforme BOOLEAN DEFAULT false,
  observacoes TEXT,
  recomendacoes TEXT,
  
  -- Documentação
  relatorio_laboratorio TEXT, -- URL do PDF
  certificado_laboratorio TEXT, -- URL do PDF
  fotos_amostra TEXT[], -- URLs das fotos
  
  -- Metadados
  normas_referencia TEXT[] DEFAULT '{}',
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- ÍNDICES PARA PERFORMANCE
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_caracterizacoes_solos_codigo ON caracterizacoes_solos(codigo);
CREATE INDEX IF NOT EXISTS idx_caracterizacoes_solos_obra ON caracterizacoes_solos(obra);
CREATE INDEX IF NOT EXISTS idx_caracterizacoes_solos_laboratorio ON caracterizacoes_solos(laboratorio);
CREATE INDEX IF NOT EXISTS idx_caracterizacoes_solos_data_colheita ON caracterizacoes_solos(data_colheita);
CREATE INDEX IF NOT EXISTS idx_caracterizacoes_solos_tipo_amostra ON caracterizacoes_solos(tipo_amostra);
CREATE INDEX IF NOT EXISTS idx_caracterizacoes_solos_conforme ON caracterizacoes_solos(conforme);
CREATE INDEX IF NOT EXISTS idx_caracterizacoes_solos_user_id ON caracterizacoes_solos(user_id);

-- =====================================================
-- FUNÇÃO PARA ATUALIZAR updated_at
-- =====================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- =====================================================
-- TRIGGERS PARA updated_at
-- =====================================================
CREATE TRIGGER update_caracterizacoes_solos_updated_at 
  BEFORE UPDATE ON caracterizacoes_solos 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- FUNÇÃO PARA ESTATÍSTICAS DE SOLOS
-- =====================================================
CREATE OR REPLACE FUNCTION get_solos_stats()
RETURNS JSON AS $$
DECLARE
  result JSON;
BEGIN
  SELECT json_build_object(
    'total_caracterizacoes', COUNT(*),
    'conformes', COUNT(*) FILTER (WHERE conforme = true),
    'nao_conformes', COUNT(*) FILTER (WHERE conforme = false),
    'pendentes', COUNT(*) FILTER (WHERE conforme IS NULL),
    'laboratorios_distribuicao', (
      SELECT json_object_agg(laboratorio, count)
      FROM (
        SELECT laboratorio, COUNT(*) as count
        FROM caracterizacoes_solos
        GROUP BY laboratorio
        ORDER BY count DESC
        LIMIT 10
      ) lab_stats
    ),
    'tipos_amostra_distribuicao', (
      SELECT json_object_agg(tipo_amostra, count)
      FROM (
        SELECT tipo_amostra, COUNT(*) as count
        FROM caracterizacoes_solos
        GROUP BY tipo_amostra
        ORDER BY count DESC
      ) tipo_stats
    ),
    'profundidade_media', AVG(profundidade_colheita),
    'resistencia_media', AVG((cbr->>'valor_cbr')::numeric)
  ) INTO result
  FROM caracterizacoes_solos;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================
ALTER TABLE caracterizacoes_solos ENABLE ROW LEVEL SECURITY;

-- Política para SELECT (utilizadores autenticados podem ver seus próprios registos)
CREATE POLICY "Users can view own caracterizacoes_solos" ON caracterizacoes_solos
  FOR SELECT USING (auth.uid() = user_id);

-- Política para INSERT (utilizadores autenticados podem criar registos)
CREATE POLICY "Users can insert own caracterizacoes_solos" ON caracterizacoes_solos
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Política para UPDATE (utilizadores autenticados podem atualizar seus próprios registos)
CREATE POLICY "Users can update own caracterizacoes_solos" ON caracterizacoes_solos
  FOR UPDATE USING (auth.uid() = user_id);

-- Política para DELETE (utilizadores autenticados podem eliminar seus próprios registos)
CREATE POLICY "Users can delete own caracterizacoes_solos" ON caracterizacoes_solos
  FOR DELETE USING (auth.uid() = user_id);

-- =====================================================
-- DADOS DE EXEMPLO
-- =====================================================

-- Inserir dados de exemplo para caracterização de solos
INSERT INTO caracterizacoes_solos (
  codigo, obra, localizacao, coordenadas_gps, data_colheita, data_rececao_laboratorio, 
  data_resultados, laboratorio, responsavel_tecnico, fiscal_obra, profundidade_colheita, 
  tipo_amostra, numero_amostra, descricao_visual, humidade_natural, densidade_natural, 
  densidade_seca, indice_vazios, porosidade, granulometria, limites_consistencia, 
  proctor_normal, proctor_modificado, cbr, resistencia_cisalhamento, caracteristicas_quimicas, 
  classificacao, ensaios_especificos, conforme, observacoes, recomendacoes, 
  relatorio_laboratorio, certificado_laboratorio, fotos_amostra, normas_referencia
) VALUES 
(
  'SOLO-2024-001',
  'Ponte sobre Rio Douro',
  'Zona de Fundações - Pilar P1',
  '41.1579, -8.6291',
  '2024-01-15',
  '2024-01-16',
  '2024-01-25',
  'Laboratório de Geotecnia Lda',
  'Eng. João Silva',
  'Eng. Maria Santos',
  2.50,
  'Disturbada',
  'AM-001',
  'Argila siltosa, cor castanha, consistência média',
  18.5,
  1.85,
  1.56,
  0.73,
  42.1,
  '{"pedregulho": 0, "areia_grossa": 5, "areia_fina": 25, "silte": 45, "argila": 25, "coeficiente_uniformidade": 8.5, "coeficiente_curvatura": 1.2}',
  '{"limite_liquidez": 35, "limite_plasticidade": 18, "indice_plasticidade": 17, "indice_liquidez": 0.03}',
  '{"humidade_otima": 16.5, "densidade_maxima": 1.78, "grau_compactacao": 95}',
  '{"humidade_otima": 14.2, "densidade_maxima": 1.85, "grau_compactacao": 92}',
  '{"valor_cbr": 8.5, "expansao": 0.8, "penetracao": 2.5}',
  '{"coesao": 45, "angulo_atrito": 25, "tipo_ensaio": "Triaxial"}',
  '{"ph": 7.2, "materia_organica": 1.8, "sulfatos": 850, "gessos": 0.5, "carbonatos": 2.1, "cloretos": 120, "capacidade_troca_cationica": 15.2}',
  '{"sistema_unificado": "CL", "sistema_aashto": "A-6", "grupo_portugues": "Argila siltosa"}',
  '{"permeabilidade": 1.2e-7, "compressibilidade": 0.15, "consolidacao": {"indice_compressao": 0.25, "indice_recompressao": 0.05, "pressao_preconsolidacao": 150}}',
  true,
  'Solo adequado para fundações superficiais com tratamento adequado',
  'Executar compactação controlada e monitorizar assentamentos',
  'https://storage.example.com/relatorios/solo-001.pdf',
  'https://storage.example.com/certificados/solo-001.pdf',
  ARRAY['https://storage.example.com/fotos/solo-001-1.jpg', 'https://storage.example.com/fotos/solo-001-2.jpg'],
  ARRAY['NP EN ISO 17892-12:2018', 'NP EN ISO 17892-4:2016', 'NP EN ISO 14688-1:2018']
),
(
  'SOLO-2024-002',
  'Ponte sobre Rio Douro',
  'Zona de Fundações - Pilar P2',
  '41.1581, -8.6293',
  '2024-01-20',
  '2024-01-21',
  '2024-01-30',
  'Laboratório de Geotecnia Lda',
  'Eng. João Silva',
  'Eng. Maria Santos',
  3.20,
  'Indeformada',
  'AM-002',
  'Areia argilosa, cor amarelada, compacta',
  12.3,
  2.05,
  1.82,
  0.48,
  32.4,
  '{"pedregulho": 8, "areia_grossa": 35, "areia_fina": 40, "silte": 12, "argila": 5, "coeficiente_uniformidade": 12.5, "coeficiente_curvatura": 1.8}',
  '{"limite_liquidez": 28, "limite_plasticidade": 15, "indice_plasticidade": 13, "indice_liquidez": -0.21}',
  '{"humidade_otima": 12.8, "densidade_maxima": 1.95, "grau_compactacao": 98}',
  '{"humidade_otima": 11.5, "densidade_maxima": 2.02, "grau_compactacao": 96}',
  '{"valor_cbr": 15.2, "expansao": 0.3, "penetracao": 1.8}',
  '{"coesao": 25, "angulo_atrito": 32, "tipo_ensaio": "Triaxial"}',
  '{"ph": 6.8, "materia_organica": 0.8, "sulfatos": 450, "gessos": 0.2, "carbonatos": 1.5, "cloretos": 85, "capacidade_troca_cationica": 8.5}',
  '{"sistema_unificado": "SC", "sistema_aashto": "A-2-4", "grupo_portugues": "Areia argilosa"}',
  '{"permeabilidade": 5.8e-6, "compressibilidade": 0.08, "consolidacao": {"indice_compressao": 0.12, "indice_recompressao": 0.03, "pressao_preconsolidacao": 280}}',
  true,
  'Solo excelente para fundações, boa capacidade de carga',
  'Pode ser utilizado diretamente para fundações superficiais',
  'https://storage.example.com/relatorios/solo-002.pdf',
  'https://storage.example.com/certificados/solo-002.pdf',
  ARRAY['https://storage.example.com/fotos/solo-002-1.jpg'],
  ARRAY['NP EN ISO 17892-12:2018', 'NP EN ISO 17892-4:2016', 'NP EN ISO 14688-1:2018']
),
(
  'SOLO-2024-003',
  'Edifício Residencial Centro',
  'Sondagem S1 - Profundidade 5m',
  '38.7223, -9.1393',
  '2024-02-10',
  '2024-02-11',
  '2024-02-20',
  'Geolab - Laboratório de Geotecnia',
  'Eng. Pedro Costa',
  'Eng. Ana Ferreira',
  5.00,
  'Sondagem',
  'AM-003',
  'Argila muito mole, cor cinzenta, com matéria orgânica',
  45.2,
  1.45,
  1.00,
  1.70,
  62.9,
  '{"pedregulho": 0, "areia_grossa": 0, "areia_fina": 8, "silte": 35, "argila": 57, "coeficiente_uniformidade": 3.2, "coeficiente_curvatura": 0.8}',
  '{"limite_liquidez": 65, "limite_plasticidade": 28, "indice_plasticidade": 37, "indice_liquidez": 0.46}',
  '{"humidade_otima": 22.5, "densidade_maxima": 1.45, "grau_compactacao": 88}',
  '{"humidade_otima": 20.1, "densidade_maxima": 1.52, "grau_compactacao": 85}',
  '{"valor_cbr": 2.1, "expansao": 2.5, "penetracao": 4.2}',
  '{"coesao": 15, "angulo_atrito": 18, "tipo_ensaio": "Triaxial"}',
  '{"ph": 6.2, "materia_organica": 4.2, "sulfatos": 1200, "gessos": 1.2, "carbonatos": 0.8, "cloretos": 250, "capacidade_troca_cationica": 28.5}',
  '{"sistema_unificado": "OH", "sistema_aashto": "A-7-5", "grupo_portugues": "Argila orgânica"}',
  '{"permeabilidade": 2.1e-8, "compressibilidade": 0.45, "consolidacao": {"indice_compressao": 0.65, "indice_recompressao": 0.08, "pressao_preconsolidacao": 80}}',
  false,
  'Solo com baixa capacidade de carga, necessita tratamento especial',
  'Recomenda-se escavação e substituição ou fundações profundas',
  'https://storage.example.com/relatorios/solo-003.pdf',
  'https://storage.example.com/certificados/solo-003.pdf',
  ARRAY['https://storage.example.com/fotos/solo-003-1.jpg', 'https://storage.example.com/fotos/solo-003-2.jpg'],
  ARRAY['NP EN ISO 17892-12:2018', 'NP EN ISO 17892-4:2016', 'NP EN ISO 14688-1:2018', 'NP EN ISO 17892-1:2014']
),
(
  'SOLO-2024-004',
  'Autoestrada A1 - Troço Norte',
  'Aterro - Km 45+200',
  '39.8231, -7.4391',
  '2024-02-15',
  '2024-02-16',
  '2024-02-25',
  'Laboratório Nacional de Engenharia Civil',
  'Eng. Carlos Mendes',
  'Eng. Luís Rodrigues',
  1.80,
  'Disturbada',
  'AM-004',
  'Material granular para aterro, mistura de areia e brita',
  8.5,
  2.15,
  1.98,
  0.36,
  26.5,
  '{"pedregulho": 25, "areia_grossa": 45, "areia_fina": 25, "silte": 3, "argila": 2, "coeficiente_uniformidade": 18.5, "coeficiente_curvatura": 2.1}',
  '{"limite_liquidez": 22, "limite_plasticidade": 12, "indice_plasticidade": 10, "indice_liquidez": -0.35}',
  '{"humidade_otima": 9.5, "densidade_maxima": 2.18, "grau_compactacao": 97}',
  '{"humidade_otima": 8.2, "densidade_maxima": 2.25, "grau_compactacao": 95}',
  '{"valor_cbr": 25.8, "expansao": 0.1, "penetracao": 1.2}',
  '{"coesao": 8, "angulo_atrito": 38, "tipo_ensaio": "Triaxial"}',
  '{"ph": 7.5, "materia_organica": 0.3, "sulfatos": 180, "gessos": 0.1, "carbonatos": 0.5, "cloretos": 45, "capacidade_troca_cationica": 4.2}',
  '{"sistema_unificado": "GW", "sistema_aashto": "A-1-a", "grupo_portugues": "Material granular"}',
  '{"permeabilidade": 1.2e-4, "compressibilidade": 0.03, "consolidacao": {"indice_compressao": 0.05, "indice_recompressao": 0.01, "pressao_preconsolidacao": 450}}',
  true,
  'Material excelente para aterros, alta capacidade de carga',
  'Adequado para aterros de autoestrada com compactação controlada',
  'https://storage.example.com/relatorios/solo-004.pdf',
  'https://storage.example.com/certificados/solo-004.pdf',
  ARRAY['https://storage.example.com/fotos/solo-004-1.jpg'],
  ARRAY['NP EN ISO 17892-12:2018', 'NP EN ISO 17892-4:2016', 'NP EN ISO 14688-1:2018', 'NP EN 13242:2013']
),
(
  'SOLO-2024-005',
  'Barragem do Alqueva',
  'Núcleo - Cota 120m',
  '38.1956, -7.5003',
  '2024-03-05',
  '2024-03-06',
  '2024-03-15',
  'Laboratório de Geotecnia da Universidade do Porto',
  'Prof. Dr. Manuel Santos',
  'Eng. Francisco Almeida',
  4.50,
  'Indeformada',
  'AM-005',
  'Argila compacta, cor avermelhada, sem fissuras',
  16.8,
  1.92,
  1.64,
  0.65,
  39.4,
  '{"pedregulho": 2, "areia_grossa": 8, "areia_fina": 15, "silte": 40, "argila": 35, "coeficiente_uniformidade": 9.8, "coeficiente_curvatura": 1.5}',
  '{"limite_liquidez": 42, "limite_plasticidade": 20, "indice_plasticidade": 22, "indice_liquidez": -0.15}',
  '{"humidade_otima": 15.2, "densidade_maxima": 1.88, "grau_compactacao": 96}',
  '{"humidade_otima": 13.8, "densidade_maxima": 1.95, "grau_compactacao": 94}',
  '{"valor_cbr": 12.5, "expansao": 0.5, "penetracao": 2.1}',
  '{"coesao": 55, "angulo_atrito": 28, "tipo_ensaio": "Triaxial"}',
  '{"ph": 6.9, "materia_organica": 1.2, "sulfatos": 680, "gessos": 0.8, "carbonatos": 1.8, "cloretos": 95, "capacidade_troca_cationica": 18.5}',
  '{"sistema_unificado": "CL", "sistema_aashto": "A-6", "grupo_portugues": "Argila siltosa"}',
  '{"permeabilidade": 3.5e-8, "compressibilidade": 0.12, "consolidacao": {"indice_compressao": 0.18, "indice_recompressao": 0.04, "pressao_preconsolidacao": 320}}',
  true,
  'Argila adequada para núcleo de barragem com impermeabilização',
  'Executar compactação em camadas finas com controlo rigoroso da humidade',
  'https://storage.example.com/relatorios/solo-005.pdf',
  'https://storage.example.com/certificados/solo-005.pdf',
  ARRAY['https://storage.example.com/fotos/solo-005-1.jpg', 'https://storage.example.com/fotos/solo-005-2.jpg'],
  ARRAY['NP EN ISO 17892-12:2018', 'NP EN ISO 17892-4:2016', 'NP EN ISO 14688-1:2018', 'NP EN 1997-1:2010']
);

-- =====================================================
-- COMENTÁRIOS E DOCUMENTAÇÃO
-- =====================================================
COMMENT ON TABLE caracterizacoes_solos IS 'Tabela para armazenar caracterizações completas de solos de obras de construção civil';
COMMENT ON COLUMN caracterizacoes_solos.codigo IS 'Código único da caracterização de solo';
COMMENT ON COLUMN caracterizacoes_solos.obra IS 'Nome da obra onde foi colhida a amostra';
COMMENT ON COLUMN caracterizacoes_solos.localizacao IS 'Localização específica da colheita na obra';
COMMENT ON COLUMN caracterizacoes_solos.profundidade_colheita IS 'Profundidade de colheita em metros';
COMMENT ON COLUMN caracterizacoes_solos.tipo_amostra IS 'Tipo de amostra: Disturbada, Indeformada ou Sondagem';
COMMENT ON COLUMN caracterizacoes_solos.granulometria IS 'Dados de granulometria em formato JSONB';
COMMENT ON COLUMN caracterizacoes_solos.limites_consistencia IS 'Limites de Atterberg em formato JSONB';
COMMENT ON COLUMN caracterizacoes_solos.cbr IS 'Dados do ensaio CBR em formato JSONB';
COMMENT ON COLUMN caracterizacoes_solos.caracteristicas_quimicas IS 'Características químicas do solo em formato JSONB';
COMMENT ON COLUMN caracterizacoes_solos.classificacao IS 'Classificação do solo segundo diferentes sistemas em formato JSONB';
COMMENT ON COLUMN caracterizacoes_solos.conforme IS 'Indica se o solo está conforme com as especificações';
COMMENT ON COLUMN caracterizacoes_solos.normas_referencia IS 'Array com as normas de referência utilizadas nos ensaios';

-- =====================================================
-- FIM DO SCRIPT
-- =====================================================
