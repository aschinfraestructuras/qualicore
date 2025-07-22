# 🔧 GUIA: Corrigir Documentos e Botões nos Módulos

## 📋 **PROBLEMAS IDENTIFICADOS:**
1. ❌ **Erro 404 ao descarregar ficheiros** - Ficheiros não encontrados no Supabase Storage
2. ❌ **Botões de visualizar/descarregar não aparecem** em todos os módulos
3. ❌ **Apenas o módulo Ensaios funciona** corretamente

## 🎯 **CAUSA DOS PROBLEMAS:**
- **Bucket de Storage não configurado** corretamente
- **Políticas RLS** muito restritivas para documentos
- **Campos de documentos** não existem em todas as tabelas
- **Componente DocumentUpload** não está integrado em todos os módulos

## 🚀 **SOLUÇÃO PASSO A PASSO:**

### **PASSO 1: Executar Correção de Storage**

1. **Vá para o Supabase Dashboard:**
   - Aceda a https://supabase.com/dashboard
   - Selecione o seu projeto

2. **Abra o SQL Editor:**
   - No menu lateral, clique em "SQL Editor"
   - Clique em "New query"

3. **Execute o script de correção:**
   - Abra o ficheiro `corrigir-documentos-botoes.sql`
   - Copie todo o conteúdo
   - Cole no SQL Editor
   - Clique em "Run" (▶️)

### **PASSO 2: Adicionar Campos de Documentos**

1. **Execute o script de campos:**
   - Abra o ficheiro `adicionar-documentupload-todos-modulos.sql`
   - Copie todo o conteúdo
   - Cole no SQL Editor
   - Clique em "Run" (▶️)

### **PASSO 3: Verificar se Funcionou**

1. **Execute o script de verificação:**
   - Abra o ficheiro `verificar-problemas-modulos.sql`
   - Copie todo o conteúdo
   - Cole no SQL Editor
   - Clique em "Run" (▶️)

## 🔍 **O QUE OS SCRIPTS FAZEM:**

### **Script 1: `corrigir-documentos-botoes.sql`**
```sql
-- 1. Cria bucket 'documents' público
-- 2. Configura políticas de storage permissivas
-- 3. Adiciona colunas de documentos nas tabelas
-- 4. Permite acesso público aos documentos
```

### **Script 2: `adicionar-documentupload-todos-modulos.sql`**
```sql
-- 1. Adiciona campo 'documents' em todas as tabelas
-- 2. Adiciona campos específicos de anexos
-- 3. Garante que todos os módulos têm campos para documentos
```

## 🧪 **TESTE APÓS EXECUTAR OS SCRIPTS:**

### **Teste 1: Upload de Documento**
1. Vá para qualquer módulo (ex: Obras)
2. Clique em "Nova Obra"
3. Tente carregar um documento
4. **Deve funcionar** sem erro

### **Teste 2: Visualizar Documento**
1. Após carregar um documento
2. Clique no botão **👁️ (olho)** para visualizar
3. **Deve abrir** o documento no navegador

### **Teste 3: Descarregar Documento**
1. Clique no botão **⬇️ (seta)** para descarregar
2. **Deve descarregar** o ficheiro sem erro 404

## 🚨 **SE AINDA NÃO FUNCIONAR:**

### **Problema 1: Erro de permissão**
**Solução:** Execute o script `corrigir-problemas-modulos.sql` novamente

### **Problema 2: Bucket não existe**
**Solução:** Verifique se Storage está ativo no projeto Supabase

### **Problema 3: Botões não aparecem**
**Solução:** Verifique se o componente DocumentUpload está integrado

## 📊 **VERIFICAÇÃO FINAL:**

Após executar os scripts, deve conseguir:

1. ✅ **Carregar** documentos em todos os módulos
2. ✅ **Visualizar** documentos (botão olho)
3. ✅ **Descarregar** documentos (botão seta)
4. ✅ **Não ter erros 404** ao aceder aos ficheiros
5. ✅ **Ver botões** em todos os módulos

## 🎯 **PRÓXIMOS PASSOS:**

1. **Execute os scripts** na ordem indicada
2. **Teste cada módulo** individualmente
3. **Se funcionar:** Pronto! Todos os módulos devem ter documentos funcionais
4. **Se não funcionar:** Me informe qual erro específico aparece

## 📞 **PRECISA DE AJUDA?**

Se encontrar algum erro específico:
1. **Copie a mensagem de erro** exata
2. **Indique em que módulo** está a testar
3. **Indique que ação** estava a tentar fazer
4. **Envie-me** para que eu possa ajudar a resolver

## 🔧 **COMANDOS ÚTEIS PARA DEBUG:**

### **Verificar buckets:**
```sql
SELECT * FROM storage.buckets;
```

### **Verificar políticas:**
```sql
SELECT * FROM pg_policies WHERE schemaname = 'storage';
```

### **Verificar colunas:**
```sql
SELECT table_name, column_name 
FROM information_schema.columns 
WHERE column_name LIKE '%document%' OR column_name LIKE '%anexo%';
``` 