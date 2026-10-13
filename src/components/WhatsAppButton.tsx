import { useEffect, useId, useRef, useState } from 'react';
import { ArrowUpRight, X } from 'lucide-react';
import { STORES } from '../data/stores';
import { useScrolledPast } from '../hooks/useScrollState';
import { whatsappUrl } from '../lib/links';
import { WhatsAppIcon } from './Brand';

/** Botão flutuante com acesso às duas unidades. Aparece após o hero para não competir com as chamadas principais. */
export function WhatsAppButton() {
  const visible = useScrolledPast(520);
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const menuId = useId();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };
    const onPointer = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('pointerdown', onPointer);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('pointerdown', onPointer);
    };
  }, [open]);

  useEffect(() => {
    if (!visible) setOpen(false);
  }, [visible]);

  return (
    <div ref={rootRef} className={`wa-float ${visible ? 'is-visible' : ''} ${open ? 'is-open' : ''}`} inert={!visible}>
      <div id={menuId} className="wa-float__menu" role="group" aria-label="Escolha a loja" hidden={!open}>
        <p className="wa-float__title">Falar pelo WhatsApp com a…</p>
        {STORES.map((s) => (
          <a
            key={s.id}
            href={whatsappUrl(s)}
            target="_blank"
            rel="noopener noreferrer"
            className="wa-float__option"
            onClick={() => setOpen(false)}
          >
            <span>
              <strong>{s.shortName}</strong>
              <small>{s.street}</small>
            </span>
            <ArrowUpRight size={18} strokeWidth={1.7} aria-hidden="true" />
          </a>
        ))}
      </div>
      <button
        ref={toggleRef}
        type="button"
        className="wa-float__toggle"
        aria-expanded={open}
        aria-controls={menuId}
        aria-label={open ? 'Fechar opções de WhatsApp' : 'Falar pelo WhatsApp'}
        onClick={() => setOpen((o) => !o)}
      >
        {open ? <X size={24} strokeWidth={1.8} aria-hidden="true" /> : <WhatsAppIcon size={26} />}
      </button>
    </div>
  );
}
