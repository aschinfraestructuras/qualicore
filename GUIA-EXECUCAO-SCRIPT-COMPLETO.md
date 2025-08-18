# Guia de Execução - Script Completo Normas e Submissão de Materiais

## 📋 Resumo

Este guia explica como executar o script SQL completo que cria todas as tabelas, funções e dados necessários para os módulos de **Normas** e **Submissão de Materiais**.

## 🎯 O que o Script Faz

### Tabelas Criadas:
1. **normas** - Sistema de normas técnicas
2. **versoes_normas** - Versões das normas
3. **aplicacoes_normas** - Aplicações das normas
4. **notificacoes_normas** - Notificações sobre normas
5. **submissoes_materiais** - Submissões de materiais
6. **workflows_aprovacao** - Workflows de aprovação
7. **etapas_workflow** - Etapas dos workflows
8. **historico_aprovacoes** - Histórico de aprovações
9. **comentarios_submissao** - Comentários nas submissões

### Funções Criadas:
- `get_normas_stats()` - Estatísticas de normas
- `get_submissoes_materiais_stats()` - Estatísticas de submissões

### Dados de Exemplo:
- **12 normas** (Eurocódigos, NP EN, etc.)
- **5 submissões de materiais** (betão, aço, agregados, etc.)
- **1 workflow padrão** de aprovação

## 🚀 Como Executar

### Passo 1: Aceder ao Supabase Dashboard
1. Abra o seu projeto no [Supabase Dashboard](https://supabase.com/dashboard)
2. Navegue para a secção **SQL Editor**

### Passo 2: Executar o Script
1. Abra o ficheiro `SCRIPT_COMPLETO_NORMAS_SUBMISSAO.sql`
2. Copie todo o conteúdo
3. Cole no **SQL Editor** do Supabase
4. Clique em **Run** para executar

### Passo 3: Verificar a Execução
Após a execução, deve ver a mensagem:
```
Script executado com sucesso!
Tabelas criadas: normas, versoes_normas, aplicacoes_normas, notificacoes_normas, submissoes_materiais, workflows_aprovacao, etapas_workflow, historico_aprovacoes, comentarios_submissao
Funções criadas: get_normas_stats(), get_submissoes_materiais_stats()
Dados de exemplo inseridos: 12 normas, 5 submissões de materiais, 1 workflow padrão
RLS ativado em todas as tabelas
Índices criados para otimização de performance
```

## ✅ Verificação

### Verificar Tabelas:
1. Vá para **Table Editor** no Supabase Dashboard
2. Confirme que as seguintes tabelas foram criadas:
   - `normas`
   - `submissoes_materiais`
   - `workflows_aprovacao`
   - (e outras tabelas relacionadas)

### Verificar Dados:
1. Clique na tabela `normas`
2. Deve ver **12 registos** de normas de exemplo
3. Clique na tabela `submissoes_materiais`
4. Deve ver **5 registos** de submissões de exemplo

### Verificar Funções:
1. Vá para **Database** > **Functions**
2. Confirme que existem:
   - `get_normas_stats`
   - `get_submissoes_materiais_stats`

## 🔧 Funcionalidades Implementadas

### Sistema de Normas:
- ✅ Gestão completa de normas técnicas
- ✅ Categorização por tipo e organismo
- ✅ Sistema de versões
- ✅ Aplicações e notificações
- ✅ Estatísticas automáticas

### Sistema de Submissão de Materiais:
- ✅ Submissão de materiais para aprovação
- ✅ Workflow de aprovação configurável
- ✅ Histórico de aprovações
- ✅ Sistema de comentários
- ✅ Estatísticas de performance

## 🎨 Interface do Utilizador

### Páginas Criadas:
1. **`/normas`** - Sistema de Normas
   - Listagem de normas
   - Filtros avançados
   - Formulário de criação/edição
   - Estatísticas

2. **`/submissao-materiais`** - Submissão de Materiais
   - Listagem de submissões
   - Filtros por estado e tipo
   - Formulário completo de submissão
   - Workflow de aprovação

### Navegação:
- ✅ Adicionado à sidebar (QUALIDADE)
- ✅ Adicionado à navbar (navegação rápida)
- ✅ Organizado por departamentos

## 🐛 Resolução de Problemas

### Se o script falhar:
1. **Verificar conectividade** - Certifique-se de que tem acesso ao Supabase
2. **Verificar permissões** - Confirme que tem permissões de administrador
3. **Executar por partes** - Divida o script em secções menores se necessário

### Se as páginas não carregarem:
1. **Verificar tabelas** - Confirme que as tabelas foram criadas
2. **Verificar RLS** - Confirme que as políticas RLS estão ativas
3. **Verificar funções** - Confirme que as funções de estatísticas existem

## 📊 Próximos Passos

Após a execução bem-sucedida:

1. **Testar as funcionalidades**:
   - Criar uma nova norma
   - Submeter um novo material
   - Testar os filtros e pesquisa

2. **Personalizar dados**:
   - Adicionar mais normas específicas
   - Configurar workflows personalizados
   - Ajustar categorias e tipos

3. **Integrar com outros módulos**:
   - Conectar com sistema de documentos
   - Integrar com notificações
   - Ligar com relatórios

## 🎉 Conclusão

Com este script, os módulos de **Normas** e **Submissão de Materiais** estarão completamente funcionais e integrados na aplicação Qualicore, seguindo os padrões de qualidade e arquitetura estabelecidos.
