// Gera variações responsivas (AVIF + WebP) das fotos originais em assets/images,
// sem modificar os arquivos originais. Saída: public/img + src/data/images.generated.json
//
// Uso: npm run images

import sharp from 'sharp';
import { mkdir, writeFile, rm } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SRC = path.join(root, 'assets', 'images');
const OUT = path.join(root, 'public', 'img');
const MANIFEST = path.join(root, 'src', 'data', 'images.generated.json');

// Arquivo original -> identificador estável usado no código
const FILES = {
  'Morango cravejado de maracujá.jpg': 'morango-cravejado',
  'Morango cravejado de maracujá sendo preparado.jpg': 'morango-cravejado-preparo',
  'Lalájor de doce de leite.jpg': 'lalajor-doce-de-leite',
  'FUDGE MEIO AMARGO COM AMENDOIM E CEREJA.jpg': 'fudge-meio-amargo',
  'Cookies artesanais recheados com Nutella.jpg': 'cookies-nutella',
  'CONES TRUFADO.jpg': 'cone-trufado',
  'CONES TRUFADO 2.jpg': 'cone-trufado-2',
  'Nevado Cremoso 1.jpg': 'nevado-cremoso',
  'Brigadeiro branco cremoso_Nevado Cremoso.jpg': 'nevado-brigadeiro-branco',
  'Dupla camada de creme de ninho_Nevado Cremoso.jpg': 'nevado-creme-ninho',
  'Geleia artesanal de morango_Nevado Cremoso.jpg': 'nevado-geleia-morango',
  'Big Bites.jpg': 'big-bites',
  'Pão de Mel.jpg': 'pao-de-mel',
  'Chocotone Ninho com Nutella.jpg': 'chocotone-ninho-nutella',
  'Chocotone de Doce de Leite com Nozes.jpg': 'chocotone-doce-de-leite-nozes',
  'ovo de pascoa Kinder Bueno.jpg': 'ovo-pascoa-kinder-bueno',
  'ovos de pascoa Qual será a sua escolha.jpg': 'ovos-pascoa-selecao',
  'ovos de pascoa.jpg': 'ovos-pascoa',
  'Empadão de Frango 1kg.webp': 'empadao-frango',
  'Tortinha de Palmito.jpg': 'tortinha-palmito',
  'baguete recheada.jpg': 'baguete-recheada',
  'pãozinho artesanal.jpg': 'paozinho-artesanal',
  'fachada loja 1.webp': 'fachada-loja-1',
  'fachada loja 2.webp': 'fachada-loja-2',
  'interior loja 1.webp': 'interior-loja-1',
  'interior loja 2.webp': 'interior-loja-2',
  'interior 2 loja 2.webp': 'interior-loja-2-b',
  'interior 3 loja 2.webp': 'interior-loja-2-c',
};

const WIDTHS = [480, 800, 1200, 1600];

await rm(OUT, { recursive: true, force: true });
await mkdir(OUT, { recursive: true });
await mkdir(path.dirname(MANIFEST), { recursive: true });

const manifest = {};

for (const [file, id] of Object.entries(FILES)) {
  const input = path.join(SRC, file);
  const meta = await sharp(input).rotate().metadata();
  const srcW = meta.autoOrient?.width ?? meta.width;
  const srcH = meta.autoOrient?.height ?? meta.height;

  // Nunca amplia: larguras acima da original são descartadas
  let widths = WIDTHS.filter((w) => w <= srcW);
  if (widths.length === 0 || widths[widths.length - 1] < srcW && srcW < WIDTHS[WIDTHS.length - 1]) {
    widths.push(srcW);
  }
  widths = [...new Set(widths)].sort((a, b) => a - b);

  for (const w of widths) {
    const pipeline = sharp(input).rotate().resize({ width: w, withoutEnlargement: true });
    await pipeline.clone().avif({ quality: 52, effort: 5 }).toFile(path.join(OUT, `${id}-${w}.avif`));
    await pipeline.clone().webp({ quality: 78, effort: 5 }).toFile(path.join(OUT, `${id}-${w}.webp`));
  }

  // Placeholder desfocado minúsculo, embutido como data URI
  const lqip = await sharp(input).rotate().resize({ width: 24 }).blur(1.2).webp({ quality: 40 }).toBuffer();

  manifest[id] = {
    width: srcW,
    height: srcH,
    widths,
    placeholder: `data:image/webp;base64,${lqip.toString('base64')}`,
  };
  console.log(`✓ ${id} (${srcW}×${srcH}) → ${widths.join(', ')}`);
}

await writeFile(MANIFEST, JSON.stringify(manifest, null, 2) + '\n');

// Ícones e imagem de compartilhamento
const logo = path.join(SRC, 'logo Lays Andrade.jpg');
const circleMask = (size) =>
  Buffer.from(`<svg width="${size}" height="${size}"><circle cx="${size / 2}" cy="${size / 2}" r="${size / 2}" fill="#fff"/></svg>`);

// O círculo azul ocupa ~76% do arquivo original; recorta para ele
const logoMeta = await sharp(logo).metadata();
const inset = Math.round(logoMeta.width * 0.12);
const circleSize = logoMeta.width - inset * 2;
const logoCircle = await sharp(logo)
  .extract({ left: inset, top: inset, width: circleSize, height: circleSize })
  .toBuffer();

for (const size of [32, 192, 512]) {
  await sharp(logoCircle)
    .resize(size, size, { kernel: 'lanczos3' })
    .composite([{ input: circleMask(size), blend: 'dest-in' }])
    .png()
    .toFile(path.join(root, 'public', size === 32 ? 'favicon-32.png' : `icon-${size}.png`));
}
await sharp(logoCircle).resize(180, 180).flatten({ background: '#263B59' }).png().toFile(path.join(root, 'public', 'apple-touch-icon.png'));
await sharp(logoCircle).resize(128, 128, { kernel: 'lanczos3' })
  .composite([{ input: circleMask(128), blend: 'dest-in' }])
  .webp({ quality: 90 })
  .toFile(path.join(OUT, 'logo-128.webp'));

await sharp(path.join(SRC, 'Morango cravejado de maracujá.jpg'))
  .rotate()
  .resize(1200, 630, { fit: 'cover', position: 'attention' })
  .jpeg({ quality: 82, mozjpeg: true })
  .toFile(path.join(root, 'public', 'og-image.jpg'));

console.log('✓ ícones e og-image gerados');
