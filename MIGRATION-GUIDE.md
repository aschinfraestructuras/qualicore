# 🚀 GUIA DE MIGRAÇÃO PARA SUPABASE - QUALICORE

## 📋 RESUMO DA MIGRAÇÃO

Esta migração irá:
- ✅ Substituir PocketBase por Supabase como backend
- ✅ Manter todas as funcionalidades existentes
- ✅ Melhorar a segurança e escalabilidade
- ✅ Facilitar futuras evoluções do sistema

## 🔧 PRÉ-REQUISITOS

1. **Projeto Supabase criado** ✅ (já feito)
2. **Credenciais do Supabase** ✅ (já fornecidas)
3. **Backup do projeto atual** ✅ (recomendado)

## 📝 PASSOS DA MIGRAÇÃO

### PASSO 1: Executar Scripts SQL no Supabase

1. **Acesse o painel do Supabase:**
   - Vá para https://supabase.com/dashboard
   - Acesse seu projeto

2. **Abra o SQL Editor:**
   - No menu lateral, clique em "SQL Editor"
   - Clique em "New query"

3. **Execute o script completo:**
   - Copie todo o conteúdo do arquivo `supabase-migration.sql`
   - Cole no SQL Editor
   - Clique em "Run" para executar

4. **Verifique se as tabelas foram criadas:**
   - Vá para "Table Editor" no menu lateral
   - Confirme que as seguintes tabelas existem:
     - `obras`
     - `fornecedores`
     - `materiais`
     - `ensaios`
     - `checklists`
     - `documentos`
     - `nao_conformidades`
     - `rfis`

### PASSO 2: Configurar Autenticação

1. **No painel do Supabase:**
   - Vá para "Authentication" → "Settings"
   - Em "Site URL", adicione: `http://localhost:5173` (para desenvolvimento)
   - Em "Redirect URLs", adicione: `http://localhost:5173/auth/callback`

2. **Configurar provedores de email:**
   - Em "Authentication" → "Providers"
   - Certifique-se que "Email" está habilitado
   - Configure as opções de email conforme necessário

### PASSO 3: Testar a Migração

1. **Inicie o servidor de desenvolvimento:**
   ```bash
   npm run dev
   ```

2. **Teste o registro de usuário:**
   - Acesse http://localhost:5173
   - Tente criar uma nova conta
   - Verifique se o usuário aparece no painel do Supabase

3. **Teste as funcionalidades principais:**
   - Login/logout
   - Criar uma obra
   - Criar um fornecedor
   - Criar um material
   - Verificar se os dados aparecem no Supabase

## 🔄 ADAPTAÇÕES FEITAS NO CÓDIGO

### Arquivos Criados/Modificados:

1. **`supabase-migration.sql`** - Scripts SQL completos
2. **`src/lib/supabase.ts`** - Configuração do cliente Supabase
3. **`src/lib/supabase-api.ts`** - Novos serviços de API
4. **`package.json`** - Adicionada dependência `@supabase/supabase-js`

### Principais Mudanças:

- ✅ Substituição do localStorage por Supabase
- ✅ Implementação de Row Level Security (RLS)
- ✅ Autenticação segura com Supabase Auth
- ✅ Tipagem TypeScript completa
- ✅ Tratamento de erros robusto

## 🛡️ SEGURANÇA IMPLEMENTADA

### Row Level Security (RLS):
- Cada usuário só vê seus próprios dados
- Políticas de acesso por tabela
- Proteção automática contra acesso não autorizado

### Autenticação:
- Sistema de login/registro seguro
- Tokens JWT automáticos
- Sessões gerenciadas pelo Supabase

## 📊 ESTRUTURA DAS TABELAS

### Tabelas Principais:
1. **`obras`** - Projetos/obras
2. **`fornecedores`** - Fornecedores
3. **`materiais`** - Materiais de construção
4. **`ensaios`** - Ensaios de qualidade
5. **`checklists`** - Listas de verificação
6. **`documentos`** - Documentação
7. **`nao_conformidades`** - Não conformidades
8. **`rfis`** - Requests for Information

### Relacionamentos:
- Todas as tabelas têm `user_id` para isolamento
- Chaves estrangeiras para relacionamentos
- Índices para performance

## 🚨 POSSÍVEIS PROBLEMAS E SOLUÇÕES

### Problema: Erro de conexão com Supabase
**Solução:** Verifique se as credenciais em `src/lib/supabase.ts` estão corretas

### Problema: Usuário não consegue ver dados
**Solução:** Verifique se o RLS está habilitado e as políticas estão corretas

### Problema: Erro de autenticação
**Solução:** Verifique as configurações de autenticação no painel do Supabase

### Problema: Dados não aparecem
**Solução:** Verifique se o `user_id` está sendo definido corretamente

## 🔍 VERIFICAÇÃO PÓS-MIGRAÇÃO

### Checklist de Verificação:

- [ ] Scripts SQL executados com sucesso
- [ ] Tabelas criadas no Supabase
- [ ] Autenticação funcionando
- [ ] Registro de usuário funcionando
- [ ] Login funcionando
- [ ] Criação de obras funcionando
- [ ] Criação de fornecedores funcionando
- [ ] Criação de materiais funcionando
- [ ] Dados aparecem no painel do Supabase
- [ ] RLS funcionando (usuários só veem seus dados)

## 🎯 PRÓXIMOS PASSOS

### Após a migração bem-sucedida:

1. **Teste todas as funcionalidades**
2. **Migre dados existentes** (se necessário)
3. **Configure backup automático**
4. **Monitore performance**
5. **Planeje futuras evoluções**

### Evoluções Futuras Facilitadas:

- ✅ Adicionar novas tabelas via SQL
- ✅ Implementar real-time subscriptions
- ✅ Adicionar storage para arquivos
- ✅ Implementar edge functions
- ✅ Escalar automaticamente

## 📞 SUPORTE

Se encontrar problemas durante a migração:

1. **Verifique os logs do console** do navegador
2. **Verifique os logs do Supabase** no painel
3. **Teste as conexões** uma por vez
4. **Consulte a documentação** do Supabase

## 🎉 CONCLUSÃO

Após completar esta migração, você terá:

- ✅ **Backend robusto e escalável**
- ✅ **Segurança de nível empresarial**
- ✅ **Facilidade de manutenção**
- ✅ **Preparação para crescimento**
- ✅ **Tecnologia moderna e confiável**

A migração para Supabase é um investimento no futuro do seu projeto, proporcionando uma base sólida para crescimento e evolução contínua.

---

**⚠️ IMPORTANTE:** Execute os passos na ordem indicada e teste cada etapa antes de prosseguir para a próxima. 