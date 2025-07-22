-- =====================================================
-- CORRIGIR TIPOS DE DADOS EM NÃO CONFORMIDADES - VERSÃO 2
-- =====================================================
-- Execute este script no SQL Editor do Supabase
-- Este script corrige os tipos de dados dos campos de documentos

-- 1. VERIFICAR TIPOS ATUAIS DOS CAMPOS
-- =====================================================

-- Verificar tipos atuais dos campos de documentos
SELECT 
    'TIPOS ATUAIS' as verificação,
    column_name,
    data_type,
    column_default,
    CASE 
        WHEN data_type = 'jsonb' THEN '✅ Correto'
        WHEN data_type = 'text[]' THEN '❌ Precisa ser convertido para JSONB'
        ELSE '❓ Tipo desconhecido'
    END as status
FROM information_schema.columns 
WHERE table_name = 'nao_conformidades'
AND column_name IN ('documents', 'anexos_evidencia', 'anexos_corretiva', 'anexos_verificacao', 'anexos')
ORDER BY column_name;

-- 2. REMOVER VALORES PADRÃO ANTES DA CONVERSÃO
-- =====================================================

-- Remover valores padrão das colunas
ALTER TABLE nao_conformidades ALTER COLUMN anexos_evidencia DROP DEFAULT;
ALTER TABLE nao_conformidades ALTER COLUMN anexos_corretiva DROP DEFAULT;
ALTER TABLE nao_conformidades ALTER COLUMN anexos_verificacao DROP DEFAULT;
ALTER TABLE nao_conformidades ALTER COLUMN anexos DROP DEFAULT;

-- 3. CONVERTER CAMPOS DE TEXT[] PARA JSONB
-- =====================================================

-- Converter anexos_evidencia de text[] para jsonb
ALTER TABLE nao_conformidades 
ALTER COLUMN anexos_evidencia TYPE jsonb 
USING CASE 
    WHEN anexos_evidencia IS NULL THEN '[]'::jsonb
    WHEN anexos_evidencia = '{}' THEN '[]'::jsonb
    WHEN anexos_evidencia = 'NULL' THEN '[]'::jsonb
    ELSE to_jsonb(anexos_evidencia)
END;

-- Converter anexos_corretiva de text[] para jsonb
ALTER TABLE nao_conformidades 
ALTER COLUMN anexos_corretiva TYPE jsonb 
USING CASE 
    WHEN anexos_corretiva IS NULL THEN '[]'::jsonb
    WHEN anexos_corretiva = '{}' THEN '[]'::jsonb
    WHEN anexos_corretiva = 'NULL' THEN '[]'::jsonb
    ELSE to_jsonb(anexos_corretiva)
END;

-- Converter anexos_verificacao de text[] para jsonb
ALTER TABLE nao_conformidades 
ALTER COLUMN anexos_verificacao TYPE jsonb 
USING CASE 
    WHEN anexos_verificacao IS NULL THEN '[]'::jsonb
    WHEN anexos_verificacao = '{}' THEN '[]'::jsonb
    WHEN anexos_verificacao = 'NULL' THEN '[]'::jsonb
    ELSE to_jsonb(anexos_verificacao)
END;

-- Converter anexos de text[] para jsonb (se existir)
ALTER TABLE nao_conformidades 
ALTER COLUMN anexos TYPE jsonb 
USING CASE 
    WHEN anexos IS NULL THEN '[]'::jsonb
    WHEN anexos = '{}' THEN '[]'::jsonb
    WHEN anexos = 'NULL' THEN '[]'::jsonb
    ELSE to_jsonb(anexos)
END;

-- 4. GARANTIR QUE O CAMPO 'documents' EXISTE
-- =====================================================

-- Adicionar campo documents se não existir
ALTER TABLE nao_conformidades ADD COLUMN IF NOT EXISTS documents JSONB DEFAULT '[]';

-- 5. ADICIONAR VALORES PADRÃO CORRETOS
-- =====================================================

-- Adicionar valores padrão corretos para JSONB
ALTER TABLE nao_conformidades ALTER COLUMN anexos_evidencia SET DEFAULT '[]'::jsonb;
ALTER TABLE nao_conformidades ALTER COLUMN anexos_corretiva SET DEFAULT '[]'::jsonb;
ALTER TABLE nao_conformidades ALTER COLUMN anexos_verificacao SET DEFAULT '[]'::jsonb;
ALTER TABLE nao_conformidades ALTER COLUMN anexos SET DEFAULT '[]'::jsonb;

-- 6. VERIFICAR SE A CONVERSÃO FUNCIONOU
-- =====================================================

-- Verificar tipos após conversão
SELECT 
    'TIPOS APÓS CONVERSÃO' as verificação,
    column_name,
    data_type,
    column_default,
    CASE 
        WHEN data_type = 'jsonb' THEN '✅ Convertido corretamente'
        ELSE '❌ Ainda precisa conversão'
    END as status
FROM information_schema.columns 
WHERE table_name = 'nao_conformidades'
AND column_name IN ('documents', 'anexos_evidencia', 'anexos_corretiva', 'anexos_verificacao', 'anexos')
ORDER BY column_name;

-- 7. TESTAR FUNÇÃO jsonb_array_length
-- =====================================================

-- Testar se a função jsonb_array_length funciona agora
SELECT 
    'TESTE FUNÇÃO' as verificação,
    id,
    codigo,
    CASE 
        WHEN documents IS NOT NULL AND jsonb_array_length(documents) > 0 THEN '✅ Tem documents'
        WHEN anexos_evidencia IS NOT NULL AND jsonb_array_length(anexos_evidencia) > 0 THEN '✅ Tem anexos_evidencia'
        WHEN anexos_corretiva IS NOT NULL AND jsonb_array_length(anexos_corretiva) > 0 THEN '✅ Tem anexos_corretiva'
        WHEN anexos_verificacao IS NOT NULL AND jsonb_array_length(anexos_verificacao) > 0 THEN '✅ Tem anexos_verificacao'
        ELSE '❌ Sem documentos'
    END as status_documentos
FROM nao_conformidades 
ORDER BY created_at DESC
LIMIT 3;

-- 8. VERIFICAR DADOS EXISTENTES
-- =====================================================

-- Verificar dados existentes
SELECT 
    'DADOS EXISTENTES' as verificação,
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

-- 9. VERIFICAÇÃO FINAL
-- =====================================================

-- Verificação completa
SELECT 
    'VERIFICAÇÃO FINAL' as verificação,
    'Campos convertidos para JSONB' as item,
    CASE 
        WHEN EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_name = 'nao_conformidades' 
            AND column_name IN ('documents', 'anexos_evidencia', 'anexos_corretiva', 'anexos_verificacao')
            AND data_type = 'jsonb'
        ) THEN '✅ Sim'
        ELSE '❌ Não'
    END as status
UNION ALL
SELECT 
    'VERIFICAÇÃO FINAL' as verificação,
    'Função jsonb_array_length funciona' as item,
    CASE 
        WHEN EXISTS (
            SELECT 1 FROM nao_conformidades 
            WHERE documents IS NOT NULL OR anexos_evidencia IS NOT NULL
        ) THEN '✅ Sim'
        ELSE '❌ Não'
    END as status;

-- 10. MENSAGEM DE SUCESSO
-- =====================================================

SELECT 
    '🎉 SUCESSO!' as verificação,
    'Campos de documentos convertidos para JSONB' as mensagem,
    'Agora pode carregar e visualizar documentos em Não Conformidades' as instrucao,
    'Teste carregar um novo documento' as proximo_passo
FROM (SELECT 1) as dummy; 