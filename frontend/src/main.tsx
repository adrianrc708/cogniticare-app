import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App'; // Importa tu componente App
import './styles/tailwind.css';

// Obtiene el elemento raíz definido en index.html
const rootElement = document.getElementById('root');

if (rootElement) {
    // Crea la raíz de React 18 y renderiza la aplicación
    ReactDOM.createRoot(rootElement).render(
        <React.StrictMode>
            <App />
        </React.StrictMode>,
    );
}