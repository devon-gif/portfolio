"use client";

import Image from "next/image";
import { FormEvent, useEffect, useRef, useState } from "react";

type Message = {
  role: "user" | "assistant";
  content: string;
};

const STARTERS = [
  "Would Devon fit a Creative Technologist role?",
  "What has he actually built?",
  "Can he code beyond prototypes?",
  "What makes his hospitality background useful?",
];

export default function DevonAIClone() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Hi — I’m Devon AI, a portfolio guide built from Devon’s public professional work. Ask me about projects, technical depth, creative range, hospitality experience, or role fit.",
    },
  ]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [voiceOn, setVoiceOn] = useState(false);
  const [listening, setListening] = useState(false);
  const [status, setStatus] = useState("PUBLIC PORTFOLIO CONTEXT");
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [messages, busy]);

  function speak(text: string) {
    if (!voiceOn || typeof window === "undefined" || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.98;
    utterance.pitch = 1;
    utterance.onstart = () => setSpeaking(true);
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);
    window.speechSynthesis.speak(utterance);
  }

  async function ask(question: string) {
    const clean = question.trim();
    if (!clean || busy) return;

    const next = [...messages, { role: "user" as const, content: clean }];
    setMessages(next);
    setInput("");
    setBusy(true);
    setStatus("THINKING");

    try {
      const response = await fetch("/api/devon-ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next.slice(-10) }),
      });

      const data = (await response.json()) as { answer?: string; error?: string };
      if (!response.ok || !data.answer) {
        throw new Error(data.error || "The portfolio AI is unavailable right now.");
      }

      const answer = data.answer.trim();
      setMessages((current) => [...current, { role: "assistant", content: answer }]);
      setStatus("READY");
      speak(answer);
    } catch {
      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          content:
            "I’m having trouble reaching the portfolio model right now. You can still review the work below or contact Devon directly.",
        },
      ]);
      setStatus("OFFLINE");
    } finally {
      setBusy(false);
    }
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void ask(input);
  }

  function startListening() {
    if (typeof window === "undefined") return;
    const SpeechRecognition =
      (window as unknown as { SpeechRecognition?: any }).SpeechRecognition ||
      (window as unknown as { webkitSpeechRecognition?: any }).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setStatus("VOICE INPUT NOT SUPPORTED HERE");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.onstart = () => {
      setListening(true);
      setStatus("LISTENING");
    };
    recognition.onend = () => {
      setListening(false);
      setStatus("READY");
    };
    recognition.onerror = () => {
      setListening(false);
      setStatus("VOICE INPUT ERROR");
    };
    recognition.onresult = (event: any) => {
      const transcript = event.results?.[0]?.[0]?.transcript ?? "";
      if (transcript) void ask(transcript);
    };
    recognition.start();
  }

  return (
    <section className="db-ai" id="ask-devon" aria-label="Ask Devon AI">
      <div className={`db-ai-portrait ${speaking ? "is-speaking" : ""}`}>
        <div className="db-ai-orbit db-ai-orbit-one" />
        <div className="db-ai-orbit db-ai-orbit-two" />
        <div className="db-ai-image-wrap">
          <Image
            src="/infuse/brand/devon-archer-portrait.png"
            alt="Devon Archer"
            fill
            priority
            sizes="(max-width: 800px) 72vw, 420px"
          />
          <div className="db-ai-scan" />
        </div>
        <div className="db-ai-live">
          <span className="db-ai-live-dot" />
          AI PORTFOLIO GUIDE
        </div>
        <div className="db-ai-speaking" aria-hidden="true">
          <span />
          <span />
          <span />
          <span />
          <span />
        </div>
      </div>

      <div className="db-ai-console">
        <div className="db-ai-console-head">
          <div>
            <span className="db-mono">DEVON_AI / 01</span>
            <h2>Ask the portfolio.</h2>
          </div>
          <span className="db-ai-status">{status}</span>
        </div>

        <div className="db-ai-messages" aria-live="polite">
          {messages.map((message, index) => (
            <div className={`db-ai-message ${message.role}`} key={`${message.role}-${index}`}>
              <span>{message.role === "assistant" ? "DA" : "YOU"}</span>
              <p>{message.content}</p>
            </div>
          ))}
          {busy ? (
            <div className="db-ai-message assistant">
              <span>DA</span>
              <p className="db-ai-typing">Thinking<span>.</span><span>.</span><span>.</span></p>
            </div>
          ) : null}
          <div ref={endRef} />
        </div>

        <div className="db-ai-starters" aria-label="Suggested questions">
          {STARTERS.map((starter) => (
            <button type="button" onClick={() => void ask(starter)} key={starter}>
              {starter}
            </button>
          ))}
        </div>

        <form className="db-ai-form" onSubmit={submit}>
          <input
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder="Ask about role fit, projects, tools, process..."
            aria-label="Ask Devon AI a question"
            maxLength={600}
          />
          <button
            className={`db-ai-mic ${listening ? "is-listening" : ""}`}
            type="button"
            onClick={startListening}
            aria-label="Use voice input"
            title="Voice input"
          >
            {listening ? "•••" : "MIC"}
          </button>
          <button className="db-ai-send" type="submit" disabled={busy || !input.trim()}>
            ASK ↗
          </button>
        </form>

        <div className="db-ai-controls">
          <button
            type="button"
            className={voiceOn ? "is-on" : ""}
            onClick={() => {
              setVoiceOn((current) => {
                const next = !current;
                if (!next && typeof window !== "undefined" && "speechSynthesis" in window) {
                  window.speechSynthesis.cancel();
                  setSpeaking(false);
                }
                return next;
              });
            }}
          >
            <span />
            VOICE {voiceOn ? "ON" : "OFF"}
          </button>
          <p>AI guide, not the real Devon. Answers are limited to public professional portfolio context.</p>
        </div>
      </div>
    </section>
  );
}
