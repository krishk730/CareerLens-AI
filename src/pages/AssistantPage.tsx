import React, { useState, useEffect, useRef } from 'react';
import {
  Bot,
  Send,
  User,
  Sparkles,
  Trash2,
  Loader2,
  Lightbulb,
  ArrowRight,
  CheckCircle2,
  FileText
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import { ChatMessage } from '../types/index';
import { sendChatMessage } from '../services/apiClient';
import {
  saveFirestoreChatMessage,
  getFirestoreChatHistory
} from '../lib/firestoreService';

const SUGGESTED_QUESTIONS = [
  'Review my current profile & resume score',
  'What should I learn to become a Data Analyst?',
  'Which skills am I missing for Full Stack Engineer?',
  'How do I prepare for technical coding interviews?',
  'Give me 2 portfolio project ideas with high recruiter impact'
];

export function AssistantPage() {
  const { userProfile, currentUser, isDemoUser } = useAuth();
  const { showToast } = useNotifications();

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: `Hello ${userProfile?.fullName?.split(' ')[0] || 'there'}! 👋 I am your **CareerLens AI Assistant**.\n\nI have context on your target career goal (**${userProfile?.careerGoal || 'Software Engineering'}**), your verified skills, and your latest resume metrics.\n\nHow can I help you today? You can ask me to review bullet points, build a study plan, or suggest project architectures.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (currentUser && !isDemoUser) {
      getFirestoreChatHistory(currentUser.uid).then(history => {
        if (history.length > 0) {
          setMessages(history);
        }
      }).catch(console.error);
    }
  }, [currentUser, isDemoUser]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSend = async (messageText: string) => {
    if (!messageText.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: `msg_${Date.now()}_u`,
      role: 'user',
      content: messageText.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const newHistory = [...messages, userMsg];
    setMessages(newHistory);
    setInput('');
    setLoading(true);

    if (currentUser && !isDemoUser) {
      saveFirestoreChatMessage(currentUser.uid, 'user', userMsg.content).catch(console.error);
    }

    try {
      const skillsArray = [
        ...(userProfile?.skills?.programmingLanguages || []),
        ...(userProfile?.skills?.frameworks || []),
        ...(userProfile?.skills?.databases || [])
      ];

      const res = await sendChatMessage(
        newHistory.map(m => ({ role: m.role, content: m.content })),
        userMsg.content,
        {
          fullName: userProfile?.fullName,
          targetRole: userProfile?.careerGoal,
          skills: skillsArray,
          resumeScore: 82,
          readinessScore: 78
        }
      );

      const aiMsg: ChatMessage = {
        id: `msg_${Date.now()}_a`,
        role: 'assistant',
        content: res.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, aiMsg]);

      if (currentUser && !isDemoUser) {
        saveFirestoreChatMessage(currentUser.uid, 'assistant', aiMsg.content).catch(console.error);
      }
    } catch (err: any) {
      console.error(err);
      const errorMsg: ChatMessage = {
        id: `msg_${Date.now()}_err`,
        role: 'assistant',
        content: 'I apologize, but I encountered a momentary connection issue. Please try sending your question again.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: 'welcome_reset',
        role: 'assistant',
        content: `Chat cleared! How else can I assist your career progression today?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
    showToast('Conversation reset.', 'info');
  };

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-140px)] flex flex-col bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-sm overflow-hidden">
      
      {/* Top Header */}
      <div className="px-6 py-3.5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white flex items-center justify-center shadow-xs">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              CareerLens AI Assistant
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </h2>
            <p className="text-[11px] text-slate-400">
              Personalized career, resume, and technical interview guidance
            </p>
          </div>
        </div>

        <button
          onClick={handleClearChat}
          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
          title="Clear Conversation"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Suggested Questions Bar */}
      <div className="px-6 py-2 bg-slate-50 dark:bg-slate-800/40 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2 overflow-x-auto shrink-0">
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider shrink-0 flex items-center gap-1">
          <Lightbulb className="w-3.5 h-3.5 text-amber-500" /> Prompt Ideas:
        </span>
        {SUGGESTED_QUESTIONS.map((q, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(q)}
            className="px-2.5 py-1 rounded-lg text-[11px] font-medium bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-purple-400 text-slate-700 dark:text-slate-300 hover:text-purple-600 dark:hover:text-purple-400 whitespace-nowrap transition cursor-pointer shrink-0 shadow-xs"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Chat Messages Body */}
      <div className="flex-1 p-6 overflow-y-auto space-y-4">
        {messages.map(msg => {
          const isUser = msg.role === 'user';
          return (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : ''}`}
            >
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-white font-bold text-xs shadow-xs ${
                  isUser
                    ? 'bg-blue-600'
                    : 'bg-gradient-to-tr from-purple-600 to-indigo-600'
                }`}
              >
                {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 text-xs leading-relaxed ${
                  isUser
                    ? 'bg-blue-600 text-white rounded-tr-none'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-tl-none whitespace-pre-wrap'
                }`}
              >
                {msg.content}
                <div
                  className={`text-[9px] mt-1.5 opacity-60 ${
                    isUser ? 'text-right text-blue-100' : 'text-slate-400'
                  }`}
                >
                  {msg.timestamp}
                </div>
              </div>
            </div>
          );
        })}

        {loading && (
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white flex items-center justify-center shrink-0">
              <Bot className="w-4 h-4" />
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-100 dark:bg-slate-800 rounded-tl-none flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-purple-600 dark:text-purple-400" />
              <span className="text-xs text-slate-500 font-medium">CareerLens AI is thinking...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input bar */}
      <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shrink-0">
        <form
          onSubmit={e => {
            e.preventDefault();
            handleSend(input);
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Ask anything about resume bullets, learning roadmaps, or interview prep..."
            className="flex-1 px-4 py-3 text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-purple-500 focus:outline-none dark:text-white"
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="p-3 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white rounded-xl shadow-md transition cursor-pointer"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>

    </div>
  );
}
