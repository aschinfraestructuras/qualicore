# 🚀 Guia Rápido - Configuração Supabase

## ⚠️ IMPORTANTE: Não confundir SQL com TypeScript!

### **❌ NÃO FAZER:**
- Executar código TypeScript no SQL Editor
- Colocar comandos SQL no código React

### **✅ FAZER CORRETAMENTE:**

## 📋 Passo 1: SQL Editor (Supabase Dashboard)

1. **Abrir** https://supabase.com/dashboard
2. **Selecionar** seu projeto
3. **Ir para** "SQL Editor"
4. **Criar nova query** ou abrir uma existente
5. **Copiar e colar** TODO o conteúdo do arquivo:
   ```
   supabase/migrations/001_create_via_ferrea_tables.sql
   ```
6. **Executar** (botão "Run")

### **Resultado esperado:**
- ✅ Tabelas criadas: `trilhos`, `travessas`, `inspecoes`
- ✅ Índices criados
- ✅ Funções criadas
- ✅ Dados de exemplo inseridos

## 📋 Passo 2: Configurar Variáveis de Ambiente

No seu projeto React, criar arquivo `.env.local`:

```env
VITE_SUPABASE_URL=sua_url_do_supabase
VITE_SUPABASE_ANON_KEY=sua_chave_anonima
```

## 📋 Passo 3: Criar Cliente Supabase

Criar arquivo `src/lib/supabase-api/supabaseClient.ts`:

```typescript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseKey)
```

## 📋 Passo 4: Testar Conexão

No seu componente React:

```typescript
import { viaFerreaAPI } from './lib/supabase-api/viaFerreaAPI'

// Testar conexão
const testConnection = async () => {
  try {
    const stats = await viaFerreaAPI.stats.getStats()
    console.log('✅ Conexão OK:', stats)
  } catch (error) {
    console.error('❌ Erro de conexão:', error)
  }
}
```

## 🔍 Verificação

### **No Supabase Dashboard:**
1. **Table Editor** → Ver se as tabelas existem
2. **SQL Editor** → Executar: `SELECT * FROM trilhos;`

### **No seu projeto React:**
1. **Console** → Ver se não há erros de conexão
2. **Network** → Ver se as requisições estão funcionando

## 🚨 Troubleshooting

### **Erro: "syntax error at or near"**
- ❌ **Causa:** Executando TypeScript no SQL Editor
- ✅ **Solução:** Usar apenas SQL no SQL Editor

### **Erro: "relation does not exist"**
- ❌ **Causa:** Tabelas não foram criadas
- ✅ **Solução:** Executar o script SQL completo

### **Erro: "Invalid API key"**
- ❌ **Causa:** Variáveis de ambiente incorretas
- ✅ **Solução:** Verificar `.env.local`

## 📞 Próximos Passos

1. ✅ Executar SQL no Supabase
2. ✅ Configurar variáveis de ambiente
3. ✅ Testar conexão
4. ✅ Migrar dados mock (opcional)
5. ✅ Implementar no componente Via Férrea

---

**🎯 Lembrete:** SQL no SQL Editor, TypeScript no código React!
