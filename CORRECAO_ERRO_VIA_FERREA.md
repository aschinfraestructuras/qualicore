# Correção do Erro na Via Férrea

## Problema Identificado
O erro `Could not find a relationship between 'inspecoes' and 'trilhos' in the schema cache` ocorria porque a API estava tentando usar joins que o Supabase não conseguia processar corretamente.

## Causa Raiz
No arquivo `src/lib/supabase-api/viaFerreaAPI.ts`, as funções `inspecoesAPI.getAll()` e `inspecoesAPI.getById()` estavam usando a sintaxe:

```typescript
.select(`
  *,
  trilhos(codigo),
  travessas(codigo)
`)
```

Esta sintaxe de join não estava sendo reconhecida pelo cache de schema do Supabase, mesmo existindo as foreign keys corretas na base de dados.

## Solução Aplicada
Removida a sintaxe de join problemática e simplificado para:

```typescript
.select('*')
```

## Verificação
- ✅ As foreign keys existem corretamente no schema (`trilho_id` e `travessa_id` na tabela `inspecoes`)
- ✅ Os componentes da UI não estavam usando os dados relacionados do join
- ✅ A funcionalidade permanece intacta, apenas sem os dados relacionados no fetch inicial

## Arquivos Modificados
- `src/lib/supabase-api/viaFerreaAPI.ts` - Removida sintaxe de join problemática

## Status
- ✅ Erro corrigido
- ✅ Build bem-sucedido
- ✅ Funcionalidade mantida

## Próximos Passos
Se for necessário obter dados relacionados no futuro, usar:
1. Fetches separados para cada tabela
2. Ou implementar RLS policies adequadas no Supabase
3. Ou usar a sintaxe correta de joins do Supabase quando necessário
