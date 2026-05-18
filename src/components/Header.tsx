import { texts } from '../lib/texts'
import { formatCurrentTime } from '../lib/timeUtils'

type HeaderProps = {
  currentTime: Date
  onAddTask: () => void
  tasksCount: number
}

export const Header = ({ currentTime, onAddTask, tasksCount }: HeaderProps) => (
  <header className="relative overflow-hidden rounded-[2rem] border border-pink-200 bg-gradient-to-br from-pink-400 via-fuchsia-400 to-rose-300 p-6 text-left text-white shadow-2xl shadow-pink-200/80">

    {texts.header.sparkles.map((sparkle, index) => (
      <div className={`sparkle sparkle-${['one', 'two', 'three', 'four'][index]}`} key={index}>
        {sparkle}
      </div>
    ))}

    <p className="relative text-sm font-bold uppercase tracking-[0.3em] text-white/80">
      {texts.header.eyebrow}
    </p>
    <div className="relative mt-4 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div>
        <h1 className="m-0 text-4xl font-black tracking-tight text-white drop-shadow md:text-5xl">
          {texts.header.title}
        </h1>
        <p className="mt-3 max-w-2xl text-base font-medium text-white/85">
          {texts.header.description}
        </p>
      </div>

      <div className="flex flex-col gap-4 rounded-[2rem] border border-white/40 bg-white/25 px-6 py-5 text-right shadow-lg backdrop-blur md:min-w-[340px] md:px-8 md:py-7">
        <p className="text-sm font-semibold text-white/80 md:text-base">
          {texts.header.currentTimeLabel}
        </p>
        <div className="flex items-center justify-end gap-4">
          <span
            aria-hidden="true"
            className="rounded-3xl border border-white/50 bg-white/30 px-3 py-2 text-6xl shadow-lg shadow-pink-500/20 md:text-6xl"
          >
            {texts.header.timeIcon}
          </span>
          <p className="text-5xl font-black leading-none text-white sm:text-4xl md:text-6xl">
            {formatCurrentTime(currentTime)}
          </p>
        </div>
        <p className="text-sm font-semibold text-white/80 md:text-base">
          {texts.header.tasksCountLabel(tasksCount)}
        </p>
        <button
          className="rounded-2xl border-2 border-white/70 bg-white px-5 py-3 text-base font-black text-pink-800 shadow-lg shadow-pink-500/20 transition hover:-translate-y-0.5 hover:bg-pink-50 md:px-6 md:py-4 md:text-lg"
          onClick={onAddTask}
          type="button"
        >
          {texts.header.addTaskButton}
        </button>
      </div>
    </div>
  </header>
)
