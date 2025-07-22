-- =====================================================
-- CONVERSÃO FINAL - NÃO CONFORMIDADES
-- =====================================================
-- Execute este script no SQL Editor do Supabase
-- Este script converte os campos de text[] para JSONB de forma segura

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

-- 2. CONVERTER CAMPOS DE FORMA SEGURA
-- =====================================================

-- Converter anexos_evidencia
DO $$
BEGIN
    -- Remover valor padrão se existir
    BEGIN
        ALTER TABLE nao_conformidades ALTER COLUMN anexos_evidencia DROP DEFAULT;
    EXCEPTION WHEN OTHERS THEN
        -- Ignorar erro
    END;
    
    -- Converter para JSONB usando método seguro
    ALTER TABLE nao_conformidades 
    ALTER COLUMN anexos_evidencia TYPE jsonb 
    USING COALESCE(to_jsonb(anexos_evidencia), '[]'::jsonb);
    
    RAISE NOTICE 'anexos_evidencia convertido para JSONB';
END $$;

-- Converter anexos_corretiva
DO $$
BEGIN
    -- Remover valor padrão se existir
    BEGIN
        ALTER TABLE nao_conformidades ALTER COLUMN anexos_corretiva DROP DEFAULT;
    EXCEPTION WHEN OTHERS THEN
        -- Ignorar erro
    END;
    
    -- Converter para JSONB usando método seguro
    ALTER TABLE nao_conformidades 
    ALTER COLUMN anexos_corretiva TYPE jsonb 
    USING COALESCE(to_jsonb(anexos_corretiva), '[]'::jsonb);
    
    RAISE NOTICE 'anexos_corretiva convertido para JSONB';
END $$;

-- Converter anexos_verificacao
DO $$
BEGIN
    -- Remover valor padrão se existir
    BEGIN
        ALTER TABLE nao_conformidades ALTER COLUMN anexos_verificacao DROP DEFAULT;
    EXCEPTION WHEN OTHERS THEN
        -- Ignorar erro
    END;
    
    -- Converter para JSONB usando método seguro
    ALTER TABLE nao_conformidades 
    ALTER COLUMN anexos_verificacao TYPE jsonb 
    USING COALESCE(to_jsonb(anexos_verificacao), '[]'::jsonb);
    
    RAISE NOTICE 'anexos_verificacao convertido para JSONB';
END $$;

-- 3. ADICIONAR CAMPO DOCUMENTS SE NÃO EXISTIR
-- =====================================================

ALTER TABLE nao_conformidades ADD COLUMN IF NOT EXISTS documents JSONB;

-- 4. DEFINIR VALORES PADRÃO CORRETOS
-- =====================================================

-- Definir valores padrão para JSONB
ALTER TABLE nao_conformidades ALTER COLUMN anexos_evidencia SET DEFAULT '[]'::jsonb;
ALTER TABLE nao_conformidades ALTER COLUMN anexos_corretiva SET DEFAULT '[]'::jsonb;
ALTER TABLE nao_conformidades ALTER COLUMN anexos_verificacao SET DEFAULT '[]'::jsonb;
ALTER TABLE nao_conformidades ALTER COLUMN anexos SET DEFAULT '[]'::jsonb;
ALTER TABLE nao_conformidades ALTER COLUMN documents SET DEFAULT '[]'::jsonb;

-- 5. VERIFICAR RESULTADO
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