import { useState } from 'react';
import { ImageOff } from 'lucide-react';
import { IMAGES, imageSrc, srcSet, type ImageId } from '../data/images';

interface PictureProps {
  id: ImageId;
  alt: string;
  /** Valor do atributo `sizes` — descreve a largura exibida em cada breakpoint */
  sizes: string;
  /** Imagem da primeira dobra: carrega imediatamente com prioridade alta */
  priority?: boolean;
  className?: string;
  imgClassName?: string;
}

/**
 * <picture> com AVIF + WebP, dimensões intrínsecas (sem layout shift),
 * placeholder desfocado enquanto carrega e alternativa elegante em caso de falha.
 */
export function Picture({ id, alt, sizes, priority = false, className = '', imgClassName = '' }: PictureProps) {
  const meta = IMAGES[id];
  const [state, setState] = useState<'loading' | 'loaded' | 'error'>('loading');
  const fallbackWidth = meta.widths.find((w) => w >= 800) ?? meta.widths[meta.widths.length - 1];

  return (
    <div
      className={`picture is-${state} ${className}`}
      style={{ backgroundImage: state === 'error' ? undefined : `url(${meta.placeholder})` }}
    >
      {state === 'error' ? (
        <div className="picture__fallback" role="img" aria-label={alt}>
          <ImageOff aria-hidden="true" size={22} strokeWidth={1.5} />
          <span>Imagem indisponível no momento</span>
        </div>
      ) : (
        <picture>
          <source type="image/avif" srcSet={srcSet(id, 'avif')} sizes={sizes} />
          <source type="image/webp" srcSet={srcSet(id, 'webp')} sizes={sizes} />
          <img
            className={imgClassName}
            src={imageSrc(id, fallbackWidth, 'webp')}
            alt={alt}
            width={meta.width}
            height={meta.height}
            loading={priority ? 'eager' : 'lazy'}
            decoding={priority ? 'sync' : 'async'}
            fetchPriority={priority ? 'high' : 'auto'}
            ref={(img) => {
              // Imagens vindas do cache podem completar antes da hidratação dos eventos
              if (img?.complete && img.naturalWidth > 0 && state === 'loading') setState('loaded');
            }}
            onLoad={() => setState('loaded')}
            onError={() => setState('error')}
          />
        </picture>
      )}
    </div>
  );
}
