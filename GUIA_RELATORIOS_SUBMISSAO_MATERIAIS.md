# Guia de Relatórios - Submissão de Materiais

## Visão Geral

O sistema de relatórios PDF para o módulo **Submissão de Materiais** foi implementado com funcionalidades avançadas de filtragem, seleção de registos e geração de relatórios profissionais. Este sistema permite aos utilizadores gerar relatórios detalhados sobre submissões de materiais com estatísticas, análises e dados específicos.

## Funcionalidades Implementadas

### ✅ Sistema Completo de Relatórios PDF
- **4 tipos de relatórios**: Executivo, Filtrado, Comparativo, Individual
- **Seleção de registos**: Possibilidade de selecionar registos específicos para incluir no relatório
- **Filtros avançados**: Por estado, tipo de material, categoria, prioridade, datas
- **Estatísticas detalhadas**: KPIs e métricas em tempo real
- **Cabeçalhos e rodapés personalizados**: Com logotipo da empresa e informações profissionais

### ✅ Interface de Utilizador
- **Modal de relatórios**: Interface intuitiva para configuração e geração
- **Controles de seleção**: Ativar/desativar seleção, selecionar todos, limpar seleção
- **Visualização em tempo real**: Contador de registos selecionados
- **Configuração de tipo de relatório**: Dropdown para escolher o tipo de relatório

### ✅ Integração Completa
- **PDFService**: Métodos específicos para geração de PDFs
- **ReportService**: Templates HTML para relatórios
- **API Integration**: Dados reais da base de dados Supabase
- **Mock Data**: Dados de teste para demonstração

## Tipos de Relatórios

### 1. Relatório Executivo
**Descrição**: Visão geral com estatísticas principais e resumo executivo
**Conteúdo**:
- Estatísticas gerais (total, aprovadas, pendentes, rejeitadas, urgentes, críticas)
- Análise por tipo de material
- Percentagens de aprovação
- KPIs principais

### 2. Relatório Filtrado
**Descrição**: Relatório detalhado com filtros aplicados
**Conteúdo**:
- Lista de filtros aplicados
- Tabela detalhada com todas as submissões
- Informações completas de cada registo
- Dados organizados por colunas

### 3. Relatório Comparativo
**Descrição**: Análise comparativa entre diferentes categorias
**Conteúdo**:
- Distribuição por estado
- Distribuição por tipo de material
- Análise de tendências
- Comparações estatísticas

### 4. Relatório Individual
**Descrição**: Ficha técnica detalhada de uma submissão específica
**Conteúdo**:
- Informações completas da submissão
- Especificações técnicas detalhadas
- Impacto financeiro e no prazo
- Documentação anexa

## Sistema de Seleção de Registos

### Modo de Seleção
- **Ativar/Desativar**: Botão para alternar o modo de seleção
- **Checkboxes**: Aparecem na tabela quando o modo está ativo
- **Seleção em massa**: "Selecionar Todos" e "Limpar Seleção"
- **Contador**: Mostra quantos registos estão selecionados

### Comportamento dos Relatórios
- **Com seleção ativa**: Gera relatório apenas com registos selecionados
- **Sem seleção**: Gera relatório com todos os registos
- **Flexibilidade**: Permite relatórios personalizados

## Estatísticas e KPIs

### Métricas Principais
- **Total de Submissões**: Número total de registos
- **Aprovadas**: Submissões com estado "aprovado"
- **Pendentes**: Submissões em análise ou aguardando aprovação
- **Rejeitadas**: Submissões rejeitadas
- **Urgentes**: Submissões com urgência alta ou muito alta
- **Críticas**: Submissões com prioridade crítica

### Análises por Categoria
- **Tipo de Material**: Distribuição por tipo (betão, aço, geossintéticos, etc.)
- **Categoria**: Análise por categoria (estrutural, armaduras, drenagem, etc.)
- **Estado**: Distribuição por estado atual
- **Prioridade**: Análise por nível de prioridade

## Arquivos Implementados

### Frontend Components
- `src/components/RelatorioSubmissaoMateriaisPremium.tsx` - Componente principal de relatórios
- `src/pages/SubmissaoMateriais.tsx` - Integração na página principal

### Services
- `src/services/pdfService.ts` - Métodos para geração de PDFs
- `src/services/reportService.ts` - Templates HTML para relatórios

