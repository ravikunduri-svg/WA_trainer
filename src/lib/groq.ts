const GROQ_BASE = "https://api.groq.com/openai/v1";
const MODEL = "llama-3.3-70b-versatile";

type Message = { role: "system" | "user" | "assistant"; content: string };

export async function groqChat(
  messages: Message[],
  options: { maxTokens?: number; system?: string } = {}
): Promise<string> {
  const allMessages: Message[] = [];
  if (options.system) {
    allMessages.push({ role: "system", content: options.system });
  }
  allMessages.push(...messages);

  const res = await fetch(`${GROQ_BASE}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model: MODEL,
      messages: allMessages,
      max_tokens: options.maxTokens ?? 1024,
      temperature: 0.3,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Groq API error ${res.status}: ${err}`);
  }

  const data = await res.json();
  return data.choices?.[0]?.message?.content ?? "";
}
