-- Configuração de Storage e RLS para Supabase
-- Execute este script no SQL Editor do Supabase Dashboard

-- 1. Habilitar extensão storage se não estiver habilitada
CREATE EXTENSION IF NOT EXISTS "storage" SCHEMA "storage";

-- 2. Criar bucket de documentos se não existir
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'documentos',
  'documentos',
  false,
  52428800, -- 50MB
  ARRAY['application/pdf', 'image/*', 'text/*', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
)
ON CONFLICT (id) DO NOTHING;

-- 3. Configurar políticas RLS para storage.buckets
-- Política para permitir que usuários autenticados vejam buckets
CREATE POLICY "Usuários autenticados podem ver buckets" ON storage.buckets
FOR SELECT USING (auth.role() = 'authenticated');

-- Política para permitir que usuários autenticados criem buckets
CREATE POLICY "Usuários autenticados podem criar buckets" ON storage.buckets
FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Política para permitir que usuários autenticados atualizem buckets
CREATE POLICY "Usuários autenticados podem atualizar buckets" ON storage.buckets
FOR UPDATE USING (auth.role() = 'authenticated');

-- Política para permitir que usuários autenticados deletem buckets
CREATE POLICY "Usuários autenticados podem deletar buckets" ON storage.buckets
FOR DELETE USING (auth.role() = 'authenticated');

-- 4. Configurar políticas RLS para storage.objects
-- Política para permitir que usuários autenticados vejam objetos
CREATE POLICY "Usuários autenticados podem ver objetos" ON storage.objects
FOR SELECT USING (auth.role() = 'authenticated');

-- Política para permitir que usuários autenticados insiram objetos
CREATE POLICY "Usuários autenticados podem inserir objetos" ON storage.objects
FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Política para permitir que usuários autenticados atualizem objetos
CREATE POLICY "Usuários autenticados podem atualizar objetos" ON storage.objects
FOR UPDATE USING (auth.role() = 'authenticated');

-- Política para permitir que usuários autenticados deletem objetos
CREATE POLICY "Usuários autenticados podem deletar objetos" ON storage.objects
FOR DELETE USING (auth.role() = 'authenticated');

-- 5. Verificar se as políticas foram criadas
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
WHERE schemaname = 'storage'
ORDER BY tablename, policyname;

-- 6. Verificar buckets existentes
SELECT id, name, public, file_size_limit, created_at 
FROM storage.buckets 
ORDER BY created_at; 