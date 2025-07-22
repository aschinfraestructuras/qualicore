-- CORREÇÃO DEFINITIVA PARA ENSAIOS DE COMPACTAÇÃO
-- Execute este script no SQL Editor do Supabase

-- 1. Verificar se a tabela existe
SELECT 'Tabela ensaios_compactacao existe:' as info, 
       EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'ensaios_compactacao') as resultado;

-- 2. Verificar estrutura atual
SELECT column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'ensaios_compactacao'
ORDER BY ordinal_position;

-- 3. Adicionar coluna user_id se não existir
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'ensaios_compactacao' AND column_name = 'user_id') THEN
        ALTER TABLE public.ensaios_compactacao ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
        RAISE NOTICE 'Coluna user_id adicionada';
    ELSE
        RAISE NOTICE 'Coluna user_id já existe';
    END IF;
END $$;

-- 4. Desativar RLS temporariamente para permitir inserções
ALTER TABLE public.ensaios_compactacao DISABLE ROW LEVEL SECURITY;

-- 5. Remover políticas existentes (se houver)
DROP POLICY IF EXISTS "Users can view own ensaios_compactacao" ON public.ensaios_compactacao;
DROP POLICY IF EXISTS "Users can insert own ensaios_compactacao" ON public.ensaios_compactacao;
DROP POLICY IF EXISTS "Users can update own ensaios_compactacao" ON public.ensaios_compactacao;
DROP POLICY IF EXISTS "Users can delete own ensaios_compactacao" ON public.ensaios_compactacao;

-- 6. Reativar RLS
ALTER TABLE public.ensaios_compactacao ENABLE ROW LEVEL SECURITY;

-- 7. Criar políticas corretas
CREATE POLICY "Users can view own ensaios_compactacao" ON public.ensaios_compactacao
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own ensaios_compactacao" ON public.ensaios_compactacao
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own ensaios_compactacao" ON public.ensaios_compactacao
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own ensaios_compactacao" ON public.ensaios_compactacao
    FOR DELETE USING (auth.uid() = user_id);

-- 8. Verificar se tudo está correto
SELECT 'RLS ativo:' as info, rowsecurity as resultado
FROM pg_tables 
WHERE tablename = 'ensaios_compactacao';

SELECT 'Políticas criadas:' as info, COUNT(*) as total
FROM pg_policies 
WHERE tablename = 'ensaios_compactacao';

-- 9. Verificar estrutura final
SELECT column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'ensaios_compactacao'
ORDER BY ordinal_position; 