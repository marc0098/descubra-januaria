export default function Loading() {
  return (
    <div
      role="status"
      aria-label="Carregando conteúdo"
      style={{
        minHeight: '50vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 32,
      }}
    >
      <div
        style={{
          width: 48,
          height: 48,
          border: '4px solid rgba(19, 104, 98, 0.15)',
          borderTopColor: '#136862',
          borderRadius: '50%',
          animation: 'spin 0.9s linear infinite',
        }}
      />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
