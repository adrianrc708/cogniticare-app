import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

const translations = {
    es: {
        // ... (Claves anteriores: home, news, etc.)
        home: 'Inicio',
        news: 'Novedades',
        contact: 'Contactos',
        settings: 'Ajustes',
        logout: 'Salir',
        back: 'Volver',
        hello: 'Hola',
        what_to_do: '¿Qué te gustaría hacer hoy?',

        // Botones Genéricos
        cancel_btn: 'Cancelar',
        confirm_btn: 'Confirmar',
        delete_btn: 'Eliminar',
        understand_btn: 'Entendido',
        btn_accept: 'Aceptar',

        // Dashboard Cards
        cognitive_eval: 'Evaluación Cognitiva',
        cognitive_desc: 'Pon a prueba tu memoria hoy',
        minigames: 'Minijuegos',
        minigames_desc: 'Diviértete un rato',
        history: 'Mi Historial',
        history_desc: 'Mira tus avances',
        reminders: 'Recordatorios',
        reminders_desc: 'Medicinas y citas',
        code_label: 'Tu código de conexión',

        // Login & Register
        login_welcome: 'Bienvenido',
        login_subtitle: 'Ingresa para continuar',
        login_email: 'Correo Electrónico',
        login_pass: 'Contraseña',
        login_btn: 'Ingresar',
        login_loading: 'Entrando...',
        login_no_account: '¿No tienes cuenta?',
        login_register_link: 'Regístrate',

        reg_title: 'Crear Cuenta',
        reg_subtitle: 'Selecciona tu perfil',
        role_patient: 'Paciente',
        role_caregiver: 'Cuidador',
        reg_name: 'Nombre Completo',
        reg_code_ph: 'Código de Paciente (Opcional)',
        reg_btn: 'Registrarse',
        reg_loading: 'Creando...',
        reg_has_account: '¿Ya tienes cuenta?',
        reg_login_link: 'Inicia Sesión',
        err_generic: 'Ocurrió un error',

        // Juegos
        games_title: 'Zona de Juegos',
        game_memory_title: 'Memoria de Pares',
        game_memory_desc: 'Encuentra las parejas ocultas',
        game_simon_title: 'Simon Dice',
        game_simon_desc: 'Repite la secuencia de colores',
        game_mine_title: 'Buscaminas',
        game_mine_desc: 'Encuentra espacios seguros',
        game_math_title: 'Cálculo Rápido',
        game_math_desc: 'Sumas sencillas para agilidad',
        game_exit: 'Salir',
        game_win: '¡Ganaste! 🎉',
        game_lose: '¡Boom! 💥',
        game_play_again: 'Jugar de Nuevo',
        game_score: 'Puntaje:',

        minesweeper_title: 'Buscaminas',
        minesweeper_desc: 'Click Izq: Revelar | Click Der: Bandera (🚩)',

        simon_mem: 'Memoriza la secuencia',
        simon_watch: 'Observa...',
        simon_turn: 'Tu turno',
        simon_next: '¡Bien! Siguiente nivel...',
        simon_err: '¡Error! Juego terminado.',

        math_correct: 'Correcto',
        math_retry: 'Incorrecto, intenta de nuevo',

        // Evaluación
        eval_loading: 'Cargando evaluación...',
        eval_no_questions: 'No hay preguntas disponibles hoy.',
        eval_question: 'Pregunta',
        eval_total: 'Total',
        eval_finished_title: '¡Excelente trabajo!',
        eval_finished_subtitle: 'Has respondido correctamente:',
        eval_back_home: 'Volver al Inicio',

        // Historial
        history_title: 'Mi Progreso Mensual',
        history_y_axis: 'Puntaje',
        history_x_axis: 'Días del Mes',
        history_no_data: 'No hay datos aún.',
        history_day: 'Día',

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

        // Cuidador
        chat_caregiver: 'Chat con Cuidador',
        no_caregivers: 'No tienes cuidadores vinculados aún.',
        caregiver_panel: 'Panel de Cuidador',
        link_new: 'Vincular Nuevo Paciente',
        link_instruction: 'Ingresa el código único del paciente para comenzar a monitorearlo.',
        my_patients: 'Mis Pacientes',
        link_btn: 'Vincular',
        no_patients: 'No hay pacientes vinculados.',
        status_active: 'Activo',
        chat_online: 'En línea', // <-- NUEVA CLAVE

        btn_chat: 'Chat',
        btn_progress: 'Progreso',
        btn_alerts: 'Alertas',
        unlink_btn: 'Desvincular',

        // Progreso Cuidador
        progress_title: 'Progreso Cognitivo',
        progress_patient: 'Paciente',
        progress_no_data: 'Aún no hay evaluaciones registradas.',
        prog_loading: 'Cargando datos...',

        // Alertas Cuidador
        reminders_title: 'Alertas y Citas',
        reminders_manage: 'Gestionando para:',
        new_alert: 'Nueva Alerta',
        alert_title_label: 'Título',
        alert_title_ph: 'Ej: Pastilla Presión',
        alert_desc_label: 'Detalles (Opcional)',
        alert_desc_ph: 'Ej: Tomar con agua...',
        alert_date: 'Fecha',
        alert_time: 'Hora',
        alert_btn_save: 'Programar Alerta',
        alert_btn_saving: 'Guardando...',
        scheduled_alerts: 'Alertas Programadas',
        no_active_alerts: 'No hay alertas activas.',

        // Modales
        modal_unlink_title: '¿Desvincular Paciente?',
        modal_unlink_msg: 'Perderás el acceso a su información. El paciente tendrá que darte su código nuevamente.',
        btn_unlink_confirm: 'Sí, desvincular',

        modal_alert_created: '¡Alerta Creada!',
        modal_alert_created_msg: 'El recordatorio se ha programado correctamente.',

        modal_alert_error: 'Error',
        err_past_date: 'No puedes programar recordatorios en el pasado.',

        modal_del_alert_title: '¿Eliminar Alerta?',
        modal_del_alert_msg: 'El paciente dejará de ver este recordatorio.',
    },
    en: {
        // ... (Claves anteriores en inglés)
        home: 'Home',
        news: 'News',
        contact: 'Contact',
        settings: 'Settings',
        logout: 'Logout',
        back: 'Back',
        hello: 'Hello',
        what_to_do: 'What would you like to do today?',

        // Generic Buttons
        cancel_btn: 'Cancel',
        confirm_btn: 'Confirm',
        delete_btn: 'Delete',
        understand_btn: 'Understood',
        btn_accept: 'Accept',

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

        // Login & Register
        login_welcome: 'Welcome',
        login_subtitle: 'Sign in to continue',
        login_email: 'Email Address',
        login_pass: 'Password',
        login_btn: 'Sign In',
        login_loading: 'Signing in...',
        login_no_account: 'No account?',
        login_register_link: 'Sign Up',

        reg_title: 'Create Account',
        reg_subtitle: 'Select your profile',
        role_patient: 'Patient',
        role_caregiver: 'Caregiver',
        reg_name: 'Full Name',
        reg_code_ph: 'Patient Code (Optional)',
        reg_btn: 'Sign Up',
        reg_loading: 'Creating...',
        reg_has_account: 'Already have an account?',
        reg_login_link: 'Sign In',
        err_generic: 'An error occurred',

        // Games
        games_title: 'Fun Zone',
        game_memory_title: 'Memory Match',
        game_memory_desc: 'Find hidden pairs',
        game_simon_title: 'Simon Says',
        game_simon_desc: 'Repeat the color sequence',
        game_mine_title: 'Minesweeper',
        game_mine_desc: 'Find safe spaces',
        game_math_title: 'Quick Math',
        game_math_desc: 'Simple sums for agility',
        game_exit: 'Exit',
        game_win: 'You Win! 🎉',
        game_lose: 'Boom! 💥',
        game_play_again: 'Play Again',
        game_score: 'Score:',

        minesweeper_title: 'Minesweeper',
        minesweeper_desc: 'Left Click: Reveal | Right Click: Flag (🚩)',

        simon_mem: 'Memorize the sequence',
        simon_watch: 'Watch...',
        simon_turn: 'Your turn',
        simon_next: 'Good! Next level...',
        simon_err: 'Error! Game Over.',

        math_correct: 'Correct',
        math_retry: 'Incorrect, try again',

        // Evaluation
        eval_loading: 'Loading evaluation...',
        eval_no_questions: 'No questions available today.',
        eval_question: 'Question',
        eval_total: 'Total',
        eval_finished_title: 'Great job!',
        eval_finished_subtitle: 'You answered correctly:',
        eval_back_home: 'Back to Home',

        // History
        history_title: 'My Monthly Progress',
        history_y_axis: 'Score',
        history_x_axis: 'Days of Month',
        history_no_data: 'No data yet.',
        history_day: 'Day',

        // Reminders
        reminder_title: 'REMINDER',
        acknowledge_btn: '✅ ACKNOWLEDGE',
        past_reminder: 'MISSED / PAST',
        active_reminder: 'RIGHT NOW',
        no_reminders: 'You have no pending reminders.',
        all_good: 'All caught up',

        // Contact
        contact_title: 'Contact Us',
        subject: 'Subject',
        message: 'Message',
        send_msg: 'Send Message',
        msg_sent: 'Message Sent!',
        msg_sent_desc: 'Thanks for contacting us. We will reply soon.',

        // Settings
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

        // Caregiver
        chat_caregiver: 'Chat with Caregiver',
        no_caregivers: 'No linked caregivers yet.',
        caregiver_panel: 'Caregiver Panel',
        link_new: 'Link New Patient',
        link_instruction: 'Enter the unique patient code to start monitoring them.',
        my_patients: 'My Patients',
        link_btn: 'Link',
        no_patients: 'No linked patients.',
        status_active: 'Active',
        chat_online: 'Active', // <-- NUEVA CLAVE (TRADUCIDA)

        btn_chat: 'Chat',
        btn_progress: 'Progress',
        btn_alerts: 'Alerts',
        unlink_btn: 'Unlink',

        // Caregiver Progress
        progress_title: 'Cognitive Progress',
        progress_patient: 'Patient',
        progress_no_data: 'No evaluations recorded yet.',
        prog_loading: 'Loading data...',

        // Caregiver Alerts
        reminders_title: 'Alerts & Appointments',
        reminders_manage: 'Managing for:',
        new_alert: 'New Alert',
        alert_title_label: 'Title',
        alert_title_ph: 'Ex: Blood Pressure Pill',
        alert_desc_label: 'Details (Optional)',
        alert_desc_ph: 'Ex: Take with water...',
        alert_date: 'Date',
        alert_time: 'Time',
        alert_btn_save: 'Schedule Alert',
        alert_btn_saving: 'Saving...',
        scheduled_alerts: 'Scheduled Alerts',
        no_active_alerts: 'No active alerts.',

        // Modals
        modal_unlink_title: 'Unlink Patient?',
        modal_unlink_msg: 'You will lose access to their information. The patient will need to provide their code again.',
        btn_unlink_confirm: 'Yes, unlink',

        modal_alert_created: 'Alert Created!',
        modal_alert_created_msg: 'The reminder has been scheduled successfully.',

        modal_alert_error: 'Error',
        err_past_date: 'You cannot schedule reminders in the past.',

        modal_del_alert_title: 'Delete Alert?',
        modal_del_alert_msg: 'The patient will no longer see this reminder.',
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
        // @ts-ignore
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