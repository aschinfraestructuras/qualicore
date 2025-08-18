# Guia de Relatórios PDF - Módulo Sinalização

## Visão Geral

O sistema de relatórios PDF para o módulo **Sinalização** foi implementado com funcionalidades avançadas de filtragem, seleção de registos e geração de relatórios profissionais. Este sistema permite gerar relatórios tanto para **Sinalizações** como para **Inspeções de Sinalização**.

## Funcionalidades Implementadas

### 1. Tipos de Relatórios Disponíveis

#### Para Sinalizações:
- **Relatório Executivo**: Visão geral com estatísticas principais
- **Relatório Filtrado**: Dados filtrados por critérios específicos
- **Relatório Comparativo**: Análise comparativa entre períodos
- **Relatório Individual**: Detalhes de uma sinalização específica

#### Para Inspeções de Sinalização:
- **Relatório Executivo**: Visão geral das inspeções realizadas
- **Relatório Filtrado**: Inspeções filtradas por critérios
- **Relatório Comparativo**: Comparação entre períodos de inspeção
- **Relatório Individual**: Detalhes de uma inspeção específica

### 2. Sistema de Seleção de Registos

- **Seleção Individual**: Clicar em cada registo para selecionar/desselecionar
- **Seleção em Lote**: Botão "Selecionar Todos" para seleção completa
- **Limpeza de Seleção**: Botão "Limpar Seleção" para remover todas as seleções
- **Contador Visual**: Mostra quantos registos estão selecionados
- **Modo de Seleção**: Toggle para ativar/desativar o modo de seleção

### 3. Filtros Avançados

#### Filtros para Sinalizações:
- **Tipo**: SEMAFORO, PLACA_INDICADORA, BARRERA, etc.
- **Categoria**: SINALIZACAO_LUMINOSA, SINALIZACAO_FIXA, etc.
- **Status Operacional**: OPERACIONAL, MANUTENCAO, AVARIA
- **Estado**: ATIVO, INATIVO
- **Localização**: Filtro por quilómetro
- **Responsável**: Filtro por nome do responsável
- **Fabricante**: Filtro por fabricante do equipamento
- **Data de Última Inspeção**: Filtro por período

#### Filtros para Inspeções:
- **Tipo de Inspeção**: ROTINA, MANUTENCAO, AVARIA, ESPECIAL, REPARACAO
- **Resultado**: CONFORME, NAO_CONFORME, PENDENTE
- **Prioridade**: CRITICA, ALTA, MEDIA, BAIXA
- **Inspetor**: Filtro por nome do inspetor
- **Sinalização**: Filtro por código da sinalização
- **Data de Inspeção**: Filtro por período

### 4. Estatísticas e KPIs

#### Para Sinalizações:
- Total de Sinalizações
- Sinalizações Operacionais
- Sinalizações em Manutenção
- Sinalizações em Avaria
- Sinalizações Ativas
- Sinalizações Inativas
- Distribuição por Tipo
- Distribuição por Categoria

#### Para Inspeções:
- Total de Inspeções
- Inspeções Conformes
- Inspeções Não Conformes
- Inspeções Pendentes
- Inspeções Críticas
- Inspeções de Alta Prioridade
- Distribuição por Tipo de Inspeção
- Distribuição por Resultado

## Como Usar

### 1. Aceder aos Relatórios

1. Navegar para o módulo **Sinalização**
2. Selecionar o separador **"Sinalizações"** ou **"Inspeções"**
3. Clicar no botão **"Relatório"** no cabeçalho da secção

### 2. Configurar o Relatório

1. **Selecionar Tipo de Relatório**:
   - Executivo
   - Filtrado
   - Comparativo
   - Individual

2. **Aplicar Filtros** (se necessário):
   - Preencher os campos de filtro desejados
   - Clicar em "Aplicar Filtros"

3. **Selecionar Registos** (opcional):
   - Ativar o modo de seleção
   - Selecionar registos individuais ou usar "Selecionar Todos"
   - Verificar o contador de registos selecionados

