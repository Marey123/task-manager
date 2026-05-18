import { TaskStatus, type TaskColor, type TaskIcon } from '../features/tasks/types'

export const PAGE_HEIGHT = 620
export const PAGE_VERTICAL_PADDING = 48
export const SLOT_GAP = 16
export const DEFAULT_SLOT_HEIGHT = 170

export const MINUTES_IN_HOUR = 60
export const SECONDS_IN_MINUTE = 60
export const MILLISECONDS_IN_SECOND = 1000
export const CURRENT_TIME_UPDATE_INTERVAL_MS = 60_000

export const SLOT_INTERVAL_MINUTES = 30
export const DAY_START_TIME = '09:00'
export const DAY_END_TIME = '18:00'

export const TASK_STORAGE_KEY = 'task-manager.tasks.json'
export const DEFAULT_TASK_COLOR: TaskColor = 'pink'
export const DEFAULT_TASK_ICON: TaskIcon = '🦄'

export const REQUIRED_TASK_FIELD_TYPES = {
  id: 'string',
  title: 'string',
  startTime: 'string',
  durationMinutes: 'number',
  status: 'string',
  createdAt: 'string',
  updatedAt: 'string',
} as const

export const TASK_COLORS: TaskColor[] = [
  'pink',
  'fuchsia',
  'rose',
  'violet',
  'sky',
  'emerald',
]

export const TASK_ICONS: TaskIcon[] = ['🦄', '🌸', '🌷', '✨', '💖', '🎀', '🌈', '⭐']

export const TASK_COLOR_OPTIONS: {
  label: string
  value: TaskColor
  className: string
}[] = [
  { label: 'Pink', value: 'pink', className: 'bg-pink-400' },
  { label: 'Fuchsia', value: 'fuchsia', className: 'bg-fuchsia-400' },
  { label: 'Rose', value: 'rose', className: 'bg-rose-400' },
  { label: 'Violet', value: 'violet', className: 'bg-violet-400' },
  { label: 'Sky', value: 'sky', className: 'bg-sky-400' },
  { label: 'Emerald', value: 'emerald', className: 'bg-emerald-400' },
]

export const STATUS_CLASS_NAME: Record<TaskStatus, string> = {
  [TaskStatus.PENDING]: 'bg-pink-100 text-pink-950 ring-pink-300',
  [TaskStatus.ACTIVE]: 'bg-fuchsia-100 text-fuchsia-950 ring-fuchsia-300 animate-pulse',
  [TaskStatus.DONE]: 'bg-rose-100 text-rose-950 ring-rose-300',
}

export const CARD_CLASS_NAME: Record<TaskColor, string> = {
  pink: 'border-pink-300 bg-pink-50 shadow-pink-100',
  fuchsia: 'border-fuchsia-300 bg-fuchsia-50 shadow-fuchsia-100',
  rose: 'border-rose-300 bg-rose-50 shadow-rose-100',
  violet: 'border-violet-300 bg-violet-50 shadow-violet-100',
  sky: 'border-sky-300 bg-sky-50 shadow-sky-100',
  emerald: 'border-emerald-300 bg-emerald-50 shadow-emerald-100',
}

export const TIME_CLASS_NAME: Record<TaskColor, string> = {
  pink: 'text-pink-800',
  fuchsia: 'text-fuchsia-800',
  rose: 'text-rose-800',
  violet: 'text-violet-800',
  sky: 'text-sky-800',
  emerald: 'text-emerald-800',
}