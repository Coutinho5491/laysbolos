import type { CSSProperties, ElementType, ReactNode } from 'react';
import { useReveal } from '../hooks/useReveal';

interface RevealProps {
  as?: ElementType;
  children: ReactNode;
  className?: string;
  /** Atraso em milissegundos — útil para entradas escalonadas */
  delay?: number;
  variant?: 'up' | 'fade' | 'image';
  id?: string;
}

export function Reveal({ as: Tag = 'div', children, className = '', delay = 0, variant = 'up', id }: RevealProps) {
  const ref = useReveal<HTMLElement>();
  return (
    <Tag
      ref={ref}
      id={id}
      className={`reveal reveal--${variant} ${className}`}
      style={delay ? ({ '--reveal-delay': `${delay}ms` } as CSSProperties) : undefined}
    >
      {children}
    </Tag>
  );
}
