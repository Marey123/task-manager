export const TaskStatus = {
  PENDING: 'pending',
  ACTIVE: 'active',
  DONE: 'done',
} as const

export type TaskStatus = (typeof TaskStatus)[keyof typeof TaskStatus]

export type TaskColor = 'pink' | 'fuchsia' | 'rose' | 'violet' | 'sky' | 'emerald'
export type TaskIcon = '🦄' | '🌸' | '🌷' | '✨' | '💖' | '🎀' | '🌈' | '⭐'

export type Task = {
  id: string
  title: string
  startTime: string
  durationMinutes: number
  status: TaskStatus
  color: TaskColor
  icon: TaskIcon
  createdAt: string
  updatedAt: string
}

export type TaskFormValues = {
  title: string
  startTime: string
  color: TaskColor
  icon: TaskIcon
}
