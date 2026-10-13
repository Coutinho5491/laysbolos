import { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import type { GalleryItem } from '../data/gallery';
import { IMAGES, srcSet } from '../data/images';
import { useDialog } from '../hooks/useDialog';

interface LightboxProps {
  items: GalleryItem[];
  index: number | null;
  onChange: (index: number) => void;
  onClose: () => void;
}

export function Lightbox({ items, index, onChange, onClose }: LightboxProps) {
  const open = index !== null;
  const { ref, requestClose } = useDialog(open, onClose);
  // Mantém a última foto visível durante a animação de fechamento
  const [shown, setShown] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);
  const touchX = useRef<number | null>(null);

  useEffect(() => {
    if (index !== null) {
      setShown(index);
      setLoaded(false);
      setFailed(false);
    }
  }, [index]);

  const total = items.length;
  const go = (delta: number) => onChange((shown + delta + total) % total);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') go(1);
      if (e.key === 'ArrowLeft') go(-1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  // Pré-carrega as vizinhas para navegação instantânea
  useEffect(() => {
    if (!open) return;
    for (const d of [1, -1]) {
      const item = items[(shown + d + total) % total];
      const img = new Image();
      img.sizes = '92vw';
      img.srcset = srcSet(item.image, 'webp');
    }
  }, [open, shown, items, total]);

  const item = items[shown];
  const meta = IMAGES[item.image];

  return (
    <dialog ref={ref} className="dialog lightbox" aria-label="Galeria ampliada">
      <div
        className="lightbox__stage"
        onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
        onTouchEnd={(e) => {
          if (touchX.current === null) return;
          const dx = e.changedTouches[0].clientX - touchX.current;
          if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1);
          touchX.current = null;
        }}
        onClick={(e) => {
          if (e.target === e.currentTarget) requestClose();
        }}
      >
        <figure className={`lightbox__figure ${loaded ? 'is-loaded' : ''}`} key={item.image}>
          {!loaded && !failed && <span className="spinner" role="status" aria-label="Carregando foto" />}
          {failed ? (
            <p className="lightbox__error">Não foi possível carregar esta foto.</p>
          ) : (
            <picture>
              <source type="image/avif" srcSet={srcSet(item.image, 'avif')} sizes="(min-width: 1024px) 70vw, 100vw" />
              <img
                srcSet={srcSet(item.image, 'webp')}
                sizes="(min-width: 1024px) 70vw, 100vw"
                src={`/img/${item.image}-${meta.widths[meta.widths.length - 1]}.webp`}
                alt={item.alt}
                width={meta.width}
                height={meta.height}
                onLoad={() => setLoaded(true)}
                onError={() => setFailed(true)}
              />
            </picture>
          )}
          <figcaption>
            <span>{item.caption}</span>
            <span className="lightbox__counter" aria-live="polite">
              {shown + 1} / {total}
            </span>
          </figcaption>
        </figure>
      </div>

      <button type="button" className="icon-button icon-button--light lightbox__close" onClick={requestClose} aria-label="Fechar galeria">
        <X size={24} strokeWidth={1.6} aria-hidden="true" />
      </button>
      <button type="button" className="icon-button icon-button--light lightbox__nav lightbox__nav--prev" onClick={() => go(-1)} aria-label="Foto anterior">
        <ChevronLeft size={26} strokeWidth={1.6} aria-hidden="true" />
      </button>
      <button type="button" className="icon-button icon-button--light lightbox__nav lightbox__nav--next" onClick={() => go(1)} aria-label="Próxima foto">
        <ChevronRight size={26} strokeWidth={1.6} aria-hidden="true" />
      </button>
    </dialog>
  );
}
