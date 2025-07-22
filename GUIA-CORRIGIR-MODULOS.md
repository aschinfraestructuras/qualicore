# 🔧 GUIA: Corrigir Problemas dos Módulos

## 📋 **Situação Atual:**
- ✅ **Ensaios funciona** (tem dados e consegue salvar)
- ❌ **Outros módulos não funcionam** (tabelas vazias, não consegue salvar)

## 🎯 **PROBLEMA IDENTIFICADO:**
O problema mais provável é que **as políticas RLS (Row Level Security) não estão configuradas corretamente** para todos os módulos, exceto Ensaios.

## 🚀 **SOLUÇÃO PASSO A PASSO:**

### **PASSO 1: Executar Script de Correção**

1. **Vá para o Supabase Dashboard:**
   - Aceda a https://supabase.com/dashboard
   - Selecione o seu projeto

2. **Abra o SQL Editor:**
   - No menu lateral, clique em "SQL Editor"
   - Clique em "New query"

3. **Execute o script de correção:**
   - Abra o ficheiro `corrigir-problemas-modulos.sql`
   - Copie todo o conteúdo
   - Cole no SQL Editor
   - Clique em "Run" (▶️)

### **PASSO 2: Verificar se Funcionou**

1. **Execute o script de verificação:**
   - Abra o ficheiro `verificar-problemas-modulos.sql`
   - Copie todo o conteúdo
   - Cole no SQL Editor
   - Clique em "Run" (▶️)

2. **Verifique os resultados:**
   - Todas as tabelas devem aparecer como "✅ Existe"
   - Deve haver políticas RLS para cada tabela
   - Índices devem estar criados

### **PASSO 3: Testar no Frontend**

1. **Faça login na aplicação:**
   - Aceda a http://localhost:3005
   - Faça login com as suas credenciais

2. **Teste cada módulo:**
   - **Obras:** Tente criar uma nova obra
   - **Fornecedores:** Tente criar um novo fornecedor
   - **Materiais:** Tente criar um novo material
   - **Checklists:** Tente criar um novo checklist
   - **Documentos:** Tente criar um novo documento
   - **Não Conformidades:** Tente criar uma nova não conformidade
   - **RFIs:** Tente criar um novo RFI

## 🔍 **O QUE O SCRIPT FAZ:**

### **1. Habilita RLS em todas as tabelas**
```sql
ALTER TABLE obras ENABLE ROW LEVEL SECURITY;
ALTER TABLE fornecedores ENABLE ROW LEVEL SECURITY;
-- etc...
```

### **2. Cria políticas RLS para cada tabela**
```sql
-- Política para SELECT
CREATE POLICY "Obras: usuário pode ver suas obras" ON obras
  FOR SELECT USING (auth.uid() = user_id);

-- Política para INSERT
CREATE POLICY "Obras: usuário pode inserir suas obras" ON obras
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- etc...
```

### **3. Corrige valores padrão**
```sql
ALTER TABLE obras ALTER COLUMN fornecedores_principais SET DEFAULT '{}';
ALTER TABLE obras ALTER COLUMN valor_contrato SET DEFAULT 0;
-- etc...
```

### **4. Cria índices para performance**
```sql
CREATE INDEX IF NOT EXISTS idx_obras_user_id ON obras(user_id);
CREATE INDEX IF NOT EXISTS idx_obras_codigo ON obras(codigo);
-- etc...
```

## 🚨 **SE AINDA NÃO FUNCIONAR:**

### **Problema 1: Erro de permissão**
**Solução:** Execute o script novamente

### **Problema 2: Erro de estrutura de tabela**
**Solução:** Execute o script `supabase-migration-complete.sql` novamente

### **Problema 3: Erro de autenticação**
**Solução:** Verifique se está logado na aplicação

## 📊 **VERIFICAÇÃO FINAL:**

Após executar os scripts, deve conseguir:

1. ✅ **Criar** novos registros em todos os módulos
2. ✅ **Editar** registros existentes
3. ✅ **Deletar** registros
4. ✅ **Ver** apenas os seus próprios dados
5. ✅ **Filtrar** e **pesquisar** dados

## 🎯 **PRÓXIMOS PASSOS:**

1. **Execute o script de correção**
2. **Teste cada módulo**
3. **Se funcionar:** Pronto! Todos os módulos devem funcionar
4. **Se não funcionar:** Me informe qual erro específico aparece

## 📞 **PRECISA DE AJUDA?**

Se encontrar algum erro específico, copie a mensagem de erro e me envie para que eu possa ajudar a resolver. 