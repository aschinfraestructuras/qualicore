# 🐛 DEBUG: Formulário Fecha ao Fazer Upload

## 🎯 **Problema Identificado:**
- Formulário fecha quando faz upload de documento
- Não guarda os dados
- Vai para a lista sem salvar

## 🔍 **Passos para Debug:**

### **1. Teste o Botão Verde**
1. Vá para `http://localhost:3005/rfis`
2. Clique em **"Novo RFI"**
3. Clique no **botão verde "Teste DocumentUpload"**
4. Deve aparecer toast "DocumentUpload funcionando!"
5. Se aparecer, o componente está OK

### **2. Teste Upload Simples**
1. No mesmo formulário
2. Clique na área de upload
3. Selecione um ficheiro pequeno (1KB)
4. **NÃO clique em "Salvar RFI" ainda**
5. Verifique o console (F12) para logs

### **3. Logs para Verificar:**

#### **Se o formulário fechar imediatamente:**
```
🚨 Modal fechando!
```
- Problema: Modal está a fechar por algum motivo

#### **Se aparecer erro no upload:**
```
📁 Upload error: {...}
📁 Error details: {...}
```
- Problema: Erro no Supabase Storage

#### **Se o upload funcionar mas não guardar:**
```
🚀 onSubmitForm chamado!
🚀 Formulário RFI submetido!
📁 Documents do DocumentUpload: [...]
🚀 Chamando onSubmit com dados: {...}
```
- Problema: Erro na API ou base de dados

## 🚨 **Possíveis Causas:**

### **1. Erro no Upload:**
- Storage não configurado
- Políticas muito restritivas
- Erro de autenticação

### **2. Erro no Formulário:**
- Validação falhando
- Campo obrigatório em falta
- Erro de tipo de dados

### **3. Erro na API:**
- Campo `documents` não existe na tabela
- Erro de constraint
- Timeout

## 🛠️ **Soluções:**

### **Se for erro de Storage:**
```sql
-- Executar no Supabase
UPDATE storage.buckets SET public = true WHERE name = 'documents';
```

### **Se for erro de campo:**
```sql
-- Verificar se campo existe
SELECT column_name FROM information_schema.columns 
WHERE table_name = 'rfis' AND column_name = 'documents';
```

### **Se for erro de validação:**
- Verificar se todos os campos obrigatórios estão preenchidos
- Verificar se o código é único

## 📝 **Teste Final:**

1. **Abra o console (F12)**
2. **Crie novo RFI**
3. **Preencha todos os campos obrigatórios**
4. **Clique no botão verde de teste**
5. **Faça upload de um ficheiro**
6. **Verifique todos os logs**
7. **Clique em "Salvar RFI"**

**Me diga exatamente quais logs aparecem no console!** 🔍 