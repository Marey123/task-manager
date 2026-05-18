import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { Header } from './components/Header'
import { TaskForm } from './components/TaskForm'
import { TimeSlot } from './components/TimeSlot'
import type { Task, TaskFormValues } from './features/tasks/types'
import {
  addTask,
  deleteTask,
  syncTaskStatuses,
  updateTask,
} from './features/tasks/tasksSlice'
import { useCurrentTime } from './hooks/useCurrentTime'
import { DECORATIVE_EMOJIS } from './lib/constants'
import { buildPagesByAvailableHeight } from './lib/notebookPages'
import { createTimeSlots, timeToMinutes } from './lib/timeUtils'
import { useAppDispatch, useAppSelector } from './store'

function App() {
  const dispatch = useAppDispatch()
  const tasks = useAppSelector((state) => state.tasks.items)
  const currentTime = useCurrentTime()
  const timeSlots = useMemo(() => createTimeSlots(), [])
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [isCreateFormOpen, setIsCreateFormOpen] = useState(false)
  const [currentSpread, setCurrentSpread] = useState(0)
  const bookSpreadRef = useRef<HTMLDivElement | null>(null)
  const measureRefs = useRef<Record<string, HTMLDivElement | null>>({})
  const [measuredPageWidth, setMeasuredPageWidth] = useState(0)
  const [slotHeights, setSlotHeights] = useState<Record<string, number>>({})

  useEffect(() => {
    dispatch(syncTaskStatuses(currentTime.toISOString()))
  }, [currentTime, dispatch])

  const sortedTasks = useMemo(() => {
    return [...tasks].sort(
      (first, second) => timeToMinutes(first.startTime) - timeToMinutes(second.startTime),
    )
  }, [tasks])

  const slotsByPage = useMemo(
    () => buildPagesByAvailableHeight(timeSlots, slotHeights),
    [slotHeights, timeSlots],
  )
  const spreads = useMemo(() => {
    const pagePairs: string[][][] = []

    for (let pageIndex = 0; pageIndex < slotsByPage.length; pageIndex += 2) {
      pagePairs.push([slotsByPage[pageIndex] ?? [], slotsByPage[pageIndex + 1] ?? []])
    }

    return pagePairs.length > 0 ? pagePairs : [[[], []]]
  }, [slotsByPage])
  const totalSpreads = spreads.length
  const activeSpread = Math.min(currentSpread, totalSpreads - 1)
  const [leftPageSlots, rightPageSlots] = spreads[activeSpread] ?? [[], []]

  useLayoutEffect(() => {
    const updateMeasuredPageWidth = () => {
      const firstPage = bookSpreadRef.current?.querySelector('.notebook-page')

      if (firstPage instanceof HTMLElement) {
        setMeasuredPageWidth(firstPage.offsetWidth)
      }
    }

    updateMeasuredPageWidth()

    if (!bookSpreadRef.current || typeof ResizeObserver === 'undefined') {
      return
    }

    const resizeObserver = new ResizeObserver(updateMeasuredPageWidth)
    resizeObserver.observe(bookSpreadRef.current)

    return () => resizeObserver.disconnect()
  }, [])

  useLayoutEffect(() => {
    const nextSlotHeights = timeSlots.reduce<Record<string, number>>((heights, slot) => {
      const measuredHeight = measureRefs.current[slot]?.offsetHeight

      if (measuredHeight) {
        heights[slot] = measuredHeight
      }

      return heights
    }, {})

    setSlotHeights((currentHeights) => {
      const hasChanges = timeSlots.some(
        (slot) => nextSlotHeights[slot] && nextSlotHeights[slot] !== currentHeights[slot],
      )

      return hasChanges ? nextSlotHeights : currentHeights
    })
  }, [currentTime, editingTask, measuredPageWidth, sortedTasks, timeSlots])

  const getSpreadByTime = (time: string) => {
    const pageIndex = slotsByPage.findIndex((pageSlots) => pageSlots.includes(time))

    return pageIndex >= 0 ? Math.floor(pageIndex / 2) : activeSpread
  }

  const handleSubmit = (values: TaskFormValues) => {
    if (editingTask) {
      dispatch(updateTask({ id: editingTask.id, values }))
      setEditingTask(null)
      setCurrentSpread(getSpreadByTime(values.startTime))
      return
    }

    dispatch(addTask(values))
    setIsCreateFormOpen(false)
    setCurrentSpread(getSpreadByTime(values.startTime))
  }

  const handleDeleteTask = (id: string) => {
    dispatch(deleteTask(id))

    if (editingTask?.id === id) {
      setEditingTask(null)
    }
  }

  return (
    <main className="unicorn-bg relative min-h-screen overflow-hidden px-4 py-6 text-pink-900 md:px-8">
      {DECORATIVE_EMOJIS.map(({ className, emoji }) => (
        <div className={className} key={className}>
          {emoji}
        </div>
      ))}
      <div className="relative z-10 mx-auto flex max-w-6xl flex-col gap-6">
        <Header
          currentTime={currentTime}
          onAddTask={() => {
            setEditingTask(null)
            setIsCreateFormOpen(true)
          }}
          tasksCount={tasks.length}
        />

        {isCreateFormOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-pink-950/45 p-4 backdrop-blur-sm">
            <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-[2rem] border-2 border-pink-200 bg-white p-4 shadow-2xl shadow-pink-950/30">
              <div className="mb-4 flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-black uppercase tracking-[0.25em] text-fuchsia-800">
                    Magical modal
                  </p>
                  <h2 className="text-2xl font-black text-pink-950">New task</h2>
                </div>
                <button
                  className="rounded-2xl border-2 border-pink-300 bg-pink-50 px-4 py-2 text-xl font-black text-pink-950 transition hover:bg-pink-100"
                  onClick={() => setIsCreateFormOpen(false)}
                  type="button"
                >
                  ×
                </button>
              </div>

              <div className="mt-4">
                <TaskForm
                  editingTask={null}
                  key="create-task"
                  onCancelEdit={() => setIsCreateFormOpen(false)}
                  onSubmit={handleSubmit}
                  submitLabel="Add to notebook"
                  timeSlots={timeSlots}
                  titleText="Create a new notebook task 🦄"
                />
              </div>
            </div>
          </div>
        )}

        <section className="book-shell rounded-[2rem] border-2 border-pink-300 bg-pink-200/50 p-4 shadow-2xl shadow-pink-200 md:p-6">
          <div
            className="pointer-events-none fixed -left-[9999px] top-0 opacity-0"
            style={measuredPageWidth > 0 ? { width: `${measuredPageWidth}px` } : undefined}
          >
            <div className="notebook-page space-y-4 bg-amber-50/95 p-4 md:p-6">
              {timeSlots.map((slot) => (
                <div
                  key={`measure-${slot}`}
                  ref={(element) => {
                    measureRefs.current[slot] = element
                  }}
                >
                  <TimeSlot
                    currentTime={currentTime}
                    editingTask={editingTask}
                    onCancelEdit={() => setEditingTask(null)}
                    onDeleteTask={handleDeleteTask}
                    onEditTask={(task) => {
                      setIsCreateFormOpen(false)
                      setEditingTask(task)
                      setCurrentSpread(getSpreadByTime(task.startTime))
                    }}
                    onSubmitEdit={handleSubmit}
                    tasks={sortedTasks.filter((task) => task.startTime === slot)}
                    time={slot}
                    timeSlots={timeSlots}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.25em] text-fuchsia-900">
                Notebook spread
              </p>
              <h2 className="text-2xl font-black text-pink-950">
                Page {activeSpread + 1} of {totalSpreads}
              </h2>
            </div>

            <div className="flex gap-3">
              <button
                className="rounded-2xl border-2 border-pink-400 bg-white px-4 py-2 font-black text-pink-950 shadow transition hover:bg-pink-50 disabled:cursor-not-allowed disabled:opacity-45"
                disabled={activeSpread === 0}
                onClick={() => setCurrentSpread((page) => Math.max(page - 1, 0))}
                type="button"
              >
                ← Prev
              </button>
              <button
                className="rounded-2xl border-2 border-pink-400 bg-white px-4 py-2 font-black text-pink-950 shadow transition hover:bg-pink-50 disabled:cursor-not-allowed disabled:opacity-45"
                disabled={activeSpread === totalSpreads - 1}
                onClick={() =>
                  setCurrentSpread((page) => Math.min(page + 1, totalSpreads - 1))
                }
                type="button"
              >
                Next →
              </button>
            </div>
          </div>

          <div className="book-spread grid gap-4 lg:grid-cols-2 lg:gap-0" ref={bookSpreadRef}>
            {[leftPageSlots, rightPageSlots].map((pageSlots, pageIndex) => (
              <div
                className={`notebook-page h-[620px] space-y-4 overflow-hidden bg-amber-50/95 p-4 md:p-6 ${
                  pageIndex === 0 ? 'book-page-left' : 'book-page-right'
                }`}
                key={pageIndex === 0 ? 'left-page' : 'right-page'}
              >
                {pageSlots.length > 0 ? (
                  pageSlots.map((slot) => (
                    <TimeSlot
                      currentTime={currentTime}
                      editingTask={editingTask}
                      key={slot}
                      onCancelEdit={() => setEditingTask(null)}
                      onDeleteTask={handleDeleteTask}
                      onEditTask={(task) => {
                        setIsCreateFormOpen(false)
                        setEditingTask(task)
                        setCurrentSpread(getSpreadByTime(task.startTime))
                      }}
                      onSubmitEdit={handleSubmit}
                      tasks={sortedTasks.filter((task) => task.startTime === slot)}
                      time={slot}
                      timeSlots={timeSlots}
                    />
                  ))
                ) : (
                  <div className="flex min-h-[520px] flex-col items-center justify-center  p-8 text-center">
                    <div className="mt-4 text-6xl">🦄💤</div>
                    <h3 className="mt-6 text-4xl font-black text-pink-950">
                      Time to sleep
                    </h3>
                    <p className="mt-3 max-w-xs text-base font-bold text-fuchsia-900">
                      No more slots on this page. Close the magical notebook and
                      rest under the stars.
                    </p>
                    <div className="mt-6 text-3xl opacity-80">✨ ⭐ 🌸 ⭐ ✨</div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  )
}

export default App
