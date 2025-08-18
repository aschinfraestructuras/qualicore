-- Script SQL para atualizar a tabela armaduras existente
-- Adiciona os novos campos solicitados: numero_colada, numero_guia_remessa, fabricante, fornecedor_aco_obra, local_aplicacao, zona_aplicacao, lote_aplicacao

-- Adicionar as novas colunas à tabela existente
ALTER TABLE armaduras 
ADD COLUMN IF NOT EXISTS numero_colada VARCHAR(100),
ADD COLUMN IF NOT EXISTS numero_guia_remessa VARCHAR(100),
ADD COLUMN IF NOT EXISTS fabricante VARCHAR(200),
ADD COLUMN IF NOT EXISTS fornecedor_aco_obra VARCHAR(200),
ADD COLUMN IF NOT EXISTS local_aplicacao VARCHAR(200),
ADD COLUMN IF NOT EXISTS zona_aplicacao VARCHAR(200),
ADD COLUMN IF NOT EXISTS lote_aplicacao VARCHAR(100);

-- Criar índices para as novas colunas
CREATE INDEX IF NOT EXISTS idx_armaduras_numero_colada ON armaduras(numero_colada);
CREATE INDEX IF NOT EXISTS idx_armaduras_numero_guia_remessa ON armaduras(numero_guia_remessa);
CREATE INDEX IF NOT EXISTS idx_armaduras_fabricante ON armaduras(fabricante);
CREATE INDEX IF NOT EXISTS idx_armaduras_fornecedor_aco_obra ON armaduras(fornecedor_aco_obra);
CREATE INDEX IF NOT EXISTS idx_armaduras_local_aplicacao ON armaduras(local_aplicacao);
CREATE INDEX IF NOT EXISTS idx_armaduras_zona_aplicacao ON armaduras(zona_aplicacao);
CREATE INDEX IF NOT EXISTS idx_armaduras_lote_aplicacao ON armaduras(lote_aplicacao);

-- Atualizar registos existentes com dados de exemplo para as novas colunas
-- Usar uma abordagem com CTE para evitar window functions no UPDATE
WITH numbered_armaduras AS (
    SELECT 
        id,
        ROW_NUMBER() OVER (ORDER BY created_at) as rn
    FROM armaduras 
    WHERE numero_colada IS NULL
)
UPDATE armaduras 
SET 
    numero_colada = 'COL-2024-' || LPAD(CAST(na.rn AS TEXT), 3, '0'),
    numero_guia_remessa = 'GR-2024-' || LPAD(CAST(na.rn AS TEXT), 3, '0'),
    fabricante = CASE 
        WHEN na.rn = 1 THEN 'Aços Portugal'
        WHEN na.rn = 2 THEN 'Ferro & Aço'
        WHEN na.rn = 3 THEN 'Aços do Norte'
        WHEN na.rn = 4 THEN 'Aços do Sul'
        ELSE 'Metalurgica Central'
    END,
    fornecedor_aco_obra = CASE 
        WHEN na.rn = 1 THEN 'Metalurgica Silva'
        WHEN na.rn = 2 THEN 'Construções Lda'
        WHEN na.rn = 3 THEN 'Metalurgica Costa'
        WHEN na.rn = 4 THEN 'Construções Rápidas'
        ELSE 'Aços Express'
    END,
    local_aplicacao = CASE 
        WHEN na.rn = 1 THEN 'Pilar P1'
        WHEN na.rn = 2 THEN 'Viga V1'
        WHEN na.rn = 3 THEN 'Laje L1'
        WHEN na.rn = 4 THEN 'Pilar P2'
        ELSE 'Laje L2'
    END,
    zona_aplicacao = CASE 
        WHEN na.rn = 1 THEN 'Zona A - Fundações'
        WHEN na.rn = 2 THEN 'Zona B - Estrutura'
        WHEN na.rn = 3 THEN 'Zona C - Cobertura'
        WHEN na.rn = 4 THEN 'Zona D - Piso 1'
        ELSE 'Zona E - Piso 2'
    END,
    lote_aplicacao = 'LOTE-' || LPAD(CAST(na.rn AS TEXT), 3, '0')
FROM numbered_armaduras na
WHERE armaduras.id = na.id;

