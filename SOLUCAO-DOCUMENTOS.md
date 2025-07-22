# SOLUÇÃO PARA MÓDULO DOCUMENTOS

## Problema Identificado
O módulo Documentos não estava a atualizar documentos ao editar porque:
1. Usava um sistema de upload antigo (`uploadedFiles`) em vez do `DocumentUpload` corrigido
2. Não tinha o campo `documents` no schema
3. Não inicializava os documentos existentes ao editar

## Solução Aplicada

### 1. Substituição do Sistema de Upload
- ✅ Removido sistema antigo (`uploadedFiles`, `handleFileUpload`, `removeFile`)
- ✅ Integrado `DocumentUpload` com `recordType="documento"`
- ✅ Adicionado campo `documents` ao schema Zod
- ✅ Inicialização correta dos documentos existentes

### 2. Correções no Formulário
- ✅ Estado `documents` inicializado com `initialData?.documents || []`
- ✅ `useEffect` para atualizar documentos quando `initialData` muda
- ✅ Campo `documents` incluído no `onSubmitForm`

## Passos para Aplicar a Correção

### 1. Executar Script SQL
Cole este script no **SQL Editor** do Supabase:

```sql
-- CORREÇÃO DEFINITIVA - MÓDULO DOCUMENTOS
-- Verificar e corrigir estrutura da tabela documentos

-- 1. Verificar estrutura atual
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'documentos' 
ORDER BY ordinal_position;

-- 2. Adicionar campo documents se não existir
ALTER TABLE documentos ADD COLUMN IF NOT EXISTS documents JSONB DEFAULT '[]'::jsonb;

-- 3. Verificar se o campo foi adicionado
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'documentos' AND column_name = 'documents';

-- 4. Limpar dados inválidos (se houver)
UPDATE documentos SET documents = '[]'::jsonb WHERE documents IS NULL;

-- 5. Criar um documento de teste com documentos
WITH user_info AS (
    SELECT id FROM auth.users LIMIT 1
)
INSERT INTO documentos (
    codigo, tipo, versao, data_validade, responsavel, zona, estado, observacoes, documents, user_id
) 
SELECT 
    'DOC-TESTE-001', 
    'relatorio', 
    '1.0', 
    '2025-12-31', 
    'Teste', 
    'Zona Teste', 
    'aprovado', 
    'Documento de teste para verificar upload de ficheiros',
    '[{"id": "documento/temp_1706361600000/documento1.pdf", "name": "documento1.pdf", "url": "https://mjgvjpqcdsmvervcxjig.supabase.co/storage/v1/object/public/documents/documento/temp_1706361600000/documento1.pdf", "type": "application/pdf", "size": 1024, "uploaded_at": "2025-01-27T10:00:00Z"}, {"id": "documento/temp_1706361600000/documento2.jpg", "name": "documento2.jpg", "url": "https://mjgvjpqcdsmvervcxjig.supabase.co/storage/v1/object/public/documents/documento/temp_1706361600000/documento2.jpg", "type": "image/jpeg", "size": 2048, "uploaded_at": "2025-01-27T10:01:00Z"}]'::jsonb,
    user_info.id 
FROM user_info
ON CONFLICT (codigo) DO NOTHING;

-- 6. Verificar documento criado
SELECT id, codigo, tipo, documents FROM documentos WHERE codigo = 'DOC-TESTE-001';

-- 7. Verificar políticas de storage para bucket 'documents'
SELECT * FROM storage.policies WHERE bucket_id = 'documents';

-- 8. Garantir que as políticas estão corretas
-- Política para permitir upload de documentos
INSERT INTO storage.policies (name, bucket_id, operation, definition)
VALUES (
    'Allow authenticated users to upload documents',
    'documents',
    'INSERT',
    '(auth.role() = ''authenticated'')'
) ON CONFLICT (name, bucket_id, operation) DO NOTHING;

-- Política para permitir visualização de documentos
INSERT INTO storage.policies (name, bucket_id, operation, definition)
VALUES (
    'Allow authenticated users to view documents',
    'documents',
    'SELECT',
    '(auth.role() = ''authenticated'')'
) ON CONFLICT (name, bucket_id, operation) DO NOTHING;

-- Política para permitir atualização de documentos
INSERT INTO storage.policies (name, bucket_id, operation, definition)
VALUES (
    'Allow authenticated users to update documents',
    'documents',
    'UPDATE',
    '(auth.role() = ''authenticated'')'
) ON CONFLICT (name, bucket_id, operation) DO NOTHING;

-- Política para permitir eliminação de documentos
INSERT INTO storage.policies (name, bucket_id, operation, definition)
VALUES (
    'Allow authenticated users to delete documents',
    'documents',
    'DELETE',
    '(auth.role() = ''authenticated'')'
) ON CONFLICT (name, bucket_id, operation) DO NOTHING;

-- 9. Verificar se o bucket 'documents' existe
SELECT * FROM storage.buckets WHERE id = 'documents';

-- 10. Criar bucket se não existir
INSERT INTO storage.buckets (id, name, public)
VALUES ('documents', 'documents', true)
ON CONFLICT (id) DO NOTHING;

-- 11. Verificação final
SELECT 
    'Estrutura da tabela documentos:' as info,
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'documentos' 
ORDER BY ordinal_position;

SELECT 
    'Documentos existentes:' as info,
    COUNT(*) as total_documentos,
    COUNT(CASE WHEN documents IS NOT NULL AND documents != '[]'::jsonb THEN 1 END) as com_documentos
FROM documentos;
```

### 2. Testar no Frontend
1. **Aceder ao módulo Documentos**
2. **Criar um novo documento** com ficheiros anexos
3. **Editar o documento** - os ficheiros devem aparecer
4. **Adicionar/remover ficheiros** - deve funcionar corretamente
5. **Salvar** - os documentos devem ser guardados

### 3. Verificações
- ✅ Campo `documents` existe na tabela
- ✅ Documento de teste `DOC-TESTE-001` foi criado
- ✅ Políticas de storage estão configuradas
- ✅ Bucket `documents` existe

## Problemas Comuns

### "Documento não guarda ficheiros"
- Verificar se o campo `documents` foi adicionado à tabela
- Verificar se as políticas de storage estão corretas

### "Erro 404 ao visualizar ficheiros"
- Verificar se o bucket `documents` existe
- Verificar se as políticas de SELECT estão configuradas

### "Formulário fecha ao selecionar ficheiro"
- Já corrigido com `stopPropagation()` no DocumentUpload

## Resultado Esperado
- ✅ Upload de ficheiros funciona
- ✅ Edição mantém ficheiros existentes
- ✅ Visualização de ficheiros funciona
- ✅ Download de ficheiros funciona
- ✅ Formulário não fecha inesperadamente 