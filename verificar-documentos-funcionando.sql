-- =====================================================
-- VERIFICAÇÃO: Documentos e Botões Funcionando
-- =====================================================
-- Execute este script no SQL Editor do Supabase
-- Este script verifica se tudo está configurado corretamente

-- 1. VERIFICAR BUCKET DE DOCUMENTOS
-- =====================================================
SELECT 
    'BUCKET DOCUMENTS' as verificação,
    CASE 
        WHEN EXISTS (SELECT 1 FROM storage.buckets WHERE name = 'documents') 
        THEN '✅ Bucket documents existe'
        ELSE '❌ Bucket documents NÃO existe'
    END as status;

-- Verificar configuração do bucket
SELECT 
    id,
    name,
    public,
    file_size_limit,
    CASE 
        WHEN public THEN '✅ Público (permite acesso)'
        ELSE '❌ Privado (pode causar problemas)'
    END as status_publico
FROM storage.buckets 
WHERE name = 'documents';

-- 2. VERIFICAR POLÍTICAS DE STORAGE
-- =====================================================
SELECT 
    'POLÍTICAS STORAGE' as verificação,
    COUNT(*) as total_politicas,
    CASE 
        WHEN COUNT(*) >= 4 THEN '✅ Políticas suficientes'
        ELSE '❌ Faltam políticas'
    END as status
FROM pg_policies 
WHERE schemaname = 'storage'
AND tablename = 'objects';

-- Mostrar políticas específicas
SELECT 
    policyname,
    cmd,
    CASE 
        WHEN cmd = 'SELECT' THEN '✅ Visualizar'
        WHEN cmd = 'INSERT' THEN '✅ Upload'
        WHEN cmd = 'UPDATE' THEN '✅ Atualizar'
        WHEN cmd = 'DELETE' THEN '✅ Remover'
        ELSE '❓ Outro'
    END as tipo_acao
FROM pg_policies 
WHERE schemaname = 'storage'
AND tablename = 'objects'
ORDER BY cmd;

-- 3. VERIFICAR CAMPOS DE DOCUMENTOS NAS TABELAS
-- =====================================================
SELECT 
    'CAMPOS DOCUMENTOS' as verificação,
    COUNT(*) as total_campos,
    CASE 
        WHEN COUNT(*) >= 8 THEN '✅ Campos suficientes'
        ELSE '❌ Faltam campos'
    END as status
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
);

-- Mostrar campos por tabela
SELECT 
    table_name,
    STRING_AGG(column_name, ', ') as campos_documentos,
    COUNT(*) as total_campos
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
GROUP BY table_name
ORDER BY table_name;

-- 4. VERIFICAR POLÍTICAS RLS NAS TABELAS
-- =====================================================
SELECT 
    'POLÍTICAS RLS' as verificação,
    COUNT(*) as total_politicas,
    CASE 
        WHEN COUNT(*) >= 32 THEN '✅ Políticas suficientes'
        ELSE '❌ Faltam políticas'
    END as status
FROM pg_policies 
WHERE schemaname = 'public'
AND tablename IN (
    'obras', 
    'fornecedores', 
    'materiais', 
    'checklists', 
    'documentos', 
    'nao_conformidades', 
    'rfis',
    'ensaios',
    'ensaios_compactacao'
);

-- Mostrar políticas por tabela
SELECT 
    tablename,
    COUNT(*) as politicas,
    CASE 
        WHEN COUNT(*) >= 4 THEN '✅ Completo'
        ELSE '❌ Incompleto'
    END as status
FROM pg_policies 
WHERE schemaname = 'public'
AND tablename IN (
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
GROUP BY tablename
ORDER BY tablename;

-- 5. VERIFICAR SE HÁ DADOS DE TESTE
-- =====================================================
SELECT 
    'DADOS DE TESTE' as verificação,
    COUNT(*) as total_registos,
    CASE 
        WHEN COUNT(*) > 0 THEN '✅ Há dados para testar'
        ELSE '❌ Não há dados para testar'
    END as status
FROM (
    SELECT COUNT(*) as cnt FROM obras UNION ALL
    SELECT COUNT(*) FROM fornecedores UNION ALL
    SELECT COUNT(*) FROM materiais UNION ALL
    SELECT COUNT(*) FROM checklists UNION ALL
    SELECT COUNT(*) FROM documentos UNION ALL
    SELECT COUNT(*) FROM nao_conformidades UNION ALL
    SELECT COUNT(*) FROM rfis UNION ALL
    SELECT COUNT(*) FROM ensaios UNION ALL
    SELECT COUNT(*) FROM ensaios_compactacao
) as counts;

-- Mostrar contagem por tabela
SELECT 
    'obras' as tabela,
    COUNT(*) as registos
FROM obras
UNION ALL
SELECT 
    'fornecedores' as tabela,
    COUNT(*) as registos
FROM fornecedores
UNION ALL
SELECT 
    'materiais' as tabela,
    COUNT(*) as registos
FROM materiais
UNION ALL
SELECT 
    'checklists' as tabela,
    COUNT(*) as registos
FROM checklists
UNION ALL
SELECT 
    'documentos' as tabela,
    COUNT(*) as registos
FROM documentos
UNION ALL
SELECT 
    'nao_conformidades' as tabela,
    COUNT(*) as registos
FROM nao_conformidades
UNION ALL
SELECT 
    'rfis' as tabela,
    COUNT(*) as registos
FROM rfis
UNION ALL
SELECT 
    'ensaios' as tabela,
    COUNT(*) as registos
FROM ensaios
UNION ALL
SELECT 
    'ensaios_compactacao' as tabela,
    COUNT(*) as registos
FROM ensaios_compactacao
ORDER BY registos DESC;

-- 6. RESUMO FINAL
-- =====================================================
SELECT 
    'RESUMO FINAL' as verificação,
    CASE 
        WHEN EXISTS (SELECT 1 FROM storage.buckets WHERE name = 'documents' AND public = true)
        AND EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'storage' AND tablename = 'objects')
        AND EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'ensaios' AND column_name = 'documents')
        THEN '✅ TUDO CONFIGURADO CORRETAMENTE!'
        ELSE '❌ AINDA HÁ PROBLEMAS PARA RESOLVER'
    END as status_final; 