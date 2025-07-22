# 🔧 CORREÇÃO: Não Conformidades

## 📋 **Problema Identificado:**
- ❌ Não conformidades não conseguem ser salvas
- ❌ Erro ao guardar dados
- ❌ Campos de anexos não estão sendo salvos
- ❌ Não é possível editar registros criados

## ✅ **Correções Aplicadas:**

### 1. **API (src/lib/supabase-api.ts)**
- ✅ Adicionados campos `anexos_evidencia`, `anexos_corretiva`, `anexos_verificacao`, `timeline` à lista de `validFields`
- ✅ Corrigidas funções `create` e `update` da `naoConformidadesAPI`

### 2. **Frontend (src/pages/NaoConformidades.tsx)**
- ✅ Adicionados campos de anexos na função `handleSubmitNC`
- ✅ Incluídos `anexos_evidencia`, `anexos_corretiva`, `anexos_verificacao`, `timeline`

## 🧪 **Scripts de Teste Criados:**

### 1. **test-nao-conformidades-simples.cjs**
- Teste básico para verificar se consegue criar uma NC simples
- Verifica estrutura da tabela
- Testa inserção, busca e listagem

### 2. **test-nao-conformidades-anexos.cjs**
- Teste completo com anexos e timeline
- Verifica se os campos de anexos são salvos corretamente

### 3. **corrigir-tabela-nao-conformidades.sql**
- Script SQL para verificar e corrigir estrutura da tabela
- Adiciona campos de anexos se não existirem
- Configura RLS e políticas

## 🚀 **PRÓXIMOS PASSOS:**

### **Opção 1: Testar Correções (RECOMENDADO)**
1. **Execute o teste simples:**
   ```bash
   node test-nao-conformidades-simples.cjs
   ```

2. **Se funcionar, teste com anexos:**
   ```bash
   node test-nao-conformidades-anexos.cjs
   ```

3. **Teste no frontend:**
   - Vá para a página de Não Conformidades
   - Tente criar uma nova NC
   - Verifique se salva corretamente

### **Opção 2: Executar SQL de Correção**
1. **Copie o conteúdo de `corrigir-tabela-nao-conformidades.sql`**
2. **Cole no SQL Editor do Supabase Dashboard**
3. **Execute o script**

### **Opção 3: Verificar Estrutura da Tabela**
Execute no SQL Editor do Supabase:
```sql
-- Verificar estrutura atual
SELECT 
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'nao_conformidades' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- Verificar se campos de anexos existem
SELECT column_name, data_type
FROM information_schema.columns 
WHERE table_name = 'nao_conformidades' 
AND column_name IN ('anexos_evidencia', 'anexos_corretiva', 'anexos_verificacao', 'timeline');
```

## 🔍 **COMO VERIFICAR SE FUNCIONOU:**

### **Sinais de Sucesso:**
- ✅ Teste simples executa sem erros
- ✅ NC é criada e aparece na lista
- ✅ Campos de anexos são salvos
- ✅ É possível editar NCs existentes
- ✅ Não há erros no console do navegador

### **Sinais de Problema:**
- ❌ Erro ao executar testes
- ❌ NC não aparece na lista após criar
- ❌ Erro "Erro ao salvar não conformidade"
- ❌ Campos de anexos vazios após salvar

## 📞 **QUAL OPÇÃO VOCÊ QUER TENTAR?**

**Digite:**
- `teste` = Executar teste simples
- `sql` = Executar script SQL
- `frontend` = Testar no frontend
- `estrutura` = Verificar estrutura da tabela

**Ou execute diretamente:**
```bash
node test-nao-conformidades-simples.cjs
``` 