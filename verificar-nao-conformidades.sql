-- =====================================================
-- VERIFICAR ESTRUTURA DA TABELA NAO_CONFORMIDADES
-- =====================================================
-- Execute este script no SQL Editor do Supabase

-- 1. VERIFICAR ESTRUTURA DA TABELA
-- =====================================================

-- Verificar todas as colunas da tabela nao_conformidades
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default,
    character_maximum_length
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'nao_conformidades'
ORDER BY ordinal_position;

-- 2. VERIFICAR CAMPOS OBRIGATÓRIOS (NOT NULL)
-- =====================================================

SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'nao_conformidades'
AND is_nullable = 'NO'
ORDER BY column_name;

-- 3. VERIFICAR SE RLS ESTÁ HABILITADO
-- =====================================================

SELECT 
    schemaname,
    tablename,
    rowsecurity as rls_enabled
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename = 'nao_conformidades';

-- 4. VERIFICAR POLÍTICAS RLS
-- =====================================================

SELECT 
    schemaname,
    tablename,
    policyname,
    cmd,
    qual
FROM pg_policies 
WHERE schemaname = 'public'
AND tablename = 'nao_conformidades'
ORDER BY policyname;

-- 5. VERIFICAR DADOS EXISTENTES
-- =====================================================

SELECT COUNT(*) as total_registros FROM nao_conformidades;

-- 6. VERIFICAR CONSTRAINTS
-- =====================================================

SELECT 
    tc.constraint_name,
    tc.constraint_type,
    kcu.column_name,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints tc
JOIN information_schema.key_column_usage kcu 
    ON tc.constraint_name = kcu.constraint_name
LEFT JOIN information_schema.constraint_column_usage ccu 
    ON ccu.constraint_name = tc.constraint_name
WHERE tc.table_schema = 'public' 
AND tc.table_name = 'nao_conformidades'
ORDER BY tc.constraint_type, tc.constraint_name;

-- 7. VERIFICAR ÍNDICES
-- =====================================================

SELECT 
    indexname,
    indexdef
FROM pg_indexes 
WHERE schemaname = 'public'
AND tablename = 'nao_conformidades'
ORDER BY indexname; 