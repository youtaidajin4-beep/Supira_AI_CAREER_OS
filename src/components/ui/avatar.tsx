import { cn } from "@/lib/utils/cn";

interface AvatarProps {
  name: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeMap = {
  sm: "h-8 w-8 text-xs",
  md: "h-10 w-10 text-sm",
  lg: "h-12 w-12 text-base",
};

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}

const hueFromName = (name: string) => {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash % 360);
};

export function Avatar({ name, size = "md", className }: AvatarProps) {
  const hue = hueFromName(name);

  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-center rounded-full font-semibold text-white shadow-xs",
        sizeMap[size],
        className
      )}
      style={{
        background: `linear-gradient(135deg, hsl(${hue} 45% 48%), hsl(${(hue + 30) % 360} 50% 42%))`,
      }}
      aria-hidden
    >
      {getInitials(name)}
    </div>
  );
}
