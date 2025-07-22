-- Verificar estrutura da tabela ensaios_compactacao
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'ensaios_compactacao'
ORDER BY ordinal_position;

-- Verificar se user_id existe
SELECT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'ensaios_compactacao' 
    AND column_name = 'user_id'
) as user_id_exists;

-- Se user_id não existir, adicioná-lo
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'ensaios_compactacao' AND column_name = 'user_id') THEN
        ALTER TABLE public.ensaios_compactacao ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
        RAISE NOTICE 'Coluna user_id adicionada à tabela ensaios_compactacao';
    ELSE
        RAISE NOTICE 'Coluna user_id já existe na tabela ensaios_compactacao';
    END IF;
END $$;

-- Verificar RLS
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'ensaios_compactacao';

-- Verificar políticas
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'ensaios_compactacao'; 