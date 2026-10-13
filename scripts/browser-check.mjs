// Verificação no navegador (Microsoft Edge ou Chrome instalados) usando playwright-core.
// Pré-requisito: `npm run build` e `npm run preview` rodando em http://localhost:4173
// Uso: npm run test:browser   (variáveis opcionais: BASE_URL, BROWSER_CHANNEL=chrome)

import { chromium } from 'playwright-core';
import { mkdir } from 'node:fs/promises';

const BASE = process.env.BASE_URL ?? 'http://localhost:4173/';
const CHANNEL = process.env.BROWSER_CHANNEL ?? 'msedge';
const OUT = 'test-results';
const WIDTHS = [360, 390, 430, 768, 1024, 1440];

const results = [];
const check = (name, ok, detail = '') => {
  results.push({ name, ok, detail });
  console.log(`${ok ? '✓' : '✗'} ${name}${detail ? ` — ${detail}` : ''}`);
};

await mkdir(OUT, { recursive: true });
const browser = await chromium.launch({ channel: CHANNEL });

async function newPage(width, height = 900, opts = {}) {
  const context = await browser.newContext({ viewport: { width, height }, deviceScaleFactor: 1, ...opts });
  const page = await context.newPage();
  const errors = [];
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
  page.on('pageerror', (e) => errors.push(e.message));
  page.on('requestfailed', (r) => errors.push(`falha ao carregar ${r.url()}`));
  page.on('response', (r) => r.status() >= 400 && errors.push(`HTTP ${r.status()} ${r.url()}`));
  return { context, page, errors };
}

async function scrollThrough(page) {
  await page.evaluate(async () => {
    const step = window.innerHeight * 0.6;
    for (let y = 0; y < document.documentElement.scrollHeight; y += step) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 120));
    }
    window.scrollTo(0, document.documentElement.scrollHeight);
    await new Promise((r) => setTimeout(r, 400));
  });
  await page.waitForLoadState('networkidle');
}

// ---------- Layout em cada largura ----------
for (const width of WIDTHS) {
  const { context, page, errors } = await newPage(width, width < 768 ? 844 : 900);
  await page.goto(BASE, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1400); // sequência do hero
  await page.screenshot({ path: `${OUT}/hero-${width}.png` });

  await scrollThrough(page);
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  check(`${width}px: sem rolagem horizontal`, overflow <= 0, overflow > 0 ? `${overflow}px excedentes` : '');

  const broken = await page.evaluate(() =>
    [...document.querySelectorAll('img')].filter((i) => i.complete && i.naturalWidth === 0).map((i) => i.currentSrc || i.src),
  );
  check(`${width}px: imagens carregadas`, broken.length === 0, broken.join(', '));

  const hidden = await page.evaluate(() => [...document.querySelectorAll('.reveal:not(.is-visible)')].filter((e) => getComputedStyle(e).display !== 'none').length);
  check(`${width}px: todos os elementos revelados após rolar`, hidden === 0, hidden ? `${hidden} ocultos` : '');

  // Alvos de toque pequenos (botões e links visíveis)
  if (width < 768) {
    const small = await page.evaluate(() =>
      [...document.querySelectorAll('main button, main a, header button, header a')]
        .filter((el) => {
          const r = el.getBoundingClientRect();
          return r.width > 0 && r.height > 0 && (r.height < 32 || r.width < 32) && !el.classList.contains('skip-link');
        })
        .map((el) => `${el.tagName.toLowerCase()} "${(el.textContent || el.getAttribute('aria-label') || '').trim().slice(0, 30)}" ${Math.round(el.getBoundingClientRect().height)}px`),
    );
    check(`${width}px: alvos de toque ≥ 32px`, small.length === 0, small.slice(0, 5).join('; '));
  }

  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(300);
  await page.screenshot({ path: `${OUT}/full-${width}.png`, fullPage: true });
  check(`${width}px: sem erros de console/rede`, errors.length === 0, errors.slice(0, 4).join(' | '));
  await context.close();
}

