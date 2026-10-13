export const BRAND = {
  name: 'Lays Andrade Bolos & Delícias',
  shortName: 'Lays Andrade',
  tagline: 'Bolos & Delícias',
  instagramHandle: '@labolosedelicias',
  instagramUrl: 'https://www.instagram.com/labolosedelicias/',
};

export const NAV_ITEMS = [
  { id: 'inicio', label: 'Início' },
  { id: 'historia', label: 'Nossa história' },
  { id: 'cardapio', label: 'Cardápio' },
  { id: 'galeria', label: 'Galeria' },
  { id: 'lojas', label: 'Nossas lojas' },
  { id: 'contato', label: 'Contato' },
] as const;

export type SectionId = (typeof NAV_ITEMS)[number]['id'];
