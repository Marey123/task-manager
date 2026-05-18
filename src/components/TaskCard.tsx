import type { Task } from '../features/tasks/types'
import {
  CARD_CLASS_NAME,
  STATUS_CLASS_NAME,
  TIME_CLASS_NAME,
} from '../lib/constants'
import { texts } from '../lib/texts'
import { getTaskStatus, getTaskTimeLabel } from '../lib/timeUtils'

type TaskCardProps = {
  task: Task
  currentTime: Date
  onDelete: (id: string) => void
  onEdit: (task: Task) => void
}

export const TaskCard = ({ task, currentTime, onDelete, onEdit }: TaskCardProps) => {
  const liveStatus = getTaskStatus(task, currentTime)

  return (
    <article
      className={`group rounded-3xl border-2 p-4 text-left shadow-md transition hover:-translate-y-1 hover:shadow-xl ${CARD_CLASS_NAME[task.color]}`}
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h3 className="text-lg font-black text-pink-950">
            <span className="mr-2 inline-block transition group-hover:rotate-12">
              {task.icon}
            </span>
            {task.title}
          </h3>
          <p className={`mt-1 text-sm font-bold ${TIME_CLASS_NAME[task.color]}`}>
            {getTaskTimeLabel(task, currentTime)}
          </p>
        </div>

        <span
          className={`inline-flex w-fit rounded-full px-3 py-1 text-xs font-black ring-2 ${STATUS_CLASS_NAME[liveStatus]}`}
        >
          {liveStatus}
        </span>
      </div>

      <div className="mt-4 flex gap-2">
        <button
          className="rounded-xl border-2 border-pink-300 px-3 py-2 text-sm font-black text-pink-950 transition hover:bg-pink-50"
          onClick={() => onEdit(task)}
          type="button"
        >
          {texts.taskCard.editButton}
        </button>
        <button
          className="rounded-xl border-2 border-rose-300 px-3 py-2 text-sm font-black text-rose-950 transition hover:bg-rose-50"
          onClick={() => onDelete(task.id)}
          type="button"
        >
          {texts.taskCard.deleteButton}
        </button>
      </div>
    </article>
  )
}