// ---------- Funcionalidades (desktop) ----------
{
  const { context, page, errors } = await newPage(1440);
  await page.goto(BASE, { waitUntil: 'networkidle' });

  // Links do WhatsApp
  const waLinks = await page.$$eval('a[href^="https://wa.me/"]', (as) => as.map((a) => a.href));
  const allValid = waLinks.every((h) => /^https:\/\/wa\.me\/55199(97960155|96038906)\?text=.+/.test(h));
  check('Links do WhatsApp com números válidos e mensagem codificada', waLinks.length > 0 && allValid, `${waLinks.length} links`);
  const loja1 = await page.$eval('#loja-1-title', (h) => h.closest('article').querySelector('a[href^="https://wa.me/"]').href);
  const loja2 = await page.$eval('#loja-2-title', (h) => h.closest('article').querySelector('a[href^="https://wa.me/"]').href);
  check('Loja 1 → (19) 99796-0155', loja1.includes('5519997960155') && decodeURIComponent(loja1).includes('Loja 1'));
  check('Loja 2 → (19) 99603-8906', loja2.includes('5519996038906') && decodeURIComponent(loja2).includes('Loja 2'));
  const maps = await page.$$eval('a[href*="google.com/maps"]', (as) => as.map((a) => a.href));
  check('Botões "Como chegar" apontam para o Google Maps', maps.length === 2 && maps[0].includes('Cachalote') && maps[1].includes('Bem-Te-Vis'));
  const tel = await page.$$eval('a[href^="tel:"]', (as) => [...new Set(as.map((a) => a.getAttribute('href')))]);
  check('Links de telefone', tel.includes('tel:+5519997960155') && tel.includes('tel:+5519996038906'), tel.join(', '));
  const insta = await page.$$eval('a[href*="instagram.com"]', (as) => [...new Set(as.map((a) => a.href))]);
  check('Instagram oficial', insta.length === 1 && insta[0] === 'https://www.instagram.com/labolosedelicias/');
  const emptyLinks = await page.$$eval('a', (as) => as.filter((a) => !a.getAttribute('href') || a.getAttribute('href') === '#').length);
  check('Nenhum link vazio', emptyLinks === 0);

  // Navegação por âncora não fica coberta pelo cabeçalho
  await page.click('.header__nav a[href="#lojas"]');
  await page.waitForTimeout(1500);
  const headerBottom = await page.$eval('.header', (h) => h.getBoundingClientRect().bottom);
  const titleTop = await page.$eval('#stores-title', (h) => h.getBoundingClientRect().top);
  check('Âncora "Nossas lojas": título visível abaixo do cabeçalho', titleTop >= headerBottom, `título em ${Math.round(titleTop)}px, cabeçalho até ${Math.round(headerBottom)}px`);
  const activeNav = await page.$eval('.nav-link.is-active', (a) => a.textContent).catch(() => null);
  check('Seção ativa destacada no menu', activeNav === 'Nossas lojas', String(activeNav));
  check('Cabeçalho ganha fundo ao rolar', await page.$eval('.header', (h) => h.classList.contains('is-scrolled')));

  // Diálogo de pedido
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.click('.hero__actions .button--primary');
  await page.waitForTimeout(500);
  check('"Faça seu pedido" abre a escolha de loja', await page.$eval('.order-dialog', (d) => d.open));
  const orderLinks = await page.$$eval('.order-dialog a', (as) => as.map((a) => a.href));
  check('Escolha de loja com os dois WhatsApps', orderLinks.length === 2 && orderLinks[0].includes('5519997960155') && orderLinks[1].includes('5519996038906'));
  await page.screenshot({ path: `${OUT}/dialog-pedido-1440.png` });
  await page.keyboard.press('Escape');
  await page.waitForTimeout(450);
  check('Escape fecha o diálogo de pedido', !(await page.$eval('.order-dialog', (d) => d.open)));
  check('Foco volta ao botão que abriu', await page.evaluate(() => document.activeElement?.textContent?.includes('Faça seu pedido')));

  // Pedido a partir de um produto
  await page.click('.product-card__cta >> nth=0');
  await page.waitForTimeout(500);
  const productLink = await page.$eval('.order-dialog a', (a) => decodeURIComponent(a.href));
  check('Card de produto gera mensagem com o nome do produto', productLink.includes('Morango cravejado de maracujá'));
  await page.keyboard.press('Escape');
  await page.waitForTimeout(450);

  // Filtros
  const countAll = await page.$$eval('.product-card', (c) => c.length);
  await page.click('.filter:has-text("Salgados")');
  await page.waitForTimeout(400);
  const countSalgados = await page.$$eval('.product-card', (c) => c.length);
  await page.click('.filter:has-text("Datas especiais")');
  await page.waitForTimeout(400);
  const countDatas = await page.$$eval('.product-card', (c) => c.length);
  check('Filtros alteram os produtos exibidos', countAll === 16 && countSalgados === 4 && countDatas === 4, `${countAll} / ${countSalgados} / ${countDatas}`);
  await page.waitForTimeout(900);
  await page.locator('#cardapio').screenshot({ path: `${OUT}/cardapio-filtro-1440.png` });
  await page.click('.filter:has-text("Todos")');

  // Lightbox
  await page.locator('.gallery__button').nth(0).scrollIntoViewIfNeeded();
  await page.locator('.gallery__button').nth(0).click();
  await page.waitForTimeout(900);
  check('Galeria abre o lightbox', await page.$eval('.lightbox', (d) => d.open));
  const c1 = await page.$eval('.lightbox__counter', (e) => e.textContent);
  await page.keyboard.press('ArrowRight');
  await page.waitForTimeout(700);
  const c2 = await page.$eval('.lightbox__counter', (e) => e.textContent);
  check('Seta direita avança a foto', c1?.startsWith('1 /') && c2?.startsWith('2 /'), `${c1} → ${c2}`);
  await page.click('.lightbox__nav--prev');
  await page.waitForTimeout(700);
  check('Botão anterior volta a foto', (await page.$eval('.lightbox__counter', (e) => e.textContent))?.startsWith('1 /'));
  const imgFits = await page.$eval('.lightbox__figure img', (i) => {
    const r = i.getBoundingClientRect();
    return r.bottom <= window.innerHeight && r.right <= window.innerWidth && i.naturalWidth > 0;
  });
  check('Foto ampliada carregada e dentro da tela', imgFits);
  await page.screenshot({ path: `${OUT}/lightbox-1440.png` });
  await page.keyboard.press('Escape');
  await page.waitForTimeout(450);
  check('Escape fecha o lightbox', !(await page.$eval('.lightbox', (d) => d.open)));

  // Formulário de contato
  await page.locator('#contato').scrollIntoViewIfNeeded();
  await page.click('.form button[type="submit"]');
  const errCount = await page.$$eval('.field__error', (e) => e.length);
  check('Formulário vazio mostra erros de validação', errCount === 3, `${errCount} erros`);
  await page.click('.store-radio >> nth=1');
  await page.fill('input[autocomplete="name"]', 'Maria');
  await page.fill('textarea', 'Quais doces vocês têm hoje?');
  const [popup] = await Promise.all([page.waitForEvent('popup', { timeout: 5000 }), page.click('.form button[type="submit"]')]);
  const popupUrl = popup.url();
  await popup.close().catch(() => {});
  const decoded = decodeURIComponent(popupUrl.replace(/\+/g, ' '));
  check(
    'Formulário abre o WhatsApp da loja escolhida com a mensagem',
    /wa\.me\/5519996038906|api\.whatsapp\.com.*5519996038906|whatsapp/.test(popupUrl) && decoded.includes('Maria') && decoded.includes('Loja 2'),
    popupUrl.slice(0, 90),
  );
  check('Feedback após abrir o WhatsApp', await page.$eval('.form__status', (e) => e.textContent?.includes('Loja 2')));
  await page.locator('.contact__card').screenshot({ path: `${OUT}/formulario-1440.png` });

  check('Funcionalidades desktop sem erros de console', errors.filter((e) => !e.includes('whatsapp') && !e.includes('wa.me')).length === 0, errors.slice(0, 3).join(' | '));
  await context.close();
}

