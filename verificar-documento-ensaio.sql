-- =====================================================
-- VERIFICAR DOCUMENTO ESPECÍFICO DO ENSAIO
-- =====================================================
-- Execute este script no SQL Editor do Supabase
-- Este script verifica o documento específico que está a dar erro 404

-- 1. VERIFICAR O DOCUMENTO NA TABELA ENSAIOS
-- =====================================================

-- Verificar o documento específico do ensaio
SELECT 
    'DOCUMENTO NA TABELA' as verificação,
    id,
    codigo,
    documents,
    CASE 
        WHEN documents IS NOT NULL AND jsonb_array_length(documents) > 0 THEN '✅ Tem documentos'
        ELSE '❌ Sem documentos'
    END as status
FROM ensaios 
WHERE id = '50c5d440-b91a-45ce-9506-6b59ff390fa7';

-- 2. EXTRAIR INFORMAÇÕES DO DOCUMENTO
-- =====================================================

-- Extrair detalhes do documento (se existir)
WITH documento_info AS (
    SELECT 
        id,
        codigo,
        documents,
        jsonb_array_elements(documents) as doc
    FROM ensaios 
    WHERE id = '50c5d440-b91a-45ce-9506-6b59ff390fa7'
    AND documents IS NOT NULL 
    AND jsonb_array_length(documents) > 0
)
SELECT 
    'DETALHES DO DOCUMENTO' as verificação,
    id as ensaio_id,
    codigo as ensaio_codigo,
    doc->>'id' as documento_id,
    doc->>'name' as documento_nome,
    doc->>'url' as documento_url,
    doc->>'type' as documento_tipo,
    doc->>'size' as documento_tamanho
FROM documento_info;

-- 3. VERIFICAR SE O FICHEIRO EXISTE NO STORAGE
-- =====================================================

-- Procurar o ficheiro específico no storage
SELECT 
    'PROCURAR NO STORAGE' as verificação,
    name,
    id,
    updated_at,
    CASE 
        WHEN name LIKE '%ensaio%' AND name LIKE '%50c5d440%' THEN '✅ ENCONTRADO!'
        WHEN name LIKE '%Relatorio-Fotografico%' THEN '✅ ENCONTRADO!'
        WHEN name LIKE '%355904872%' THEN '✅ ENCONTRADO!'
        WHEN name LIKE '%1752831504413%' THEN '✅ ENCONTRADO!'
        ELSE '❌ Não é este'
    END as encontrado
FROM storage.objects 
WHERE bucket_id = 'documents'
AND (
    name LIKE '%ensaio%' OR
    name LIKE '%50c5d440%' OR
    name LIKE '%Relatorio-Fotografico%' OR
    name LIKE '%355904872%' OR
    name LIKE '%1752831504413%'
)
ORDER BY updated_at DESC;

-- 4. VERIFICAR TODOS OS FICHEIROS NO BUCKET
-- =====================================================

-- Listar todos os ficheiros no bucket documents
SELECT 
    'TODOS OS FICHEIROS' as verificação,
    name,
    id,
    updated_at,
    CASE 
        WHEN name LIKE '%ensaio%' THEN '📋 Ensaio'
        WHEN name LIKE '%obra%' THEN '🏗️ Obra'
        WHEN name LIKE '%material%' THEN '📦 Material'
        WHEN name LIKE '%fornecedor%' THEN '🏢 Fornecedor'
        WHEN name LIKE '%documento%' THEN '📄 Documento'
        ELSE '❓ Outro'
    END as tipo
FROM storage.objects 
WHERE bucket_id = 'documents'
ORDER BY updated_at DESC
LIMIT 15;

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

-- 7. DIAGNÓSTICO DO PROBLEMA
-- =====================================================

-- Diagnóstico baseado nos resultados anteriores
SELECT 
    'DIAGNÓSTICO' as verificação,
    CASE 
        WHEN EXISTS (
            SELECT 1 FROM storage.buckets 
            WHERE name = 'documents' AND public = false
        ) THEN '❌ BUCKET PRIVADO - O ficheiro existe mas não é acessível'
        WHEN NOT EXISTS (
            SELECT 1 FROM storage.objects 
            WHERE bucket_id = 'documents' 
            AND name LIKE '%ensaio%'
        ) THEN '❌ FICHEIRO NÃO EXISTE - Foi removido ou nunca foi carregado'
        WHEN EXISTS (
            SELECT 1 FROM storage.buckets 
            WHERE name = 'documents' AND public = true
        ) AND EXISTS (
            SELECT 1 FROM storage.objects 
            WHERE bucket_id = 'documents' 
            AND name LIKE '%ensaio%'
        ) THEN '✅ FICHEIRO EXISTE E BUCKET PÚBLICO - Pode ser problema de URL'
        ELSE '❓ PROBLEMA DESCONHECIDO'
    END as diagnostico;

-- 8. SOLUÇÃO RECOMENDADA
-- =====================================================

SELECT 
    'SOLUÇÃO RECOMENDADA' as verificação,
    CASE 
        WHEN EXISTS (
            SELECT 1 FROM storage.buckets 
            WHERE name = 'documents' AND public = false
        ) THEN '🔧 Execute: ALTERAR BUCKET PARA PÚBLICO'
        WHEN NOT EXISTS (
            SELECT 1 FROM storage.objects 
            WHERE bucket_id = 'documents' 
            AND name LIKE '%ensaio%'
        ) THEN '🔧 Execute: REMOVER REFERÊNCIA INVÁLIDA E RECARREGAR DOCUMENTO'
        ELSE '🔧 Execute: VERIFICAR URL E POLÍTICAS'
    END as acao_recomendada; 