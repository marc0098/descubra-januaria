# Arquitetura do Projeto - Descubra Januária

Este documento descreve a arquitetura técnica e os padrões do projeto após a migração para Firebase.

## 🏗️ Estrutura de Diretórios

```
descubra-januaria/
├── public/                    # Arquivos estáticos públicos
│   ├── assets/graphics/      # SVGs e gráficos
│   ├── img/                 # Imagens gerais (hero, banner, mapa)
│   └── _redirects          # Rewrites do Vercel
├── src/
│   ├── admin/              # Área administrativa (protegida)
│   │   ├── components/    # AdminLayout, ProtectedRoute
│   │   ├── context/      # AuthContext (Firebase Auth)
│   │   └── pages/        # Dashboard, AdminGuias, AdminHoteis, etc.
│   ├── assets/images/     # Imagens do build (logo, hero, banner)
│   ├── components/      # Componentes reutilizáveis
│   │   ├── layout/     # Layout (Header + Footer)
│   │   ├── NavButtons  # Botões de navegação
│   │   └── SafeImage  # Imagem com fallback
│   ├── lib/            # Configurações externas
│   │   └── firebase  # Configuração Firebase
│   ├── pages/          # Páginas públicas do site
│   │   ├── Home       # Página inicial
│   │   ├── Cavernas  # Cavernas do Peruaçu
│   │   ├── Guias     # Guias turísticos
│   │   ├── GuiaPeruacu # Roteiro específico
│   │   ├── Pontos    # Pontos turísticos
│   │   ├── Estadias  # Hotéis e pousadas
│   │   ├── Eventos  # Eventos culturais
│   │   └── Gastronomia # Gastronomia local
│   └── styles/         # Estilos globais (Tailwind CSS)
├── index.html           # HTML entry
├── vite.config.ts      # Configuração Vite
├── tsconfig.json      # Configuração TypeScript
└── vercel.json       # Configuração deploy
```

## 🗄️ Dados - Firebase Firestore

Todos os Dados são armazenados no Firebase. Não há JSONs locais.

| Collection   | Descrição                  |
|--------------|---------------------------|
| `guias`      | Guias turísticos          |
| `hoteis`     | Hotéis e pousadas        |
| `gastronomia`| Restaurantes e pratos     |
| `pontos`     | Pontos turísticos        |
| `atrativos`  | Atrações do Peruaçu      |
| `eventos`    | Eventos culturais       |
| `banners`    | Banners da home         |

## 🛠️ Tecnologias

- **React 19** — Framework UI
- **TypeScript 5.8** — Tipagem estática
- **Vite 6** — Build e dev server
- **Tailwind CSS 4** — Estilização utilitária
- **Motion** — Animações (Framer Motion)
- **Lucide React** — Ícones
- **React Router DOM 7** — Rotas SPA
- **Firebase 11** — Backend (Firestore + Auth + Storage)

## 📏 Padrões de Desenvolvimento

1. **Path Aliases**: Use `@/` para imports a partir de `src/`. Configurado em `vite.config.ts` e `tsconfig.json`.
2. **Comentários**: Em **Português**.
3. **Responsividade**: Mobile-First. Sempre teste em mobile antes de desktop.
4. **Imagens**: Use URLs do Firebase Storage ou serviços externos (Unsplash, Booking, etc.).
5. **Design System**: Cores e fontes definidas em `src/styles/index.css`.
6. **Grid**: Sistema de 8px para espaçamentos.
7. **Dados**: Sempre buscar do Firebase, sem dados hardcoded.

## 🚀 Deploy

Configurado para **Vercel** (`vercel.json` com rewrite SPA).

## 🔧 Variáveis de Ambiente

Configure em `src/lib/firebase.ts`:
- `apiKey`
- `authDomain`
- `projectId`
- `storageBucket`
- `messagingSenderId`
- `appId`