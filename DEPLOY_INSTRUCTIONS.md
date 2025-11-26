# Estacione Fácil API

## Deploy no Render

### Passo 1: Preparar o repositório Git

```bash
cd api
git init
git add .
git commit -m "Initial commit"
```

### Passo 2: Criar repositório no GitHub

1. Acesse https://github.com/new
2. Crie um repositório chamado `estacione-facil-api`
3. Não inicialize com README

```bash
git remote add origin https://github.com/SEU-USUARIO/estacione-facil-api.git
git branch -M main
git push -u origin main
```

### Passo 3: Deploy no Render

1. Acesse https://render.com e faça login
2. Clique em "New +" → "Web Service"
3. Conecte seu repositório GitHub
4. Configure:
   - **Name**: estacione-facil-api
   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free

5. Adicione as variáveis de ambiente:
   - `NODE_ENV` = `production`
   - `SUPABASE_URL` = `https://gcboijfzsseqhwzlqfib.supabase.co`
   - `SUPABASE_ANON_KEY` = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdjYm9pamZ6c3NlcWh3emxxZmliIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM2NDU2NjMsImV4cCI6MjA3OTIyMTY2M30.gYW1GNh5ZBaDs1NdDmniWPgmkr-44_YfBNHA2kqYvN8`

6. Clique em "Create Web Service"

### Passo 4: Obter URL da API

Após o deploy, sua API estará disponível em:
```
https://estacione-facil-api.onrender.com
```

**IMPORTANTE**: Copie essa URL e atualize no arquivo `mobile/app.json`:
```json
"extra": {
  "apiUrl": "https://estacione-facil-api.onrender.com/api"
}
```

---

## Gerar APK do Mobile

### Opção 1: Build Local (Requer Android Studio)

```bash
cd mobile
npx expo prebuild
npx expo run:android --variant release
```

O APK estará em: `mobile/android/app/build/outputs/apk/release/app-release.apk`

### Opção 2: Build Online com EAS (Recomendado)

```bash
cd mobile
npm install -g eas-cli
eas login
eas build:configure
eas build --platform android --profile preview
```

**Importante**: Antes de buildar, atualize a URL da API no `app.json` com a URL do Render!

### Download do APK

Após o build, você receberá um link para download do APK. Compartilhe esse link para instalar o app.

---

## Checklist Final

- [ ] API hospedada no Render
- [ ] URL da API atualizada em `mobile/app.json`
- [ ] APK gerado com EAS ou build local
- [ ] Testar login no app
- [ ] Verificar se dados carregam corretamente
- [ ] Testar entrada e saída de veículos
