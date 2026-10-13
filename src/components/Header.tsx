import { useState, type MouseEvent } from 'react';
import { Menu } from 'lucide-react';
import { NAV_ITEMS } from '../data/site';
import { useActiveSection, useScrolledPast } from '../hooks/useScrollState';
import { scrollToSection } from '../lib/motion';
import { useOrder } from '../lib/order';
import { LogoMark, Wordmark } from './Brand';
import { MobileMenu } from './MobileMenu';

export function Header() {
  const scrolled = useScrolledPast(24);
  const active = useActiveSection();
  const { openOrder } = useOrder();
  const [menuOpen, setMenuOpen] = useState(false);

  const go = (e: MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    scrollToSection(id);
  };

  return (
    <>
      <header className={`header ${scrolled ? 'is-scrolled' : ''}`}>
        <div className="header__inner container">
          <a className="header__brand" href="#inicio" onClick={(e) => go(e, 'inicio')} aria-label="Lays Andrade Bolos & Delícias — início">
            <LogoMark size={44} />
            <Wordmark />
          </a>

          <nav className="header__nav" aria-label="Navegação principal">
            <ul>
              {NAV_ITEMS.filter((n) => n.id !== 'inicio').map((item) => (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    className={`nav-link ${active === item.id ? 'is-active' : ''}`}
                    aria-current={active === item.id ? 'location' : undefined}
                    onClick={(e) => go(e, item.id)}
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="header__actions">
            <button type="button" className="button button--primary button--sm header__cta" onClick={() => openOrder()}>
              Faça seu pedido
            </button>
            <button
              type="button"
              className="icon-button header__menu-toggle"
              aria-label="Abrir menu"
              aria-haspopup="dialog"
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen(true)}
            >
              <Menu size={22} strokeWidth={1.6} aria-hidden="true" />
            </button>
          </div>
        </div>
      </header>
      <MobileMenu open={menuOpen} active={active} onClose={() => setMenuOpen(false)} />
    </>
  );
}
