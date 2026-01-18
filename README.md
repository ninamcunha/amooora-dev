# Amooora - MVP Navegável

Projeto React + TypeScript com roteamento completo usando React Router, data layer estruturado e navegação entre telas.

## 🚀 Como Rodar

### Pré-requisitos

- Node.js 18+ instalado
- npm ou yarn

### Instalação

```bash
# Instalar dependências
npm install

# Rodar em modo desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview do build
npm run preview
```

O projeto estará disponível em `http://localhost:5173`

## 📁 Estrutura do Projeto

```
src/
├── app/
│   ├── data/              # Dados mockados
│   │   └── mocks.ts
│   ├── hooks/             # Custom hooks
│   │   ├── usePlaces.ts
│   │   ├── useServices.ts
│   │   ├── useEvents.ts
│   │   ├── useUser.ts
│   │   └── useReviews.ts
│   ├── layouts/           # Layouts da aplicação
│   │   ├── AuthLayout.tsx
│   │   └── AppLayout.tsx
│   ├── pages/             # Páginas/componentes
│   │   ├── Splash.tsx
│   │   ├── Welcome.tsx
│   │   ├── Cadastro.tsx
│   │   ├── Home.tsx
│   │   ├── Locais.tsx
│   │   ├── PlaceDetails.tsx
│   │   ├── Servicos.tsx
│   │   ├── ServiceDetails.tsx
│   │   ├── ServicesByCategory.tsx
│   │   ├── Eventos.tsx
│   │   ├── EventDetails.tsx
│   │   ├── Comunidade.tsx
│   │   ├── Perfil.tsx
│   │   ├── EditarPerfil.tsx
│   │   ├── Configuracoes.tsx
│   │   └── CreateReview.tsx
│   ├── services/          # Camada de serviços (API simulada)
│   │   ├── places.ts
│   │   ├── services.ts
│   │   ├── events.ts
│   │   ├── reviews.ts
│   │   └── users.ts
│   └── types/             # Tipos TypeScript
│       └── index.ts
├── App.tsx                # Configuração de rotas
└── main.tsx               # Entry point
```

## 🗺️ Rotas Implementadas

### Rotas de Autenticação (AuthLayout)
- `/splash` - Tela inicial de carregamento
- `/welcome` - Tela de boas-vindas
- `/cadastro` - Formulário de cadastro

### Rotas da Aplicação (AppLayout com navegação inferior)

#### Navegação Principal
- `/` - Redireciona para `/home`
- `/home` - Dashboard principal

#### Locais
- `/locais` - Lista de locais
- `/locais/:id` - Detalhes de um local

#### Serviços
- `/servicos` - Lista de serviços
- `/servicos/:id` - Detalhes de um serviço
- `/servicos/categoria/:slug` - Serviços por categoria

#### Eventos
- `/eventos` - Lista de eventos
- `/eventos/:id` - Detalhes de um evento

#### Outros
- `/comunidade` - Página da comunidade
- `/perfil` - Perfil do usuário
- `/perfil/editar` - Edição de perfil
- `/configuracoes` - Configurações
- `/avaliacao/criar` - Criar avaliação (aceita query params: `placeId`, `serviceId`, `eventId`)

## 📊 Data Layer

### Types
Definidos em `src/app/types/index.ts`:
- `User` - Dados do usuário
- `Place` - Local turístico
- `Service` - Serviço oferecido
- `Event` - Evento
- `Review` - Avaliação

### Services
Camada de serviços que simula chamadas de API (atualmente retorna dados em memória):
- `places.ts` - Serviços de locais
- `services.ts` - Serviços de serviços
- `events.ts` - Serviços de eventos
- `reviews.ts` - Serviços de avaliações
- `users.ts` - Serviços de usuários

### Hooks
Custom hooks para consumo de dados:
- `usePlaces()` - Lista todos os locais
- `usePlace(id)` - Busca um local por ID
- `useServices()` - Lista todos os serviços
- `useService(id)` - Busca um serviço por ID
- `useServicesByCategory(slug)` - Busca serviços por categoria
- `useEvents()` - Lista todos os eventos
- `useEvent(id)` - Busca um evento por ID
- `useUser()` - Busca usuário atual
- `useReviewsByPlaceId(id)` - Avaliações de um local
- `useReviewsByServiceId(id)` - Avaliações de um serviço
- `useReviewsByEventId(id)` - Avaliações de um evento

## 🎨 Layouts

### AuthLayout
Layout simples para telas de autenticação (splash, welcome, cadastro) sem navegação inferior.

### AppLayout
Layout principal com:
- Área de conteúdo principal
- Navegação inferior fixa (Bottom Navigation) com 5 itens:
  - Home
  - Locais
  - Serviços
  - Eventos
  - Perfil

