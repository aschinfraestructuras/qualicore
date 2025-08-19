-- =====================================================
-- SCRIPT SQL COMPLETO - CARACTERIZAÇÃO DE SOLOS
-- =====================================================
-- Este script cria toda a estrutura necessária para o módulo
-- de Caracterização de Solos no Supabase
-- =====================================================

-- =====================================================
-- 1. CRIAÇÃO DAS TABELAS
-- =====================================================

-- Tabela de Laboratórios
CREATE TABLE IF NOT EXISTS laboratorios_solos (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(255) NOT NULL,
  codigo VARCHAR(50) UNIQUE NOT NULL,
  endereco TEXT,
  telefone VARCHAR(20),
  email VARCHAR(255),
  responsavel_tecnico VARCHAR(255),
  acreditacao VARCHAR(100),
  observacoes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Tabela de Normas de Referência
CREATE TABLE IF NOT EXISTS normas_solos (
  id SERIAL PRIMARY KEY,
  codigo VARCHAR(50) NOT NULL,
  titulo VARCHAR(500) NOT NULL,
  descricao TEXT,
  categoria VARCHAR(100),
  pais VARCHAR(50) DEFAULT 'Portugal',
  ano_publicacao INTEGER,
  status VARCHAR(20) DEFAULT 'Ativa',
  observacoes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Tabela de Caracterizações de Solos
CREATE TABLE IF NOT EXISTS caracterizacoes_solos (
  id SERIAL PRIMARY KEY,
  codigo VARCHAR(100) UNIQUE NOT NULL,
  obra VARCHAR(255) NOT NULL,
  localizacao VARCHAR(255) NOT NULL,
  coordenadas_gps VARCHAR(100),
  data_colheita DATE NOT NULL,
  data_rececao_laboratorio DATE NOT NULL,
  data_resultados DATE NOT NULL,
  laboratorio VARCHAR(255) NOT NULL,
  responsavel_tecnico VARCHAR(255) NOT NULL,
  fiscal_obra VARCHAR(255) NOT NULL,
  
  -- Identificação da Amostra
  profundidade_colheita DECIMAL(5,2) NOT NULL,
  tipo_amostra VARCHAR(50) NOT NULL CHECK (tipo_amostra IN ('Disturbada', 'Indeformada', 'Sondagem')),
  numero_amostra VARCHAR(100) NOT NULL,
  descricao_visual TEXT,
  
  -- Características Físicas
  humidade_natural DECIMAL(5,2), -- %
  densidade_natural DECIMAL(5,3), -- g/cm³
  densidade_seca DECIMAL(5,3), -- g/cm³
  indice_vazios DECIMAL(5,3),
  porosidade DECIMAL(5,2), -- %
  
  -- Granulometria por Peneiração
  granulometria_peneiracao JSONB,
  
  -- Granulometria por Sedimentação
  granulometria_sedimentacao JSONB,
  
  -- Limites de Consistência (Atterberg)
  limites_consistencia JSONB,
  
  -- Ensaios de Compactação
  proctor_normal JSONB,
  proctor_modificado JSONB,
  
  -- Ensaios de Resistência
  cbr JSONB,
  resistencia_cisalhamento JSONB,
  
  -- Características Químicas
  caracteristicas_quimicas JSONB,
  
  -- Ensaios Específicos
  ensaios_especificos JSONB,
  
  -- Classificação
  classificacao JSONB,
  
  -- Conformidade e Observações
  conforme BOOLEAN DEFAULT false,
  observacoes TEXT,
  recomendacoes TEXT,
  
  -- Documentação
  relatorio_laboratorio VARCHAR(500),
  certificado_laboratorio VARCHAR(500),
  fotos_amostra TEXT[],
  
  -- Metadados
  normas_referencia TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE
);

-- =====================================================
-- 2. INSERÇÃO DE DADOS DE EXEMPLO
-- =====================================================

-- Limpar dados existentes
DELETE FROM caracterizacoes_solos;
DELETE FROM normas_solos;
DELETE FROM laboratorios_solos;

-- Inserir Laboratórios
INSERT INTO laboratorios_solos (nome, codigo, endereco, telefone, email, responsavel_tecnico, acreditacao) VALUES
('Laboratório de Geotecnia do LNEC', 'LNEC-GEO', 'Av. do Brasil, 101, 1700-066 Lisboa', '+351 218 443 000', 'geotecnia@lnec.pt', 'Dr. João Silva', 'IPAC 2023/001'),
('Laboratório de Solos da FEUP', 'FEUP-SOLOS', 'Rua Dr. Roberto Frias, 4200-465 Porto', '+351 225 081 400', 'solos@fe.up.pt', 'Prof. Maria Santos', 'IPAC 2023/002'),
('Laboratório de Geologia da UC', 'UC-GEO', 'Rua Larga, 3004-516 Coimbra', '+351 239 247 200', 'geologia@uc.pt', 'Dr. Carlos Oliveira', 'IPAC 2023/003'),
('Laboratório de Engenharia Civil do IST', 'IST-EC', 'Av. Rovisco Pais, 1049-001 Lisboa', '+351 218 417 000', 'civil@tecnico.ulisboa.pt', 'Prof. Ana Costa', 'IPAC 2023/004'),
('Laboratório de Materiais da UMinho', 'UMINHO-MAT', 'Campus de Azurém, 4800-058 Guimarães', '+351 253 510 200', 'materiais@uminho.pt', 'Dr. Pedro Martins', 'IPAC 2023/005');

-- Inserir Normas de Referência
INSERT INTO normas_solos (codigo, titulo, descricao, categoria, ano_publicacao) VALUES
('NP EN ISO 17892-1', 'Investigações geotécnicas - Ensaios laboratoriais de solos - Parte 1: Determinação do teor em água', 'Determinação do teor em água por secagem em estufa', 'Características Físicas', 2014),
('NP EN ISO 17892-2', 'Investigações geotécnicas - Ensaios laboratoriais de solos - Parte 2: Determinação da massa volúmica das partículas', 'Determinação da massa volúmica das partículas', 'Características Físicas', 2014),
('NP EN ISO 17892-3', 'Investigações geotécnicas - Ensaios laboratoriais de solos - Parte 3: Determinação da massa volúmica aparente', 'Determinação da massa volúmica aparente', 'Características Físicas', 2015),
('NP EN ISO 17892-4', 'Investigações geotécnicas - Ensaios laboratoriais de solos - Parte 4: Determinação da distribuição granulométrica', 'Determinação da distribuição granulométrica', 'Granulometria', 2016),
('NP EN ISO 17892-6', 'Investigações geotécnicas - Ensaios laboratoriais de solos - Parte 6: Determinação dos limites de consistência', 'Determinação dos limites de Atterberg', 'Limites de Consistência', 2017),
('NP EN ISO 17892-7', 'Investigações geotécnicas - Ensaios laboratoriais de solos - Parte 7: Ensaios de compactação', 'Ensaios de compactação Proctor', 'Compactação', 2017),
('NP EN ISO 17892-8', 'Investigações geotécnicas - Ensaios laboratoriais de solos - Parte 8: Ensaios de cisalhamento', 'Ensaios de resistência ao cisalhamento', 'Resistência', 2018),
('NP EN ISO 17892-9', 'Investigações geotécnicas - Ensaios laboratoriais de solos - Parte 9: Ensaios de compressibilidade', 'Ensaios de compressibilidade unidimensional', 'Compressibilidade', 2018),
('NP EN ISO 14688-1', 'Investigações geotécnicas - Identificação e classificação de solos - Parte 1: Identificação e descrição', 'Identificação e descrição de solos', 'Classificação', 2018),
('NP EN ISO 14688-2', 'Investigações geotécnicas - Identificação e classificação de solos - Parte 2: Princípios para uma classificação', 'Classificação de solos', 'Classificação', 2018);

-- Inserir Caracterizações de Solos
INSERT INTO caracterizacoes_solos (
  codigo, obra, localizacao, data_colheita, data_rececao_laboratorio, data_resultados,
  laboratorio, responsavel_tecnico, fiscal_obra, profundidade_colheita, tipo_amostra,
  numero_amostra, descricao_visual, humidade_natural, densidade_natural, densidade_seca,
  indice_vazios, porosidade, granulometria_peneiracao, granulometria_sedimentacao,
  limites_consistencia, proctor_normal, proctor_modificado, cbr, resistencia_cisalhamento,
  caracteristicas_quimicas, ensaios_especificos, classificacao, conforme, observacoes,
  recomendacoes, normas_referencia
) VALUES
(
  'SOLO-2024-001', 'Autoestrada A1 - Troço Lisboa-Porto', 'KM 15+200, Lisboa',
  '2024-01-15', '2024-01-16', '2024-01-25',
  'Laboratório de Geotecnia do LNEC', 'Dr. João Silva', 'Eng. António Ferreira',
  2.5, 'Disturbada', 'AM-001', 'Solo argiloso, cor castanha, compacto',
  18.5, 1.85, 1.56, 0.73, 42.1,
  '{"p80": 95.2, "p63": 92.1, "p50": 88.5, "p40": 85.2, "p25": 78.9, "p20": 75.4, "p10": 65.2, "p5": 58.7, "p2": 45.3, "p04": 35.8, "p008": 25.4}',
  '{"silte": 35.2, "argila": 25.4, "coeficiente_uniformidade": 8.5, "coeficiente_curvatura": 1.2}',
  '{"limite_liquidez": 45.2, "limite_plasticidade": 22.8, "indice_plasticidade": 22.4, "indice_liquidez": 0.85}',
  '{"humidade_otima": 18.5, "densidade_maxima": 1.85, "grau_compactacao": 95.2}',
  '{"humidade_otima": 16.8, "densidade_maxima": 1.92, "grau_compactacao": 98.1}',
  '{"valor_cbr": 85.2, "expansao": 0.8, "penetracao": 2.5}',
  '{"coesao": 45.2, "angulo_atrito": 28.5, "tipo_ensaio": "Triaxial"}',
  '{"ph": 7.2, "materia_organica": 2.1, "sulfatos": 850, "gessos": 0.8, "carbonatos": 12.5, "cloretos": 120, "capacidade_troca_cationica": 15.2, "sais_soluveis": 0.15, "sulfatos_soluveis_so3": 0.12}',
  '{"hinchamiento_livre": 2.5, "colapso": 0.8, "permeabilidade": 1.2e-7, "compressibilidade": 0.15, "consolidacao": {"indice_compressao": 0.25, "indice_recompressao": 0.08, "pressao_preconsolidacao": 150.5}}',
  '{"sistema_unificado": "CL", "sistema_aashto": "A-6", "grupo_portugues": "Argila de baixa plasticidade", "adequacao": "ADEQUADO"}',
  true, 'Solo adequado para aterros', 'Recomenda-se compactação adequada',
  ARRAY['NP EN ISO 17892-1', 'NP EN ISO 17892-4', 'NP EN ISO 17892-6']
),
(
  'SOLO-2024-002', 'Metro do Porto - Linha Amarela', 'Estação Casa da Música, Porto',
  '2024-01-20', '2024-01-21', '2024-01-30',
  'Laboratório de Solos da FEUP', 'Prof. Maria Santos', 'Eng. Carlos Mendes',
  3.0, 'Indeformada', 'AM-002', 'Solo arenoso, cor amarelada, frouxo',
  12.8, 1.72, 1.52, 0.78, 43.8,
  '{"p80": 98.5, "p63": 96.2, "p50": 92.8, "p40": 89.5, "p25": 82.1, "p20": 78.6, "p10": 68.4, "p5": 61.9, "p2": 48.5, "p04": 38.2, "p008": 28.1}',
  '{"silte": 28.5, "argila": 18.2, "coeficiente_uniformidade": 6.8, "coeficiente_curvatura": 1.1}',
  '{"limite_liquidez": 32.5, "limite_plasticidade": 18.2, "indice_plasticidade": 14.3, "indice_liquidez": 0.72}',
  '{"humidade_otima": 15.2, "densidade_maxima": 1.78, "grau_compactacao": 92.8}',
  '{"humidade_otima": 13.5, "densidade_maxima": 1.85, "grau_compactacao": 95.6}',
  '{"valor_cbr": 92.5, "expansao": 0.5, "penetracao": 2.1}',
  '{"coesao": 28.5, "angulo_atrito": 32.8, "tipo_ensaio": "Direto"}',
  '{"ph": 6.8, "materia_organica": 1.8, "sulfatos": 650, "gessos": 0.5, "carbonatos": 8.2, "cloretos": 95, "capacidade_troca_cationica": 12.8, "sais_soluveis": 0.12, "sulfatos_soluveis_so3": 0.08}',
  '{"hinchamiento_livre": 1.8, "colapso": 0.5, "permeabilidade": 2.5e-6, "compressibilidade": 0.12, "consolidacao": {"indice_compressao": 0.18, "indice_recompressao": 0.06, "pressao_preconsolidacao": 125.8}}',
  '{"sistema_unificado": "SM", "sistema_aashto": "A-4", "grupo_portugues": "Areia siltosa", "adequacao": "EXCELENTE"}',
  true, 'Solo excelente para fundações', 'Adequado para fundações diretas',
  ARRAY['NP EN ISO 17892-1', 'NP EN ISO 17892-4', 'NP EN ISO 17892-6']
),
(
  'SOLO-2024-003', 'Ponte Vasco da Gama - Acesso Norte', 'Margem Norte, Lisboa',
  '2024-01-25', '2024-01-26', '2024-02-05',
  'Laboratório de Geologia da UC', 'Dr. Carlos Oliveira', 'Eng. Sofia Rodrigues',
  4.5, 'Sondagem', 'AM-003', 'Solo argiloso, cor cinzenta, muito compacto',
  22.1, 1.95, 1.60, 0.68, 40.5,
  '{"p80": 92.8, "p63": 89.5, "p50": 85.2, "p40": 81.8, "p25": 75.4, "p20": 71.2, "p10": 62.5, "p5": 55.8, "p2": 42.1, "p04": 32.5, "p008": 22.8}',
  '{"silte": 42.8, "argila": 32.5, "coeficiente_uniformidade": 9.2, "coeficiente_curvatura": 1.4}',
  '{"limite_liquidez": 52.8, "limite_plasticidade": 28.5, "indice_plasticidade": 24.3, "indice_liquidez": 0.92}',
  '{"humidade_otima": 20.2, "densidade_maxima": 1.82, "grau_compactacao": 94.5}',
  '{"humidade_otima": 18.5, "densidade_maxima": 1.88, "grau_compactacao": 96.8}',
  '{"valor_cbr": 78.5, "expansao": 1.2, "penetracao": 2.8}',
  '{"coesao": 58.2, "angulo_atrito": 25.8, "tipo_ensaio": "Triaxial"}',
  '{"ph": 7.5, "materia_organica": 3.2, "sulfatos": 1200, "gessos": 1.2, "carbonatos": 15.8, "cloretos": 180, "capacidade_troca_cationica": 18.5, "sais_soluveis": 0.22, "sulfatos_soluveis_so3": 0.18}',
  '{"hinchamiento_livre": 3.8, "colapso": 1.2, "permeabilidade": 8.5e-8, "compressibilidade": 0.22, "consolidacao": {"indice_compressao": 0.32, "indice_recompressao": 0.12, "pressao_preconsolidacao": 185.2}}',
  '{"sistema_unificado": "CH", "sistema_aashto": "A-7-6", "grupo_portugues": "Argila de alta plasticidade", "adequacao": "MARGINAL"}',
  false, 'Solo com problemas de expansão', 'Recomenda-se tratamento especial',
  ARRAY['NP EN ISO 17892-1', 'NP EN ISO 17892-6', 'NP EN ISO 17892-8']
),
(
  'SOLO-2024-004', 'Aeroporto Francisco Sá Carneiro - Pista 2', 'Maia, Porto',
  '2024-02-01', '2024-02-02', '2024-02-12',
  'Laboratório de Engenharia Civil do IST', 'Prof. Ana Costa', 'Eng. Ricardo Alves',
  1.8, 'Disturbada', 'AM-004', 'Solo arenoso, cor castanha clara, compacto',
  14.2, 1.78, 1.56, 0.71, 41.5,
  '{"p80": 97.2, "p63": 94.8, "p50": 91.5, "p40": 88.2, "p25": 81.8, "p20": 78.5, "p10": 68.9, "p5": 62.4, "p2": 49.2, "p04": 38.8, "p008": 28.5}',
  '{"silte": 32.1, "argila": 22.8, "coeficiente_uniformidade": 7.5, "coeficiente_curvatura": 1.3}',
  '{"limite_liquidez": 38.5, "limite_plasticidade": 20.8, "indice_plasticidade": 17.7, "indice_liquidez": 0.78}',
  '{"humidade_otima": 16.8, "densidade_maxima": 1.82, "grau_compactacao": 94.2}',
  '{"humidade_otima": 15.2, "densidade_maxima": 1.88, "grau_compactacao": 96.5}',
  '{"valor_cbr": 88.5, "expansao": 0.6, "penetracao": 2.2}',
  '{"coesao": 35.8, "angulo_atrito": 30.2, "tipo_ensaio": "Direto"}',
  '{"ph": 7.0, "materia_organica": 2.5, "sulfatos": 750, "gessos": 0.6, "carbonatos": 10.2, "cloretos": 110, "capacidade_troca_cationica": 14.5, "sais_soluveis": 0.14, "sulfatos_soluveis_so3": 0.10}',
  '{"hinchamiento_livre": 2.2, "colapso": 0.7, "permeabilidade": 1.8e-6, "compressibilidade": 0.14, "consolidacao": {"indice_compressao": 0.20, "indice_recompressao": 0.07, "pressao_preconsolidacao": 135.8}}',
  '{"sistema_unificado": "SC", "sistema_aashto": "A-5", "grupo_portugues": "Areia argilosa", "adequacao": "ADEQUADO"}',
  true, 'Solo adequado para pavimentos', 'Recomenda-se controlo de compactação',
  ARRAY['NP EN ISO 17892-1', 'NP EN ISO 17892-4', 'NP EN ISO 17892-7']
),
(
  'SOLO-2024-005', 'Barragem do Alqueva - Fundação', 'Alqueva, Évora',
  '2024-02-05', '2024-02-06', '2024-02-16',
  'Laboratório de Materiais da UMinho', 'Dr. Pedro Martins', 'Eng. Luísa Costa',
  6.0, 'Indeformada', 'AM-005', 'Solo argiloso, cor castanha escura, muito compacto',
  25.8, 2.05, 1.63, 0.65, 39.4,
  '{"p80": 90.5, "p63": 87.2, "p50": 82.8, "p40": 78.5, "p25": 72.1, "p20": 68.8, "p10": 58.2, "p5": 51.5, "p2": 38.8, "p04": 28.5, "p008": 18.2}',
  '{"silte": 48.5, "argila": 38.8, "coeficiente_uniformidade": 10.2, "coeficiente_curvatura": 1.6}',
  '{"limite_liquidez": 58.5, "limite_plasticidade": 32.8, "indice_plasticidade": 25.7, "indice_liquidez": 0.98}',
  '{"humidade_otima": 22.5, "densidade_maxima": 1.78, "grau_compactacao": 93.8}',
  '{"humidade_otima": 20.8, "densidade_maxima": 1.85, "grau_compactacao": 96.2}',
  '{"valor_cbr": 72.5, "expansao": 1.8, "penetracao": 3.2}',
  '{"coesao": 68.5, "angulo_atrito": 22.8, "tipo_ensaio": "Triaxial"}',
  '{"ph": 7.8, "materia_organica": 4.2, "sulfatos": 1500, "gessos": 1.8, "carbonatos": 18.5, "cloretos": 220, "capacidade_troca_cationica": 22.8, "sais_soluveis": 0.28, "sulfatos_soluveis_so3": 0.25}',
  '{"hinchamiento_livre": 4.5, "colapso": 1.8, "permeabilidade": 5.2e-8, "compressibilidade": 0.28, "consolidacao": {"indice_compressao": 0.38, "indice_recompressao": 0.15, "pressao_preconsolidacao": 225.8}}',
  '{"sistema_unificado": "CH", "sistema_aashto": "A-7-6", "grupo_portugues": "Argila de alta plasticidade", "adequacao": "TOLERABLE"}',
  false, 'Solo com problemas de expansão e compressibilidade', 'Requer tratamento especial',
  ARRAY['NP EN ISO 17892-1', 'NP EN ISO 17892-6', 'NP EN ISO 17892-8', 'NP EN ISO 17892-9']
);

-- =====================================================
-- 3. CRIAÇÃO DE VIEWS
-- =====================================================

-- View para estatísticas gerais
CREATE OR REPLACE VIEW v_solos_stats AS
SELECT 
  COUNT(*) as total_caracterizacoes,
  COUNT(*) FILTER (WHERE conforme = true) as conformes,
  COUNT(*) FILTER (WHERE conforme = false) as nao_conformes,
  COUNT(*) FILTER (WHERE classificacao->>'adequacao' IN ('ADEQUADO', 'EXCELENTE')) as adequados,
  COUNT(*) FILTER (WHERE classificacao->>'adequacao' NOT IN ('ADEQUADO', 'EXCELENTE')) as inadequados,
  AVG(profundidade_colheita) as profundidade_media,
  AVG((cbr->>'valor_cbr')::DECIMAL) as cbr_medio,
  AVG((humidade_natural)::DECIMAL) as humidade_media,
  AVG((densidade_natural)::DECIMAL) as densidade_media
FROM caracterizacoes_solos;

-- View para distribuição por laboratório
CREATE OR REPLACE VIEW v_distribuicao_laboratorios AS
SELECT 
  laboratorio,
  COUNT(*) as total,
  COUNT(*) FILTER (WHERE conforme = true) as conformes,
  COUNT(*) FILTER (WHERE conforme = false) as nao_conformes,
  COUNT(*) FILTER (WHERE classificacao->>'adequacao' IN ('ADEQUADO', 'EXCELENTE')) as adequados,
  ROUND(AVG((cbr->>'valor_cbr')::DECIMAL), 2) as cbr_medio
FROM caracterizacoes_solos
GROUP BY laboratorio
ORDER BY total DESC;

-- View para distribuição por adequação
CREATE OR REPLACE VIEW v_distribuicao_adequacao AS
SELECT 
  classificacao->>'adequacao' as adequacao,
  COUNT(*) as quantidade,
  ROUND((COUNT(*) * 100.0 / (SELECT COUNT(*) FROM caracterizacoes_solos)), 2) as percentagem
FROM caracterizacoes_solos
GROUP BY classificacao->>'adequacao'
ORDER BY quantidade DESC;

-- View para evolução temporal
CREATE OR REPLACE VIEW v_evolucao_temporal AS
SELECT 
  DATE_TRUNC('month', data_colheita) as mes,
  COUNT(*) as total,
  COUNT(*) FILTER (WHERE conforme = true) as conformes,
  COUNT(*) FILTER (WHERE conforme = false) as nao_conformes,
  AVG((cbr->>'valor_cbr')::DECIMAL) as cbr_medio
FROM caracterizacoes_solos
GROUP BY DATE_TRUNC('month', data_colheita)
ORDER BY mes;

-- =====================================================
-- 4. CRIAÇÃO DE FUNÇÕES
-- =====================================================

-- Função para obter estatísticas completas
CREATE OR REPLACE FUNCTION get_solos_stats()
RETURNS JSONB AS $$
DECLARE
  result JSONB;
BEGIN
  SELECT jsonb_build_object(
    'total_caracterizacoes', stats.total_caracterizacoes,
    'conformes', stats.conformes,
    'nao_conformes', stats.nao_conformes,
    'adequados', stats.adequados,
    'inadequados', stats.inadequados,
    'profundidade_media', ROUND(stats.profundidade_media::DECIMAL, 2),
    'cbr_medio', ROUND(stats.cbr_medio::DECIMAL, 2),
    'humidade_media', ROUND(stats.humidade_media::DECIMAL, 2),
    'densidade_media', ROUND(stats.densidade_media::DECIMAL, 3),
    'taxa_conformidade', ROUND((stats.conformes * 100.0 / stats.total_caracterizacoes)::DECIMAL, 2),
    'taxa_adequacao', ROUND((stats.adequados * 100.0 / stats.total_caracterizacoes)::DECIMAL, 2),
    'laboratorios_distribuicao', (
      SELECT jsonb_object_agg(laboratorio, total)
      FROM v_distribuicao_laboratorios
    ),
    'adequacao_distribuicao', (
      SELECT jsonb_object_agg(adequacao, quantidade)
      FROM v_distribuicao_adequacao
    )
  ) INTO result
  FROM v_solos_stats stats;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Função para atualizar timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Função para validar conformidade
CREATE OR REPLACE FUNCTION validate_solo_conformity()
RETURNS TRIGGER AS $$
BEGIN
  -- Validar CBR
  IF (NEW.cbr->>'valor_cbr')::DECIMAL < 50 THEN
    NEW.conforme = false;
  END IF;
  
  -- Validar pH
  IF (NEW.caracteristicas_quimicas->>'ph')::DECIMAL < 6.0 OR (NEW.caracteristicas_quimicas->>'ph')::DECIMAL > 8.5 THEN
    NEW.conforme = false;
  END IF;
  
  -- Validar sulfatos
  IF (NEW.caracteristicas_quimicas->>'sulfatos')::DECIMAL > 2000 THEN
    NEW.conforme = false;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- 5. CRIAÇÃO DE TRIGGERS
-- =====================================================

-- Trigger para atualizar updated_at
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_caracterizacoes_solos_updated_at') THEN
    CREATE TRIGGER update_caracterizacoes_solos_updated_at
      BEFORE UPDATE ON caracterizacoes_solos
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_laboratorios_solos_updated_at') THEN
    CREATE TRIGGER update_laboratorios_solos_updated_at
      BEFORE UPDATE ON laboratorios_solos
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_normas_solos_updated_at') THEN
    CREATE TRIGGER update_normas_solos_updated_at
      BEFORE UPDATE ON normas_solos
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;

-- Trigger para validar conformidade
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'validate_solo_conformity_trigger') THEN
    CREATE TRIGGER validate_solo_conformity_trigger
      BEFORE INSERT OR UPDATE ON caracterizacoes_solos
      FOR EACH ROW
      EXECUTE FUNCTION validate_solo_conformity();
  END IF;
END $$;

-- =====================================================
-- 6. CRIAÇÃO DE ÍNDICES
-- =====================================================

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_caracterizacoes_solos_codigo ON caracterizacoes_solos(codigo);
CREATE INDEX IF NOT EXISTS idx_caracterizacoes_solos_obra ON caracterizacoes_solos(obra);
CREATE INDEX IF NOT EXISTS idx_caracterizacoes_solos_laboratorio ON caracterizacoes_solos(laboratorio);
CREATE INDEX IF NOT EXISTS idx_caracterizacoes_solos_data_colheita ON caracterizacoes_solos(data_colheita);
CREATE INDEX IF NOT EXISTS idx_caracterizacoes_solos_conforme ON caracterizacoes_solos(conforme);
CREATE INDEX IF NOT EXISTS idx_caracterizacoes_solos_user_id ON caracterizacoes_solos(user_id);
CREATE INDEX IF NOT EXISTS idx_caracterizacoes_solos_created_at ON caracterizacoes_solos(created_at);

CREATE INDEX IF NOT EXISTS idx_laboratorios_solos_codigo ON laboratorios_solos(codigo);
CREATE INDEX IF NOT EXISTS idx_laboratorios_solos_user_id ON laboratorios_solos(user_id);

CREATE INDEX IF NOT EXISTS idx_normas_solos_codigo ON normas_solos(codigo);
CREATE INDEX IF NOT EXISTS idx_normas_solos_categoria ON normas_solos(categoria);
CREATE INDEX IF NOT EXISTS idx_normas_solos_user_id ON normas_solos(user_id);

-- =====================================================
-- 7. CONFIGURAÇÃO DE ROW LEVEL SECURITY (RLS)
-- =====================================================

-- Ativar RLS nas tabelas
ALTER TABLE caracterizacoes_solos ENABLE ROW LEVEL SECURITY;
ALTER TABLE laboratorios_solos ENABLE ROW LEVEL SECURITY;
ALTER TABLE normas_solos ENABLE ROW LEVEL SECURITY;

-- Políticas para caracterizacoes_solos
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'caracterizacoes_solos' AND policyname = 'Users can view own caracterizacoes_solos') THEN
    CREATE POLICY "Users can view own caracterizacoes_solos" ON caracterizacoes_solos
      FOR SELECT USING (auth.uid() = user_id);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'caracterizacoes_solos' AND policyname = 'Users can insert own caracterizacoes_solos') THEN
    CREATE POLICY "Users can insert own caracterizacoes_solos" ON caracterizacoes_solos
      FOR INSERT WITH CHECK (auth.uid() = user_id);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'caracterizacoes_solos' AND policyname = 'Users can update own caracterizacoes_solos') THEN
    CREATE POLICY "Users can update own caracterizacoes_solos" ON caracterizacoes_solos
      FOR UPDATE USING (auth.uid() = user_id);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'caracterizacoes_solos' AND policyname = 'Users can delete own caracterizacoes_solos') THEN
    CREATE POLICY "Users can delete own caracterizacoes_solos" ON caracterizacoes_solos
      FOR DELETE USING (auth.uid() = user_id);
  END IF;
