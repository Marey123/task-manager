import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import {
  DEFAULT_TASK_COLOR,
  DEFAULT_TASK_ICON,
  REQUIRED_TASK_FIELD_TYPES,
  SLOT_INTERVAL_MINUTES,
  TASK_COLORS,
  TASK_ICONS,
  TASK_STORAGE_KEY,
} from '../../lib/constants'
import { getTaskStatus } from '../../lib/timeUtils'
import type { Task, TaskColor, TaskFormValues, TaskIcon } from './types'

type TasksState = {
  items: Task[]
}

type RequiredTaskFields = Pick<
  Task,
  'id' | 'title' | 'startTime' | 'durationMinutes' | 'status' | 'createdAt' | 'updatedAt'
>

const normalizeTask = (value: unknown): Task | null => {
  if (typeof value !== 'object' || value === null) {
    return null
  }

  const candidate = value as Record<string, unknown>
  const hasInvalidRequiredField = Object.entries(REQUIRED_TASK_FIELD_TYPES).some(
    ([fieldName, fieldType]) => typeof candidate[fieldName] !== fieldType,
  )

  if (hasInvalidRequiredField) {
    return null
  }

  const validCandidate = candidate as RequiredTaskFields & {
    color?: unknown
    icon?: unknown
  }

  const color = TASK_COLORS.includes(validCandidate.color as TaskColor)
    ? (validCandidate.color as TaskColor)
    : DEFAULT_TASK_COLOR
  const icon = TASK_ICONS.includes(validCandidate.icon as TaskIcon)
    ? (validCandidate.icon as TaskIcon)
    : DEFAULT_TASK_ICON

  return {
    id: validCandidate.id,
    title: validCandidate.title,
    startTime: validCandidate.startTime,
    durationMinutes: validCandidate.durationMinutes,
    status: validCandidate.status,
    color,
    icon,
    createdAt: validCandidate.createdAt,
    updatedAt: validCandidate.updatedAt,
  }
}

const loadTasksFromJsonStorage = (): Task[] => {
  if (typeof window === 'undefined') {
    return []
  }

  try {
    const rawTasks = window.localStorage.getItem(TASK_STORAGE_KEY)
    const parsedTasks: unknown = rawTasks ? JSON.parse(rawTasks) : []

    return Array.isArray(parsedTasks)
      ? parsedTasks.flatMap((task) => {
          const normalizedTask = normalizeTask(task)

          return normalizedTask ? [normalizedTask] : []
        })
      : []
  } catch {
    return []
  }
}

const saveTasksToJsonStorage = (tasks: Task[]) => {
  window.localStorage.setItem(TASK_STORAGE_KEY, JSON.stringify(tasks, null, 2))
}

const createTask = ({ title, startTime, color, icon }: TaskFormValues): Task => {
  const now = new Date()
  const timestamp = now.toISOString()

  return {
    id: crypto.randomUUID(),
    title: title.trim(),
    startTime,
    durationMinutes: SLOT_INTERVAL_MINUTES,
    status: getTaskStatus(
      { startTime, durationMinutes: SLOT_INTERVAL_MINUTES },
      now,
    ),
    color,
    icon,
    createdAt: timestamp,
    updatedAt: timestamp,
  }
}

const initialState: TasksState = {
  items: loadTasksFromJsonStorage(),
}

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    addTask: (state, action: PayloadAction<TaskFormValues>) => {
      state.items.push(createTask(action.payload))
      saveTasksToJsonStorage(state.items)
    },
    updateTask: (
      state,
      action: PayloadAction<{ id: string; values: TaskFormValues }>,
    ) => {
      const task = state.items.find((item) => item.id === action.payload.id)

      if (!task) {
        return
      }

      const now = new Date()
      task.title = action.payload.values.title.trim()
      task.startTime = action.payload.values.startTime
      task.color = action.payload.values.color
      task.icon = action.payload.values.icon
      task.status = getTaskStatus(task, now)
      task.updatedAt = now.toISOString()
      saveTasksToJsonStorage(state.items)
    },
    deleteTask: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((task) => task.id !== action.payload)
      saveTasksToJsonStorage(state.items)
    },
    syncTaskStatuses: (state, action: PayloadAction<string>) => {
      const currentDate = new Date(action.payload)

      state.items.forEach((task) => {
        task.status = getTaskStatus(task, currentDate)
      })

      saveTasksToJsonStorage(state.items)
    },
  },
})

export const { addTask, deleteTask, syncTaskStatuses, updateTask } =
  tasksSlice.actions
export const tasksReducer = tasksSlice.reducer
