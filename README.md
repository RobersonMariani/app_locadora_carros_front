# Locadora de Carros Frontend

Aplicação Vue.js para gestão do sistema de locadora de veículos, consumindo a [Locadora de Carros API](https://github.com/RobersonMariani/app_locadora_carros). Permite gerenciar frota, clientes, locações, pagamentos, multas, manutenções e visualizar alertas e indicadores em tempo real.

## Funcionalidades

- Autenticação via JWT (login, logout, refresh automático)
- Dashboard com 12+ indicadores de negócio (frota, financeiro, atenção)
- CRUD completo de marcas, modelos, carros e clientes
- Gestão de locações com ações de iniciar, finalizar e cancelar
- Vistorias de retirada e devolução via modal integrado
- Controle de multas de trânsito com status e filtros
- Gestão de manutenções preventivas e corretivas
- Pagamentos com tipos, métodos e status
- Sistema de alertas com sino de notificações e polling automático
- Validação de formulários em tempo real com Zod
- Badges de status coloridos (locação, pagamento, multa, manutenção)
- Bloqueio de clientes com indicador visual
- Formatação de datas em pt-BR com Day.js
- Notificações toast para feedback de ações
- Layout responsivo com sidebar e navegação lateral
- UI moderna com paleta Indigo/Violet e glassmorphism

## Stack

| Camada          | Tecnologia                          |
|-----------------|-------------------------------------|
| Framework       | Vue 3 + Composition API             |
| Linguagem       | TypeScript 5.9                      |
| Bundler         | Vite 7                              |
| Estado          | Pinia 3                             |
| Rotas           | Vue Router 5                        |
| Validação       | Zod 4                               |
| HTTP Client     | Axios                               |
| Datas           | Day.js                              |
| Ícones          | @heroicons/vue                      |
| Estilização     | Tailwind CSS 4                      |
| Testes          | Vitest                              |
| Containers      | Docker Compose                      |

## Requisitos

- Docker e Docker Compose
- API rodando em `http://localhost:8000` (ver [Locadora de Carros API](https://github.com/RobersonMariani/app_locadora_carros))

## Instalação

### Com Docker (recomendado)

```bash
git clone <repo-url>
cd app_locadora_carros_front

# Subir a API primeiro (no diretório da API)
cd ../app_locadora_carros
docker compose up -d

# Voltar e subir o frontend
cd ../app_locadora_carros_front
docker compose up -d
```

Acesse: `http://localhost:5173`

### Sem Docker

```bash
git clone <repo-url>
cd app_locadora_carros_front

npm install
cp .env.example .env
npm run dev
```

Acesse: `http://localhost:5173`

### Build de produção

```bash
# Com Docker
docker compose up -d

# Sem Docker
npm run build
npm run preview
```

## Serviços

| Serviço           | URL / Porta          | Descrição                                 |
|-------------------|----------------------|-------------------------------------------|
| Frontend (dev)    | http://localhost:5173 | Vite dev server com hot-reload            |
| API (dependência) | http://localhost:8000 | Laravel API (projeto separado)            |

---

## Páginas

| Rota                       | Página                  | Descrição                                          |
|----------------------------|-------------------------|----------------------------------------------------|
| `/login`                   | LoginPage               | Autenticação com e-mail e senha                    |
| `/`                        | DashboardPage           | Indicadores de frota, financeiro e atenção          |
| `/clientes`                | ClientesPage            | Listagem de clientes com paginação e badge bloqueio |
| `/clientes/criar`          | CreateClientePage       | Cadastro com endereço e validação de CPF/CNH       |
| `/clientes/:id/editar`     | EditClientePage         | Edição com bloqueio e motivo                       |
| `/marcas`                  | MarcasPage              | Listagem de marcas com imagem                      |
| `/marcas/criar`            | CreateMarcaPage         | Upload de imagem da marca                          |
| `/marcas/:id/editar`       | EditMarcaPage           | Edição de marca                                    |
| `/modelos`                 | ModelosPage             | Listagem de modelos com marca associada            |
| `/modelos/criar`           | CreateModeloPage        | Cadastro com seleção de marca                      |
| `/modelos/:id/editar`      | EditModeloPage          | Edição de modelo                                   |
| `/carros`                  | CarrosPage              | Listagem com combustível, câmbio e categoria       |
| `/carros/criar`            | CreateCarroPage         | Cadastro com detalhes técnicos e diária             |
| `/carros/:id/editar`       | EditCarroPage           | Edição de carro                                    |
| `/locacoes`                | LocacoesPage            | Listagem com ações, badge atrasada e modal vistoria |
| `/locacoes/criar`          | CreateLocacaoPage       | Seleção de cliente e carro disponível              |
| `/locacoes/:id/editar`     | EditLocacaoPage         | Edição de locação                                  |
| `/pagamentos`              | PagamentosPage          | Listagem com tipo, método e status                 |
| `/pagamentos/criar`        | CreatePagamentoPage     | Seleção de locação e método de pagamento           |
| `/pagamentos/:id/editar`   | EditPagamentoPage       | Edição de pagamento                                |
| `/multas`                  | MultasPage              | Listagem de multas com status e filtros            |
| `/multas/criar`            | CreateMultaPage         | Cadastro de multa vinculada a locação              |
| `/multas/:id/editar`       | EditMultaPage           | Edição de multa                                    |
| `/manutencoes`             | ManutencoesPage         | Listagem de manutenções com tipo e status          |
| `/manutencoes/criar`       | CreateManutencaoPage    | Cadastro de manutenção com agendamento             |
| `/alertas`                 | AlertasPage             | Lista de alertas com filtros e marcar como lido    |

---

## Componentes UI

| Componente              | Descrição                                                        |
|-------------------------|------------------------------------------------------------------|
| `AppButton`             | Botão com variantes (primary, secondary, danger, ghost, success), tamanhos e loading |
| `AppInput`              | Input com label, erro e v-model                                  |
| `AppSelect`             | Select customizado com placeholder e erro                        |
| `AppModal`              | Modal com overlay, animação e tamanhos (sm, md, lg, xl)          |
| `StatusBadge`           | Badge de status com cores (reservada, ativa, finalizada, cancelada, pendente, pago, etc.) |
| `NotificationToast`     | Toast de notificação (success, error, warning, info) com auto-remoção |
| `ApplicationLogo`       | Logo "Locadora Carros" com tamanhos (sm, md, lg) e temas (light, dark) |
| `NotificationBell`      | Sino de alertas com dropdown, contagem de não lidos e link para `/alertas` |
| `VistoriaModal`         | Modal para criar vistoria de retirada ou devolução               |

---

## Stores (Pinia)

| Store           | Descrição                                                             |
|-----------------|-----------------------------------------------------------------------|
| `auth`          | Token JWT, usuário, login/logout, refresh automático                  |
| `ui`            | Sidebar, notificações toast com auto-remoção                          |
| `alerta`        | Alertas, contagem de não lidos, polling automático a cada 60s         |
| `pagamentos`    | Lista de pagamentos com paginação e deleção                           |
| `multas`        | Lista de multas com paginação e deleção                               |
| `manutencoes`   | Lista de manutenções com paginação e deleção                          |

---

## Composables

| Composable         | Descrição                                                          |
|--------------------|--------------------------------------------------------------------|
| `useForm`          | Formulário reativo com validação Zod, erros, processing e setErrors (422 da API) |
| `usePagination`    | Controle de paginação (meta, hasPages, hasPrevious, hasNext, goToPage) |

---

## Testes

```bash
# Todos os testes
npm run test:unit

# Com watch
npx vitest
```

## Qualidade de Código

```bash
# Type check (TypeScript)
npx vue-tsc --noEmit

# Lint (ESLint + Oxlint)
npm run lint

# Format (Prettier)
npm run format
```

## Variáveis de Ambiente

| Variável        | Descrição                | Valor Padrão                       |
|-----------------|--------------------------|-------------------------------------|
| `VITE_API_URL`  | URL base da API          | `http://localhost:8000/api`        |

## Arquitetura

O projeto segue uma **arquitetura modular por responsabilidade** com estado centralizado em Pinia stores:

```
src/
├── assets/styles/          → Tailwind CSS com tema customizado (Indigo/Violet)
├── components/
│   ├── ui/                 → Componentes reutilizáveis (Button, Input, Select, Modal, Toast, StatusBadge)
│   └── shared/             → Logo e NotificationBell
├── composables/            → Lógica reutilizável (useForm, usePagination)
├── layouts/
│   ├── AuthenticatedLayout → Sidebar com navegação, NotificationBell e menu de usuário
│   └── GuestLayout         → Layout para tela de login
├── lib/
│   ├── http.ts             → Axios instance com interceptors (Bearer token, 401 → logout)
│   └── date.ts             → Helpers de formatação de data (Day.js, pt-BR)
├── modules/
│   ├── alertas/            → pages, services, types
│   ├── auth/               → pages (Login, Dashboard), services
│   ├── carros/             → pages, services, dtos, types
│   ├── clientes/           → pages, services, dtos, types
│   ├── locacoes/           → pages, services, dtos, types
│   ├── manutencoes/        → pages, services, dtos, types
│   ├── marcas/             → pages, services, dtos, types
│   ├── modelos/            → pages, services, dtos, types
│   ├── multas/             → pages, services, dtos, types
│   ├── pagamentos/         → pages, services, dtos, types
│   └── vistorias/          → components (VistoriaModal), services, dtos, types
├── router/
│   ├── index.ts            → Rotas com lazy loading
│   └── guards.ts           → Guard de autenticação (redireciona para /login)
├── stores/                 → Pinia stores com estado reativo
│   ├── auth.store.ts
│   ├── ui.store.ts
│   ├── alerta.store.ts
│   ├── pagamentos.store.ts
│   ├── multas.store.ts
│   └── manutencoes.store.ts
└── types/
    └── api.types.ts        → Tipos globais (PaginationMeta, PaginatedResponse, ApiValidationError)
```

### Fluxo de dados

```
Página → Store (estado Pinia) → Service (HTTP via Axios) → DTO (validação Zod) → UI reativa
```

### DTOs com Zod

Todos os DTOs usam Zod v4 para validação de formulários no cliente:

```typescript
export const createClienteSchema = z.object({
  nome: z.string().min(3, 'Mínimo 3 caracteres'),
  cpf: z.string().min(1, 'CPF obrigatório'),
  email: z.string().email('E-mail inválido'),
  telefone: z.string().min(1, 'Telefone obrigatório'),
  data_nascimento: z.string().min(1, 'Data obrigatória'),
  cnh: z.string().min(1, 'CNH obrigatória'),
  endereco: z.string().optional(),
  cidade: z.string().optional(),
  estado: z.string().optional(),
  cep: z.string().optional(),
})

export type CreateClienteDto = z.infer<typeof createClienteSchema>
```

## Estrutura Docker

```
Dockerfile              → Node 22 Alpine com Vite dev server
docker-compose.yml      → Frontend com hot-reload via volume bind mount
```

| Container            | Descrição                                       |
|----------------------|-------------------------------------------------|
| `locadora_frontend`  | Vite dev server — Vue 3 com hot-reload          |

**Rede:** `locadora_network` (externa, compartilhada com a API)
