import { useMemo, useState } from 'react';
import { CATEGORIES, PRODUCTS, type CategoryId, type Product } from '../data/products';
import { useOrder } from '../lib/order';
import { ProductCard } from './ProductCard';
import { Reveal } from './Reveal';

type Filter = CategoryId | 'todos';

const FILTERS: { id: Filter; label: string }[] = [{ id: 'todos', label: 'Todos' }, ...CATEGORIES];

export function ProductCategories() {
  const [filter, setFilter] = useState<Filter>('todos');
  const { openOrder } = useOrder();

  const products = useMemo(
    () => (filter === 'todos' ? PRODUCTS : PRODUCTS.filter((p) => p.category === filter)),
    [filter],
  );
  const counts = useMemo(() => {
    const c: Record<string, number> = { todos: PRODUCTS.length };
    for (const p of PRODUCTS) c[p.category] = (c[p.category] ?? 0) + 1;
    return c;
  }, []);

  const activeLabel = FILTERS.find((f) => f.id === filter)!.label;

  return (
    <section id="cardapio" className="section menu" aria-labelledby="menu-title">
      <div className="container">
        <div className="section-head section-head--split">
          <div>
            <Reveal>
              <p className="eyebrow">Cardápio</p>
            </Reveal>
            <Reveal delay={80}>
              <h2 id="menu-title" className="section-title">
                Feito para dar <em>vontade.</em>
              </h2>
            </Reveal>
          </div>
          <Reveal delay={160}>
            <p className="section-lead">
              Uma seleção das delícias que já passaram pelas nossas vitrines. Sabores, valores e disponibilidade
              variam — consulte a loja para saber o que há hoje.
            </p>
          </Reveal>
        </div>

        <Reveal delay={120}>
          <div className="filters" role="group" aria-label="Filtrar cardápio por categoria">
            {FILTERS.map((f) => (
              <button
                key={f.id}
                type="button"
                className={`filter ${filter === f.id ? 'is-active' : ''}`}
                aria-pressed={filter === f.id}
                onClick={() => setFilter(f.id)}
              >
                {f.label}
                <span className="filter__count">{counts[f.id]}</span>
              </button>
            ))}
          </div>
        </Reveal>

        <p className="visually-hidden" aria-live="polite">
          {`${activeLabel}: ${products.length} ${products.length === 1 ? 'item' : 'itens'}`}
        </p>

        {/* `key` reinicia a animação de entrada a cada troca de filtro */}
        <ProductGrid key={filter} products={products} />

        <Reveal className="menu__footer">
          <p>Não encontrou o que procura? Fale com a loja — o cardápio do dia pode ter outras opções.</p>
          <button type="button" className="button button--ghost" onClick={() => openOrder()}>
            Falar com uma loja
          </button>
        </Reveal>
      </div>
    </section>
  );
}

/** Remontada a cada troca de filtro para reexecutar a entrada escalonada dos cards. */
function ProductGrid({ products }: { products: Product[] }) {
  return (
    <div className="product-grid">
      {products.map((p, i) => (
        <ProductCard key={p.id} product={p} index={i} />
      ))}
    </div>
  );
}
