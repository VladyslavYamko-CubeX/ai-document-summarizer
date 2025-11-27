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
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Generating summary...</CardTitle>
          <CardDescription>Hold tight while we talk to OpenAI.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="h-4 w-1/2" />
        </CardContent>
      </Card>
    );
  }

  if (!summary) return null;

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Summary</CardTitle>
        {originalCharacters !== undefined && (
          <CardDescription>
            Original length: {originalCharacters.toLocaleString()} characters
          </CardDescription>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          {summary.split("\n\n").map((paragraph, idx) => (
            <p key={idx} className="text-muted-foreground leading-relaxed">
              {paragraph}
            </p>
          ))}
        </div>
        {bullets && bullets.length > 0 && (
          <div>
            <p className="font-semibold mb-2">Key points</p>
            <ul className="list-disc space-y-1 pl-5 text-muted-foreground">
              {bullets.map((bullet, idx) => (
                <li key={idx}>{bullet}</li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
