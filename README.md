# Lays Andrade Bolos & Delícias — site

Site institucional de uma página (React + Vite + TypeScript), focado em levar o visitante a falar com uma das duas lojas pelo WhatsApp.

## Como executar

Requer Node.js 20 ou mais recente.

```bash
npm install          # instala as dependências
npm run dev          # servidor de desenvolvimento em http://localhost:5173
npm run build        # gera a versão de produção em dist/
npm run preview      # serve dist/ em http://localhost:4173
```

### Imagens

As fotos originais ficam em `assets/images` e **não são alteradas**. O comando abaixo gera as versões otimizadas (AVIF + WebP em várias larguras, placeholders desfocados, favicons e imagem de compartilhamento) em `public/` e o arquivo `src/data/images.generated.json`:

```bash
npm run images
```

Para adicionar uma foto nova: coloque o arquivo em `assets/images`, registre-o no objeto `FILES` em `scripts/optimize-images.mjs`, rode `npm run images` e use o identificador nos arquivos de `src/data/`.

### Teste no navegador

Com `npm run preview` rodando em outro terminal:

```bash
npm run test:browser
```

Usa o Microsoft Edge instalado (ou `BROWSER_CHANNEL=chrome`). Verifica 360/390/430/768/1024/1440 px (rolagem horizontal, imagens quebradas, erros de console, áreas de toque), links de WhatsApp/Maps/telefone/Instagram, âncoras, menu mobile, diálogos, filtros, lightbox, formulário e `prefers-reduced-motion`. As capturas de tela ficam em `test-results/`.

## Onde editar o conteúdo

| O quê | Arquivo |
| --- | --- |
| Dados das lojas (endereço, telefone, mensagem do WhatsApp, rota no Maps) | `src/data/stores.ts` |
| Produtos e categorias do cardápio | `src/data/products.ts` |
| Fotos da galeria e legendas | `src/data/gallery.ts` |
| Instagram e itens do menu | `src/data/site.ts` |
| Cores, tipografia, espaçamentos e animações | `src/styles/global.css` (tokens no topo) |
| Título, descrição, Open Graph e dados estruturados | `index.html` |

## Estrutura

```
assets/images/            fotos originais do cliente (intocadas)
public/img/               fotos otimizadas (geradas)
public/                   favicons, og-image.jpg, site.webmanifest
scripts/
  optimize-images.mjs     pipeline de imagens (sharp)
  browser-check.mjs       testes no navegador (playwright-core + Edge)
src/
  components/             Header, MobileMenu, Hero, About, ProductCategories, ProductCard,
                          Signature, Gallery, Lightbox, StoreLocations, StoreCard, Contact,
                          Footer, WhatsAppButton, OrderDialog, Picture, Reveal, ScrollProgress, Brand
  data/                   lojas, produtos, galeria, site, manifesto de imagens
  hooks/                  useReveal, useParallax, useDialog, useScrollState
  lib/                    links (WhatsApp/Maps/tel), motion, contexto de pedidos
  styles/global.css       sistema de design e estilos
```

## Decisões técnicas

- **Sem biblioteca de animação.** Todas as animações usam CSS (transform/opacity) e um único `IntersectionObserver`; isso mantém o JavaScript em ~88 KB gzip. Tudo respeita `prefers-reduced-motion`.
- **Diálogos nativos (`<dialog>`)** para menu mobile, escolha de loja e lightbox: foco preso, Escape e camada superior nativos, com animação de saída.
- **Sem backend.** O formulário monta a mensagem e abre o WhatsApp da loja escolhida; o visitante envia por lá. O site avisa isso explicitamente e não promete confirmação automática.
- **Fontes self-hosted** (Fraunces + Manrope via Fontsource); o navegador baixa só o subconjunto latino.

## Publicação

O resultado de `npm run build` (pasta `dist/`) é estático e pode ser publicado em Vercel, Netlify, Cloudflare Pages ou qualquer hospedagem estática.

- **Vercel / Netlify / Cloudflare Pages:** comando de build `npm run build`, pasta de saída `dist`.
- **Hospedagem tradicional:** envie o conteúdo de `dist/` para a raiz do domínio.

Antes de publicar:

1. Resolva as pendências abaixo.
2. Em `index.html`, troque `og:image` por uma URL absoluta (`https://seudominio.com.br/og-image.jpg`) e adicione `<link rel="canonical">` e `og:url` com o domínio final.
3. Rode `npm run build`, `npm run preview` e `npm run test:browser`.

## Informações a confirmar com o cliente

| Item | Situação |
| --- | --- |
| **Cidade e localização exata da Loja 2** (Rua dos Bem-Te-Vis, 76) | Não confirmadas. O site mostra só a rua; o "Como chegar" pesquisa pelo nome da marca + endereço. Uma busca na web não confirmou o local. Depois de confirmar, preencha `city` e `mapsQuery` em `src/data/stores.ts` e adicione a Loja 2 aos dados estruturados em `index.html`. |
| Loja 1 em Vinhedo (Avenida Cachalote, 228) | Informada pelo cliente; vale validar o pino no Google Maps. |
| Fotos das fachadas e interiores | Os nomes dos arquivos indicam "loja 1" e "loja 2"; confirmar que correspondem às unidades certas. |
| Horários | Não exibidos ("Aberto todos os dias" vem da bio do Instagram). A foto da fachada da Loja 1 mostra horários numa placa vizinha; o enquadramento foi ajustado para não sugerir que são da loja. |
| Logotipo em alta resolução (SVG ou PNG ≥ 1000 px) | O arquivo atual tem 150 px, por isso aparece só em tamanhos pequenos. |
| Fotos de bolos e de café | Não havia nenhuma. A marca cita os dois, mas o cardápio só mostra categorias com foto real. |
| Fotos em resolução maior | Várias originais têm 720 px de largura (vindas do Instagram); ficam boas nos cards, mas perdem nitidez ampliadas. |
| Produtos sazonais (chocotones, ovos de Páscoa) | Aparecem como "Datas especiais" com selo Natal/Páscoa; confirmar se continuam sendo oferecidos. |
| "Empadão de frango — versão de 1 kg" | Tirado do nome do arquivo enviado. |
| Composição do Nevado Cremoso | Tirada das fotos e legendas enviadas (brigadeiro branco, dupla camada de creme de Ninho, geleia de morango). |
| História da marca, fundadora, data de abertura | Não informadas; a seção "Nossa história" está preparada para recebê-las. |
| Preços, tamanhos, entrega e encomendas | Não informados e não exibidos; os cards convidam a consultar a loja. |
