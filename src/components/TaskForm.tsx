import { useState, type FormEvent } from 'react'
import type {
  Task,
  TaskColor,
  TaskFormValues,
  TaskIcon,
} from '../features/tasks/types'
import {
  DAY_START_TIME,
  DEFAULT_TASK_COLOR,
  DEFAULT_TASK_ICON,
  TASK_COLOR_OPTIONS,
  TASK_ICONS,
} from '../lib/constants'

type TaskFormProps = {
  timeSlots: string[]
  className?: string
  editingTask: Task | null
  onCancelEdit: () => void
  onSubmit: (values: TaskFormValues) => void
  submitLabel?: string
  titleText?: string
}

export const TaskForm = ({
  timeSlots,
  className = '',
  editingTask,
  onCancelEdit,
  onSubmit,
  submitLabel,
  titleText,
}: TaskFormProps) => {
  const defaultTime = timeSlots[0] ?? DAY_START_TIME
  const [title, setTitle] = useState(() => editingTask?.title ?? '')
  const [startTime, setStartTime] = useState(
    () => editingTask?.startTime ?? defaultTime,
  )
  const [color, setColor] = useState<TaskColor>(
    () => editingTask?.color ?? DEFAULT_TASK_COLOR,
  )
  const [icon, setIcon] = useState<TaskIcon>(
    () => editingTask?.icon ?? DEFAULT_TASK_ICON,
  )

  const resetForm = () => {
    setTitle('')
    setStartTime(defaultTime)
    setColor(DEFAULT_TASK_COLOR)
    setIcon(DEFAULT_TASK_ICON)
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!title.trim()) {
      return
    }

    onSubmit({ title, startTime, color, icon })
    resetForm()
  }

  const handleCancelEdit = () => {
    resetForm()
    onCancelEdit()
  }

  const selectedColorOption = TASK_COLOR_OPTIONS.find(
    (option) => option.value === color,
  )

  return (
    <form
      className={`rounded-[2rem] border-2 border-pink-300 bg-white p-5 text-left shadow-xl shadow-pink-200/70 backdrop-blur ${className}`}
      onSubmit={handleSubmit}
    >
      <h2 className="mb-4 text-xl font-black text-pink-950">
        {titleText ?? (editingTask ? 'Edit task ✨' : 'Create task 🦄')}
      </h2>

      <label className="block text-sm font-black text-pink-950" htmlFor="task-title">
        Title
      </label>
      <input
        className="mt-2 w-full rounded-2xl border-2 border-pink-300 bg-pink-50/80 px-4 py-3 font-semibold text-pink-950 outline-none transition placeholder:text-pink-500 focus:border-fuchsia-600 focus:bg-white focus:ring-4 focus:ring-pink-200"
        id="task-title"
        onChange={(event) => setTitle(event.target.value)}
        placeholder="e.g. Feed the unicorn"
        type="text"
        value={title}
      />

      <label
        className="mt-4 block text-sm font-black text-pink-950"
        htmlFor="task-time"
      >
        Time slot
      </label>
      <select
        className="mt-2 w-full rounded-2xl border-2 border-pink-300 bg-pink-50/80 px-4 py-3 font-semibold text-pink-950 outline-none transition focus:border-fuchsia-600 focus:bg-white focus:ring-4 focus:ring-pink-200"
        id="task-time"
        onChange={(event) => setStartTime(event.target.value)}
        value={startTime}
      >
        {timeSlots.map((slot) => (
          <option key={slot} value={slot}>
            {slot}
          </option>
        ))}
      </select>

      <fieldset className="mt-4">
        <legend className="block text-sm font-black text-pink-950">
          Card color
        </legend>
        <div className="mt-2 flex items-center gap-3 rounded-2xl border-2 border-pink-300 bg-pink-50/80 px-4 py-3 transition focus-within:border-fuchsia-600 focus-within:bg-white focus-within:ring-4 focus-within:ring-pink-200">
          <span
            aria-hidden="true"
            className={`h-7 w-7 shrink-0 rounded-full border-2 border-white shadow ${
              selectedColorOption?.className ?? ''
            }`}
          />
          <select
            className="min-w-0 flex-1 bg-transparent font-semibold text-pink-950 outline-none"
            onChange={(event) => setColor(event.target.value as TaskColor)}
            value={color}
          >
            {TASK_COLOR_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </fieldset>

      <fieldset className="mt-4">
        <legend className="block text-sm font-black text-pink-950">
          Task icon
        </legend>
        <select
          className="mt-2 w-full rounded-2xl border-2 border-pink-300 bg-pink-50/80 px-4 py-3 text-2xl font-semibold text-pink-950 outline-none transition focus:border-fuchsia-600 focus:bg-white focus:ring-4 focus:ring-pink-200"
          onChange={(event) => setIcon(event.target.value as TaskIcon)}
          value={icon}
        >
          {TASK_ICONS.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </fieldset>

      <div className="mt-5 flex flex-col gap-3 sm:flex-row">
        <button
          className="rounded-2xl bg-gradient-to-r from-pink-700 to-fuchsia-700 px-5 py-3 font-black text-white shadow-lg shadow-pink-300 transition hover:-translate-y-0.5 hover:from-pink-800 hover:to-fuchsia-800"
          type="submit"
        >
          {submitLabel ?? (editingTask ? 'Save task' : 'Add task')}
        </button>

        {editingTask && (
          <button
            className="rounded-2xl border-2 border-pink-300 px-5 py-3 font-black text-pink-950 transition hover:bg-pink-50"
            onClick={handleCancelEdit}
            type="button"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  )
}
