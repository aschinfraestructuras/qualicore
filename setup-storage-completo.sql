-- =====================================================
-- SCRIPT COMPLETO: Configuração Storage Supabase
-- =====================================================
-- Execute este script no SQL Editor do Supabase Dashboard
-- Este script configura todo o sistema de Storage automaticamente

-- 1. VERIFICAR SE STORAGE ESTÁ ATIVO
DO $$
BEGIN
    -- Verificar se a extensão storage existe
    IF NOT EXISTS (
        SELECT 1 FROM pg_extension WHERE extname = 'storage'
    ) THEN
        RAISE NOTICE '⚠️ Extensão storage não encontrada. Verifique se Storage está ativado no projeto.';
        RAISE NOTICE '💡 Vá para: Settings > General > Storage e ative o recurso.';
    ELSE
        RAISE NOTICE '✅ Extensão storage encontrada!';
    END IF;
END $$;

-- 2. CRIAR BUCKETS NECESSÁRIOS
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

-- Bucket para ensaios específicos
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

-- 3. REMOVER POLÍTICAS EXISTENTES (se houver)
DROP POLICY IF EXISTS "Usuários autenticados podem ver buckets" ON storage.buckets;
DROP POLICY IF EXISTS "Usuários autenticados podem criar buckets" ON storage.buckets;
DROP POLICY IF EXISTS "Usuários autenticados podem atualizar buckets" ON storage.buckets;
DROP POLICY IF EXISTS "Usuários autenticados podem deletar buckets" ON storage.buckets;

DROP POLICY IF EXISTS "Usuários autenticados podem ver objetos" ON storage.objects;
DROP POLICY IF EXISTS "Usuários autenticados podem inserir objetos" ON storage.objects;
DROP POLICY IF EXISTS "Usuários autenticados podem atualizar objetos" ON storage.objects;
DROP POLICY IF EXISTS "Usuários autenticados podem deletar objetos" ON storage.objects;

-- 4. CONFIGURAR POLÍTICAS RLS PARA STORAGE.BUCKETS
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

-- 5. CONFIGURAR POLÍTICAS RLS PARA STORAGE.OBJECTS
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

-- 6. CONFIGURAR POLÍTICAS ESPECÍFICAS PARA DOCUMENTOS
-- Política para permitir que usuários vejam apenas seus próprios documentos
CREATE POLICY "Usuários veem seus próprios documentos" ON storage.objects
FOR SELECT USING (
    auth.uid()::text = (storage.foldername(name))[1]
);

-- Política para permitir que usuários insiram documentos em suas pastas
CREATE POLICY "Usuários inserem documentos em suas pastas" ON storage.objects
FOR INSERT WITH CHECK (
    auth.uid()::text = (storage.foldername(name))[1]
);

-- Política para permitir que usuários atualizem seus próprios documentos
CREATE POLICY "Usuários atualizam seus próprios documentos" ON storage.objects
FOR UPDATE USING (
    auth.uid()::text = (storage.foldername(name))[1]
);

-- Política para permitir que usuários deletem seus próprios documentos
CREATE POLICY "Usuários deletam seus próprios documentos" ON storage.objects
FOR DELETE USING (
    auth.uid()::text = (storage.foldername(name))[1]
);

-- 7. VERIFICAR CONFIGURAÇÃO
-- Verificar buckets criados
SELECT 
    'BUCKETS CRIADOS:' as info,
    id,
    name,
    public,
    file_size_limit,
    created_at
FROM storage.buckets 
ORDER BY created_at;

-- Verificar políticas criadas
SELECT 
    'POLÍTICAS CRIADAS:' as info,
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd
FROM pg_policies 
WHERE schemaname = 'storage'
ORDER BY tablename, policyname;

-- 8. MENSAGEM DE SUCESSO
DO $$
BEGIN
    RAISE NOTICE '🎉 CONFIGURAÇÃO COMPLETA!';
    RAISE NOTICE '✅ Buckets criados: documentos, ensaios';
    RAISE NOTICE '✅ Políticas RLS configuradas';
    RAISE NOTICE '✅ Storage pronto para uso';
    RAISE NOTICE '';
    RAISE NOTICE '📝 PRÓXIMOS PASSOS:';
    RAISE NOTICE '1. Teste criar um ensaio com documento';
    RAISE NOTICE '2. Se funcionar, descomente DocumentUpload nos formulários';
    RAISE NOTICE '3. Se não funcionar, verifique se Storage está ativado no projeto';
END $$; 