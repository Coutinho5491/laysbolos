import type { MouseEvent } from 'react';
import { BRAND, NAV_ITEMS } from '../data/site';
import { STORES } from '../data/stores';
import { telUrl, whatsappUrl } from '../lib/links';
import { scrollToSection } from '../lib/motion';
import { InstagramIcon, LogoMark, WhatsAppIcon } from './Brand';

export function Footer() {
  const year = new Date().getFullYear();
  const go = (e: MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    scrollToSection(id);
  };

  return (
    <footer className="footer">
      <div className="container footer__grid">
        <div className="footer__brand">
          <LogoMark size={64} />
          <p className="footer__name">
            Lays Andrade <em>Bolos &amp; Delícias</em>
          </p>
          <p className="footer__tagline">Doces, salgados, café e experiências que fazem parte da sua história.</p>
          <a className="footer__social" href={BRAND.instagramUrl} target="_blank" rel="noopener noreferrer">
            <InstagramIcon size={18} />
            {BRAND.instagramHandle}
            <span className="visually-hidden"> no Instagram (abre em nova aba)</span>
          </a>
        </div>

        <nav className="footer__nav" aria-label="Rodapé">
          <h2 className="footer__heading">Navegue</h2>
          <ul>
            {NAV_ITEMS.map((n) => (
              <li key={n.id}>
                <a href={`#${n.id}`} onClick={(e) => go(e, n.id)}>
                  {n.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {STORES.map((s) => (
          <address className="footer__store" key={s.id}>
            <h2 className="footer__heading">{s.shortName}</h2>
            <p>
              {s.street}
              {s.city && (
                <>
                  <br />
                  {s.city}
                </>
              )}
            </p>
            <a href={telUrl(s)}>{s.phoneDisplay}</a>
            <a className="footer__wa" href={whatsappUrl(s)} target="_blank" rel="noopener noreferrer">
              <WhatsAppIcon size={15} /> WhatsApp
              <span className="visually-hidden"> da {s.shortName} (abre em nova aba)</span>
            </a>
          </address>
        ))}
      </div>

      <div className="container footer__bottom">
        <p>
          © {year} {BRAND.name}. Todos os direitos reservados.
        </p>
        <p>Vinhedo e região</p>
      </div>
    </footer>
  );
}