### Database
- `SETUP_SUBMISSAO_MATERIAIS_MOCK.sql` - Script com dados mock

### Documentation
- `GUIA_RELATORIOS_SUBMISSAO_MATERIAIS.md` - Este guia

## Como Utilizar

### 1. Aceder ao Sistema de Relatórios
1. Navegar para o módulo "Submissão de Materiais"
2. Clicar no botão verde "Relatório" no cabeçalho
3. O modal de relatórios abrirá automaticamente

### 2. Configurar o Relatório
1. **Tipo de Relatório**: Selecionar o tipo desejado (Executivo, Filtrado, Comparativo, Individual)
2. **Seleção de Registos** (opcional):
   - Clicar em "Ativar Seleção"
   - Selecionar registos específicos usando checkboxes
   - Ou usar "Selecionar Todos" / "Limpar Seleção"

### 3. Gerar o Relatório
1. Clicar em "Gerar Relatório"
2. O PDF será gerado e descarregado automaticamente
3. O ficheiro terá o nome: `relatorio_submissoes_materiais_YYYY-MM-DD.pdf`

## Estrutura do PDF

### Cabeçalho Profissional
- Logotipo da empresa (Qualicore)
- Informações da empresa
- Título do relatório
- Data de geração

### Conteúdo Principal
- **Resumo Executivo**: Visão geral e contexto
- **Estatísticas**: KPIs e métricas principais
- **Análises**: Distribuições e comparações
- **Tabelas**: Dados detalhados organizados

### Rodapé Profissional
- Informações da empresa
- Data do relatório
- Numeração de páginas
- Marca "Documento confidencial"

## Dados Mock Incluídos

O script SQL inclui 10 submissões de materiais com dados realistas:

1. **Betão C25/30 para Pilares** - Aprovado
2. **Aço B500B para Armaduras** - Em revisão
3. **Geotêxtil para Drenagem** - Submetido
4. **Vigas Pré-fabricadas** - Aguardando aprovação
5. **Juntas de Dilatação** - Rejeitado
6. **Membrana de Impermeabilização** - Solicitado alteração
7. **Painéis de Sinalização** - Aprovado
8. **Estacas Metálicas** - Em revisão
9. **Pavimento Betuminoso** - Submetido
10. **Barreiras de Segurança** - Aprovado

## Vantagens do Sistema

### ✅ Profissionalismo
- Relatórios com aparência profissional
- Cabeçalhos e rodapés personalizados
- Formatação consistente

### ✅ Flexibilidade
- Múltiplos tipos de relatório
- Seleção personalizada de registos
- Filtros avançados

### ✅ Integração
- Dados reais da base de dados
- Estatísticas em tempo real
- Compatibilidade com Supabase

### ✅ Usabilidade
- Interface intuitiva
- Geração rápida de relatórios
- Download automático

## Próximos Passos

### Melhorias Sugeridas
1. **Exportação para Excel**: Adicionar opção de exportação XLSX
2. **Agendamento**: Relatórios automáticos por email
3. **Templates personalizáveis**: Permitir personalização de templates
4. **Gráficos**: Adicionar gráficos e visualizações
5. **Assinaturas digitais**: Integração com assinaturas eletrónicas

### Módulos Pendentes
- Sinalização
- Segurança Ferroviária
- Pontes/Túneis
- Estações
- Eletrificação
- Caracterização Solos
- Controlo Betonagens
- Via Férrea
- Registos
- Termos

## Teste do Sistema

### Para testar o sistema:
1. Executar o script `SETUP_SUBMISSAO_MATERIAIS_MOCK.sql` na Supabase
2. Navegar para o módulo "Submissão de Materiais"
3. Clicar em "Relatório"
4. Testar diferentes tipos de relatório
5. Testar a seleção de registos
6. Verificar a geração e download dos PDFs

### Verificações:
- ✅ Dados aparecem corretamente
- ✅ Estatísticas são calculadas corretamente
- ✅ PDFs são gerados sem erros
- ✅ Seleção de registos funciona
- ✅ Interface é responsiva

## Conclusão

O sistema de relatórios para Submissão de Materiais está completamente implementado e funcional. Oferece uma solução profissional e flexível para a geração de relatórios, com integração completa com a base de dados Supabase e interface de utilizador intuitiva.

O sistema está pronto para uso em ambiente de produção e pode ser facilmente estendido para outros módulos seguindo o mesmo padrão implementado.
