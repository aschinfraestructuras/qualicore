-- =====================================================
-- ADICIONAR CAMPOS DE DOCUMENTOS EM TODOS OS MÓDULOS
-- =====================================================
-- Execute este script no SQL Editor do Supabase
-- Este script adiciona campos de documentos em todos os módulos

-- 1. VERIFICAR E ADICIONAR CAMPOS DE DOCUMENTOS
-- =====================================================

-- Função para adicionar coluna se não existir
CREATE OR REPLACE FUNCTION add_column_if_not_exists(
    p_table_name text,
    p_column_name text,
    p_column_type text,
    p_default_value text DEFAULT NULL
) RETURNS void AS $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = p_table_name 
        AND column_name = p_column_name
    ) THEN
        EXECUTE format('ALTER TABLE %I ADD COLUMN %I %s', p_table_name, p_column_name, p_column_type);
        IF p_default_value IS NOT NULL THEN
            EXECUTE format('ALTER TABLE %I ALTER COLUMN %I SET DEFAULT %s', p_table_name, p_column_name, p_default_value);
        END IF;
        RAISE NOTICE 'Coluna % adicionada à tabela %', p_column_name, p_table_name;
    ELSE
        RAISE NOTICE 'Coluna % já existe na tabela %', p_column_name, p_table_name;
    END IF;
END;
$$ LANGUAGE plpgsql;

-- 2. ADICIONAR CAMPOS DE DOCUMENTOS EM TODAS AS TABELAS
-- =====================================================

-- Obras
SELECT add_column_if_not_exists('obras', 'documents', 'JSONB', '[]');
SELECT add_column_if_not_exists('obras', 'anexos_principais', 'JSONB', '[]');
SELECT add_column_if_not_exists('obras', 'anexos_apendices', 'JSONB', '[]');
SELECT add_column_if_not_exists('obras', 'anexos_revisoes', 'JSONB', '[]');

-- Fornecedores
SELECT add_column_if_not_exists('fornecedores', 'documents', 'JSONB', '[]');
SELECT add_column_if_not_exists('fornecedores', 'anexos', 'JSONB', '[]');

-- Materiais
SELECT add_column_if_not_exists('materiais', 'documents', 'JSONB', '[]');
SELECT add_column_if_not_exists('materiais', 'anexos', 'JSONB', '[]');

-- Checklists
SELECT add_column_if_not_exists('checklists', 'documents', 'JSONB', '[]');
SELECT add_column_if_not_exists('checklists', 'anexos_gerais', 'JSONB', '[]');

-- Documentos
SELECT add_column_if_not_exists('documentos', 'documents', 'JSONB', '[]');
SELECT add_column_if_not_exists('documentos', 'anexos_principal', 'JSONB', '[]');
SELECT add_column_if_not_exists('documentos', 'anexos_apendices', 'JSONB', '[]');
SELECT add_column_if_not_exists('documentos', 'anexos_revisoes', 'JSONB', '[]');

-- Não Conformidades
SELECT add_column_if_not_exists('nao_conformidades', 'documents', 'JSONB', '[]');
SELECT add_column_if_not_exists('nao_conformidades', 'anexos_evidencia', 'JSONB', '[]');
SELECT add_column_if_not_exists('nao_conformidades', 'anexos_corretiva', 'JSONB', '[]');
SELECT add_column_if_not_exists('nao_conformidades', 'anexos_verificacao', 'JSONB', '[]');

-- RFIs
SELECT add_column_if_not_exists('rfis', 'documents', 'JSONB', '[]');
SELECT add_column_if_not_exists('rfis', 'anexos', 'JSONB', '[]');

-- Ensaios (já deve existir, mas vamos garantir)
SELECT add_column_if_not_exists('ensaios', 'documents', 'JSONB', '[]');

-- Ensaios de Compactação (já deve existir, mas vamos garantir)
SELECT add_column_if_not_exists('ensaios_compactacao', 'documents', 'JSONB', '[]');

-- 3. VERIFICAR SE OS CAMPOS FORAM ADICIONADOS
-- =====================================================

-- Mostrar todas as colunas de documentos nas tabelas
SELECT 
    table_name,
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name IN (
    'obras', 
    'fornecedores', 
    'materiais', 
    'checklists', 
    'documentos', 
    'nao_conformidades', 
    'rfis',
    'ensaios',
    'ensaios_compactacao'
)
AND column_name IN (
    'documents', 
    'anexos', 
    'anexos_principais',
    'anexos_apendices',
    'anexos_revisoes',
    'anexos_gerais',
    'anexos_principal',
    'anexos_evidencia',
    'anexos_corretiva',
    'anexos_verificacao'
)
ORDER BY table_name, column_name;

-- 4. MENSAGEM DE CONFIRMAÇÃO
-- =====================================================
SELECT '✅ Campos de documentos adicionados em todos os módulos!' as status; 