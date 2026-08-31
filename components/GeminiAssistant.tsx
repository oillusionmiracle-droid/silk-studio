'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import { Sparkles, Send, X } from 'lucide-react';

type Message = { role: 'user' | 'model'; content: string };

export default function GeminiAssistant() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', content: "Hi there! I'm the Silk Studio AI assistant. How can I help you today?" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  useEffect(() => {
    const handleOpen = () => setIsOpen(true);
    window.addEventListener('open-gemini-chat', handleOpen);
    return () => window.removeEventListener('open-gemini-chat', handleOpen);
  }, []);

  // Hide on apparel section per user request
  if (pathname?.startsWith('/apparel')) {
    return null;
  }

  const sendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;

    const newMessages = [...messages, { role: 'user' as const, content: input }];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages })
      });

      if (!res.body) throw new Error('No body in response');

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let modelResponse = '';

      setMessages([...newMessages, { role: 'model', content: '' }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        modelResponse += decoder.decode(value, { stream: true });
        setMessages([...newMessages, { role: 'model', content: modelResponse }]);
      }
    } catch (error) {
      console.error(error);
      setMessages([...newMessages, { role: 'model', content: "Sorry, I'm having trouble connecting right now. Please try again later." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            onClick={() => setIsOpen(true)}
            aria-label="Open AI Assistant"
            style={{
              position: 'fixed',
              bottom: 'calc(env(safe-area-inset-bottom, 0px) + 152px)',
              right: 20,
              zIndex: 9999,
              background: 'none',
              border: 'none',
              padding: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer',
            }}
          >
            <img src="/icons/chat.png" alt="AI Assistant" width={52} height={52} style={{ objectFit: 'contain' }} />
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            style={{
              position: 'fixed', bottom: 20, right: 20, zIndex: 10000,
              width: 'calc(100vw - 40px)', maxWidth: 380, height: 600, maxHeight: 'calc(100vh - 120px)',
              backgroundColor: 'rgba(13, 13, 13, 0.95)', backdropFilter: 'blur(16px)',
              border: '1px solid rgba(255,255,255,0.1)', borderRadius: 24,
              display: 'flex', flexDirection: 'column', overflow: 'hidden',
              boxShadow: '0 24px 64px rgba(0,0,0,0.5)',
            }}
          >
            <div style={{ padding: '16px 20px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <Sparkles size={16} color="#C6FF33" />
                <h3 style={{ fontFamily: 'var(--font-jakarta)', fontSize: 16, fontWeight: 700, margin: 0, color: '#fff' }}>Silk Assistant</h3>
              </div>
              <button onClick={() => setIsOpen(false)} style={{ background: 'none', border: 'none', color: '#888', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <X size={20} />
              </button>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', padding: 20, display: 'flex', flexDirection: 'column', gap: 16 }}>
              {messages.map((m, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start' }}>
                  <div style={{
                    maxWidth: '85%', padding: '12px 16px', borderRadius: 16,
                    backgroundColor: m.role === 'user' ? '#C6FF33' : 'rgba(255,255,255,0.05)',
                    color: m.role === 'user' ? '#0D0D0D' : '#ffffff',
                    fontFamily: 'var(--font-general)', fontSize: 14, lineHeight: 1.5,
                    borderBottomRightRadius: m.role === 'user' ? 4 : 16,
                    borderBottomLeftRadius: m.role === 'model' ? 4 : 16,
                  }}>
                    {m.role === 'user' ? (
                      m.content
                    ) : (
                      <div className="markdown-body" style={{ margin: 0 }}>
                        <ReactMarkdown>{m.content}</ReactMarkdown>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                  <div style={{ padding: '12px 16px', borderRadius: 16, backgroundColor: 'rgba(255,255,255,0.05)', display: 'flex', gap: 4 }}>
                    <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1.4 }} style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: '#888' }} />
                    <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1.4, delay: 0.2 }} style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: '#888' }} />
                    <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1.4, delay: 0.4 }} style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: '#888' }} />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <form onSubmit={sendMessage} style={{ padding: '16px 20px', borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', gap: 10 }}>
              <input
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Ask about our services..."
                style={{ flex: 1, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 100, padding: '12px 20px', color: '#fff', fontFamily: 'var(--font-general)', fontSize: 14, outline: 'none' }}
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                style={{
                  width: 44, height: 44, borderRadius: '50%', border: 'none',
                  backgroundColor: input.trim() && !isLoading ? '#C6FF33' : 'rgba(255,255,255,0.1)',
                  color: input.trim() && !isLoading ? '#0D0D0D' : '#888',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: input.trim() && !isLoading ? 'pointer' : 'default',
                  transition: 'background 0.2s',
                }}
              >
                <Send size={18} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
