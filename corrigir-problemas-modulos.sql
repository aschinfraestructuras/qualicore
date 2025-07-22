-- =====================================================
-- CORREÇÃO DE PROBLEMAS NOS MÓDULOS
-- =====================================================
-- Execute este script no SQL Editor do Supabase

-- 1. VERIFICAR E CORRIGIR POLÍTICAS RLS
-- =====================================================

-- Verificar se RLS está habilitado em todas as tabelas
DO $$
DECLARE
    r RECORD;
BEGIN
    FOR r IN 
        SELECT tablename 
        FROM pg_tables 
        WHERE schemaname = 'public' 
        AND tablename IN ('obras', 'fornecedores', 'materiais', 'ensaios', 'checklists', 'documentos', 'nao_conformidades', 'rfis')
    LOOP
        EXECUTE format('ALTER TABLE %I ENABLE ROW LEVEL SECURITY', r.tablename);
        RAISE NOTICE 'RLS habilitado na tabela: %', r.tablename;
    END LOOP;
END $$;

-- 2. CRIAR POLÍTICAS RLS PARA TODAS AS TABELAS
-- =====================================================

-- Políticas para obras
DROP POLICY IF EXISTS "Obras: usuário pode ver suas obras" ON obras;
CREATE POLICY "Obras: usuário pode ver suas obras" ON obras
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Obras: usuário pode inserir suas obras" ON obras;
CREATE POLICY "Obras: usuário pode inserir suas obras" ON obras
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Obras: usuário pode editar suas obras" ON obras;
CREATE POLICY "Obras: usuário pode editar suas obras" ON obras
  FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Obras: usuário pode deletar suas obras" ON obras;
CREATE POLICY "Obras: usuário pode deletar suas obras" ON obras
  FOR DELETE USING (auth.uid() = user_id);

-- Políticas para fornecedores
DROP POLICY IF EXISTS "Fornecedores: usuário pode ver seus fornecedores" ON fornecedores;
CREATE POLICY "Fornecedores: usuário pode ver seus fornecedores" ON fornecedores
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Fornecedores: usuário pode inserir seus fornecedores" ON fornecedores;
CREATE POLICY "Fornecedores: usuário pode inserir seus fornecedores" ON fornecedores
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Fornecedores: usuário pode editar seus fornecedores" ON fornecedores;
CREATE POLICY "Fornecedores: usuário pode editar seus fornecedores" ON fornecedores
  FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Fornecedores: usuário pode deletar seus fornecedores" ON fornecedores;
CREATE POLICY "Fornecedores: usuário pode deletar seus fornecedores" ON fornecedores
  FOR DELETE USING (auth.uid() = user_id);

-- Políticas para materiais
DROP POLICY IF EXISTS "Materiais: usuário pode ver seus materiais" ON materiais;
CREATE POLICY "Materiais: usuário pode ver seus materiais" ON materiais
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Materiais: usuário pode inserir seus materiais" ON materiais;
CREATE POLICY "Materiais: usuário pode inserir seus materiais" ON materiais
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Materiais: usuário pode editar seus materiais" ON materiais;
CREATE POLICY "Materiais: usuário pode editar seus materiais" ON materiais
  FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Materiais: usuário pode deletar seus materiais" ON materiais;
CREATE POLICY "Materiais: usuário pode deletar seus materiais" ON materiais
  FOR DELETE USING (auth.uid() = user_id);

-- Políticas para checklists
DROP POLICY IF EXISTS "Checklists: usuário pode ver seus checklists" ON checklists;
CREATE POLICY "Checklists: usuário pode ver seus checklists" ON checklists
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Checklists: usuário pode inserir seus checklists" ON checklists;
CREATE POLICY "Checklists: usuário pode inserir seus checklists" ON checklists
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Checklists: usuário pode editar seus checklists" ON checklists;
CREATE POLICY "Checklists: usuário pode editar seus checklists" ON checklists
  FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Checklists: usuário pode deletar seus checklists" ON checklists;
CREATE POLICY "Checklists: usuário pode deletar seus checklists" ON checklists
  FOR DELETE USING (auth.uid() = user_id);

-- Políticas para documentos
DROP POLICY IF EXISTS "Documentos: usuário pode ver seus documentos" ON documentos;
CREATE POLICY "Documentos: usuário pode ver seus documentos" ON documentos
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Documentos: usuário pode inserir seus documentos" ON documentos;
CREATE POLICY "Documentos: usuário pode inserir seus documentos" ON documentos
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Documentos: usuário pode editar seus documentos" ON documentos;
CREATE POLICY "Documentos: usuário pode editar seus documentos" ON documentos
  FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Documentos: usuário pode deletar seus documentos" ON documentos;
CREATE POLICY "Documentos: usuário pode deletar seus documentos" ON documentos
  FOR DELETE USING (auth.uid() = user_id);

