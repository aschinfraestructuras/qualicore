# Guia para Executar Script de Caracterização de Solos na Supabase

## 📋 Pré-requisitos

1. **Acesso à Supabase**: Ter acesso ao painel de administração da Supabase
2. **Função exec_sql**: Ter a função `exec_sql` configurada no Supabase (se não tiver, ver instruções abaixo)
3. **Variáveis de Ambiente**: Configurar as variáveis de ambiente necessárias

## 🚀 Opções de Execução

### Opção 1: Execução Completa (Recomendada)

Execute o script completo de uma vez:

```bash
node executar-solos-supabase.cjs
```

### Opção 2: Execução Direta

Execute comandos individuais:

```bash
node executar-solos-direto.cjs
```

### Opção 3: Execução Manual no Painel Supabase

1. Aceda ao painel da Supabase
2. Vá para **SQL Editor**
3. Cole o conteúdo do arquivo `supabase/migrations/007_create_solos_tables.sql`
4. Clique em **Run**

## 📁 Arquivos Necessários

- `supabase/migrations/007_create_solos_tables.sql` - Script SQL principal
- `executar-solos-supabase.cjs` - Script Node.js para execução completa
- `executar-solos-direto.cjs` - Script Node.js para execução direta

## 🔧 Configuração da Função exec_sql (se necessário)

Se não tiver a função `exec_sql` configurada, execute primeiro:

```sql
-- Criar função exec_sql para executar scripts SQL
CREATE OR REPLACE FUNCTION exec_sql(sql text)
RETURNS text AS $$
BEGIN
  EXECUTE sql;
  RETURN 'SQL executado com sucesso';
EXCEPTION
  WHEN OTHERS THEN
    RETURN 'Erro: ' || SQLERRM;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

## 📊 O que o Script Cria

### Tabela Principal
- **caracterizacoes_solos**: Tabela principal com todos os campos de caracterização de solos

### Campos Incluídos
- **Informações Básicas**: Código, obra, laboratório, tipo de amostra, localização
- **Características Físicas**: Humidade, densidades, índice de vazios, porosidade
- **Granulometria**: Peneiração e sedimentação (JSONB)
- **Limites de Consistência**: Limite líquido, plástico, índice de plasticidade
- **Ensaios de Compactação**: Proctor normal e modificado
- **Ensaios de Resistência**: CBR, resistência ao cisalhamento
- **Características Químicas**: pH, matéria orgânica, sulfatos, gessos
- **Ensaios Específicos**: Hinchamiento livre, colapso
- **Classificação**: Sistema unificado, AASHTO, adequação
- **Documentação**: Relatórios, certificados, fotos, normas

### Funcionalidades
- **Índices**: Para otimização de consultas
- **Triggers**: Para atualização automática de timestamps
- **RLS**: Row Level Security para segurança
- **Função de Estatísticas**: `get_solos_stats()` para KPIs
- **Dados de Exemplo**: 5 registos realistas de diferentes tipos de solo

## 🎯 Dados de Exemplo Incluídos

1. **Solo Arenoso** (SOL-2024-001) - Linha Ferroviária Lisboa-Porto
2. **Solo Argiloso** (SOL-2024-002) - Ponte sobre Rio Douro
3. **Solo Silto-Argiloso** (SOL-2024-003) - Túnel de Coimbra
4. **Solo Pedregulhoso** (SOL-2024-004) - Aeroporto de Faro
5. **Solo Orgânico** (SOL-2024-005) - Parque Urbano de Braga

## ✅ Verificação Pós-Execução

Após executar o script, verifique:

1. **Tabela criada**: `caracterizacoes_solos`
2. **Dados inseridos**: 5 registos de exemplo
3. **Função de estatísticas**: `get_solos_stats()`
4. **Políticas RLS**: Configuradas corretamente

## 🔍 Consultas de Verificação

```sql
-- Verificar se a tabela foi criada
SELECT * FROM caracterizacoes_solos LIMIT 5;

-- Verificar estatísticas
SELECT get_solos_stats();

-- Verificar políticas RLS
SELECT * FROM pg_policies WHERE tablename = 'caracterizacoes_solos';
```

## 🚨 Resolução de Problemas

### Erro: "relation already exists"
- A tabela já existe, pode ignorar ou fazer DROP TABLE primeiro

### Erro: "function already exists"
- A função já existe, pode ignorar

### Erro: "permission denied"
- Verificar se tem permissões de administrador na Supabase

### Erro: "invalid input syntax"
- Verificar se o JSON está bem formatado nos dados de exemplo

## 📞 Suporte

Se encontrar problemas:
1. Verificar logs da Supabase
2. Confirmar que todas as extensões estão habilitadas
3. Verificar se as variáveis de ambiente estão configuradas corretamente

---

**Nota**: Este script segue as normativas portuguesas e europeias para caracterização de solos em engenharia civil.
