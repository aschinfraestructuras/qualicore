# Setup do Qualicore

## 🚀 Configuração Rápida

### 1. Instalar Dependências
```bash
npm install
```

### 2. Baixar PocketBase
1. Vá para https://pocketbase.io/
2. Baixe o executável para Windows
3. Coloque o `pocketbase.exe` na pasta raiz do projeto

### 3. Iniciar o Backend
```bash
npm run pocketbase
```
Isso vai abrir o PocketBase em http://127.0.0.1:8090

### 4. Configurar as Coleções
No admin do PocketBase (http://127.0.0.1:8090/_/), crie as seguintes coleções:

#### Documentos
- `codigo` (text, required)
- `tipo` (select: projeto, especificacao, relatorio, certificado, outro)
- `versao` (text, required)
- `data_validade` (date)
- `fornecedor_id` (relation: fornecedores)
- `responsavel` (text, required)
- `zona` (text, required)
- `estado` (select: pendente, em_analise, aprovado, reprovado, concluido)
- `observacoes` (text)
- `anexos` (files)

#### Ensaios
- `codigo` (text, required)
- `tipo` (select: resistencia, densidade, absorcao, durabilidade, outro)
- `material_id` (relation: materiais)
- `resultado` (text, required)
- `valor_obtido` (number, required)
- `valor_esperado` (number, required)
- `unidade` (text, required)
- `laboratorio` (text, required)
- `data_ensaio` (date, required)
- `conforme` (bool, required)
- `responsavel` (text, required)
- `zona` (text, required)
- `estado` (select: pendente, em_analise, aprovado, reprovado, concluido)
- `observacoes` (text)
- `anexos` (files)

#### Checklists
- `codigo` (text, required)
- `tipo` (select: inspecao, verificacao, aceitacao, outro)
- `itens` (json)
- `percentual_conformidade` (number, required)
- `data_inspecao` (date, required)
- `inspetor` (text, required)
- `responsavel` (text, required)
- `zona` (text, required)
- `estado` (select: pendente, em_analise, aprovado, reprovado, concluido)
- `observacoes` (text)
- `anexos` (files)

#### Materiais
- `codigo` (text, required)
- `nome` (text, required)
- `tipo` (select: betao, aco, agregado, cimento, outro)
- `fornecedor_id` (relation: fornecedores)
- `certificado_id` (text)
- `data_rececao` (date, required)
- `quantidade` (number, required)
- `unidade` (text, required)
- `lote` (text, required)
- `responsavel` (text, required)
- `zona` (text, required)
- `estado` (select: pendente, em_analise, aprovado, reprovado, concluido)
- `observacoes` (text)
- `anexos` (files)

#### Fornecedores
- `nome` (text, required)
- `nif` (text, required)
- `morada` (text, required)
- `telefone` (text, required)
- `email` (email, required)
- `contacto` (text, required)
- `estado` (select: ativo, inativo)

#### Não Conformidades
- `codigo` (text, required)
- `tipo` (select: material, execucao, documentacao, seguranca, outro)
- `severidade` (select: baixa, media, alta, critica)
- `data_deteccao` (date, required)
- `data_resolucao` (date)
- `acao_corretiva` (text)
- `responsavel_resolucao` (text)
- `custo_estimado` (number)
- `relacionado_ensaio_id` (relation: ensaios)
- `relacionado_material_id` (relation: materiais)
- `responsavel` (text, required)
- `zona` (text, required)
- `estado` (select: pendente, em_analise, aprovado, reprovado, concluido)
- `observacoes` (text)
- `anexos` (files)

### 5. Iniciar o Frontend
```bash
npm run dev
```

## ✅ Vantagens do PocketBase

- **Zero configuração** - só baixar e executar
- **Interface admin automática** - cria tabelas visualmente
- **API automática** - endpoints gerados automaticamente
- **Upload de ficheiros** - suporte nativo
- **Autenticação** - sistema de login incluído
- **Real-time** - atualizações em tempo real
- **Dados reais** - não são mockups

## 🔧 Alternativas

Se preferir não usar PocketBase:

1. **LocalStorage** - dados no navegador (já implementado)
2. **Firebase** - backend na nuvem
3. **Supabase** - PostgreSQL na nuvem

## 📝 Notas

- O PocketBase cria um ficheiro `pb_data` com os dados
- Pode fazer backup exportando os dados
- Funciona offline após primeira configuração
- Interface admin em http://127.0.0.1:8090/_/ 