-- Atualizar a view de estatísticas
DROP VIEW IF EXISTS armaduras_stats;
CREATE OR REPLACE VIEW armaduras_stats AS
SELECT 
    COUNT(*) as total_armaduras,
    COUNT(CASE WHEN estado = 'aprovado' THEN 1 END) as armaduras_aprovadas,
    COUNT(CASE WHEN estado = 'pendente' THEN 1 END) as armaduras_pendentes,
    COUNT(CASE WHEN estado = 'reprovado' THEN 1 END) as armaduras_reprovadas,
    COUNT(CASE WHEN estado = 'instalado' THEN 1 END) as armaduras_instaladas,
    SUM(peso_total) as peso_total,
    SUM(peso_total) * 1200 as valor_estimado,
    CASE 
        WHEN COUNT(*) > 0 THEN 
            (COUNT(CASE WHEN estado = 'aprovado' THEN 1 END)::DECIMAL / COUNT(*)::DECIMAL) * 100
        ELSE 0 
    END as conformidade_media,
    COUNT(DISTINCT lote_aplicacao) as total_lotes,
    COUNT(DISTINCT fabricante) as fabricantes_unicos,
    COUNT(DISTINCT zona_aplicacao) as zonas_ativas
FROM armaduras;

-- Atualizar a view de dados completos
DROP VIEW IF EXISTS armaduras_complete;
CREATE OR REPLACE VIEW armaduras_complete AS
SELECT 
    a.*,
    f.nome as fornecedor_nome,
    o.nome as obra_nome
FROM armaduras a
LEFT JOIN fornecedores f ON a.fornecedor_id = f.id
LEFT JOIN obras o ON a.obra_id = o.id;

-- Criar ou atualizar a função de estatísticas detalhadas
CREATE OR REPLACE FUNCTION get_armaduras_detailed_stats()
RETURNS TABLE (
    total_armaduras BIGINT,
    armaduras_aprovadas BIGINT,
    armaduras_pendentes BIGINT,
    armaduras_reprovadas BIGINT,
    armaduras_instaladas BIGINT,
    peso_total DECIMAL,
    valor_estimado DECIMAL,
    conformidade_media DECIMAL,
    total_lotes BIGINT,
    fabricantes_unicos BIGINT,
    zonas_ativas BIGINT,
    peso_por_diametro JSONB,
    estado_distribuicao JSONB,
    aplicacao_por_zona JSONB
) AS $$
BEGIN
    RETURN QUERY
    WITH stats AS (
        SELECT 
            COUNT(*) as total_armaduras,
            COUNT(CASE WHEN estado = 'aprovado' THEN 1 END) as armaduras_aprovadas,
            COUNT(CASE WHEN estado = 'pendente' THEN 1 END) as armaduras_pendentes,
            COUNT(CASE WHEN estado = 'reprovado' THEN 1 END) as armaduras_reprovadas,
            COUNT(CASE WHEN estado = 'instalado' THEN 1 END) as armaduras_instaladas,
            SUM(peso_total) as peso_total,
            SUM(peso_total) * 1200 as valor_estimado,
            CASE 
                WHEN COUNT(*) > 0 THEN 
                    (COUNT(CASE WHEN estado = 'aprovado' THEN 1 END)::DECIMAL / COUNT(*)::DECIMAL) * 100
                ELSE 0 
            END as conformidade_media,
            COUNT(DISTINCT lote_aplicacao) as total_lotes,
            COUNT(DISTINCT fabricante) as fabricantes_unicos,
            COUNT(DISTINCT zona_aplicacao) as zonas_ativas
        FROM armaduras
    ),
    peso_diametro AS (
        SELECT jsonb_object_agg(diametro::TEXT, peso_total) as peso_por_diametro
        FROM (
            SELECT diametro, SUM(peso_total) as peso_total
            FROM armaduras
            GROUP BY diametro
        ) t
    ),
    estado_dist AS (
        SELECT jsonb_object_agg(estado, count) as estado_distribuicao
        FROM (
            SELECT estado, COUNT(*) as count
            FROM armaduras
            GROUP BY estado
        ) t
    ),
    zona_dist AS (
        SELECT jsonb_object_agg(zona_aplicacao, count) as aplicacao_por_zona
        FROM (
            SELECT zona_aplicacao, COUNT(*) as count
            FROM armaduras
            WHERE zona_aplicacao IS NOT NULL
            GROUP BY zona_aplicacao
        ) t
    )
    SELECT 
        s.total_armaduras,
        s.armaduras_aprovadas,
        s.armaduras_pendentes,
        s.armaduras_reprovadas,
        s.armaduras_instaladas,
        s.peso_total,
        s.valor_estimado,
        s.conformidade_media,
        s.total_lotes,
        s.fabricantes_unicos,
        s.zonas_ativas,
        COALESCE(pd.peso_por_diametro, '{}'::jsonb),
        COALESCE(ed.estado_distribuicao, '{}'::jsonb),
        COALESCE(zd.aplicacao_por_zona, '{}'::jsonb)
    FROM stats s
    CROSS JOIN peso_diametro pd
    CROSS JOIN estado_dist ed
    CROSS JOIN zona_dist zd;
END;
$$ LANGUAGE plpgsql;

