import { useState, type CSSProperties } from 'react';
import { Expand } from 'lucide-react';
import { GALLERY } from '../data/gallery';
import { BRAND } from '../data/site';
import { useReveal } from '../hooks/useReveal';
import { InstagramIcon } from './Brand';
import { Lightbox } from './Lightbox';
import { Picture } from './Picture';
import { Reveal } from './Reveal';

function GalleryTile({ index, onOpen }: { index: number; onOpen: (i: number) => void }) {
  const item = GALLERY[index];
  const ref = useReveal<HTMLLIElement>();
  return (
    <li ref={ref} className="gallery__item reveal reveal--image" style={{ '--reveal-delay': `${(index % 3) * 90}ms` } as CSSProperties}>
      <button type="button" className="gallery__button" onClick={() => onOpen(index)} aria-label={`Ampliar foto: ${item.caption}`}>
        <Picture id={item.image} alt={item.alt} sizes="(min-width: 1024px) 31vw, (min-width: 640px) 46vw, 92vw" />
        <span className="gallery__overlay" aria-hidden="true">
          <span className="gallery__caption">{item.caption}</span>
          <Expand size={18} strokeWidth={1.6} />
        </span>
      </button>
    </li>
  );
}

export function Gallery() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="galeria" className="section gallery" aria-labelledby="gallery-title">
      <div className="container">
        <div className="section-head section-head--split">
          <div>
            <Reveal>
              <p className="eyebrow">Galeria</p>
            </Reveal>
            <Reveal delay={80}>
              <h2 id="gallery-title" className="section-title">
                Nossas delícias, <em>nossos espaços.</em>
              </h2>
            </Reveal>
          </div>
          <Reveal delay={160} className="gallery__head-aside">
            <p className="section-lead">Toque em uma foto para ampliar. Acompanhe as novidades no nosso Instagram.</p>
            <a className="text-link" href={BRAND.instagramUrl} target="_blank" rel="noopener noreferrer">
              <InstagramIcon size={18} />
              {BRAND.instagramHandle}
            </a>
          </Reveal>
        </div>

        <ul className="gallery__grid">
          {GALLERY.map((item, i) => (
            <GalleryTile key={item.image} index={i} onOpen={setOpenIndex} />
          ))}
        </ul>
      </div>

      <Lightbox items={GALLERY} index={openIndex} onChange={setOpenIndex} onClose={() => setOpenIndex(null)} />
    </section>
  );
}
