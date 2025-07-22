-- =====================================================
-- ADICIONAR CAMPOS DE ANEXOS - VERSÃO SIMPLES
-- =====================================================

-- 1. Verificar se os campos já existem
SELECT 
    column_name,
    data_type
FROM information_schema.columns 
WHERE table_name = 'nao_conformidades' 
AND table_schema = 'public'
AND column_name IN ('anexos_evidencia', 'anexos_corretiva', 'anexos_verificacao', 'timeline')
ORDER BY column_name;

-- 2. Adicionar campo anexos_evidencia
ALTER TABLE nao_conformidades 
ADD COLUMN IF NOT EXISTS anexos_evidencia TEXT[] DEFAULT '{}';

-- 3. Adicionar campo anexos_corretiva
ALTER TABLE nao_conformidades 
ADD COLUMN IF NOT EXISTS anexos_corretiva TEXT[] DEFAULT '{}';

-- 4. Adicionar campo anexos_verificacao
ALTER TABLE nao_conformidades 
ADD COLUMN IF NOT EXISTS anexos_verificacao TEXT[] DEFAULT '{}';

-- 5. Adicionar campo timeline
ALTER TABLE nao_conformidades 
ADD COLUMN IF NOT EXISTS timeline JSONB DEFAULT '[]'::jsonb;

-- 6. Verificar se os campos foram adicionados
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'nao_conformidades' 
AND table_schema = 'public'
AND column_name IN ('anexos_evidencia', 'anexos_corretiva', 'anexos_verificacao', 'timeline')
ORDER BY column_name;

-- 7. Verificar total de colunas
SELECT COUNT(*) as total_colunas 
FROM information_schema.columns 
WHERE table_name = 'nao_conformidades' 
AND table_schema = 'public'; 