END $$;

-- Políticas para laboratorios_solos
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'laboratorios_solos' AND policyname = 'Users can view own laboratorios_solos') THEN
    CREATE POLICY "Users can view own laboratorios_solos" ON laboratorios_solos
      FOR SELECT USING (auth.uid() = user_id);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'laboratorios_solos' AND policyname = 'Users can insert own laboratorios_solos') THEN
    CREATE POLICY "Users can insert own laboratorios_solos" ON laboratorios_solos
      FOR INSERT WITH CHECK (auth.uid() = user_id);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'laboratorios_solos' AND policyname = 'Users can update own laboratorios_solos') THEN
    CREATE POLICY "Users can update own laboratorios_solos" ON laboratorios_solos
      FOR UPDATE USING (auth.uid() = user_id);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'laboratorios_solos' AND policyname = 'Users can delete own laboratorios_solos') THEN
    CREATE POLICY "Users can delete own laboratorios_solos" ON laboratorios_solos
      FOR DELETE USING (auth.uid() = user_id);
  END IF;
END $$;

-- Políticas para normas_solos
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'normas_solos' AND policyname = 'Users can view own normas_solos') THEN
    CREATE POLICY "Users can view own normas_solos" ON normas_solos
      FOR SELECT USING (auth.uid() = user_id);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'normas_solos' AND policyname = 'Users can insert own normas_solos') THEN
    CREATE POLICY "Users can insert own normas_solos" ON normas_solos
      FOR INSERT WITH CHECK (auth.uid() = user_id);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'normas_solos' AND policyname = 'Users can update own normas_solos') THEN
    CREATE POLICY "Users can update own normas_solos" ON normas_solos
      FOR UPDATE USING (auth.uid() = user_id);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'normas_solos' AND policyname = 'Users can delete own normas_solos') THEN
    CREATE POLICY "Users can delete own normas_solos" ON normas_solos
      FOR DELETE USING (auth.uid() = user_id);
  END IF;
