import { STORES } from '../data/stores';
import { Reveal } from './Reveal';
import { StoreCard } from './StoreCard';

export function StoreLocations() {
  return (
    <section id="lojas" className="section stores" aria-labelledby="stores-title">
      <div className="container">
        <div className="section-head section-head--center">
          <Reveal>
            <p className="eyebrow">Nossas lojas</p>
          </Reveal>
          <Reveal delay={80}>
            <h2 id="stores-title" className="section-title">
              Duas casas, <em>o mesmo carinho.</em>
            </h2>
          </Reveal>
          <Reveal delay={160}>
            <p className="section-lead">
              Escolha a unidade mais perto de você para conversar pelo WhatsApp, ligar ou traçar a rota.
            </p>
          </Reveal>
        </div>

        <div className="stores__grid">
          {STORES.map((store, i) => (
            <Reveal key={store.id} delay={i * 140} className="stores__item">
              <StoreCard store={store} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
