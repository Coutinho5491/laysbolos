import { useParallax } from '../hooks/useParallax';
import { Picture } from './Picture';
import { Reveal } from './Reveal';

const MOMENTS = [
  { title: 'Doces', text: 'Para adoçar o dia, presentear ou celebrar.' },
  { title: 'Salgados e pães', text: 'Para o lanche, o café da tarde e a mesa da família.' },
  { title: 'Café', text: 'Para encontros sem pressa, nas nossas duas lojas.' },
];

export function About() {
  const parallaxRef = useParallax<HTMLDivElement>(0.07);

  return (
    <section id="historia" className="section about" aria-labelledby="about-title">
      <div className="container about__grid">
        <div className="about__media">
          <Reveal variant="image" className="about__main">
            <div className="about__parallax" ref={parallaxRef}>
              <Picture
                id="interior-loja-2"
                alt="Salão da Loja 2, com painéis em arco, arandelas acesas e mesas de madeira"
                sizes="(min-width: 1024px) 40vw, 92vw"
              />
            </div>
          </Reveal>
          <Reveal variant="image" delay={150} className="about__detail">
            <Picture
              id="morango-cravejado-preparo"
              alt="Bancada com morangos sobre porções de massa de maracujá, em preparo"
              sizes="(min-width: 1024px) 18vw, 44vw"
            />
          </Reveal>
        </div>

        <div className="about__content">
          <Reveal>
            <p className="eyebrow">Nossa história</p>
          </Reveal>
          <Reveal delay={80}>
            <h2 id="about-title" className="section-title">
              Mais do que delícias. <em>Momentos para compartilhar.</em>
            </h2>
          </Reveal>
          <Reveal delay={160}>
            <p className="section-lead">
              Dos encontros do dia a dia às ocasiões especiais, a Lays Andrade reúne doces, salgados e café para
              acompanhar diferentes momentos da sua história.
            </p>
          </Reveal>
          {/* Espaço reservado: história da marca, fundadora e trajetória serão incluídas quando o cliente enviar. */}
          <ul className="about__moments">
            {MOMENTS.map((m, i) => (
              <Reveal as="li" key={m.title} delay={220 + i * 90}>
                <span className="about__moment-index" aria-hidden="true">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div>
                  <h3>{m.title}</h3>
                  <p>{m.text}</p>
                </div>
              </Reveal>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
