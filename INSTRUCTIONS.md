# Libris — instruções

## Projeto escolhido

**Opção B — Libris** (`cases/02-libris.md`): gerenciador de biblioteca pessoal sobre a
[Google Books API](https://developers.google.com/books/docs/v1/using).

O que está implementado:

| Módulo | Onde | Resumo |
|---|---|---|
| Login simulado | `/login` | Form com TanStack Form + Zod (e-mail válido, senha > 6). Sessão persistida; rotas autenticadas redirecionam para o login e voltam para a URL de origem. |
| Descoberta / busca | `/` | Busca com debounce (400 ms), filtros `printType` e `orderBy` (TanStack Form), scroll infinito paginado por `startIndex` (com botão "Carregar mais" como alternativa). Termo e filtros vivem na URL — dá para compartilhar o link. |
| Detalhe do livro | `/book/:id` | Capa, metadados, sinopse, links de prévia; skeleton por campo enquanto carrega. |
| Estante | `/estante` | Tabela (TanStack Table) com capa, título, autor, publicação e ações; status editável na linha (Quero ler / Lendo / Concluído); ordenação por título ou status; remoção com confirmação e undo via toast. Persistida no `localStorage`. |
| Tema | header | Dark/light persistido (Zustand `persist`). |

Documentação das decisões técnicas em [`ARCHITECTURE.md`](./ARCHITECTURE.md).

## Como rodar

Requisitos: **Node 20+** e npm.

```bash
npm install
npm run dev        # http://localhost:5173
```

Não precisa de chave da Google Books API. Se quiser usar uma (para fugir do rate
limit da API pública), copie `.env.example` para `.env` e preencha:

```bash
VITE_GOOGLE_BOOKS_API_KEY=sua-chave
VITE_GOOGLE_BOOKS_BASE_URL=https://www.googleapis.com/books/v1   # opcional
```

Para entrar, use qualquer e-mail válido e uma senha com mais de 6 caracteres — o
login é simulado (não há backend).

## Outros scripts

| Comando | O que faz |
|---|---|
| `npm run build` | Build de produção em `dist/` (`tsc -b` + Vite). |
| `npm run preview` | Serve o build de produção localmente. |
| `npm run test` | Vitest + Testing Library (jsdom), uma execução. |
| `npm run test:watch` | Vitest em modo watch. |
| `npm run coverage` | Cobertura de testes. |
| `npm run lint` | ESLint (inclui regras de import por feature). |
| `npm run typecheck` | `tsc -b` sem emitir. |

## Stack

React 18 · TypeScript (strict) · Vite 7 · TanStack Query 5 · TanStack Router 1
(file-based) · TanStack Form 1 · TanStack Table 9 · Zustand 5 · Zod 4 ·
Tailwind CSS v4 · shadcn/ui (preset `base-nova`, primitives Base UI) · Vitest 5 +
Testing Library.
