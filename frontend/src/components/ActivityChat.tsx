import React, { useState, useRef, useEffect } from 'react';
import { Send, User, Shield, Info } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface Message {
    id: string;
    text: string;
    senderName: string;
    senderRole: 'STUDENT' | 'ADVISOR' | 'ADMIN' | 'SYSTEM';
    timestamp: string;
    isMe: boolean;
}

export const ActivityChat = () => {
    const { user } = useAuth();
    const [inputText, setText] = useState('');

    const safeRole = user?.role?.toUpperCase() || '';

    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            text: 'O arquivo foi atualizado para a versão v1.pdf',
            senderName: 'SISTEMA',
            senderRole: 'SYSTEM',
            timestamp: '14:00',
            isMe: false
        },
        {
            id: '2',
            text: 'Por favor, revise a seção 3 do relatório, as referências estão fora do padrão.',
            senderName: 'Eduardo Souto',
            senderRole: 'ADVISOR',
            timestamp: '14:30',
            isMe: safeRole === 'ADVISOR'
        },
        {
            id: '3',
            text: 'Documentação analisada. Aguardando a correção apontada pelo orientador para deferimento.',
            senderName: 'Coordenação de Estágios',
            senderRole: 'ADMIN',
            timestamp: '15:15',
            isMe: safeRole === 'ADMIN'
        }
    ]);

    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSendMessage = () => {
        if (!inputText.trim() || !user || safeRole === 'STUDENT') return;

        const newMessage: Message = {
            id: Date.now().toString(),
            text: inputText,
            senderName: user.name || 'Usuário',
            senderRole: safeRole as any,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            isMe: true
        };

        setMessages([...messages, newMessage]);
        setText('');
    };

    const getRoleStyles = (role: string, isMe: boolean) => {
        if (role === 'SYSTEM') return 'bg-gray-100 text-gray-500 mx-auto text-center text-[10px] italic py-1 px-4 rounded-full border border-gray-200';
        if (isMe) return 'bg-blue-600 text-white ml-auto rounded-tr-none';

        switch (role) {
            case 'ADVISOR': return 'bg-emerald-50 text-emerald-900 border border-emerald-100 rounded-tl-none';
            case 'ADMIN': return 'bg-indigo-50 text-indigo-900 border border-indigo-100 rounded-tl-none';
            default: return 'bg-gray-100 text-gray-800 rounded-tl-none';
        }
    };

    const getRoleIcon = (role: string) => {
        switch (role) {
            case 'ADVISOR': return <User size={10} className="text-emerald-500" />;
            case 'ADMIN': return <Shield size={10} className="text-indigo-500" />;
            case 'SYSTEM': return <Info size={10} />;
            default: return <User size={10} className="text-blue-400" />;
        }
    };

    return (
        <div className="flex flex-col h-full bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-50 flex items-center justify-between bg-white shrink-0">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                    <h3 className="text-[11px] font-black uppercase tracking-widest text-slate-800">Discussão e Feedbacks</h3>
                </div>
            </div>

            <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/30">
                {messages.map((msg) => (
                    <div key={msg.id} className={`flex flex-col ${msg.senderRole === 'SYSTEM' ? 'items-center' : msg.isMe ? 'items-end' : 'items-start'}`}>
                        {msg.senderRole !== 'SYSTEM' && (
                            <div className={`flex items-center gap-1.5 mb-1 px-1 ${msg.isMe ? 'flex-row-reverse' : ''}`}>
                                {getRoleIcon(msg.senderRole)}
                                <span className="text-[9px] font-black uppercase tracking-tight text-slate-400">
                                    {msg.isMe ? 'Você' : msg.senderName} • {msg.timestamp}
                                </span>
                            </div>
                        )}

                        <div className={`max-w-[85%] px-4 py-2.5 text-xs font-medium shadow-sm transition-all ${getRoleStyles(msg.senderRole, msg.isMe)}`}>
                            {msg.text}
                        </div>
                    </div>
                ))}
            </div>

            {safeRole !== 'STUDENT' ? (
                <div className="p-4 bg-white border-t border-gray-50 shrink-0">
                    <div className="relative flex items-center gap-2">
                        <input
                            type="text"
                            value={inputText}
                            onChange={(e) => setText(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                            placeholder="Escreva um comentário ou feedback..."
                            className="flex-1 bg-gray-50 border border-gray-100 rounded-2xl px-5 py-3 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/10 transition-all placeholder:text-gray-400 font-medium"
                        />
                        <button
                            onClick={handleSendMessage}
                            disabled={!inputText.trim()}
                            className="p-3 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-md shadow-blue-100"
                        >
                            <Send size={18} />
                        </button>
                    </div>
                </div>
            ) : (
                <div className="p-4 bg-gray-50 border-t border-gray-100 shrink-0 text-center">
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                        Os feedbacks da coordenação e orientador aparecerão aqui
                    </p>
                </div>
            )}
        </div>
    );
};