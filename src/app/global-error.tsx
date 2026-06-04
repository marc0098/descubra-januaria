'use client';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="pt-BR">
      <body
        style={{
          margin: 0,
          fontFamily: 'system-ui, -apple-system, sans-serif',
          backgroundColor: '#F3ECE2',
          color: '#1E1E1E',
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 16,
        }}
      >
        <div style={{ maxWidth: 480, width: '100%', textAlign: 'center' }}>
          <h1 style={{ fontSize: 32, fontWeight: 900, color: '#136862', margin: '0 0 16px' }}>
            Erro Crítico
          </h1>
          <p style={{ fontSize: 16, color: '#4A4A4A', margin: '0 0 24px', lineHeight: 1.5 }}>
            Ocorreu um erro inesperado. Por favor, recarregue a página.
          </p>
          {error.digest && (
            <p style={{ fontSize: 12, color: '#9babb0', margin: '0 0 24px', fontFamily: 'monospace' }}>
              {error.digest}
            </p>
          )}
          <button
            onClick={reset}
            style={{
              backgroundColor: '#136862',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: 999,
              fontSize: 14,
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: 1,
              cursor: 'pointer',
            }}
          >
            Tentar Novamente
          </button>
        </div>
      </body>
    </html>
  );
}
