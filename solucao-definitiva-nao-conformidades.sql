-- =====================================================
-- SOLUÇÃO DEFINITIVA - NÃO CONFORMIDADES
-- =====================================================
-- Execute este script no SQL Editor do Supabase
-- Abordagem completamente nova: converter primeiro, definir padrões depois

-- 1. VERIFICAR ESTADO ATUAL
-- =====================================================

SELECT 
    'ESTADO ATUAL' as verificação,
    column_name,
    data_type,
    column_default
FROM information_schema.columns 
WHERE table_name = 'nao_conformidades'
AND column_name IN ('documents', 'anexos_evidencia', 'anexos_corretiva', 'anexos_verificacao', 'anexos')
ORDER BY column_name;

-- 2. CONVERTER CAMPOS PARA JSONB (SEM VALORES PADRÃO)
-- =====================================================

-- Converter anexos_evidencia
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'nao_conformidades' 
        AND column_name = 'anexos_evidencia' 
        AND data_type = 'text[]'
    ) THEN
        -- Remover valor padrão primeiro
        BEGIN
            ALTER TABLE nao_conformidades ALTER COLUMN anexos_evidencia DROP DEFAULT;
        EXCEPTION WHEN OTHERS THEN
            -- Ignorar se não existir
        END;
        
        -- Converter para JSONB
        ALTER TABLE nao_conformidades 
        ALTER COLUMN anexos_evidencia TYPE jsonb 
        USING COALESCE(to_jsonb(anexos_evidencia), '[]'::jsonb);
        
        RAISE NOTICE 'anexos_evidencia: text[] -> JSONB';
    ELSE
        RAISE NOTICE 'anexos_evidencia: já é JSONB';
    END IF;
END $$;

-- Converter anexos_corretiva
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'nao_conformidades' 
        AND column_name = 'anexos_corretiva' 
        AND data_type = 'text[]'
    ) THEN
        -- Remover valor padrão primeiro
        BEGIN
            ALTER TABLE nao_conformidades ALTER COLUMN anexos_corretiva DROP DEFAULT;
        EXCEPTION WHEN OTHERS THEN
            -- Ignorar se não existir
        END;
        
        -- Converter para JSONB
        ALTER TABLE nao_conformidades 
        ALTER COLUMN anexos_corretiva TYPE jsonb 
        USING COALESCE(to_jsonb(anexos_corretiva), '[]'::jsonb);
        
        RAISE NOTICE 'anexos_corretiva: text[] -> JSONB';
    ELSE
        RAISE NOTICE 'anexos_corretiva: já é JSONB';
    END IF;
END $$;

-- Converter anexos_verificacao
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'nao_conformidades' 
        AND column_name = 'anexos_verificacao' 
        AND data_type = 'text[]'
    ) THEN
        -- Remover valor padrão primeiro
        BEGIN
            ALTER TABLE nao_conformidades ALTER COLUMN anexos_verificacao DROP DEFAULT;
        EXCEPTION WHEN OTHERS THEN
            -- Ignorar se não existir
        END;
        
        -- Converter para JSONB
        ALTER TABLE nao_conformidades 
        ALTER COLUMN anexos_verificacao TYPE jsonb 
        USING COALESCE(to_jsonb(anexos_verificacao), '[]'::jsonb);
        
        RAISE NOTICE 'anexos_verificacao: text[] -> JSONB';
    ELSE
        RAISE NOTICE 'anexos_verificacao: já é JSONB';
    END IF;
END $$;

-- Converter anexos
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'nao_conformidades' 
        AND column_name = 'anexos' 
        AND data_type = 'text[]'
    ) THEN
        -- Remover valor padrão primeiro
        BEGIN
            ALTER TABLE nao_conformidades ALTER COLUMN anexos DROP DEFAULT;
        EXCEPTION WHEN OTHERS THEN
            -- Ignorar se não existir
        END;
        
        -- Converter para JSONB
        ALTER TABLE nao_conformidades 
        ALTER COLUMN anexos TYPE jsonb 
        USING COALESCE(to_jsonb(anexos), '[]'::jsonb);
        
        RAISE NOTICE 'anexos: text[] -> JSONB';
    ELSE
        RAISE NOTICE 'anexos: já é JSONB';
    END IF;
