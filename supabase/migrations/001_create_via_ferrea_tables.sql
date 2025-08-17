-- =====================================================
-- MIGRAÇÃO: Criação das Tabelas Via Férrea
-- Data: 2024-12-19
-- Descrição: Tabelas para gestão de trilhos, travessas e inspeções
-- =====================================================

-- Habilitar extensões necessárias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- TABELA: trilhos
-- =====================================================
CREATE TABLE trilhos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    codigo VARCHAR(50) UNIQUE NOT NULL,
    tipo VARCHAR(20) NOT NULL CHECK (tipo IN ('UIC60', 'UIC54', 'S49', 'S54')),
    material VARCHAR(50) NOT NULL CHECK (material IN ('Aço', 'Aço endurecido', 'Aço especial')),
    comprimento DECIMAL(8,2) NOT NULL CHECK (comprimento > 0),
    peso DECIMAL(8,2) NOT NULL CHECK (peso > 0),
    fabricante VARCHAR(100) NOT NULL,
    data_fabricacao DATE NOT NULL,
    data_instalacao DATE NOT NULL,
    km_inicial DECIMAL(10,3) NOT NULL CHECK (km_inicial >= 0),
    km_final DECIMAL(10,3) NOT NULL CHECK (km_final > km_inicial),
    estado VARCHAR(20) NOT NULL CHECK (estado IN ('Excelente', 'Bom', 'Regular', 'Mau', 'Crítico')),
    tensao INTEGER NOT NULL CHECK (tensao > 0),
    alinhamento DECIMAL(5,2) CHECK (alinhamento >= 0),
    nivel DECIMAL(5,2) CHECK (nivel >= 0),
    bitola INTEGER DEFAULT 1435 CHECK (bitola > 0),
    ultima_inspecao DATE,
    proxima_inspecao DATE,
    observacoes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- TABELA: travessas
-- =====================================================
CREATE TABLE travessas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    codigo VARCHAR(50) UNIQUE NOT NULL,
    tipo VARCHAR(20) NOT NULL CHECK (tipo IN ('Betão', 'Madeira', 'Aço')),
    material VARCHAR(100) NOT NULL,
    comprimento DECIMAL(8,2) NOT NULL CHECK (comprimento > 0),
    largura DECIMAL(8,2) NOT NULL CHECK (largura > 0),
    altura DECIMAL(8,2) NOT NULL CHECK (altura > 0),
    peso DECIMAL(8,2) NOT NULL CHECK (peso > 0),
    fabricante VARCHAR(100) NOT NULL,
    data_fabricacao DATE NOT NULL,
    data_instalacao DATE NOT NULL,
    km_inicial DECIMAL(10,3) NOT NULL CHECK (km_inicial >= 0),
    km_final DECIMAL(10,3) NOT NULL CHECK (km_final > km_inicial),
    estado VARCHAR(20) NOT NULL CHECK (estado IN ('Excelente', 'Bom', 'Regular', 'Mau', 'Crítico')),
    ultima_inspecao DATE,
    proxima_inspecao DATE,
    observacoes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- TABELA: inspecoes
-- =====================================================
CREATE TABLE inspecoes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    trilho_id UUID REFERENCES trilhos(id) ON DELETE CASCADE,
    travessa_id UUID REFERENCES travessas(id) ON DELETE CASCADE,
    data_inspecao DATE NOT NULL,
    tipo VARCHAR(30) NOT NULL CHECK (tipo IN ('Geometria', 'Visual', 'Ultrassom', 'Magnetoscopia', 'Penetrantes')),
    inspector VARCHAR(100) NOT NULL,
    resultado VARCHAR(20) NOT NULL CHECK (resultado IN ('Conforme', 'Não Conforme', 'Crítico')),
    observacoes TEXT,
    acoes_corretivas TEXT,
    proxima_inspecao DATE,
    fotos TEXT[], -- URLs das fotos
    relatorio_url TEXT,
    parametros_medidos JSONB, -- Dados específicos da inspeção
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Constraint para garantir que só um elemento é inspecionado por vez
    CONSTRAINT check_single_element CHECK (
        (trilho_id IS NOT NULL AND travessa_id IS NULL) OR 
        (trilho_id IS NULL AND travessa_id IS NOT NULL)
    )
);

-- =====================================================
-- ÍNDICES PARA PERFORMANCE
-- =====================================================

