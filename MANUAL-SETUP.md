# 🛠️ Setup Manual - Qualicore

## ✅ Status Atual

- ✅ PocketBase está a funcionar
- ✅ Interface admin está acessível
- ❌ API de autenticação não está a funcionar (não é problema)

## 🚀 Configuração Manual

### 1. Aceder ao PocketBase Admin

Abra no navegador: **http://127.0.0.1:8090/_/**

### 2. Fazer Login

- **Email**: sitecore.quality@gmail.com
- **Password**: Hercules2.1

### 3. Criar Coleções

Vá para **Collections** no menu lateral e crie as seguintes coleções:

#### 📄 documentos

| Campo          | Tipo   | Obrigatório | Opções                                             |
| -------------- | ------ | ----------- | -------------------------------------------------- |
| titulo         | text   | ✅          | min: 1, max: 200                                   |
| descricao      | text   | ❌          | max: 1000                                          |
| tipo           | select | ✅          | procedimento, instrucao, formulario, manual, outro |
| versao         | text   | ✅          | min: 1, max: 20                                    |
| status         | select | ✅          | rascunho, em_revisao, aprovado, obsoleto           |
| data_criacao   | date   | ✅          | -                                                  |
| data_aprovacao | date   | ❌          | -                                                  |
| responsavel    | text   | ✅          | min: 1, max: 100                                   |
| departamento   | text   | ✅          | min: 1, max: 100                                   |
| tags           | text   | ❌          | max: 500                                           |

#### ✅ checklists

| Campo               | Tipo   | Obrigatório | Opções                                                             |
| ------------------- | ------ | ----------- | ------------------------------------------------------------------ |
| titulo              | text   | ✅          | min: 1, max: 200                                                   |
| descricao           | text   | ❌          | max: 1000                                                          |
| tipo                | select | ✅          | inspecao, auditoria, verificacao, manutencao, outro                |
| status              | select | ✅          | ativo, inativo, em_revisao                                         |
| frequencia          | select | ✅          | diario, semanal, mensal, trimestral, semestral, anual, sob_demanda |
| responsavel         | text   | ✅          | min: 1, max: 100                                                   |
| departamento        | text   | ✅          | min: 1, max: 100                                                   |
| data_criacao        | date   | ✅          | -                                                                  |
| data_ultima_revisao | date   | ❌          | -                                                                  |
| itens               | json   | ✅          | -                                                                  |

#### 🔬 ensaios

| Campo            | Tipo   | Obrigatório | Opções                                                                  |
| ---------------- | ------ | ----------- | ----------------------------------------------------------------------- |
| titulo           | text   | ✅          | min: 1, max: 200                                                        |
| descricao        | text   | ❌          | max: 1000                                                               |
| tipo_ensaio      | select | ✅          | destrutivo, nao_destrutivo, visual, dimensional, quimico, fisico, outro |
| status           | select | ✅          | agendado, em_andamento, concluido, cancelado, reagendado                |
| data_agendamento | date   | ✅          | -                                                                       |
| data_inicio      | date   | ❌          | -                                                                       |
| data_conclusao   | date   | ❌          | -                                                                       |
| responsavel      | text   | ✅          | min: 1, max: 100                                                        |
| laboratorio      | text   | ✅          | min: 1, max: 100                                                        |
| amostra          | text   | ✅          | min: 1, max: 100                                                        |
| resultado        | select | ❌          | aprovado, reprovado, condicional, pendente                              |
| observacoes      | text   | ❌          | max: 1000                                                               |

#### 🏢 fornecedores

