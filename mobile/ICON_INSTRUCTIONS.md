# Instruções para Ícones do App

## Ícones Necessários

### 1. Icon (Ícone do App)
- **Arquivo**: `assets/icon.png`
- **Tamanho**: 1024x1024 pixels
- **Formato**: PNG com fundo
- **Uso**: Ícone que aparece na tela inicial do celular

### 2. Splash Screen (Tela de Carregamento)
- **Arquivo**: `assets/splash.png`
- **Tamanho**: 1242x2436 pixels (ou qualquer proporção 9:16)
- **Formato**: PNG
- **Uso**: Tela que aparece ao abrir o app

## Como Criar

### Opção 1: Usar um gerador online
1. Acesse: https://www.appicon.co/ ou https://icon.kitchen/
2. Faça upload de uma imagem (pode ser um logo simples)
3. Baixe os ícones gerados

### Opção 2: Criar manualmente
1. Use Photoshop, Figma, Canva ou qualquer editor
2. Crie uma imagem 1024x1024 com:
   - Fundo azul (#3b82f6)
   - Letra "P" ou ícone de carro branco no centro
   - Bordas arredondadas (opcional, o Android faz isso automaticamente)

### Opção 3: Usar placeholders temporários
Por enquanto, você pode buildar sem os ícones. O Expo vai usar ícones padrão.

## Após criar os ícones

Coloque os arquivos em:
```
mobile/
  assets/
    icon.png (1024x1024)
    splash.png (1242x2436)
```

Depois rode:
```bash
cd mobile
eas build --platform android --profile preview
```
