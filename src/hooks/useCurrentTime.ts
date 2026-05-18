import { useEffect, useState } from 'react'
import {
  CURRENT_TIME_UPDATE_INTERVAL_MS,
  MILLISECONDS_IN_SECOND,
  SECONDS_IN_MINUTE,
} from '../lib/constants'

const getMillisecondsUntilNextMinute = () => {
  const now = new Date()

  return (
    (SECONDS_IN_MINUTE - now.getSeconds()) * MILLISECONDS_IN_SECOND -
    now.getMilliseconds()
  )
}

export const useCurrentTime = () => {
  const [currentTime, setCurrentTime] = useState(() => new Date())

  useEffect(() => {
    let intervalId: number | undefined

    const timeoutId = window.setTimeout(() => {
      setCurrentTime(new Date())
      intervalId = window.setInterval(
        () => setCurrentTime(new Date()),
        CURRENT_TIME_UPDATE_INTERVAL_MS,
      )
    }, getMillisecondsUntilNextMinute())

    return () => {
      window.clearTimeout(timeoutId)

      if (intervalId !== undefined) {
        window.clearInterval(intervalId)
      }
    }
  }, [])

  return currentTime
}
