import { Card } from "@/components/ui/card";

export function CASupportSuggestions({
  suggestions,
}: {
  suggestions: string[];
}) {
  return (
    <Card className="p-5">
      <h3 className="mb-3 text-sm font-semibold text-foreground">AIサポート提案</h3>
      <ul className="space-y-2">
        {suggestions.map((s, i) => (
          <li
            key={i}
            className="rounded-lg bg-accent-subtle/50 px-3 py-2 text-sm text-foreground-secondary"
          >
            {s}
          </li>
        ))}
      </ul>
    </Card>
  );
}
