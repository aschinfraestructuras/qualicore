-- =====================================================
-- VERIFICAR ESTRUTURA DA TABELA ZONAS
-- =====================================================
-- Execute este script no SQL Editor do Supabase

-- 1. VERIFICAR ESTRUTURA DA TABELA ZONAS
-- =====================================================

-- Verificar todas as colunas da tabela zonas
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default,
    character_maximum_length
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'zonas'
ORDER BY ordinal_position;

-- 2. VERIFICAR SE A TABELA TEM DADOS
-- =====================================================

SELECT COUNT(*) as total_registros FROM zonas;

-- 3. VERIFICAR SE TEM RELACIONAMENTOS
-- =====================================================

-- Verificar foreign keys
SELECT 
    tc.table_name,
    kcu.column_name,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints AS tc 
JOIN information_schema.key_column_usage AS kcu
    ON tc.constraint_name = kcu.constraint_name
    AND tc.table_schema = kcu.table_schema
JOIN information_schema.constraint_column_usage AS ccu
    ON ccu.constraint_name = tc.constraint_name
    AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY' 
AND tc.table_name = 'zonas';

-- 4. VERIFICAR SE TEM ÍNDICES
-- =====================================================

SELECT 
    indexname,
    indexdef
FROM pg_indexes 
WHERE schemaname = 'public'
AND tablename = 'zonas'
ORDER BY indexname;

-- 5. VERIFICAR SE RLS ESTÁ HABILITADO
-- =====================================================

SELECT 
    schemaname,
    tablename,
    rowsecurity as rls_enabled
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename = 'zonas'; 