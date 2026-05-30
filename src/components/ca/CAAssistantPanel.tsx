"use client";

import { useState } from "react";
import { MessageCircle, Send, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";

const SUGGESTIONS = [
  "この学生どうフォローすべき？",
  "面接対策どうする？",
  "ガクチカ深掘り案は？",
];

const MOCK_REPLIES: Record<string, string> = {
  default:
    "担当学生の最新メモと温度感を踏まえ、まずは短いLINEで近況確認→次の面談日程を押さえるのがおすすめです。",
  面接:
    "志望動機の一貫性を確認し、過去のガクチカから「再現性のある強み」1つに絞って話す練習を3回繰り返しましょう。",
  ガクチカ:
    "行動→困難→工夫→結果の順で深掘りし、数値と感情の両方を入れると説得力が上がります。",
};

function pickMockReply(question: string): string {
  if (question.includes("面接")) return MOCK_REPLIES["面接"];
  if (question.includes("ガクチカ")) return MOCK_REPLIES["ガクチカ"];
  return MOCK_REPLIES.default;
}

interface Message {
  role: "user" | "assistant";
  text: string;
}

interface CAAssistantPanelProps {
  className?: string;
  studentName?: string;
}

export function CAAssistantPanel({
  className,
  studentName,
}: CAAssistantPanelProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);

  const send = async (text: string) => {
    const q = text.trim();
    if (!q) return;
    setInput("");
    setMessages((m) => [...m, { role: "user", text: q }]);
    setThinking(true);
    await new Promise((r) => setTimeout(r, 600));
    const prefix = studentName ? `【${studentName}】` : "";
    setMessages((m) => [
      ...m,
      {
        role: "assistant",
        text: `${prefix}${pickMockReply(q)}（モック応答・将来OpenAI連携）`,
      },
    ]);
    setThinking(false);
  };

  return (
    <div
      className={cn(
        "flex h-full min-h-0 flex-col border-l border-border bg-background",
        className
      )}
    >
      <div className="shrink-0 border-b border-border px-4 py-3">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-accent" strokeWidth={1.75} />
          <p className="text-sm font-semibold text-foreground">AIアシスタント</p>
        </div>
        <p className="mt-1 text-[11px] text-foreground-muted">
          CA専用・質問にすぐ答えます
        </p>
      </div>

      <div className="ca-scroll-pane space-y-3 p-3">
        {messages.length === 0 && (
          <div className="space-y-2">
            <p className="text-xs text-foreground-muted">例をタップ</p>
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => void send(s)}
                className="block w-full rounded-lg border border-border/80 bg-background-subtle/50 px-3 py-2 text-left text-xs text-foreground-secondary transition-colors hover:border-accent/30 hover:bg-accent-subtle/40"
              >
                {s}
              </button>
            ))}
          </div>
        )}
        {messages.map((msg, i) => (
          <div
            key={i}
            className={cn(
              "rounded-lg px-3 py-2 text-xs leading-relaxed",
              msg.role === "user"
                ? "ml-4 bg-accent text-white"
                : "mr-2 bg-background-subtle text-foreground-secondary"
            )}
          >
            {msg.text}
          </div>
        ))}
        {thinking && (
          <p className="text-xs text-foreground-muted">考え中...</p>
        )}
      </div>

      <div className="shrink-0 border-t border-border p-3">
        <div className="flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                void send(input);
              }
            }}
            placeholder="質問を入力..."
            className="min-w-0 flex-1 rounded-lg border border-border bg-white px-3 py-2 text-xs outline-none focus:border-accent"
          />
          <Button
            type="button"
            size="sm"
            onClick={() => void send(input)}
            disabled={thinking || !input.trim()}
            aria-label="送信"
          >
            <Send className="h-3.5 w-3.5" />
          </Button>
        </div>
        <p className="mt-2 flex items-center gap-1 text-[10px] text-foreground-muted">
          <MessageCircle className="h-3 w-3" />
          OpenAI連携は今後実装
        </p>
      </div>
    </div>
  );
}
