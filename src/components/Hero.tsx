import { ArrowRight } from 'lucide-react';
import { scrollToSection } from '../lib/motion';
import { useOrder } from '../lib/order';
import { useParallax } from '../hooks/useParallax';
import { LogoMark } from './Brand';
import { Picture } from './Picture';

export function Hero() {
  const { openOrder } = useOrder();
  const accentRef = useParallax<HTMLDivElement>(-0.06);

  return (
    <section id="inicio" className="hero" aria-labelledby="hero-title">
      <div className="hero__inner container">
        <div className="hero__content">
          <p className="eyebrow hero__eyebrow">
            <span className="hero__eyebrow-line" aria-hidden="true" />
            Bolos &amp; Delícias · Vinhedo e região
          </p>
          <h1 id="hero-title" className="hero__title">
            <span className="hero__line">Doces, salgados</span>
            <span className="hero__line">
              e <em>momentos</em>
            </span>
            <span className="hero__line">
              <em>especiais.</em>
            </span>
          </h1>
          <p className="hero__lead">
            Sabores que fazem parte da sua história. Descubra as delícias da Lays Andrade e encontre o sabor perfeito
            para cada momento.
          </p>
          <div className="hero__actions">
            <button type="button" className="button button--primary" onClick={() => openOrder()}>
              Faça seu pedido
              <ArrowRight size={18} strokeWidth={1.8} aria-hidden="true" />
            </button>
            <a
              href="#lojas"
              className="button button--ghost"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection('lojas');
              }}
            >
              Conheça nossas lojas
            </a>
          </div>
          <ul className="hero__facts" aria-label="Destaques">
            <li>Aberto todos os dias</li>
            <li>Duas unidades</li>
            <li>Pedidos pelo WhatsApp</li>
          </ul>
        </div>

        <div className="hero__media">
          <div className="hero__arch">
            <Picture
              id="morango-cravejado"
              alt="Morangos cravejados de maracujá cortados ao meio, revelando o morango envolto em creme sob a cobertura branca"
              sizes="(min-width: 1024px) 46vw, 92vw"
              priority
              className="hero__photo"
            />
          </div>
          <div className="hero__accent" ref={accentRef}>
            <Picture
              id="lalajor-doce-de-leite"
              alt="Lalájores de doce de leite cobertos de chocolate"
              sizes="(min-width: 1024px) 15vw, 34vw"
              priority
            />
          </div>
          <div className="hero__seal" aria-hidden="true">
            <svg viewBox="0 0 120 120" className="hero__seal-ring">
              <defs>
                <path id="seal-circle" d="M60,60 m-46,0 a46,46 0 1,1 92,0 a46,46 0 1,1 -92,0" />
              </defs>
              <text>
                <textPath href="#seal-circle">BOLOS · DOCES · SALGADOS · CAFÉ ·</textPath>
              </text>
            </svg>
            <span className="hero__seal-core">
              <LogoMark size={56} />
            </span>
          </div>
          <p className="hero__caption">Morango cravejado de maracujá</p>
        </div>
      </div>
    </section>
  );
}
