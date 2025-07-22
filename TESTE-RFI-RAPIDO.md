# 🧪 TESTE RÁPIDO: RFI com Documentos

## 🎯 **Passo 1: Executar Script SQL**
1. Vá para [supabase.com](https://supabase.com)
2. SQL Editor → New Query
3. Cole e execute: `test-rfi-documents.sql`

## 🎯 **Passo 2: Verificar na Aplicação**
1. Vá para `http://localhost:3005/rfis`
2. Procure por **"RFI-TESTE-001"**
3. Clique no **botão olho (azul)**
4. Deve aparecer 2 documentos de teste

## 🎯 **Passo 3: Testar Upload Real**
1. Clique em **"Novo RFI"**
2. Preencha os campos obrigatórios
3. Na secção **"Anexos (Documentos)"**
4. Faça upload de um ficheiro
5. Clique em **"Salvar RFI"**
6. Verifique se aparece na lista
7. Clique no **botão olho**

## 🔍 **Logs para Verificar (F12):**

### **No Console do Browser:**
```
📋 RFIs carregados: [...]
📋 Primeiro RFI: {...}
📋 Campo documents do primeiro RFI: [...]
👁️ Clicou no botão olho para RFI: {...}
📁 Documents do RFI: [...]
📁 Tem documentos?: true/false
```

### **Se o RFI de teste não aparecer:**
- Problema está no carregamento da base de dados
- Verificar se o script SQL foi executado

### **Se o RFI aparecer mas sem documentos:**
- Problema está no campo `documents`
- Verificar se o campo existe na tabela

### **Se o upload não funcionar:**
- Problema está no `DocumentUpload`
- Verificar logs de upload no console

## ✅ **Resultado Esperado:**
- RFI-TESTE-001 aparece na lista
- Botão olho mostra 2 documentos
- Upload de novo RFI funciona
- Documentos são guardados e visíveis

---

**🎯 Objetivo:** Confirmar que o campo `documents` funciona no RFI como funciona nos Ensaios. 