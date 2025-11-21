import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface Message {
    id: number;
    senderId: number;
    content: string;
    createdAt: string;
}

interface Props {
    currentUserId: number;
    contactId: number;
    contactName: string;
    onClose: () => void;
}

const ChatWindow: React.FC<Props> = ({ currentUserId, contactId, contactName, onClose }) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const loadMessages = async () => {
        try {
            const res = await axios.get(`http://localhost:3000/chat?contactId=${contactId}`);
            setMessages(res.data);
        } catch (e) { console.error(e); }
    };

    useEffect(() => {
        loadMessages();
        const interval = setInterval(loadMessages, 3000);
        return () => clearInterval(interval);
    }, [contactId]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        try {
            await axios.post('http://localhost:3000/chat', {
                receiverId: contactId,
                content: newMessage
            });
            setNewMessage('');
            loadMessages();
        } catch (e) { alert('Error enviando mensaje'); }
    };

    return (
        // Contenedor principal flotante (más grande y con sombras suaves)
        <div className="fixed bottom-4 right-4 w-full max-w-md h-[650px] max-h-[80vh] bg-[#F3F4F6] dark:bg-gray-900 rounded-[2.5rem] shadow-2xl flex flex-col border-4 border-white dark:border-gray-700 z-50 overflow-hidden font-sans transition-colors duration-300">

            {/* Cabecera Amigable */}
            <div className="bg-teal-600 dark:bg-teal-800 p-6 flex justify-between items-center shadow-md">
                <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center text-3xl border-2 border-white/30">
                        🩺
                    </div>
                    <div>
                        <h3 className="font-black text-white text-2xl tracking-wide drop-shadow-sm">{contactName}</h3>
                        <div className="flex items-center gap-2 bg-teal-800/50 px-3 py-1 rounded-full w-fit">
                            <span className="w-3 h-3 bg-green-400 rounded-full animate-pulse shadow-[0_0_8px_rgba(74,222,128,0.8)]"></span>
                            <span className="text-teal-50 text-sm font-bold uppercase tracking-wider">En línea</span>
                        </div>
                    </div>
                </div>
                <button
                    onClick={onClose}
                    className="w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition text-2xl font-bold"
                    aria-label="Cerrar chat"
                >
                    ✕
                </button>
            </div>

            {/* Área de Mensajes */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-[#F3F4F6] dark:bg-gray-900 scroll-smooth">
                {messages.length === 0 && (
                    <div className="text-center text-gray-400 mt-10">
                        <p className="text-4xl mb-2">👋</p>
                        <p className="text-lg">Inicia la conversación</p>
                    </div>
                )}

                {messages.map((msg) => {
                    const isMe = msg.senderId === currentUserId;
                    return (
                        <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                            <div
                                className={`
                                    max-w-[85%] p-5 rounded-3xl text-lg shadow-sm relative
                                    ${isMe
                                    ? 'bg-teal-100 text-teal-900 dark:bg-teal-700 dark:text-white rounded-tr-sm'
                                    : 'bg-white text-gray-800 dark:bg-gray-800 dark:text-gray-100 rounded-tl-sm border border-gray-200 dark:border-gray-700'
                                }
                                `}
                            >
                                <p className="leading-relaxed">{msg.content}</p>
                                <p className={`text-xs font-bold mt-2 text-right ${isMe ? 'text-teal-700/60 dark:text-teal-200/60' : 'text-gray-400'}`}>
                                    {format(new Date(msg.createdAt), 'HH:mm', { locale: es })}
                                </p>
                            </div>
                        </div>
                    );
                })}
                <div ref={messagesEndRef} />
            </div>

            {/* Área de Escritura (Input grande) */}
            <form onSubmit={handleSend} className="p-4 bg-white dark:bg-gray-800 border-t dark:border-gray-700 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
                <div className="flex gap-3 items-end">
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Escribe aquí..."
                        className="flex-1 bg-gray-100 dark:bg-gray-700 border-0 rounded-3xl px-6 py-5 text-gray-800 dark:text-white text-xl focus:ring-4 focus:ring-teal-200 dark:focus:ring-teal-900 outline-none placeholder-gray-400 transition-all"
                    />
                    <button
                        type="submit"
                        disabled={!newMessage.trim()}
                        className={`
                            w-16 h-16 rounded-[1.5rem] flex items-center justify-center text-2xl shadow-lg transition-all transform active:scale-95
                            ${newMessage.trim()
                            ? 'bg-teal-600 hover:bg-teal-700 text-white cursor-pointer'
                            : 'bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed'
                        }
                        `}
                    >
                        ➤
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ChatWindow;