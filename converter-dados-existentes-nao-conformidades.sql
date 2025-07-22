-- =====================================================
-- CONVERTER DADOS EXISTENTES - NÃO CONFORMIDADES
-- =====================================================
-- Execute este script no SQL Editor do Supabase
-- Este script converte os dados existentes para o formato correto

-- 1. VERIFICAR DADOS ATUAIS
-- =====================================================

SELECT 
    'DADOS ATUAIS' as verificação,
    id,
    uuid,
    anexos_evidencia,
    anexos_corretiva,
    anexos_verificacao,
    documents
FROM nao_conformidades 
ORDER BY created_at DESC
LIMIT 5;

-- 2. CONVERTER DADOS EXISTENTES PARA FORMATO CORRETO
-- =====================================================

-- Converter anexos_evidencia existentes
UPDATE nao_conformidades 
SET anexos_evidencia = CASE 
    WHEN anexos_evidencia IS NULL OR anexos_evidencia = '[]'::jsonb THEN '[]'::jsonb
    WHEN jsonb_typeof(anexos_evidencia) = 'array' THEN 
        CASE 
            WHEN jsonb_array_length(anexos_evidencia) = 0 THEN '[]'::jsonb
            ELSE (
                SELECT jsonb_agg(
                    CASE 
                        WHEN jsonb_typeof(item) = 'string' THEN 
                            jsonb_build_object(
                                'name', item,
                                'url', '',
                                'size', 0,
                                'type', 'application/octet-stream'
                            )
                        ELSE item
                    END
                )
                FROM jsonb_array_elements(anexos_evidencia) AS item
            )
        END
    ELSE anexos_evidencia
END
WHERE anexos_evidencia IS NOT NULL;

-- Converter anexos_corretiva existentes
UPDATE nao_conformidades 
SET anexos_corretiva = CASE 
    WHEN anexos_corretiva IS NULL OR anexos_corretiva = '[]'::jsonb THEN '[]'::jsonb
    WHEN jsonb_typeof(anexos_corretiva) = 'array' THEN 
        CASE 
            WHEN jsonb_array_length(anexos_corretiva) = 0 THEN '[]'::jsonb
            ELSE (
                SELECT jsonb_agg(
                    CASE 
                        WHEN jsonb_typeof(item) = 'string' THEN 
                            jsonb_build_object(
                                'name', item,
                                'url', '',
                                'size', 0,
                                'type', 'application/octet-stream'
                            )
                        ELSE item
                    END
                )
                FROM jsonb_array_elements(anexos_corretiva) AS item
            )
        END
    ELSE anexos_corretiva
END
WHERE anexos_corretiva IS NOT NULL;

-- Converter anexos_verificacao existentes
UPDATE nao_conformidades 
SET anexos_verificacao = CASE 
    WHEN anexos_verificacao IS NULL OR anexos_verificacao = '[]'::jsonb THEN '[]'::jsonb
    WHEN jsonb_typeof(anexos_verificacao) = 'array' THEN 
        CASE 
            WHEN jsonb_array_length(anexos_verificacao) = 0 THEN '[]'::jsonb
            ELSE (
                SELECT jsonb_agg(
                    CASE 
                        WHEN jsonb_typeof(item) = 'string' THEN 
                            jsonb_build_object(
                                'name', item,
                                'url', '',
                                'size', 0,
                                'type', 'application/octet-stream'
                            )
                        ELSE item
                    END
                )
                FROM jsonb_array_elements(anexos_verificacao) AS item
            )
        END
    ELSE anexos_verificacao
END
WHERE anexos_verificacao IS NOT NULL;

-- Converter anexos existentes
UPDATE nao_conformidades 
SET anexos = CASE 
    WHEN anexos IS NULL OR anexos = '[]'::jsonb THEN '[]'::jsonb
    WHEN jsonb_typeof(anexos) = 'array' THEN 
        CASE 
            WHEN jsonb_array_length(anexos) = 0 THEN '[]'::jsonb
            ELSE (
                SELECT jsonb_agg(
                    CASE 
                        WHEN jsonb_typeof(item) = 'string' THEN 
                            jsonb_build_object(
                                'name', item,
                                'url', '',
                                'size', 0,
                                'type', 'application/octet-stream'
                            )
                        ELSE item
                    END
                )
                FROM jsonb_array_elements(anexos) AS item
            )
        END
    ELSE anexos
END
WHERE anexos IS NOT NULL;

-- 3. VERIFICAR DADOS APÓS CONVERSÃO
-- =====================================================

SELECT 
    'DADOS APÓS CONVERSÃO' as verificação,
    id,
    uuid,
    anexos_evidencia,
    anexos_corretiva,
    anexos_verificacao,
    documents
FROM nao_conformidades 
ORDER BY created_at DESC
LIMIT 5;

-- 4. TESTAR FUNÇÃO jsonb_array_length
-- =====================================================

SELECT 
    'TESTE FUNÇÃO' as verificação,
    id,
    uuid,
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

-- 5. VERIFICAR ESTRUTURA DOS DADOS
-- =====================================================

SELECT 
    'ESTRUTURA DOS DADOS' as verificação,
    id,
    uuid,
    CASE 
        WHEN anexos_evidencia IS NOT NULL AND jsonb_array_length(anexos_evidencia) > 0 THEN 
            'anexos_evidencia: ' || jsonb_array_length(anexos_evidencia) || ' items'
        WHEN anexos_corretiva IS NOT NULL AND jsonb_array_length(anexos_corretiva) > 0 THEN 
            'anexos_corretiva: ' || jsonb_array_length(anexos_corretiva) || ' items'
        WHEN anexos_verificacao IS NOT NULL AND jsonb_array_length(anexos_verificacao) > 0 THEN 
            'anexos_verificacao: ' || jsonb_array_length(anexos_verificacao) || ' items'
        ELSE 'Sem documentos'
    END as info_documentos,
    CASE 
        WHEN anexos_evidencia IS NOT NULL AND jsonb_array_length(anexos_evidencia) > 0 THEN 
            jsonb_pretty(anexos_evidencia)
        WHEN anexos_corretiva IS NOT NULL AND jsonb_array_length(anexos_corretiva) > 0 THEN 
            jsonb_pretty(anexos_corretiva)
        WHEN anexos_verificacao IS NOT NULL AND jsonb_array_length(anexos_verificacao) > 0 THEN 
            jsonb_pretty(anexos_verificacao)
        ELSE '[]'
    END as estrutura_json
FROM nao_conformidades 
ORDER BY created_at DESC
LIMIT 3;

-- 6. MENSAGEM DE SUCESSO
-- =====================================================

SELECT 
    '🎉 SUCESSO!' as verificação,
    'Dados convertidos para formato correto' as mensagem,
    'Agora os documentos devem aparecer corretamente' as instrucao,
    'Teste o módulo Não Conformidades' as proximo_passo
FROM (SELECT 1) as dummy; 