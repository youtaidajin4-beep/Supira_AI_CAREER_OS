import Link from "next/link";
import { cn } from "@/lib/utils/cn";

interface EntityLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
}

export function EntityLink({ href, children, className }: EntityLinkProps) {
  return (
    <Link
      href={href}
      className={cn(
        "font-medium text-accent hover:text-accent-hover hover:underline",
        className
      )}
    >
      {children}
    </Link>
  );
}
