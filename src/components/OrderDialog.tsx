import { ArrowUpRight, MapPin, X } from 'lucide-react';
import { STORES } from '../data/stores';
import { useDialog } from '../hooks/useDialog';
import { productMessage, whatsappUrl } from '../lib/links';
import { WhatsAppIcon } from './Brand';

interface OrderDialogProps {
  open: boolean;
  product?: string;
  onClose: () => void;
}

export function OrderDialog({ open, product, onClose }: OrderDialogProps) {
  const { ref, requestClose } = useDialog(open, onClose);

  return (
    <dialog ref={ref} className="dialog order-dialog" aria-labelledby="order-title" aria-describedby="order-desc">
      <div className="dialog__panel">
        <button type="button" className="icon-button dialog__close" onClick={requestClose} aria-label="Fechar">
          <X size={20} strokeWidth={1.6} aria-hidden="true" />
        </button>

        <p className="eyebrow">Pedidos pelo WhatsApp</p>
        <h2 id="order-title" className="dialog__title">
          {product ? (
            <>
              Consultar <em>{product}</em>
            </>
          ) : (
            <>
              Escolha a <em>sua loja</em>
            </>
          )}
        </h2>
        <p id="order-desc" className="dialog__lead">
          Selecione a unidade. A conversa abre no WhatsApp com uma mensagem pronta — é só revisar e tocar em enviar.
        </p>

        <ul className="order-dialog__stores">
          {STORES.map((store) => (
            <li key={store.id}>
              <a
                className="store-choice"
                href={whatsappUrl(store, product ? productMessage(store, product) : store.greeting)}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => requestClose()}
              >
                <span className="store-choice__icon">
                  <WhatsAppIcon size={20} />
                </span>
                <span className="store-choice__body">
                  <span className="store-choice__name">{store.shortName}</span>
                  <span className="store-choice__meta">
                    <MapPin size={14} strokeWidth={1.6} aria-hidden="true" />
                    {store.street}
                    {store.city ? ` · ${store.city}` : ''}
                  </span>
                  <span className="store-choice__meta">{store.phoneDisplay}</span>
                </span>
                <ArrowUpRight className="store-choice__arrow" size={20} strokeWidth={1.6} aria-hidden="true" />
                <span className="visually-hidden">(abre o WhatsApp em uma nova aba)</span>
              </a>
            </li>
          ))}
        </ul>
        <p className="dialog__note">Disponibilidade, valores e prazos são confirmados diretamente pela loja.</p>
      </div>
    </dialog>
  );
}
