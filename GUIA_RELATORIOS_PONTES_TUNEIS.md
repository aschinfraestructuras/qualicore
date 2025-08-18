# 📊 Sistema de Relatórios PDF - Módulo Pontes e Túneis

## 📋 Visão Geral

O sistema de relatórios PDF para o módulo **Pontes e Túneis** foi implementado com funcionalidades avançadas de filtragem, seleção de registos e geração de relatórios profissionais. Este sistema permite gerar relatórios tanto para **Pontes e Túneis** como para **Inspeções de Pontes e Túneis**.

## Funcionalidades Implementadas

### 1. Tipos de Relatórios Disponíveis

#### Para Pontes e Túneis:
- **Relatório Executivo**: Visão geral com estatísticas principais
- **Relatório Filtrado**: Dados filtrados por critérios específicos
- **Relatório Comparativo**: Análise comparativa entre períodos
- **Relatório Individual**: Detalhes de uma ponte/túnel específico

#### Para Inspeções de Pontes e Túneis:
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

#### Filtros para Pontes e Túneis:
- **Tipo**: PONTE, TUNEL, VIADUTO, PASSAGEM_SUPERIOR, PASSAGEM_INFERIOR, AQUEDUTO
- **Categoria**: ESTRUTURAL, HIDRAULICA, GEOTECNICA, SINALIZACAO, ILUMINACAO, DRENAGEM
- **Estado**: ATIVO, INATIVO, MANUTENCAO, AVARIA, CONSTRUCAO, DESATIVADO
- **Status Operacional**: OPERACIONAL, MANUTENCAO, AVARIA, EMERGENCIA, PLANEAMENTO
- **Localização**: Filtro por localização geográfica
- **Responsável**: Filtro por nome do responsável
- **Fabricante**: Filtro por fabricante do equipamento
- **Data de Construção**: Filtro por período
- **Última Inspeção**: Filtro por período

#### Filtros para Inspeções:
- **Tipo de Inspeção**: ROTINA, MANUTENCAO, AVARIA, ESPECIAL, REPARACAO, CONSTRUCAO
- **Resultado**: CONFORME, NAO_CONFORME, PENDENTE, CRITICO, EM_ANALISE
- **Responsável**: Filtro por nome do responsável
- **Ponte/Túnel**: Filtro por ponte/túnel específico
- **Data de Inspeção**: Filtro por período
- **Próxima Inspeção**: Filtro por período

### 4. Estatísticas e KPIs

#### Para Pontes e Túneis:
- **Total**: Contagem geral de pontes e túneis
- **Pontes**: Número de pontes
- **Túneis**: Número de túneis
- **Operacionais**: Pontes/túneis em estado operacional
- **Manutenção**: Pontes/túneis em manutenção
- **Avaria**: Pontes/túneis com avaria
- **Ativos**: Pontes/túneis ativos
- **Inativos**: Pontes/túneis inativos

#### Para Inspeções:
- **Total de Inspeções**: Contagem geral
- **Conformes**: Inspeções com resultado conforme
- **Não Conformes**: Inspeções com resultado não conforme
- **Pendentes**: Inspeções pendentes
- **Críticas**: Inspeções críticas

### 5. Análises por Tipo e Categoria

- **Distribuição por Tipo**: Análise das pontes/túneis por tipo (Ponte, Túnel, Viaduto, etc.)
- **Distribuição por Categoria**: Análise por categoria técnica
- **Distribuição por Estado**: Análise por estado operacional
- **Distribuição por Status**: Análise por status operacional

## Como Usar

### 1. Aceder ao Módulo

1. Faça login no sistema Qualicore
2. Navegue para **"Pontes & Túneis"** no menu lateral
3. Clique no botão **"Relatório"** (verde) no cabeçalho

### 2. Configurar o Relatório

1. **Escolher Tipo de Relatório**:
   - **Executivo**: Visão geral com estatísticas
   - **Filtrado**: Dados filtrados com tabela completa
   - **Comparativo**: Análises comparativas
   - **Individual**: Ficha técnica específica

