import manifest from './images.generated.json';

// Gerado por `npm run images` a partir de assets/images
export type ImageId = keyof typeof manifest;

export interface ImageMeta {
  width: number;
  height: number;
  widths: number[];
  placeholder: string;
}

export const IMAGES = manifest as Record<ImageId, ImageMeta>;

export const imageSrc = (id: ImageId, width: number, format: 'avif' | 'webp') => `/img/${id}-${width}.${format}`;

export const srcSet = (id: ImageId, format: 'avif' | 'webp') =>
  IMAGES[id].widths.map((w) => `${imageSrc(id, w, format)} ${w}w`).join(', ');

export const largestSrc = (id: ImageId, format: 'avif' | 'webp' = 'webp') => {
  const widths = IMAGES[id].widths;
  return imageSrc(id, widths[widths.length - 1], format);
};
