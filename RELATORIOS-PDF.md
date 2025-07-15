# Sistema de Relatórios em PDF - Qualicore

## 📋 Visão Geral

O sistema de relatórios em PDF foi implementado de forma **segura e gradual**, sem dependências externas que possam causar conflitos. Utiliza HTML/CSS nativo para gerar PDFs profissionais através da funcionalidade de impressão do navegador.

## ✨ Funcionalidades Implementadas

### 1. **Relatórios por Tabela**

- ✅ Relatório Executivo (com métricas gerais)
- ✅ Relatório de Ensaios
- ✅ Relatório de Checklists
- ✅ Relatório de Materiais
- ✅ Relatório de Não Conformidades
- ✅ Relatório de Documentos
- ✅ Relatório de Obras
- ✅ Relatório de Fornecedores

### 2. **Personalização da Empresa**

- ✅ Configuração de dados da empresa
- ✅ Upload de logotipo
- ✅ Cabeçalho personalizado nos relatórios
- ✅ Rodapé com informações da empresa

### 3. **Gestão de Documentos**

- ✅ Upload de documentos do PC
- ✅ Categorização de documentos
- ✅ Visualização e download
- ✅ Pesquisa e filtros
- ✅ Armazenamento local

## 🚀 Como Usar

### 1. **Configurar Dados da Empresa**

1. Aceda à página de **Relatórios**
2. Clique no ícone **🏢** (Configurar empresa)
3. Preencha os dados da sua empresa:
   - Nome da empresa
   - NIF
   - Morada
   - Telefone
   - Email
   - Website
4. **Carregue o logotipo** (opcional):
   - Formatos: PNG, JPG
   - Tamanho máximo: 5MB
5. Clique em **Guardar**

### 2. **Gerar Relatórios em PDF**

1. Aceda à página de **Relatórios**
2. Escolha o tipo de relatório desejado
3. Clique no ícone **📄** (PDF) no relatório
4. O navegador abrirá uma janela de impressão
5. Selecione **"Guardar como PDF"** como destino
6. Clique em **Imprimir**

### 3. **Gestão de Documentos**

1. Aceda à página de **Relatórios**
2. Clique no ícone **📁** (Gestão de documentos)
3. **Carregar documentos**:
   - Clique em "Selecionar Arquivos"
   - Escolha a categoria (Documento, Relatório, Certificado, Outro)
   - Selecione os arquivos (máximo 10MB cada)
4. **Organizar documentos**:
   - Use a pesquisa para encontrar documentos
   - Filtre por categoria
   - Visualize, faça download ou elimine documentos

## 📊 Tipos de Relatório Disponíveis

### **Relatório Executivo**

- Métricas gerais de conformidade
- Resumo por módulo (Ensaios, Checklists, Materiais, NCs)
- Indicadores de qualidade
- Tendências e alertas

### **Relatório de Ensaios**

- Lista detalhada de todos os ensaios
- Status de conformidade
- Resultados e valores
- Responsáveis e datas

### **Relatório de Checklists**

- Checklists executados
- Pontos de inspeção
- Status de aprovação
- Responsáveis e zonas

### **Relatório de Materiais**

- Materiais recebidos
- Status de aprovação
- Quantidades e fornecedores
- Datas de receção

### **Relatório de Não Conformidades**

- NCs identificadas
- Severidade e impacto
- Status de resolução
- Responsáveis e prazos

### **Relatório de Documentos**

- Documentos do sistema
- Versões e validade
- Status de aprovação
- Tipos e categorias

### **Relatório de Obras**

- Obras em execução
- Progresso e status
- Valores e prazos
- Equipas e responsáveis

### **Relatório de Fornecedores**

- Lista de fornecedores
- Status de atividade
- Contactos e informações
- Performance

## 🎨 Personalização

### **Cabeçalho dos Relatórios**

- Logotipo da empresa
- Nome e dados de contacto
- Informações do relatório
- Data e responsável

### **Estilos Profissionais**

- Design moderno e limpo
- Cores da empresa
- Tipografia profissional
- Layout responsivo

### **Tabelas Organizadas**

- Cabeçalhos destacados
- Linhas alternadas
- Status coloridos
- Informações estruturadas

## 💾 Armazenamento

### **Configuração da Empresa**

- Guardada no `localStorage`
- Persiste entre sessões
- Pode ser editada a qualquer momento

### **Documentos Carregados**

- Guardados no `localStorage`
- URLs temporárias (base64)
- Categorizados e organizados

## 🔧 Funcionalidades Técnicas

### **Geração de PDF**

- HTML/CSS nativo
- Sem dependências externas
- Compatível com todos os navegadores
- Impressão otimizada

### **Upload de Arquivos**

- Validação de tipo e tamanho
- Preview de imagens
- Categorização automática
- Gestão de erros

### **Interface Responsiva**

- Design adaptativo
- Animações suaves
- Feedback visual
- Acessibilidade

## 🚨 Limitações Atuais

1. **Tamanho dos arquivos**: Máximo 10MB por documento
2. **Armazenamento**: Local (localStorage) - não sincroniza entre dispositivos
3. **PDF**: Geração via impressão do navegador
4. **Logotipo**: Apenas imagens (PNG, JPG)

## 🔮 Próximas Melhorias

1. **Métricas e Comparações**: Análise entre capítulos
2. **Gráficos**: Visualizações interativas
3. **Sincronização**: Cloud storage para documentos
4. **Templates**: Mais opções de layout
5. **Agendamento**: Relatórios automáticos
6. **Partilha**: Envio por email

## 🛠️ Estrutura de Ficheiros

```
src/
├── services/
│   └── reportService.ts          # Serviço principal de relatórios
├── components/
│   ├── EmpresaConfig.tsx         # Configuração da empresa
│   └── DocumentUpload.tsx        # Gestão de documentos
└── pages/
    └── Relatorios.tsx            # Página principal (atualizada)
```

## 📝 Notas de Implementação

- **Segurança**: Implementação gradual sem quebrar funcionalidades existentes
- **Performance**: Sem dependências pesadas
- **Compatibilidade**: Funciona em todos os navegadores modernos
- **Manutenibilidade**: Código limpo e bem documentado

## 🎯 Objetivos Alcançados

✅ **Criar**: Relatórios em PDF profissionais  
✅ **Implementar**: Sistema sem conflitos  
✅ **Usar**: Interface intuitiva  
✅ **Registar**: Dados organizados  
✅ **Imprimir**: PDFs de qualidade  
✅ **Comunicar**: Documentos estruturados

O sistema está pronto para uso e pode ser expandido conforme necessário!
