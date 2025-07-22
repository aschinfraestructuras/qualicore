-- =====================================================
-- VERIFICAÇÃO DE PROBLEMAS NOS MÓDULOS
-- =====================================================
-- Execute este script no SQL Editor do Supabase

-- 1. VERIFICAR ESTRUTURA DAS TABELAS
-- =====================================================

-- Verificar se todas as tabelas existem
SELECT 
    table_name,
    CASE 
        WHEN table_name IS NOT NULL THEN '✅ Existe'
        ELSE '❌ Não existe'
    END as status
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('obras', 'fornecedores', 'materiais', 'ensaios', 'checklists', 'documentos', 'nao_conformidades', 'rfis')
ORDER BY table_name;

-- 2. VERIFICAR CAMPOS OBRIGATÓRIOS
-- =====================================================

-- Verificar campos NOT NULL em obras
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'obras'
AND is_nullable = 'NO'
ORDER BY column_name;

-- 3. VERIFICAR POLÍTICAS RLS
-- =====================================================

-- Verificar se RLS está habilitado
SELECT 
    schemaname,
    tablename,
    rowsecurity as rls_enabled
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('obras', 'fornecedores', 'materiais', 'ensaios', 'checklists', 'documentos', 'nao_conformidades', 'rfis')
ORDER BY tablename;

-- Verificar políticas RLS existentes
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual
FROM pg_policies 
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- 4. VERIFICAR DADOS NAS TABELAS
-- =====================================================

-- Contar registros em cada tabela
SELECT 
    'obras' as tabela,
    COUNT(*) as total_registros
FROM obras
UNION ALL
SELECT 
    'fornecedores' as tabela,
    COUNT(*) as total_registros
FROM fornecedores
UNION ALL
SELECT 
    'materiais' as tabela,
    COUNT(*) as total_registros
FROM materiais
UNION ALL
SELECT 
    'ensaios' as tabela,
    COUNT(*) as total_registros
FROM ensaios
UNION ALL
SELECT 
    'checklists' as tabela,
    COUNT(*) as total_registros
FROM checklists
UNION ALL
SELECT 
    'documentos' as tabela,
    COUNT(*) as total_registros
FROM documentos
UNION ALL
SELECT 
    'nao_conformidades' as tabela,
    COUNT(*) as total_registros
FROM nao_conformidades
UNION ALL
SELECT 
    'rfis' as tabela,
    COUNT(*) as total_registros
FROM rfis
ORDER BY tabela;

-- 5. VERIFICAR PROBLEMAS ESPECÍFICOS
-- =====================================================

-- Verificar se há problemas com campos JSONB
SELECT 
    column_name,
    data_type,
    udt_name
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'obras'
AND data_type = 'USER-DEFINED'
ORDER BY column_name;

-- Verificar constraints únicas
SELECT 
    tc.table_name,
    tc.constraint_name,
    tc.constraint_type,
    kcu.column_name
FROM information_schema.table_constraints tc
JOIN information_schema.key_column_usage kcu 
    ON tc.constraint_name = kcu.constraint_name
WHERE tc.table_schema = 'public' 
AND tc.table_name IN ('obras', 'fornecedores', 'materiais', 'ensaios', 'checklists', 'documentos', 'nao_conformidades', 'rfis')
AND tc.constraint_type = 'UNIQUE'
ORDER BY tc.table_name, tc.constraint_name;

-- 6. VERIFICAR ÍNDICES
-- =====================================================

-- Verificar índices existentes
SELECT 
    tablename,
    indexname,
    indexdef
FROM pg_indexes 
WHERE schemaname = 'public'
AND tablename IN ('obras', 'fornecedores', 'materiais', 'ensaios', 'checklists', 'documentos', 'nao_conformidades', 'rfis')
ORDER BY tablename, indexname; 