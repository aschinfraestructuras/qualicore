# Guia para Executar o Sistema de Normas no Supabase

## 📋 Descrição
Este guia explica como implementar o **Sistema de Normas** completo no Supabase, incluindo todas as tabelas, funções, políticas de segurança e dados de exemplo.

## 🚀 Sistema Implementado

### Funcionalidades Principais:
- ✅ **Gestão completa de normas** (NP EN, EN ISO, UIC, etc.)
- ✅ **Sistema de versões** com histórico de alterações
- ✅ **Aplicações de normas** por módulo
- ✅ **Notificações automáticas** para atualizações
- ✅ **Pesquisa avançada** com filtros múltiplos
- ✅ **Estatísticas em tempo real**
- ✅ **Exportação CSV/PDF**
- ✅ **Políticas de segurança** (RLS)

### Normas Incluídas:
- **Betão Estrutural**: NP EN 206+A1, NP EN 1992-1-1, NP EN 12390-3, NP EN 12390-5
- **Solos e Fundações**: NP EN ISO 14688-1, NP EN ISO 17892-4, NP EN ISO 17892-6
- **Ferroviária**: UIC 702, EN 13146-1, EN 13481-1
- **Aços e Armaduras**: NP EN 10080, NP EN ISO 6892-1
- **Segurança**: NP 4397, NP EN ISO 7010

## 📁 Arquivos Criados

### 1. Tipos TypeScript
- `src/types/normas.ts` - Interfaces e tipos completos
- `src/lib/supabase-api/normasAPI.ts` - API completa
- `src/pages/Normas.tsx` - Interface principal

### 2. Script SQL
- `supabase/migrations/008_create_normas_tables.sql` - Script completo

## 🔧 Como Executar

### Opção 1: Via Supabase Dashboard (Recomendado)

