import { useOrder } from '../lib/order';
import { Picture } from './Picture';
import { Reveal } from './Reveal';
import type { ImageId } from '../data/images';

const LAYERS: { image: ImageId; name: string; alt: string }[] = [
  {
    image: 'nevado-brigadeiro-branco',
    name: 'Brigadeiro branco cremoso',
    alt: 'Brigadeiro branco cremoso em tigela de cerâmica, com a legenda “Brigadeiro branco cremoso”',
  },
  {
    image: 'nevado-creme-ninho',
    name: 'Dupla camada de creme de Ninho',
    alt: 'Creme de Ninho em pequena jarra de vidro, com a legenda “Dupla camada de creme de Ninho”',
  },
  {
    image: 'nevado-geleia-morango',
    name: 'Geleia artesanal de morango',
    alt: 'Geleia artesanal de morango em pote de vidro em forma de coração, com a legenda “Geleia artesanal de morango”',
  },
];

/** Destaque editorial do Nevado Cremoso, montado com as fotos de cada camada enviadas pelo cliente. */
export function Signature() {
  const { openOrder } = useOrder();

  return (
    <section className="section signature" aria-labelledby="signature-title">
      <div className="container signature__grid">
        <div className="signature__intro">
          <Reveal>
            <p className="eyebrow eyebrow--light">Em camadas</p>
          </Reveal>
          <Reveal delay={80}>
            <h2 id="signature-title" className="section-title section-title--light">
              Nevado <em>Cremoso</em>
            </h2>
          </Reveal>
          <Reveal delay={160}>
            <p className="section-lead section-lead--light">
              Três camadas que se encontram em cada colherada. Conheça o que vai dentro do pote.
            </p>
          </Reveal>
          <Reveal delay={240}>
            <button type="button" className="button button--light" onClick={() => openOrder('Nevado Cremoso')}>
              Consultar disponibilidade
            </button>
          </Reveal>
        </div>

        <Reveal variant="image" className="signature__hero">
          <Picture
            id="nevado-cremoso"
            alt="Pote de Nevado Cremoso com rótulo azul-marinho e dourado da Lays Andrade, e colher com creme e geleia"
            sizes="(min-width: 1024px) 30vw, 92vw"
          />
        </Reveal>

        <ol className="signature__layers">
          {LAYERS.map((layer, i) => (
            <Reveal as="li" key={layer.image} delay={i * 120} className="layer">
              <div className="layer__media">
                <Picture id={layer.image} alt={layer.alt} sizes="(min-width: 1024px) 14vw, 30vw" />
              </div>
              <p className="layer__name">
                <span aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
                {layer.name}
              </p>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
