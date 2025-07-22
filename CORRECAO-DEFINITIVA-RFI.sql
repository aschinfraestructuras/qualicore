-- =====================================================
-- CORREÇÃO DEFINITIVA: RFI com Documentos
-- =====================================================
-- Execute este script no SQL Editor do Supabase
-- Este script resolve TODOS os problemas do RFI

-- 1. VERIFICAR E CORRIGIR TABELA RFI
-- =====================================================

-- Verificar estrutura da tabela
SELECT 
    'ESTRUTURA TABELA RFI' as verificação,
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'rfis'
ORDER BY ordinal_position;

-- 2. GARANTIR QUE O CAMPO documents EXISTE
-- =====================================================

-- Adicionar campo documents se não existir
ALTER TABLE rfis ADD COLUMN IF NOT EXISTS documents JSONB DEFAULT '[]'::jsonb;

-- Verificar se foi adicionado
SELECT 
    'CAMPO DOCUMENTS' as verificação,
    CASE 
        WHEN EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_name = 'rfis' AND column_name = 'documents'
        ) THEN '✅ Campo documents existe'
        ELSE '❌ Campo documents NÃO existe'
    END as status;

-- 3. LIMPAR DADOS INVÁLIDOS
-- =====================================================

-- Limpar documentos inválidos
UPDATE rfis 
SET documents = '[]'::jsonb 
WHERE documents IS NULL OR documents = 'null'::jsonb;

-- Verificar quantos registos foram limpos
SELECT 
    'DADOS LIMPOS' as verificação,
    COUNT(*) as registos_limpos
FROM rfis 
WHERE documents = '[]'::jsonb;

-- 4. CRIAR RFI DE TESTE PERFEITO
-- =====================================================

-- Remover RFI de teste anterior se existir
DELETE FROM rfis WHERE codigo = 'RFI-TESTE-001';

-- Criar RFI de teste com documentos válidos
INSERT INTO rfis (
    codigo,
    numero,
    titulo,
    descricao,
    solicitante,
    destinatario,
    data_solicitacao,
    prioridade,
    status,
    impacto_custo,
    impacto_prazo,
    observacoes,
    documents
) VALUES (
    'RFI-TESTE-001',
    'RFI-TESTE-001',
    'RFI de Teste com Documentos',
    'Este é um RFI de teste para verificar se o campo documents funciona corretamente',
    'Teste',
    'Teste',
    '2025-01-27',
    'media',
    'pendente',
    100,
    10,
    'Observações de teste',
    '[
        {
            "id": "ensaio/temp_1706361600000/documento1.pdf",
            "name": "documento1.pdf",
            "url": "https://mjgvjpqcdsmvervcxjig.supabase.co/storage/v1/object/public/documents/ensaio/temp_1706361600000/documento1.pdf",
            "type": "application/pdf",
            "size": 1024,
            "uploaded_at": "2025-01-27T10:00:00Z"
        },
        {
            "id": "ensaio/temp_1706361600000/documento2.jpg",
            "name": "documento2.jpg",
            "url": "https://mjgvjpqcdsmvervcxjig.supabase.co/storage/v1/object/public/documents/ensaio/temp_1706361600000/documento2.jpg",
            "type": "image/jpeg",
            "size": 2048,
            "uploaded_at": "2025-01-27T10:01:00Z"
        }
    ]'::jsonb
);

-- 5. VERIFICAR RFI DE TESTE
-- =====================================================

SELECT 
    'RFI TESTE CRIADO' as verificação,
    id,
    codigo,
    titulo,
    documents,
    jsonb_array_length(documents) as num_documents,
    CASE 
        WHEN jsonb_array_length(documents) = 2 THEN '✅ PERFEITO - 2 documentos'
        WHEN jsonb_array_length(documents) > 0 THEN '⚠️ OK - Tem documentos'
        ELSE '❌ PROBLEMA - Sem documentos'
    END as resultado
FROM rfis 
WHERE codigo = 'RFI-TESTE-001';

-- 6. VERIFICAR TODOS OS RFIs
-- =====================================================

SELECT 
    'TODOS OS RFIs' as verificação,
    COUNT(*) as total_rfis,
    COUNT(CASE WHEN documents IS NOT NULL AND documents != '[]'::jsonb THEN 1 END) as com_documentos,
    COUNT(CASE WHEN documents IS NULL OR documents = '[]'::jsonb THEN 1 END) as sem_documentos
FROM rfis;

-- 7. VERIFICAR STORAGE
-- =====================================================

-- Verificar bucket documents
SELECT 
    'BUCKET DOCUMENTS' as verificação,
    id,
    name,
    public,
    CASE 
        WHEN public THEN '✅ PÚBLICO - Documentos acessíveis'
        ELSE '❌ PRIVADO - Pode causar problemas'
    END as status
FROM storage.buckets 
WHERE name = 'documents';

-- 8. VERIFICAR POLÍTICAS
-- =====================================================

SELECT 
    'POLÍTICAS STORAGE' as verificação,
    COUNT(*) as total_politicas,
    CASE 
        WHEN COUNT(*) >= 1 THEN '✅ Políticas configuradas'
        ELSE '❌ Sem políticas'
    END as status
FROM pg_policies 
WHERE schemaname = 'storage'
AND tablename = 'objects';

-- 9. MENSAGEM FINAL
-- =====================================================

SELECT 
    '🎉 CORREÇÃO DEFINITIVA CONCLUÍDA!' as resultado,
    'RFI-TESTE-001 criado com 2 documentos' as teste,
    'Campo documents configurado' as campo,
    'Storage verificado' as storage,
    'Teste agora na aplicação' as proximo_passo
FROM (SELECT 1) as dummy; 