# 🚀 GUIA - SISTEMA DE SUBMISSÃO E APROVAÇÃO DE MATERIAIS

## 📋 Visão Geral

O **Sistema de Submissão e Aprovação de Materiais** é um módulo avançado do Qualicore que permite:

- **Submissão de materiais** para aprovação com workflow configurável
- **Gestão de prioridades** e urgências
- **Sistema de comentários** e histórico de aprovações
- **Integração com normas** e certificados
- **Relatórios e estatísticas** em tempo real
- **Exportação** para CSV e PDF

## 🗄️ PASSO 1: EXECUTAR SCRIPT SQL NO SUPABASE

### 1.1 Acesse o Supabase

1. Vá para [supabase.com](https://supabase.com)
2. Acesse seu projeto Qualicore
3. Vá para **SQL Editor**

### 1.2 Execute o Script

1. Abra o arquivo `supabase/migrations/009_create_submissao_materiais_tables.sql`
2. Copie todo o conteúdo
3. Cole no SQL Editor do Supabase
4. Clique em **Run**

**IMPORTANTE:** Este script cria:

- ✅ **5 tabelas principais** com relacionamentos
- ✅ **Índices otimizados** para performance
- ✅ **Políticas de segurança (RLS)** configuradas
- ✅ **Triggers automáticos** para auditoria
- ✅ **Função de estatísticas** avançada
- ✅ **Dados de exemplo** realistas

## 📊 ESTRUTURA CRIADA

### Tabelas Principais:

1. **`submissoes_materiais`** - Submissões de materiais
2. **`workflows_aprovacao`** - Workflows de aprovação
3. **`etapas_workflow`** - Etapas dos workflows
4. **`historico_aprovacoes`** - Histórico de aprovações
5. **`comentarios_submissao`** - Comentários das submissões

### Funcionalidades Implementadas:

- 🔐 **Row Level Security (RLS)** para todos os usuários
- 📈 **Função `get_submissoes_materiais_stats()`** para estatísticas
- 🔄 **Triggers automáticos** para `updated_at`
- 📝 **Dados de exemplo** com 5 submissões realistas
- 🏗️ **Workflow padrão** de aprovação configurado

## 🧪 PASSO 2: VERIFICAR IMPLEMENTAÇÃO

### 2.1 Verificar Tabelas

No SQL Editor, execute:

```sql
-- Verificar tabelas criadas
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name LIKE '%submissao%' OR table_name LIKE '%workflow%';

-- Verificar dados de exemplo
SELECT COUNT(*) as total_submissoes FROM submissoes_materiais;
SELECT COUNT(*) as total_workflows FROM workflows_aprovacao;
```

### 2.2 Verificar Políticas RLS

```sql
-- Verificar políticas de segurança
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename LIKE '%submissao%' OR tablename LIKE '%workflow%';
```

### 2.3 Testar Função de Estatísticas

```sql
-- Testar função de estatísticas
SELECT get_submissoes_materiais_stats();
```

## 🎯 PASSO 3: TESTAR NO FRONTEND

### 3.1 Acessar o Módulo

1. Execute `npm run dev`
2. Acesse `http://localhost:3003`
3. Faça login
4. No sidebar, clique em **"Submissão Materiais"**

### 3.2 Funcionalidades Disponíveis

- ✅ **Listagem** de submissões com filtros
- ✅ **Estatísticas** em tempo real
- ✅ **Detalhes** completos das submissões
- ✅ **Exportação** CSV/PDF
- ✅ **Pesquisa** e ordenação
- ✅ **Interface** moderna e responsiva

## 📈 DADOS DE EXEMPLO INCLUÍDOS

### Submissões Criadas:

1. **SM-2024-001** - Betão de Alta Resistência C50/60
2. **SM-2024-002** - Aço de Armadura B500B
3. **SM-2024-003** - Agregados para Betão
4. **SM-2024-004** - Sistema de Impermeabilização
5. **SM-2024-005** - Equipamento de Segurança

### Workflow Padrão:

- **Etapa 1:** Revisão Técnica (3 dias)
- **Etapa 2:** Aprovação Financeira (2 dias)
- **Etapa 3:** Aprovação Final (1 dia)

## 🔧 CONFIGURAÇÕES AVANÇADAS

### Personalizar Workflows

Para criar workflows personalizados:

```sql
INSERT INTO workflows_aprovacao (nome, descricao, etapas, aprovadores_por_etapa, tempo_limite_etapa, ativo, user_id) 
VALUES (
  'Workflow Personalizado',
  'Descrição do workflow',
  '[{"id": "etapa1", "nome": "Revisão", "ordem": 1}]',
  '{"etapa1": ["responsavel_tecnico"]}',
  '{"etapa1": 5}',
  true,
  (SELECT id FROM auth.users LIMIT 1)
);
```

### Adicionar Novos Tipos de Material

Para adicionar novos tipos:

```sql
-- Adicionar novo tipo (se necessário)
ALTER TABLE submissoes_materiais 
DROP CONSTRAINT submissoes_materiais_tipo_material_check;

ALTER TABLE submissoes_materiais 
ADD CONSTRAINT submissoes_materiais_tipo_material_check 
CHECK (tipo_material IN ('betao', 'aco', 'agregado', 'cimento', 'madeira', 'vidro', 'isolamento', 'impermeabilizacao', 'pavimento', 'sinalizacao', 'equipamento', 'ferramenta', 'novo_tipo', 'outro'));
```

## 🚨 TROUBLESHOOTING

### Problema: Erro de Permissão

```sql
-- Verificar se o usuário tem permissões
SELECT * FROM auth.users WHERE id = auth.uid();

-- Verificar políticas RLS
SELECT * FROM pg_policies WHERE tablename = 'submissoes_materiais';
```

### Problema: Dados não aparecem

```sql
-- Verificar se há dados
SELECT * FROM submissoes_materiais LIMIT 5;

-- Verificar se o user_id está correto
SELECT user_id, COUNT(*) FROM submissoes_materiais GROUP BY user_id;
```

### Problema: Função de estatísticas não funciona

```sql
-- Verificar se a função existe
SELECT routine_name FROM information_schema.routines 
WHERE routine_name = 'get_submissoes_materiais_stats';

-- Testar função manualmente
SELECT get_submissoes_materiais_stats();
```

## ✅ CONFIRMAÇÃO DE SUCESSO

Após executar o script, você deve ver:

```
✅ SISTEMA DE SUBMISSÃO E APROVAÇÃO DE MATERIAIS CRIADO COM SUCESSO!
📊 Tabelas criadas: submissoes_materiais, workflows_aprovacao, etapas_workflow, historico_aprovacoes, comentarios_submissao
🔐 Políticas de segurança (RLS) configuradas
📈 Função de estatísticas criada: get_submissoes_materiais_stats()
📝 Dados de exemplo inseridos: 5 submissões, 2 aprovações, 2 comentários
🚀 Sistema pronto para uso!
```

## 🎉 PRÓXIMOS PASSOS

1. **Testar o módulo** no frontend
2. **Criar submissões** de teste
3. **Configurar workflows** personalizados
4. **Integrar com outros módulos** (Normas, Materiais)
5. **Implementar notificações** de aprovação

---

**🎯 Sistema de Submissão e Aprovação de Materiais implementado com sucesso!**

O módulo está pronto para uso e integrado ao Qualicore. Todas as funcionalidades estão operacionais e os dados de exemplo permitem testar imediatamente todas as features.
