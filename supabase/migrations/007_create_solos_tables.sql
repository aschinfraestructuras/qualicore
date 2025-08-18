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
    laboratorio VARCHAR(100) NOT NULL,
    tipo_amostra VARCHAR(50) NOT NULL CHECK (tipo_amostra IN (
        'Disturbada', 'Não Disturbada', 'Semi-Disturbada', 'Outro'
    )),
    localizacao VARCHAR(255) NOT NULL,
    profundidade_colheita DECIMAL(5,2) CHECK (profundidade_colheita >= 0),
    data_colheita DATE NOT NULL,
    data_ensaio DATE NOT NULL,
    responsavel_colheita VARCHAR(100),
    responsavel_ensaio VARCHAR(100),
    
    -- Características Físicas
    humidade_natural DECIMAL(5,2) CHECK (humidade_natural >= 0),
    densidade_aparente DECIMAL(4,2) CHECK (densidade_aparente >= 0),
    densidade_real DECIMAL(4,2) CHECK (densidade_real >= 0),
    indice_vazios DECIMAL(4,2) CHECK (indice_vazios >= 0),
    porosidade DECIMAL(5,2) CHECK (porosidade >= 0),
    
    -- Granulometria (JSONB para flexibilidade)
    granulometria_peneiracao JSONB,
    granulometria_sedimentacao JSONB,
    
    -- Limites de Consistência
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
    
    -- Classificação e Adequação
    classificacao JSONB,
    
    -- Conformidade e Observações
    conforme BOOLEAN DEFAULT true,
    observacoes TEXT,
    recomendacoes TEXT,
    
    -- Documentação
    relatorio_laboratorio TEXT,
    certificado_ensaio TEXT,
    fotos_amostra TEXT[],
    normas_referencia TEXT[],
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- ÍNDICES PARA OTIMIZAÇÃO
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_caracterizacoes_solos_obra ON caracterizacoes_solos(obra);
CREATE INDEX IF NOT EXISTS idx_caracterizacoes_solos_laboratorio ON caracterizacoes_solos(laboratorio);
CREATE INDEX IF NOT EXISTS idx_caracterizacoes_solos_data_ensaio ON caracterizacoes_solos(data_ensaio);
CREATE INDEX IF NOT EXISTS idx_caracterizacoes_solos_conforme ON caracterizacoes_solos(conforme);
CREATE INDEX IF NOT EXISTS idx_caracterizacoes_solos_tipo_amostra ON caracterizacoes_solos(tipo_amostra);

-- =====================================================
-- FUNÇÃO PARA ATUALIZAR TIMESTAMP
-- =====================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- =====================================================
-- TRIGGERS PARA TIMESTAMP
-- =====================================================
CREATE TRIGGER update_caracterizacoes_solos_updated_at 
    BEFORE UPDATE ON caracterizacoes_solos 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- FUNÇÃO PARA ESTATÍSTICAS DE SOLOS
-- =====================================================
CREATE OR REPLACE FUNCTION get_solos_stats()
RETURNS JSON AS $$
DECLARE
    result JSON;
BEGIN
    SELECT json_build_object(
        'total_solos', COUNT(*),
        'conformes', COUNT(*) FILTER (WHERE conforme = true),
        'nao_conformes', COUNT(*) FILTER (WHERE conforme = false),
        'adequados', COUNT(*) FILTER (WHERE (classificacao->>'adequacao') IN ('ADEQUADO', 'EXCELENTE')),
        'inadequados', COUNT(*) FILTER (WHERE (classificacao->>'adequacao') = 'INADECUADO'),
        'marginais', COUNT(*) FILTER (WHERE (classificacao->>'adequacao') IN ('MARGINAL', 'TOLERABLE')),
        'tipos_amostra_distribuicao', (
            SELECT json_object_agg(tipo, count)
            FROM (
                SELECT tipo_amostra as tipo, COUNT(*) as count
                FROM caracterizacoes_solos
                GROUP BY tipo_amostra
                ORDER BY count DESC
                LIMIT 5
            ) t
        ),
        'obras_distribuicao', (
            SELECT json_object_agg(obra, count)
            FROM (
                SELECT obra, COUNT(*) as count
                FROM caracterizacoes_solos
                GROUP BY obra
                ORDER BY count DESC
                LIMIT 5
            ) t
        ),
        'laboratorios_distribuicao', (
            SELECT json_object_agg(laboratorio, count)
            FROM (
                SELECT laboratorio, COUNT(*) as count
                FROM caracterizacoes_solos
                GROUP BY laboratorio
                ORDER BY count DESC
                LIMIT 5
            ) t
        ),
        'profundidade_media', AVG(profundidade_colheita),
        'cbr_medio', AVG((cbr->>'valor_cbr')::DECIMAL),
        'resistencia_cisalhamento_media', AVG((resistencia_cisalhamento->>'coesao')::DECIMAL)
    ) INTO result
    FROM caracterizacoes_solos;
    
    RETURN result;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================
