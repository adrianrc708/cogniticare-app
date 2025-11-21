import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

const translations = {
    es: {
        // General
        home: 'Inicio',
        news: 'Novedades',
        contact: 'Contactos',
        settings: 'Ajustes',
        logout: 'Salir',
        back: 'Volver',
        hello: 'Hola',
        what_to_do: '¿Qué te gustaría hacer hoy?',

        // Dashboard Cards (Paciente)
        cognitive_eval: 'Evaluación Cognitiva',
        cognitive_desc: 'Pon a prueba tu memoria hoy',
        minigames: 'Minijuegos',
        minigames_desc: 'Diviértete un rato',
        history: 'Mi Historial',
        history_desc: 'Mira tus avances',
        reminders: 'Recordatorios',
        reminders_desc: 'Medicinas y citas',
        code_label: 'Tu código de conexión',

        // Juegos
        minesweeper_title: 'Buscaminas',
        minesweeper_desc: 'Click Izq: Revelar | Click Der: Bandera (🚩)',
        memory_title: 'Memoria de Pares',
        simon_title: 'Simon Dice',
        math_title: 'Cálculo Rápido',
        win_msg: '¡Ganaste! 🎉',
        lose_msg: '¡Boom! 💥',
        play_again: 'Jugar de Nuevo',
        exit: 'Salir',

        // Recordatorios
        reminder_title: 'RECORDATORIO',
        acknowledge_btn: '✅ ENTERADO',
        past_reminder: 'PASADO / OLVIDADO',
        active_reminder: 'AHORA MISMO',
        no_reminders: 'No tienes recordatorios pendientes.',
        all_good: 'Todo al día',

        // Contacto
        contact_title: 'Contáctanos',
        subject: 'Asunto',
        message: 'Mensaje',
        send_msg: 'Enviar Mensaje',
        msg_sent: '¡Mensaje Enviado!',
        msg_sent_desc: 'Gracias por contactarnos. Te responderemos pronto.',

        // Ajustes
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
        confirm_logout: '¿Estás seguro de que deseas cerrar sesión?',

        // Cuidador / Chat
        chat_caregiver: 'Chat con Cuidador',
        no_caregivers: 'No tienes cuidadores vinculados aún.',
        caregiver_panel: 'Panel de Cuidador',
        link_new: 'Vincular Nuevo Paciente',
        link_instruction: 'Ingresa el código único del paciente para comenzar a monitorearlo.', // NUEVO
        my_patients: 'Mis Pacientes',
        link_btn: 'Vincular',
        no_patients: 'No hay pacientes vinculados.',
        status_active: 'Activo', // NUEVO
        btn_chat: 'Chat',        // NUEVO
        btn_progress: 'Progreso', // NUEVO
        btn_alerts: 'Alertas'     // NUEVO
    },
    en: {
        // General
        home: 'Home',
        news: 'News',
        contact: 'Contact',
        settings: 'Settings',
        logout: 'Logout',
        back: 'Back',
        hello: 'Hello',
        what_to_do: 'What would you like to do today?',

        // Dashboard Cards
        cognitive_eval: 'Cognitive Evaluation',
        cognitive_desc: 'Test your memory today',
        minigames: 'Minigames',
        minigames_desc: 'Have some fun',
        history: 'My History',
        history_desc: 'Check your progress',
        reminders: 'Reminders',
        reminders_desc: 'Meds and appointments',
        code_label: 'Your connection code',

        // Juegos
        minesweeper_title: 'Minesweeper',
        minesweeper_desc: 'Left Click: Reveal | Right Click: Flag (🚩)',
        memory_title: 'Memory Match',
        simon_title: 'Simon Says',
        math_title: 'Quick Math',
        win_msg: 'You Win! 🎉',
        lose_msg: 'Boom! 💥',
        play_again: 'Play Again',
        exit: 'Exit',

        // Recordatorios
        reminder_title: 'REMINDER',
        acknowledge_btn: '✅ ACKNOWLEDGE',
        past_reminder: 'MISSED / PAST',
        active_reminder: 'RIGHT NOW',
        no_reminders: 'You have no pending reminders.',
        all_good: 'All caught up',

        // Contacto
        contact_title: 'Contact Us',
        subject: 'Subject',
        message: 'Message',
        send_msg: 'Send Message',
        msg_sent: 'Message Sent!',
        msg_sent_desc: 'Thanks for contacting us. We will reply soon.',

        // Ajustes
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
        confirm_logout: 'Are you sure you want to log out?',

        // Cuidador / Chat
        chat_caregiver: 'Chat with Caregiver',
        no_caregivers: 'No linked caregivers yet.',
        caregiver_panel: 'Caregiver Panel',
        link_new: 'Link New Patient',
        link_instruction: 'Enter the unique patient code to start monitoring them.', // NUEVO
        my_patients: 'My Patients',
        link_btn: 'Link',
        no_patients: 'No linked patients.',
        status_active: 'Active', // NUEVO
        btn_chat: 'Chat',        // NUEVO
        btn_progress: 'Progress', // NUEVO
        btn_alerts: 'Alerts'      // NUEVO
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