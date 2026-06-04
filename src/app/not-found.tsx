import Link from 'next/link';
import { Mountain, MapPin, Compass } from 'lucide-react';

export default function NotFound() {
  return (
    <main className="min-h-screen bg-background flex items-center justify-center px-4 py-16">
      <div className="max-w-2xl w-full text-center">
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
            <Compass className="w-10 h-10 text-primary" aria-hidden="true" />
          </div>
        </div>

        <h1 className="font-headline text-6xl md:text-7xl font-bold text-primary mb-4">
          404
        </h1>
        <h2 className="font-headline text-2xl md:text-3xl font-bold text-on-surface uppercase mb-4">
          Página não encontrada
        </h2>
        <p className="font-sans text-on-surface-variant text-base md:text-lg mb-8 max-w-md mx-auto">
          Parece que você se perdeu nas trilhas do Vale do Peruaçu. A página que
          você procura não existe ou foi movida.
        </p>

        <nav aria-label="Navegação principal" className="flex flex-col sm:flex-row gap-3 justify-center mb-10">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 bg-primary text-white px-6 py-3 rounded-full font-sans text-sm font-bold uppercase tracking-wider hover:bg-primary/90 transition"
          >
            <Mountain className="w-4 h-4" aria-hidden="true" />
            Voltar ao Início
          </Link>
          <Link
            href="/cavernas"
            className="inline-flex items-center justify-center gap-2 bg-surface border border-outline-variant/30 text-on-surface px-6 py-3 rounded-full font-sans text-sm font-bold uppercase tracking-wider hover:bg-surface-container transition"
          >
            Explorar Cavernas
          </Link>
        </nav>

        <div className="border-t border-outline-variant/20 pt-6">
          <p className="font-sans text-xs text-on-surface-variant uppercase tracking-wider mb-3">
            Ou visite uma de nossas seções:
          </p>
          <ul className="flex flex-wrap justify-center gap-x-5 gap-y-2 font-sans text-sm">
            <li><Link href="/pontos" className="text-primary hover:underline">Pontos Turísticos</Link></li>
            <li><Link href="/guias" className="text-primary hover:underline">Guias</Link></li>
            <li><Link href="/estadias" className="text-primary hover:underline">Hospedagem</Link></li>
            <li><Link href="/gastronomia" className="text-primary hover:underline">Gastronomia</Link></li>
            <li><Link href="/eventos" className="text-primary hover:underline">Eventos</Link></li>
          </ul>
        </div>

        <div className="mt-8 flex items-center justify-center gap-2 text-xs text-on-surface-variant/70">
          <MapPin className="w-3 h-3" aria-hidden="true" />
          <span>Januária, Norte de Minas Gerais</span>
        </div>
      </div>
    </main>
  );
}
