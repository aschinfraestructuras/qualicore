# ⚡ Setup Rápido - Qualicore

## 🚀 Configuração em 3 Passos

### 1. Iniciar PocketBase
```bash
npm run setup-simple
```
Este comando:
- ✅ Verifica se o PocketBase existe
- ✅ Inicia o servidor PocketBase
- ✅ Mostra as URLs de acesso

### 2. Criar Administrador
1. Abra http://127.0.0.1:8090/_/ no navegador
2. Clique em "Create your first admin account"
3. Use estas credenciais:
   - **Email**: admin@qualicore.pt
   - **Password**: admin123

### 3. Configurar Coleções
```bash
npm run setup-collections
```
Este comando cria todas as coleções e dados de demonstração.

### 4. Iniciar Aplicação
```bash
npm run dev
```
Aceda a http://localhost:3000

## 🔑 Credenciais de Login

### Aplicação (Mock Users)
- **Admin**: admin@qualicore.pt / admin123
- **Qualidade**: qualidade@qualicore.pt / qualidade123
- **Produção**: producao@qualicore.pt / producao123
- **Gestão**: gestao@qualicore.pt / gestao123

## 📋 URLs Importantes

- **Aplicação**: http://localhost:3000
- **PocketBase**: http://127.0.0.1:8090
- **PocketBase Admin**: http://127.0.0.1:8090/_/

## 🛠️ Comandos Úteis

| Comando | Descrição |
|---------|-----------|
| `npm run setup-simple` | Inicia PocketBase e mostra instruções |
| `npm run setup-collections` | Cria coleções e dados demo |
| `npm run pocketbase` | Inicia apenas o PocketBase |
| `npm run dev` | Inicia a aplicação |

## 🚨 Se algo não funcionar

1. **PocketBase não inicia**: Verifique se `pocketbase.exe` está na pasta raiz
2. **Erro de conexão**: Aguarde alguns segundos após iniciar o PocketBase
3. **Coleções não criadas**: Execute `npm run setup-collections` após criar o admin

---

**Qualicore** - Sistema de Gestão da Qualidade 