END $$;

-- =====================================================
-- 8. COMENTÁRIOS E DOCUMENTAÇÃO
-- =====================================================

COMMENT ON TABLE caracterizacoes_solos IS 'Tabela principal para armazenar caracterizações de solos';
COMMENT ON TABLE laboratorios_solos IS 'Tabela para armazenar informações dos laboratórios';
COMMENT ON TABLE normas_solos IS 'Tabela para armazenar normas de referência para ensaios de solos';

COMMENT ON COLUMN caracterizacoes_solos.codigo IS 'Código único da caracterização';
COMMENT ON COLUMN caracterizacoes_solos.obra IS 'Nome da obra onde foi realizada a caracterização';
COMMENT ON COLUMN caracterizacoes_solos.laboratorio IS 'Nome do laboratório responsável';
COMMENT ON COLUMN caracterizacoes_solos.conforme IS 'Indica se a caracterização está conforme as especificações';
COMMENT ON COLUMN caracterizacoes_solos.classificacao IS 'Classificação do solo em formato JSONB';

COMMENT ON FUNCTION get_solos_stats() IS 'Função para obter estatísticas completas das caracterizações de solos';
COMMENT ON FUNCTION validate_solo_conformity() IS 'Função para validar automaticamente a conformidade das caracterizações';

-- =====================================================
-- FIM DO SCRIPT
-- =====================================================
