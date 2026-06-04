'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('[App Error]', error);
  }, [error]);

  return (
    <main className="min-h-screen bg-background flex items-center justify-center px-4 py-16">
      <div className="max-w-2xl w-full text-center">
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 rounded-full bg-secondary/10 flex items-center justify-center">
            <AlertTriangle className="w-10 h-10 text-secondary" aria-hidden="true" />
          </div>
        </div>

        <h1 className="font-headline text-2xl md:text-3xl font-bold text-on-surface uppercase mb-4">
          Algo deu errado
        </h1>
        <p className="font-sans text-on-surface-variant text-base md:text-lg mb-8 max-w-md mx-auto">
          Encontramos um problema ao carregar esta página. Tente novamente em alguns instantes.
        </p>

        {error.digest && (
          <p className="font-mono text-xs text-on-surface-variant/60 mb-6">
            Código do erro: {error.digest}
          </p>
        )}

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={reset}
            className="inline-flex items-center justify-center gap-2 bg-primary text-white px-6 py-3 rounded-full font-sans text-sm font-bold uppercase tracking-wider hover:bg-primary/90 transition"
          >
            <RefreshCw className="w-4 h-4" aria-hidden="true" />
            Tentar Novamente
          </button>
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 bg-surface border border-outline-variant/30 text-on-surface px-6 py-3 rounded-full font-sans text-sm font-bold uppercase tracking-wider hover:bg-surface-container transition"
          >
            <Home className="w-4 h-4" aria-hidden="true" />
            Página Inicial
          </Link>
        </div>
      </div>
    </main>
  );
}
