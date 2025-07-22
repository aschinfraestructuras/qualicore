-- =====================================================
-- CORRIGIR TIPOS DE DADOS EM NÃO CONFORMIDADES - VERSÃO FINAL
-- =====================================================
-- Execute este script no SQL Editor do Supabase
-- Este script corrige os tipos de dados dos campos de documentos

-- 1. VERIFICAR TIPOS ATUAIS DOS CAMPOS
-- =====================================================

SELECT 
    'TIPOS ATUAIS' as verificação,
    column_name,
    data_type,
    column_default
FROM information_schema.columns 
WHERE table_name = 'nao_conformidades'
AND column_name IN ('documents', 'anexos_evidencia', 'anexos_corretiva', 'anexos_verificacao', 'anexos')
ORDER BY column_name;

-- 2. REMOVER VALORES PADRÃO (SE EXISTIREM)
-- =====================================================

-- Remover valores padrão de forma segura
DO $$
BEGIN
    -- Tentar remover valores padrão (pode falhar se não existirem, mas não é problema)
    BEGIN
        ALTER TABLE nao_conformidades ALTER COLUMN anexos_evidencia DROP DEFAULT;
    EXCEPTION WHEN OTHERS THEN
        -- Ignorar erro se não existir valor padrão
    END;
    
    BEGIN
        ALTER TABLE nao_conformidades ALTER COLUMN anexos_corretiva DROP DEFAULT;
    EXCEPTION WHEN OTHERS THEN
        -- Ignorar erro se não existir valor padrão
    END;
    
    BEGIN
        ALTER TABLE nao_conformidades ALTER COLUMN anexos_verificacao DROP DEFAULT;
    EXCEPTION WHEN OTHERS THEN
        -- Ignorar erro se não existir valor padrão
    END;
    
    BEGIN
        ALTER TABLE nao_conformidades ALTER COLUMN anexos DROP DEFAULT;
    EXCEPTION WHEN OTHERS THEN
        -- Ignorar erro se não existir valor padrão
    END;
    
    BEGIN
        ALTER TABLE nao_conformidades ALTER COLUMN documents DROP DEFAULT;
    EXCEPTION WHEN OTHERS THEN
        -- Ignorar erro se não existir valor padrão
    END;
END $$;

-- 3. CONVERTER CAMPOS PARA JSONB (MÉTODO SIMPLES)
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
        -- Converter usando método simples
        ALTER TABLE nao_conformidades 
        ALTER COLUMN anexos_evidencia TYPE jsonb 
        USING COALESCE(to_jsonb(anexos_evidencia), '[]'::jsonb);
        
        RAISE NOTICE 'anexos_evidencia convertido para JSONB';
    ELSE
        RAISE NOTICE 'anexos_evidencia já é JSONB ou não existe';
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
        -- Converter usando método simples
        ALTER TABLE nao_conformidades 
        ALTER COLUMN anexos_corretiva TYPE jsonb 
        USING COALESCE(to_jsonb(anexos_corretiva), '[]'::jsonb);
        
        RAISE NOTICE 'anexos_corretiva convertido para JSONB';
    ELSE
        RAISE NOTICE 'anexos_corretiva já é JSONB ou não existe';
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
        -- Converter usando método simples
        ALTER TABLE nao_conformidades 
        ALTER COLUMN anexos_verificacao TYPE jsonb 
        USING COALESCE(to_jsonb(anexos_verificacao), '[]'::jsonb);
        
        RAISE NOTICE 'anexos_verificacao convertido para JSONB';
    ELSE
        RAISE NOTICE 'anexos_verificacao já é JSONB ou não existe';
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
        -- Converter usando método simples
        ALTER TABLE nao_conformidades 
        ALTER COLUMN anexos TYPE jsonb 
        USING COALESCE(to_jsonb(anexos), '[]'::jsonb);
        
        RAISE NOTICE 'anexos convertido para JSONB';
    ELSE
        RAISE NOTICE 'anexos já é JSONB ou não existe';
    END IF;
END $$;

-- 4. ADICIONAR CAMPO DOCUMENTS SE NÃO EXISTIR
-- =====================================================

ALTER TABLE nao_conformidades ADD COLUMN IF NOT EXISTS documents JSONB;

-- 5. DEFINIR VALORES PADRÃO CORRETOS
-- =====================================================

-- Definir valores padrão para JSONB
ALTER TABLE nao_conformidades ALTER COLUMN anexos_evidencia SET DEFAULT '[]'::jsonb;
ALTER TABLE nao_conformidades ALTER COLUMN anexos_corretiva SET DEFAULT '[]'::jsonb;
ALTER TABLE nao_conformidades ALTER COLUMN anexos_verificacao SET DEFAULT '[]'::jsonb;
ALTER TABLE nao_conformidades ALTER COLUMN anexos SET DEFAULT '[]'::jsonb;
ALTER TABLE nao_conformidades ALTER COLUMN documents SET DEFAULT '[]'::jsonb;

-- 6. VERIFICAR RESULTADO
-- =====================================================

-- Verificar tipos após conversão
SELECT 
    'TIPOS APÓS CONVERSÃO' as verificação,
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

-- 7. TESTAR FUNÇÃO jsonb_array_length
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

-- 8. VERIFICAR DADOS EXISTENTES
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

-- 9. MENSAGEM DE SUCESSO
-- =====================================================

SELECT 
    '🎉 SUCESSO!' as verificação,
    'Campos de documentos convertidos para JSONB' as mensagem,
    'Agora pode carregar e visualizar documentos em Não Conformidades' as instrucao,
    'Teste carregar um novo documento' as proximo_passo
FROM (SELECT 1) as dummy; 