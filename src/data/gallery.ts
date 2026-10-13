import type { ImageId } from './images';

export interface GalleryItem {
  image: ImageId;
  alt: string;
  caption: string;
}

export const GALLERY: GalleryItem[] = [
  {
    image: 'morango-cravejado-preparo',
    alt: 'Bancada com dezenas de morangos sobre porções de massa de maracujá, em preparo',
    caption: 'Morangos cravejados de maracujá em preparo',
  },
  {
    image: 'interior-loja-2-b',
    alt: 'Balcão azul-marinho da Loja 2 e parede verde com neon “Gente, genteee!” e balanço florido',
    caption: 'Loja 2 — o balanço e o neon “Gente, genteee!”',
  },
  {
    image: 'lalajor-doce-de-leite',
    alt: 'Mão segurando cesta de lalájores de doce de leite cobertos com chocolate',
    caption: 'Lalájor de doce de leite',
  },
  {
    image: 'ovos-pascoa',
    alt: 'Ovos de Páscoa com chocolate branco e ao leite, uvas verdes cobertas e pistache',
    caption: 'Ovos de Páscoa',
  },
  {
    image: 'paozinho-artesanal',
    alt: 'Assadeira com pãezinhos artesanais dourados',
    caption: 'Pãozinho artesanal',
  },
  {
    image: 'interior-loja-2-c',
    alt: 'Corredor externo da Loja 2 com mesas de madeira, flores e buganvílias',
    caption: 'Área externa da Loja 2',
  },
  {
    image: 'cookies-nutella',
    alt: 'Cookies recheados com Nutella embalados para o Dia dos Professores',
    caption: 'Cookies artesanais recheados com Nutella',
  },
  {
    image: 'chocotone-ninho-nutella',
    alt: 'Chocotone Ninho com Nutella cortado, em cenário natalino',
    caption: 'Chocotone Ninho com Nutella',
  },
  {
    image: 'baguete-recheada',
    alt: 'Baguetes recheadas recém-assadas',
    caption: 'Baguete recheada',
  },
  {
    image: 'interior-loja-1',
    alt: 'Salão da Loja 1 com janelas em arco de vitral amarelo e banco azul',
    caption: 'Loja 1 — salão',
  },
  {
    image: 'ovo-pascoa-kinder-bueno',
    alt: 'Ovo de Páscoa Kinder Bueno com placa de chocolate Lays Andrade',
    caption: 'Ovo de Páscoa Kinder Bueno',
  },
  {
    image: 'fudge-meio-amargo',
    alt: 'Fudge meio amargo com amendoim e cereja',
    caption: 'Fudge meio amargo com amendoim e cereja',
  },
  {
    image: 'interior-loja-2',
    alt: 'Mesas da Loja 2 diante de painéis em arco com arandelas',
    caption: 'Loja 2 — salão',
  },
  {
    image: 'cone-trufado-2',
    alt: 'Cone trufado mordido, com recheio de chocolate',
    caption: 'Cone trufado',
  },
  {
    image: 'chocotone-doce-de-leite-nozes',
    alt: 'Chocotone de doce de leite com nozes partido ao meio',
    caption: 'Chocotone de doce de leite com nozes',
  },
  {
    image: 'fachada-loja-2',
    alt: 'Fachada da Loja 2 em azul-marinho e rosa',
    caption: 'Loja 2 — fachada',
  },
];