END $$;

-- 3. ADICIONAR CAMPO DOCUMENTS
-- =====================================================

-- Adicionar campo documents se não existir
ALTER TABLE nao_conformidades ADD COLUMN IF NOT EXISTS documents JSONB;

-- 4. AGORA DEFINIR VALORES PADRÃO (APÓS CONVERSÃO)
-- =====================================================

-- Definir valores padrão para JSONB (apenas após conversão)
DO $$
BEGIN
    -- Verificar se anexos_evidencia é JSONB e definir padrão
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'nao_conformidades' 
        AND column_name = 'anexos_evidencia' 
        AND data_type = 'jsonb'
    ) THEN
        ALTER TABLE nao_conformidades ALTER COLUMN anexos_evidencia SET DEFAULT '[]'::jsonb;
        RAISE NOTICE 'Padrão definido: anexos_evidencia = []';
    END IF;
    
    -- Verificar se anexos_corretiva é JSONB e definir padrão
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'nao_conformidades' 
        AND column_name = 'anexos_corretiva' 
        AND data_type = 'jsonb'
    ) THEN
        ALTER TABLE nao_conformidades ALTER COLUMN anexos_corretiva SET DEFAULT '[]'::jsonb;
        RAISE NOTICE 'Padrão definido: anexos_corretiva = []';
    END IF;
    
    -- Verificar se anexos_verificacao é JSONB e definir padrão
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'nao_conformidades' 
        AND column_name = 'anexos_verificacao' 
        AND data_type = 'jsonb'
    ) THEN
        ALTER TABLE nao_conformidades ALTER COLUMN anexos_verificacao SET DEFAULT '[]'::jsonb;
        RAISE NOTICE 'Padrão definido: anexos_verificacao = []';
    END IF;
    
    -- Verificar se anexos é JSONB e definir padrão
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'nao_conformidades' 
        AND column_name = 'anexos' 
        AND data_type = 'jsonb'
    ) THEN
        ALTER TABLE nao_conformidades ALTER COLUMN anexos SET DEFAULT '[]'::jsonb;
        RAISE NOTICE 'Padrão definido: anexos = []';
    END IF;
    
    -- Verificar se documents é JSONB e definir padrão
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'nao_conformidades' 
        AND column_name = 'documents' 
        AND data_type = 'jsonb'
    ) THEN
        ALTER TABLE nao_conformidades ALTER COLUMN documents SET DEFAULT '[]'::jsonb;
        RAISE NOTICE 'Padrão definido: documents = []';
    END IF;
END $$;

-- 5. VERIFICAR RESULTADO FINAL
-- =====================================================

-- Verificar tipos após conversão
SELECT 
    'RESULTADO FINAL' as verificação,
    column_name,
    data_type,
    column_default,
    CASE 
        WHEN data_type = 'jsonb' THEN '✅ JSONB'
        ELSE '❌ ' || data_type
    END as status
FROM information_schema.columns 
WHERE table_name = 'nao_conformidades'
AND column_name IN ('documents', 'anexos_evidencia', 'anexos_corretiva', 'anexos_verificacao', 'anexos')
ORDER BY column_name;

-- 6. TESTAR FUNÇÃO jsonb_array_length
-- =====================================================

-- Testar se a função jsonb_array_length funciona
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

-- 7. VERIFICAR DADOS EXISTENTES
-- =====================================================

-- Verificar dados existentes
SELECT 
    'DADOS EXISTENTES' as verificação,
    id,
    codigo,
    tipo,
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

-- 8. MENSAGEM DE SUCESSO
-- =====================================================

SELECT 
    '🎉 SUCESSO!' as verificação,
    'Campos convertidos para JSONB com sucesso' as mensagem,
    'Agora pode carregar e visualizar documentos' as instrucao,
    'Teste o módulo Não Conformidades' as proximo_passo
FROM (SELECT 1) as dummy; 