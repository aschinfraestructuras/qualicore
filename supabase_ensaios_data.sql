-- =====================================================
-- SCRIPT SQL PARA SUPABASE - DADOS DE ENSAIOS E NORMAS
-- Qualicore - Sistema de Gestão de Ensaios
-- =====================================================

-- 1. CRIAR TABELA DE NORMAS EUROPEIAS
CREATE TABLE IF NOT EXISTS normas_europeias (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    codigo VARCHAR(20) NOT NULL UNIQUE,
    titulo VARCHAR(500) NOT NULL,
    descricao TEXT,
    categoria VARCHAR(100) NOT NULL,
    subcategoria VARCHAR(100),
    pais VARCHAR(50) DEFAULT 'Portugal',
    ativo BOOLEAN DEFAULT true,
    data_criacao TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    data_atualizacao TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. CRIAR TABELA DE CATEGORIAS DE ENSAIOS
CREATE TABLE IF NOT EXISTS categorias_ensaios (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    nome VARCHAR(100) NOT NULL UNIQUE,
    descricao TEXT,
    cor VARCHAR(7) DEFAULT '#3B82F6',
    icone VARCHAR(50),
    ordem INTEGER DEFAULT 0,
    ativo BOOLEAN DEFAULT true
);

-- 3. INSERIR CATEGORIAS DE ENSAIOS
INSERT INTO categorias_ensaios (nome, descricao, cor, icone, ordem) VALUES
('Betão', 'Ensaios de betão fresco e endurecido', '#8B5CF6', 'concrete', 1),
('Solos', 'Ensaios geotécnicos de solos', '#10B981', 'soil', 2),
('Agregados', 'Ensaios de agregados para construção', '#F59E0B', 'aggregate', 3),
('Aços', 'Ensaios de aços estruturais', '#EF4444', 'steel', 4),
('Obra In Situ', 'Ensaios realizados na obra', '#06B6D4', 'construction', 5),
('Madeiras', 'Ensaios de madeiras estruturais', '#8B4513', 'wood', 6),
('Geossintéticos', 'Ensaios de geossintéticos', '#7C3AED', 'geotextile', 7);

-- 4. INSERIR NORMAS EUROPEIAS RELEVANTES PARA PORTUGAL
INSERT INTO normas_europeias (codigo, titulo, descricao, categoria, subcategoria) VALUES

-- BETÃO
('EN 206-1', 'Betão - Especificação, performance, produção e conformidade', 'Norma europeia para especificação e conformidade do betão', 'Betão', 'Especificação'),
('EN 12390-1', 'Ensaios de betão endurecido - Parte 1: Forma, dimensões e outros requisitos para corpos de prova e moldes', 'Requisitos para moldes e corpos de prova', 'Betão', 'Ensaios'),
('EN 12390-2', 'Ensaios de betão endurecido - Parte 2: Fabricação e cura dos corpos de prova para ensaios de resistência', 'Fabricação e cura de corpos de prova', 'Betão', 'Ensaios'),
('EN 12390-3', 'Ensaios de betão endurecido - Parte 3: Resistência à compressão dos corpos de prova', 'Ensaio de resistência à compressão', 'Betão', 'Ensaios'),
('EN 12390-4', 'Ensaios de betão endurecido - Parte 4: Resistência à compressão - Especificações para máquinas de ensaio', 'Especificações para máquinas de ensaio', 'Betão', 'Ensaios'),
('EN 12390-5', 'Ensaios de betão endurecido - Parte 5: Resistência à flexão em corpos de prova', 'Ensaio de resistência à flexão', 'Betão', 'Ensaios'),
('EN 12390-6', 'Ensaios de betão endurecido - Parte 6: Resistência à tração por fendilhamento', 'Ensaio de resistência à tração', 'Betão', 'Ensaios'),
('EN 12390-7', 'Ensaios de betão endurecido - Parte 7: Densidade do betão endurecido', 'Ensaio de densidade', 'Betão', 'Ensaios'),
('EN 12390-8', 'Ensaios de betão endurecido - Parte 8: Profundidade de penetração da água sob pressão', 'Ensaio de permeabilidade', 'Betão', 'Ensaios'),
('EN 12390-9', 'Ensaios de betão endurecido - Parte 9: Resistência à compressão em corpos de prova cúbicos', 'Resistência em corpos cúbicos', 'Betão', 'Ensaios'),
('EN 12390-10', 'Ensaios de betão endurecido - Parte 10: Determinação do módulo de elasticidade estático em compressão', 'Módulo de elasticidade', 'Betão', 'Ensaios'),
('EN 12390-11', 'Ensaios de betão endurecido - Parte 11: Resistência à compressão em corpos de prova cilíndricos', 'Resistência em corpos cilíndricos', 'Betão', 'Ensaios'),
('EN 12390-12', 'Ensaios de betão endurecido - Parte 12: Determinação da resistência à compressão de estruturas e pré-fabricados', 'Resistência em estruturas', 'Betão', 'Ensaios'),
('EN 12390-13', 'Ensaios de betão endurecido - Parte 13: Determinação do módulo secante de elasticidade em compressão', 'Módulo secante', 'Betão', 'Ensaios'),

-- SOLOS
('EN ISO 14688-1', 'Identificação e classificação de solos - Parte 1: Identificação e descrição', 'Identificação e descrição de solos', 'Solos', 'Classificação'),
('EN ISO 14688-2', 'Identificação e classificação de solos - Parte 2: Princípios para uma classificação', 'Classificação de solos', 'Solos', 'Classificação'),
('EN ISO 14689-1', 'Identificação e classificação de rochas - Parte 1: Identificação e descrição', 'Identificação de rochas', 'Solos', 'Classificação'),
('EN ISO 17892-1', 'Ensaios geotécnicos de laboratório - Parte 1: Determinação do teor em água', 'Teor em água', 'Solos', 'Ensaios'),
('EN ISO 17892-2', 'Ensaios geotécnicos de laboratório - Parte 2: Determinação da massa volúmica das partículas', 'Massa volúmica', 'Solos', 'Ensaios'),
('EN ISO 17892-3', 'Ensaios geotécnicos de laboratório - Parte 3: Determinação da massa volúmica aparente seca', 'Massa volúmica aparente', 'Solos', 'Ensaios'),
('EN ISO 17892-4', 'Ensaios geotécnicos de laboratório - Parte 4: Determinação da distribuição granulométrica', 'Granulometria', 'Solos', 'Ensaios'),
('EN ISO 17892-5', 'Ensaios geotécnicos de laboratório - Parte 5: Ensaio de cisalhamento direto', 'Cisalhamento direto', 'Solos', 'Ensaios'),
('EN ISO 17892-6', 'Ensaios geotécnicos de laboratório - Parte 6: Ensaio de cisalhamento triaxial', 'Cisalhamento triaxial', 'Solos', 'Ensaios'),
('EN ISO 17892-7', 'Ensaios geotécnicos de laboratório - Parte 7: Ensaio de compressão uniaxial', 'Compressão uniaxial', 'Solos', 'Ensaios'),
('EN ISO 17892-8', 'Ensaios geotécnicos de laboratório - Parte 8: Ensaio de compressão edométrica', 'Compressão edométrica', 'Solos', 'Ensaios'),
('EN ISO 17892-9', 'Ensaios geotécnicos de laboratório - Parte 9: Ensaios de compressão triaxial em solos saturados', 'Compressão triaxial', 'Solos', 'Ensaios'),
('EN ISO 17892-10', 'Ensaios geotécnicos de laboratório - Parte 10: Ensaio de cisalhamento direto', 'Cisalhamento direto', 'Solos', 'Ensaios'),
('EN ISO 17892-11', 'Ensaios geotécnicos de laboratório - Parte 11: Determinação da permeabilidade', 'Permeabilidade', 'Solos', 'Ensaios'),
('EN ISO 17892-12', 'Ensaios geotécnicos de laboratório - Parte 12: Determinação dos limites de Atterberg', 'Limites de Atterberg', 'Solos', 'Ensaios'),

-- AGREGADOS
('EN 12620', 'Agregados para betão', 'Especificação para agregados para betão', 'Agregados', 'Especificação'),
('EN 933-1', 'Ensaios para determinar as propriedades geométricas dos agregados - Parte 1: Determinação da distribuição granulométrica', 'Granulometria', 'Agregados', 'Ensaios'),
('EN 933-2', 'Ensaios para determinar as propriedades geométricas dos agregados - Parte 2: Determinação da distribuição granulométrica', 'Granulometria', 'Agregados', 'Ensaios'),
('EN 933-3', 'Ensaios para determinar as propriedades geométricas dos agregados - Parte 3: Determinação da forma dos grãos', 'Forma dos grãos', 'Agregados', 'Ensaios'),
('EN 933-4', 'Ensaios para determinar as propriedades geométricas dos agregados - Parte 4: Determinação da forma dos grãos', 'Forma dos grãos', 'Agregados', 'Ensaios'),
('EN 933-5', 'Ensaios para determinar as propriedades geométricas dos agregados - Parte 5: Determinação do teor de partículas finas', 'Partículas finas', 'Agregados', 'Ensaios'),
('EN 933-6', 'Ensaios para determinar as propriedades geométricas dos agregados - Parte 6: Determinação da influência da forma dos grãos', 'Influência da forma', 'Agregados', 'Ensaios'),
('EN 933-7', 'Ensaios para determinar as propriedades geométricas dos agregados - Parte 7: Determinação da forma dos grãos', 'Forma dos grãos', 'Agregados', 'Ensaios'),
('EN 933-8', 'Ensaios para determinar as propriedades geométricas dos agregados - Parte 8: Determinação da forma dos grãos', 'Forma dos grãos', 'Agregados', 'Ensaios'),
('EN 933-9', 'Ensaios para determinar as propriedades geométricas dos agregados - Parte 9: Determinação da forma dos grãos', 'Forma dos grãos', 'Agregados', 'Ensaios'),
('EN 933-10', 'Ensaios para determinar as propriedades geométricas dos agregados - Parte 10: Determinação da forma dos grãos', 'Forma dos grãos', 'Agregados', 'Ensaios'),
('EN 933-11', 'Ensaios para determinar as propriedades geométricas dos agregados - Parte 11: Determinação da forma dos grãos', 'Forma dos grãos', 'Agregados', 'Ensaios'),

-- AÇOS
('EN 10025-1', 'Produtos laminados a quente de aços estruturais - Parte 1: Condições técnicas gerais de entrega', 'Condições gerais de entrega', 'Aços', 'Especificação'),
('EN 10025-2', 'Produtos laminados a quente de aços estruturais - Parte 2: Condições técnicas de entrega para aços estruturais não ligados', 'Aços não ligados', 'Aços', 'Especificação'),
('EN 10025-3', 'Produtos laminados a quente de aços estruturais - Parte 3: Condições técnicas de entrega para aços estruturais de grão fino normalizado', 'Aços de grão fino', 'Aços', 'Especificação'),
('EN 10025-4', 'Produtos laminados a quente de aços estruturais - Parte 4: Condições técnicas de entrega para aços estruturais de grão fino termomecanicamente laminados', 'Aços termomecânicos', 'Aços', 'Especificação'),
('EN 10025-5', 'Produtos laminados a quente de aços estruturais - Parte 5: Condições técnicas de entrega para aços estruturais resistentes à corrosão atmosférica', 'Aços resistentes à corrosão', 'Aços', 'Especificação'),
('EN 10025-6', 'Produtos laminados a quente de aços estruturais - Parte 6: Condições técnicas de entrega para produtos planos de aços estruturais em estado de recozimento normalizado', 'Aços recozidos', 'Aços', 'Especificação'),
('EN 1993-1-1', 'Eurocódigo 3 - Projeto de estruturas de aço - Parte 1-1: Regras gerais e regras para edifícios', 'Regras gerais para estruturas de aço', 'Aços', 'Projeto'),
('EN 1993-1-2', 'Eurocódigo 3 - Projeto de estruturas de aço - Parte 1-2: Regras gerais - Cálculo do comportamento em caso de incêndio', 'Comportamento em incêndio', 'Aços', 'Projeto'),
('EN 1993-1-3', 'Eurocódigo 3 - Projeto de estruturas de aço - Parte 1-3: Regras gerais suplementares para perfis e chapas conformados a frio', 'Perfis conformados a frio', 'Aços', 'Projeto'),
('EN 1993-1-4', 'Eurocódigo 3 - Projeto de estruturas de aço - Parte 1-4: Regras gerais suplementares para aços inoxidáveis', 'Aços inoxidáveis', 'Aços', 'Projeto'),
('EN 1993-1-5', 'Eurocódigo 3 - Projeto de estruturas de aço - Parte 1-5: Chapas planas com esforços no seu plano', 'Chapas planas', 'Aços', 'Projeto'),
('EN 1993-1-6', 'Eurocódigo 3 - Projeto de estruturas de aço - Parte 1-6: Resistência e estabilidade de estruturas em casca', 'Estruturas em casca', 'Aços', 'Projeto'),
('EN 1993-1-7', 'Eurocódigo 3 - Projeto de estruturas de aço - Parte 1-7: Chapas planas sujeitas a cargas fora do plano', 'Cargas fora do plano', 'Aços', 'Projeto'),
('EN 1993-1-8', 'Eurocódigo 3 - Projeto de estruturas de aço - Parte 1-8: Projeto de ligações', 'Ligações', 'Aços', 'Projeto'),
('EN 1993-1-9', 'Eurocódigo 3 - Projeto de estruturas de aço - Parte 1-9: Fadiga', 'Fadiga', 'Aços', 'Projeto'),
('EN 1993-1-10', 'Eurocódigo 3 - Projeto de estruturas de aço - Parte 1-10: Propriedades dos materiais', 'Propriedades dos materiais', 'Aços', 'Projeto'),
('EN 1993-1-11', 'Eurocódigo 3 - Projeto de estruturas de aço - Parte 1-11: Projeto de estruturas com elementos em tração', 'Elementos em tração', 'Aços', 'Projeto'),
('EN 1993-1-12', 'Eurocódigo 3 - Projeto de estruturas de aço - Parte 1-12: Resistência adicional para melhorar a ductilidade e a capacidade de rotação', 'Ductilidade e capacidade de rotação', 'Aços', 'Projeto'),

-- OBRA IN SITU
('EN 12504-1', 'Ensaios de betão em estruturas e elementos pré-fabricados - Parte 1: Corpos de prova extraídos - Ensaio de resistência à compressão', 'Resistência à compressão in situ', 'Obra In Situ', 'Ensaios'),
('EN 12504-2', 'Ensaios de betão em estruturas e elementos pré-fabricados - Parte 2: Ensaios não destrutivos - Determinação da velocidade de propagação de ondas ultrassónicas', 'Velocidade ultrassónica', 'Obra In Situ', 'Ensaios'),
('EN 12504-3', 'Ensaios de betão em estruturas e elementos pré-fabricados - Parte 3: Determinação da resistência à tração por fendilhamento', 'Tração por fendilhamento in situ', 'Obra In Situ', 'Ensaios'),
('EN 12504-4', 'Ensaios de betão em estruturas e elementos pré-fabricados - Parte 4: Determinação da velocidade de propagação de ondas ultrassónicas', 'Velocidade ultrassónica', 'Obra In Situ', 'Ensaios'),
('EN 12504-5', 'Ensaios de betão em estruturas e elementos pré-fabricados - Parte 5: Determinação da resistência à tração por fendilhamento', 'Tração por fendilhamento in situ', 'Obra In Situ', 'Ensaios'),

-- MADEIRAS
('EN 338', 'Madeiras estruturais - Classes de resistência', 'Classes de resistência para madeiras estruturais', 'Madeiras', 'Especificação'),
('EN 408', 'Estruturas de madeira - Madeiras estruturais e madeiras laminadas coladas - Determinação de algumas propriedades físicas e mecânicas', 'Propriedades físicas e mecânicas', 'Madeiras', 'Ensaios'),
('EN 1193', 'Estruturas de madeira - Madeiras estruturais - Determinação da resistência à tração perpendicular às fibras', 'Tração perpendicular às fibras', 'Madeiras', 'Ensaios'),
('EN 1194', 'Estruturas de madeira - Madeiras laminadas coladas - Determinação da resistência à tração perpendicular às fibras', 'Tração perpendicular às fibras', 'Madeiras', 'Ensaios'),
('EN 1195', 'Estruturas de madeira - Madeiras estruturais - Determinação da resistência à compressão perpendicular às fibras', 'Compressão perpendicular às fibras', 'Madeiras', 'Ensaios'),
('EN 1196', 'Estruturas de madeira - Madeiras laminadas coladas - Determinação da resistência à compressão perpendicular às fibras', 'Compressão perpendicular às fibras', 'Madeiras', 'Ensaios'),
('EN 1197', 'Estruturas de madeira - Madeiras estruturais - Determinação da resistência à tração paralela às fibras', 'Tração paralela às fibras', 'Madeiras', 'Ensaios'),
('EN 1198', 'Estruturas de madeira - Madeiras laminadas coladas - Determinação da resistência à tração paralela às fibras', 'Tração paralela às fibras', 'Madeiras', 'Ensaios'),
('EN 1199', 'Estruturas de madeira - Madeiras estruturais - Determinação da resistência à compressão paralela às fibras', 'Compressão paralela às fibras', 'Madeiras', 'Ensaios'),
('EN 1200', 'Estruturas de madeira - Madeiras laminadas coladas - Determinação da resistência à compressão paralela às fibras', 'Compressão paralela às fibras', 'Madeiras', 'Ensaios'),

-- GEOSSINTÉTICOS
('EN ISO 10318', 'Geossintéticos - Termos e definições', 'Termos e definições para geossintéticos', 'Geossintéticos', 'Definições'),
('EN ISO 10319', 'Geossintéticos - Ensaio de tração de largura completa', 'Ensaio de tração', 'Geossintéticos', 'Ensaios'),
('EN ISO 10320', 'Geossintéticos - Identificação em obra', 'Identificação em obra', 'Geossintéticos', 'Identificação'),
('EN ISO 10321', 'Geossintéticos - Ensaio de tração de largura completa', 'Ensaio de tração', 'Geossintéticos', 'Ensaios'),
('EN ISO 10322', 'Geossintéticos - Ensaio de tração de largura completa', 'Ensaio de tração', 'Geossintéticos', 'Ensaios'),
('EN ISO 10323', 'Geossintéticos - Ensaio de tração de largura completa', 'Ensaio de tração', 'Geossintéticos', 'Ensaios'),
('EN ISO 10324', 'Geossintéticos - Ensaio de tração de largura completa', 'Ensaio de tração', 'Geossintéticos', 'Ensaios'),
('EN ISO 10325', 'Geossintéticos - Ensaio de tração de largura completa', 'Ensaio de tração', 'Geossintéticos', 'Ensaios'),
('EN ISO 10326', 'Geossintéticos - Ensaio de tração de largura completa', 'Ensaio de tração', 'Geossintéticos', 'Ensaios'),
('EN ISO 10327', 'Geossintéticos - Ensaio de tração de largura completa', 'Ensaio de tração', 'Geossintéticos', 'Ensaios'),
('EN ISO 10328', 'Geossintéticos - Ensaio de tração de largura completa', 'Ensaio de tração', 'Geossintéticos', 'Ensaios'),
('EN ISO 10329', 'Geossintéticos - Ensaio de tração de largura completa', 'Ensaio de tração', 'Geossintéticos', 'Ensaios'),
('EN ISO 10330', 'Geossintéticos - Ensaio de tração de largura completa', 'Ensaio de tração', 'Geossintéticos', 'Ensaios');

-- 5. INSERIR DADOS DE EXEMPLO DE ENSAIOS
-- Nota: Assumindo que a tabela 'ensaios' já existe com a estrutura correta

-- Exemplo de inserção de ensaios (ajustar conforme a estrutura real da tabela)
-- INSERT INTO ensaios (codigo, tipo, data_ensaio, laboratorio, responsavel, valor_esperado, valor_obtido, unidade, conforme, estado, zona, observacoes) VALUES
-- ('EN-2024-001', 'Ensaio de Resistência à Compressão', '2024-01-15', 'Laboratório Central', 'Eng. Silva', 25.0, 27.5, 'MPa', true, 'aprovado', 'Zona A - Fundações', 'Betão C25/30 - Conforme EN 206-1'),
-- ('EN-2024-002', 'Ensaio de Granulometria', '2024-01-16', 'Laboratório de Obra', 'Téc. Santos', 100.0, 98.5, '%', true, 'aprovado', 'Zona B - Pilares', 'Agregado 0/20 - Conforme EN 933-1'),
-- ('EN-2024-003', 'Ensaio de Limites de Atterberg', '2024-01-17', 'Laboratório Externo - LNEC', 'Dr. Costa', 35.0, 32.0, '%', true, 'aprovado', 'Zona C - Lajes', 'Solo argiloso - Conforme EN ISO 17892-12');

-- 6. CRIAR ÍNDICES PARA PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_ensaios_codigo ON ensaios(codigo);
CREATE INDEX IF NOT EXISTS idx_ensaios_tipo ON ensaios(tipo);
CREATE INDEX IF NOT EXISTS idx_ensaios_data ON ensaios(data_ensaio);
CREATE INDEX IF NOT EXISTS idx_ensaios_laboratorio ON ensaios(laboratorio);
CREATE INDEX IF NOT EXISTS idx_ensaios_estado ON ensaios(estado);
CREATE INDEX IF NOT EXISTS idx_normas_categoria ON normas_europeias(categoria);
CREATE INDEX IF NOT EXISTS idx_normas_codigo ON normas_europeias(codigo);

-- 7. CRIAR FUNÇÃO PARA ATUALIZAR TIMESTAMP
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.data_atualizacao = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 8. CRIAR TRIGGERS PARA ATUALIZAÇÃO AUTOMÁTICA
CREATE TRIGGER update_normas_europeias_updated_at 
    BEFORE UPDATE ON normas_europeias 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 9. CRIAR VIEW PARA ENSAIOS COM NORMAS
CREATE OR REPLACE VIEW ensaios_com_normas AS
SELECT 
    e.*,
    n.codigo as norma_codigo,
    n.titulo as norma_titulo,
    n.categoria as norma_categoria
FROM ensaios e
LEFT JOIN normas_europeias n ON e.tipo LIKE '%' || n.codigo || '%'
WHERE n.ativo = true;

-- 10. CRIAR FUNÇÃO PARA ESTATÍSTICAS
CREATE OR REPLACE FUNCTION get_ensaios_stats()
RETURNS TABLE (
    total_ensaios BIGINT,
    ensaios_aprovados BIGINT,
    ensaios_reprovados BIGINT,
    ensaios_pendentes BIGINT,
    taxa_aprovacao NUMERIC
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COUNT(*) as total_ensaios,
        COUNT(*) FILTER (WHERE conforme = true) as ensaios_aprovados,
        COUNT(*) FILTER (WHERE conforme = false) as ensaios_reprovados,
        COUNT(*) FILTER (WHERE estado = 'pendente') as ensaios_pendentes,
        ROUND(
            (COUNT(*) FILTER (WHERE conforme = true)::NUMERIC / COUNT(*)::NUMERIC) * 100, 2
        ) as taxa_aprovacao
    FROM ensaios;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- FIM DO SCRIPT
-- =====================================================
