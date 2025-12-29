const OPENROUTER_BASE_URL = 'https://openrouter.ai/api/v1';

export type ChatMessage = {
  role: 'user' | 'assistant' | 'system';
  content: string;
};

export const streamChatCompletion = async (
  messages: ChatMessage[],
  onDelta: (text: string) => void,
  onDone: () => void,
  apiKey?: string
) => {
  const key = apiKey || import.meta.env.VITE_OPENROUTER_API_KEY;
  
  if (!key) {
    throw new Error('OpenRouter API key not configured. Please add VITE_OPENROUTER_API_KEY to your environment variables or enter your API key in the chat settings.');
  }

  const response = await fetch(`${OPENROUTER_BASE_URL}/chat/completions`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${key}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': window.location.origin,
      'X-Title': 'Peaceful AI',
    },
    body: JSON.stringify({
      model: 'mistralai/mistral-7b-instruct:free',
      messages: [
        {
          role: 'system',
          content: `You are Peaceful AI, a helpful coding assistant. You help users write, debug, and understand code. 
          You provide clear explanations and working code examples. Format code blocks with proper syntax highlighting using markdown.`
        },
        ...messages
      ],
      stream: true,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    try {
      const parsed = JSON.parse(error);
      throw new Error(parsed.error?.message || 'OpenRouter API error');
    } catch {
      throw new Error(`OpenRouter API error: ${error}`);
    }
  }

  const reader = response.body?.getReader();
  if (!reader) throw new Error('No response body');

  const decoder = new TextDecoder();
  let buffer = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });

    const lines = buffer.split('\n');
    buffer = lines.pop() || '';

    for (const line of lines) {
      if (line.startsWith('data: ')) {
        const data = line.slice(6).trim();
        if (data === '[DONE]') {
          onDone();
          return;
        }
        try {
          const parsed = JSON.parse(data);
          const content = parsed.choices?.[0]?.delta?.content;
          if (content) onDelta(content);
        } catch {
          // Ignore parse errors for incomplete JSON
        }
      }
    }
  }

  onDone();
};