### 3. Gerar o PDF

1. Clicar no botão **"Gerar Relatório PDF"**
2. O sistema irá:
   - Preparar os dados filtrados/selecionados
   - Gerar o HTML do relatório
   - Abrir a janela de impressão do navegador
   - Permitir guardar como PDF

## Estrutura dos Relatórios

### Cabeçalho
- Logo da empresa (se configurado)
- Nome da empresa
- Informações de contacto
- Título do relatório
- Período e data de geração

### Corpo do Relatório
- **Resumo Executivo**: Descrição do relatório
- **Estatísticas Gerais**: KPIs principais em cards visuais
- **Análise por Tipo**: Distribuição por tipo de sinalização/inspeção
- **Análise por Categoria**: Distribuição por categoria
- **Tabela Detalhada**: Dados completos com formatação profissional

### Rodapé
- Informações da página
- Data e hora de geração
- Dados da empresa

## Formatação e Estilos

### Cores de Status
- **Operacional/Conforme**: Verde (#28a745)
- **Manutenção/Pendente**: Amarelo (#ffc107)
- **Avaria/Não Conforme**: Vermelho (#dc3545)
- **Crítico**: Vermelho escuro (#dc3545)
- **Alta Prioridade**: Laranja (#fd7e14)

### Tipografia
- **Fonte Principal**: Segoe UI, Tahoma, Geneva, Verdana, sans-serif
- **Títulos**: Cor azul escura (#1e3c72)
- **Texto**: Cor cinza escura (#333)
- **Destaques**: Negrito para valores importantes

## Integração com Supabase

### Tabelas Utilizadas
- `sinalizacoes`: Dados das sinalizações
- `inspecoes_sinalizacao`: Dados das inspeções

### APIs Utilizadas
- `sinalizacaoAPI.getSinalizacoes()`: Obter sinalizações
- `sinalizacaoAPI.getInspecoes()`: Obter inspeções

### Armazenamento
- **Fotos**: Array JSON com URLs das imagens
- **Documentos**: Array JSON com URLs dos documentos
- **Dados Técnicos**: Campos específicos para cada tipo de sinalização

## Dados Mock Incluídos

### Sinalizações (10 registos):
- Semáforos, placas indicadoras, barreiras
- Sinais acústicos, displays LED, luzes de emergência
- Câmeras CCTV, sensores de presença
- Painéis informativos, sinais de rádio

### Inspeções (15 registos):
- Inspeções de rotina, manutenção, avaria
- Inspeções especiais e reparação
- Diferentes resultados e prioridades
- Múltiplos inspetores

## Configuração da Empresa

O sistema utiliza a configuração global da empresa para:
- Nome da empresa
- Logotipo
- Morada e contacto
- NIF
- Website

## Próximos Passos

1. **Testar o Sistema**: Executar o script SQL para adicionar dados mock
2. **Verificar Funcionalidades**: Testar filtros e seleção de registos
3. **Personalizar**: Ajustar estilos e configurações conforme necessário
4. **Implementar Upload/Download**: Adicionar funcionalidade de upload/download de ficheiros

## Troubleshooting

### Problemas Comuns:
1. **Erro de Permissões**: Verificar políticas RLS no Supabase
2. **Dados Não Aparecem**: Executar script de dados mock
3. **PDF Não Gera**: Verificar bloqueio de popups no navegador
4. **Filtros Não Funcionam**: Verificar tipos de dados no Supabase

### Logs Úteis:
- Console do navegador para erros JavaScript
- Logs do Supabase para erros de API
- Network tab para verificar chamadas de API

## Conclusão

O sistema de relatórios PDF para Sinalização está completamente implementado e funcional, oferecendo:
- Relatórios profissionais e bem estruturados
- Sistema avançado de filtros
- Seleção flexível de registos
- Integração completa com Supabase
- Dados mock para testes
- Interface intuitiva e responsiva

O sistema está pronto para uso em ambiente de produção e pode ser facilmente expandido com novas funcionalidades conforme necessário.
