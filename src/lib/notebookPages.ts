import {
  DEFAULT_SLOT_HEIGHT,
  PAGE_HEIGHT,
  PAGE_VERTICAL_PADDING,
  SLOT_GAP,
} from './constants'

export const buildPagesByAvailableHeight = (
  slots: string[],
  slotHeights: Record<string, number>,
) => {
  const maxContentHeight = PAGE_HEIGHT - PAGE_VERTICAL_PADDING
  const pages: string[][] = []
  let currentPage: string[] = []
  let currentPageHeight = 0

  slots.forEach((slot) => {
    const slotHeight = slotHeights[slot] ?? DEFAULT_SLOT_HEIGHT
    const heightWithGap = currentPage.length > 0 ? slotHeight + SLOT_GAP : slotHeight

    if (currentPage.length > 0 && currentPageHeight + heightWithGap > maxContentHeight) {
      pages.push(currentPage)
      currentPage = [slot]
      currentPageHeight = slotHeight
      return
    }

    currentPage.push(slot)
    currentPageHeight += heightWithGap
  })

  if (currentPage.length > 0) {
    pages.push(currentPage)
  }

  return pages.length > 0 ? pages : [[]]
}