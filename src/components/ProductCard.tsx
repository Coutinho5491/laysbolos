import type { CSSProperties } from 'react';
import { ArrowUpRight } from 'lucide-react';
import type { Product } from '../data/products';
import { useReveal } from '../hooks/useReveal';
import { useOrder } from '../lib/order';
import { Picture } from './Picture';

export function ProductCard({ product, index }: { product: Product; index: number }) {
  const { openOrder } = useOrder();
  const ref = useReveal<HTMLElement>();

  return (
    <article
      ref={ref}
      className="product-card-wrap reveal reveal--up"
      // Escalona por posição na linha (até 4 colunas)
      style={{ '--reveal-delay': `${(index % 4) * 80}ms` } as CSSProperties}
    >
      <div className="product-card">
      <div className="product-card__media">
        <Picture
          id={product.image}
          alt={product.alt}
          sizes="(min-width: 1200px) 22vw, (min-width: 768px) 30vw, (min-width: 520px) 46vw, 92vw"
        />
        {product.season && <span className="product-card__badge">{product.season}</span>}
      </div>
      <div className="product-card__body">
        <h3 className="product-card__name">{product.name}</h3>
        {product.description && <p className="product-card__desc">{product.description}</p>}
        <button
          type="button"
          className="product-card__cta"
          onClick={() => openOrder(product.name)}
          aria-label={`Consulte as opções de ${product.name}`}
        >
          Consulte as opções
          <ArrowUpRight size={16} strokeWidth={1.8} aria-hidden="true" />
        </button>
      </div>
      </div>
    </article>
  );
}
