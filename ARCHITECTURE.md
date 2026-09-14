# Libris — como pensei a arquitetura

Esse arquivo é basicamente o porquê das minhas decisões no projeto: como organizei
as pastas, o que resolvi na unha por causa da API do Google Books, e o que ficou
de fora por falta de tempo. Como rodar está no
[`INSTRUCTIONS.md`](./INSTRUCTIONS.md).

## Contexto

Organizei tudo por feature, mas sem exagerar em camada. Já usei Feature-Sliced
Design completo em outros projetos e, pra um app desse tamanho, separar
entities/widgets/pages só ia criar pasta vazia. Fiquei com o que realmente ajuda:
um módulo por domínio, cada um com um contrato público claro (o `index.ts`), e o
resto é detalhe interno que pode mudar sem afetar mais nada.

## Estrutura do projeto

```
src/
  app.tsx, main.tsx, router.tsx     bootstrap: providers + RouterProvider
  routes/                           TanStack Router file-based (routeTree.gen.ts é gerado)
    __root.tsx                      contexto do router + Toaster + devtools em dev
    (auth)/login.tsx                rota pública, redireciona se já estiver logado
    _authenticated.tsx              layout + guard das rotas privadas
    _authenticated/                 descoberta, estante, book.$bookId
  features/                         auth, books, bookshelf, theme
  components/                       UI compartilhada, sem regra de negócio
    ui/                             shadcn/ui, gerado pelo CLI, não mexo à mão
    layout/                         header, nav
  http/                             cliente HTTP e query client
  providers/                        composição dos providers
  hooks/                            hooks genéricos (debounce, intersection observer)
  utils/                            funções puras (datas, sanitização de URL etc.)
  types/                            modelos compartilhados
  config/env.ts                     único lugar que lê import.meta.env
  test/                             setup do Vitest e helper de render com router real
```

Um par de regras que eu tento seguir à risca: cada feature só expõe o próprio
`index.ts` (tem até um lint travando isso), e a dependência anda numa direção só
— feature usa componente, http e utils, nunca o contrário, e uma feature não
importa a outra direto. Arquivo sempre em kebab-case, sempre named export, sem
`React.FC` e sem `any` por preguiça.

## Autenticação

O case pede login com validação, só que não tem API de autenticação de verdade,
então simulei o fluxo inteiro sem fingir uma segurança que não existe. O
formulário (TanStack Form + Zod) valida e-mail e senha, e ao confirmar chama um
`authService.login` que espera 500ms simulando latência e devolve um token opaco
gerado localmente, mais o usuário derivado do e-mail. Essa sessão vai pro Zustand
com persist e sobrevive ao reload.

O guard fica no `beforeLoad` da rota `_authenticated`: sem sessão, redireciona
pro login guardando a URL de origem pra voltar depois; já logado tentando abrir o
login, volta pra `/`. Cheguei a cogitar MSW pra mockar esse login e desisti —
seria mais uma dependência pra fazer exatamente o que o `authService` já faz, só
que com mais peça no meio.

## Integração com a Google Books API

A resposta do Google Books é uma bagunça. `volumeInfo` pode não ter `authors`,
`imageLinks`, `publishedDate`, `description`, `pageCount`, qualquer coisa. Pra
esse problema não vazar pro resto do app, o schema em Zod é permissivo de
propósito (a maioria dos campos é `.partial()`, `totalItems` cai pra 0 se vier
estranho, `items` vira array vazio se faltar), e cada item passa por `safeParse`
individualmente — um volume mal formado é descartado, não derruba a busca
inteira. Daí um mapper converte tudo pro tipo `Book` que o resto da aplicação
usa: string tratada, lista sempre array, `pageCount` só se for número positivo de
fato. Nenhum componente sabe como é o JSON da API.

