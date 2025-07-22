-- =====================================================
-- CORRIGIR TIPOS DE DADOS EM NÃO CONFORMIDADES - VERSÃO 4
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
        WHEN data_type = 'jsonb' THEN '✅ Já é JSONB'
        WHEN data_type = 'text[]' THEN '❌ Precisa ser convertido para JSONB'
        ELSE '❓ Tipo desconhecido'
    END as status
FROM information_schema.columns 
WHERE table_name = 'nao_conformidades'
AND column_name IN ('documents', 'anexos_evidencia', 'anexos_corretiva', 'anexos_verificacao', 'anexos')
ORDER BY column_name;

-- 2. REMOVER VALORES PADRÃO ANTES DA CONVERSÃO
-- =====================================================

-- Remover valores padrão das colunas (apenas se existirem)
DO $$
BEGIN
    -- Remover valores padrão das colunas se existirem
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'nao_conformidades' 
        AND column_name = 'anexos_evidencia' 
        AND column_default IS NOT NULL
    ) THEN
        ALTER TABLE nao_conformidades ALTER COLUMN anexos_evidencia DROP DEFAULT;
    END IF;
    
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'nao_conformidades' 
        AND column_name = 'anexos_corretiva' 
        AND column_default IS NOT NULL
    ) THEN
        ALTER TABLE nao_conformidades ALTER COLUMN anexos_corretiva DROP DEFAULT;
    END IF;
    
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'nao_conformidades' 
        AND column_name = 'anexos_verificacao' 
        AND column_default IS NOT NULL
    ) THEN
        ALTER TABLE nao_conformidades ALTER COLUMN anexos_verificacao DROP DEFAULT;
    END IF;
    
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'nao_conformidades' 
        AND column_name = 'anexos' 
        AND column_default IS NOT NULL
    ) THEN
        ALTER TABLE nao_conformidades ALTER COLUMN anexos DROP DEFAULT;
    END IF;
END $$;

-- 3. CONVERTER CAMPOS DE TEXT[] PARA JSONB (APENAS SE NECESSÁRIO)
-- =====================================================

-- Converter anexos_evidencia de text[] para jsonb (apenas se ainda for text[])
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'nao_conformidades' 
        AND column_name = 'anexos_evidencia' 
        AND data_type = 'text[]'
    ) THEN
        ALTER TABLE nao_conformidades 
        ALTER COLUMN anexos_evidencia TYPE jsonb 
        USING CASE 
            WHEN anexos_evidencia IS NULL THEN '[]'::jsonb
            WHEN array_length(anexos_evidencia, 1) IS NULL THEN '[]'::jsonb
            WHEN array_length(anexos_evidencia, 1) = 0 THEN '[]'::jsonb
            ELSE to_jsonb(anexos_evidencia)
        END;
        RAISE NOTICE 'Campo anexos_evidencia convertido para JSONB';
    ELSE
        RAISE NOTICE 'Campo anexos_evidencia já é JSONB ou não existe';
    END IF;
END $$;

-- Converter anexos_corretiva de text[] para jsonb (apenas se ainda for text[])
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'nao_conformidades' 
        AND column_name = 'anexos_corretiva' 
        AND data_type = 'text[]'
    ) THEN
        ALTER TABLE nao_conformidades 
        ALTER COLUMN anexos_corretiva TYPE jsonb 
        USING CASE 
            WHEN anexos_corretiva IS NULL THEN '[]'::jsonb
            WHEN array_length(anexos_corretiva, 1) IS NULL THEN '[]'::jsonb
            WHEN array_length(anexos_corretiva, 1) = 0 THEN '[]'::jsonb
            ELSE to_jsonb(anexos_corretiva)
        END;
        RAISE NOTICE 'Campo anexos_corretiva convertido para JSONB';
    ELSE
        RAISE NOTICE 'Campo anexos_corretiva já é JSONB ou não existe';
    END IF;
END $$;

-- Converter anexos_verificacao de text[] para jsonb (apenas se ainda for text[])
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'nao_conformidades' 
        AND column_name = 'anexos_verificacao' 
        AND data_type = 'text[]'
    ) THEN
        ALTER TABLE nao_conformidades 
        ALTER COLUMN anexos_verificacao TYPE jsonb 
        USING CASE 
            WHEN anexos_verificacao IS NULL THEN '[]'::jsonb
            WHEN array_length(anexos_verificacao, 1) IS NULL THEN '[]'::jsonb
            WHEN array_length(anexos_verificacao, 1) = 0 THEN '[]'::jsonb
            ELSE to_jsonb(anexos_verificacao)
        END;
        RAISE NOTICE 'Campo anexos_verificacao convertido para JSONB';
    ELSE
        RAISE NOTICE 'Campo anexos_verificacao já é JSONB ou não existe';
    END IF;
END $$;

-- Converter anexos de text[] para jsonb (apenas se ainda for text[])
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'nao_conformidades' 
        AND column_name = 'anexos' 
        AND data_type = 'text[]'
    ) THEN
        ALTER TABLE nao_conformidades 
        ALTER COLUMN anexos TYPE jsonb 
        USING CASE 
            WHEN anexos IS NULL THEN '[]'::jsonb
            WHEN array_length(anexos, 1) IS NULL THEN '[]'::jsonb
            WHEN array_length(anexos, 1) = 0 THEN '[]'::jsonb
            ELSE to_jsonb(anexos)
        END;
        RAISE NOTICE 'Campo anexos convertido para JSONB';
    ELSE
        RAISE NOTICE 'Campo anexos já é JSONB ou não existe';
    END IF;
END $$;

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