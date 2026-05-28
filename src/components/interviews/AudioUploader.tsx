"use client";

import { useRef, useState } from "react";
import { Upload, FileAudio } from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface AudioUploaderProps {
  onFileSelect: (file: File) => void;
  disabled?: boolean;
  className?: string;
}

const ACCEPTED = "audio/*,.mp3,.mp4,.m4a,.wav,.webm,.ogg";

export function AudioUploader({
  onFileSelect,
  disabled,
  className,
}: AudioUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);

  const handleFile = (file: File) => {
    if (file.type.startsWith("audio/") || /\.(mp3|m4a|wav|webm|ogg|mp4)$/i.test(file.name)) {
      onFileSelect(file);
    }
  };

  return (
    <div
      className={cn(
        "relative rounded-xl border-2 border-dashed bg-background p-10 text-center transition-all duration-200",
        dragOver
          ? "border-accent bg-accent-subtle/50"
          : "border-border hover:border-accent/40 hover:bg-background-subtle/30",
        disabled && "pointer-events-none opacity-50",
        className
      )}
      onDragOver={(e) => {
        e.preventDefault();
        setDragOver(true);
      }}
      onDragLeave={() => setDragOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragOver(false);
        const file = e.dataTransfer.files[0];
        if (file) handleFile(file);
      }}
    >
      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-accent-subtle">
        <Upload className="h-6 w-6 text-accent" strokeWidth={1.75} />
      </div>
      <p className="text-sm font-medium text-foreground">
        音声ファイルをドロップ
      </p>
      <p className="mt-1.5 text-xs text-foreground-muted">
        MP3, M4A, WAV, WEBM など · 最大 25MB
      </p>
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="mt-5 inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white shadow-xs transition-all hover:bg-accent-hover active:scale-[0.98]"
      >
        <FileAudio className="h-4 w-4" />
        ファイルを選択
      </button>
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED}
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
        }}
      />
    </div>
  );
}
