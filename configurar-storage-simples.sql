-- =====================================================
-- CONFIGURAR STORAGE SIMPLES
-- =====================================================
-- Execute este script no SQL Editor do Supabase

-- 1. CRIAR BUCKET DOCUMENTS
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'documents',
    'documents',
    true,
    52428800, -- 50MB
    ARRAY['image/*', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'text/plain']
)
ON CONFLICT (id) DO NOTHING;

-- 2. CRIAR POLÍTICAS BÁSICAS
CREATE POLICY "Allow public access to documents" ON storage.objects
FOR SELECT USING (bucket_id = 'documents');

CREATE POLICY "Allow authenticated uploads" ON storage.objects
FOR INSERT WITH CHECK (
    bucket_id = 'documents' 
    AND auth.role() = 'authenticated'
);

-- 3. VERIFICAR BUCKET
SELECT 
    'BUCKET STATUS' as verificação,
    id,
    name,
    public,
    file_size_limit
FROM storage.buckets 
WHERE name = 'documents';

-- 4. MENSAGEM DE SUCESSO
SELECT 
    '🎉 STORAGE CONFIGURADO!' as verificação,
    'Bucket documents criado' as bucket,
    'Políticas básicas aplicadas' as politicas,
    'Teste agora o upload' as proximo_passo
FROM (SELECT 1) as dummy; 