import type { Store } from '../data/stores';

export const whatsappUrl = (store: Store, message = store.greeting) =>
  `https://wa.me/${store.phoneE164}?text=${encodeURIComponent(message)}`;

export const telUrl = (store: Store) => `tel:+${store.phoneE164}`;

export const directionsUrl = (store: Store) =>
  `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(store.mapsQuery)}`;

export const productMessage = (store: Store, product: string) =>
  `Olá! Gostaria de saber sobre as opções de ${product} na ${store.shortName} da Lays Andrade Bolos & Delícias.`;
