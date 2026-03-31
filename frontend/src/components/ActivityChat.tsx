import React, { useState } from 'react';
import { MessageSquare, Send } from 'lucide-react';

interface Message {
    id: string;
    text: string;
    sender: string;
    time: string;
    isMe: boolean;
}

interface ActivityChatProps {
    role: 'student' | 'professor' | 'admin';
}

export const ActivityChat = ({ role }: ActivityChatProps) => {
    const [newMessage, setNewMessage] = useState('');
    const canSend = role !== 'student';

    const [messages] = useState<Message[]>([
        { id: '1', sender: 'Prof. Ricardo', text: 'Olá Pedro, recebi seu relatório inicial.', time: '10:30', isMe: false },
        { id: '2', sender: 'Sistema', text: 'Arquivo "plano_de_trabalho.pdf" enviado com sucesso.', time: '10:31', isMe: true },
        { id: '3', sender: 'Prof. Ricardo', text: 'O texto está bem estruturado, mas a fundamentação teórica precisa de pelo menos mais três autores da área de sistemas distribuídos. Verifique o repositório da UTFPR por teses similares.', time: '11:05', isMe: false },
        { id: '4', sender: 'Prof. Ricardo', text: 'Esta é uma mensagem extremamente longa para testarmos como o contêiner se comporta quando o texto excede a largura disponível do elemento pai, garantindo que ele não quebre o layout horizontal e faça o wrap corretamente conforme o esperado em interfaces responsivas modernas.', time: '11:06', isMe: false },
        { id: '5', sender: 'Prof. Ricardo', text: 'Aguardo a correção até sexta-feira.', time: '11:10', isMe: false },
    ]);

    return (
        <div className="mt-8 bg-gray-50/50 rounded-2xl flex flex-col w-full border border-gray-100 overflow-hidden">
            {/* Header do Chat */}
            <div className="px-6 py-4 border-b border-gray-100 bg-white flex items-center gap-2">
                <MessageSquare size={18} className="text-blue-500" />
                <span className="font-bold text-sm text-gray-700 italic">Histórico de Feedbacks</span>
            </div>

            {/* Área de Mensagens com Scroll */}
            <div className="p-6 overflow-y-auto max-h-[400px] flex flex-col gap-4 custom-scrollbar bg-white/50">
                {messages.map((msg) => (
                    <div
                        key={msg.id}
                        className={`flex flex-col max-w-[85%] ${msg.isMe ? 'self-end' : 'self-start'}`}
                    >
                        {/* Nome e Hora */}
                        <div className={`flex gap-2 mb-1 px-1 ${msg.isMe ? 'flex-row-reverse' : 'flex-row'}`}>
                            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">{msg.sender}</span>
                            <span className="text-[10px] text-gray-400">{msg.time}</span>
                        </div>

                        {/* Bolha da Mensagem - Usando largura relativa e quebra de texto */}
                        <div className={`p-4 rounded-2xl shadow-sm border text-sm leading-relaxed break-words whitespace-pre-wrap
              ${msg.isMe
                                ? 'bg-blue-600 text-white border-blue-700 rounded-tr-none'
                                : 'bg-white text-gray-600 border-gray-200 rounded-tl-none'
                            }`}
                        >
                            {msg.text}
                        </div>
                    </div>
                ))}
            </div>

            {/* Input de Mensagem (Apenas se não for aluno) */}
            <div className="p-4 bg-white border-t border-gray-100">
                {canSend ? (
                    <div className="flex gap-2 w-full">
                        <input
                            type="text"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            placeholder="Responder feedback..."
                            className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all"
                        />
                        <button className="bg-blue-600 text-white p-2.5 rounded-xl hover:bg-blue-700 shadow-md shadow-blue-200 transition-all active:scale-95">
                            <Send size={20} />
                        </button>
                    </div>
                ) : (
                    <div className="flex items-center justify-center p-2 bg-gray-50 rounded-lg border border-dashed border-gray-200">
                        <p className="text-xs text-gray-400 italic">O campo de resposta está disponível apenas para orientadores.</p>
                    </div>
                )}
            </div>
        </div>
    );
};