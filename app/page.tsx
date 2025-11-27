"use client";

import { useMemo, useState } from "react";
import { ArrowRight, Sparkles } from "lucide-react";

import { SummaryResult } from "@/components/summary-result";
import { Alert, AlertDescription, AlertTitle, AlertIcon } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { readFileContent } from "@/lib/readFileContent";
import type { SummaryLength, SummaryTone } from "@/lib/openai";

const PREVIEW_LENGTH = 1200;

export default function Home() {
  const [fileName, setFileName] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [apiKey, setApiKey] = useState<string>("");
  const [length, setLength] = useState<SummaryLength>("medium");
  const [tone, setTone] = useState<SummaryTone>("neutral");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [summary, setSummary] = useState<string | undefined>(undefined);
  const [bullets, setBullets] = useState<string[] | undefined>(undefined);
  const [originalCharacters, setOriginalCharacters] = useState<number | undefined>(undefined);

  const preview = useMemo(() => content.slice(0, PREVIEW_LENGTH), [content]);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const text = await readFileContent(file);
      setFileName(file.name);
      setContent(text);
      setError(null);
    } catch (err) {
      console.error(err);
      setError((err as Error).message);
      setFileName("");
      setContent("");
    }
  };

  const handleSummarize = async () => {
    setError(null);
    setSummary(undefined);
    setBullets(undefined);
    setLoading(true);

    try {
      const response = await fetch("/api/summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ apiKey, content, length, tone })
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to summarize");
      }

      const data = (await response.json()) as {
        summary: string;
        bullets: string[];
        originalCharacters: number;
      };

      setSummary(data.summary);
      setBullets(data.bullets);
      setOriginalCharacters(data.originalCharacters);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const disableSummarize = !apiKey || !content || loading;

  return (
    <main className="mx-auto flex min-h-screen max-w-6xl flex-col gap-10 px-6 py-16">
      <div className="flex flex-col items-center gap-4 text-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-white/90 px-4 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.35em] text-purple-500 text-glow-subtle shadow-[0_10px_30px_rgba(15,23,42,0.12)]">
          <Sparkles className="h-3.5 w-3.5 text-primary" />
          Tech Demo
        </span>
        <h1 className="text-[length:var(--heading-xl)] font-semibold leading-tight text-balance text-surface-muted text-glow-hero">
          Document Summarizer
        </h1>
        <p className="max-w-2xl text-balance text-[length:var(--text-lg)] text-surface-muted/90 text-glow-subtle">
          Upload rich text or markdown, bring your own OpenAI API key, and generate an on-brand summary in seconds.
        </p>
      </div>

      <Card className="border border-border/70 bg-surface/95">
        <CardHeader className="pb-0">
          <CardTitle className="text-[var(--heading-lg)]">Upload &amp; Configure</CardTitle>
          <CardDescription className="text-base text-muted-foreground/80">
            Files stay on-device. Your API key is used once per request and never stored.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-3">
                  <label className="text-xs font-semibold uppercase tracking-[0.2em] text-foreground/70" htmlFor="file">
                    Document (.txt or .md)
                  </label>
                  <Input
                    id="file"
                    type="file"
                    accept=".txt,.md,.pdf"
                    onChange={handleFileChange}
                    className="cursor-pointer border-dashed border-border/80 bg-surface-muted/70"
                    
                  />
                  {fileName && (
                    <span className="inline-flex items-center gap-2 rounded-full bg-secondary px-3 py-1 text-xs text-secondary-foreground">
                      Loaded&nbsp;•&nbsp;{fileName}
                    </span>
                  )}
                </div>
                <div className="space-y-3">
                  <label className="text-xs font-semibold uppercase tracking-[0.2em] text-foreground/70" htmlFor="apiKey">
                    OpenAI API key
                  </label>
                  <Input
                    id="apiKey"
                    type="password"
                    placeholder="sk-..."
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                  />
                  <p className="text-xs text-foreground/60">Only sent to OpenAI from your browser.</p>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-3">
                  <label className="text-xs font-semibold uppercase tracking-[0.2em] text-foreground/70">Summary length</label>
                  <Select value={length} onValueChange={(value) => setLength(value as SummaryLength)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select length" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="short">Short • punchy</SelectItem>
                      <SelectItem value="medium">Medium • balanced</SelectItem>
                      <SelectItem value="long">Long • detailed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-3">
                  <label className="text-xs font-semibold uppercase tracking-[0.2em] text-foreground/70">Tone</label>
                  <Select value={tone} onValueChange={(value) => setTone(value as SummaryTone)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select tone" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="neutral">Neutral</SelectItem>
                      <SelectItem value="friendly">Friendly</SelectItem>
                      <SelectItem value="formal">Formal</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {error && (
                <Alert className="border-destructive/60 bg-destructive/5 text-destructive">
                  <div className="flex items-start gap-3">
                    <AlertIcon variant="error" />
                    <div>
                      <AlertTitle>Request error</AlertTitle>
                      <AlertDescription>{error}</AlertDescription>
                    </div>
                  </div>
                </Alert>
              )}

              <div className="flex flex-col gap-4 rounded-[var(--radius)] border border-dashed border-border/80 bg-surface-muted/40 px-5 py-4 text-sm text-muted-foreground/80 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm leading-relaxed">
                  We never store your documents or API key. Everything is processed in-browser and proxied through the secure API route.
                </p>
                <Button onClick={handleSummarize} disabled={disableSummarize} className="w-full sm:w-auto">
                  {loading ? (
                    "Summarizing..."
                  ) : (
                    <>
                      Summarize my document
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </Button>
              </div>
            </div>

            <div className="flex h-full flex-col rounded-[calc(var(--radius)+0.25rem)] border border-dashed border-border/60 bg-surface-muted/50 p-6 shadow-inner">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground/80">Preview</p>
                  <p className="text-sm text-muted-foreground/90">The first {PREVIEW_LENGTH.toLocaleString()} characters</p>
                </div>
                <span className="text-xs text-muted-foreground/70">{content.length.toLocaleString()} chars</span>
              </div>
              <Textarea
                readOnly
                value={preview}
                placeholder="Upload a file to see a preview"
                className="mt-4 h-full flex-1 border-none bg-transparent p-0 text-sm text-foreground/80 focus-visible:border-none focus-visible:ring-0 focus-visible:ring-offset-0"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <SummaryResult
        loading={loading}
        summary={summary}
        bullets={bullets}
        originalCharacters={originalCharacters}
      />
    </main>
  );
}