ALTER TABLE caracterizacoes_solos ENABLE ROW LEVEL SECURITY;

-- Políticas para usuários autenticados
CREATE POLICY "Usuários autenticados podem ver caracterizações de solos" ON caracterizacoes_solos
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Usuários autenticados podem inserir caracterizações de solos" ON caracterizacoes_solos
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Usuários autenticados podem atualizar caracterizações de solos" ON caracterizacoes_solos
    FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Usuários autenticados podem deletar caracterizações de solos" ON caracterizacoes_solos
    FOR DELETE USING (auth.role() = 'authenticated');

-- =====================================================
-- DADOS DE EXEMPLO REALISTAS
-- =====================================================
INSERT INTO caracterizacoes_solos (
    codigo, obra, laboratorio, tipo_amostra, localizacao, profundidade_colheita,
    data_colheita, data_ensaio, responsavel_colheita, responsavel_ensaio,
    humidade_natural, densidade_aparente, densidade_real, indice_vazios, porosidade,
    granulometria_peneiracao, granulometria_sedimentacao, limites_consistencia,
    proctor_normal, proctor_modificado, cbr, resistencia_cisalhamento,
    caracteristicas_quimicas, ensaios_especificos, classificacao,
    conforme, observacoes, recomendacoes, relatorio_laboratorio,
    certificado_ensaio, fotos_amostra, normas_referencia
) VALUES
-- Amostra 1: Solo Arenoso
(
    'SOL-2024-001', 'Linha Ferroviária Lisboa-Porto', 'Laboratório Nacional de Engenharia Civil',
    'Não Disturbada', 'KM 45+200 - Talude Norte', 2.50,
    '2024-01-15', '2024-01-20', 'Eng. João Silva', 'Dr. Maria Santos',
    12.5, 1.85, 2.65, 0.43, 30.2,
    '{"peneiras": {"2mm": 95.2, "0.425mm": 78.5, "0.075mm": 12.3}, "curva_granulometrica": "Arenosa"}',
    '{"sedimentacao": {"d10": 0.08, "d30": 0.15, "d60": 0.35, "cu": 4.4, "cc": 0.8}}',
    '{"limite_liquidez": 28.5, "limite_plasticidade": 18.2, "indice_plasticidade": 10.3}',
    '{"humidade_otima": 14.2, "densidade_maxima": 1.95}',
    '{"humidade_otima": 12.8, "densidade_maxima": 2.05}',
    '{"valor_cbr": 15.2, "penetracao": 2.54, "carga": 2050}',
    '{"coesao": 12.5, "angulo_atrito": 32.5, "resistencia_nao_drenada": 45.2}',
    '{"ph": 7.2, "materia_organica": 1.2, "sulfatos": 0.15, "gessos": 0.08}',
    '{"hinchamiento_livre": 2.1, "colapso": 0.5}',
    '{"sistema_unificado": "SM", "aashto": "A-2-4", "adequacao": "ADEQUADO"}',
    true, 'Solo arenoso com boa capacidade de suporte', 'Adequado para aterros e sub-base',
    'relatorio_solo_001.pdf', 'certificado_solo_001.pdf', 
    ARRAY['foto_amostra_001_1.jpg', 'foto_amostra_001_2.jpg'],
    ARRAY['NP 83:1965', 'EN ISO 14688-1:2018']
),

