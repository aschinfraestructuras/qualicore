# Guia para Executar Script de Normas no Supabase

## 📋 Sistema Implementado

O **Sistema de Normas** foi implementado com as seguintes funcionalidades:

### 🗂️ Arquivos Criados:
- `src/types/normas.ts` - Tipos TypeScript
- `src/lib/supabase-api/normasAPI.ts` - API do Supabase
- `src/pages/Normas.tsx` - Página principal
- `src/components/NormasManager.tsx` - Componente reutilizável
- `supabase/migrations/008_create_normas_tables.sql` - Script SQL
- `executar-normas-supabase.cjs` - Script de execução

### 🗄️ Tabelas Criadas:
1. **normas** - Tabela principal de normas
2. **versoes_normas** - Versões das normas
3. **aplicacoes_normas** - Aplicações das normas
4. **notificacoes_normas** - Notificações sobre normas

## 🚀 Como Executar

### Opção 1: Via Supabase Dashboard (Recomendado)

1. **Acesse o Supabase Dashboard**
   - Vá para https://supabase.com/dashboard
   - Selecione o seu projeto

2. **Abra o SQL Editor**
   - No menu lateral, clique em "SQL Editor"
   - Clique em "New query"

3. **Cole o Script SQL**
   - Abra o arquivo `supabase/migrations/008_create_normas_tables.sql`
   - Copie todo o conteúdo
   - Cole no SQL Editor do Supabase

4. **Execute o Script**
   - Clique em "Run" para executar
   - Aguarde a conclusão

### Opção 2: Via Script Node.js

1. **Configure as Credenciais**
   - Abra `executar-normas-supabase.cjs`
   - Substitua `your-project.supabase.co` pela URL do seu projeto
   - Substitua `your-anon-key` pela chave anônima do seu projeto

2. **Execute o Script**
   ```bash
   node executar-normas-supabase.cjs
   ```

## 📊 Estrutura das Tabelas

### Tabela `normas`:
- `id` - UUID único
- `codigo` - Código da norma (ex: NP EN 206-1)
- `titulo` - Título da norma
- `descricao` - Descrição detalhada
- `categoria` - Categoria (Construção Civil, Ferroviária, etc.)
- `subcategoria` - Subcategoria
- `organismo` - Organismo normativo (IPQ, CEN, ISO, etc.)
- `versao` - Versão da norma
- `data_publicacao` - Data de publicação
- `data_entrada_vigor` - Data de entrada em vigor
- `status` - Status (ATIVA, REVOGADA, EM_REVISAO)
- `escopo` - Escopo da norma
- `aplicabilidade` - Array de aplicabilidades
- `requisitos_principais` - Array de requisitos
- `metodos_ensaio` - Array de métodos de ensaio
- `limites_aceitacao` - JSONB com limites
- `documentos_relacionados` - Array de documentos
- `observacoes` - Observações
- `tags` - Array de tags
- `prioridade` - Prioridade (BAIXA, MEDIA, ALTA, CRITICA)

### Tabela `versoes_normas`:
- `id` - UUID único
- `norma_id` - Referência à norma
- `versao` - Versão específica
- `data_publicacao` - Data de publicação
- `data_entrada_vigor` - Data de entrada em vigor
- `alteracoes_principais` - Array de alterações
- `status` - Status da versão
- `documento_url` - URL do documento
- `observacoes` - Observações

### Tabela `aplicacoes_normas`:
- `id` - UUID único
- `norma_id` - Referência à norma
- `modulo_id` - ID do módulo
- `modulo_tipo` - Tipo do módulo
- `aplicabilidade` - Tipo de aplicabilidade
- `requisitos_especificos` - Array de requisitos
- `verificacoes_necessarias` - Array de verificações
- `frequencia_verificacao` - Frequência
- `responsavel_verificacao` - Responsável

### Tabela `notificacoes_normas`:
- `id` - UUID único
- `norma_id` - Referência à norma
- `tipo` - Tipo de notificação
- `titulo` - Título da notificação
- `mensagem` - Mensagem
- `prioridade` - Prioridade
- `destinatarios` - Array de destinatários
- `lida` - Se foi lida
- `data_envio` - Data de envio
- `data_leitura` - Data de leitura

## 🔐 Políticas RLS (Row Level Security)

O script inclui políticas RLS para:
- **Usuários autenticados** podem ler todas as normas
- **Usuários autenticados** podem criar/editar normas
- **Usuários autenticados** podem excluir normas

## 📈 Dados de Exemplo

O script inclui **12 normas de exemplo**:
- **Betão Estrutural** (NP EN 206-1, NP EN 1992-1-1)
- **Solos e Fundações** (NP EN 1997-1, NP EN ISO 14688-1)
- **Ferroviária** (NP EN 13848-1, NP EN 14363)
- **Aços e Armaduras** (NP EN 10080, NP EN 10025-1)
- **Segurança** (NP EN 1990, NP EN 1991-1-1)
- **Qualidade** (NP EN ISO 9001, NP EN ISO 14001)

## ✅ Verificação Pós-Execução

Após executar o script, verifique:

1. **Tabelas Criadas**
   - Vá para "Table Editor" no Supabase
   - Confirme que as 4 tabelas foram criadas

2. **Dados de Exemplo**
   - Verifique se há 12 registros na tabela `normas`
   - Confirme se há versões e aplicações associadas

3. **Políticas RLS**
   - Vá para "Authentication" > "Policies"
   - Confirme que as políticas foram criadas

4. **Função de Estatísticas**
   - Vá para "Database" > "Functions"
   - Confirme que `get_normas_stats` foi criada

## 🎯 Funcionalidades Disponíveis

Após a execução, o módulo de Normas oferece:

- ✅ **Listagem completa** de normas
- ✅ **Pesquisa avançada** por categoria, organismo, status
- ✅ **Filtros múltiplos** e ordenação
- ✅ **Estatísticas** em tempo real
- ✅ **Exportação** para CSV e PDF
- ✅ **Gestão de versões** das normas
- ✅ **Aplicações** em módulos específicos
- ✅ **Notificações** sobre alterações
- ✅ **Interface moderna** e responsiva

## 🚨 Solução de Problemas

### Erro: "Tabela não existe"
- Verifique se o script foi executado completamente
- Confirme se não há erros no console do Supabase

### Erro: "Política RLS não encontrada"
- Execute novamente a seção de políticas RLS
- Verifique se o usuário está autenticado

### Erro: "Função não encontrada"
- Execute novamente a seção de funções
- Verifique se a função `get_normas_stats` foi criada

## 📞 Suporte

Se encontrar problemas:
1. Verifique os logs no console do Supabase
2. Confirme se todas as tabelas foram criadas
3. Teste a conexão com a API

---

**✅ Sistema de Normas pronto para uso!**
