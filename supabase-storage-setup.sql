-- Configuracao do Supabase Storage para documentos
-- Execute este script no SQL Editor do Supabase

-- 1. CRIAR BUCKET PARA DOCUMENTOS
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'documents',
    'documents',
    true,
    10485760, -- 10MB
    ARRAY['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'image/jpeg', 'image/png', 'image/gif', 'text/plain']
) ON CONFLICT (id) DO NOTHING;

-- 2. POLITICAS DE ACESSO PARA O BUCKET

-- Permitir que usuarios autenticados vejam documentos
CREATE POLICY "Usuarios autenticados podem ver documentos" ON storage.objects
    FOR SELECT USING (bucket_id = 'documents' AND auth.role() = 'authenticated');

-- Permitir que usuarios autenticados facam upload
CREATE POLICY "Usuarios autenticados podem fazer upload" ON storage.objects
    FOR INSERT WITH CHECK (bucket_id = 'documents' AND auth.role() = 'authenticated');

-- Permitir que usuarios autenticados atualizem seus documentos
CREATE POLICY "Usuarios autenticados podem atualizar documentos" ON storage.objects
    FOR UPDATE USING (bucket_id = 'documents' AND auth.role() = 'authenticated');

-- Permitir que usuarios autenticados removam seus documentos
CREATE POLICY "Usuarios autenticados podem remover documentos" ON storage.objects
    FOR DELETE USING (bucket_id = 'documents' AND auth.role() = 'authenticated');

-- 3. MENSAGEM DE CONFIRMACAO
SELECT 'Storage configurado com sucesso! Bucket "documents" criado e politicas aplicadas.' as status; 