-- Criar ou atualizar a função de busca avançada
CREATE OR REPLACE FUNCTION search_armaduras(
    search_term TEXT DEFAULT NULL,
    tipo_filter TEXT DEFAULT NULL,
    estado_filter TEXT DEFAULT NULL,
    zona_filter TEXT DEFAULT NULL,
    fabricante_filter TEXT DEFAULT NULL,
    numero_colada_filter TEXT DEFAULT NULL,
    numero_guia_filter TEXT DEFAULT NULL,
    local_aplicacao_filter TEXT DEFAULT NULL,
    data_inicio DATE DEFAULT NULL,
    data_fim DATE DEFAULT NULL,
    diametro_min DECIMAL DEFAULT NULL,
    diametro_max DECIMAL DEFAULT NULL
)
RETURNS TABLE (
    id UUID,
    codigo VARCHAR,
    tipo VARCHAR,
    tipo_outro VARCHAR,
    diametro DECIMAL,
    comprimento DECIMAL,
    largura DECIMAL,
    altura DECIMAL,
    quantidade INTEGER,
    peso_unitario DECIMAL,
    peso_total DECIMAL,
    numero_colada VARCHAR,
    numero_guia_remessa VARCHAR,
    fabricante VARCHAR,
    fornecedor_aco_obra VARCHAR,
    local_aplicacao VARCHAR,
    zona_aplicacao VARCHAR,
    lote_aplicacao VARCHAR,
    fornecedor_id UUID,
    obra_id UUID,
    zona VARCHAR,
    estado VARCHAR,
    data_rececao DATE,
    data_instalacao DATE,
    certificado_qualidade VARCHAR,
    ensaios_realizados TEXT[],
    fotos JSONB,
    documentos JSONB,
    observacoes TEXT,
    responsavel VARCHAR,
    user_id UUID,
    created_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE,
    fornecedor_nome VARCHAR,
    obra_nome VARCHAR
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        a.*,
        f.nome as fornecedor_nome,
        o.nome as obra_nome
    FROM armaduras a
    LEFT JOIN fornecedores f ON a.fornecedor_id = f.id
    LEFT JOIN obras o ON a.obra_id = o.id
    WHERE 
        (search_term IS NULL OR 
         a.codigo ILIKE '%' || search_term || '%' OR
         a.numero_colada ILIKE '%' || search_term || '%' OR
         a.numero_guia_remessa ILIKE '%' || search_term || '%' OR
         a.fabricante ILIKE '%' || search_term || '%' OR
         a.local_aplicacao ILIKE '%' || search_term || '%')
        AND (tipo_filter IS NULL OR a.tipo = tipo_filter)
        AND (estado_filter IS NULL OR a.estado = estado_filter)
        AND (zona_filter IS NULL OR a.zona = zona_filter)
        AND (fabricante_filter IS NULL OR a.fabricante ILIKE '%' || fabricante_filter || '%')
        AND (numero_colada_filter IS NULL OR a.numero_colada ILIKE '%' || numero_colada_filter || '%')
        AND (numero_guia_filter IS NULL OR a.numero_guia_remessa ILIKE '%' || numero_guia_filter || '%')
        AND (local_aplicacao_filter IS NULL OR a.local_aplicacao ILIKE '%' || local_aplicacao_filter || '%')
        AND (data_inicio IS NULL OR a.data_rececao >= data_inicio)
        AND (data_fim IS NULL OR a.data_rececao <= data_fim)
        AND (diametro_min IS NULL OR a.diametro >= diametro_min)
        AND (diametro_max IS NULL OR a.diametro <= diametro_max)
    ORDER BY a.created_at DESC;
END;
$$ LANGUAGE plpgsql;

-- Adicionar comentários às novas colunas
COMMENT ON COLUMN armaduras.numero_colada IS 'Número de identificação da colada de aço';
COMMENT ON COLUMN armaduras.numero_guia_remessa IS 'Número da guia de remessa do fornecedor';
COMMENT ON COLUMN armaduras.fabricante IS 'Nome do fabricante do aço';
COMMENT ON COLUMN armaduras.fornecedor_aco_obra IS 'Fornecedor do aço em obra';
COMMENT ON COLUMN armaduras.local_aplicacao IS 'Local específico onde será aplicada a armadura';
COMMENT ON COLUMN armaduras.zona_aplicacao IS 'Zona da obra onde será aplicada';
COMMENT ON COLUMN armaduras.lote_aplicacao IS 'Identificação do lote para rastreamento';

-- Verificar se as colunas foram adicionadas corretamente
SELECT 
    column_name, 
    data_type, 
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'armaduras' 
AND column_name IN ('numero_colada', 'numero_guia_remessa', 'fabricante', 'fornecedor_aco_obra', 'local_aplicacao', 'zona_aplicacao', 'lote_aplicacao')
ORDER BY column_name;
