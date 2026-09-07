'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import { Sparkles, Send, X } from 'lucide-react';
import { useAuth } from '@/lib/AuthContext';

type Message = { role: 'user' | 'model'; content: string };

export default function GeminiAssistant() {
  const pathname = usePathname();
  const { isAuthModalOpen } = useAuth();
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

  // Hide on apparel section or whenever Auth modal/sheet is open
  if (pathname?.startsWith('/apparel') || isAuthModalOpen) {
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
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsOpen(true)}
            aria-label="Open AI Assistant"
            style={{
              position: 'fixed',
              bottom: 'calc(env(safe-area-inset-bottom, 0px) + 152px)',
              right: 20,
              zIndex: 8999,
              background: 'none',
              border: 'none',
              padding: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
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
            transition={{ type: 'spring', damping: 26, stiffness: 350 }}
            style={{
              position: 'fixed',
              bottom: 20,
              right: 20,
              zIndex: 10000,
              width: 'calc(100vw - 40px)',
              maxWidth: 380,
              height: 580,
              maxHeight: 'calc(100vh - 100px)',
              backgroundColor: 'rgba(255, 255, 255, 0.88)',
              backdropFilter: 'blur(30px) saturate(190%)',
              WebkitBackdropFilter: 'blur(30px) saturate(190%)',
              border: '1px solid rgba(255, 255, 255, 0.8)',
              borderRadius: 28,
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
              boxShadow: '0 25px 60px rgba(0, 0, 0, 0.14), 0 2px 10px rgba(0, 0, 0, 0.04)',
            }}
          >
            {/* Header (Apple Glass Style) */}
            <div style={{
              padding: '16px 20px',
              borderBottom: '1px solid rgba(0, 0, 0, 0.06)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              backgroundColor: 'rgba(255, 255, 255, 0.4)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{
                  width: 32,
                  height: 32,
                  borderRadius: 10,
                  backgroundColor: '#1D1D1F',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
                }}>
                  <Sparkles size={16} color="#FFFFFF" />
                </div>
                <div>
                  <h3 style={{
                    fontFamily: 'var(--font-jakarta)',
                    fontSize: 15,
                    fontWeight: 800,
                    margin: 0,
                    color: '#1D1D1F',
                    letterSpacing: '-0.02em',
                  }}>
                    Silk Assistant
                  </h3>
                  <span style={{ fontSize: 11, color: '#10B981', fontWeight: 600 }}>Active</span>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                aria-label="Close assistant"
                style={{
                  background: 'rgba(0, 0, 0, 0.05)',
                  border: 'none',
                  color: '#1D1D1F',
                  cursor: 'pointer',
                  width: 28,
                  height: 28,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'background 0.2s',
                }}
              >
                <X size={16} strokeWidth={2.5} />
              </button>
            </div>

            {/* Messages Container */}
            <div style={{
              flex: 1,
              overflowY: 'auto',
              padding: 20,
              display: 'flex',
              flexDirection: 'column',
              gap: 14,
            }}>
              {messages.map((m, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start' }}>
                  <div style={{
                    maxWidth: '84%',
                    padding: '12px 16px',
                    borderRadius: 20,
                    backgroundColor: m.role === 'user' ? '#1D1D1F' : 'rgba(255, 255, 255, 0.95)',
                    color: m.role === 'user' ? '#FFFFFF' : '#1D1D1F',
                    fontFamily: 'var(--font-general)',
                    fontSize: 13.5,
                    lineHeight: 1.5,
                    border: m.role === 'user' ? 'none' : '1px solid rgba(0, 0, 0, 0.06)',
                    boxShadow: m.role === 'user'
                      ? '0 4px 14px rgba(0, 0, 0, 0.15)'
                      : '0 2px 8px rgba(0, 0, 0, 0.03)',
                    borderBottomRightRadius: m.role === 'user' ? 4 : 20,
                    borderBottomLeftRadius: m.role === 'model' ? 4 : 20,
                  }}>
                    {m.role === 'user' ? (
                      m.content
                    ) : (
                      <div className="markdown-body" style={{ margin: 0, color: '#1D1D1F' }}>
                        <ReactMarkdown>{m.content}</ReactMarkdown>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                  <div style={{
                    padding: '12px 16px',
                    borderRadius: 20,
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    border: '1px solid rgba(0, 0, 0, 0.06)',
                    display: 'flex',
                    gap: 5,
                    alignItems: 'center',
                  }}>
                    <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1.2 }} style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: '#1D1D1F' }} />
                    <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1.2, delay: 0.2 }} style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: '#1D1D1F' }} />
                    <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1.2, delay: 0.4 }} style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: '#1D1D1F' }} />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Form (Apple Liquid Glass Style) */}
            <form onSubmit={sendMessage} style={{
              padding: '14px 18px',
              borderTop: '1px solid rgba(0, 0, 0, 0.06)',
              backgroundColor: 'rgba(255, 255, 255, 0.5)',
              display: 'flex',
              gap: 8,
              alignItems: 'center',
            }}>
              <input
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Ask about design, print, drops..."
                style={{
                  flex: 1,
                  background: 'rgba(0, 0, 0, 0.04)',
                  border: '1px solid rgba(0, 0, 0, 0.06)',
                  borderRadius: 100,
                  padding: '11px 18px',
                  color: '#1D1D1F',
                  fontFamily: 'var(--font-general)',
                  fontSize: 13.5,
                  outline: 'none',
                }}
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  border: 'none',
                  backgroundColor: input.trim() && !isLoading ? '#1D1D1F' : 'rgba(0, 0, 0, 0.06)',
                  color: input.trim() && !isLoading ? '#FFFFFF' : '#A1A1A6',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: input.trim() && !isLoading ? 'pointer' : 'default',
                  transition: 'all 0.2s',
                  boxShadow: input.trim() && !isLoading ? '0 2px 8px rgba(0,0,0,0.12)' : 'none',
                }}
              >
                <Send size={16} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
