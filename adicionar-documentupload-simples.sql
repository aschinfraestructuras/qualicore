-- =====================================================
-- ADICIONAR CAMPOS DE DOCUMENTOS - VERSÃO SIMPLES
-- =====================================================
-- Execute este script no SQL Editor do Supabase
-- Este script adiciona campos de documentos em todos os módulos

-- 1. ADICIONAR CAMPOS DE DOCUMENTOS EM TODAS AS TABELAS
-- =====================================================

-- Obras
ALTER TABLE obras ADD COLUMN IF NOT EXISTS documents JSONB DEFAULT '[]';
ALTER TABLE obras ADD COLUMN IF NOT EXISTS anexos_principais JSONB DEFAULT '[]';
ALTER TABLE obras ADD COLUMN IF NOT EXISTS anexos_apendices JSONB DEFAULT '[]';
ALTER TABLE obras ADD COLUMN IF NOT EXISTS anexos_revisoes JSONB DEFAULT '[]';

-- Fornecedores
ALTER TABLE fornecedores ADD COLUMN IF NOT EXISTS documents JSONB DEFAULT '[]';
ALTER TABLE fornecedores ADD COLUMN IF NOT EXISTS anexos JSONB DEFAULT '[]';

-- Materiais
ALTER TABLE materiais ADD COLUMN IF NOT EXISTS documents JSONB DEFAULT '[]';
ALTER TABLE materiais ADD COLUMN IF NOT EXISTS anexos JSONB DEFAULT '[]';

-- Checklists
ALTER TABLE checklists ADD COLUMN IF NOT EXISTS documents JSONB DEFAULT '[]';
ALTER TABLE checklists ADD COLUMN IF NOT EXISTS anexos_gerais JSONB DEFAULT '[]';

-- Documentos
ALTER TABLE documentos ADD COLUMN IF NOT EXISTS documents JSONB DEFAULT '[]';
ALTER TABLE documentos ADD COLUMN IF NOT EXISTS anexos_principal JSONB DEFAULT '[]';
ALTER TABLE documentos ADD COLUMN IF NOT EXISTS anexos_apendices JSONB DEFAULT '[]';
ALTER TABLE documentos ADD COLUMN IF NOT EXISTS anexos_revisoes JSONB DEFAULT '[]';

-- Não Conformidades
ALTER TABLE nao_conformidades ADD COLUMN IF NOT EXISTS documents JSONB DEFAULT '[]';
ALTER TABLE nao_conformidades ADD COLUMN IF NOT EXISTS anexos_evidencia JSONB DEFAULT '[]';
ALTER TABLE nao_conformidades ADD COLUMN IF NOT EXISTS anexos_corretiva JSONB DEFAULT '[]';
ALTER TABLE nao_conformidades ADD COLUMN IF NOT EXISTS anexos_verificacao JSONB DEFAULT '[]';

-- RFIs
ALTER TABLE rfis ADD COLUMN IF NOT EXISTS documents JSONB DEFAULT '[]';
ALTER TABLE rfis ADD COLUMN IF NOT EXISTS anexos JSONB DEFAULT '[]';

-- Ensaios (já deve existir, mas vamos garantir)
ALTER TABLE ensaios ADD COLUMN IF NOT EXISTS documents JSONB DEFAULT '[]';

-- Ensaios de Compactação (já deve existir, mas vamos garantir)
ALTER TABLE ensaios_compactacao ADD COLUMN IF NOT EXISTS documents JSONB DEFAULT '[]';

-- 2. VERIFICAR SE OS CAMPOS FORAM ADICIONADOS
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

-- 3. MENSAGEM DE CONFIRMAÇÃO
-- =====================================================
SELECT '✅ Campos de documentos adicionados em todos os módulos!' as status; 