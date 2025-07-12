# Qualicore - Sistema de Gestão da Qualidade

Um sistema moderno e profissional para gestão da qualidade em projetos de construção civil, desenvolvido com React, TypeScript, Tailwind CSS e PocketBase.

## 🚀 Funcionalidades

### 📊 Dashboard Interativo
- Visão geral dos principais indicadores
- Gráficos e estatísticas em tempo real
- Acesso rápido às funcionalidades principais

### 🔬 Gestão de Ensaios
- Registro de ensaios laboratoriais
- Controlo de conformidade
- Upload de documentos e relatórios
- Geração automática de códigos

### ✅ Checklists de Inspeção
- Criação de checklists personalizados
- Controlo de percentual de conformidade
- Gestão de inspetores e responsáveis
- Histórico de inspeções

### 📦 Gestão de Materiais
- Controlo de stocks e lotes
- Certificados de qualidade
- Rastreabilidade de fornecedores
- Estados de aprovação

### 🏢 Gestão de Fornecedores
- Cadastro completo de fornecedores
- Controlo de estado ativo/inativo
- Informações de contacto
- Histórico de fornecimentos

### ⚠️ Não Conformidades
- Registro de não conformidades
- Classificação por severidade
- Ações corretivas
- Controlo de custos

### 📄 Documentos
- Gestão de documentação técnica
- Controlo de versões
- Estados de aprovação
- Upload de anexos

## 🛠️ Tecnologias Utilizadas

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS, Framer Motion
- **Forms**: React Hook Form, Zod
- **Backend**: PocketBase
- **UI Components**: Lucide React Icons
- **Notifications**: React Hot Toast

## 📦 Instalação

1. **Clone o repositório**
   ```bash
   git clone <repository-url>
   cd Qualicore
   ```

2. **Instale as dependências**
   ```bash
   npm install
   ```

3. **Configure o PocketBase**
   ```bash
   # Execute o script de configuração
   node scripts/setup-pocketbase.js
   ```

4. **Inicie o servidor de desenvolvimento**
   ```bash
   npm run dev
   ```

5. **Acesse a aplicação**
   ```
   http://localhost:3000
   ```

## 🗄️ Estrutura da Base de Dados

O sistema utiliza PocketBase com as seguintes coleções:

- **ensaios**: Ensaios laboratoriais e testes
- **checklists**: Checklists de inspeção
- **materiais**: Gestão de materiais e stocks
- **fornecedores**: Cadastro de fornecedores
- **nao_conformidades**: Registro de não conformidades
- **documentos**: Gestão documental

## 🎨 Design System

O sistema utiliza um design system moderno com:

- **Cores**: Paleta profissional em tons de azul
- **Tipografia**: Hierarquia clara e legível
- **Componentes**: Reutilizáveis e consistentes
- **Responsividade**: Adaptável a todos os dispositivos
- **Animações**: Transições suaves com Framer Motion

## 🔧 Scripts Disponíveis

- `npm run dev` - Inicia o servidor de desenvolvimento
- `npm run build` - Constrói a aplicação para produção
- `npm run preview` - Visualiza a build de produção
- `npm run pocketbase` - Inicia o servidor PocketBase

## 📱 Funcionalidades Avançadas

### Formulários Inteligentes
- Validação em tempo real
- Geração automática de códigos
- Upload de múltiplos ficheiros
- Preenchimento automático

### Sistema de Notificações
- Toast notifications
- Feedback visual de ações
- Estados de loading
- Mensagens de erro/sucesso

### Navegação Moderna
- Navbar responsivo
- Breadcrumbs
- Navegação por teclado
- URLs amigáveis

## 🚀 Próximas Funcionalidades

- [ ] Sistema de relatórios avançados
- [ ] Exportação de dados (PDF, Excel)
- [ ] Dashboard personalizável
- [ ] Sistema de notificações push
- [ ] Integração com APIs externas
- [ ] Modo offline
- [ ] Backup automático
- [ ] Sistema de auditoria

## 📄 Licença

Este projeto está licenciado sob a Licença MIT - veja o arquivo [LICENSE.md](LICENSE.md) para detalhes.

## 👥 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📞 Suporte

Para suporte técnico ou dúvidas, contacte:
- Email: sitecore.quality@gmail.com
- Desenvolvedor: José Antunes

---

**Qualicore** - Modernizando a gestão da qualidade na construção civil 🏗️ 