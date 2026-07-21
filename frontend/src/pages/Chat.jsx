import React, { useState, useEffect, useRef } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import { MOCK_MESSAGES, MOCK_USERS } from '../utils/mockData';
import { useAuth } from '../context/AuthContext';
import { Send, Smile, Paperclip, MoreVertical, ShieldAlert, ArrowLeft } from 'lucide-react';

export default function Chat() {
  const { user } = useAuth();
  const [messages, setMessages] = useState(MOCK_MESSAGES);
  const [activePartner, setActivePartner] = useState(MOCK_USERS[0]); // Default to Charan
  const [inputText, setInputText] = useState('');
  const [typing, setTyping] = useState(false);
  const [showMobileChat, setShowMobileChat] = useState(false);
  const messageEndRef = useRef(null);

  const email = user?.email || "nandini@email.com";

  // Filter messages for current partner
  const filteredMessages = messages.filter(m => 
    (m.sender_email === email && m.receiver_email === activePartner.email) ||
    (m.sender_email === activePartner.email && m.receiver_email === email)
  );

  useEffect(() => {
    // Scroll to bottom
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, activePartner, showMobileChat]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const newMsg = {
      id: `m-new-${Date.now()}`,
      sender_email: email,
      receiver_email: activePartner.email,
      message: inputText.trim(),
      is_read: true,
      created_at: new Date().toISOString()
    };

    setMessages(prev => [...prev, newMsg]);
    setInputText('');

    // Trigger mock responder typing & reply
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      const reply = {
        id: `m-reply-${Date.now()}`,
        sender_email: activePartner.email,
        receiver_email: email,
        message: `Sounds great! I've logged the schedule. Looking forward to our swap session!`,
        is_read: false,
        created_at: new Date().toISOString()
      };
      setMessages(prev => [...prev, reply]);
    }, 1500);
  };

  return (
    <DashboardLayout>
      {/* 2-Column Split Workspace */}
      <div className="h-[calc(100vh-10rem)] bg-white border border-slate-100 rounded-3xl overflow-hidden flex shadow-sm">
        {/* Left column - Rooms list */}
        <div className={`w-full md:w-80 border-r border-slate-100 flex flex-col shrink-0 ${showMobileChat ? 'hidden md:flex' : 'flex'}`}>
          <div className="p-4 border-b border-slate-100 bg-slate-50/50">
            <h2 className="text-base font-bold text-slate-800 font-outfit">Conversations</h2>
          </div>
          <div className="flex-1 overflow-y-auto divide-y divide-slate-50">
            {MOCK_USERS.map((u) => (
              <button
                key={u.id}
                onClick={() => {
                  setActivePartner(u);
                  setShowMobileChat(true);
                }}
                className={`w-full p-4 flex items-center gap-3 hover:bg-slate-50/80 transition-colors text-left ${
                  activePartner.id === u.id ? 'bg-indigo-50/40 border-l-4 border-brand-indigo' : ''
                }`}
              >
                <div className="relative">
                  <img src={u.avatar} alt={u.full_name} className="w-10 h-10 rounded-xl object-cover" />
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-brand-teal rounded-full ring-2 ring-white"></span>
                </div>
                <div className="overflow-hidden flex-1">
                  <div className="flex justify-between items-center">
                    <p className="text-sm font-bold text-slate-800 truncate">{u.full_name}</p>
                    <span className="text-[10px] text-slate-400">10:30 AM</span>
                  </div>
                  <p className="text-xs text-slate-500 truncate mt-0.5">Let's meet at 4 PM...</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Right column - Message dialog */}
        <div className={`flex-1 flex flex-col min-w-0 bg-slate-50/20 ${!showMobileChat ? 'hidden md:flex' : 'flex'}`}>
          {/* Chat Room Header */}
          <div className="px-4 sm:px-6 py-3.5 bg-white border-b border-slate-100 flex justify-between items-center shadow-sm">
            <div className="flex items-center gap-2 sm:gap-3">
              <button 
                onClick={() => setShowMobileChat(false)}
                className="md:hidden p-1.5 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
                aria-label="Back to conversations"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <img src={activePartner.avatar} alt={activePartner.full_name} className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl object-cover" />
              <div>
                <p className="text-sm font-bold text-slate-800 font-outfit">{activePartner.full_name}</p>
                <p className="text-xs text-brand-teal font-semibold">Online</p>
              </div>
            </div>
            <button className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-50">
              <MoreVertical className="w-5 h-5" />
            </button>
          </div>

          {/* Messages display viewport */}
          <div className="flex-1 p-6 overflow-y-auto space-y-4">
            {filteredMessages.map((m) => {
              const isSelf = m.sender_email === email;
              return (
                <div key={m.id} className={`flex ${isSelf ? 'justify-end' : 'justify-start'} animate-scale-up`}>
                  <div className={`max-w-md p-4 rounded-2xl text-sm shadow-sm ${
                    isSelf 
                      ? 'bg-brand-indigo text-white rounded-br-none' 
                      : 'bg-white border border-slate-100 text-slate-800 rounded-bl-none'
                  }`}>
                    <p>{m.message}</p>
                    <p className={`text-[9px] mt-1 text-right ${isSelf ? 'text-white/60' : 'text-slate-400'}`}>
                      {new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              );
            })}
            
            {/* Typing status bubble */}
            {typing && (
              <div className="flex justify-start">
                <div className="bg-white border border-slate-100 p-3 rounded-2xl rounded-bl-none flex gap-1 items-center">
                  <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></span>
                  <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                  <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                </div>
              </div>
            )}
            <div ref={messageEndRef}></div>
          </div>

          {/* Inputs controller bar */}
          <form onSubmit={handleSend} className="p-4 bg-white border-t border-slate-100 flex gap-4 items-center">
            <button type="button" className="p-2 text-slate-400 hover:text-slate-600 rounded-lg">
              <Paperclip className="w-5 h-5" />
            </button>
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={`Send message to ${activePartner.full_name}...`}
              className="flex-grow px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-brand-indigo"
            />
            <button type="button" className="p-2 text-slate-400 hover:text-slate-600 rounded-lg">
              <Smile className="w-5 h-5" />
            </button>
            <button
              type="submit"
              className="w-10 h-10 rounded-xl bg-brand-indigo hover:bg-brand-indigo/90 text-white flex items-center justify-center shadow-lg shadow-brand-indigo/25 transition-all"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
}
