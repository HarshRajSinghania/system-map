// The host supplies these at runtime, and they are not published to npm.
declare module '@kirocrew/app-sdk' {
  import type { ReactNode } from 'react'

  export interface AppApi {
    get<T>(path: string, init?: RequestInit): Promise<T>
    post<T = unknown>(path: string, body?: unknown, init?: RequestInit): Promise<T>
  }
  export function useAppApi(): AppApi
  export function useTheme(): { mode: 'light' | 'dark' }
  export function useAppInfo(): { active?: boolean }
  export function ChatEmbed(props: {
    slotKey: string
    frameless?: boolean
    startAtBottom?: boolean
    placeholder?: string
    aboveComposer?: ReactNode
  }): JSX.Element
}

declare module '@kirocrew/app-sdk/ui' {
  import type { ButtonHTMLAttributes, HTMLAttributes, InputHTMLAttributes, ReactNode } from 'react'

  export function Card(props: HTMLAttributes<HTMLDivElement>): JSX.Element
  export function CardTitle(props: HTMLAttributes<HTMLHeadingElement>): JSX.Element
  export function Btn(props: ButtonHTMLAttributes<HTMLButtonElement> & { primary?: boolean; danger?: boolean }): JSX.Element
  export function Badge(props: HTMLAttributes<HTMLSpanElement> & { variant: 'ok' | 'err' | 'warn' | 'aim' | 'muted' }): JSX.Element
  export function SearchInput(props: InputHTMLAttributes<HTMLInputElement>): JSX.Element
  export function Input(props: InputHTMLAttributes<HTMLInputElement>): JSX.Element
  export function PageHeader(props: { title: ReactNode; subtitle?: string; actions?: ReactNode }): JSX.Element
}