| Campo                 | Tipo   | Obrigatório | Opções                                                |
| --------------------- | ------ | ----------- | ----------------------------------------------------- |
| nome                  | text   | ✅          | min: 1, max: 200                                      |
| nif                   | text   | ✅          | min: 9, max: 9                                        |
| endereco              | text   | ✅          | max: 500                                              |
| cidade                | text   | ✅          | min: 1, max: 100                                      |
| codigo_postal         | text   | ✅          | min: 4, max: 8                                        |
| pais                  | text   | ✅          | min: 1, max: 100                                      |
| telefone              | text   | ✅          | min: 9, max: 20                                       |
| email                 | email  | ✅          | -                                                     |
| website               | url    | ❌          | -                                                     |
| tipo_servico          | select | ✅          | materiais, servicos, equipamentos, consultoria, outro |
| status                | select | ✅          | ativo, inativo, suspenso, em_avaliacao                |
| data_registro         | date   | ✅          | -                                                     |
| data_ultima_avaliacao | date   | ❌          | -                                                     |
| classificacao         | number | ❌          | min: 1, max: 5                                        |
| observacoes           | text   | ❌          | max: 1000                                             |

#### 📦 materiais

| Campo          | Tipo   | Obrigatório | Opções                                                                                                     |
| -------------- | ------ | ----------- | ---------------------------------------------------------------------------------------------------------- |
| codigo         | text   | ✅          | min: 1, max: 50                                                                                            |
| nome           | text   | ✅          | min: 1, max: 200                                                                                           |
| descricao      | text   | ❌          | max: 1000                                                                                                  |
| categoria      | select | ✅          | cimento, betao, aco, madeira, isolamento, impermeabilizacao, acabamentos, equipamentos, ferramentas, outro |
| unidade        | select | ✅          | kg, ton, m, m2, m3, l, un, caixa, rolo, outro                                                              |
| preco_unitario | number | ✅          | min: 0                                                                                                     |
| stock_minimo   | number | ✅          | min: 0                                                                                                     |
| stock_atual    | number | ✅          | min: 0                                                                                                     |
| localizacao    | text   | ✅          | min: 1, max: 100                                                                                           |
| data_entrada   | date   | ✅          | -                                                                                                          |
| data_validade  | date   | ❌          | -                                                                                                          |
| status         | select | ✅          | disponivel, esgotado, reservado, obsoleto                                                                  |
| certificacoes  | text   | ❌          | max: 500                                                                                                   |
| observacoes    | text   | ❌          | max: 1000                                                                                                  |

#### ⚠️ nao_conformidades

| Campo                | Tipo   | Obrigatório | Opções                                               |
| -------------------- | ------ | ----------- | ---------------------------------------------------- |
| titulo               | text   | ✅          | min: 1, max: 200                                     |
| descricao            | text   | ✅          | max: 1000                                            |
| tipo                 | select | ✅          | produto, processo, sistema, documentacao, outro      |
| severidade           | select | ✅          | baixa, media, alta, critica                          |
| status               | select | ✅          | aberta, em_analise, em_correcao, verificada, fechada |
| data_deteccao        | date   | ✅          | -                                                    |
| data_limite          | date   | ✅          | -                                                    |
| data_fechamento      | date   | ❌          | -                                                    |
| responsavel_deteccao | text   | ✅          | min: 1, max: 100                                     |
| responsavel_correcao | text   | ✅          | min: 1, max: 100                                     |
| departamento         | text   | ✅          | min: 1, max: 100                                     |
| causa_raiz           | text   | ❌          | max: 1000                                            |
| acao_corretiva       | text   | ❌          | max: 1000                                            |
| acao_preventiva      | text   | ❌          | max: 1000                                            |
| custo_estimado       | number | ❌          | min: 0                                               |
| observacoes          | text   | ❌          | max: 1000                                            |

### 4. Iniciar a Aplicação

```bash
npm run dev
```

### 5. Fazer Login na Aplicação

Use as credenciais mock:

- **Admin**: admin@qualicore.pt / admin123
- **Qualidade**: qualidade@qualicore.pt / qualidade123
- **Produção**: producao@qualicore.pt / producao123
- **Gestão**: gestao@qualicore.pt / gestao123

## 🎯 URLs Importantes

- **Aplicação**: http://localhost:3000
- **PocketBase**: http://127.0.0.1:8090
- **PocketBase Admin**: http://127.0.0.1:8090/_/

## 💡 Dicas

1. Crie as coleções uma por vez
2. Teste a aplicação após criar cada coleção
3. Se precisar de ajuda, consulte a documentação do PocketBase
4. As coleções podem ser editadas depois

---

**Qualicore** - Sistema de Gestão da Qualidade
