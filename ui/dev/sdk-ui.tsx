// A stand-in for the host's shared components, close enough to judge layout.
import type { ButtonHTMLAttributes, CSSProperties, HTMLAttributes, InputHTMLAttributes, ReactNode } from 'react'

export function Card({ style, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return <div {...rest} style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 10, padding: 16, ...style }} />
}

export function CardTitle(props: HTMLAttributes<HTMLHeadingElement>) {
  return <h3 {...props} style={{ margin: '0 0 12px', fontSize: 14, fontWeight: 600 }} />
}

export function Btn({ primary, danger: _danger, style, ...rest }: ButtonHTMLAttributes<HTMLButtonElement> & { primary?: boolean; danger?: boolean }) {
  return (
    <button
      {...rest}
      style={{
        padding: '4px 10px',
        borderRadius: 6,
        fontSize: 13,
        cursor: 'pointer',
        border: `1px solid ${primary ? 'var(--accent)' : 'var(--border)'}`,
        background: primary ? 'var(--accent)' : 'transparent',
        color: primary ? 'var(--accent-fg)' : 'var(--text)',
        ...style,
      }}
    />
  )
}

const BADGE: Record<string, CSSProperties> = {
  ok: { background: 'rgba(22, 163, 74, .14)', color: '#15803d' },
  err: { background: 'rgba(220, 38, 38, .14)', color: 'var(--danger)' },
  warn: { background: 'rgba(217, 119, 6, .14)', color: 'var(--warn-text)' },
  aim: { background: 'var(--accent-subtle)', color: 'var(--accent)' },
  muted: { background: 'var(--bg-hover)', color: 'var(--muted)' },
}

export function Badge({ variant, style, ...rest }: HTMLAttributes<HTMLSpanElement> & { variant: string }) {
  return <span {...rest} style={{ padding: '2px 8px', borderRadius: 99, fontSize: 12, ...BADGE[variant], ...style }} />
}

export function Input({ style, ...rest }: InputHTMLAttributes<HTMLInputElement>) {
  return <input {...rest} style={{ padding: '6px 8px', background: 'var(--bg-elevated)', color: 'var(--text)', border: '1px solid var(--border)', borderRadius: 6, ...style }} />
}

export function SearchInput(props: InputHTMLAttributes<HTMLInputElement>) {
  return <Input {...props} />
}

export function PageHeader({ title, subtitle, actions }: { title: ReactNode; subtitle?: string; actions?: ReactNode }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 16px 12px' }}>
      <div>
        <h1 style={{ margin: 0, fontSize: 20 }}>{title}</h1>
        <p style={{ margin: 0, fontSize: 13, color: 'var(--muted)' }}>{subtitle}</p>
      </div>
      {actions}
    </div>
  )
}
