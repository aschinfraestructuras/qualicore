-- Migração para criar a tabela de Ensaios de Compactação
-- Execute este script no SQL Editor do Supabase

-- Criar a tabela ensaios_compactacao
CREATE TABLE IF NOT EXISTS ensaios_compactacao (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    obra TEXT NOT NULL,
    localizacao TEXT NOT NULL,
    elemento TEXT NOT NULL,
    numero_ensaio TEXT NOT NULL,
    codigo TEXT NOT NULL,
    data_amostra DATE NOT NULL,
    densidade_maxima_referencia DECIMAL(10,3) NOT NULL,
    humidade_otima_referencia DECIMAL(5,2) NOT NULL,
    pontos JSONB DEFAULT '[]'::jsonb,
    densidade_seca_media DECIMAL(10,3) DEFAULT 0,
    humidade_media DECIMAL(5,2) DEFAULT 0,
    grau_compactacao_medio DECIMAL(5,2) DEFAULT 0,
    referencia_laboratorio_externo TEXT,
    observacoes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_ensaios_compactacao_obra ON ensaios_compactacao(obra);
CREATE INDEX IF NOT EXISTS idx_ensaios_compactacao_codigo ON ensaios_compactacao(codigo);
CREATE INDEX IF NOT EXISTS idx_ensaios_compactacao_data ON ensaios_compactacao(data_amostra);
CREATE INDEX IF NOT EXISTS idx_ensaios_compactacao_created ON ensaios_compactacao(created_at);

-- Criar função para atualizar o timestamp updated_at
CREATE OR REPLACE FUNCTION update_ensaios_compactacao_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Criar trigger para atualizar updated_at automaticamente
DROP TRIGGER IF EXISTS trigger_update_ensaios_compactacao_updated_at ON ensaios_compactacao;
CREATE TRIGGER trigger_update_ensaios_compactacao_updated_at
    BEFORE UPDATE ON ensaios_compactacao
    FOR EACH ROW
    EXECUTE FUNCTION update_ensaios_compactacao_updated_at();

-- Função para calcular automaticamente as médias
CREATE OR REPLACE FUNCTION calcular_medias_ensaio_compactacao()
RETURNS TRIGGER AS $$
DECLARE
    total_densidade DECIMAL(10,3) := 0;
    total_humidade DECIMAL(5,2) := 0;
    total_grau_compactacao DECIMAL(5,2) := 0;
    num_pontos INTEGER := 0;
    ponto JSONB;
BEGIN
    -- Calcular médias dos pontos
    IF NEW.pontos IS NOT NULL AND jsonb_array_length(NEW.pontos) > 0 THEN
        FOR ponto IN SELECT * FROM jsonb_array_elements(NEW.pontos)
        LOOP
            total_densidade := total_densidade + COALESCE((ponto->>'densidadeSeca')::DECIMAL(10,3), 0);
            total_humidade := total_humidade + COALESCE((ponto->>'humidade')::DECIMAL(5,2), 0);
            total_grau_compactacao := total_grau_compactacao + COALESCE((ponto->>'grauCompactacao')::DECIMAL(5,2), 0);
            num_pontos := num_pontos + 1;
        END LOOP;
        
        IF num_pontos > 0 THEN
            NEW.densidade_seca_media := ROUND(total_densidade / num_pontos, 3);
            NEW.humidade_media := ROUND(total_humidade / num_pontos, 2);
            NEW.grau_compactacao_medio := ROUND(total_grau_compactacao / num_pontos, 2);
        END IF;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Criar trigger para calcular médias automaticamente
DROP TRIGGER IF EXISTS trigger_calcular_medias_ensaio_compactacao ON ensaios_compactacao;
CREATE TRIGGER trigger_calcular_medias_ensaio_compactacao
    BEFORE INSERT OR UPDATE ON ensaios_compactacao
    FOR EACH ROW
    EXECUTE FUNCTION calcular_medias_ensaio_compactacao();

-- Configurar RLS (Row Level Security)
ALTER TABLE ensaios_compactacao ENABLE ROW LEVEL SECURITY;

-- Política para permitir acesso total aos usuários autenticados
CREATE POLICY "Usuários autenticados podem gerenciar ensaios de compactação" ON ensaios_compactacao
    FOR ALL USING (auth.role() = 'authenticated');

-- Inserir dados de exemplo (opcional)
INSERT INTO ensaios_compactacao (
    obra, 
    localizacao, 
    elemento, 
    numero_ensaio, 
    codigo, 
    data_amostra, 
    densidade_maxima_referencia, 
    humidade_otima_referencia,
    referencia_laboratorio_externo,
    observacoes
) VALUES 
(
    'Obra Exemplo 1',
    'PK 0+000 a PK 0+100',
    'Aterro',
    'EC-2024-001',
    'EC001',
    '2024-01-15',
    2.150,
    8.5,
    'LAB-REF-001/2024',
    'Ensaio de compactação realizado conforme especificações'
),
(
    'Obra Exemplo 2',
    'PK 0+100 a PK 0+200',
    'Sub-base',
    'EC-2024-002',
    'EC002',
    '2024-01-16',
    2.200,
    7.8,
    'LAB-REF-002/2024',
    'Ensaio realizado em condições normais de temperatura'
);

-- Adicionar pontos de exemplo ao primeiro ensaio
UPDATE ensaios_compactacao 
SET pontos = '[
    {"numero": 1, "densidadeSeca": 2.145, "humidade": 8.2, "grauCompactacao": 99.8},
    {"numero": 2, "densidadeSeca": 2.148, "humidade": 8.4, "grauCompactacao": 99.9},
    {"numero": 3, "densidadeSeca": 2.152, "humidade": 8.6, "grauCompactacao": 100.1},
    {"numero": 4, "densidadeSeca": 2.149, "humidade": 8.3, "grauCompactacao": 99.9},
    {"numero": 5, "densidadeSeca": 2.151, "humidade": 8.5, "grauCompactacao": 100.0}
]'::jsonb
WHERE numero_ensaio = 'EC-2024-001';

-- Adicionar pontos de exemplo ao segundo ensaio
UPDATE ensaios_compactacao 
SET pontos = '[
    {"numero": 1, "densidadeSeca": 2.195, "humidade": 7.5, "grauCompactacao": 99.8},
    {"numero": 2, "densidadeSeca": 2.198, "humidade": 7.7, "grauCompactacao": 99.9},
    {"numero": 3, "densidadeSeca": 2.202, "humidade": 7.9, "grauCompactacao": 100.1},
    {"numero": 4, "densidadeSeca": 2.199, "humidade": 7.6, "grauCompactacao": 99.9},
    {"numero": 5, "densidadeSeca": 2.201, "humidade": 7.8, "grauCompactacao": 100.0}
]'::jsonb
WHERE numero_ensaio = 'EC-2024-002';

-- Verificar se a tabela foi criada corretamente
SELECT 
    'Tabela ensaios_compactacao criada com sucesso!' as status,
    COUNT(*) as total_ensaios
FROM ensaios_compactacao; 