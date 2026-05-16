'use client';
import React, { useState } from 'react';

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ text: string; isUser: boolean }[]>([
    { text: "Hi! How can I help you today?", isUser: false }
  ]);

  const handleFAQ = (question: string, answer: string) => {
    setMessages(prev => [...prev, { text: question, isUser: true }]);
    setTimeout(() => {
      setMessages(prev => [...prev, { text: answer, isUser: false }]);
    }, 500);
  };

  const faqs = [
    { q: "How to post a property?", a: "To post a property, sign up as a Seller, then click the 'Post Property' button in the navigation bar." },
    { q: "Are there any listing fees?", a: "Basic listings are free! We also offer premium features for better visibility." },
    { q: "How do I contact an owner?", a: "Click on any property listing to view the owner's contact details or use the inquiry form." }
  ];

  return (
    <div style={{ position: 'fixed', bottom: '1.5rem', right: '1.5rem', zIndex: 50 }}>
      {isOpen ? (
        <div style={{
          width: '300px',
          backgroundColor: '#fff',
          border: '1px solid #ccc',
          borderRadius: '8px',
          boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }}>
          <div style={{ backgroundColor: '#005b9f', color: '#fff', padding: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontWeight: 'bold' }}>ZameenMarket Assistant</span>
            <button onClick={() => setIsOpen(false)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', fontSize: '16px' }}>&times;</button>
          </div>
          <div style={{ padding: '10px', height: '250px', overflowY: 'auto', backgroundColor: '#f9f9f9', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {messages.map((msg, i) => (
              <div key={i} style={{
                alignSelf: msg.isUser ? 'flex-end' : 'flex-start',
                backgroundColor: msg.isUser ? '#005b9f' : '#e0e0e0',
                color: msg.isUser ? '#fff' : '#000',
                padding: '6px 10px',
                borderRadius: '6px',
                maxWidth: '80%',
                fontSize: '14px'
              }}>
                {msg.text}
              </div>
            ))}
          </div>
          <div style={{ padding: '10px', borderTop: '1px solid #ddd', backgroundColor: '#fff', display: 'flex', flexDirection: 'column', gap: '5px' }}>
            <span style={{ fontSize: '12px', color: '#666' }}>Suggested questions:</span>
            {faqs.map((faq, i) => (
              <button
                key={i}
                onClick={() => handleFAQ(faq.q, faq.a)}
                style={{
                  background: 'none',
                  border: '1px solid #005b9f',
                  color: '#005b9f',
                  padding: '4px 8px',
                  borderRadius: '4px',
                  fontSize: '12px',
                  cursor: 'pointer',
                  textAlign: 'left'
                }}
              >
                {faq.q}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          style={{
            width: '3.5rem',
            height: '3.5rem',
            backgroundColor: '#005b9f',
            color: 'white',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
            border: 'none',
            cursor: 'pointer',
            transition: 'transform 0.2s',
          }}
          onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
          onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
          </svg>
        </button>
      )}
    </div>
  );
}
