import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/tailwind.css';
import { ThemeProvider } from './context/ThemeContext'; // Importar

const rootElement = document.getElementById('root');

if (rootElement) {
    ReactDOM.createRoot(rootElement).render(
        <React.StrictMode>
            {/* Envolver la App con el Proveedor de Tema */}
            <ThemeProvider>
                <App />
            </ThemeProvider>
        </React.StrictMode>,
    );
}