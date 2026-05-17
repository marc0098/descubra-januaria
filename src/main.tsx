import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import '@/styles/index.css'; // Importação do CSS global reorganizado

/**
 * Ponto de entrada principal da aplicação.
 * Inicializa o React e renderiza o componente App dentro do StrictMode para detectar problemas potenciais.
 */
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
