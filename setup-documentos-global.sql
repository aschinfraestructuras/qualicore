-- =====================================================
-- SCRIPT GLOBAL: Configuração de Documentos para Todos os Módulos
-- =====================================================
-- Este script configura upload de documentos para todos os módulos do Qualicore

-- 1. VERIFICAR E CRIAR BUCKETS PARA TODOS OS MÓDULOS
-- Bucket para documentos gerais
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'documentos',
  'documentos',
  false,
  52428800, -- 50MB
  ARRAY[
    'application/pdf',
    'image/*',
    'text/*',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/zip',
    'application/x-zip-compressed'
  ]
)
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- Bucket para ensaios
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'ensaios',
  'ensaios',
  false,
  52428800, -- 50MB
  ARRAY[
    'application/pdf',
    'image/*',
    'text/*',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  ]
)
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- Bucket para obras
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'obras',
  'obras',
  false,
  52428800, -- 50MB
  ARRAY[
    'application/pdf',
    'image/*',
    'text/*',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  ]
)
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- Bucket para materiais
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'materiais',
  'materiais',
  false,
  52428800, -- 50MB
  ARRAY[
    'application/pdf',
    'image/*',
    'text/*',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  ]
)
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- Bucket para fornecedores
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'fornecedores',
  'fornecedores',
  false,
  52428800, -- 50MB
  ARRAY[
    'application/pdf',
    'image/*',
    'text/*',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  ]
)
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- Bucket para checklists
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'checklists',
  'checklists',
  false,
  52428800, -- 50MB
  ARRAY[
    'application/pdf',
    'image/*',
    'text/*',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  ]
)
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- Bucket para nao_conformidades
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'nao_conformidades',
  'nao_conformidades',
  false,
  52428800, -- 50MB
  ARRAY[
    'application/pdf',
    'image/*',
    'text/*',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  ]
)
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- Bucket para rfis
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'rfis',
  'rfis',
  false,
  52428800, -- 50MB
  ARRAY[
    'application/pdf',
    'image/*',
    'text/*',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  ]
)
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- 2. ADICIONAR COLUNAS DE DOCUMENTOS EM TODAS AS TABELAS

-- Tabela ensaios
ALTER TABLE ensaios ADD COLUMN IF NOT EXISTS documents JSONB DEFAULT '[]'::jsonb;
ALTER TABLE ensaios ADD COLUMN IF NOT EXISTS seguimento JSONB DEFAULT '[]'::jsonb;
ALTER TABLE ensaios ADD COLUMN IF NOT EXISTS "contextoAdicional" JSONB DEFAULT '[]'::jsonb;

-- Tabela ensaios_compactacao
ALTER TABLE ensaios_compactacao ADD COLUMN IF NOT EXISTS documents JSONB DEFAULT '[]'::jsonb;

-- Tabela obras
ALTER TABLE obras ADD COLUMN IF NOT EXISTS documents JSONB DEFAULT '[]'::jsonb;

-- Tabela materiais
ALTER TABLE materiais ADD COLUMN IF NOT EXISTS documents JSONB DEFAULT '[]'::jsonb;

-- Tabela fornecedores
ALTER TABLE fornecedores ADD COLUMN IF NOT EXISTS documents JSONB DEFAULT '[]'::jsonb;

-- Tabela checklists
ALTER TABLE checklists ADD COLUMN IF NOT EXISTS documents JSONB DEFAULT '[]'::jsonb;

-- Tabela documentos
ALTER TABLE documentos ADD COLUMN IF NOT EXISTS documents JSONB DEFAULT '[]'::jsonb;

-- Tabela nao_conformidades
ALTER TABLE nao_conformidades ADD COLUMN IF NOT EXISTS documents JSONB DEFAULT '[]'::jsonb;

-- Tabela rfis
ALTER TABLE rfis ADD COLUMN IF NOT EXISTS documents JSONB DEFAULT '[]'::jsonb;

-- 3. CONFIGURAR POLÍTICAS RLS GLOBAIS PARA STORAGE

-- Remover políticas existentes
DROP POLICY IF EXISTS "Usuários autenticados podem ver buckets" ON storage.buckets;
DROP POLICY IF EXISTS "Usuários autenticados podem criar buckets" ON storage.buckets;
DROP POLICY IF EXISTS "Usuários autenticados podem atualizar buckets" ON storage.buckets;
DROP POLICY IF EXISTS "Usuários autenticados podem deletar buckets" ON storage.buckets;

DROP POLICY IF EXISTS "Usuários autenticados podem ver objetos" ON storage.objects;
DROP POLICY IF EXISTS "Usuários autenticados podem inserir objetos" ON storage.objects;
DROP POLICY IF EXISTS "Usuários autenticados podem atualizar objetos" ON storage.objects;
DROP POLICY IF EXISTS "Usuários autenticados podem deletar objetos" ON storage.objects;

-- Criar políticas para buckets
CREATE POLICY "Usuários autenticados podem ver buckets" ON storage.buckets
FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Usuários autenticados podem criar buckets" ON storage.buckets
FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Usuários autenticados podem atualizar buckets" ON storage.buckets
FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Usuários autenticados podem deletar buckets" ON storage.buckets
FOR DELETE USING (auth.role() = 'authenticated');

-- Criar políticas para objetos
CREATE POLICY "Usuários autenticados podem ver objetos" ON storage.objects
FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Usuários autenticados podem inserir objetos" ON storage.objects
FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Usuários autenticados podem atualizar objetos" ON storage.objects
FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Usuários autenticados podem deletar objetos" ON storage.objects
FOR DELETE USING (auth.role() = 'authenticated');

-- 4. VERIFICAR CONFIGURAÇÃO
SELECT 
  'BUCKETS CRIADOS:' as info,
  id,
  name,
  public,
  file_size_limit
FROM storage.buckets 
ORDER BY name;

SELECT 
  'POLÍTICAS CRIADAS:' as info,
  schemaname,
  tablename,
  policyname,
  cmd
FROM pg_policies 
WHERE schemaname = 'storage'
ORDER BY tablename, policyname;

-- 5. MENSAGEM DE SUCESSO
DO $$
BEGIN
  RAISE NOTICE '🎉 CONFIGURAÇÃO GLOBAL COMPLETA!';
  RAISE NOTICE '✅ 8 buckets criados para todos os módulos';
  RAISE NOTICE '✅ Colunas documents adicionadas em todas as tabelas';
  RAISE NOTICE '✅ Políticas RLS configuradas globalmente';
  RAISE NOTICE '✅ Sistema de upload pronto para todos os módulos';
  RAISE NOTICE '';
  RAISE NOTICE '📋 MÓDULOS CONFIGURADOS:';
  RAISE NOTICE '   - Ensaios (gerais e compactação)';
  RAISE NOTICE '   - Obras';
  RAISE NOTICE '   - Materiais';
  RAISE NOTICE '   - Fornecedores';
  RAISE NOTICE '   - Checklists';
  RAISE NOTICE '   - Documentos';
  RAISE NOTICE '   - Não Conformidades';
  RAISE NOTICE '   - RFIs';
  RAISE NOTICE '';
  RAISE NOTICE '🚀 PRÓXIMO PASSO: Adicionar DocumentUpload em todos os formulários!';
END $$; 