# Guia para Configurar Storage no Supabase

## 🔍 **Onde Configurar Storage:**

### **1. No Supabase Dashboard:**
1. Acesse [supabase.com](https://supabase.com)
2. Faça login na sua conta
3. Selecione o projeto **qualicore**
4. No menu lateral esquerdo, clique em **"Storage"**

### **2. Verificar se Storage está ativo:**
- Se não aparecer "Storage" no menu, significa que não está ativo
- Storage é um recurso que precisa ser ativado

## 🔧 **Como Ativar Storage:**

### **Opção 1: Supabase Dashboard**
1. Vá para **Settings** → **General**
2. Procure por **"Storage"** ou **"File Storage"**
3. Ative o recurso se estiver disponível

### **Opção 2: Verificar Plano**
- Storage pode estar limitado no plano gratuito
- Verifique se o seu plano inclui Storage

## 🚀 **Configuração Manual via SQL:**

Se o Storage não estiver disponível, podemos **desabilitar temporariamente** o upload de documentos:

### **Solução Temporária:**
1. **Comentar o componente DocumentUpload** nos formulários
2. **Salvar apenas os dados** sem documentos
3. **Implementar upload depois** quando Storage estiver configurado

## 🧪 **Teste Rápido:**

Execute este SQL para verificar se Storage está disponível:

```sql
-- Verificar se storage está disponível
SELECT EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = 'storage' 
    AND table_name = 'buckets'
) as storage_available;

-- Verificar buckets existentes
SELECT name, public FROM storage.buckets;
```

## 📋 **Próximos Passos:**

1. **Verifique se Storage aparece** no menu do Supabase
2. **Se não aparecer**, ative o recurso
3. **Se não conseguir ativar**, vamos desabilitar temporariamente o upload
4. **Teste criar ensaio** sem documentos primeiro

## 🔍 **Onde Verificar:**

- **Menu lateral:** Storage
- **Settings:** General → Storage
- **Billing:** Verificar plano atual
- **SQL Editor:** Testar queries de storage

**Quer que eu ajude a verificar se Storage está disponível no seu projeto?** 🤔 