2. **Escolher Módulo**:
   - **Pontes e Túneis**: Relatórios sobre infraestruturas
   - **Inspeções**: Relatórios sobre inspeções realizadas

3. **Ativar Seleção** (opcional):
   - Clique no botão **"Seleção"** para ativar o modo de seleção
   - Selecione registos específicos para incluir no relatório
   - Use **"Selecionar Todos"** ou **"Limpar Seleção"** para gestão rápida

### 3. Gerar PDF

1. Clique em **"Gerar PDF Premium"**
2. O PDF será gerado e descarregado automaticamente
3. O ficheiro terá o nome: `relatorio_pontes_tuneis_[tipo]_[data].pdf`

## Tipos de Relatórios Detalhados

### 📊 Relatório Executivo

**Conteúdo**:
- Estatísticas gerais (total, pontes, túneis, operacionais, manutenção, avaria)
- KPIs visuais com cores
- Análise por tipo de infraestrutura
- Resumo executivo para direção

**Ideal para**: Apresentações à direção, relatórios mensais, visão geral

### 🔍 Relatório Filtrado

**Conteúdo**:
- Filtros aplicados no topo
- Tabela completa com todos os dados
- Colunas personalizáveis
- Dados reais da base de dados

**Ideal para**: Relatórios técnicos, análises detalhadas, auditorias

### 📈 Relatório Comparativo

**Conteúdo**:
- Distribuição por tipo e categoria
- Análise por estado e status
- Comparações visuais
- Tendências e padrões

**Ideal para**: Análise de performance, planeamento, melhorias

### 📋 Relatório Individual

**Conteúdo**:
- Ficha técnica completa da ponte/túnel
- Histórico de inspeções
- Parâmetros técnicos
- Observações e recomendações

**Ideal para**: Fichas técnicas, documentação específica

## Estrutura dos Dados

### Pontes e Túneis

**Campos principais**:
- **Código**: Identificador único (ex: PT-001, TN-001)
- **Tipo**: PONTE, TUNEL, VIADUTO, PASSAGEM_SUPERIOR, PASSAGEM_INFERIOR, AQUEDUTO
- **Categoria**: ESTRUTURAL, HIDRAULICA, GEOTECNICA, SINALIZACAO, ILUMINACAO, DRENAGEM
- **Localização**: Localização geográfica
- **Estado**: ATIVO, INATIVO, MANUTENCAO, AVARIA, CONSTRUCAO, DESATIVADO
- **Status Operacional**: OPERACIONAL, MANUTENCAO, AVARIA, EMERGENCIA, PLANEAMENTO
- **Fabricante**: Empresa fabricante
- **Responsável**: Engenheiro responsável
- **Parâmetros**: Comprimento, largura, altura, capacidade de carga
- **Datas**: Construção, última inspeção, próxima inspeção

### Inspeções

**Campos principais**:
- **Data de Inspeção**: Data da inspeção realizada
- **Tipo de Inspeção**: ROTINA, MANUTENCAO, AVARIA, ESPECIAL, REPARACAO, CONSTRUCAO
- **Resultado**: CONFORME, NAO_CONFORME, PENDENTE, CRITICO, EM_ANALISE
- **Responsável**: Engenheiro responsável pela inspeção
- **Próxima Inspeção**: Data da próxima inspeção programada
- **Observações**: Detalhes e recomendações

## Cores e Indicadores Visuais

### Status de Pontes/Túneis

- **🟢 Operacional**: Verde - Funcionamento normal
- **🟡 Manutenção**: Amarelo - Em manutenção programada
- **🔴 Avaria**: Vermelho - Com avaria detetada
- **🔵 Construção**: Azul - Em construção
- **⚫ Inativo**: Cinza - Inativo/desativado

### Resultados de Inspeções

