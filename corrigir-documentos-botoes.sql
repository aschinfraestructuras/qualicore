-- =====================================================
-- CORREÇÃO: Documentos e Botões nos Módulos
-- =====================================================
-- Execute este script no SQL Editor do Supabase
-- Este script corrige os problemas de documentos e botões de visualizar/download

-- 1. VERIFICAR E CRIAR BUCKET DE DOCUMENTOS
-- =====================================================

-- Criar bucket 'documents' se não existir
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'documents',
    'documents',
    true, -- Público para permitir acesso
    10485760, -- 10MB
    ARRAY[
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'image/jpeg',
        'image/png',
        'image/gif',
        'text/plain'
    ]
)
ON CONFLICT (id) DO UPDATE SET
    public = EXCLUDED.public,
    file_size_limit = EXCLUDED.file_size_limit,
    allowed_mime_types = EXCLUDED.allowed_mime_types;

-- 2. CONFIGURAR POLÍTICAS DE STORAGE
-- =====================================================

-- Políticas para storage.objects (permitir acesso público aos documentos)
DROP POLICY IF EXISTS "Documentos públicos podem ser vistos" ON storage.objects;
CREATE POLICY "Documentos públicos podem ser vistos" ON storage.objects
    FOR SELECT USING (bucket_id = 'documents');

-- Políticas para usuários autenticados fazerem upload
DROP POLICY IF EXISTS "Usuários autenticados podem fazer upload" ON storage.objects;
CREATE POLICY "Usuários autenticados podem fazer upload" ON storage.objects
    FOR INSERT WITH CHECK (bucket_id = 'documents' AND auth.role() = 'authenticated');

-- Políticas para usuários autenticados atualizarem documentos
DROP POLICY IF EXISTS "Usuários autenticados podem atualizar documentos" ON storage.objects;
CREATE POLICY "Usuários autenticados podem atualizar documentos" ON storage.objects
    FOR UPDATE USING (bucket_id = 'documents' AND auth.role() = 'authenticated');

-- Políticas para usuários autenticados removerem documentos
DROP POLICY IF EXISTS "Usuários autenticados podem remover documentos" ON storage.objects;
CREATE POLICY "Usuários autenticados podem remover documentos" ON storage.objects
    FOR DELETE USING (bucket_id = 'documents' AND auth.role() = 'authenticated');

-- 3. VERIFICAR E CORRIGIR CAMPOS DE DOCUMENTOS NAS TABELAS
-- =====================================================

-- Verificar se a coluna 'documents' existe na tabela ensaios
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'ensaios' 
        AND column_name = 'documents'
    ) THEN
        ALTER TABLE ensaios ADD COLUMN documents JSONB DEFAULT '[]';
        RAISE NOTICE 'Coluna documents adicionada à tabela ensaios';
    ELSE
        RAISE NOTICE 'Coluna documents já existe na tabela ensaios';
    END IF;
END $$;

-- Verificar se a coluna 'documents' existe na tabela ensaios_compactacao
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'ensaios_compactacao' 
        AND column_name = 'documents'
    ) THEN
        ALTER TABLE ensaios_compactacao ADD COLUMN documents JSONB DEFAULT '[]';
        RAISE NOTICE 'Coluna documents adicionada à tabela ensaios_compactacao';
    ELSE
        RAISE NOTICE 'Coluna documents já existe na tabela ensaios_compactacao';
    END IF;
END $$;

-- Verificar se a coluna 'anexos' existe nas outras tabelas
DO $$
BEGIN
    -- Obras
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'obras' 
        AND column_name = 'anexos'
    ) THEN
        ALTER TABLE obras ADD COLUMN anexos JSONB DEFAULT '[]';
        RAISE NOTICE 'Coluna anexos adicionada à tabela obras';
    END IF;
    
    -- Fornecedores
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'fornecedores' 
        AND column_name = 'anexos'
    ) THEN
        ALTER TABLE fornecedores ADD COLUMN anexos JSONB DEFAULT '[]';
        RAISE NOTICE 'Coluna anexos adicionada à tabela fornecedores';
    END IF;
    
    -- Materiais
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'materiais' 
        AND column_name = 'anexos'
    ) THEN
        ALTER TABLE materiais ADD COLUMN anexos JSONB DEFAULT '[]';
        RAISE NOTICE 'Coluna anexos adicionada à tabela materiais';
    END IF;
    
    -- Checklists
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'checklists' 
        AND column_name = 'anexos'
    ) THEN
        ALTER TABLE checklists ADD COLUMN anexos JSONB DEFAULT '[]';
        RAISE NOTICE 'Coluna anexos adicionada à tabela checklists';
    END IF;
    
    -- Documentos
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'documentos' 
        AND column_name = 'anexos'
    ) THEN
        ALTER TABLE documentos ADD COLUMN anexos JSONB DEFAULT '[]';
        RAISE NOTICE 'Coluna anexos adicionada à tabela documentos';
    END IF;
    
    -- Não Conformidades
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'nao_conformidades' 
        AND column_name = 'anexos'
    ) THEN
        ALTER TABLE nao_conformidades ADD COLUMN anexos JSONB DEFAULT '[]';
        RAISE NOTICE 'Coluna anexos adicionada à tabela nao_conformidades';
    END IF;
    
    -- RFIs
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'rfis' 
        AND column_name = 'anexos'
    ) THEN
        ALTER TABLE rfis ADD COLUMN anexos JSONB DEFAULT '[]';
        RAISE NOTICE 'Coluna anexos adicionada à tabela rfis';
    END IF;
END $$;

-- 4. VERIFICAR SE AS CORREÇÕES FUNCIONARAM
-- =====================================================

-- Mostrar buckets criados
SELECT 
    id,
    name,
    public,
    file_size_limit,
    allowed_mime_types
FROM storage.buckets 
WHERE name = 'documents';

-- Mostrar políticas de storage
SELECT 
    policyname,
    cmd,
    qual
FROM pg_policies 
WHERE schemaname = 'storage'
AND tablename = 'objects'
ORDER BY policyname;

-- Mostrar colunas de documentos nas tabelas
SELECT 
    table_name,
    column_name,
    data_type
FROM information_schema.columns 
WHERE table_name IN ('ensaios', 'ensaios_compactacao', 'obras', 'fornecedores', 'materiais', 'checklists', 'documentos', 'nao_conformidades', 'rfis')
AND column_name IN ('documents', 'anexos')
ORDER BY table_name, column_name;

-- 5. MENSAGEM DE CONFIRMAÇÃO
-- =====================================================
SELECT '✅ Correção de documentos e botões concluída!' as status; 