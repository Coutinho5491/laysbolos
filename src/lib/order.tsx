import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import { OrderDialog } from '../components/OrderDialog';

interface OrderContextValue {
  /** Abre a escolha de unidade. Com `product`, a mensagem do WhatsApp cita o produto. */
  openOrder: (product?: string) => void;
}

const OrderContext = createContext<OrderContextValue | null>(null);

export function OrderProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [product, setProduct] = useState<string | undefined>();

  const openOrder = useCallback((p?: string) => {
    setProduct(p);
    setOpen(true);
  }, []);
  const value = useMemo(() => ({ openOrder }), [openOrder]);

  return (
    <OrderContext.Provider value={value}>
      {children}
      <OrderDialog open={open} product={product} onClose={() => setOpen(false)} />
    </OrderContext.Provider>
  );
}

export function useOrder() {
  const ctx = useContext(OrderContext);
  if (!ctx) throw new Error('useOrder precisa estar dentro de <OrderProvider>');
  return ctx;
}
