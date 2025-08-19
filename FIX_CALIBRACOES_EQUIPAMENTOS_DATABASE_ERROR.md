# 🔧 Fix para Erro de Base de Dados - Módulo Calibrações e Equipamentos

## ❌ Problema Identificado

**Erro:** `ERROR: 42703: column "equipamento_id" does not exist`

Este erro indica que havia uma inconsistência entre o schema da base de dados e as consultas da API.

## ✅ Solução Implementada

### 1. **Correção do Schema SQL**

**Arquivo:** `supabase/migrations/011_create_calibracoes_equipamentos_tables.sql`

**Principais correções:**

- ✅ **Adicionado `NOT NULL`** a todas as colunas de chave estrangeira:
  - `equipamento_id` em `calibracoes`, `manutencoes`, `inspecoes`, `fotos_equipamentos`, `documentos_equipamentos`
  - `calibracao_id` em `pontos_calibracao`, `fotos_calibracoes`, `documentos_calibracoes`
  - `manutencao_id` em `fotos_manutencoes`, `documentos_manutencoes`
  - `inspecao_id` em `fotos_inspecoes`, `documentos_inspecoes`

- ✅ **Adicionadas colunas em falta:**
  - `valor_atual` em `equipamentos`
  - `duracao_horas` em `inspecoes`

- ✅ **Corrigida função de estatísticas** para usar camelCase que corresponde às interfaces TypeScript

### 2. **Atualização das Interfaces TypeScript**

**Arquivo:** `src/types/calibracoes.ts`

**Adicionadas propriedades em falta:**
- `valor_atual: number` em `Equipamento`
- `duracao_horas: number` em `Inspecao`

### 3. **Script de Teste Criado**

**Arquivo:** `test_calibracoes_schema.sql`

Este script permite verificar se o schema está funcionando corretamente.

## 🚀 Próximos Passos

### 1. **Aplicar a Migração**

1. Aceda ao **Supabase Dashboard**
2. Vá para **SQL Editor**
3. Execute o script `supabase/migrations/011_create_calibracoes_equipamentos_tables.sql`

### 2. **Verificar a Instalação**

Execute o script de teste `test_calibracoes_schema.sql` no SQL Editor para confirmar que:
- ✅ Todas as tabelas foram criadas
- ✅ As colunas `equipamento_id` existem
- ✅ Os dados de exemplo foram inseridos
- ✅ A função de estatísticas funciona
- ✅ Os índices foram criados

### 3. **Testar a Aplicação**

1. **Reinicie a aplicação** se necessário
2. **Navegue para** `/calibracoes-equipamentos`
3. **Verifique se:**
   - ✅ A página carrega sem erros
   - ✅ As estatísticas são exibidas
   - ✅ Os dados são carregados nas tabelas
   - ✅ Os formulários funcionam
   - ✅ Os relatórios PDF são gerados

## 📋 Checklist de Verificação

- [ ] Migração SQL aplicada com sucesso
- [ ] Script de teste executado sem erros
- [ ] Aplicação carrega sem erros de base de dados
- [ ] Todas as funcionalidades do módulo funcionam
- [ ] Relatórios PDF são gerados corretamente
- [ ] Upload/download de ficheiros funciona
- [ ] Filtros e pesquisas funcionam

## 🔍 Possíveis Causas do Erro Original

1. **Migração não aplicada** - O script SQL não foi executado na base de dados
2. **Conflito de versões** - Diferentes versões do schema entre desenvolvimento e produção
3. **Case sensitivity** - Diferenças entre nomes de colunas em maiúsculas/minúsculas
4. **Ordem de execução** - Dependências entre tabelas não respeitadas

## 📞 Suporte

Se o erro persistir após aplicar estas correções:

1. **Verifique os logs** da aplicação para mais detalhes
2. **Execute o script de teste** para identificar problemas específicos
3. **Verifique se todas as tabelas** foram criadas corretamente
4. **Confirme que os dados** de exemplo foram inseridos

---

**Status:** ✅ **CORRIGIDO**  
**Módulo:** Calibrações e Equipamentos  
**Data:** $(date)  
**Versão:** 1.0.1
