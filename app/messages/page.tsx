'use client';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { formatDate } from '@/lib/utils';
import { cn } from '@/lib/utils';
import { Send, MessageSquare, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

interface Message {
  id:        string;
  content:   string;
  read:      boolean;
  createdAt: string;
  sender:    { id: string; name: string | null; image: string | null };
  receiver:  { id: string; name: string | null; image: string | null };
  patent?:   { id: string; title: string } | null;
}

export default function MessagesPage() {
  const { data: session } = useSession();
  const [messages,  setMessages]  = useState<Message[]>([]);
  const [loading,   setLoading]   = useState(true);
  const [selected,  setSelected]  = useState<string | null>(null);
  const [reply,     setReply]     = useState('');
  const [sending,   setSending]   = useState(false);
  const userId = (session?.user as any)?.id;

  useEffect(() => {
    fetch('/api/messages')
      .then(r => r.json())
      .then(d => { setMessages(d); if (d.length > 0) setSelected(d[0].id); })
      .finally(() => setLoading(false));
  }, []);

  // Group by conversation partner + patent
  const conversations = messages.reduce((acc: Record<string, Message[]>, msg) => {
    const partner = msg.sender.id === userId ? msg.receiver.id : msg.sender.id;
    const key = `${partner}_${msg.patent?.id ?? 'general'}`;
    if (!acc[key]) acc[key] = [];
    acc[key].push(msg);
    return acc;
  }, {});

  const convKeys = Object.keys(conversations);
  const selectedConv = selected ? conversations[selected] ?? [] : [];
  const activeKey = convKeys.find(k => conversations[k].some(m => m.id === selected || k === selected));

  const sendReply = async () => {
    if (!reply.trim() || !activeKey) return;
    setSending(true);
    const conv = conversations[activeKey];
    const partner = conv[0].sender.id === userId ? conv[0].receiver.id : conv[0].sender.id;
    try {
      const res = await fetch('/api/messages', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ content: reply, receiverId: partner, patentId: conv[0].patent?.id }),
      });
      const data = await res.json();
      setMessages(prev => [data, ...prev]);
      setReply('');
      toast.success('Message sent!');
    } catch {
      toast.error('Failed to send message.');
    } finally {
      setSending(false);
    }
  };

  if (loading) return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-display mb-8">Messages</h1>
      <div className="glass rounded-2xl h-[500px] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-gold-400" />
      </div>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-display mb-8">
        Your <span className="text-gold-gradient">Messages</span>
      </h1>

      {convKeys.length === 0 ? (
        <div className="glass rounded-2xl p-16 text-center space-y-3">
          <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto" />
          <h3 className="text-xl font-semibold">No messages yet</h3>
          <p className="text-muted-foreground">When you contact an inventor, your conversations will appear here.</p>
        </div>
      ) : (
        <div className="glass rounded-2xl overflow-hidden flex h-[600px]">
          {/* Sidebar */}
          <div className="w-72 border-r border-white/5 flex flex-col overflow-hidden">
            <div className="p-4 border-b border-white/5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Conversations
            </div>
            <div className="flex-1 overflow-y-auto">
              {convKeys.map(key => {
                const conv   = conversations[key];
                const last   = conv[0];
                const partner = last.sender.id === userId ? last.receiver : last.sender;
                const isActive = key === activeKey;
                return (
                  <button
                    key={key}
                    id={`conv-${key}`}
                    onClick={() => setSelected(key)}
                    className={cn(
                      'w-full text-left p-4 border-b border-white/5 transition-colors hover:bg-white/3',
                      isActive && 'bg-gold-500/8 border-l-2 border-l-gold-500'
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-gold-500/20 border border-gold-500/20 flex items-center justify-center text-gold-400 text-sm font-bold shrink-0">
                        {partner.name?.[0]?.toUpperCase() ?? '?'}
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-sm truncate">{partner.name}</p>
                        {last.patent && <p className="text-xs text-gold-400 truncate">{last.patent.title}</p>}
                        <p className="text-xs text-muted-foreground truncate">{last.content}</p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Chat area */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {activeKey ? (
              <>
                {/* Header */}
                <div className="p-4 border-b border-white/5">
                  {conversations[activeKey][0].patent && (
                    <p className="text-xs text-gold-400 font-medium">Re: {conversations[activeKey][0].patent?.title}</p>
                  )}
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 flex flex-col-reverse">
                  {conversations[activeKey].map(msg => {
                    const isMine = msg.sender.id === userId;
                    return (
                      <div key={msg.id} className={cn('flex', isMine ? 'justify-end' : 'justify-start')}>
                        <div className={cn('max-w-[70%] rounded-2xl px-4 py-2.5 text-sm', isMine ? 'bg-gold-500/20 text-foreground rounded-br-sm' : 'glass rounded-bl-sm')}>
                          <p className="leading-relaxed">{msg.content}</p>
                          <p className="text-xs text-muted-foreground mt-1 text-right">{formatDate(msg.createdAt)}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Reply input */}
                <div className="p-4 border-t border-white/5 flex gap-3">
                  <textarea
                    id="reply-input"
                    value={reply}
                    onChange={e => setReply(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendReply(); } }}
                    rows={2}
                    className="input-dark flex-1 resize-none text-sm"
                    placeholder="Type a message… (Enter to send)"
                  />
                  <button
                    id="send-reply-btn"
                    onClick={sendReply}
                    disabled={sending || !reply.trim()}
                    className="btn-gold px-4 flex items-center gap-2 self-end"
                  >
                    {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  </button>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-muted-foreground">
                Select a conversation
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
