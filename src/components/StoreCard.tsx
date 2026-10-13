import { MapPin, Navigation, Phone } from 'lucide-react';
import type { Store } from '../data/stores';
import { directionsUrl, telUrl, whatsappUrl } from '../lib/links';
import { WhatsAppIcon } from './Brand';
import { Picture } from './Picture';

export function StoreCard({ store }: { store: Store }) {
  return (
    <article className={`store-card store-card--${store.id}`} aria-labelledby={`${store.id}-title`}>
      <div className="store-card__media">
        <Picture id={store.photo} alt={store.photoAlt} sizes="(min-width: 1024px) 34vw, (min-width: 768px) 60vw, 92vw" />
        <div className="store-card__inset">
          <Picture id={store.interior} alt={store.interiorAlt} sizes="(min-width: 1024px) 10vw, 28vw" />
        </div>
      </div>

      <div className="store-card__body">
        <h3 id={`${store.id}-title`} className="store-card__title">
          {store.shortName}
          <span className="store-card__brand">Lays Andrade Bolos &amp; Delícias</span>
        </h3>

        <dl className="store-card__info">
          <div>
            <dt>
              <MapPin size={16} strokeWidth={1.6} aria-hidden="true" />
              <span className="visually-hidden">Endereço</span>
            </dt>
            <dd>
              {store.street}
              {store.city && (
                <>
                  <br />
                  {store.city}
                </>
              )}
            </dd>
          </div>
          <div>
            <dt>
              <Phone size={16} strokeWidth={1.6} aria-hidden="true" />
              <span className="visually-hidden">Telefone</span>
            </dt>
            <dd>
              <a href={telUrl(store)}>{store.phoneDisplay}</a>
            </dd>
          </div>
        </dl>

        <div className="store-card__actions">
          <a className="button button--primary" href={whatsappUrl(store)} target="_blank" rel="noopener noreferrer">
            <WhatsAppIcon size={18} />
            Falar pelo WhatsApp
            <span className="visually-hidden"> com a {store.shortName} (abre em nova aba)</span>
          </a>
          <a className="button button--ghost" href={directionsUrl(store)} target="_blank" rel="noopener noreferrer">
            <Navigation size={17} strokeWidth={1.7} aria-hidden="true" />
            Como chegar
            <span className="visually-hidden"> à {store.shortName} (abre o Google Maps)</span>
          </a>
        </div>
      </div>
    </article>
  );
}
