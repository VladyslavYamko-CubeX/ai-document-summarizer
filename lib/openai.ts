import OpenAI from 'openai';

export type SummaryLength = 'short' | 'medium' | 'long';
export type SummaryTone = 'neutral' | 'friendly' | 'formal';

const stripMarkdownCodeFences = (value: string) => {
	const trimmed = value.trim();
	if (!trimmed.startsWith('```')) {
		return trimmed;
	}

	const withoutOpening = trimmed.replace(/^```(?:[\w+-]+)?\s*/i, '');
	const withoutClosing = withoutOpening.replace(/```$/, '');
	return withoutClosing.trim();
};

export interface SummarizeParams {
	apiKey: string;
	content: string;
	length: SummaryLength;
	tone: SummaryTone;
}

const lengthGuidance: Record<SummaryLength, string> = {
	short: '3-4 concise sentences',
	medium: '1-2 paragraphs',
	long: '3-4 paragraphs with detail',
};

export async function summarizeWithOpenAI({
	apiKey,
	content,
	length,
	tone,
}: SummarizeParams) {
	const client = new OpenAI({ apiKey });

	console.log('[summarizeWithOpenAI] content', content);
	console.log('[summarizeWithOpenAI] client', client);

	const input = `You are a summarization assistant.
Return JSON with keys: summary (string) and bullets (array of strings with 3-7 bullet points).
Use a ${tone} tone and keep the summary to ${lengthGuidance[length]}.
Focus on the most important information without adding extra commentary.

Content to summarize:
"""
${content}
"""`;

	console.log('[summarizeWithOpenAI] input', JSON.stringify(input, null, 2));

	const response = await client.responses.create({
		model: 'gpt-4.1-mini',
		input,
		max_output_tokens: 800,
		text: { format: { type: 'json_object' } },
	});

	console.log('[summarizeWithOpenAI] response', response);

	const outputText = response.output_text;
	if (!outputText) {
		throw new Error('No response from OpenAI');
	}

	const sanitizedOutput = stripMarkdownCodeFences(outputText);

	const parsed = JSON.parse(sanitizedOutput) as {
		summary: string;
		bullets: string[];
	};

	console.log('[summarizeWithOpenAI] parsed', parsed);
	return parsed;
}
