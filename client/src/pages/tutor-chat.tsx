import { useState, useRef, useEffect } from "react";
import { Link, useRoute } from "wouter";
import { ChevronLeft, ArrowUp, Zap, HelpCircle, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTutorMessages, useTutorSessions } from "@/hooks/use-tutor";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

// Simulation of Socratic phases
type Phase = "exploring" | "hinting" | "revealing" | "complete";

export default function TutorChat() {
  const [, params] = useRoute("/tutor/:sessionId");
  const sessionId = params?.sessionId || null;

  const [phase, setPhase] = useState<Phase>("hinting");
  const [message, setMessage] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  const { messages, isLoading, sendMessage, isSending } = useTutorMessages(sessionId);
  // Auto create session if not exists logic can be handled in a dashboard, but for now we'll just display.


  const phases = [
    { id: "exploring", label: "탐색" },
    { id: "hinting", label: "힌트" },
    { id: "revealing", label: "설명" },
    { id: "complete", label: "완료" },
  ];

  return (
    <div className="flex flex-col min-h-[100dvh] bg-slate-50 dark:bg-slate-950 font-sans mx-auto max-w-md relative shadow-2xl overflow-hidden border-x border-slate-200 dark:border-slate-800">
      
      {/* Header */}
      <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 z-10 px-4 py-3 flex items-center gap-3">
        <Link href="/">
          <button className="p-2 -ml-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
            <ChevronLeft className="w-6 h-6 text-slate-700 dark:text-slate-300" />
          </button>
        </Link>
        <div className="flex-1">
          <h1 className="text-base font-bold text-blue-900 dark:text-blue-50 flex items-center gap-2">
            AI 튜터 세션
            <span className="text-[10px] bg-teal-50 text-teal-700 px-1.5 py-0.5 rounded font-bold border border-teal-200">수학</span>
          </h1>
        </div>
      </header>

      {/* Socratic Phase Navigation Bar */}
      <div className="bg-white dark:bg-slate-900 px-4 py-3 border-b border-slate-200 dark:border-slate-800 shadow-sm z-10">
        <div className="flex items-center justify-between relative">
          {/* Progress Line */}
          <div className="absolute left-4 right-4 top-1/2 -translate-y-1/2 h-1 bg-slate-100 dark:bg-slate-800 rounded-full z-0">
            <div className="h-full bg-blue-500 rounded-full transition-all duration-500" style={{ width: '50%' }}></div>
          </div>
          
          {/* Nodes */}
          {phases.map((p, index) => {
            const isActive = p.id === phase;
            const isPast = index < phases.findIndex(x => x.id === phase);
            
            return (
              <div key={p.id} className="relative z-10 flex flex-col items-center gap-1.5">
                <div className={cn(
                  "w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold border-2 transition-colors",
                  isActive ? "bg-white border-blue-900 text-blue-900 shadow-[0_0_0_3px_rgba(30,58,138,0.1)]" :
                  isPast ? "bg-blue-900 border-blue-900 text-white" :
                  "bg-slate-50 border-slate-200 text-slate-300 dark:bg-slate-800 dark:border-slate-700"
                )}>
                  {isPast ? <CheckCircle2 className="w-3 h-3" /> : index + 1}
                </div>
                <span className={cn(
                  "text-[10px] font-bold transition-colors",
                  isActive ? "text-blue-900" :
                  isPast ? "text-slate-500" : "text-slate-300"
                )}>
                  {p.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Chat Messages Area */}
      <main className="flex-1 overflow-y-auto p-4 space-y-6" ref={scrollRef}>
        
        {/* System Message / Context */}
        <div className="flex justify-center">
          <div className="bg-slate-200/50 dark:bg-slate-800/50 text-slate-500 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            문제 분석 완료 (수열의 일반항)
          </div>
        </div>

        {isLoading ? (
          <div className="text-center py-4 text-slate-500">대화 내용을 불러오는 중...</div>
        ) : messages.length === 0 ? (
          <div className="text-center py-10">
            <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300">어떤 부분이 헷갈리시나요?</h3>
            <p className="text-xs text-slate-500 mt-2">AI 튜터가 스스로 답을 찾을 수 있도록 도와줍니다.</p>
          </div>
        ) : (
          messages.map((msg) => (
            <div key={msg.id} className={cn("flex gap-3 max-w-[90%]", msg.role === "user" ? "ml-auto flex-row-reverse" : "")}>
              {msg.role !== "user" && (
                <div className="w-8 h-8 rounded-full bg-blue-900 flex items-center justify-center shrink-0 shadow-sm mt-1">
                  <span className="text-white text-[10px] font-bold tracking-wider">AI</span>
                </div>
              )}
              <div className="space-y-1.5 min-w-0">
                <div className={cn(
                  "p-3.5 shadow-sm text-sm leading-relaxed whitespace-pre-wrap break-words border",
                  msg.role === "user" 
                    ? "bg-teal-600 text-white rounded-2xl rounded-tr-none border-teal-700" 
                    : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 rounded-2xl rounded-tl-none"
                )}>
                  {msg.content}
                </div>
                <div className={cn("text-[10px] text-slate-400 font-medium px-1", msg.role === "user" ? "text-right" : "")}>
                  {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          ))
        )}

      </main>

      {/* Quick Action Chips */}
      <div className="px-4 py-2 flex gap-2 overflow-x-auto scrollbar-hide bg-slate-50 dark:bg-slate-950 border-t border-slate-100 dark:border-slate-800">
        <button 
          className="shrink-0 flex items-center gap-1.5 bg-white border border-slate-200 text-slate-600 text-xs font-bold py-1.5 px-3 rounded-full shadow-sm hover:bg-slate-50 disabled:opacity-50"
          onClick={() => {
             setPhase("exploring");
             if (sessionId) sendMessage({ role: "user", content: "이 문제를 풀기 위해 어디서부터 시작해야 할지 잘 모르겠어요." });
          }}
          disabled={!sessionId || isSending}
        >
          <HelpCircle className="w-3.5 h-3.5" />
          잘 모르겠어요
        </button>
        <button 
          className="shrink-0 flex items-center gap-1.5 bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold py-1.5 px-3 rounded-full shadow-sm hover:bg-blue-100 disabled:opacity-50"
          onClick={() => {
             setPhase("revealing");
             if (sessionId) sendMessage({ role: "user", content: "힌트를 조금 더 주실 수 있나요?" });
          }}
          disabled={!sessionId || isSending}
        >
          <Zap className="w-3.5 h-3.5" />
          힌트 더 주세요
        </button>
      </div>

      {/* Input Area */}
      <form 
        className="bg-white dark:bg-slate-900 px-4 py-3 pb-safe-offset-3 border-t border-slate-200 dark:border-slate-800"
        onSubmit={(e) => {
          e.preventDefault();
          if (!message.trim() || !sessionId || isSending) return;
          sendMessage({ role: "user", content: message });
          setMessage("");
        }}
      >
        <div className="relative flex items-center">
          <input 
            type="text" 
            placeholder={!sessionId ? "세션 연결 중..." : "메시지를 입력하세요..."} 
            className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-full py-3.5 pl-5 pr-12 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            disabled={!sessionId || isSending}
          />
          <button 
            type="submit"
            disabled={!message.trim() || !sessionId || isSending}
            className="absolute right-2 w-8 h-8 rounded-full bg-blue-900 flex items-center justify-center text-white shadow-sm hover:scale-105 active:scale-95 transition-transform disabled:opacity-50"
          >
            <ArrowUp className="w-4 h-4" />
          </button>
        </div>
      </form>

    </div>
  );
}
