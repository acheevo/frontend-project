export type AIProvider = 'claude' | 'codex' | 'gemini'

export interface AIPrompt {
  provider: AIProvider
  prompt: string
  model?: string
}

export interface AIResult {
  provider: AIProvider
  result: string
}

export class ManagedAIError extends Error {
  constructor(readonly status: number, message: string) {
    super(message)
    this.name = 'ManagedAIError'
  }
}

interface RunOptions {
  /** The app's authenticated AI endpoint or the URL from a Nimbus preview token. */
  runURL: string
  /** An app user token or a short-lived preview token held in memory. */
  token: string
  signal?: AbortSignal
}

export async function runAI(prompt: AIPrompt, { runURL, token, signal }: RunOptions): Promise<AIResult> {
  const response = await fetch(runURL, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(prompt),
    signal,
  })
  if (!response.ok) {
    const body = await response.json().catch(() => null) as { error?: string } | null
    throw new ManagedAIError(response.status, body?.error ?? `AI request failed (${response.status})`)
  }
  return await response.json() as AIResult
}
