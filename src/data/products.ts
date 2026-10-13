import type { ImageId } from './images';

export type CategoryId = 'doces' | 'salgados' | 'datas-especiais';

export const CATEGORIES: { id: CategoryId; label: string }[] = [
  { id: 'doces', label: 'Doces' },
  { id: 'salgados', label: 'Salgados e pães' },
  { id: 'datas-especiais', label: 'Datas especiais' },
];

export interface Product {
  id: string;
  name: string;
  category: CategoryId;
  image: ImageId;
  alt: string;
  /** Apenas informações confirmadas (nome do arquivo enviado pelo cliente ou texto visível na foto/embalagem). */
  description?: string;
  /** Selo de sazonalidade — não indica disponibilidade atual */
  season?: string;
}

// Preços, tamanhos e disponibilidade não foram informados: os cards convidam a consultar a loja.
export const PRODUCTS: Product[] = [
  {
    id: 'morango-cravejado',
    name: 'Morango cravejado de maracujá',
    category: 'doces',
    image: 'morango-cravejado',
    alt: 'Morangos cravejados de maracujá cortados ao meio, mostrando o morango inteiro envolto em creme e cobertura branca',
  },
  {
    id: 'nevado-cremoso',
    name: 'Nevado Cremoso',
    category: 'doces',
    image: 'nevado-cremoso',
    alt: 'Pote de Nevado Cremoso com rótulo azul-marinho da Lays Andrade e colher com creme e geleia de morango',
    description: 'Brigadeiro branco cremoso, dupla camada de creme de Ninho e geleia artesanal de morango.',
  },
  {
    id: 'lalajor',
    name: 'Lalájor de doce de leite',
    category: 'doces',
    image: 'lalajor-doce-de-leite',
    alt: 'Lalájores cobertos de chocolate, dois cortados mostrando o recheio de doce de leite, em papel com a marca Lays Andrade',
  },
  {
    id: 'cookies-nutella',
    name: 'Cookies artesanais recheados com Nutella',
    category: 'doces',
    image: 'cookies-nutella',
    alt: 'Cookie partido ao meio com recheio de Nutella, ao lado de cookies embalados para presente com laço verde',
  },
  {
    id: 'fudge',
    name: 'Fudge meio amargo com amendoim e cereja',
    category: 'doces',
    image: 'fudge-meio-amargo',
    alt: 'Dois pedaços de fudge de chocolate meio amargo com amendoim e cereja, empilhados sobre prato rosa',
  },
  {
    id: 'cone-trufado',
    name: 'Cone trufado',
    category: 'doces',
    image: 'cone-trufado',
    alt: 'Cones cobertos de chocolate, um deles aberto mostrando o recheio cremoso, com coco ralado',
  },
  {
    id: 'big-bites',
    name: 'Big Bites',
    category: 'doces',
    image: 'big-bites',
    alt: 'Big Bites de chocolate ao leite mordido sobre suporte de madeira, ao lado da embalagem rosa',
    description: 'Chocolate ao leite.',
  },
  {
    id: 'pao-de-mel',
    name: 'Pão de mel',
    category: 'doces',
    image: 'pao-de-mel',
    alt: 'Pão de mel coberto de chocolate, mordido, revelando recheio de doce de leite, ao lado da embalagem',
    description: 'Recheio de doce de leite.',
  },
  {
    id: 'empadao-frango',
    name: 'Empadão de frango',
    category: 'salgados',
    image: 'empadao-frango',
    alt: 'Empadão de frango dourado com uma fatia levantada, mostrando o recheio',
    description: 'Versão de 1 kg.',
  },
  {
    id: 'tortinha-palmito',
    name: 'Tortinha de palmito',
    category: 'salgados',
    image: 'tortinha-palmito',
    alt: 'Tortinha de palmito gratinada com gergelim preto em forma de alumínio',
  },
  {
    id: 'baguete-recheada',
    name: 'Baguete recheada',
    category: 'salgados',
    image: 'baguete-recheada',
    alt: 'Fileira de baguetes recheadas douradas e brilhantes, com queijo ralado por cima',
  },
  {
    id: 'paozinho-artesanal',
    name: 'Pãozinho artesanal',
    category: 'salgados',
    image: 'paozinho-artesanal',
    alt: 'Assadeira com pãezinhos artesanais dourados e macios, lado a lado',
  },
  {
    id: 'chocotone-ninho-nutella',
    name: 'Chocotone Ninho com Nutella',
    category: 'datas-especiais',
    image: 'chocotone-ninho-nutella',
    alt: 'Chocotone cortado ao meio com recheio de Ninho e Nutella, em cenário natalino',
    season: 'Natal',
  },
  {
    id: 'chocotone-doce-de-leite',
    name: 'Chocotone de doce de leite com nozes',
    category: 'datas-especiais',
    image: 'chocotone-doce-de-leite-nozes',
    alt: 'Chocotone partido ao meio com recheio de doce de leite e nozes, em cenário natalino',
    season: 'Natal',
  },
  {
    id: 'ovo-kinder-bueno',
    name: 'Ovo de Páscoa Kinder Bueno',
    category: 'datas-especiais',
    image: 'ovo-pascoa-kinder-bueno',
    alt: 'Ovo de Páscoa decorado com barras de Kinder Bueno, confeitos de creme e placa de chocolate com a marca',
    season: 'Páscoa',
  },
  {
    id: 'ovos-pascoa',
    name: 'Ovos de Páscoa',
    category: 'datas-especiais',
    image: 'ovos-pascoa-selecao',
    alt: 'Seleção de ovos de Páscoa decorados, com uvas, brigadeiros, Kinder Bueno e confeitos de creme',
    season: 'Páscoa',
  },
];
