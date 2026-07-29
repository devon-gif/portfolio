"use client";

import { useCallback, useEffect, useState, type FormEvent } from "react";
import { MessageCircle, Send, X } from "lucide-react";
import { listMessages, sendMessage, subscribeToChanges, type ChatMessageRecord } from "@/lib/review";

export default function ChatPanel({ currentUser, organizationId }: { currentUser: "Devon" | "Emma"; organizationId?: string }) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessageRecord[]>([]);
  const [body, setBody] = useState("");
  const [busy, setBusy] = useState(false);
  const refresh = useCallback(() => { listMessages({ organizationId }).then(setMessages).catch(console.error); }, [organizationId]);

  useEffect(() => { refresh(); return subscribeToChanges(organizationId, refresh); }, [organizationId, refresh]);

  async function submit(event: FormEvent) {
    event.preventDefault();
    const text = body.trim();
    if (!text || busy) return;
    setBusy(true);
    try { await sendMessage({ organizationId, senderName: currentUser, body: text }); setBody(""); refresh(); }
    catch { window.alert("This message could not be sent."); }
    finally { setBusy(false); }
  }

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className="fixed bottom-5 right-5 z-40 inline-flex items-center gap-2 rounded-full border border-white/70 bg-[#6f4b56] px-5 py-3 text-sm font-semibold text-white shadow-2xl">
        <MessageCircle className="h-4 w-4" /> Messages <span className="rounded-full bg-white/20 px-2 py-0.5 text-xs">{messages.length}</span>
      </button>
      {open && (
        <aside className="fixed bottom-4 right-4 z-50 flex h-[min(620px,calc(100vh-32px))] w-[min(390px,calc(100vw-32px))] flex-col overflow-hidden rounded-3xl border border-white/80 bg-[#fffaf2]/98 shadow-2xl">
          <header className="flex items-center justify-between border-b border-[#dfd3c4] px-5 py-4">
            <div><strong className="block text-[#2b241f]">Devon + Emma</strong><span className="text-xs text-[#817668]">Creative collaboration</span></div>
            <button type="button" onClick={() => setOpen(false)} aria-label="Close messages"><X className="h-5 w-5 text-[#6d6155]" /></button>
          </header>
          <div className="flex-1 space-y-3 overflow-y-auto p-4">
            {messages.length === 0 && <p className="py-8 text-center text-sm text-[#8a8071]">No messages yet.</p>}
            {messages.map((message) => {
              const mine = message.sender === currentUser;
              return <div key={message.id} className={`flex ${mine ? "justify-end" : "justify-start"}`}><div className={`max-w-[82%] rounded-2xl px-4 py-3 ${mine ? "bg-[#6f4b56] text-white" : "border border-white bg-white/75 text-[#2b241f]"}`}><strong className="text-xs opacity-75">{message.sender}</strong><p className="mt-1 whitespace-pre-wrap text-sm leading-relaxed">{message.body}</p><time className="mt-2 block text-[10px] opacity-60">{new Date(message.createdAt).toLocaleString()}</time></div></div>;
            })}
          </div>
          <form onSubmit={submit} className="flex gap-2 border-t border-[#dfd3c4] p-3">
            <textarea value={body} onChange={(e) => setBody(e.target.value)} placeholder={`Message ${currentUser === "Devon" ? "Emma" : "Devon"}…`} className="min-h-12 flex-1 resize-none rounded-xl border border-[#d9cbb8] bg-white/80 px-3 py-2 text-sm text-[#2b241f] outline-none focus:border-[#a9812f]" />
            <button disabled={busy} className="grid h-12 w-12 place-items-center rounded-xl bg-[#a9812f] text-white disabled:opacity-50"><Send className="h-4 w-4" /></button>
          </form>
        </aside>
      )}
    </>
  );
}
