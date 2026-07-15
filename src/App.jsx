import React, { useState, useRef, useEffect } from 'react';
import { Send, User, Sparkles, Building, Landmark, Briefcase, FileText, Cpu, Mail, Phone, Linkedin, Menu, X } from 'lucide-react';

export default function ContadoraFabiApp() {
  const [messages, setMessages] = useState([
    { role: 'model', text: 'Olá! Sou a IA assistente da Contadora Fabi. Como posso ajudar o seu negócio hoje?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Função para chamar a API do Gemini
  const callGeminiAPI = async (userMessage, currentHistory) => {
    
    // ATENÇÃO: Para rodar aqui na nossa tela de testes, mantenha a chave como uma string vazia "".
    // Quando for subir o projeto para a Netlify de forma definitiva, substitua a linha abaixo por:
    // const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    const apiKey = "";
    
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;

    const systemInstruction = `Você é a assistente virtual da 'Contadora Fabi' (Fabíola, uma contadora e mestranda). Seu tom é profissional, didático e amigável.
    REGRAS DE FORMATAÇÃO: NÃO USE asteriscos (*) ou hashtags (#). Use LETRAS MAIÚSCULAS ou emojis.
    REGRAS DE SEGURANÇA: IA educacional apenas. Direcione planejamento complexo para a Fabi.`;

    const formattedHistory = currentHistory.map(msg => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.text }]
    }));

    try {
      let response;
      let retries = 5;
      let delay = 1000;
      
      for (let i = 0; i < retries; i++) {
        try {
          response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [...formattedHistory, { role: "user", parts: [{ text: userMessage }] }],
              systemInstruction: { parts: [{ text: systemInstruction }] }
            })
          });
          if (response.ok) break;
        } catch (err) {
          if (i === retries - 1) throw err;
        }
        await new Promise(res => setTimeout(res, delay));
        delay *= 2;
      }
      
      const data = await response.json();
      return data.candidates?.[0]?.content?.parts?.[0]?.text || "Desculpe, ocorreu um pequeno erro ao processar a resposta.";
    } catch (error) {
      console.error(error);
      return "Desculpe, estou enfrentando problemas de conexão. Verifique se a API Key foi configurada corretamente na Netlify!";
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input.trim();
    setInput('');
    
    const newMessages = [...messages, { role: 'user', text: userMessage }];
    setMessages(newMessages);
    setIsLoading(true);

    const botResponse = await callGeminiAPI(userMessage, messages);
    
    setMessages([...newMessages, { role: 'model', text: botResponse }]);
    setIsLoading(false);
  };

  const sendQuickReply = (text) => {
    setInput(text);
    setTimeout(() => {
        document.getElementById('chat-form').dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
    }, 50);
  };

  return (
    <div className="flex h-screen bg-gray-50 text-[#000000]" style={{ fontFamily: "'Roboto', sans-serif" }}>
      
      {/* Sidebar (Desktop & Mobile Menu) */}
      <div className={`fixed inset-y-0 left-0 z-50 w-72 bg-[#00237e] text-white transform ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 transition-transform duration-300 ease-in-out flex flex-col shadow-xl`}>
        <div className="p-6 flex items-center justify-between border-b border-[#ffffff]/10">
          <div className="flex items-center gap-3">
            <div className="bg-[#4b9bb3] p-2 rounded-full">
              <Sparkles size={24} className="text-white" />
            </div>
            <h1 className="font-bold text-2xl tracking-tight" style={{ fontFamily: "'Montserrat', sans-serif" }}>Fabi AI</h1>
          </div>
          <button className="md:hidden text-gray-300 hover:text-white" onClick={() => setIsMenuOpen(false)}>
            <X size={24} />
          </button>
        </div>

        <div className="px-4 py-4 overflow-y-auto flex-1 custom-scrollbar">
          <p className="text-[#4b9bb3] text-xs font-bold uppercase tracking-wider mb-4" style={{ fontFamily: "'Montserrat', sans-serif" }}>Nossos Serviços</p>
          <div className="space-y-2">
            <button onClick={() => {sendQuickReply("Quero saber mais sobre a Consultoria Societária."); setIsMenuOpen(false);}} className="w-full flex items-center gap-3 px-4 py-3 bg-white/5 hover:bg-[#4b9bb3]/20 rounded-lg transition-colors text-sm text-left">
              <Building size={18} className="text-[#4b9bb3]" />
              <span>Consultoria Societária</span>
            </button>
            <button onClick={() => {sendQuickReply("Como funciona a Consultoria Tributária?"); setIsMenuOpen(false);}} className="w-full flex items-center gap-3 px-4 py-3 bg-white/5 hover:bg-[#4b9bb3]/20 rounded-lg transition-colors text-sm text-left">
              <Landmark size={18} className="text-[#4b9bb3]" />
              <span>Consultoria Tributária</span>
            </button>
            <button onClick={() => {sendQuickReply("Quais os passos para Abertura de Empresa?"); setIsMenuOpen(false);}} className="w-full flex items-center gap-3 px-4 py-3 bg-white/5 hover:bg-[#4b9bb3]/20 rounded-lg transition-colors text-sm text-left">
              <Briefcase size={18} className="text-[#4b9bb3]" />
              <span>Abertura de Empresa</span>
            </button>
            <button onClick={() => {sendQuickReply("Quais Serviços Contábeis você oferece?"); setIsMenuOpen(false);}} className="w-full flex items-center gap-3 px-4 py-3 bg-white/5 hover:bg-[#4b9bb3]/20 rounded-lg transition-colors text-sm text-left">
              <FileText size={18} className="text-[#4b9bb3]" />
              <span>Serviços Contábeis</span>
            </button>
            <button onClick={() => {sendQuickReply("Como a Inteligência Artificial pode ajudar meu negócio?"); setIsMenuOpen(false);}} className="w-full flex items-center gap-3 px-4 py-3 bg-white/5 hover:bg-[#4b9bb3]/20 rounded-lg transition-colors text-sm text-left">
              <Cpu size={18} className="text-[#4b9bb3]" />
              <span>Negócios e IA</span>
            </button>
          </div>
        </div>

        {/* Contato Area */}
        <div className="mt-auto p-6 bg-black/20 border-t border-[#ffffff]/10">
          <div className="space-y-3 text-sm text-gray-300">
            <p className="font-bold text-white mb-2" style={{ fontFamily: "'Montserrat', sans-serif" }}>Contadora Fabi</p>
            <div className="flex items-center gap-2">
              <Mail size={16} className="text-[#4b9bb3]" />
              <span className="text-xs">fabicunhacont@gmail.com</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone size={16} className="text-[#4b9bb3]" />
              <span className="text-xs">(98) 99934-6905</span>
            </div>
            <div className="flex items-center gap-2">
              <Linkedin size={16} className="text-[#4b9bb3]" />
              <span className="text-xs">/in/faabicunha</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col h-full bg-white relative">
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 sm:px-6 shadow-sm z-10">
          <div className="flex items-center gap-3">
            <button className="md:hidden text-gray-500 hover:text-[#00237e]" onClick={() => setIsMenuOpen(true)}>
              <Menu size={24} />
            </button>
            <div className="flex flex-col">
              <h2 className="font-bold text-[#00237e]" style={{ fontFamily: "'Montserrat', sans-serif" }}>Assistente Virtual</h2>
              <span className="text-xs text-green-500 font-medium flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-green-500 inline-block"></span> Online
              </span>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 bg-gray-50/50">
          {messages.map((msg, index) => (
            <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`flex max-w-[85%] sm:max-w-[75%] gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                <div className="flex-shrink-0 mt-1">
                  {msg.role === 'user' ? (
                    <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center border border-gray-300">
                      <User size={16} className="text-gray-600" />
                    </div>
                  ) : (
                    <div className="w-10 h-10 bg-[#4b9bb3] rounded-full flex items-center justify-center shadow-md">
                      <Sparkles size={20} className="text-white" />
                    </div>
                  )}
                </div>

                <div 
                  className={`p-4 rounded-2xl ${
                    msg.role === 'user' 
                      ? 'bg-[#00237e] text-white rounded-tr-none shadow-sm' 
                      : 'bg-white text-[#000000] rounded-tl-none shadow-sm border border-gray-200'
                  }`}
                  style={{ whiteSpace: 'pre-line' }}
                >
                  {msg.text.split('\n').map((line, i) => {
                     let cleanLine = line.replace(/\*\*/g, '').replace(/\*/g, '• ').replace(/###/g, '').replace(/##/g, '').replace(/#/g, '');
                     return <p key={i} className="mb-2 last:mb-0 leading-relaxed">{cleanLine}</p>;
                  })}
                </div>
              </div>
            </div>
          ))}
          
          {isLoading && (
             <div className="flex justify-start">
               <div className="flex max-w-[85%] gap-3 flex-row">
                 <div className="flex-shrink-0 mt-1">
                   <div className="w-10 h-10 bg-[#4b9bb3] rounded-full flex items-center justify-center shadow-md">
                     <Sparkles size={20} className="text-white" />
                   </div>
                 </div>
                 <div className="p-4 rounded-2xl bg-white text-gray-700 rounded-tl-none shadow-sm border border-gray-200 flex items-center gap-2">
                    <div className="w-2 h-2 bg-[#4b9bb3] rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-[#4b9bb3] rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-2 h-2 bg-[#4b9bb3] rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                 </div>
               </div>
             </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="bg-white border-t border-gray-200 p-4 sm:px-6">
          <form id="chat-form" onSubmit={handleSendMessage} className="max-w-4xl mx-auto flex items-center gap-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Pergunte sobre tributos, abertura de empresa..."
              disabled={isLoading}
              className="flex-1 bg-gray-100 text-[#000000] placeholder-gray-500 rounded-full px-6 py-3 md:py-4 focus:outline-none focus:ring-2 focus:ring-[#4b9bb3] focus:bg-white transition-all border border-transparent disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="bg-[#4b9bb3] hover:bg-[#3a7a8d] text-white rounded-full p-3 md:p-4 transition-colors shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              <Send size={20} className="ml-1" />
            </button>
          </form>
          <div className="text-center mt-3">
             <p className="text-xs text-gray-400">Esta é uma IA educacional. Para decisões complexas, consulte oficialmente a Contadora Fabi.</p>
          </div>
        </div>
      </div>
    </div>
  );
}