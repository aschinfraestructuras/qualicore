-- =====================================================
-- CRIAÇÃO DA TABELA DE ARMADURAS
-- Sistema de Gestão de Armaduras e Aços para Construção
-- =====================================================

-- Criar tabela principal de armaduras
CREATE TABLE IF NOT EXISTS armaduras (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Informações básicas
    codigo VARCHAR(50) UNIQUE NOT NULL,
    tipo VARCHAR(50) NOT NULL CHECK (tipo IN ('feixe', 'estribo', 'cintas', 'armadura_negativa', 'armadura_positiva', 'outro')),
    tipo_outro VARCHAR(100),
    
    -- Especificações técnicas
    diametro DECIMAL(5,2) NOT NULL CHECK (diametro > 0),
    comprimento DECIMAL(8,2) NOT NULL CHECK (comprimento > 0),
    largura DECIMAL(8,2),
    altura DECIMAL(8,2),
    quantidade INTEGER NOT NULL CHECK (quantidade > 0),
    peso_unitario DECIMAL(8,3) NOT NULL CHECK (peso_unitario > 0),
    peso_total DECIMAL(10,2) NOT NULL CHECK (peso_total > 0),
    
    -- Relacionamentos
    fornecedor_id UUID REFERENCES fornecedores(id) ON DELETE SET NULL,
    obra_id UUID REFERENCES obras(id) ON DELETE SET NULL,
    
    -- Localização e estado
    zona VARCHAR(100) NOT NULL,
    estado VARCHAR(50) NOT NULL DEFAULT 'pendente' CHECK (estado IN ('pendente', 'em_analise', 'aprovado', 'reprovado', 'instalado', 'concluido')),
    
    -- Datas
    data_rececao DATE NOT NULL,
    data_instalacao DATE,
    
    -- Certificações e ensaios
    certificado_qualidade VARCHAR(100),
    ensaios_realizados TEXT[] DEFAULT '{}',
    
    -- Fotos e documentos (JSONB para flexibilidade)
    fotos JSONB DEFAULT '[]',
    documentos JSONB DEFAULT '[]',
    
    -- Observações e responsável
    observacoes TEXT,
    responsavel VARCHAR(100) NOT NULL,
    
    -- Metadados
    user_id UUID NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar índices para performance
CREATE INDEX IF NOT EXISTS idx_armaduras_codigo ON armaduras(codigo);
CREATE INDEX IF NOT EXISTS idx_armaduras_tipo ON armaduras(tipo);
CREATE INDEX IF NOT EXISTS idx_armaduras_estado ON armaduras(estado);
CREATE INDEX IF NOT EXISTS idx_armaduras_zona ON armaduras(zona);
CREATE INDEX IF NOT EXISTS idx_armaduras_fornecedor_id ON armaduras(fornecedor_id);
CREATE INDEX IF NOT EXISTS idx_armaduras_obra_id ON armaduras(obra_id);
CREATE INDEX IF NOT EXISTS idx_armaduras_data_rececao ON armaduras(data_rececao);
CREATE INDEX IF NOT EXISTS idx_armaduras_user_id ON armaduras(user_id);
CREATE INDEX IF NOT EXISTS idx_armaduras_created_at ON armaduras(created_at);

-- Criar função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_armaduras_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Criar trigger para atualizar updated_at
CREATE TRIGGER trigger_update_armaduras_updated_at
    BEFORE UPDATE ON armaduras
    FOR EACH ROW
    EXECUTE FUNCTION update_armaduras_updated_at();

-- Criar função para calcular peso total automaticamente
CREATE OR REPLACE FUNCTION calculate_armadura_peso_total()
RETURNS TRIGGER AS $$
BEGIN
    NEW.peso_total = NEW.peso_unitario * NEW.quantidade;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Criar trigger para calcular peso total
CREATE TRIGGER trigger_calculate_armadura_peso_total
    BEFORE INSERT OR UPDATE ON armaduras
    FOR EACH ROW
    EXECUTE FUNCTION calculate_armadura_peso_total();

-- Criar função para gerar código automático
CREATE OR REPLACE FUNCTION generate_armadura_codigo()
RETURNS TRIGGER AS $$
DECLARE
    year_part VARCHAR(4);
    sequence_num INTEGER;
    new_codigo VARCHAR(50);
BEGIN
    -- Se o código já foi fornecido, não gerar automaticamente
    IF NEW.codigo IS NOT NULL AND NEW.codigo != '' THEN
        RETURN NEW;
    END IF;
    
    year_part := EXTRACT(YEAR FROM NOW())::VARCHAR;
    
    -- Buscar o próximo número da sequência para este ano
    SELECT COALESCE(MAX(CAST(SUBSTRING(codigo FROM 9) AS INTEGER)), 0) + 1
    INTO sequence_num
    FROM armaduras
    WHERE codigo LIKE 'ARM-' || year_part || '-%';
    
    new_codigo := 'ARM-' || year_part || '-' || LPAD(sequence_num::VARCHAR, 4, '0');
    NEW.codigo := new_codigo;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Criar trigger para gerar código automático
CREATE TRIGGER trigger_generate_armadura_codigo
    BEFORE INSERT ON armaduras
    FOR EACH ROW
    EXECUTE FUNCTION generate_armadura_codigo();

-- Criar view para estatísticas de armaduras
CREATE OR REPLACE VIEW armaduras_stats AS
SELECT 
    COUNT(*) as total_armaduras,
    COUNT(*) FILTER (WHERE estado = 'aprovado') as armaduras_aprovadas,
    COUNT(*) FILTER (WHERE estado = 'pendente') as armaduras_pendentes,
    COUNT(*) FILTER (WHERE estado = 'reprovado') as armaduras_reprovadas,
    COUNT(*) FILTER (WHERE estado = 'instalado') as armaduras_instaladas,
    COUNT(*) FILTER (WHERE estado = 'concluido') as armaduras_concluidas,
    SUM(peso_total) as peso_total,
    SUM(peso_total * 0.8) as valor_estimado, -- Preço estimado por kg
    ROUND(
        (COUNT(*) FILTER (WHERE estado IN ('aprovado', 'instalado', 'concluido'))::DECIMAL / COUNT(*) * 100), 2
    ) as conformidade_media
FROM armaduras;

-- Criar view para armaduras com informações relacionadas
CREATE OR REPLACE VIEW armaduras_complete AS
SELECT 
    a.*,
    f.nome as fornecedor_nome,
    o.nome as obra_nome
FROM armaduras a
LEFT JOIN fornecedores f ON a.fornecedor_id = f.id
LEFT JOIN obras o ON a.obra_id = o.id;

-- Inserir dados de exemplo (opcional)
INSERT INTO armaduras (
    codigo, tipo, diametro, comprimento, quantidade, peso_unitario, 
    zona, estado, data_rececao, responsavel, user_id
) VALUES 
    ('ARM-2024-0001', 'feixe', 12.5, 6.0, 50, 0.888, 'Pilar P1', 'aprovado', '2024-01-15', 'João Silva', '00000000-0000-0000-0000-000000000000'),
    ('ARM-2024-0002', 'estribo', 8.0, 0.5, 200, 0.395, 'Viga V1', 'pendente', '2024-01-20', 'Maria Santos', '00000000-0000-0000-0000-000000000000'),
    ('ARM-2024-0003', 'cintas', 10.0, 1.2, 100, 0.617, 'Laje L1', 'em_analise', '2024-01-25', 'Pedro Costa', '00000000-0000-0000-0000-000000000000')
ON CONFLICT (codigo) DO NOTHING;

-- Criar políticas RLS (Row Level Security) se necessário
ALTER TABLE armaduras ENABLE ROW LEVEL SECURITY;

-- Política para usuários verem apenas suas próprias armaduras
CREATE POLICY "Users can view their own armaduras" ON armaduras
    FOR SELECT USING (auth.uid() = user_id);

-- Política para usuários inserirem suas próprias armaduras
CREATE POLICY "Users can insert their own armaduras" ON armaduras
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Política para usuários atualizarem suas próprias armaduras
CREATE POLICY "Users can update their own armaduras" ON armaduras
    FOR UPDATE USING (auth.uid() = user_id);

-- Política para usuários eliminarem suas próprias armaduras
CREATE POLICY "Users can delete their own armaduras" ON armaduras
    FOR DELETE USING (auth.uid() = user_id);

-- Comentários na tabela
COMMENT ON TABLE armaduras IS 'Tabela principal para gestão de armaduras e aços para construção';
COMMENT ON COLUMN armaduras.codigo IS 'Código único da armadura (gerado automaticamente se não fornecido)';
COMMENT ON COLUMN armaduras.tipo IS 'Tipo de armadura: feixe, estribo, cintas, etc.';
COMMENT ON COLUMN armaduras.diametro IS 'Diâmetro da armadura em mm';
COMMENT ON COLUMN armaduras.comprimento IS 'Comprimento da armadura em metros';
COMMENT ON COLUMN armaduras.peso_total IS 'Peso total calculado automaticamente (peso_unitario * quantidade)';
COMMENT ON COLUMN armaduras.fotos IS 'Array JSON com informações das fotos (URL, nome, tipo, etc.)';
COMMENT ON COLUMN armaduras.documentos IS 'Array JSON com informações dos documentos (URL, nome, tipo, etc.)';

-- =====================================================
-- FIM DO SCRIPT
-- =====================================================
