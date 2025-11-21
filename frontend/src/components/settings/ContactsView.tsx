import React, { useState } from 'react';

const ContactsView: React.FC<{ onBack: () => void }> = ({ onBack }) => {
    const [formData, setFormData] = useState({ name: '', email: '', message: '' });
    const [sent, setSent] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Aquí iría la lógica real de envío al backend
        setTimeout(() => {
            setSent(true);
        }, 1000);
    };

    return (
        <div className="max-w-2xl mx-auto dark:text-white">
            <div className="flex items-center mb-6">
                <button onClick={onBack} className="bg-white dark:bg-gray-700 p-2 rounded-full shadow-md text-gray-600 dark:text-gray-200 hover:text-teal-600 mr-4 text-xl transition">
                    ⬅
                </button>
                <h2 className="text-3xl font-bold text-teal-800 dark:text-teal-400">Contáctanos</h2>
            </div>

            <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg">
                {sent ? (
                    <div className="text-center py-10">
                        <div className="text-6xl mb-4">📧✅</div>
                        <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">¡Mensaje Enviado!</h3>
                        <p className="text-gray-600 dark:text-gray-300">Gracias por contactarnos. Te responderemos pronto.</p>
                        <button
                            onClick={onBack}
                            className="mt-6 bg-teal-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-teal-700"
                        >
                            Volver al Inicio
                        </button>
                    </div>
                ) : (
                    <>
                        <p className="text-gray-600 dark:text-gray-300 mb-6">
                            ¿Tienes alguna duda o sugerencia sobre CogniCare? Escríbenos y nuestro equipo técnico te ayudará.
                        </p>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Nombre</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                                    className="w-full border dark:border-gray-600 dark:bg-gray-700 p-3 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Correo Electrónico</label>
                                <input
                                    type="email"
                                    required
                                    value={formData.email}
                                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                                    className="w-full border dark:border-gray-600 dark:bg-gray-700 p-3 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Mensaje</label>
                                <textarea
                                    required
                                    rows={4}
                                    value={formData.message}
                                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                                    className="w-full border dark:border-gray-600 dark:bg-gray-700 p-3 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                                />
                            </div>
                            <button type="submit" className="w-full bg-teal-600 text-white py-3 rounded-lg font-bold text-lg hover:bg-teal-700 transition shadow-md">
                                Enviar Mensaje
                            </button>
                        </form>
                    </>
                )}
            </div>
        </div>
    );
};

export default ContactsView;