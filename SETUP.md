# 🚀 Setup do Qualicore - Sistema de Gestão da Qualidade

Este guia explica como configurar o sistema Qualicore para gestão da qualidade em projetos de construção.

## 📋 Pré-requisitos

- Node.js (versão 16 ou superior)
- npm ou yarn
- PocketBase (incluído no projeto)

## 🛠️ Instalação e Configuração

### 1. Instalar Dependências

```bash
npm install
```

### 2. Iniciar o PocketBase

```bash
npm run pocketbase
```

O PocketBase estará disponível em: http://127.0.0.1:8090

### 3. Configurar o Sistema (Automático)

Execute o script de setup completo:

```bash
npm run setup
```

Este comando irá:
- ✅ Criar o administrador no PocketBase
- ✅ Criar todas as coleções necessárias
- ✅ Inserir dados de demonstração

### 4. Iniciar a Aplicação

```bash
npm run dev
```

A aplicação estará disponível em: http://localhost:3000

## 🔧 Scripts Disponíveis

| Comando | Descrição |
|---------|-----------|
| `npm run setup` | Setup completo (admin + coleções + dados) |
| `npm run setup-admin` | Criar apenas o administrador |
| `npm run setup-collections` | Criar apenas as coleções e dados |
| `npm run pocketbase` | Iniciar servidor PocketBase |
| `npm run dev` | Iniciar servidor de desenvolvimento |

## 👥 Credenciais de Acesso

### PocketBase Admin
- **URL**: http://127.0.0.1:8090/_/
- **Email**: admin@qualicore.pt
- **Password**: admin123

### Aplicação (Mock Users)
- **Admin**: admin@qualicore.pt / admin123
- **Qualidade**: qualidade@qualicore.pt / qualidade123
- **Produção**: producao@qualicore.pt / producao123
- **Gestão**: gestao@qualicore.pt / gestao123

## 📊 Coleções Criadas

O sistema inclui as seguintes coleções:

1. **documentos** - Gestão de documentação
2. **checklists** - Listas de verificação
3. **ensaios** - Ensaios e testes
4. **fornecedores** - Gestão de fornecedores
5. **materiais** - Controlo de materiais
6. **nao_conformidades** - Gestão de não conformidades

## 🎯 Funcionalidades Principais

### Dashboard
- KPIs em tempo real
- Gráficos interativos
- Ações rápidas
- Notificações

### Gestão de Documentos
- Upload de ficheiros
- Controlo de versões
- Aprovações
- Tags e categorização

### Checklists
- Criação de listas personalizadas
- Frequências configuráveis
- Relatórios de conformidade

### Ensaios
- Agendamento de ensaios
- Resultados e relatórios
- Integração com laboratórios

### Fornecedores
- Avaliação de fornecedores
- Classificações
- Histórico de performance

### Materiais
- Controlo de stock
- Preços e custos
- Localização
- Certificações

### Não Conformidades
- Gestão de incidentes
- Ações corretivas
- Custos estimados
- Evidências

## 🔍 Relatórios

- Exportação para JSON, PDF, Excel
- Filtros avançados
- Gráficos interativos
- Partilha de relatórios

## 🛡️ Segurança

- Autenticação com PocketBase
- Controlo de permissões
- Sessões seguras
- Validação de dados

## 🚨 Resolução de Problemas

### PocketBase não inicia
```bash
# Verificar se a porta 8090 está livre
netstat -an | findstr 8090
```

### Erro de conexão
```bash
# Verificar se o PocketBase está a correr
curl http://127.0.0.1:8090/api/health
```

### Erro de autenticação
```bash
# Recriar administrador
npm run setup-admin
```

### Coleções não criadas
```bash
# Recriar coleções
npm run setup-collections
```

## 📞 Suporte

Para questões ou problemas:
1. Verificar os logs do console
2. Consultar a documentação do PocketBase
3. Verificar a conectividade de rede

## 🔄 Atualizações

Para atualizar o sistema:
1. Fazer backup dos dados
2. Atualizar o código
3. Executar `npm run setup` novamente
4. Verificar a integridade dos dados

---

**Qualicore** - Sistema de Gestão da Qualidade para Construção Civil 