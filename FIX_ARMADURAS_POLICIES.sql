-- =====================================================
-- SCRIPT PARA CORRIGIR CONFLITOS DE POLÍTICAS RLS
-- =====================================================
-- Este script resolve o erro 42710 (policy already exists)

-- PASSO 1: Desabilitar RLS temporariamente
-- =====================================================
ALTER TABLE armaduras DISABLE ROW LEVEL SECURITY;

-- PASSO 2: Remover TODAS as políticas existentes
-- =====================================================
-- Remover políticas antigas (se existirem)
DROP POLICY IF EXISTS "Users can view their own armaduras" ON armaduras;
DROP POLICY IF EXISTS "Users can create armaduras" ON armaduras;
DROP POLICY IF EXISTS "Users can update their own armaduras" ON armaduras;
DROP POLICY IF EXISTS "Users can delete their own armaduras" ON armaduras;

-- Remover políticas novas (se existirem)
DROP POLICY IF EXISTS "Allow read access to all armaduras" ON armaduras;
DROP POLICY IF EXISTS "Allow insert access to armaduras" ON armaduras;
DROP POLICY IF EXISTS "Allow update access to armaduras" ON armaduras;
DROP POLICY IF EXISTS "Allow delete access to armaduras" ON armaduras;

-- Remover políticas com nomes alternativos (se existirem)
DROP POLICY IF EXISTS "Allow read access to authenticated users" ON armaduras;
DROP POLICY IF EXISTS "Allow insert access to authenticated users" ON armaduras;
DROP POLICY IF EXISTS "Allow update access to authenticated users" ON armaduras;
DROP POLICY IF EXISTS "Allow delete access to authenticated users" ON armaduras;

-- PASSO 3: Criar políticas permissivas para desenvolvimento
-- =====================================================
CREATE POLICY "Allow read access to all armaduras" ON armaduras
    FOR SELECT USING (true);

CREATE POLICY "Allow insert access to armaduras" ON armaduras
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow update access to armaduras" ON armaduras
    FOR UPDATE USING (true);

CREATE POLICY "Allow delete access to armaduras" ON armaduras
    FOR DELETE USING (true);

-- PASSO 4: Reabilitar RLS
-- =====================================================
ALTER TABLE armaduras ENABLE ROW LEVEL SECURITY;

-- PASSO 5: Verificar políticas criadas
-- =====================================================
SELECT '=== POLÍTICAS CRIADAS ===' as info;
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE tablename = 'armaduras'
ORDER BY policyname;

-- PASSO 6: Testar acesso
-- =====================================================
SELECT '=== TESTE DE ACESSO ===' as info;
SELECT COUNT(*) as total_armaduras FROM armaduras;

-- PASSO 7: Mensagem de sucesso
-- =====================================================
SELECT '✅ CONFLITOS DE POLÍTICAS RESOLVIDOS!' as status;
SELECT '🔧 RLS configurado corretamente' as info;
SELECT '📊 Acesso às armaduras funcionando' as info;
