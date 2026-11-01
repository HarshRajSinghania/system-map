// A stand-in for the host's SDK, so the app can run and be screenshotted on its own.
import { useEffect, useState } from 'react'

const sent: string[] = []
const listeners = new Set<() => void>()

async function reply<T>(response: Response): Promise<T> {
  if (!response.ok) throw new Error(`API ${response.status}: ${await response.text()}`)
  return response.json() as Promise<T>
}

const api = {
  get: <T,>(path: string) => fetch(path).then((response) => reply<T>(response)),
  post: <T,>(path: string, body?: unknown): Promise<T> => {
    if (path.startsWith('/api/chat/slots')) return Promise.resolve({ key: 'dev-slot' } as T)
    if (path.startsWith('/api/chat')) {
      sent.push((body as { message: string }).message)
      listeners.forEach((listener) => listener())
      return Promise.resolve({} as T)
    }
    return fetch(path, { method: 'POST', body: JSON.stringify(body) }).then((response) => reply<T>(response))
  },
}

export const useAppApi = () => api
export const useTheme = () => ({
  mode: document.documentElement.classList.contains('dark') ? ('dark' as const) : ('light' as const),
})
export const useAppInfo = () => ({ active: true })

export function ChatEmbed({ placeholder }: { placeholder?: string }) {
  const [, setCount] = useState(0)
  useEffect(() => {
    const update = () => setCount((count) => count + 1)
    listeners.add(update)
    return () => {
      listeners.delete(update)
    }
  }, [])
  return (
    <div data-testid="chat-embed" style={{ height: '100%', display: 'flex', flexDirection: 'column', fontSize: 13 }}>
      <div style={{ flex: 1, overflowY: 'auto' }}>
        {sent.map((message, index) => (
          <p key={index}>{message}</p>
        ))}
      </div>
      <input placeholder={placeholder} style={{ padding: 8 }} />
    </div>
  )
}
