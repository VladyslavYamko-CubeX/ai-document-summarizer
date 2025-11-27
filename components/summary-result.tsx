"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface SummaryResultProps {
  loading?: boolean;
  summary?: string;
  bullets?: string[];
  originalCharacters?: number;
}

export function SummaryResult({ loading, summary, bullets, originalCharacters }: SummaryResultProps) {
  if (loading) {
    return (
      <Card className="mt-10 border border-border/70 bg-surface/85">
        <CardHeader>
          <CardTitle className="text-[clamp(1.4rem,2vw,1.8rem)]">Generating summary…</CardTitle>
          <CardDescription className="text-base text-muted-foreground/85">
            Hold tight while we gather the most important insights.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-4 w-3/4" />
        </CardContent>
      </Card>
    );
  }

  if (!summary) return null;

  const paragraphs = summary.split("\n\n");

  return (
    <Card className="mt-10 border border-border/70 bg-surface/95 transition-all duration-500 animate-in fade-in-50 slide-in-from-bottom-4">
      <CardHeader className="gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <CardTitle className="text-[clamp(1.6rem,2.2vw,2.1rem)] leading-tight">Summary</CardTitle>
          {originalCharacters !== undefined && (
            <span className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-secondary/60 px-3 py-1 text-xs font-medium text-secondary-foreground">
              Original: {originalCharacters.toLocaleString()} characters
            </span>
          )}
        </div>
        <CardDescription className="text-base text-muted-foreground/85">
          Most relevant ideas distilled with clear bullet points you can copy into release notes, briefs, or client updates.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        <div className="space-y-4 text-[1.05rem] leading-relaxed text-foreground/90">
          {paragraphs.map((paragraph, idx) => (
            <p key={idx}>{paragraph}</p>
          ))}
        </div>
        {bullets && bullets.length > 0 && (
          <div className="rounded-[var(--radius)] border border-border/70 bg-secondary/40 p-5">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-muted-foreground/80">
              Key points
            </p>
            <ul className="grid gap-3 text-sm text-foreground/85 sm:grid-cols-2">
              {bullets.map((bullet, idx) => (
                <li key={idx} className="flex items-start gap-2 leading-relaxed">
                  <span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary" />
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
