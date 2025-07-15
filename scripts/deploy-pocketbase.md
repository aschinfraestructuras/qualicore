# Deploy PocketBase no Render (Gratuito)

## Passo a Passo:

### 1. Criar conta no Render

- Vá para https://render.com
- Registe-se com GitHub ou email
- Confirme o email

### 2. Criar novo Web Service

- Clique em "New +" → "Web Service"
- Conecte o seu repositório GitHub (Qualicore)
- Configure:
  - **Name**: `qualicore-pocketbase`
  - **Environment**: `Docker`
  - **Branch**: `main`
  - **Root Directory**: deixe vazio
  - **Build Command**: deixe vazio (usa Dockerfile)
  - **Start Command**: deixe vazio (usa Dockerfile)

### 3. Configurar variáveis de ambiente

- Vá para "Environment" na configuração do serviço
- Adicione:
  - `POCKETBASE_ADMIN_EMAIL`: `admin@qualicore.pt`
  - `POCKETBASE_ADMIN_PASSWORD`: (gerar password forte)

### 4. Deploy

- Clique em "Create Web Service"
- Aguarde o build (pode demorar 5-10 minutos)
- O PocketBase ficará disponível em: `https://qualicore-pocketbase.onrender.com`

### 5. Configurar PocketBase

- Aceda ao admin: `https://qualicore-pocketbase.onrender.com/_/`
- Login com as credenciais configuradas
- Crie as coleções necessárias (ensaios, documentos, etc.)

### 6. Atualizar o site

- No código React, mude o endpoint do PocketBase para o URL do Render
- Faça deploy do site na Vercel

## Vantagens do Render:

- ✅ **Gratuito** (até 750h/mês)
- ✅ **HTTPS automático**
- ✅ **Deploy automático** (quando faz push)
- ✅ **Backup automático** dos dados
- ✅ **Escalável** (pode pagar para mais recursos)

## Limitações do plano gratuito:

- ⚠️ **Dorme após 15min** de inatividade
- ⚠️ **512MB RAM** (suficiente para PocketBase)
- ⚠️ **1 serviço** gratuito
