import React from 'react';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm?: () => void;
    title: string;
    message: string;
    type?: 'danger' | 'info' | 'success' | 'warning';
    confirmText?: string;
    cancelText?: string;
    singleButton?: boolean; // Para usarlo como alerta simple (solo botón OK)
}

const Modal: React.FC<ModalProps> = ({
                                         isOpen,
                                         onClose,
                                         onConfirm,
                                         title,
                                         message,
                                         type = 'info',
                                         confirmText = 'Confirmar',
                                         cancelText = 'Cancelar',
                                         singleButton = false
                                     }) => {
    if (!isOpen) return null;

    // Configuración de colores según el tipo de alerta
    const config = {
        danger: {
            icon: '⚠️',
            bgIcon: 'bg-red-100 dark:bg-red-900/30',
            textIcon: 'text-red-600 dark:text-red-400',
            btn: 'bg-red-600 hover:bg-red-700 text-white',
            title: 'text-red-600 dark:text-red-400'
        },
        info: {
            icon: 'ℹ️',
            bgIcon: 'bg-blue-100 dark:bg-blue-900/30',
            textIcon: 'text-blue-600 dark:text-blue-400',
            btn: 'bg-blue-600 hover:bg-blue-700 text-white',
            title: 'text-blue-800 dark:text-blue-300'
        },
        success: {
            icon: '✅',
            bgIcon: 'bg-green-100 dark:bg-green-900/30',
            textIcon: 'text-green-600 dark:text-green-400',
            btn: 'bg-green-600 hover:bg-green-700 text-white',
            title: 'text-green-800 dark:text-green-300'
        },
        warning: {
            icon: '📅',
            bgIcon: 'bg-orange-100 dark:bg-orange-900/30',
            textIcon: 'text-orange-600 dark:text-orange-400',
            btn: 'bg-orange-600 hover:bg-orange-700 text-white',
            title: 'text-orange-800 dark:text-orange-300'
        }
    };

    const style = config[type];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
            {/* Backdrop blur */}
            <div
                className="absolute inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            ></div>

            {/* Modal Card */}
            <div className="relative bg-white dark:bg-gray-800 rounded-[2rem] shadow-2xl w-full max-w-md p-8 border border-gray-100 dark:border-gray-700 transform transition-all scale-100">
                <div className="flex flex-col items-center text-center">
                    <div className={`w-20 h-20 rounded-full flex items-center justify-center text-4xl mb-6 ${style.bgIcon} ${style.textIcon}`}>
                        {style.icon}
                    </div>

                    <h3 className={`text-2xl font-black mb-3 ${style.title}`}>
                        {title}
                    </h3>

                    <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
                        {message}
                    </p>

                    <div className="flex gap-4 w-full">
                        {!singleButton && (
                            <button
                                onClick={onClose}
                                className="flex-1 py-4 rounded-xl font-bold text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                            >
                                {cancelText}
                            </button>
                        )}
                        <button
                            onClick={() => {
                                if (onConfirm) onConfirm();
                                if (singleButton) onClose();
                            }}
                            className={`flex-1 py-4 rounded-xl font-bold transition-transform active:scale-95 shadow-lg ${style.btn}`}
                        >
                            {confirmText}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Modal;