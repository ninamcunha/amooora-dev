import { createRoot } from "react-dom/client";
import App from "./app/App.tsx";
import "./styles/index.css";

// Tratamento de erros globais mais robusto
window.addEventListener('error', (event) => {
  console.error('❌ Erro global capturado:', event.error);
  const root = document.getElementById('root');
  if (root) {
    root.innerHTML = `
      <div style="padding: 20px; font-family: sans-serif; background: #fff; min-height: 100vh;">
        <h1 style="color: red; font-size: 24px; margin-bottom: 20px;">❌ Erro ao carregar a aplicação</h1>
        <div style="background: #f5f5f5; padding: 15px; border-radius: 8px; margin-bottom: 15px;">
          <p><strong>Erro:</strong> ${event.error?.message || event.message || 'Erro desconhecido'}</p>
          <p><strong>Arquivo:</strong> ${event.filename || 'N/A'}</p>
          <p><strong>Linha:</strong> ${event.lineno || 'N/A'}</p>
        </div>
        <details style="margin-top: 15px;">
          <summary style="cursor: pointer; font-weight: bold; margin-bottom: 10px;">Stack Trace</summary>
          <pre style="background: #f5f5f5; padding: 10px; overflow: auto; border-radius: 4px; font-size: 12px;">${event.error?.stack || 'Sem stack trace disponível'}</pre>
        </details>
      </div>
    `;
  }
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('❌ Promise rejeitada não tratada:', event.reason);
  const root = document.getElementById('root');
  if (root && !root.innerHTML.includes('Erro')) {
    root.innerHTML = `
      <div style="padding: 20px; font-family: sans-serif; background: #fff; min-height: 100vh;">
        <h1 style="color: red; font-size: 24px; margin-bottom: 20px;">❌ Erro: Promise Rejeitada</h1>
        <div style="background: #f5f5f5; padding: 15px; border-radius: 8px;">
          <p><strong>Erro:</strong> ${event.reason?.message || String(event.reason) || 'Erro desconhecido'}</p>
          <pre style="background: #fff; padding: 10px; overflow: auto; border-radius: 4px; font-size: 12px; margin-top: 10px;">${event.reason?.stack || 'Sem stack trace disponível'}</pre>
        </div>
      </div>
    `;
  }
});

// Verificar se o root existe antes de tentar renderizar
const rootElement = document.getElementById("root");
if (!rootElement) {
  document.body.innerHTML = `
    <div style="padding: 20px; font-family: sans-serif;">
      <h1 style="color: red;">❌ Erro: Elemento root não encontrado</h1>
      <p>O elemento com id "root" não foi encontrado no DOM.</p>
    </div>
  `;
} else {
  try {
    console.log('🚀 Inicializando aplicação...');
    const root = createRoot(rootElement);
    root.render(<App />);
    console.log('✅ Aplicação renderizada com sucesso');
  } catch (error) {
    console.error('❌ Erro ao inicializar aplicação:', error);
    rootElement.innerHTML = `
      <div style="padding: 20px; font-family: sans-serif; background: #fff; min-height: 100vh;">
        <h1 style="color: red; font-size: 24px; margin-bottom: 20px;">❌ Erro ao inicializar a aplicação</h1>
        <div style="background: #f5f5f5; padding: 15px; border-radius: 8px; margin-bottom: 15px;">
          <p><strong>Erro:</strong> ${error instanceof Error ? error.message : String(error)}</p>
        </div>
        <details style="margin-top: 15px;">
          <summary style="cursor: pointer; font-weight: bold; margin-bottom: 10px;">Stack Trace</summary>
          <pre style="background: #f5f5f5; padding: 10px; overflow: auto; border-radius: 4px; font-size: 12px;">${error instanceof Error ? error.stack : 'Sem stack trace disponível'}</pre>
        </details>
      </div>
    `;
  }
}