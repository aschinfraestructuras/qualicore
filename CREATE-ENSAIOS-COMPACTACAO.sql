-- Script para criar tabela de Ensaios de Compactação
-- Execute este script na Supabase SQL Editor

-- Criar tabela principal de Ensaios de Compactação
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
    pontos JSONB NOT NULL DEFAULT '[]',
    densidade_seca_media DECIMAL(10,3),
    humidade_media DECIMAL(5,2),
    grau_compactacao_medio DECIMAL(5,2),
    observacoes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_ensaios_compactacao_obra ON ensaios_compactacao(obra);
CREATE INDEX IF NOT EXISTS idx_ensaios_compactacao_localizacao ON ensaios_compactacao(localizacao);
CREATE INDEX IF NOT EXISTS idx_ensaios_compactacao_data ON ensaios_compactacao(data_amostra);
CREATE INDEX IF NOT EXISTS idx_ensaios_compactacao_codigo ON ensaios_compactacao(codigo);

-- Função para atualizar o timestamp de updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger para atualizar updated_at automaticamente
CREATE TRIGGER update_ensaios_compactacao_updated_at 
    BEFORE UPDATE ON ensaios_compactacao 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Função para calcular médias automaticamente
CREATE OR REPLACE FUNCTION calcular_medias_ensaio_compactacao()
RETURNS TRIGGER AS $$
DECLARE
    ponto RECORD;
    total_densidade DECIMAL(10,3) := 0;
    total_humidade DECIMAL(5,2) := 0;
    total_grau_compactacao DECIMAL(5,2) := 0;
    num_pontos INTEGER := 0;
BEGIN
    -- Calcular médias dos pontos
    FOR ponto IN SELECT * FROM jsonb_array_elements(NEW.pontos) AS p
    LOOP
        total_densidade := total_densidade + (ponto->>'densidadeSeca')::DECIMAL(10,3);
        total_humidade := total_humidade + (ponto->>'humidade')::DECIMAL(5,2);
        total_grau_compactacao := total_grau_compactacao + (ponto->>'grauCompactacao')::DECIMAL(5,2);
        num_pontos := num_pontos + 1;
    END LOOP;
    
    -- Calcular médias se há pontos
    IF num_pontos > 0 THEN
        NEW.densidade_seca_media := total_densidade / num_pontos;
        NEW.humidade_media := total_humidade / num_pontos;
        NEW.grau_compactacao_medio := total_grau_compactacao / num_pontos;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para calcular médias automaticamente
CREATE TRIGGER calcular_medias_ensaio_compactacao_trigger
    BEFORE INSERT OR UPDATE ON ensaios_compactacao
    FOR EACH ROW
    EXECUTE FUNCTION calcular_medias_ensaio_compactacao();

-- Habilitar RLS (Row Level Security)
ALTER TABLE ensaios_compactacao ENABLE ROW LEVEL SECURITY;

-- Política para permitir acesso autenticado
CREATE POLICY "Usuários autenticados podem gerenciar ensaios de compactação" ON ensaios_compactacao
    FOR ALL USING (auth.role() = 'authenticated');

-- Comentários para documentação
COMMENT ON TABLE ensaios_compactacao IS 'Tabela para armazenar ensaios de compactação (Proctor)';
COMMENT ON COLUMN ensaios_compactacao.pontos IS 'Array JSON com até 20 pontos de ensaio';
COMMENT ON COLUMN ensaios_compactacao.densidade_seca_media IS 'Média calculada automaticamente das densidades secas';
COMMENT ON COLUMN ensaios_compactacao.humidade_media IS 'Média calculada automaticamente das humidades';
COMMENT ON COLUMN ensaios_compactacao.grau_compactacao_medio IS 'Média calculada automaticamente dos graus de compactação'; 