-- Trilhos
CREATE INDEX idx_trilhos_codigo ON trilhos(codigo);
CREATE INDEX idx_trilhos_estado ON trilhos(estado);
CREATE INDEX idx_trilhos_tipo ON trilhos(tipo);
CREATE INDEX idx_trilhos_fabricante ON trilhos(fabricante);
CREATE INDEX idx_trilhos_proxima_inspecao ON trilhos(proxima_inspecao);
CREATE INDEX idx_trilhos_km_range ON trilhos(km_inicial, km_final);

-- Travessas
CREATE INDEX idx_travessas_codigo ON travessas(codigo);
CREATE INDEX idx_travessas_estado ON travessas(estado);
CREATE INDEX idx_travessas_tipo ON travessas(tipo);
CREATE INDEX idx_travessas_fabricante ON travessas(fabricante);
CREATE INDEX idx_travessas_proxima_inspecao ON travessas(proxima_inspecao);
CREATE INDEX idx_travessas_km_range ON travessas(km_inicial, km_final);

-- Inspeções
CREATE INDEX idx_inspecoes_data ON inspecoes(data_inspecao);
CREATE INDEX idx_inspecoes_resultado ON inspecoes(resultado);
CREATE INDEX idx_inspecoes_tipo ON inspecoes(tipo);
CREATE INDEX idx_inspecoes_inspector ON inspecoes(inspector);
CREATE INDEX idx_inspecoes_trilho_id ON inspecoes(trilho_id);
CREATE INDEX idx_inspecoes_travessa_id ON inspecoes(travessa_id);

-- =====================================================
-- FUNÇÕES PARA ATUALIZAÇÃO AUTOMÁTICA
-- =====================================================

-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para atualizar updated_at
CREATE TRIGGER update_trilhos_updated_at 
    BEFORE UPDATE ON trilhos 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_travessas_updated_at 
    BEFORE UPDATE ON travessas 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- FUNÇÕES PARA ESTATÍSTICAS
-- =====================================================

-- Função para calcular estatísticas gerais
CREATE OR REPLACE FUNCTION get_via_ferrea_stats()
RETURNS JSON AS $$
DECLARE
    stats JSON;
BEGIN
    SELECT json_build_object(
        'total_trilhos', (SELECT COUNT(*) FROM trilhos),
        'total_travessas', (SELECT COUNT(*) FROM travessas),
        'inspecoes_pendentes', (
            SELECT COUNT(*) FROM (
                SELECT proxima_inspecao FROM trilhos WHERE proxima_inspecao <= CURRENT_DATE
                UNION ALL
                SELECT proxima_inspecao FROM travessas WHERE proxima_inspecao <= CURRENT_DATE
            ) AS pendentes
        ),
        'alertas_criticos', (
            SELECT COUNT(*) FROM inspecoes WHERE resultado = 'Crítico'
        ),
        'conformidade', (
            SELECT ROUND(
                (COUNT(*) FILTER (WHERE resultado = 'Conforme') * 100.0 / COUNT(*)), 2
            ) FROM inspecoes
        ),
        'km_cobertos', (
            SELECT COALESCE(SUM(km_final - km_inicial), 0) FROM trilhos
        )
    ) INTO stats;
    
    RETURN stats;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- DADOS INICIAIS DE EXEMPLO
-- =====================================================

-- Inserir trilhos de exemplo
INSERT INTO trilhos (codigo, tipo, material, comprimento, peso, fabricante, data_fabricacao, data_instalacao, km_inicial, km_final, estado, tensao, alinhamento, nivel, bitola, proxima_inspecao) VALUES
('TR-001-2024', 'UIC60', 'Aço endurecido', 25.0, 60.3, 'ArcelorMittal', '2024-01-15', '2024-03-20', 12.500, 12.525, 'Bom', 850, 2.1, 1.8, 1435, '2024-08-15'),
('TR-002-2024', 'UIC54', 'Aço especial', 25.0, 54.8, 'Voestalpine', '2024-02-10', '2024-04-15', 12.525, 12.550, 'Excelente', 820, 1.5, 1.2, 1435, '2024-09-01'),
('TR-003-2024', 'S49', 'Aço', 25.0, 49.4, 'Tata Steel', '2023-12-20', '2024-02-28', 12.550, 12.575, 'Regular', 780, 3.2, 2.8, 1435, '2024-07-20');