## ✅ Arquivos Criados/Alterados

### Configuração Base
- `package.json` - Dependências do projeto
- `tsconfig.json` - Configuração TypeScript
- `tsconfig.node.json` - Config TypeScript para Node
- `vite.config.ts` - Configuração Vite
- `index.html` - HTML base
- `.gitignore` - Arquivos ignorados

### Data Layer
- `src/app/types/index.ts`
- `src/app/data/mocks.ts`
- `src/app/services/places.ts`
- `src/app/services/services.ts`
- `src/app/services/events.ts`
- `src/app/services/reviews.ts`
- `src/app/services/users.ts`

### Hooks
- `src/app/hooks/usePlaces.ts`
- `src/app/hooks/useServices.ts`
- `src/app/hooks/useEvents.ts`
- `src/app/hooks/useUser.ts`
- `src/app/hooks/useReviews.ts`

### Layouts
- `src/app/layouts/AuthLayout.tsx`
- `src/app/layouts/AppLayout.tsx`

### Páginas
- `src/app/pages/Splash.tsx`
- `src/app/pages/Welcome.tsx`
- `src/app/pages/Cadastro.tsx`
- `src/app/pages/Home.tsx`
- `src/app/pages/Locais.tsx`
- `src/app/pages/PlaceDetails.tsx`
- `src/app/pages/Servicos.tsx`
- `src/app/pages/ServiceDetails.tsx`
- `src/app/pages/ServicesByCategory.tsx`
- `src/app/pages/Eventos.tsx`
- `src/app/pages/EventDetails.tsx`
- `src/app/pages/Comunidade.tsx`
- `src/app/pages/Perfil.tsx`
- `src/app/pages/EditarPerfil.tsx`
- `src/app/pages/Configuracoes.tsx`
- `src/app/pages/CreateReview.tsx`

### Configuração
- `src/App.tsx` - Rotas do React Router
- `src/main.tsx` - Entry point
- `src/index.css` - Estilos globais

## 🔄 Próximos Passos Recomendados

### 1. Autenticação Real
- [ ] Implementar sistema de autenticação (JWT, OAuth, etc.)
- [ ] Proteger rotas autenticadas
- [ ] Gerenciar estado de autenticação (Context API ou Zustand/Redux)
- [ ] Implementar logout

### 2. Backend/API
- [ ] Substituir mocks por chamadas reais de API
- [ ] Configurar cliente HTTP (axios, fetch wrapper)
- [ ] Implementar tratamento de erros global
- [ ] Adicionar loading states e skeletons
- [ ] Configurar variáveis de ambiente para URLs da API

### 3. Persistência
- [ ] Integrar com banco de dados (PostgreSQL, MongoDB, etc.)
- [ ] Implementar CRUD completo para todas as entidades
- [ ] Adicionar paginação nas listagens
- [ ] Implementar busca e filtros

### 4. Melhorias de UX/UI
- [ ] Aplicar o design real do Figma aos componentes
- [ ] Implementar shadcn/ui ou outra biblioteca de componentes
- [ ] Adicionar animações e transições
- [ ] Melhorar responsividade mobile
- [ ] Adicionar skeletons durante carregamento

### 5. Funcionalidades
- [ ] Implementar criação real de avaliações
- [ ] Adicionar favoritos/salvamento de locais
- [ ] Implementar busca global
- [ ] Adicionar filtros avançados (preço, rating, categoria)
- [ ] Implementar mapa de localização (Google Maps, Mapbox)

### 6. Testes
- [ ] Adicionar testes unitários (Jest + React Testing Library)
- [ ] Adicionar testes de integração
- [ ] Testes E2E (Playwright, Cypress)

### 7. Performance
- [ ] Implementar lazy loading de rotas
- [ ] Otimizar imagens (lazy loading, WebP)
- [ ] Adicionar cache de dados (React Query, SWR)
- [ ] Code splitting

### 8. DevOps
- [ ] Configurar CI/CD
- [ ] Deploy (Vercel, Netlify, AWS)
- [ ] Configurar monitoramento de erros (Sentry)
- [ ] Analytics (Google Analytics, Mixpanel)

## 📝 Notas

- Os dados estão atualmente em memória (mocks)
- A navegação "Voltar" funciona corretamente entre listas e detalhes
- Todos os componentes estão tipados com TypeScript
- A estrutura permite fácil migração para uma API real no futuro
- Os layouts são simples e podem ser facilmente adaptados ao design do Figma

## 🤝 Desenvolvimento

Para desenvolvimento, recomendamos:
- Usar extensões do VS Code: ESLint, Prettier
- Seguir os padrões de código já estabelecidos
- Manter tipagem TypeScript estrita
- Testar navegação entre todas as rotas

---

Desenvolvido com React + TypeScript + Vite + React Router