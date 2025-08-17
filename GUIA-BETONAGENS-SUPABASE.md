# 🏗️ Guia de Criação das Tabelas de Betonagens na Supabase

Este guia explica como criar as tabelas e dados de exemplo para o módulo "Controlo de Betonagens" na Supabase.

## 📋 Pré-requisitos

1. **Função exec_sql criada**: Certifique-se de que a função `exec_sql` está criada na Supabase
2. **Variáveis de ambiente configuradas**: Configure as variáveis do Supabase no seu `.env`

## 🚀 Opções de Execução

### Opção 1: Script Completo (Recomendado)

Execute o script que cria tudo de uma vez:

```bash
node executar-betonagens-supabase.cjs
```

### Opção 2: Script Direto

Execute o script que cria as tabelas e insere dados diretamente:

```bash
node executar-betonagens-direto.cjs
```

### Opção 3: Execução Manual no Painel Supabase

1. Aceda ao painel da Supabase
2. Vá para "SQL Editor"
3. Copie e cole o conteúdo do arquivo `006_create_betonagens_tables.sql`
4. Execute o script

## 📊 O que será criado

### Tabelas
- **`betonagens`**: Tabela principal com todos os campos
- **`ensaios_betonagem`**: Tabela para ensaios específicos

### Campos da Tabela `betonagens`
- `id`: UUID único
- `codigo`: Código da betonagem (único)
- `obra`: Obra a que pertence
- `elemento_estrutural`: Tipo de elemento (Pilar, Viga, Laje, etc.)
- `localizacao`: Localização específica
- `data_betonagem`: Data da betonagem
- `data_ensaio_7d`: Data do ensaio a 7 dias
- `data_ensaio_28d`: Data do ensaio a 28 dias
- `fornecedor`: Fornecedor do betão
- `guia_remessa`: Número da guia
- `tipo_betao`: Tipo de betão (C20/25, C25/30, etc.)
- `aditivos`: Aditivos utilizados
- `hora_limite_uso`: Hora limite para uso
- `slump`: Slump do betão (cm)
- `temperatura`: Temperatura (°C)
- `resistencia_7d_1`, `resistencia_7d_2`: Resistências a 7 dias
- `resistencia_28d_1`, `resistencia_28d_2`, `resistencia_28d_3`: Resistências a 28 dias
- `resistencia_rotura`: Resistência de rotura (editável)
- `dimensoes_provete`: Dimensões das provetas
- `status_conformidade`: Status (Conforme, Não Conforme, Pendente)
- `observacoes`: Observações
- `relatorio_rotura`: Relatório de resultados
- `created_at`, `updated_at`: Timestamps

### Dados de Exemplo

Serão criados **15 registos de exemplo** com dados realistas:

1. **Viaduto A1 - Km 45**: Pilares, vigas e lajes
2. **Ponte Rio Douro - Porto**: Fundações e muros
3. **Metro Lisboa - Linha Vermelha**: Escadas e coberturas
4. **Estação Comboios - Braga**: Pavimentos e pilares
5. **Túnel A1 - Km 120**: Vigas e lajes
6. **Viaduto A2 - Setúbal**: Fundações
7. **Metro Porto - Linha Amarela**: Pilares
8. **Ponte 25 de Abril - Lisboa**: Vigas
9. **Estação Metro - Coimbra**: Pavimentos

### Características dos Dados
- **Diferentes tipos de betão**: C20/25, C25/30, C30/37, C35/45, C40/50, C45/55, C50/60
- **Diferentes aditivos**: Superplastificante, Retardador, Acelerador, Impermeabilizante, Fibras, Nenhum
- **Diferentes status**: Conforme, Não Conforme, Pendente
- **Dados realistas**: Resistências, temperaturas, slumps, etc.

## 🔧 Configuração

### 1. Verificar Função exec_sql

Se não tiver a função `exec_sql`, execute primeiro:

```bash
node criar-funcao-exec-sql.cjs
```

### 2. Configurar Variáveis de Ambiente

Certifique-se de que tem no seu `.env`:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### 3. Instalar Dependências

```bash
npm install @supabase/supabase-js
```

## 📈 Verificação

Após a execução, verifique no painel da Supabase:

1. **Tabelas criadas**: `betonagens` e `ensaios_betonagem`
2. **Dados inseridos**: 15 registos na tabela `betonagens`
3. **Índices criados**: Para performance
4. **RLS habilitado**: Row Level Security ativo
5. **Políticas criadas**: Acesso para utilizadores autenticados

## 🔍 Teste no Frontend

Após criar as tabelas, teste no frontend:

1. Aceda ao módulo "Controlo de Betonagens"
2. Verifique se os dados aparecem na tabela
3. Teste criar um novo registo
4. Teste editar um registo existente
5. Teste ver detalhes de um registo

## 🛠️ Solução de Problemas

### Erro: "Função exec_sql não encontrada"
```bash
node criar-funcao-exec-sql.cjs
```

### Erro: "Tabela já existe"
- O script usa `CREATE TABLE IF NOT EXISTS`, então é seguro executar múltiplas vezes

### Erro: "Violação de chave única"
- Os dados de exemplo usam `ON CONFLICT DO NOTHING`, então não há problema

### Erro: "Permissão negada"
- Verifique se as variáveis de ambiente estão corretas
- Verifique se tem permissões na base de dados

## 📝 Notas Importantes

1. **Backup**: Faça backup da base de dados antes de executar
2. **Ambiente**: Execute primeiro em desenvolvimento/teste
3. **Dados**: Os dados de exemplo são realistas mas fictícios
4. **Performance**: Os índices criados otimizam as consultas
5. **Segurança**: RLS está habilitado para proteger os dados

## 🎯 Próximos Passos

Após criar as tabelas:

1. **Teste o frontend**: Verifique se tudo funciona
2. **Personalize dados**: Adicione dados reais da sua empresa
3. **Configure relatórios**: Use os dados para gerar relatórios
4. **Monitore performance**: Verifique se os índices estão a funcionar

## 📞 Suporte

Se tiver problemas:

1. Verifique os logs do script
2. Confirme as variáveis de ambiente
3. Teste a conexão com a Supabase
4. Verifique as permissões da base de dados

---

**✅ Pronto!** As tabelas de betonagens estão criadas e prontas para uso no seu sistema de gestão de qualidade.
