'use client';
import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { MessageSquare, Loader2 } from 'lucide-react';

interface Props {
  inventorId:   string;
  patentId:     string;
  patentTitle:  string;
}

export function ContactInventorButton({ inventorId, patentId, patentTitle }: Props) {
  const { data: session } = useSession();
  const router = useRouter();
  const [open,    setOpen]    = useState(false);
  const [message, setMessage] = useState(`Hi, I'm interested in "${patentTitle}". Could we discuss the details?`);
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!session) { router.push('/login'); return; }
    setLoading(true);
    try {
      const res = await fetch('/api/messages', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ content: message, receiverId: inventorId, patentId }),
      });
      if (!res.ok) throw new Error();
      toast.success('Message sent to inventor!');
      setOpen(false);
    } catch {
      toast.error('Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        id="contact-inventor-btn"
        onClick={() => session ? setOpen(true) : router.push('/login')}
        className="btn-gold w-full flex items-center justify-center gap-2 py-3"
      >
        <MessageSquare className="w-4 h-4" /> Contact Inventor
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={() => setOpen(false)}>
          <div className="glass border-gold-glow rounded-2xl p-6 w-full max-w-md space-y-4 animate-fade-in" onClick={e => e.stopPropagation()}>
            <h3 className="font-semibold text-lg">Send a Message</h3>
            <p className="text-sm text-muted-foreground">Regarding: <span className="text-foreground">{patentTitle}</span></p>
            <textarea
              id="contact-message-input"
              value={message}
              onChange={e => setMessage(e.target.value)}
              rows={5}
              className="input-dark resize-none"
            />
            <div className="flex gap-3">
              <button onClick={() => setOpen(false)} className="btn-outline-gold flex-1">Cancel</button>
              <button
                id="send-message-btn"
                onClick={handleSend}
                disabled={loading || !message.trim()}
                className="btn-gold flex-1 flex items-center justify-center gap-2"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Send'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
