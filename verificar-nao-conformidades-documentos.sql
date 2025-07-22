-- =====================================================
-- VERIFICAR DOCUMENTOS EM NÃO CONFORMIDADES
-- =====================================================
-- Execute este script no SQL Editor do Supabase
-- Este script verifica especificamente o problema dos documentos em Não Conformidades

-- 1. VERIFICAR ESTRUTURA DA TABELA NÃO CONFORMIDADES
-- =====================================================

-- Verificar todas as colunas da tabela nao_conformidades
SELECT 
    'ESTRUTURA TABELA NÃO CONFORMIDADES' as verificação,
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'nao_conformidades'
ORDER BY ordinal_position;

-- 2. VERIFICAR SE OS CAMPOS DE DOCUMENTOS EXISTEM
-- =====================================================

-- Verificar campos específicos de documentos
SELECT 
    'CAMPOS DE DOCUMENTOS' as verificação,
    column_name,
    data_type,
    CASE 
        WHEN column_name IN ('documents', 'anexos_evidencia', 'anexos_corretiva', 'anexos_verificacao') THEN '✅ Campo de documento'
        ELSE '📋 Outro campo'
    END as tipo
FROM information_schema.columns 
WHERE table_name = 'nao_conformidades'
AND column_name IN ('documents', 'anexos_evidencia', 'anexos_corretiva', 'anexos_verificacao', 'anexos')
ORDER BY column_name;

-- 3. VERIFICAR DADOS DE NÃO CONFORMIDADES
-- =====================================================

-- Verificar se há dados e se têm documentos
SELECT 
    'DADOS DE NÃO CONFORMIDADES' as verificação,
    id,
    codigo,
    tipo,
    documents,
    anexos_evidencia,
    anexos_corretiva,
    anexos_verificacao,
    CASE 
        WHEN documents IS NOT NULL AND jsonb_array_length(documents) > 0 THEN '✅ Tem documents'
        WHEN anexos_evidencia IS NOT NULL AND jsonb_array_length(anexos_evidencia) > 0 THEN '✅ Tem anexos_evidencia'
        WHEN anexos_corretiva IS NOT NULL AND jsonb_array_length(anexos_corretiva) > 0 THEN '✅ Tem anexos_corretiva'
        WHEN anexos_verificacao IS NOT NULL AND jsonb_array_length(anexos_verificacao) > 0 THEN '✅ Tem anexos_verificacao'
        ELSE '❌ Sem documentos'
    END as status_documentos
FROM nao_conformidades 
ORDER BY created_at DESC
LIMIT 5;

-- 4. VERIFICAR SE HÁ FICHEIROS NO STORAGE PARA NÃO CONFORMIDADES
-- =====================================================

-- Procurar ficheiros de não conformidades no storage
SELECT 
    'FICHEIROS NO STORAGE' as verificação,
    name,
    id,
    updated_at,
    CASE 
        WHEN name LIKE '%nao_conformidade%' THEN '📋 Não Conformidade'
        WHEN name LIKE '%nc%' THEN '📋 NC'
        WHEN name LIKE '%evidencia%' THEN '📋 Evidência'
        WHEN name LIKE '%corretiva%' THEN '📋 Corretiva'
        WHEN name LIKE '%verificacao%' THEN '📋 Verificação'
        ELSE '❓ Outro'
    END as tipo
FROM storage.objects 
WHERE bucket_id = 'documents'
AND (
    name LIKE '%nao_conformidade%' OR
    name LIKE '%nc%' OR
    name LIKE '%evidencia%' OR
    name LIKE '%corretiva%' OR
    name LIKE '%verificacao%'
)
ORDER BY updated_at DESC
LIMIT 10;

-- 5. VERIFICAR CONFIGURAÇÃO DO BUCKET
-- =====================================================

-- Verificar se o bucket está configurado corretamente
SELECT 
    'CONFIGURAÇÃO DO BUCKET' as verificação,
    id,
    name,
    public,
    file_size_limit,
    CASE 
        WHEN public THEN '✅ Público - Deve funcionar'
        ELSE '❌ Privado - ESTE É O PROBLEMA!'
    END as status_publico
FROM storage.buckets 
WHERE name = 'documents';

-- 6. VERIFICAR POLÍTICAS DE STORAGE
-- =====================================================

-- Verificar políticas para o bucket documents
SELECT 
    'POLÍTICAS DE STORAGE' as verificação,
    policyname,
    cmd,
    qual,
    CASE 
        WHEN cmd = 'SELECT' THEN '✅ Visualizar'
        WHEN cmd = 'INSERT' THEN '✅ Upload'
        WHEN cmd = 'UPDATE' THEN '✅ Atualizar'
        WHEN cmd = 'DELETE' THEN '✅ Remover'
        WHEN cmd = 'ALL' THEN '✅ Todas as ações'
        ELSE '❓ Outro'
    END as tipo_acao
FROM pg_policies 
WHERE schemaname = 'storage'
AND tablename = 'objects'
AND qual LIKE '%documents%'
ORDER BY cmd;

-- 7. DIAGNÓSTICO ESPECÍFICO PARA NÃO CONFORMIDADES
-- =====================================================

-- Diagnóstico baseado nos resultados anteriores
SELECT 
    'DIAGNÓSTICO NÃO CONFORMIDADES' as verificação,
    CASE 
        WHEN NOT EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_name = 'nao_conformidades' 
            AND column_name IN ('documents', 'anexos_evidencia', 'anexos_corretiva', 'anexos_verificacao')
        ) THEN '❌ CAMPOS NÃO EXISTEM - Execute script para adicionar campos'
        WHEN EXISTS (
            SELECT 1 FROM storage.buckets 
            WHERE name = 'documents' AND public = false
        ) THEN '❌ BUCKET PRIVADO - Execute script para tornar público'
        WHEN NOT EXISTS (
            SELECT 1 FROM pg_policies 
            WHERE schemaname = 'storage' AND tablename = 'objects'
        ) THEN '❌ POLÍTICAS NÃO CONFIGURADAS - Execute script para configurar'
        WHEN EXISTS (
            SELECT 1 FROM nao_conformidades 
            WHERE documents IS NOT NULL AND jsonb_array_length(documents) > 0
        ) THEN '✅ DADOS EXISTEM - Pode ser problema de frontend'
        ELSE '❓ PROBLEMA DESCONHECIDO - Verificar logs'
    END as diagnostico;

-- 8. SOLUÇÃO RECOMENDADA
-- =====================================================

SELECT 
    'SOLUÇÃO RECOMENDADA' as verificação,
    CASE 
        WHEN NOT EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_name = 'nao_conformidades' 
            AND column_name IN ('documents', 'anexos_evidencia', 'anexos_corretiva', 'anexos_verificacao')
        ) THEN '🔧 Execute: ADICIONAR CAMPOS DE DOCUMENTOS'
        WHEN EXISTS (
            SELECT 1 FROM storage.buckets 
            WHERE name = 'documents' AND public = false
        ) THEN '🔧 Execute: TORNAR BUCKET PÚBLICO'
        WHEN NOT EXISTS (
            SELECT 1 FROM pg_policies 
            WHERE schemaname = 'storage' AND tablename = 'objects'
        ) THEN '🔧 Execute: CONFIGURAR POLÍTICAS'
        ELSE '🔧 Execute: VERIFICAR FRONTEND E LOGS'
    END as acao_recomendada; 