-- Amostra 2: Solo Argiloso
(
    'SOL-2024-002', 'Ponte sobre Rio Douro', 'Laboratório de Geotecnia da FEUP',
    'Disturbada', 'Pilar P3 - Fundação', 5.00,
    '2024-01-20', '2024-01-25', 'Eng. Pedro Costa', 'Dr. Ana Oliveira',
    25.8, 1.65, 2.70, 0.64, 39.0,
    '{"peneiras": {"2mm": 98.5, "0.425mm": 85.2, "0.075mm": 65.8}, "curva_granulometrica": "Argilosa"}',
    '{"sedimentacao": {"d10": 0.002, "d30": 0.008, "d60": 0.025, "cu": 12.5, "cc": 1.2}}',
    '{"limite_liquidez": 45.2, "limite_plasticidade": 22.8, "indice_plasticidade": 22.4}',
    '{"humidade_otima": 18.5, "densidade_maxima": 1.78}',
    '{"humidade_otima": 16.2, "densidade_maxima": 1.88}',
    '{"valor_cbr": 8.5, "penetracao": 2.54, "carga": 1150}',
    '{"coesao": 35.2, "angulo_atrito": 18.5, "resistencia_nao_drenada": 85.6}',
    '{"ph": 6.8, "materia_organica": 2.8, "sulfatos": 0.25, "gessos": 0.12}',
    '{"hinchamiento_livre": 8.5, "colapso": 2.1}',
    '{"sistema_unificado": "CL", "aashto": "A-6", "adequacao": "MARGINAL"}',
    false, 'Solo argiloso com elevada plasticidade', 'Requer tratamento especial para fundações',
    'relatorio_solo_002.pdf', 'certificado_solo_002.pdf',
    ARRAY['foto_amostra_002_1.jpg', 'foto_amostra_002_2.jpg'],
    ARRAY['NP 83:1965', 'EN ISO 14688-2:2018']
),

-- Amostra 3: Solo Silto-Argiloso
(
    'SOL-2024-003', 'Túnel de Coimbra', 'Laboratório de Geotecnia do IST',
    'Semi-Disturbada', 'Entrada Norte - Galeria Principal', 3.20,
    '2024-02-01', '2024-02-05', 'Eng. Carlos Mendes', 'Dr. Sofia Ferreira',
    18.5, 1.72, 2.68, 0.56, 35.8,
    '{"peneiras": {"2mm": 97.8, "0.425mm": 82.1, "0.075mm": 45.2}, "curva_granulometrica": "Silto-Argilosa"}',
    '{"sedimentacao": {"d10": 0.005, "d30": 0.015, "d60": 0.045, "cu": 9.0, "cc": 1.0}}',
    '{"limite_liquidez": 38.5, "limite_plasticidade": 20.2, "indice_plasticidade": 18.3}',
    '{"humidade_otima": 16.8, "densidade_maxima": 1.82}',
    '{"humidade_otima": 14.5, "densidade_maxima": 1.92}',
    '{"valor_cbr": 12.8, "penetracao": 2.54, "carga": 1720}',
    '{"coesao": 22.5, "angulo_atrito": 25.8, "resistencia_nao_drenada": 65.4}',
    '{"ph": 7.0, "materia_organica": 1.8, "sulfatos": 0.18, "gessos": 0.09}',
    '{"hinchamiento_livre": 4.2, "colapso": 1.2}',
    '{"sistema_unificado": "ML", "aashto": "A-4", "adequacao": "ADEQUADO"}',
    true, 'Solo silto-argiloso com características adequadas', 'Adequado para aterros com compactação adequada',
    'relatorio_solo_003.pdf', 'certificado_solo_003.pdf',
    ARRAY['foto_amostra_003_1.jpg', 'foto_amostra_003_2.jpg'],
    ARRAY['NP 83:1965', 'EN ISO 14688-1:2018']
),

