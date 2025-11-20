
import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, Loader2, Image as ImageIcon, Paperclip } from 'lucide-react';
import { sendMessageToGemini } from '../services/geminiService';
import { ChatMessage } from '../types';

const FAQ_DATA = [
  { 
    id: 'pricing',
    label: 'Pricing?',
    keywords: ['price', 'cost', 'how much', 'pricing', 'expensive', 'money'], 
    answer: "Investments start at $2,500/mo for the Core System. Precise quotes require a diagnostic scan of your current infrastructure." 
  },
  { 
    id: 'services',
    label: 'Services?',
    keywords: ['service', 'what do you do', 'offer', 'products', 'what is this'], 
    answer: "We deploy AI SmartSites, manage Meta Ad campaigns (for free), and implement Neural Email Copywriting systems." 
  },
  { 
    id: 'timeline',
    label: 'How long?',
    keywords: ['how long', 'time', 'duration', 'fast', 'when'], 
    answer: "System deployment typically requires 10-14 days after the strategy alignment session." 
  },
  {
    id: 'guarantee',
    label: 'Guarantee?',
    keywords: ['guarantee', 'refund', 'results', 'risk'],
    answer: "We operate on a performance basis defined during your audit. If KPIs aren't met, we work for free until they are."
  }
];

const AIChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: 'System Online. I am AFA Bot. Please upload a screenshot of your current website for a visual diagnostic scan.', timestamp: Date.now() }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null); // Base64 string with mime type prefix
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [messages, isOpen]);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const clearImage = () => {
    setSelectedImage(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSend = async (textOverride?: string) => {
    const textToSend = typeof textOverride === 'string' ? textOverride : input;

    if ((!textToSend.trim() && !selectedImage) || loading) return;

    const currentImage = selectedImage;
    const currentInput = textToSend.trim();

    const userMsg: ChatMessage = { 
      role: 'user', 
      text: currentInput, 
      timestamp: Date.now(),
      image: currentImage || undefined
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setSelectedImage(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    setLoading(true);

    // Check for local FAQ match (Quick Answers)
    // We only use FAQ if there is no image attached, as images usually imply a request for analysis
    if (!currentImage) {
      const lowerInput = currentInput.toLowerCase();
      const faqMatch = FAQ_DATA.find(item => item.keywords.some(k => lowerInput.includes(k)));

      if (faqMatch) {
        setTimeout(() => {
          const botMsg: ChatMessage = { role: 'model', text: faqMatch.answer, timestamp: Date.now() };
          setMessages(prev => [...prev, botMsg]);
          setLoading(false);
        }, 600); // Artificial delay for natural feel
        return;
      }
    }

    try {
      // Convert internal ChatMessage format to Gemini history format
      const history = messages.map(m => {
        const parts: any[] = [];
        if (m.image) {
             parts.push({ text: "[User uploaded an image]" });
        }
        parts.push({ text: m.text || " " });
        return {
          role: m.role,
          parts: parts
        };
      });

      // Prepare image data if present
      let imageData = undefined;
      if (currentImage) {
        // Extract base64 data and mime type
        const matches = currentImage.match(/^data:(.+);base64,(.+)$/);
        if (matches && matches.length === 3) {
          imageData = {
            mimeType: matches[1],
            data: matches[2]
          };
        }
      }

      const responseText = await sendMessageToGemini(history, currentInput, imageData);
      
      const botMsg: ChatMessage = { role: 'model', text: responseText, timestamp: Date.now() };
      setMessages(prev => [...prev, botMsg]);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 md:bottom-6 md:right-6 z-50 flex flex-col items-end font-sans">
      {/* Chat Window */}
      {isOpen && (
        <div className="mb-2 md:mb-4 w-[calc(100vw-2rem)] md:w-96 h-[60vh] md:h-[500px] bg-black/90 border border-neon-blue/30 rounded-2xl shadow-[0_0_30px_rgba(0,243,255,0.15)] flex flex-col overflow-hidden backdrop-blur-xl transition-all duration-300 ease-out">
          
          {/* Header */}
          <div className="p-3 md:p-4 border-b border-gray-800 bg-gradient-to-r from-gray-900 to-black flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-neon-blue font-mono text-xs md:text-sm tracking-widest font-bold">AFA SYSTEM</span>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white transition-colors">
              <X size={18} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-3 md:p-4 space-y-3 md:space-y-4 scrollbar-thin scrollbar-thumb-gray-800 scrollbar-track-transparent">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-3 rounded-xl text-sm leading-relaxed ${
                  msg.role === 'user' 
                    ? 'bg-neon-blue/20 text-white border border-neon-blue/30' 
                    : 'bg-gray-800/50 text-gray-200 border border-gray-700'
                }`}>
                  {msg.role === 'model' && <Bot size={14} className="mb-1 text-neon-blue" />}
                  
                  {/* Render Image if present */}
                  {msg.image && (
                    <div className="mb-2 rounded-lg overflow-hidden border border-white/10">
                      <img src={msg.image} alt="User upload" className="w-full h-auto max-h-40 object-cover" />
                    </div>
                  )}
                  
                  {msg.text}
                </div>
              </div>
            ))}
            
            {/* Animated Typing/Processing Indicator */}
            {loading && (
              <div className="flex justify-start animate-fade-in-up">
                <div className="bg-gray-800/50 border border-gray-700 p-3 rounded-xl rounded-tl-none flex items-center gap-3 shadow-[0_0_10px_rgba(0,243,255,0.05)]">
                   <Bot size={16} className="text-neon-blue animate-pulse" />
                   <div className="flex flex-col gap-1">
                     <div className="flex gap-1 h-2 items-center mt-1">
                        <div className="w-1.5 h-1.5 bg-neon-blue/80 rounded-full animate-bounce [animation-delay:-0.3s]" />
                        <div className="w-1.5 h-1.5 bg-neon-blue/80 rounded-full animate-bounce [animation-delay:-0.15s]" />
                        <div className="w-1.5 h-1.5 bg-neon-blue/80 rounded-full animate-bounce" />
                     </div>
                     <span className="text-[9px] text-neon-blue/50 font-mono uppercase tracking-widest animate-pulse">Analyzing...</span>
                   </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* FAQ Quick Chips */}
          {messages.length < 4 && !loading && (
            <div className="px-3 pb-2 flex gap-2 overflow-x-auto scrollbar-none">
              {FAQ_DATA.map((faq) => (
                <button
                  key={faq.id}
                  onClick={() => handleSend(faq.label)}
                  className="text-[10px] md:text-xs border border-gray-700 bg-gray-900/80 text-gray-400 px-2 py-1 rounded-lg hover:border-neon-blue hover:text-neon-blue transition-colors whitespace-nowrap flex-shrink-0"
                >
                  {faq.label}
                </button>
              ))}
            </div>
          )}

          {/* Image Preview Area */}
          {selectedImage && (
            <div className="px-4 pt-2 bg-black/50 flex items-start">
              <div className="relative inline-block">
                <img src={selectedImage} alt="Preview" className="h-16 rounded-lg border border-neon-blue/50" />
                <button 
                  onClick={clearImage}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5 hover:bg-red-600"
                >
                  <X size={12} />
                </button>
              </div>
            </div>
          )}

          {/* Input */}
          <div className="p-3 md:p-4 border-t border-gray-800 bg-black/50">
            <div className="flex items-center gap-2">
              <input 
                type="file" 
                accept="image/*" 
                ref={fileInputRef} 
                onChange={handleFileSelect} 
                className="hidden" 
              />
              
              <button 
                onClick={triggerFileInput}
                className="text-gray-400 hover:text-neon-blue transition-colors p-2 hover:bg-white/5 rounded-lg"
                title="Upload Website Screenshot"
              >
                <ImageIcon size={20} />
              </button>

              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder={selectedImage ? "Add context..." : "Message..."}
                className="flex-1 bg-transparent border-none outline-none text-white text-sm placeholder-gray-600 focus:ring-0 min-w-0"
              />
              
              <button 
                onClick={() => handleSend()} 
                disabled={loading || (!input.trim() && !selectedImage)}
                className="text-neon-blue hover:text-white disabled:opacity-50 transition-colors p-2"
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group relative w-12 h-12 md:w-14 md:h-14 rounded-full bg-black border border-neon-blue/50 flex items-center justify-center shadow-[0_0_15px_rgba(0,243,255,0.3)] hover:shadow-[0_0_25px_rgba(0,243,255,0.6)] transition-all duration-300"
      >
        <div className="absolute inset-0 rounded-full border border-neon-blue opacity-0 group-hover:animate-ping" />
        {isOpen ? <X className="text-white" /> : <MessageSquare className="text-neon-blue" />}
      </button>
    </div>
  );
};

export default AIChatWidget;
