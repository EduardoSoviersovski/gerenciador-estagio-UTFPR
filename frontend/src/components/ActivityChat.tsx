import React, { useState } from 'react';
import { MessageSquare, Send } from 'lucide-react';

export interface ChatMessage {
    id: string;
    text: string;
    sender: string;
    time: string;
    isMe: boolean;
}

interface ActivityChatProps {
    role: 'student' | 'professor' | 'admin';
    messages: ChatMessage[];
    onSendMessage: (text: string) => void;
}

export const ActivityChat = ({ role, messages, onSendMessage }: ActivityChatProps) => {
    const [newMessage, setNewMessage] = useState('');
    const canSend = role !== 'student';

    const handleSend = () => {
        if (!newMessage.trim()) return;
        onSendMessage(newMessage);
        setNewMessage('');
    };

    return (
        <div className="mt-8 bg-gray-50/50 rounded-2xl flex flex-col w-full border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 bg-white flex items-center gap-2">
                <MessageSquare size={18} className="text-blue-500" />
                <span className="font-bold text-sm text-gray-700 italic">Histórico de Feedbacks</span>
            </div>

            <div className="p-6 overflow-y-auto max-h-[300px] flex flex-col gap-4 bg-white/50 custom-scrollbar">
                {messages.length > 0 ? (
                    messages.map((msg) => (
                        <div
                            key={msg.id}
                            className={`flex flex-col max-w-[85%] ${msg.isMe ? 'self-end' : 'self-start'}`}
                        >
                            <div className={`flex gap-2 mb-1 px-1 ${msg.isMe ? 'flex-row-reverse' : 'flex-row'}`}>
                                <span className="text-[10px] font-bold text-gray-500 uppercase">{msg.sender}</span>
                                <span className="text-[10px] text-gray-400">{msg.time}</span>
                            </div>
                            <div className={`p-4 rounded-2xl shadow-sm border text-sm leading-relaxed break-words whitespace-pre-wrap
                ${msg.isMe
                                    ? 'bg-blue-600 text-white border-blue-700 rounded-tr-none'
                                    : 'bg-white text-gray-600 border-gray-200 rounded-tl-none'
                                }`}
                            >
                                {msg.text}
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-center text-xs text-gray-400 py-4 italic">Nenhum comentário registrado para esta etapa.</p>
                )}
            </div>

            <div className="p-4 bg-white border-t border-gray-100">
                {canSend ? (
                    <div className="flex gap-2 w-full">
                        <input
                            type="text"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                            placeholder="Responder feedback..."
                            className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                        />
                        <button onClick={handleSend} className="bg-blue-600 text-white p-2.5 rounded-xl hover:bg-blue-700 active:scale-95 transition-all">
                            <Send size={20} />
                        </button>
                    </div>
                ) : (
                    <div className="flex items-center justify-center p-2 bg-gray-50 rounded-lg border border-dashed border-gray-200">
                        <p className="text-xs text-gray-400 italic text-center">
                            A visualização de feedbacks é liberada após o envio do arquivo. Apenas orientadores podem comentar.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};