-- Políticas para não conformidades
DROP POLICY IF EXISTS "NaoConformidades: usuário pode ver suas não conformidades" ON nao_conformidades;
CREATE POLICY "NaoConformidades: usuário pode ver suas não conformidades" ON nao_conformidades
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "NaoConformidades: usuário pode inserir suas não conformidades" ON nao_conformidades;
CREATE POLICY "NaoConformidades: usuário pode inserir suas não conformidades" ON nao_conformidades
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "NaoConformidades: usuário pode editar suas não conformidades" ON nao_conformidades;
CREATE POLICY "NaoConformidades: usuário pode editar suas não conformidades" ON nao_conformidades
  FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "NaoConformidades: usuário pode deletar suas não conformidades" ON nao_conformidades;
CREATE POLICY "NaoConformidades: usuário pode deletar suas não conformidades" ON nao_conformidades
  FOR DELETE USING (auth.uid() = user_id);

-- Políticas para RFIs
DROP POLICY IF EXISTS "RFIs: usuário pode ver seus RFIs" ON rfis;
CREATE POLICY "RFIs: usuário pode ver seus RFIs" ON rfis
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "RFIs: usuário pode inserir seus RFIs" ON rfis;
CREATE POLICY "RFIs: usuário pode inserir seus RFIs" ON rfis
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "RFIs: usuário pode editar seus RFIs" ON rfis;
CREATE POLICY "RFIs: usuário pode editar seus RFIs" ON rfis
  FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "RFIs: usuário pode deletar seus RFIs" ON rfis;
CREATE POLICY "RFIs: usuário pode deletar seus RFIs" ON rfis
  FOR DELETE USING (auth.uid() = user_id);

-- 3. VERIFICAR E CORRIGIR CAMPOS OBRIGATÓRIOS
-- =====================================================

-- Verificar se há campos que podem estar causando problemas
-- Adicionar valores padrão para campos que podem estar NULL

-- Para obras - garantir que campos obrigatórios tenham valores padrão
ALTER TABLE obras ALTER COLUMN fornecedores_principais SET DEFAULT '{}';
ALTER TABLE obras ALTER COLUMN valor_contrato SET DEFAULT 0;
ALTER TABLE obras ALTER COLUMN valor_executado SET DEFAULT 0;
ALTER TABLE obras ALTER COLUMN percentual_execucao SET DEFAULT 0;

-- Para materiais - garantir que campos obrigatórios tenham valores padrão
ALTER TABLE materiais ALTER COLUMN quantidade SET DEFAULT 0;

-- Para ensaios - garantir que campos obrigatórios tenham valores padrão
ALTER TABLE ensaios ALTER COLUMN valor_obtido SET DEFAULT 0;
ALTER TABLE ensaios ALTER COLUMN valor_esperado SET DEFAULT 0;
ALTER TABLE ensaios ALTER COLUMN conforme SET DEFAULT false;

-- 4. CRIAR ÍNDICES PARA MELHORAR PERFORMANCE
-- =====================================================

-- Índices para obras
CREATE INDEX IF NOT EXISTS idx_obras_user_id ON obras(user_id);
CREATE INDEX IF NOT EXISTS idx_obras_codigo ON obras(codigo);
CREATE INDEX IF NOT EXISTS idx_obras_status ON obras(status);

-- Índices para fornecedores
CREATE INDEX IF NOT EXISTS idx_fornecedores_user_id ON fornecedores(user_id);
CREATE INDEX IF NOT EXISTS idx_fornecedores_nome ON fornecedores(nome);

-- Índices para materiais
CREATE INDEX IF NOT EXISTS idx_materiais_user_id ON materiais(user_id);
CREATE INDEX IF NOT EXISTS idx_materiais_codigo ON materiais(codigo);
CREATE INDEX IF NOT EXISTS idx_materiais_tipo ON materiais(tipo);

-- Índices para checklists
CREATE INDEX IF NOT EXISTS idx_checklists_user_id ON checklists(user_id);
CREATE INDEX IF NOT EXISTS idx_checklists_codigo ON checklists(codigo);

-- Índices para documentos
CREATE INDEX IF NOT EXISTS idx_documentos_user_id ON documentos(user_id);
CREATE INDEX IF NOT EXISTS idx_documentos_codigo ON documentos(codigo);
CREATE INDEX IF NOT EXISTS idx_documentos_tipo ON documentos(tipo);

-- Índices para não conformidades
CREATE INDEX IF NOT EXISTS idx_nao_conformidades_user_id ON nao_conformidades(user_id);
CREATE INDEX IF NOT EXISTS idx_nao_conformidades_codigo ON nao_conformidades(codigo);

-- Índices para RFIs
CREATE INDEX IF NOT EXISTS idx_rfis_user_id ON rfis(user_id);
CREATE INDEX IF NOT EXISTS idx_rfis_codigo ON rfis(codigo);

-- 5. VERIFICAR SE AS CORREÇÕES FUNCIONARAM
-- =====================================================

-- Mostrar todas as políticas criadas
SELECT 
    schemaname,
    tablename,
    policyname,
    cmd
FROM pg_policies 
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- Mostrar índices criados
SELECT 
    tablename,
    indexname
FROM pg_indexes 
WHERE schemaname = 'public'
AND tablename IN ('obras', 'fornecedores', 'materiais', 'ensaios', 'checklists', 'documentos', 'nao_conformidades', 'rfis')
ORDER BY tablename, indexname; 