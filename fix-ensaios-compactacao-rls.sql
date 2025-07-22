-- Verificar se a tabela ensaios_compactacao existe
SELECT EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'ensaios_compactacao'
) as table_exists;

-- Verificar se RLS está ativo
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'ensaios_compactacao';

-- Verificar políticas existentes
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'ensaios_compactacao';

-- Ativar RLS se não estiver ativo
ALTER TABLE public.ensaios_compactacao ENABLE ROW LEVEL SECURITY;

-- Remover políticas existentes (se houver)
DROP POLICY IF EXISTS "Users can view own ensaios_compactacao" ON public.ensaios_compactacao;
DROP POLICY IF EXISTS "Users can insert own ensaios_compactacao" ON public.ensaios_compactacao;
DROP POLICY IF EXISTS "Users can update own ensaios_compactacao" ON public.ensaios_compactacao;
DROP POLICY IF EXISTS "Users can delete own ensaios_compactacao" ON public.ensaios_compactacao;

-- Criar políticas RLS para ensaios_compactacao
CREATE POLICY "Users can view own ensaios_compactacao" ON public.ensaios_compactacao
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own ensaios_compactacao" ON public.ensaios_compactacao
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own ensaios_compactacao" ON public.ensaios_compactacao
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own ensaios_compactacao" ON public.ensaios_compactacao
    FOR DELETE USING (auth.uid() = user_id);

-- Verificar se a coluna user_id existe
SELECT column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'ensaios_compactacao'
AND column_name = 'user_id';

-- Se a coluna user_id não existir, adicioná-la
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'ensaios_compactacao' AND column_name = 'user_id') THEN
        ALTER TABLE public.ensaios_compactacao ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
    END IF;
END $$;

-- Verificar políticas criadas
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'ensaios_compactacao'; 