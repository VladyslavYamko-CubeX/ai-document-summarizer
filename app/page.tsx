"use client";

import { useMemo, useState } from "react";

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
    <main className="mx-auto flex min-h-screen max-w-5xl flex-col px-4 py-10">
      <div className="mb-10 space-y-2 text-center">
        <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Tech Demo</p>
        <h1 className="text-4xl font-bold">Document Summarizer</h1>
        <p className="text-muted-foreground">
          Upload a text or markdown file, drop in your own OpenAI API key, and get a clean summary in seconds.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Upload & Configure</CardTitle>
          <CardDescription>Files stay on-device. Your API key only lives in this session.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="file">
                Document (.txt or .md)
              </label>
              <Input id="file" type="file" accept=".txt,.md,.pdf" onChange={handleFileChange} />
              {fileName && <p className="text-xs text-muted-foreground">Loaded: {fileName}</p>}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="apiKey">
                OpenAI API key
              </label>
              <Input
                id="apiKey"
                type="password"
                placeholder="sk-..."
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">The key is only sent with this request.</p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <label className="text-sm font-medium">Summary length</label>
              <Select value={length} onValueChange={(value) => setLength(value as SummaryLength)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select length" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="short">Short</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="long">Long</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Tone</label>
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
            <div className="space-y-2">
              <label className="text-sm font-medium">Preview</label>
              <Textarea readOnly value={preview} placeholder="Upload a file to see a preview" className="h-[120px]" />
              <p className="text-xs text-muted-foreground">Showing the first {PREVIEW_LENGTH.toLocaleString()} characters.</p>
            </div>
          </div>

          {error && (
            <Alert className="border-destructive/50 bg-destructive/5 text-destructive">
              <div className="flex items-start">
                <AlertIcon variant="error" />
                <div>
                  <AlertTitle>Request error</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </div>
              </div>
            </Alert>
          )}

          <div className="flex items-center justify-between gap-4">
            <div className="text-xs text-muted-foreground">
              We never store your key. It is forwarded only with this request to OpenAI via the API route.
            </div>
            <Button onClick={handleSummarize} disabled={disableSummarize}>
              {loading ? "Summarizing..." : "Summarize"}
            </Button>
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

