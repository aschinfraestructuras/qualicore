# 🔧 Guia Manual - Configurar Storage no Supabase

## 📋 **Problema Identificado:**
- Storage está disponível mas com políticas RLS restritivas
- Erro: "new row violates row-level security policy"
- Bucket "documentos" não existe

## 🎯 **Solução: Configuração Manual no Dashboard**

### **Passo 1: Acessar Supabase Dashboard**
1. Vá para [supabase.com](https://supabase.com)
2. Faça login na sua conta
3. Selecione o projeto **qualicore**

### **Passo 2: Ir para SQL Editor**
1. No menu lateral, clique em **"SQL Editor"**
2. Clique em **"New query"**

### **Passo 3: Executar Script de Configuração**
Cole e execute este SQL:

```sql
-- 1. Criar bucket de documentos
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'documentos',
  'documentos',
  false,
  52428800, -- 50MB
  ARRAY['application/pdf', 'image/*', 'text/*', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
)
ON CONFLICT (id) DO NOTHING;

-- 2. Configurar políticas RLS para storage.buckets
CREATE POLICY "Usuários autenticados podem ver buckets" ON storage.buckets
FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Usuários autenticados podem criar buckets" ON storage.buckets
FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Usuários autenticados podem atualizar buckets" ON storage.buckets
FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Usuários autenticados podem deletar buckets" ON storage.buckets
FOR DELETE USING (auth.role() = 'authenticated');

-- 3. Configurar políticas RLS para storage.objects
CREATE POLICY "Usuários autenticados podem ver objetos" ON storage.objects
FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Usuários autenticados podem inserir objetos" ON storage.objects
FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Usuários autenticados podem atualizar objetos" ON storage.objects
FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Usuários autenticados podem deletar objetos" ON storage.objects
FOR DELETE USING (auth.role() = 'authenticated');
```

### **Passo 4: Verificar Configuração**
Execute este SQL para verificar:

```sql
-- Verificar buckets
SELECT id, name, public, file_size_limit, created_at 
FROM storage.buckets 
ORDER BY created_at;

-- Verificar políticas
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd
FROM pg_policies 
WHERE schemaname = 'storage'
ORDER BY tablename, policyname;
```

### **Passo 5: Testar Upload**
Após configurar, execute este teste:

```javascript
// No console do navegador ou em um script
const testFile = new File(['Teste de upload'], 'teste.txt', { type: 'text/plain' });

const { data, error } = await supabase
  .storage
  .from('documentos')
  .upload('teste.txt', testFile);

if (error) {
  console.log('Erro:', error);
} else {
  console.log('Sucesso:', data);
}
```

## 🚀 **Alternativa Temporária: Desabilitar Upload**

Se não conseguir configurar o Storage agora, podemos **desabilitar temporariamente** o upload de documentos:

### **Opção 1: Comentar DocumentUpload nos formulários**
```tsx
// Em EnsaioForm.tsx e EnsaioCompactacaoForm.tsx
// Comentar estas linhas:
// import DocumentUpload from "../DocumentUpload";
// <DocumentUpload ... />
```

### **Opção 2: Criar versão sem upload**
```tsx
// Substituir DocumentUpload por:
<div className="text-gray-500 text-sm">
  Upload de documentos temporariamente desabilitado
</div>
```

## 📞 **Próximos Passos:**

1. **Execute o script SQL** no Supabase Dashboard
2. **Teste criar um ensaio** com documento
3. **Se funcionar**, ótimo! Storage configurado
4. **Se não funcionar**, desabilite temporariamente o upload

**Quer que eu ajude a desabilitar temporariamente o upload enquanto você configura o Storage?** 🤔 