Capa de livro deu mais trabalho do que eu esperava. As URLs vêm em `http://` (eu
subo pra `https://`), com um efeito de página curvada (`edge=curl`) que eu tiro, e
em resolução baixa (`zoom=1`) que eu troco por `zoom=2`. O problema é que, pra
livro sem digitalização, o Google devolve HTTP 200 com um PNG fixo de "imagem
indisponível" no zoom 2 — o `onError` da imagem nunca dispara porque
tecnicamente carregou. Descobri isso comparando request no `curl`: nem
content-type nem tamanho de arquivo diferenciam (tem capa real em PNG também),
mas esse placeholder tem dimensão fixa (300×391 no zoom 2, 128×170 no zoom 1).
Resolvi passando um `fallbackSrc` pro zoom 1 e rejeitando a imagem quando a
dimensão bate com o placeholder conhecido. Pior cenário possível é uma capa real
aparecer em resolução menor — nunca some de vez.

A descrição também chega com HTML solto (`<p>`, `<br>`, listas). Em vez de usar
`dangerouslySetInnerHTML` e jogar markup de terceiro no DOM à toa, fiz um
`stripHtml` que limpa as tags mas preserva quebra de parágrafo, e essa limpeza já
acontece no mapper — nenhuma tela precisa se preocupar com isso de novo.

## Busca, cache e paginação

Uso TanStack Query pra tudo que vem da API, com as keys centralizadas separando
busca de detalhe. A busca espera 400ms depois da última tecla e só dispara com
termo não vazio; requisição anterior é cancelada com `AbortSignal`. Ao trocar
termo ou filtro, o resultado anterior fica na tela até o novo chegar
(`keepPreviousData`), e eu não faço retry em erro 4xx — só em falha de rede ou
5xx, no máximo duas vezes, porque retentar um 429 só piora as coisas.

Tem prefetch também: passar o mouse ou dar foco num card por mais de 150ms já
dispara o carregamento do detalhe em segundo plano, então quando o usuário
clica de verdade o dado já está no cache. E ao voltar da tela de detalhe pra
busca, eu aproveito o histórico do navegador em vez de recarregar tudo — a URL
anterior já tem o termo de busca, e com scroll restoration o usuário volta pro
mesmo ponto da lista, sem gastar uma requisição sequer.

## Performance na lista de resultados

A busca usa scroll infinito, já que a API pagina por `startIndex`, mas isso
sozinho não escala: com centenas de resultado carregado o DOM ficaria enorme.
Então a grade é virtualizada por linha com `@tanstack/react-virtual` — mesmo com
uns 250 livros carregados, o DOM real fica com umas 44 linhas de card. Pra
memória não crescer pra sempre, mantenho no máximo 10 páginas carregadas (200
itens); quando o usuário rola pra cima além disso, a página mais antiga é
buscada de novo, e a grade reserva o espaço dela com skeleton pro scroll não
pular. Se o virtualizer ainda não mediu o container (primeiro paint, teste
rodando em jsdom), a grade cai pra um grid CSS normal em vez de virtualizar — é
esse caminho que os testes de tela cobrem.

Duas coisas que reparei testando: `totalItems` da API é só uma estimativa e
costuma vir inflado, então limito a janela de paginação a mil itens. E
`orderBy=newest` na prática devolve a mesma lista de `relevance` — testei várias
buscas no curl e é sempre igual. Continuo mandando o parâmetro porque é o que o
case pede, mas ordeno o que já carreguei por data quando esse filtro está ativo;
se um dia a API corrigir isso, vira só um no-op.

## Features que se falam sem se acoplar

O botão de "adicionar à estante" precisa aparecer tanto no card de busca quanto
no detalhe do livro, que são da feature `books`, só que a estante é outra
feature (`bookshelf`). Em vez de `books` importar `bookshelf` direto, a tela
recebe uma render prop e é a rota que decide o que injetar ali — o botão
ícone no card, o botão com label no detalhe. Os dois usam a mesma regra por trás
(`useShelfToggle`), só muda a apresentação. Assim `books` nunca precisa saber
que a estante existe.

## Estado: onde cada coisa mora

Minha regra é simples: o estado fica o mais perto possível de quem usa, e cada
tipo de dado na ferramenta certa pra ele.

