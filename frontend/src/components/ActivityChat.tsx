import React, { useState, useRef, useEffect } from 'react';
import { Send, User, Shield, Loader2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { DocumentService } from '../services/documentService';

interface Message {
    id: string;
    text: string;
    senderName: string;
    senderRole: 'advisor' | 'admin';
    senderEmail: string;
    timestamp: string;
    fullDate: Date;
    isMe: boolean;
}

interface ActivityChatProps {
    processId: number;
    documentTypeId: number;
    isSkeleton: boolean | undefined;
    onUpdate?: () => void;
}

export const ActivityChat = ({ processId, documentTypeId, isSkeleton, onUpdate }: ActivityChatProps) => {
    const { user } = useAuth();
    const [inputText, setText] = useState('');
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState(true);

    const safeRole = user?.role?.toLowerCase() || '';
    const scrollRef = useRef<HTMLDivElement>(null);
    const MAX_CHARS = 255;

    const trimmedLength = inputText.trim().length;

    useEffect(() => {
        const fetchMessages = async () => {
            if (!processId || !documentTypeId) return;
            try {
                setLoading(true);
                const data = await DocumentService.getReportDetails(processId, documentTypeId);

                if (data && data.messages) {
                    const mappedMessages: Message[] = data.messages.map((m: any) => {
                        const isMe = m.email === user?.email;
                        const role = m.role_name?.toLowerCase() || (isMe ? safeRole : 'admin');

                        const parsedDate = m.send_at ? new Date(m.send_at) : new Date();

                        return {
                            id: String(m.id),
                            text: m.message,
                            senderName: m.name || 'Usuário',
                            senderRole: role as any,
                            senderEmail: m.email || '',
                            timestamp: parsedDate.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
                            fullDate: parsedDate,
                            isMe
                        };
                    });
                    setMessages(mappedMessages);
                }
            } catch (error: any) {
                console.error("Erro ao buscar detalhes do relatório:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchMessages();
    }, [processId, documentTypeId, user?.email, safeRole]);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);


    const handleSendMessage = async () => {
        const messageText = inputText.trim();

        if (!messageText || messageText.length > MAX_CHARS || !user || safeRole === 'student') return;

        setText('');

        const optimisticMessage: Message = {
            id: Date.now().toString(),
            text: messageText,
            senderName: user.name || 'Você',
            senderRole: safeRole as any,
            senderEmail: user.email || '',
            timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
            fullDate: new Date(),
            isMe: true
        };
        setMessages(prev => [...prev, optimisticMessage]);

        try {
            await DocumentService.addComment(processId, documentTypeId, messageText);
            if (isSkeleton && onUpdate) {
                if (onUpdate) onUpdate();
            }
        } catch (error) {
            console.error("Erro ao enviar mensagem:", error);
            setMessages(prev => prev.filter(m => m.id !== optimisticMessage.id));
            alert("Erro ao enviar o comentário. Tente novamente.");
            setText(messageText);
        }
    };

    const isSameDay = (d1: Date | null | undefined, d2: Date | null | undefined) => {
        if (!d1 || !d2) return false;
        return (
            d1.getDate() === d2.getDate() &&
            d1.getMonth() === d2.getMonth() &&
            d1.getFullYear() === d2.getFullYear()
        );
    };

    const getDateLabel = (dateObj: Date | null | undefined) => {
        if (!dateObj) return '';

        const today = new Date();
        const yesterday = new Date();
        yesterday.setDate(today.getDate() - 1);

        if (isSameDay(dateObj, today)) return 'Hoje';
        if (isSameDay(dateObj, yesterday)) return 'Ontem';

        return dateObj.toLocaleDateString('pt-BR');
    };

    const getMessageAlignment = (msg: Message) => {
        if (safeRole === 'student') {
            return msg.senderRole === 'advisor' ? 'right' : 'left';
        }
        return msg.isMe ? 'right' : 'left';
    };

    const getMessageStyles = (msg: Message) => {
        const alignment = getMessageAlignment(msg);

        const positionStyles = alignment === 'right'
            ? 'ml-auto rounded-2xl rounded-tr-none'
            : 'mr-auto rounded-2xl rounded-tl-none';

        if (msg.senderRole === 'advisor') {
            return `bg-emerald-100 text-emerald-900 border border-emerald-200 ${positionStyles}`;
        }

        if (msg.senderRole === 'admin') {
            const adminEmails = Array.from(
                new Set(messages.filter(m => m.senderRole === 'admin').map(m => m.senderEmail))
            );
            const adminIndex = adminEmails.indexOf(msg.senderEmail);

            if (adminIndex === 1) {
                return `bg-purple-100 text-purple-900 border border-purple-200 ${positionStyles}`;
            } else {
                return `bg-indigo-100 text-indigo-900 border border-indigo-200 ${positionStyles}`;
            }
        }

        return `bg-gray-100 text-gray-800 border border-gray-200 ${positionStyles}`;
    };

    const getRoleIcon = (msg: Message) => {
        if (msg.senderRole === 'advisor') {
            return <User size={10} className="text-emerald-500" />;
        }

        const adminEmails = Array.from(
            new Set(messages.filter(m => m.senderRole === 'admin').map(m => m.senderEmail))
        );
        const adminIndex = adminEmails.indexOf(msg.senderEmail);

        return adminIndex === 1
            ? <Shield size={10} className="text-purple-500" />
            : <Shield size={10} className="text-indigo-500" />;
    };

    if (loading) {
        return (
            <div className="flex flex-col h-full bg-white rounded-3xl border border-gray-100 shadow-sm items-center justify-center">
                <Loader2 className="animate-spin text-blue-500 mb-2" size={24} />
                <p className="text-xs text-gray-400 font-medium">Carregando histórico...</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-50 flex items-center justify-between bg-white shrink-0">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                    <h3 className="text-[11px] font-black uppercase tracking-widest text-slate-800">Discussão e Feedbacks</h3>
                </div>
            </div>

            <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/30">
                {messages.length === 0 ? (
                    <div className="h-full flex items-center justify-center">
                        <p className="text-xs text-gray-400 italic">Nenhum feedback registrado ainda.</p>
                    </div>
                ) : (
                    messages.map((msg, index) => {
                        const alignment = getMessageAlignment(msg);

                        const currDate = msg.fullDate ? new Date(msg.fullDate) : new Date();
                        const prevMsg = messages[index - 1];
                        const prevDate = prevMsg?.fullDate ? new Date(prevMsg.fullDate) : null;

                        const showDateDivider = !prevDate || !isSameDay(currDate, prevDate);

                        return (
                            <React.Fragment key={msg.id}>
                                {showDateDivider && (
                                    <div className="flex justify-center my-4 shrink-0">
                                        <span className="bg-slate-200/70 text-slate-600 text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-sm">
                                            {getDateLabel(currDate)}
                                        </span>
                                    </div>
                                )}

                                <div className={`flex flex-col ${alignment === 'right' ? 'items-end' : 'items-start'}`}>
                                    <div className={`flex items-center gap-1.5 mb-1 px-1 ${alignment === 'right' ? 'flex-row-reverse' : ''}`}>
                                        {getRoleIcon(msg)}
                                        <span className="text-[9px] font-black uppercase tracking-tight text-slate-400">
                                            {msg.isMe ? 'Você' : msg.senderName} • {msg.timestamp}
                                        </span>
                                    </div>

                                    <div className={`max-w-[85%] px-4 py-2.5 text-xs font-medium shadow-sm transition-all ${getMessageStyles(msg)}`}>
                                        {msg.text}
                                    </div>
                                </div>
                            </React.Fragment>
                        );
                    })
                )}
            </div>

            {safeRole !== 'student' ? (
                <div className="p-4 bg-white border-t border-gray-50 shrink-0 flex flex-col">
                    <div className="relative flex items-center gap-2">
                        <input
                            type="text"
                            value={inputText}
                            onChange={(e) => setText(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && trimmedLength > 0 && trimmedLength <= MAX_CHARS && handleSendMessage()}
                            placeholder="Escreva um comentário ou feedback..."
                            className={`flex-1 bg-gray-50 border rounded-2xl px-5 py-3 text-xs focus:outline-none focus:ring-2 transition-all placeholder:text-gray-400 font-medium
                                ${trimmedLength > MAX_CHARS ? 'border-red-300 focus:ring-red-500/10' : 'border-gray-100 focus:ring-blue-500/10'}
                            `}
                        />
                        <button
                            onClick={handleSendMessage}
                            disabled={trimmedLength === 0 || trimmedLength > MAX_CHARS}
                            className="p-3 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-md shadow-blue-100"
                        >
                            <Send size={18} />
                        </button>
                    </div>
                    <div className="w-full flex justify-end mt-1.5 px-2">
                        <span className={`text-[10px] font-bold tracking-wide ${trimmedLength > MAX_CHARS ? 'text-red-500' : 'text-gray-400'}`}>
                            {trimmedLength} / {MAX_CHARS}
                        </span>
                    </div>
                </div>
            ) : (
                <div className="p-4 bg-gray-50 border-t border-gray-100 shrink-0 text-center">
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                        Os feedbacks da PRAE e orientador aparecerão aqui
                    </p>
                </div>
            )}
        </div>
    );
};