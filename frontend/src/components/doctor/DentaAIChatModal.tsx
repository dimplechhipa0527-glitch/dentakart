import React, { useState } from 'react';
import { Sparkles, Send, Bot, User, X, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const DentaAIChatModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Array<{ sender: 'ai' | 'user'; text: string; link?: string }>>([
    {
      sender: 'ai',
      text: 'Hello Dr.! I am DentaAI, your clinical product advisor. How can I assist your clinic procurement today? Ask me about composite shades, rotary file RPM, bonding agents, or disinfection protocols.'
    }
  ]);
  const [input, setInput] = useState('');

  if (!isOpen) return null;

  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg = input.trim();
    setMessages((prev) => [...prev, { sender: 'user', text: userMsg }]);
    setInput('');

    setTimeout(() => {
      let reply = 'For universal anterior and posterior restorations with highest polish retention, 3M Filtek Z350 XT (Nanocomposite) is the industry benchmark. For quick bulk curing (up to 4mm), we recommend Ivoclar Tetric N-Ceram Bulk Fill.';
      let link = '/products?category=composite';

      if (userMsg.toLowerCase().includes('endo') || userMsg.toLowerCase().includes('file') || userMsg.toLowerCase().includes('canal')) {
        reply = 'For curved and calcified canals, Dentsply ProTaper Gold 25mm offers superior cyclic fatigue resistance. Pair it with Septodont Canal+ 17% EDTA gel for smooth lubrication.';
        link = '/products?category=files';
      } else if (userMsg.toLowerCase().includes('glove') || userMsg.toLowerCase().includes('disinfect')) {
        reply = 'Karam Nitrile powder-free gloves (AQL 1.5) provide puncture resistance without latex allergy. For chair surface asepsis, Bactoclean 30-sec rapid spray is aldehyde-free and safe on rexine.';
        link = '/products?category=infection-control';
      }

      setMessages((prev) => [...prev, { sender: 'ai', text: reply, link }]);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col h-[520px] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-teal-700 to-cyan-700 text-white">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-sm">Ask DentaAI — Clinical Assistant</h3>
              <p className="text-[11px] text-teal-100">B2B Material Selection & Technical Recommender</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-white/10 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Message Thread */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-slate-50/50 dark:bg-slate-950/50">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex gap-2.5 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {m.sender === 'ai' && (
                <div className="w-7 h-7 rounded-full bg-teal-600 text-white flex items-center justify-center shrink-0 mt-0.5">
                  <Bot className="w-4 h-4" />
                </div>
              )}
              <div
                className={`max-w-[80%] rounded-2xl p-3 text-xs leading-relaxed ${
                  m.sender === 'user'
                    ? 'bg-teal-600 text-white rounded-br-none'
                    : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 rounded-bl-none shadow-sm'
                }`}
              >
                {m.text}
                {m.link && (
                  <button
                    onClick={() => {
                      onClose();
                      navigate(m.link!);
                    }}
                    className="mt-2.5 inline-flex items-center gap-1 text-[11px] font-bold text-teal-600 dark:text-teal-400 hover:underline"
                  >
                    View Recommended Supplies <ArrowRight className="w-3 h-3" />
                  </button>
                )}
              </div>
              {m.sender === 'user' && (
                <div className="w-7 h-7 rounded-full bg-slate-700 text-white flex items-center justify-center shrink-0 mt-0.5">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-3 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask DentaAI: e.g. 'Best adhesive for zirconia crowns?'"
            className="flex-1 bg-slate-100 dark:bg-slate-800 text-xs px-3.5 py-2.5 rounded-xl border border-transparent focus:border-teal-500 focus:bg-white dark:focus:bg-slate-900 outline-none"
          />
          <button
            onClick={handleSend}
            className="bg-teal-600 hover:bg-teal-700 text-white p-2.5 rounded-xl transition"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