- **🟢 Conforme**: Verde - Sem anomalias
- **🔴 Não Conforme**: Vermelho - Anomalias detetadas
- **🟡 Pendente**: Amarelo - Aguardando resultados
- **🔴 Crítico**: Vermelho escuro - Anomalias críticas

### Tipos de Infraestrutura

- **🔵 Ponte**: Azul - Estruturas sobre cursos de água
- **🟣 Túnel**: Roxo - Estruturas subterrâneas
- **🟢 Viaduto**: Verde - Estruturas sobre vales
- **🟡 Passagem Superior**: Amarelo - Passagens sobre vias
- **🟠 Passagem Inferior**: Laranja - Passagens sob vias
- **🔵 Aqueduto**: Azul claro - Estruturas hídricas

## Configuração da Empresa

O sistema utiliza a configuração da empresa para personalizar os relatórios:

- **Logotipo**: Exibido no cabeçalho
- **Dados da Empresa**: Nome, NIF, morada, contacto
- **Cabeçalho Personalizado**: Com informações da empresa
- **Rodapé**: Com dados de contacto e informações legais

## Dados Mock Incluídos

### Pontes e Túneis (10 registos)
- **Pontes**: PT-001 (Rio Douro), PT-002 (Rio Mondego), PT-003 (Rio Guadiana)
- **Túneis**: TN-001 (Serra da Estrela), TN-002 (Serra do Marão)
- **Viadutos**: VD-001 (Vale do Tejo), VD-002 (Vale do Côa)
- **Passagens**: PS-001 (Avenida da República), PI-001 (Ribeira de Sintra)
- **Aqueduto**: AQ-001 (Montejunto)

### Inspeções (15 registos)
- Inspeções de rotina, manutenção, avaria
- Diferentes resultados e responsáveis
- Datas distribuídas ao longo do tempo
- Observações realistas

## Script SQL

Para testar o sistema, execute o script `SETUP_PONTES_TUNEIS_MOCK.sql` na Supabase:

```sql
-- Execute o script na Supabase SQL Editor
-- Isso cria dados mock e resolve permissões
```

## Funcionalidades Avançadas

### 1. Seleção Inteligente

- **Seleção por Critérios**: Filtre e depois selecione todos os resultados
- **Seleção Múltipla**: Combine diferentes tipos de infraestruturas
- **Seleção Temporal**: Selecione por período de inspeção

### 2. Exportação Personalizada

- **Nome do Ficheiro**: Inclui tipo de relatório e data
- **Formato Profissional**: Cabeçalho e rodapé personalizados
- **Dados Completos**: Todas as informações relevantes

### 3. Análise Estatística

- **KPIs Automáticos**: Cálculos em tempo real
- **Distribuições**: Análise por diferentes critérios
- **Tendências**: Evolução temporal dos dados

## Troubleshooting

### Problemas Comuns

1. **Erro ao gerar PDF**:
   - Verifique se o navegador permite downloads
   - Confirme que há dados para gerar o relatório

2. **Dados não aparecem**:
   - Execute o script SQL de dados mock
   - Verifique as permissões RLS na Supabase

3. **Seleção não funciona**:
   - Ative o modo de seleção
   - Verifique se há dados na tabela

### Suporte

Para problemas técnicos:
- Verifique os logs do console do navegador
- Confirme a conectividade com a Supabase
- Teste com dados mock primeiro

## Conclusão

O sistema de relatórios PDF para Pontes e Túneis oferece:

- ✅ **Relatórios profissionais** com formatação de alta qualidade
- ✅ **Sistema avançado de filtros** para análise detalhada
- ✅ **Seleção flexível de registos** para relatórios personalizados
- ✅ **Integração completa** com o sistema existente
- ✅ **Dados mock realistas** para testes imediatos
- ✅ **Documentação completa** para uso e manutenção

O módulo está pronto para uso em ambiente de produção e pode ser facilmente expandido conforme as necessidades do projeto.

---

**Sistema implementado com sucesso! 🎉**
