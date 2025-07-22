# Correção do Sistema de Ensaios

## Problemas Identificados

1. **Tabela `ensaios` pode não existir ou estar incompleta**
2. **Bucket de storage `documents` pode não estar configurado**
3. **Documentos não estão sendo salvos junto com os ensaios**
4. **Falta de campos na tabela para armazenar documentos**

## Soluções

### 1. Corrigir a Tabela de Ensaios

Execute o script `fix-ensaios-table.sql` no SQL Editor do Supabase:

```sql
-- Este script irá:
-- - Criar a tabela ensaios se não existir
-- - Adicionar colunas para documentos, seguimento e contexto
-- - Configurar índices e triggers
-- - Configurar RLS (Row Level Security)
```

### 2. Configurar o Bucket de Storage

Execute o script `setup-storage-bucket.sql` no SQL Editor do Supabase:

```sql
-- Este script irá:
-- - Criar o bucket 'documents' se não existir
-- - Configurar políticas de acesso
-- - Definir limites de tamanho e tipos de arquivo
```

### 3. Testar o Sistema

Execute o script de teste `test-ensaios-system.js`:

```bash
node test-ensaios-system.js
```

## Passos para Executar

### Passo 1: Verificar Tabela
Execute no SQL Editor do Supabase:
```sql
-- Verificar se a tabela existe
SELECT EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'ensaios'
) as table_exists;
```

### Passo 2: Executar Correções
1. Abra o SQL Editor no Supabase Dashboard
2. Execute o conteúdo do arquivo `fix-ensaios-table.sql`
3. Execute o conteúdo do arquivo `setup-storage-bucket.sql`

### Passo 3: Verificar Configuração
Execute no SQL Editor:
```sql
-- Verificar estrutura da tabela
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'ensaios' 
ORDER BY ordinal_position;

-- Verificar bucket
SELECT name, public FROM storage.buckets WHERE name = 'documents';
```

## Campos Adicionados à Tabela

- `documents` (JSONB): Array de documentos carregados
- `seguimento` (JSONB): Array de linhas de seguimento
- `contextoAdicional` (JSONB): Array de campos de contexto

## Estrutura dos Documentos

```json
{
  "id": "path/to/file",
  "name": "documento.pdf",
  "url": "https://...",
  "type": "application/pdf",
  "size": 1024000,
  "uploaded_at": "2024-01-15T10:30:00Z"
}
```

## Verificação Final

Após executar os scripts:

1. **Teste o formulário**: Tente criar um novo ensaio
2. **Teste o upload**: Carregue um documento PDF ou imagem
3. **Teste o salvamento**: Verifique se o ensaio é salvo com sucesso
4. **Teste a visualização**: Verifique se os documentos aparecem na lista

## Troubleshooting

### Erro: "Tabela não existe"
- Execute o script `fix-ensaios-table.sql`

### Erro: "Bucket não encontrado"
- Execute o script `setup-storage-bucket.sql`

### Erro: "Permissão negada"
- Verifique se o RLS está configurado corretamente
- Verifique se o usuário está autenticado

### Erro: "Upload falhou"
- Verifique se o bucket está público
- Verifique se as políticas de storage estão corretas

## Logs de Debug

Para verificar se tudo está funcionando, abra o Console do navegador (F12) e procure por:

- Mensagens de erro do Supabase
- Logs de upload de documentos
- Erros de validação do formulário

## Contato

Se os problemas persistirem, verifique:
1. Configuração do Supabase no arquivo `.env`
2. Permissões do usuário no Supabase
3. Configuração de CORS no Supabase 

##  **Onde Verificar o Storage:**

### **1. No Supabase Dashboard:**
1. Acesse [supabase.com](https://supabase.com)
2. Faça login na sua conta
3. Selecione o projeto **qualicore**
4. **No menu lateral esquerdo**, procure por **"Storage"**

### **2. Se não aparecer "Storage":**
- Storage pode não estar ativo
- Pode estar limitado no plano gratuito
- Pode precisar ser ativado manualmente

## 🧪 **Teste Rápido:**

Execute este SQL no **SQL Editor** para verificar:

```sql
<code_block_to_apply_changes_from>
```

## 🔧 **Solução Temporária:**

Se o Storage não estiver disponível, vou **desabilitar temporariamente** o upload de documentos para que você possa salvar os ensaios:

```sql
-- Verificar se storage está disponível
SELECT EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = 'storage' 
    AND table_name = 'buckets'
) as storage_available;
``` 