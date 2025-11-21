import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Diccionario de traducciones
const translations = {
    es: {
        home: 'Inicio',
        news: 'Novedades',
        contact: 'Contactos',
        settings: 'Ajustes',
        logout: 'Salir',
        hello: 'Hola',
        what_to_do: '¿Qué te gustaría hacer hoy?',
        cognitive_eval: 'Evaluación Cognitiva',
        cognitive_desc: 'Pon a prueba tu memoria hoy',
        minigames: 'Minijuegos',
        minigames_desc: 'Diviértete un rato',
        history: 'Mi Historial',
        history_desc: 'Mira tus avances',
        reminders: 'Recordatorios',
        reminders_desc: 'Medicinas y citas',
        code_label: 'Tu código de conexión',
        settings_title: 'Ajustes',
        account_info: 'Información de Cuenta',
        name: 'Nombre',
        email: 'Correo',
        role: 'Rol',
        dark_mode: 'Modo Oscuro',
        dark_mode_desc: 'Cambia la apariencia para descansar la vista',
        language: 'Idioma',
        language_desc: 'Selecciona el idioma de la interfaz',
        session: 'Sesión',
        logout_full: 'Cerrar Sesión en este dispositivo',
        back: 'Volver',
        reminder_title: 'RECORDATORIO',
        acknowledge_btn: '✅ ENTERADO',
        past_reminder: 'PASADO / OLVIDADO',
        active_reminder: 'AHORA MISMO',
        minesweeper_title: 'Buscaminas',
        minesweeper_desc: 'Click Izq: Revelar | Click Der: Bandera (🚩)',
        win_msg: '¡Ganaste! 🎉',
        lose_msg: '¡Boom! 💥',
        play_again: 'Jugar de Nuevo',
        exit: 'Salir'
    },
    en: {
        home: 'Home',
        news: 'News',
        contact: 'Contact',
        settings: 'Settings',
        logout: 'Logout',
        hello: 'Hello',
        what_to_do: 'What would you like to do today?',
        cognitive_eval: 'Cognitive Evaluation',
        cognitive_desc: 'Test your memory today',
        minigames: 'Minigames',
        minigames_desc: 'Have some fun',
        history: 'My History',
        history_desc: 'Check your progress',
        reminders: 'Reminders',
        reminders_desc: 'Meds and appointments',
        code_label: 'Your connection code',
        settings_title: 'Settings',
        account_info: 'Account Information',
        name: 'Name',
        email: 'Email',
        role: 'Role',
        dark_mode: 'Dark Mode',
        dark_mode_desc: 'Change appearance to rest your eyes',
        language: 'Language',
        language_desc: 'Select interface language',
        session: 'Session',
        logout_full: 'Log out of this device',
        back: 'Back',
        reminder_title: 'REMINDER',
        acknowledge_btn: '✅ ACKNOWLEDGE',
        past_reminder: 'MISSED / PAST',
        active_reminder: 'RIGHT NOW',
        minesweeper_title: 'Minesweeper',
        minesweeper_desc: 'Left Click: Reveal | Right Click: Flag (🚩)',
        win_msg: 'You Win! 🎉',
        lose_msg: 'Boom! 💥',
        play_again: 'Play Again',
        exit: 'Exit'
    }
};

interface ThemeContextType {
    darkMode: boolean;
    toggleDarkMode: () => void;
    language: 'es' | 'en';
    setLanguage: (lang: 'es' | 'en') => void;
    t: (key: keyof typeof translations['es']) => string;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [darkMode, setDarkMode] = useState(() => {
        const saved = localStorage.getItem('darkMode');
        return saved ? JSON.parse(saved) : false;
    });

    const [language, setLanguage] = useState<'es' | 'en'>('es');

    useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
        localStorage.setItem('darkMode', JSON.stringify(darkMode));
    }, [darkMode]);

    const toggleDarkMode = () => setDarkMode(!darkMode);

    // Función helper para traducir
    const t = (key: keyof typeof translations['es']) => {
        return translations[language][key] || key;
    };

    return (
        <ThemeContext.Provider value={{ darkMode, toggleDarkMode, language, setLanguage, t }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};