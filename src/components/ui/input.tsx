import { cn } from "@/lib/utils/cn";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hint?: string;
}

export function Input({ label, hint, className, id, ...props }: InputProps) {
  const inputId = id ?? label?.replace(/\s/g, "-").toLowerCase();

  return (
    <div className="space-y-1.5">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-xs font-medium text-foreground-secondary"
        >
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={cn(
          "h-9 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground shadow-xs transition-colors placeholder:text-foreground-muted/60 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20",
          className
        )}
        {...props}
      />
      {hint && <p className="text-xs text-foreground-muted">{hint}</p>}
    </div>
  );
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
}

export function Select({ label, className, id, children, ...props }: SelectProps) {
  const selectId = id ?? label?.replace(/\s/g, "-").toLowerCase();

  return (
    <div className="space-y-1.5">
      {label && (
        <label
          htmlFor={selectId}
          className="block text-xs font-medium text-foreground-secondary"
        >
          {label}
        </label>
      )}
      <select
        id={selectId}
        className={cn(
          "h-9 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground shadow-xs transition-colors focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20",
          className
        )}
        {...props}
      >
        {children}
      </select>
    </div>
  );
}

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
}

export function Textarea({ label, className, id, ...props }: TextareaProps) {
  const textareaId = id ?? label?.replace(/\s/g, "-").toLowerCase();

  return (
    <div className="space-y-1.5">
      {label && (
        <label
          htmlFor={textareaId}
          className="block text-xs font-medium text-foreground-secondary"
        >
          {label}
        </label>
      )}
      <textarea
        id={textareaId}
        className={cn(
          "w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm leading-relaxed text-foreground shadow-xs transition-colors placeholder:text-foreground-muted/60 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20",
          className
        )}
        {...props}
      />
    </div>
  );
}
