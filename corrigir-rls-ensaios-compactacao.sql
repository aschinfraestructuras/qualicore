-- CORRIGIR RLS PARA ENSAIOS DE COMPACTAÇÃO
-- A tabela já tem user_id, só precisa das políticas corretas

-- 1. Verificar RLS atual
SELECT 'RLS ativo:' as info, rowsecurity as resultado
FROM pg_tables 
WHERE tablename = 'ensaios_compactacao';

-- 2. Verificar políticas existentes
SELECT 'Políticas existentes:' as info, COUNT(*) as total
FROM pg_policies 
WHERE tablename = 'ensaios_compactacao';

-- 3. Remover políticas existentes (se houver)
DROP POLICY IF EXISTS "Users can view own ensaios_compactacao" ON public.ensaios_compactacao;
DROP POLICY IF EXISTS "Users can insert own ensaios_compactacao" ON public.ensaios_compactacao;
DROP POLICY IF EXISTS "Users can update own ensaios_compactacao" ON public.ensaios_compactacao;
DROP POLICY IF EXISTS "Users can delete own ensaios_compactacao" ON public.ensaios_compactacao;
DROP POLICY IF EXISTS "Allow all operations" ON public.ensaios_compactacao;

-- 4. Garantir que RLS está ativo
ALTER TABLE public.ensaios_compactacao ENABLE ROW LEVEL SECURITY;

-- 5. Criar políticas corretas
CREATE POLICY "Users can view own ensaios_compactacao" ON public.ensaios_compactacao
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own ensaios_compactacao" ON public.ensaios_compactacao
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own ensaios_compactacao" ON public.ensaios_compactacao
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own ensaios_compactacao" ON public.ensaios_compactacao
    FOR DELETE USING (auth.uid() = user_id);

-- 6. Verificar se as políticas foram criadas
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'ensaios_compactacao';

-- 7. Teste de inserção (opcional - remover depois)
-- INSERT INTO public.ensaios_compactacao (
--     user_id,
--     obra,
--     localizacao,
--     elemento,
--     numero_ensaio,
--     codigo,
--     data_amostra,
--     densidade_maxima_referencia,
--     humidade_otima_referencia,
--     pontos,
--     densidade_seca_media,
--     humidade_media,
--     grau_compactacao_medio,
--     observacoes
-- ) VALUES (
--     auth.uid(),
--     'Obra Teste',
--     'Localização Teste',
--     'Elemento Teste',
--     'TEST-001',
--     'COD-TEST',
--     '2024-01-15',
--     1.95,
--     9.8,
--     '[]',
--     1.85,
--     6.6,
--     94.77,
--     'Teste de inserção'
-- ); 