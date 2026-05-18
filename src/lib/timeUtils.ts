import { TaskStatus, type Task } from '../features/tasks/types'
import {
  DAY_END_TIME,
  DAY_START_TIME,
  MINUTES_IN_HOUR,
  SLOT_INTERVAL_MINUTES,
} from './constants'

export { DAY_END_TIME, DAY_START_TIME, SLOT_INTERVAL_MINUTES } from './constants'

export const timeToMinutes = (time: string) => {
  const [hours = '0', minutes = '0'] = time.split(':')

  return Number(hours) * MINUTES_IN_HOUR + Number(minutes)
}

export const minutesToTime = (totalMinutes: number) => {
  const hours = Math.floor(totalMinutes / MINUTES_IN_HOUR)
  const minutes = totalMinutes % MINUTES_IN_HOUR

  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`
}

export const createTimeSlots = (
  startTime = DAY_START_TIME,
  endTime = DAY_END_TIME,
  intervalMinutes = SLOT_INTERVAL_MINUTES,
) => {
  const slots: string[] = []

  for (
    let current = timeToMinutes(startTime);
    current <= timeToMinutes(endTime);
    current += intervalMinutes
  ) {
    slots.push(minutesToTime(current))
  }

  return slots
}

export const getCurrentMinutes = (date: Date) =>
  date.getHours() * MINUTES_IN_HOUR + date.getMinutes()

export const getTaskEndTime = (task: Pick<Task, 'startTime' | 'durationMinutes'>) =>
  minutesToTime(timeToMinutes(task.startTime) + task.durationMinutes)

export const getTaskStatus = (
  task: Pick<Task, 'startTime' | 'durationMinutes'>,
  currentDate: Date,
): TaskStatus => {
  const currentMinutes = getCurrentMinutes(currentDate)
  const startMinutes = timeToMinutes(task.startTime)
  const endMinutes = startMinutes + task.durationMinutes

  if (currentMinutes < startMinutes) {
    return TaskStatus.PENDING
  }

  if (currentMinutes >= endMinutes) {
    return TaskStatus.DONE
  }

  return TaskStatus.ACTIVE
}

export const getMinutesUntilTask = (
  task: Pick<Task, 'startTime'>,
  currentDate: Date,
) => Math.max(timeToMinutes(task.startTime) - getCurrentMinutes(currentDate), 0)

export const getTaskTimeLabel = (task: Task, currentDate: Date) => {
  const status = getTaskStatus(task, currentDate)

  if (status === TaskStatus.PENDING) {
    return `in ${getMinutesUntilTask(task, currentDate)} minutes`
  }

  if (status === TaskStatus.ACTIVE) {
    return 'in progress'
  }

  return `${task.startTime}–${getTaskEndTime(task)}`
}

export const formatCurrentTime = (date: Date) => minutesToTime(getCurrentMinutes(date))
