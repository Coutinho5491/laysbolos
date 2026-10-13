import { About } from './components/About';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';
import { Gallery } from './components/Gallery';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { ProductCategories } from './components/ProductCategories';
import { ScrollProgress } from './components/ScrollProgress';
import { Signature } from './components/Signature';
import { StoreLocations } from './components/StoreLocations';
import { WhatsAppButton } from './components/WhatsAppButton';
import { OrderProvider } from './lib/order';

export default function App() {
  return (
    <OrderProvider>
      <a className="skip-link" href="#conteudo">
        Pular para o conteúdo
      </a>
      <ScrollProgress />
      <Header />
      <main id="conteudo" tabIndex={-1}>
        <Hero />
        <About />
        <ProductCategories />
        <Signature />
        <Gallery />
        <StoreLocations />
        <Contact />
      </main>
      <Footer />
      <WhatsAppButton />
    </OrderProvider>
  );
}
