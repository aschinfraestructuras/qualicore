-- Script SQL para criar a tabela armaduras com todos os campos solicitados
-- Inclui os novos campos: numero_colada, numero_guia_remessa, fabricante, fornecedor_aco_obra, local_aplicacao, zona_aplicacao, lote_aplicacao

-- Criar a tabela armaduras
CREATE TABLE IF NOT EXISTS armaduras (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    codigo VARCHAR(50) UNIQUE NOT NULL,
    tipo VARCHAR(50) NOT NULL CHECK (tipo IN ('feixe', 'estribo', 'cintas', 'armadura_negativa', 'armadura_positiva', 'outro')),
    tipo_outro VARCHAR(100),
    diametro DECIMAL(5,2) NOT NULL,
    comprimento DECIMAL(8,2) NOT NULL,
    largura DECIMAL(8,2),
    altura DECIMAL(8,2),
    quantidade INTEGER NOT NULL,
    peso_unitario DECIMAL(8,2) NOT NULL,
    peso_total DECIMAL(10,2) NOT NULL,
    
    -- Novos campos solicitados
    numero_colada VARCHAR(100) NOT NULL,
    numero_guia_remessa VARCHAR(100) NOT NULL,
    fabricante VARCHAR(200) NOT NULL,
    fornecedor_aco_obra VARCHAR(200) NOT NULL,
    
    -- Rastreamento de aplicação
    local_aplicacao VARCHAR(200) NOT NULL,
    zona_aplicacao VARCHAR(200) NOT NULL,
    lote_aplicacao VARCHAR(100) NOT NULL,
    
    -- Campos existentes
    fornecedor_id UUID REFERENCES fornecedores(id) ON DELETE SET NULL,
    obra_id UUID REFERENCES obras(id) ON DELETE SET NULL,
    zona VARCHAR(100) NOT NULL,
    estado VARCHAR(50) NOT NULL DEFAULT 'pendente' CHECK (estado IN ('pendente', 'em_analise', 'aprovado', 'reprovado', 'instalado', 'concluido')),
    data_rececao DATE NOT NULL,
    data_instalacao DATE,
    certificado_qualidade VARCHAR(200),
    ensaios_realizados TEXT[] DEFAULT '{}',
    fotos JSONB DEFAULT '[]',
    documentos JSONB DEFAULT '[]',
    observacoes TEXT,
    responsavel VARCHAR(200) NOT NULL,
    user_id UUID NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_armaduras_codigo ON armaduras(codigo);
CREATE INDEX IF NOT EXISTS idx_armaduras_tipo ON armaduras(tipo);
CREATE INDEX IF NOT EXISTS idx_armaduras_estado ON armaduras(estado);
CREATE INDEX IF NOT EXISTS idx_armaduras_zona ON armaduras(zona);
CREATE INDEX IF NOT EXISTS idx_armaduras_data_rececao ON armaduras(data_rececao);
CREATE INDEX IF NOT EXISTS idx_armaduras_fornecedor_id ON armaduras(fornecedor_id);
CREATE INDEX IF NOT EXISTS idx_armaduras_obra_id ON armaduras(obra_id);
CREATE INDEX IF NOT EXISTS idx_armaduras_user_id ON armaduras(user_id);

-- Novos índices para os campos adicionados
CREATE INDEX IF NOT EXISTS idx_armaduras_numero_colada ON armaduras(numero_colada);
CREATE INDEX IF NOT EXISTS idx_armaduras_numero_guia_remessa ON armaduras(numero_guia_remessa);
CREATE INDEX IF NOT EXISTS idx_armaduras_fabricante ON armaduras(fabricante);
CREATE INDEX IF NOT EXISTS idx_armaduras_fornecedor_aco_obra ON armaduras(fornecedor_aco_obra);
CREATE INDEX IF NOT EXISTS idx_armaduras_local_aplicacao ON armaduras(local_aplicacao);
CREATE INDEX IF NOT EXISTS idx_armaduras_zona_aplicacao ON armaduras(zona_aplicacao);
CREATE INDEX IF NOT EXISTS idx_armaduras_lote_aplicacao ON armaduras(lote_aplicacao);

-- Trigger para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_armaduras_updated_at 
    BEFORE UPDATE ON armaduras 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Trigger para calcular peso_total automaticamente
CREATE OR REPLACE FUNCTION calculate_peso_total()
RETURNS TRIGGER AS $$
BEGIN
    NEW.peso_total = NEW.quantidade * NEW.peso_unitario;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER calculate_armaduras_peso_total
    BEFORE INSERT OR UPDATE ON armaduras
    FOR EACH ROW
    EXECUTE FUNCTION calculate_peso_total();

-- Trigger para gerar código automaticamente se não fornecido
CREATE OR REPLACE FUNCTION generate_armadura_codigo()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.codigo IS NULL OR NEW.codigo = '' THEN
        NEW.codigo = 'ARM-' || EXTRACT(YEAR FROM NOW()) || '-' || LPAD(CAST(nextval('armaduras_codigo_seq') AS TEXT), 4, '0');
    END IF;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Criar sequência para códigos automáticos
CREATE SEQUENCE IF NOT EXISTS armaduras_codigo_seq START 1;

CREATE TRIGGER generate_armadura_codigo_trigger
    BEFORE INSERT ON armaduras
    FOR EACH ROW
    EXECUTE FUNCTION generate_armadura_codigo();

-- Criar view para estatísticas
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

-- Criar view para dados completos com joins
CREATE OR REPLACE VIEW armaduras_complete AS
SELECT 
    a.*,
    f.nome as fornecedor_nome,
    o.nome as obra_nome
FROM armaduras a
LEFT JOIN fornecedores f ON a.fornecedor_id = f.id
LEFT JOIN obras o ON a.obra_id = o.id;

-- Configurar Row Level Security (RLS)
ALTER TABLE armaduras ENABLE ROW LEVEL SECURITY;

-- Política para permitir que utilizadores vejam apenas as suas armaduras
CREATE POLICY "Users can view their own armaduras" ON armaduras
    FOR SELECT USING (auth.uid() = user_id);

-- Política para permitir que utilizadores criem armaduras
CREATE POLICY "Users can create armaduras" ON armaduras
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Política para permitir que utilizadores atualizem as suas armaduras
CREATE POLICY "Users can update their own armaduras" ON armaduras
    FOR UPDATE USING (auth.uid() = user_id);

-- Política para permitir que utilizadores eliminem as suas armaduras
CREATE POLICY "Users can delete their own armaduras" ON armaduras
    FOR DELETE USING (auth.uid() = user_id);

-- Inserir dados de exemplo
INSERT INTO armaduras (
    codigo, tipo, diametro, comprimento, quantidade, peso_unitario,
    numero_colada, numero_guia_remessa, fabricante, fornecedor_aco_obra,
    local_aplicacao, zona_aplicacao, lote_aplicacao,
    zona, estado, data_rececao, responsavel, user_id
) VALUES 
(
    'ARM-2024-0001', 'feixe', 12.0, 6.0, 50, 0.888,
    'COL-2024-001', 'GR-2024-001', 'Aços Portugal', 'Metalurgica Silva',
    'Pilar P1', 'Zona A - Fundações', 'LOTE-001',
    'Fundações', 'aprovado', '2024-01-15', 'João Silva', '00000000-0000-0000-0000-000000000000'
),
(
    'ARM-2024-0002', 'estribo', 8.0, 0.5, 200, 0.395,
    'COL-2024-002', 'GR-2024-002', 'Ferro & Aço', 'Construções Lda',
    'Viga V1', 'Zona B - Estrutura', 'LOTE-002',
    'Estrutura', 'pendente', '2024-01-20', 'Maria Santos', '00000000-0000-0000-0000-000000000000'
),
(
    'ARM-2024-0003', 'armadura_positiva', 16.0, 8.0, 30, 1.579,
    'COL-2024-003', 'GR-2024-003', 'Aços do Norte', 'Metalurgica Costa',
    'Laje L1', 'Zona C - Cobertura', 'LOTE-003',
    'Cobertura', 'em_analise', '2024-01-25', 'Pedro Costa', '00000000-0000-0000-0000-000000000000'
),
(
    'ARM-2024-0004', 'cintas', 10.0, 1.2, 100, 0.617,
    'COL-2024-004', 'GR-2024-004', 'Aços do Sul', 'Construções Rápidas',
    'Pilar P2', 'Zona D - Piso 1', 'LOTE-004',
    'Piso 1', 'instalado', '2024-01-30', 'Ana Ferreira', '00000000-0000-0000-0000-000000000000'
),
(
    'ARM-2024-0005', 'armadura_negativa', 14.0, 7.0, 40, 1.208,
    'COL-2024-005', 'GR-2024-005', 'Metalurgica Central', 'Aços Express',
    'Laje L2', 'Zona E - Piso 2', 'LOTE-005',
    'Piso 2', 'concluido', '2024-02-05', 'Carlos Oliveira', '00000000-0000-0000-0000-000000000000'
)
ON CONFLICT (codigo) DO NOTHING;

-- Comentários na tabela
COMMENT ON TABLE armaduras IS 'Tabela para gestão de armaduras de aço em obras de construção';
COMMENT ON COLUMN armaduras.numero_colada IS 'Número de identificação da colada de aço';
COMMENT ON COLUMN armaduras.numero_guia_remessa IS 'Número da guia de remessa do fornecedor';
COMMENT ON COLUMN armaduras.fabricante IS 'Nome do fabricante do aço';
COMMENT ON COLUMN armaduras.fornecedor_aco_obra IS 'Fornecedor do aço em obra';
COMMENT ON COLUMN armaduras.local_aplicacao IS 'Local específico onde será aplicada a armadura';
COMMENT ON COLUMN armaduras.zona_aplicacao IS 'Zona da obra onde será aplicada';
COMMENT ON COLUMN armaduras.lote_aplicacao IS 'Identificação do lote para rastreamento';

-- Função para obter estatísticas detalhadas
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

-- Função para buscar armaduras com filtros avançados
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

-- Comentário final
COMMENT ON FUNCTION get_armaduras_detailed_stats() IS 'Função para obter estatísticas detalhadas das armaduras incluindo distribuições por estado, peso por diâmetro e aplicação por zona';
COMMENT ON FUNCTION search_armaduras(TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, DATE, DATE, DECIMAL, DECIMAL) IS 'Função para buscar armaduras com filtros avançados incluindo os novos campos de rastreamento';