Tudo que vem da API — resultado de busca, detalhe do livro — fica no TanStack
Query, porque é cache de servidor e a lib já resolve staleTime, concorrência e
refetch sozinha. Termo de busca e filtro moram na URL, validados com Zod, porque
isso dá deep-link e histórico de graça. A última busca eu guardo no
sessionStorage via Zustand — é contexto da aba, não preferência do usuário, por
isso não uso localStorage — e é o que os botões de "voltar pra busca" e
"descobrir" usam pra navegar. Estante, sessão e tema também são Zustand com
persist, porque são dados do usuário sem backend por trás e precisam sobreviver
ao reload. E o valor literal do input de busca fica em `useState` local mesmo,
porque ele precisa responder a cada tecla — só depois do debounce isso vira URL.

## Estante e tabela

Os livros salvos ficam no Zustand — são dados locais, cada um guardado com data
de inclusão e um status (quero ler, lendo, concluído). A tabela usa TanStack
Table v9, a API nova (`useTable` + `tableFeatures`), peguei assim que ela saiu
estável. Título e status são ordenáveis pelo cabeçalho, e a linha inteira é
clicável pra abrir o detalhe — só que o handler de clique precisa ignorar botão,
link e o popup do select de status, que é portalizado mas o evento ainda
borbulha até a linha (descobri isso porque um teste só quebrava rodando a suíte
inteira, nunca isolado).

Remoção é em duas etapas com confirmação e undo no toast, e a paginação é no
cliente, 10 por página, com cuidado pra não pular sozinho pra página 1 quando
alguém remove uma linha no meio da lista.

## Interface e visual

Uso shadcn/ui em cima de Base UI (não Radix), Tailwind e tokens de cor em CSS
variables — o escuro é uma paleta própria, não uma inversão automática do
claro. As convenções de componente que eu sigo (`tv()` pra variante, `twMerge`
no className, `data-slot` em tudo, `aria-label` obrigatório em botão só com
ícone) vêm de um design system pessoal meu, o
[matos-ui](https://github.com/SilasMatos/matos-ui), que mantenho fora desse
projeto. Alguns componentes utilitários daqui — skeleton que "vira" conteúdo,
imagem com fallback, botão de confirmação em duas etapas — eu já tinha pronto de
outros projetos e só reimplementei em CSS puro, porque Framer Motion não fazia
sentido pra esse escopo e CSS resolve bem.

Toda a animação é CSS mesmo, sem biblioteca de motion. Tenho um punhado de
durações e easings nomeados no `styles.css`, então qualquer transição do
projeto — inclusive as que vêm de fábrica do shadcn — já sai suave e respeita
`prefers-reduced-motion` sem eu precisar lembrar disso toda vez.

## Acessibilidade

Medi contraste de verdade (o texto secundário passa de 4,7:1 no claro e 7,8:1 no
escuro), ajustei o anel de foco do tema claro porque o padrão não passava de
3:1, e tomei cuidado pro anel só aparecer em navegação por teclado, não em
clique de mouse. Fora isso: link pra pular pro conteúdo, `aria-sort` na tabela,
contagem de resultado em `aria-live`, e a tabela vai escondendo coluna
secundária conforme a tela encolhe em vez de forçar scroll horizontal.

## Testes

Vitest e Testing Library, testando principalmente pelo comportamento na rota
real — o helper de render monta router, providers e um QueryClient de verdade, e
eu mocko só a chamada HTTP. Isso cobre guard de login, busca com deep-link,
scroll infinito, prefetch, voltar do detalhe, estante inteira (status,
ordenação, remoção com undo) e as funções puras (mapper, schema permissivo,
`stripHtml`, o caso do placeholder do Google). O que não dá pra pegar em teste
automatizado eu conferi rodando o app mesmo, com print de tela em claro/escuro e
desktop/mobile — ficou registrado incremento a incremento no `DEV-LOG.md`. Além
dos testes, lint, typecheck e build fazem parte da checagem antes de qualquer
entrega.
