import type { CSSProperties, MouseEvent } from 'react';
import { X } from 'lucide-react';
import { BRAND, NAV_ITEMS, type SectionId } from '../data/site';
import { STORES } from '../data/stores';
import { useDialog } from '../hooks/useDialog';
import { telUrl } from '../lib/links';
import { scrollToSection } from '../lib/motion';
import { useOrder } from '../lib/order';
import { InstagramIcon, LogoMark, Wordmark } from './Brand';

interface MobileMenuProps {
  open: boolean;
  active: SectionId;
  onClose: () => void;
}

export function MobileMenu({ open, active, onClose }: MobileMenuProps) {
  const { ref, requestClose } = useDialog(open, onClose);
  const { openOrder } = useOrder();

  const go = (e: MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    requestClose();
    // Aguarda o início do fechamento para liberar o scroll antes de navegar
    window.setTimeout(() => scrollToSection(id), 280);
  };

  return (
    <dialog ref={ref} className="dialog mobile-menu" aria-label="Menu">
      <div className="mobile-menu__panel">
        <div className="mobile-menu__top">
          <span className="header__brand">
            <LogoMark size={40} />
            <Wordmark inverted />
          </span>
          <button type="button" className="icon-button icon-button--light" onClick={requestClose} aria-label="Fechar menu">
            <X size={24} strokeWidth={1.6} aria-hidden="true" />
          </button>
        </div>

        <nav aria-label="Navegação principal (celular)">
          <ol className="mobile-menu__list">
            {NAV_ITEMS.map((item, i) => (
              <li key={item.id} style={{ '--i': i } as CSSProperties}>
                <a
                  href={`#${item.id}`}
                  className={active === item.id ? 'is-active' : ''}
                  aria-current={active === item.id ? 'location' : undefined}
                  onClick={(e) => go(e, item.id)}
                >
                  <span className="mobile-menu__index" aria-hidden="true">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  {item.label}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <div className="mobile-menu__footer">
          <button
            type="button"
            className="button button--light button--block"
            onClick={() => {
              requestClose();
              window.setTimeout(() => openOrder(), 280);
            }}
          >
            Faça seu pedido
          </button>
          <div className="mobile-menu__contacts">
            {STORES.map((s) => (
              <a key={s.id} href={telUrl(s)}>
                <strong>{s.shortName}</strong> {s.phoneDisplay}
              </a>
            ))}
            <a href={BRAND.instagramUrl} target="_blank" rel="noopener noreferrer">
              <InstagramIcon size={16} /> {BRAND.instagramHandle}
            </a>
          </div>
        </div>
      </div>
    </dialog>
  );
}