-- Amostra 4: Solo Pedregulhoso
(
    'SOL-2024-004', 'Aeroporto de Faro - Pista', 'Laboratório de Geotecnia da UAlg',
    'Não Disturbada', 'Pista Principal - Zona Central', 1.80,
    '2024-02-10', '2024-02-15', 'Eng. Luís Santos', 'Dr. Ricardo Almeida',
    8.2, 2.15, 2.75, 0.28, 21.8,
    '{"peneiras": {"63mm": 95.5, "20mm": 78.2, "2mm": 45.8, "0.425mm": 25.2}, "curva_granulometrica": "Pedregulhosa"}',
    '{"sedimentacao": {"d10": 0.15, "d30": 0.35, "d60": 0.85, "cu": 5.7, "cc": 0.9}}',
    '{"limite_liquidez": 22.5, "limite_plasticidade": 15.8, "indice_plasticidade": 6.7}',
    '{"humidade_otima": 11.5, "densidade_maxima": 2.25}',
    '{"humidade_otima": 10.2, "densidade_maxima": 2.35}',
    '{"valor_cbr": 25.8, "penetracao": 2.54, "carga": 3450}',
    '{"coesao": 8.5, "angulo_atrito": 38.2, "resistencia_nao_drenada": 25.6}',
    '{"ph": 7.5, "materia_organica": 0.8, "sulfatos": 0.12, "gessos": 0.05}',
    '{"hinchamiento_livre": 1.2, "colapso": 0.3}',
    '{"sistema_unificado": "GW", "aashto": "A-1-a", "adequacao": "EXCELENTE"}',
    true, 'Solo pedregulhoso com excelente capacidade de suporte', 'Ideal para fundações e pavimentos',
    'relatorio_solo_004.pdf', 'certificado_solo_004.pdf',
    ARRAY['foto_amostra_004_1.jpg', 'foto_amostra_004_2.jpg'],
    ARRAY['NP 83:1965', 'EN ISO 14688-1:2018']
),

-- Amostra 5: Solo Orgânico
(
    'SOL-2024-005', 'Parque Urbano de Braga', 'Laboratório de Geotecnia da UM',
    'Disturbada', 'Zona de Lagos - Fundação', 0.80,
    '2024-02-20', '2024-02-25', 'Eng. Marta Pereira', 'Dr. João Costa',
    45.2, 1.25, 2.45, 0.96, 49.0,
    '{"peneiras": {"2mm": 92.5, "0.425mm": 75.8, "0.075mm": 55.2}, "curva_granulometrica": "Orgânica"}',
    '{"sedimentacao": {"d10": 0.008, "d30": 0.025, "d60": 0.085, "cu": 10.6, "cc": 0.9}}',
    '{"limite_liquidez": 65.8, "limite_plasticidade": 35.2, "indice_plasticidade": 30.6}',
    '{"humidade_otima": 25.5, "densidade_maxima": 1.45}',
    '{"humidade_otima": 22.8, "densidade_maxima": 1.55}',
    '{"valor_cbr": 3.2, "penetracao": 2.54, "carga": 450}',
    '{"coesao": 15.8, "angulo_atrito": 12.5, "resistencia_nao_drenada": 25.4}',
    '{"ph": 6.2, "materia_organica": 8.5, "sulfatos": 0.35, "gessos": 0.18}',
    '{"hinchamiento_livre": 15.2, "colapso": 5.8}',
    '{"sistema_unificado": "OH", "aashto": "A-7-6", "adequacao": "INADECUADO"}',
    false, 'Solo orgânico com elevado teor de matéria orgânica', 'Requer remoção ou tratamento especial',
    'relatorio_solo_005.pdf', 'certificado_solo_005.pdf',
    ARRAY['foto_amostra_005_1.jpg', 'foto_amostra_005_2.jpg'],
    ARRAY['NP 83:1965', 'EN ISO 14688-2:2018']
);

-- =====================================================
-- MENSAGEM DE CONCLUSÃO
-- =====================================================
DO $$
BEGIN
    RAISE NOTICE 'Script de Caracterização de Solos executado com sucesso!';
    RAISE NOTICE 'Tabela caracterizacoes_solos criada com 5 registos de exemplo.';
    RAISE NOTICE 'Função get_solos_stats() criada para estatísticas.';
    RAISE NOTICE 'Políticas RLS configuradas para segurança.';
END $$;
