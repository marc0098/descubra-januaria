# Pasta de Vídeos

## Estrutura de Vídeos

Este projeto utiliza dois vídeos para garantir a melhor experiência em diferentes dispositivos:

### Vídeos necessários:

1. **mobile-video.mp4** - Vídeo vertical (9:16) para mobile/tablet
   - Resolução: 720x1280
   - Formato: MP4
   - Duração: 15 segundos
   - Tamanho: ~1.1MB

2. **desktop-video.mp4** - Vídeo horizontal (16:9) para desktop
   - Resolução: 1920x1080
   - Formato: MP4
   - Duração: 15-30 segundos

### Como adicionar seus vídeos:

1. **Mobile:** Substitua `public/video/mobile-video.mp4` pelo seu vídeo vertical
2. **Desktop:** Crie ou substitua `public/video/desktop-video.mp4` pelo seu vídeo horizontal

### Formato recomendado:
- **Codec de vídeo:** H.264
- **Codec de áudio:** AAC
- **Duração:** 15-30 segundos (recomendado)
- **Resolução:** 
  - Mobile: 720x1280 (vertical)
  - Desktop: 1920x1080 (horizontal)

### Dicas:
- Os vídeos são exibidos em tela cheia com controles nativos
- O usuário pode fechar clicando no botão X no canto superior direito
- O vídeo inicia automaticamente quando o modal é aberto
- O vídeo correto é selecionado automaticamente baseado no tamanho da tela
