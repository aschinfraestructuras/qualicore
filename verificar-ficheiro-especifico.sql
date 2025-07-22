-- =====================================================
-- VERIFICAR FICHEIRO ESPECÍFICO: Relatorio-Fotografico-Modelo
-- =====================================================
-- Execute este script no SQL Editor do Supabase
-- Este script verifica o ficheiro específico que está a dar erro 404

-- 1. VERIFICAR SE O FICHEIRO EXISTE NO STORAGE
-- =====================================================

-- Procurar o ficheiro específico no bucket 'documents'
SELECT 
    'PROCURAR FICHEIRO ESPECÍFICO' as verificação,
    name,
    id,
    updated_at,
    CASE 
        WHEN name LIKE '%Relatorio-Fotografico-Modelo%' THEN '✅ ENCONTRADO!'
        ELSE '❌ Não é este'
    END as encontrado
FROM storage.objects 
WHERE bucket_id = 'documents'
AND (
    name LIKE '%Relatorio-Fotografico-Modelo%' OR
    name LIKE '%355904872%' OR
    name LIKE '%1752831504413%'
)
ORDER BY updated_at DESC;

-- 2. VERIFICAR TODOS OS FICHEIROS NO BUCKET
-- =====================================================

-- Listar todos os ficheiros no bucket 'documents'
SELECT 
    'TODOS OS FICHEIROS NO BUCKET' as verificação,
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
LIMIT 20;

-- 3. VERIFICAR SE O FICHEIRO ESTÁ REFERENCIADO NAS TABELAS
-- =====================================================

-- Procurar o ficheiro na tabela ensaios
SELECT 
    'PROCURAR NA TABELA ENSAIOS' as verificação,
    id,
    codigo,
    documents,
    CASE 
        WHEN documents::text LIKE '%Relatorio-Fotografico-Modelo%' THEN '✅ ENCONTRADO!'
        WHEN documents::text LIKE '%355904872%' THEN '✅ ENCONTRADO!'
        WHEN documents::text LIKE '%1752831504413%' THEN '✅ ENCONTRADO!'
        ELSE '❌ Não encontrado'
    END as encontrado
FROM ensaios 
WHERE documents IS NOT NULL 
AND (
    documents::text LIKE '%Relatorio-Fotografico-Modelo%' OR
    documents::text LIKE '%355904872%' OR
    documents::text LIKE '%1752831504413%'
);

-- 4. VERIFICAR O ENSAIO ESPECÍFICO
-- =====================================================

-- Verificar o ensaio com ID específico
SELECT 
    'VERIFICAR ENSAIO ESPECÍFICO' as verificação,
    id,
    codigo,
    tipo,
    documents,
    CASE 
        WHEN documents IS NOT NULL AND jsonb_array_length(documents) > 0 THEN '✅ Tem documentos'
        ELSE '❌ Sem documentos'
    END as status_documentos
FROM ensaios 
WHERE id = '50c5d440-b91a-45ce-9506-6b59ff390fa7';

-- 5. VERIFICAR SE O BUCKET ESTÁ CONFIGURADO CORRETAMENTE
-- =====================================================

-- Verificar configuração do bucket
SELECT 
    'CONFIGURAÇÃO DO BUCKET' as verificação,
    id,
    name,
    public,
    file_size_limit,
    CASE 
        WHEN public THEN '✅ Público - Deve funcionar'
        ELSE '❌ Privado - Pode causar erro 404'
    END as status_publico
FROM storage.buckets 
WHERE name = 'documents';

-- 6. VERIFICAR POLÍTICAS DE STORAGE
-- =====================================================

-- Verificar políticas para o bucket 'documents'
SELECT 
    'POLÍTICAS DE STORAGE' as verificação,
    policyname,
    cmd,
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

-- 7. TESTE: CRIAR UM FICHEIRO DE TESTE
-- =====================================================

-- Verificar se conseguimos criar um ficheiro de teste
SELECT 
    'TESTE: CRIAR FICHEIRO' as verificação,
    CASE 
        WHEN EXISTS (
            SELECT 1 FROM storage.objects 
            WHERE bucket_id = 'documents' 
            AND name = 'teste/documento-teste.txt'
        ) THEN '✅ Ficheiro de teste existe'
        ELSE '❌ Ficheiro de teste não existe'
    END as status_teste;

-- 8. DIAGNÓSTICO FINAL
-- =====================================================

SELECT 
    'DIAGNÓSTICO FINAL' as verificação,
    CASE 
        WHEN EXISTS (SELECT 1 FROM storage.buckets WHERE name = 'documents' AND public = true)
        AND EXISTS (SELECT 1 FROM storage.objects WHERE bucket_id = 'documents')
        THEN '✅ BUCKET OK - O ficheiro pode ter sido removido ou nunca foi carregado'
        WHEN EXISTS (SELECT 1 FROM storage.buckets WHERE name = 'documents' AND public = false)
        THEN '❌ BUCKET PRIVADO - Este é o problema!'
        WHEN NOT EXISTS (SELECT 1 FROM storage.buckets WHERE name = 'documents')
        THEN '❌ BUCKET NÃO EXISTE - Este é o problema!'
        ELSE '❓ PROBLEMA DESCONHECIDO'
    END as diagnostico; 