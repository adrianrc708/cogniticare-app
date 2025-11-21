import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { format } from 'date-fns';

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
        <div className="fixed bottom-4 right-4 w-80 md:w-96 h-[500px] bg-white dark:bg-gray-800 rounded-t-xl shadow-2xl flex flex-col border dark:border-gray-700 z-50">
            <div className="bg-teal-600 text-white p-4 rounded-t-xl flex justify-between items-center cursor-pointer" onClick={onClose}>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                    <h3 className="font-bold">{contactName}</h3>
                </div>
                <button className="text-white hover:text-gray-200 font-bold">✕</button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50 dark:bg-gray-900">
                {messages.map((msg) => {
                    const isMe = msg.senderId === currentUserId;
                    return (
                        <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[80%] p-3 rounded-xl text-sm ${isMe ? 'bg-teal-100 text-teal-900 rounded-br-none' : 'bg-white border border-gray-200 text-gray-800 rounded-bl-none'}`}>
                                <p>{msg.content}</p>
                                <p className="text-xs text-gray-400 mt-1 text-right">
                                    {format(new Date(msg.createdAt), 'HH:mm')}
                                </p>
                            </div>
                        </div>
                    );
                })}
                <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSend} className="p-3 border-t dark:border-gray-700 bg-white dark:bg-gray-800 rounded-b-xl flex gap-2">
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Escribe..."
                    className="flex-1 border dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
                <button type="submit" className="bg-teal-600 text-white p-2 rounded-full hover:bg-teal-700 transition">
                    ➤
                </button>
            </form>
        </div>
    );
};

export default ChatWindow;