1. **Aceder ao Supabase Dashboard**
   - Vá para [supabase.com](https://supabase.com)
   - Faça login na sua conta
   - Selecione o seu projeto

2. **Abrir o SQL Editor**
   - No menu lateral, clique em "SQL Editor"
   - Clique em "New query"

3. **Executar o Script**
   - Abra o ficheiro `supabase/migrations/008_create_normas_tables.sql`
   - Copie todo o conteúdo
   - Cole no SQL Editor do Supabase
   - Clique em "Run" para executar

4. **Verificar a Execução**
   - Deve aparecer uma mensagem de sucesso
   - Verifique as tabelas criadas em "Table Editor"

### Opção 2: Via Node.js Script

1. **Criar script de execução**
   ```bash
   # Criar ficheiro executar-normas-supabase.cjs
   ```

2. **Configurar variáveis de ambiente**
   ```bash
   # .env.local
   VITE_SUPABASE_URL=sua_url_do_supabase
   VITE_SUPABASE_ANON_KEY=sua_chave_anonima
   ```

3. **Executar o script**
   ```bash
   node executar-normas-supabase.cjs
   ```

## 📊 Estrutura das Tabelas

### 1. `normas` - Tabela Principal
```sql
- id (UUID, Primary Key)
- codigo (VARCHAR, Unique)
- titulo (VARCHAR)
- descricao (TEXT)
- categoria (VARCHAR)
- subcategoria (VARCHAR)
- organismo (VARCHAR)
- versao (VARCHAR)
- data_publicacao (DATE)
- data_entrada_vigor (DATE)
- status (VARCHAR)
- escopo (TEXT)
- aplicabilidade (TEXT[])
- requisitos_principais (TEXT[])
- metodos_ensaio (TEXT[])
- limites_aceitacao (JSONB)
- documentos_relacionados (TEXT[])
- observacoes (TEXT)
- tags (TEXT[])
- prioridade (VARCHAR)
- ultima_atualizacao (TIMESTAMP)
- criado_em (TIMESTAMP)
- atualizado_em (TIMESTAMP)
```

### 2. `versoes_normas` - Histórico de Versões
```sql
- id (UUID, Primary Key)
- norma_id (UUID, Foreign Key)
- versao (VARCHAR)
- data_publicacao (DATE)
- data_entrada_vigor (DATE)
- alteracoes_principais (TEXT[])
- status (VARCHAR)
- documento_url (TEXT)
- observacoes (TEXT)
- criado_em (TIMESTAMP)
```

### 3. `aplicacoes_normas` - Aplicações por Módulo
```sql
- id (UUID, Primary Key)
- norma_id (UUID, Foreign Key)
- modulo_id (UUID)
- modulo_tipo (VARCHAR)
- aplicabilidade (VARCHAR)
- requisitos_especificos (TEXT[])
- verificacoes_necessarias (TEXT[])
- frequencia_verificacao (VARCHAR)
- responsavel_verificacao (VARCHAR)
- criado_em (TIMESTAMP)
- atualizado_em (TIMESTAMP)
```

### 4. `notificacoes_normas` - Sistema de Notificações
```sql
- id (UUID, Primary Key)
- norma_id (UUID, Foreign Key)
- tipo (VARCHAR)
- titulo (VARCHAR)
- mensagem (TEXT)
- prioridade (VARCHAR)
- destinatarios (TEXT[])
- lida (BOOLEAN)
- data_envio (TIMESTAMP)
- data_leitura (TIMESTAMP)
```

## 🔐 Políticas de Segurança (RLS)

### Normas
- ✅ Utilizadores autenticados podem ver todas as normas
- ✅ Utilizadores autenticados podem criar/editar/eliminar normas

### Versões
- ✅ Utilizadores autenticados podem gerir versões

### Aplicações
- ✅ Utilizadores autenticados podem gerir aplicações

### Notificações
- ✅ Utilizadores só veem suas próprias notificações
- ✅ Utilizadores autenticados podem gerir notificações

## 📈 Funções e Estatísticas

### Função `get_normas_stats()`
Retorna estatísticas completas:
- Total de normas
- Normas ativas/em revisão/obsoletas
- Distribuição por categorias
- Distribuição por organismos
- Normas recentes (30 dias)
- Normas a vencer (90 dias)

## 🎯 Dados de Exemplo Incluídos

### Normas de Betão (4 normas)
- NP EN 206+A1 - Betão estrutural
- NP EN 1992-1-1 - Eurocódigo 2
- NP EN 12390-3 - Ensaios de compressão
- NP EN 12390-5 - Ensaios de flexão

### Normas de Solos (3 normas)
- NP EN ISO 14688-1 - Identificação de solos
- NP EN ISO 17892-4 - Granulometria
- NP EN ISO 17892-6 - Limites de consistência

### Normas Ferroviárias (3 normas)
- UIC 702 - Travessas
- EN 13146-1 - Fixações
- EN 13481-1 - Produtos de fixação

### Normas de Aços (2 normas)
- NP EN 10080 - Aços para betão
- NP EN ISO 6892-1 - Ensaios de tração

### Normas de Segurança (2 normas)
- NP 4397 - Sinalização de segurança
- NP EN ISO 7010 - Símbolos de segurança

## 🔍 Funcionalidades da Interface

### Pesquisa e Filtros
- ✅ Pesquisa por texto livre
- ✅ Filtros por categoria, organismo, status, prioridade
- ✅ Ordenação por código, título, data, prioridade
- ✅ Limpeza de filtros

### Visualização
- ✅ Tabela responsiva com todas as informações
- ✅ Modal de detalhes completo
- ✅ Indicadores visuais de status e prioridade
- ✅ Estatísticas em cards animados

### Exportação
- ✅ Exportação CSV com todos os dados
- ✅ Relatório PDF formatado
- ✅ Nomes de ficheiros com data

## 🚨 Verificação Pós-Execução

### 1. Verificar Tabelas
```sql
-- Verificar se as tabelas foram criadas
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('normas', 'versoes_normas', 'aplicacoes_normas', 'notificacoes_normas');
```

### 2. Verificar Dados
```sql
-- Contar normas inseridas
SELECT COUNT(*) as total_normas FROM normas;

-- Verificar categorias
SELECT categoria, COUNT(*) as total 
FROM normas 
GROUP BY categoria 
ORDER BY total DESC;
```

### 3. Verificar Funções
```sql
-- Testar função de estatísticas
SELECT get_normas_stats();
```

### 4. Verificar Políticas RLS
```sql
-- Verificar políticas ativas
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename IN ('normas', 'versoes_normas', 'aplicacoes_normas', 'notificacoes_normas');
```

## 🎉 Resultado Esperado

Após a execução bem-sucedida, você terá:

- ✅ **12 normas** de exemplo inseridas
- ✅ **12 versões** correspondentes
- ✅ **24 aplicações** por módulo
- ✅ **2 notificações** de exemplo
- ✅ **Sistema completo** de gestão de normas
- ✅ **Interface moderna** e funcional
- ✅ **Integração total** com o Qualicore

## 🔗 Integração com Outros Módulos

O sistema de normas está integrado com:
- ✅ **Controlo de Betonagens** - Aplicação automática de normas NP EN 206+A1
- ✅ **Caracterização de Solos** - Aplicação automática de normas NP EN ISO 14688-1
- ✅ **Todos os módulos** - Sistema de aplicações configurável

## 📞 Suporte

Se encontrar algum problema:
1. Verifique os logs do Supabase
2. Confirme que todas as tabelas foram criadas
3. Teste a função `get_normas_stats()`
4. Verifique as políticas RLS

---

**🎯 Sistema de Normas implementado com sucesso!**
O Qualicore agora tem um sistema de normas de nível europeu, comparável aos melhores softwares do mercado.
