# 🚀 Tela de Login Full Stack com Gerenciador de Tarefas

Aplicação Full Stack com sistema de autenticação seguro (JWT), proteção de rotas e operações de CRUD completas para gerenciamento de tarefas. O projeto foi construído para demonstrar uma integração eficiente e segura entre um frontend moderno em React (Vite) e uma API RESTful em Node.js com banco de dados gerenciado pelo Prisma ORM.

---

## 🔗 Links do Projeto
*(Adicione aqui os links quando fizer o deploy)*
- **Live Demo:** [Link do Frontend]
- **Backend API:** [Link do Backend]

---

## 🧠 Decisões de Arquitetura

### **1. Autenticação Baseada em JWT**
Implementação de segurança via JSON Web Tokens (JWT). O token é gerado no login e enviado pelo frontend via header `Authorization`. Um middleware dedicado valida o token e injeta o `usuarioId` na requisição, garantindo que usuários não autenticados não acessem rotas protegidas.

### **2. Abordagem de Data Ownership (Isolamento de Dados)**
Diferente de listas globais, cada tarefa criada é estritamente vinculada ao ID do usuário autenticado no momento. O backend filtra as tarefas ativamente para retornar apenas os dados pertinentes ao usuário e verifica a posse da tarefa antes de permitir edições e exclusões.

### **3. Escolha do Prisma ORM**
Utilizei o Prisma para gerenciar o banco de dados e garantir **Type Safety**. Ele agiliza o desenvolvimento e o sistema de migrations permite um controle rigoroso e versionado do esquema relacional.

### **4. Filtro por Tempo de Criação**
O endpoint de listagem de tarefas possui uma lógica nativa para buscar apenas as tarefas criadas nas últimas 24 horas, otimizando o fluxo de organização diária do usuário.

---

## 🔒 Pontos Técnicos e Segurança

- **Hashing de Senhas:** Nenhuma senha é salva em texto puro. O `bcrypt` com *salt factor* de 10 é utilizado para encriptar os dados antes da persistência no banco.
- **Isolamento de Operações Restritas:** Atualizações (PUT/PATCH) e exclusões (DELETE) verificam explicitamente se o `usuarioId` atrelado ao registro no banco é o mesmo extraído do JWT do usuário fazendo a requisição.
- **Tratamento de Erros:** Retorno de respostas HTTP com status semânticos adequados (401 Unauthorized, 403 Forbidden, 404 Not Found, 500 Server Error).
- **CORS:** Configurado para gerenciar acesso de origens cruzadas, essencial na separação do front e do back.

---

## 🛠️ Tecnologias Utilizadas

Baseado nas dependências declaradas nos arquivos `package.json`:

### **Backend (Node.js & Express)**
- **Express:** Engine para construção da API REST.
- **Prisma Client:** ORM relacional (`@prisma/client` ^6.19.3).
- **JWT (jsonwebtoken):** Geração e verificação de tokens de acesso.
- **Bcrypt:** Criptografia e validação de senhas.
- **Cors / Dotenv:** Configuração de permissões de rota e variáveis de ambiente.
- **Nodemon:** Hot-reload em ambiente de desenvolvimento.

### **Frontend (React & Vite)**
- **React 19 & React Router DOM:** Renderização e roteamento dinâmico no cliente (SPA).
- **Vite:** Bundler super rápido para o ambiente de desenvolvimento.
- **Tailwind CSS 4:** Framework de CSS utilitário para design reativo e direto no código.
- **Axios:** Cliente HTTP para comunicação com a API.
- **Sonner:** Sistema de notificações (Toasts) dinâmicas para melhor UX.
- **Lucide-React:** Biblioteca moderna de ícones.

---

## 📋 Principais Funcionalidades

- [x] **Segurança:** Cadastro e Login com persistência baseada em JWT.
- [x] **Proteção de Rotas:** Endpoints de backend blindados por middleware de verificação de token.
- [x] **Gestão de Tarefas (CRUD):** Criação, listagem (filtro das últimas 24h), edição (status e texto) e exclusão.
- [x] **Privacidade:** Cada usuário vê e interage estritamente com as suas próprias tarefas.
- [x] **Interface Reativa:** Frontend com feedback imediato das ações e design estilizado com TailwindCSS.

---

## 🔮 Possíveis Evoluções

- [ ] **Estratégia Dual Token:** Implementar Refresh Tokens via Cookie HttpOnly para maior segurança.
- [ ] **Paginação:** Implementação para buscas de histórico de tarefas antigas.
- [ ] **Categorias e Filtros Personalizados:** Adicionar labels ou prioridades às tarefas.
- [ ] **Testes:** Adicionar testes unitários ou e2e para garantir o fluxo de autenticação.

---

## 📂 Estrutura do Projeto

O repositório é um monorepo que separa os serviços de front e back-end:

```text
├── backend/            # API RESTful (Node + Express)
│   ├── app.js          # Lógica principal, rotas e middlewares
│   ├── prisma/         # Schema do banco de dados relacional
│   ├── .env            # Variáveis de ambiente (Segredos)
│   └── package.json    # Dependências do backend
├── frontend/           # Aplicação Client-side (React + Vite)
│   ├── src/
│   │   ├── components/ # Componentes reutilizáveis (Tasks, AddTask)
│   │   ├── pages/      # Páginas de rota (Login)
│   │   └── ...
│   └── package.json    # Dependências do frontend
└── README.md           # Documentação
```

---

## 🚀 Como Rodar o Projeto

### **1. Clone o repositório**
```bash
git clone <url-do-repositorio>
cd Tela-de-login-FullStack
```

### **2. Configure o Backend**
- Acesse a pasta do backend: `cd backend`
- Instale as dependências: `npm install`
- Crie um arquivo `.env` contendo suas variáveis, como a URL do banco e a chave secreta do JWT:
  ```env
  DATABASE_URL="sua_url_de_conexao_com_o_banco"
  JWT_SECRET="sua_chave_secreta"
  PORT=3000
  ```
- Configure o Prisma: `npx prisma generate` (e rode as migrations se aplicável `npx prisma db push` ou `migrate dev`).
- Inicie o servidor: `npm run dev`

### **3. Configure o Frontend**
- Em um novo terminal, acesse a pasta do frontend: `cd frontend`
- Instale as dependências: `npm install`
- Inicie a aplicação: `npm run dev`

---

## ✍️ Autor

Desenvolvido por **Victor Langa** (ou seu nome/username) como um projeto focado em estruturação Full Stack, segurança em requisições HTTP e gerenciamento de estados no React.
