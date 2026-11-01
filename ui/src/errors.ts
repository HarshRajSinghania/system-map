// Turn a failed call into a sentence a person can act on. Raw response text never reaches the screen.

interface ApiFailure {
  status?: number
  body?: string
  message?: string
}

const MESSAGE = /^API (\d{3}): ([\s\S]*)$/

function parts(caught: unknown): { status: number | null; body: string } {
  const failure = (caught ?? {}) as ApiFailure
  if (typeof failure.status === 'number') return { status: failure.status, body: failure.body ?? '' }
  const match = MESSAGE.exec(typeof failure.message === 'string' ? failure.message : '')
  return match ? { status: Number(match[1]), body: match[2] } : { status: null, body: '' }
}

/** The backend words its own 400s and 404s for people, so those can be shown as they are. */
function ownWords(body: string): string | null {
  try {
    const parsed = JSON.parse(body) as { error?: unknown }
    return typeof parsed.error === 'string' && parsed.error ? parsed.error : null
  } catch {
    return null
  }
}

/** `doing` finishes the sentence "Couldn't ...", as in "load this project". */
export function plainError(caught: unknown, doing: string): string {
  const { status, body } = parts(caught)
  if (status === null) return `Couldn't ${doing}. Check the dashboard is still connected, then try again.`
  if (status === 400 || status === 404) {
    const words = ownWords(body)
    if (words) return words
  }
  if (status === 401 || status === 403) {
    return `Couldn't ${doing}, because System Map isn't allowed to. Check its permissions on its Details page.`
  }
  if (status >= 500) return `Couldn't ${doing}, because System Map's backend isn't answering. Try again in a moment.`
  return `Couldn't ${doing}. Try again.`
}