// ---------- Funcionalidades (celular) ----------
{
  const { context, page, errors } = await newPage(390, 844, { hasTouch: true, isMobile: true });
  await page.goto(BASE, { waitUntil: 'networkidle' });

  await page.click('.header__menu-toggle');
  await page.waitForTimeout(600);
  check('Menu mobile abre', await page.$eval('.mobile-menu', (d) => d.open));
  await page.screenshot({ path: `${OUT}/menu-mobile-390.png` });
  await page.keyboard.press('Escape');
  await page.waitForTimeout(450);
  check('Escape fecha o menu mobile', !(await page.$eval('.mobile-menu', (d) => d.open)));

  await page.click('.header__menu-toggle');
  await page.waitForTimeout(500);
  await page.click('.mobile-menu__list a[href="#cardapio"]');
  await page.waitForTimeout(1800);
  check('Selecionar item fecha o menu', !(await page.$eval('.mobile-menu', (d) => d.open)));
  const menuTitleTop = await page.$eval('#menu-title', (h) => h.getBoundingClientRect().top);
  const headerH = await page.$eval('.header', (h) => h.getBoundingClientRect().bottom);
  check('Menu mobile navega até a seção sem cobrir o título', menuTitleTop >= headerH && menuTitleTop < 844, `${Math.round(menuTitleTop)}px`);
  check('Scroll liberado após fechar menu', !(await page.evaluate(() => document.documentElement.classList.contains('scroll-locked'))));

  // WhatsApp flutuante
  check('Botão flutuante visível após o hero', await page.$eval('.wa-float', (e) => e.classList.contains('is-visible')));
  await page.click('.wa-float__toggle');
  await page.waitForTimeout(400);
  const floatLinks = await page.$$eval('.wa-float__option', (as) => as.map((a) => a.href));
  check('Botão flutuante oferece as duas lojas', floatLinks.length === 2 && floatLinks[0].includes('5519997960155') && floatLinks[1].includes('5519996038906'));
  await page.screenshot({ path: `${OUT}/whatsapp-flutuante-390.png` });
  await page.keyboard.press('Escape');
  await page.waitForTimeout(200);
  check('Escape fecha o menu do botão flutuante', await page.$eval('.wa-float__menu', (m) => m.hidden));

  // Folha de pedido no celular
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(300);
  await page.click('.hero__actions .button--primary');
  await page.waitForTimeout(600);
  await page.screenshot({ path: `${OUT}/dialog-pedido-390.png` });
  await page.keyboard.press('Escape');
  await page.waitForTimeout(400);

  check('Celular sem erros de console', errors.length === 0, errors.slice(0, 3).join(' | '));
  await context.close();
}

// ---------- Movimento reduzido ----------
{
  const { context, page } = await newPage(1024, 800, { reducedMotion: 'reduce' });
  await page.goto(BASE, { waitUntil: 'networkidle' });
  await page.evaluate(() => window.scrollTo(0, 2400));
  await page.waitForTimeout(300);
  const visibleOpacity = await page.$$eval('.reveal', (els) => els.every((e) => getComputedStyle(e).opacity === '1'));
  check('prefers-reduced-motion: conteúdo visível sem animação', visibleOpacity);
  await context.close();
}

await browser.close();
const failed = results.filter((r) => !r.ok);
console.log(`\n${results.length - failed.length}/${results.length} verificações aprovadas. Capturas em ${OUT}/`);
process.exit(failed.length ? 1 : 0);
