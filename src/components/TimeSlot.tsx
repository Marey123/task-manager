import type { Task } from '../features/tasks/types'
import { texts } from '../lib/texts'
import { TaskCard } from './TaskCard'

type TimeSlotProps = {
  currentTime: Date
  onDeleteTask: (id: string) => void
  onEditTask: (task: Task) => void
  tasks: Task[]
  time: string
}

export const TimeSlot = ({
  currentTime,
  onDeleteTask,
  onEditTask,
  tasks,
  time,
}: TimeSlotProps) => (
  <section className="notebook-slot grid gap-4 rounded-[1.75rem] border-2 border-pink-300 bg-amber-50 p-4 text-left shadow-lg shadow-pink-100 md:grid-cols-[96px_1fr]">
    <div className="border-b-2 border-pink-200 pb-3 md:border-b-0 md:border-r-2 md:pb-0 md:pr-4">
      <p className="text-xl font-black text-pink-950">{time}</p>
      <p className="text-xs font-black uppercase tracking-wider text-fuchsia-800">
        {texts.timeSlot.label}
      </p>
    </div>

    <div className="space-y-3">
      {tasks.length > 0 ? (
        tasks.map((task) => (
          <TaskCard
            currentTime={currentTime}
            key={task.id}
            onDelete={onDeleteTask}
            onEdit={onEditTask}
            task={task}
          />
        ))
      ) : (
        <div className="rounded-3xl border-2 border-dashed border-pink-300 bg-white/70 px-4 py-6 text-center text-sm font-black text-pink-800">
          {texts.timeSlot.emptyLine}
        </div>
      )}
    </div>
  </section>
)