-- Inserir travessas de exemplo
INSERT INTO travessas (codigo, tipo, material, comprimento, largura, altura, peso, fabricante, data_fabricacao, data_instalacao, km_inicial, km_final, estado, proxima_inspecao) VALUES
('TV-001-2024', 'Betão', 'Betão armado pré-esforçado', 2.6, 0.25, 0.22, 320, 'Cimpor', '2024-02-10', '2024-03-20', 12.500, 12.5026, 'Excelente', '2024-08-15'),
('TV-002-2024', 'Betão', 'Betão armado pré-esforçado', 2.6, 0.25, 0.22, 320, 'Secil', '2024-01-20', '2024-03-25', 12.5026, 12.5052, 'Bom', '2024-08-20'),
('TV-003-2024', 'Madeira', 'Madeira de carvalho tratada', 2.4, 0.22, 0.18, 180, 'Silvapor', '2023-11-15', '2024-01-10', 12.5052, 12.5076, 'Mau', '2024-06-15');

-- Inserir inspeções de exemplo
INSERT INTO inspecoes (trilho_id, data_inspecao, tipo, inspector, resultado, observacoes, proxima_inspecao) VALUES
((SELECT id FROM trilhos WHERE codigo = 'TR-001-2024'), '2024-06-15', 'Geometria', 'João Silva', 'Conforme', 'Alinhamento e nível dentro dos parâmetros aceitáveis', '2024-08-15'),
((SELECT id FROM trilhos WHERE codigo = 'TR-003-2024'), '2024-06-10', 'Ultrassom', 'Maria Santos', 'Não Conforme', 'Detetadas fissuras superficiais', '2024-07-20');

INSERT INTO inspecoes (travessa_id, data_inspecao, tipo, inspector, resultado, observacoes, proxima_inspecao) VALUES
((SELECT id FROM travessas WHERE codigo = 'TV-003-2024'), '2024-06-05', 'Visual', 'Pedro Costa', 'Crítico', 'Fissuras estruturais graves detectadas', '2024-06-15');

-- =====================================================
-- COMENTÁRIOS DAS TABELAS
-- =====================================================

COMMENT ON TABLE trilhos IS 'Tabela para gestão de trilhos ferroviários';
COMMENT ON TABLE travessas IS 'Tabela para gestão de travessas ferroviárias';
COMMENT ON TABLE inspecoes IS 'Tabela para registo de inspeções de trilhos e travessas';

COMMENT ON COLUMN trilhos.codigo IS 'Código único de identificação do trilho';
COMMENT ON COLUMN trilhos.tipo IS 'Tipo do trilho (UIC60, UIC54, S49, S54)';
COMMENT ON COLUMN trilhos.material IS 'Material do trilho';
COMMENT ON COLUMN trilhos.comprimento IS 'Comprimento em metros';
COMMENT ON COLUMN trilhos.peso IS 'Peso em kg/m';
COMMENT ON COLUMN trilhos.tensao IS 'Tensão aplicada em MPa';
COMMENT ON COLUMN trilhos.alinhamento IS 'Desvio de alinhamento em mm';
COMMENT ON COLUMN trilhos.nivel IS 'Desvio de nível em mm';
COMMENT ON COLUMN trilhos.bitola IS 'Bitola em mm (padrão 1435)';

COMMENT ON COLUMN travessas.codigo IS 'Código único de identificação da travessa';
COMMENT ON COLUMN travessas.tipo IS 'Tipo da travessa (Betão, Madeira, Aço)';
COMMENT ON COLUMN travessas.comprimento IS 'Comprimento em metros';
COMMENT ON COLUMN travessas.largura IS 'Largura em metros';
COMMENT ON COLUMN travessas.altura IS 'Altura em metros';
COMMENT ON COLUMN travessas.peso IS 'Peso em kg';

COMMENT ON COLUMN inspecoes.tipo IS 'Tipo de inspeção realizada';
COMMENT ON COLUMN inspecoes.inspector IS 'Nome do inspector responsável';
COMMENT ON COLUMN inspecoes.resultado IS 'Resultado da inspeção';
COMMENT ON COLUMN inspecoes.fotos IS 'Array com URLs das fotos da inspeção';
COMMENT ON COLUMN inspecoes.parametros_medidos IS 'JSON com parâmetros específicos medidos';
