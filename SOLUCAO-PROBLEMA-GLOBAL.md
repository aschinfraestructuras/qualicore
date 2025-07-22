# 🔧 SOLUÇÃO: Problema Global de Upload de Documentos

## 📋 **Problema Identificado:**
- Upload de documentos não funciona em nenhum módulo
- Documentos não são guardados na base de dados
- Botões "olho" aparecem mas não mostram documentos

## 🎯 **Solução em 3 Passos:**

### **PASSO 1: Executar Script SQL no Supabase**
1. Vá para [supabase.com](https://supabase.com)
2. Faça login e selecione o projeto **qualicore**
3. Vá para **SQL Editor**
4. Cole e execute o script `corrigir-storage-global.sql`

### **PASSO 2: Testar Upload com HTML**
1. Abra o ficheiro `test-storage-upload.html` no browser
2. Clique em "Testar Conexão Storage"
3. Tente fazer upload de um ficheiro
4. Verifique os logs para identificar problemas

### **PASSO 3: Testar no Aplicação**
1. Vá para `http://localhost:3005/rfis`
2. Crie um novo RFI
3. Tente fazer upload de um documento
4. Verifique o console do browser (F12) para logs

## 🔍 **Diagnóstico:**

### **Se o teste HTML funcionar mas a app não:**
- Problema está no código React
- Verificar logs no console do browser
- Verificar se `DocumentUpload` está a receber os dados

### **Se o teste HTML não funcionar:**
- Problema está no Supabase Storage
- Executar novamente o script SQL
- Verificar se o bucket 'documents' está público

### **Se aparecer erro de autenticação:**
- Fazer login na aplicação antes de testar
- Verificar se está em modo "demo" ou autenticado

## 📝 **Logs Importantes:**

### **No Console do Browser (F12):**
```
📁 Uploading: filename.pdf to path: rfi/new/filename.pdf
📁 User: user@email.com
📁 Upload success: {path: "rfi/new/filename.pdf"}
📁 URL data: {publicUrl: "https://..."}
📁 Novos documentos criados: [{id: "...", name: "...", url: "..."}]
📁 Documentos atualizados: [...]
```

### **No Supabase SQL Editor:**
```sql
-- Verificar bucket
SELECT * FROM storage.buckets WHERE name = 'documents';

-- Verificar políticas
SELECT * FROM pg_policies WHERE schemaname = 'storage' AND tablename = 'objects';

-- Verificar ficheiros
SELECT * FROM storage.objects WHERE bucket_id = 'documents';
```

## 🚨 **Problemas Comuns:**

### **1. Bucket não público:**
```sql
UPDATE storage.buckets SET public = true WHERE name = 'documents';
```

### **2. Políticas muito restritivas:**
```sql
-- Remover todas as políticas
DELETE FROM storage.policies WHERE bucket_id = 'documents';

-- Criar política permissiva
CREATE POLICY "Acesso total" ON storage.objects FOR ALL USING (bucket_id = 'documents');
```

### **3. Campo anexos não existe:**
```sql
-- Adicionar campo anexos em todas as tabelas
ALTER TABLE rfis ADD COLUMN IF NOT EXISTS anexos JSONB DEFAULT '[]';
ALTER TABLE nao_conformidades ADD COLUMN IF NOT EXISTS anexos_evidencia JSONB DEFAULT '[]';
```

## ✅ **Verificação Final:**

1. **Bucket público:** ✅
2. **Políticas permissivas:** ✅
3. **Upload funciona:** ✅
4. **Documentos guardados:** ✅
5. **Botão olho funciona:** ✅

## 🆘 **Se ainda não funcionar:**

1. **Limpar cache do browser**
2. **Reiniciar o servidor Vite** (`npm run dev`)
3. **Verificar se está autenticado**
4. **Testar em modo incógnito**
5. **Verificar logs de erro no console**

---

**🎯 Objetivo:** Ter upload de documentos funcionando em todos os módulos como funciona nos Ensaios. 