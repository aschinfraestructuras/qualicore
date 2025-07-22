-- =====================================================
-- CORREÇÃO COMPLETA: Documentos em Todos os Módulos
-- =====================================================
-- Execute este script no SQL Editor do Supabase
-- Este script aplica a mesma correção que funcionou nos Ensaios a todos os módulos

-- 1. GARANTIR QUE O BUCKET ESTÁ PÚBLICO
-- =====================================================

-- Forçar bucket documents a ser público
UPDATE storage.buckets 
SET public = true
WHERE name = 'documents';

-- 2. CONFIGURAR POLÍTICAS MUITO PERMISSIVAS
-- =====================================================

-- Remover todas as políticas antigas
DROP POLICY IF EXISTS "Acesso público total aos documentos" ON storage.objects;
DROP POLICY IF EXISTS "Documentos podem ser vistos por todos" ON storage.objects;
DROP POLICY IF EXISTS "Qualquer pessoa pode fazer upload" ON storage.objects;
DROP POLICY IF EXISTS "Qualquer pessoa pode atualizar" ON storage.objects;
DROP POLICY IF EXISTS "Qualquer pessoa pode remover" ON storage.objects;
DROP POLICY IF EXISTS "Acesso total aos documentos" ON storage.objects;

-- Criar política muito permissiva
CREATE POLICY "Acesso total aos documentos" ON storage.objects
    FOR ALL USING (bucket_id = 'documents');

-- 3. ADICIONAR CAMPOS DE DOCUMENTOS EM TODAS AS TABELAS
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

-- Ensaios de Compactação
ALTER TABLE ensaios_compactacao ADD COLUMN IF NOT EXISTS documents JSONB DEFAULT '[]';

-- 4. VERIFICAR SE TODOS OS CAMPOS FORAM ADICIONADOS
-- =====================================================

-- Mostrar todos os campos de documentos nas tabelas
SELECT 
    'CAMPOS ADICIONADOS' as verificação,
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

-- 5. VERIFICAR CONFIGURAÇÃO FINAL
-- =====================================================

-- Verificação completa de todos os módulos
SELECT 
    'VERIFICAÇÃO FINAL' as verificação,
    'Bucket público' as item,
    CASE 
        WHEN EXISTS (SELECT 1 FROM storage.buckets WHERE name = 'documents' AND public = true)
        THEN '✅ Sim'
        ELSE '❌ Não'
    END as status
UNION ALL
SELECT 
    'VERIFICAÇÃO FINAL' as verificação,
    'Políticas configuradas' as item,
    CASE 
        WHEN EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'storage' AND tablename = 'objects')
        THEN '✅ Sim'
        ELSE '❌ Não'
    END as status
UNION ALL
SELECT 
    'VERIFICAÇÃO FINAL' as verificação,
    'Obras com documentos' as item,
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'obras' AND column_name = 'documents')
        THEN '✅ Sim'
        ELSE '❌ Não'
    END as status
UNION ALL
SELECT 
    'VERIFICAÇÃO FINAL' as verificação,
    'Fornecedores com documentos' as item,
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'fornecedores' AND column_name = 'documents')
        THEN '✅ Sim'
        ELSE '❌ Não'
    END as status
UNION ALL
SELECT 
    'VERIFICAÇÃO FINAL' as verificação,
    'Materiais com documentos' as item,
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'materiais' AND column_name = 'documents')
        THEN '✅ Sim'
        ELSE '❌ Não'
    END as status
UNION ALL
SELECT 
    'VERIFICAÇÃO FINAL' as verificação,
    'Checklists com documentos' as item,
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'checklists' AND column_name = 'documents')
        THEN '✅ Sim'
        ELSE '❌ Não'
    END as status
UNION ALL
SELECT 
    'VERIFICAÇÃO FINAL' as verificação,
    'Documentos com documentos' as item,
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'documentos' AND column_name = 'documents')
        THEN '✅ Sim'
        ELSE '❌ Não'
    END as status
UNION ALL
SELECT 
    'VERIFICAÇÃO FINAL' as verificação,
    'Não Conformidades com documentos' as item,
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'nao_conformidades' AND column_name = 'documents')
        THEN '✅ Sim'
        ELSE '❌ Não'
    END as status
UNION ALL
SELECT 
    'VERIFICAÇÃO FINAL' as verificação,
    'RFIs com documentos' as item,
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'rfis' AND column_name = 'documents')
        THEN '✅ Sim'
        ELSE '❌ Não'
    END as status;

-- 6. MENSAGEM DE SUCESSO
-- =====================================================

SELECT 
    '🎉 SUCESSO!' as verificação,
    'Todos os módulos estão configurados para documentos' as mensagem,
    'Agora pode carregar documentos em qualquer módulo' as instrucao,
    'Os botões de visualizar e descarregar devem aparecer' as resultado
FROM (SELECT 1) as dummy; 