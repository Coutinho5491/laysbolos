import type { ImageId } from './images';

export type StoreId = 'loja-1' | 'loja-2';

export interface Store {
  id: StoreId;
  /** Nome curto exibido em botões e seletores */
  shortName: string;
  name: string;
  street: string;
  /** Cidade/UF. `null` quando ainda não confirmada pelo cliente. */
  city: string | null;
  phoneDisplay: string;
  /** Somente dígitos, com DDI — usado em wa.me e tel: */
  phoneE164: string;
  greeting: string;
  /** Texto usado na busca de rota do Google Maps */
  mapsQuery: string;
  photo: ImageId;
  photoAlt: string;
  interior: ImageId;
  interiorAlt: string;
}

export const STORES: Store[] = [
  {
    id: 'loja-1',
    shortName: 'Loja 1',
    name: 'Lays Andrade Bolos & Delícias — Loja 1',
    street: 'Avenida Cachalote, 228',
    city: 'Vinhedo — SP',
    phoneDisplay: '(19) 99796-0155',
    phoneE164: '5519997960155',
    greeting: 'Olá! Gostaria de conhecer os produtos da Lays Andrade Bolos & Delícias da Loja 1.',
    mapsQuery: 'Avenida Cachalote, 228, Vinhedo - SP',
    photo: 'fachada-loja-1',
    photoAlt: 'Fachada da Loja 1, com toldo listrado em azul e rosa e o logotipo circular no muro',
    interior: 'interior-loja-1',
    interiorAlt: 'Salão da Loja 1 com banco estofado azul, mesas brancas e janelas em arco',
  },
  {
    id: 'loja-2',
    shortName: 'Loja 2',
    name: 'Lays Andrade Bolos & Delícias — Loja 2',
    street: 'Rua dos Bem-Te-Vis, 76',
    // PENDENTE: cidade e localização exata a confirmar com o cliente antes da publicação.
    city: null,
    phoneDisplay: '(19) 99603-8906',
    phoneE164: '5519996038906',
    greeting: 'Olá! Gostaria de conhecer os produtos da Lays Andrade Bolos & Delícias da Loja 2.',
    // O nome da marca ajuda o Maps a localizar a unidade enquanto a cidade não é confirmada.
    mapsQuery: 'Lays Andrade Bolos e Delícias, Rua dos Bem-Te-Vis, 76',
    photo: 'fachada-loja-2',
    photoAlt: 'Fachada da Loja 2 em azul-marinho e rosa, com o letreiro Lays Andrade Bolos e Delícias',
    interior: 'interior-loja-2',
    interiorAlt: 'Salão da Loja 2 com painéis em arco, arandelas e mesas de madeira',
  },
];

export const getStore = (id: StoreId) => STORES.find((s) => s.id === id)!;
