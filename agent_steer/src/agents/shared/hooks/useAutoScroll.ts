import { useEffect } from 'react'

/**
 * Hook to auto-scroll chat messages container
 */
export function useAutoScroll(containerSelector: string) {
  useEffect(() => {
    const scrollToBottom = () => {
      const container = document.querySelector(containerSelector)
      if (container) {
        container.scrollTop = container.scrollHeight
      }
    }

    const observer = new MutationObserver(scrollToBottom)
    const container = document.querySelector(containerSelector)

    if (container) {
      observer.observe(container, { childList: true, subtree: true })
    }

    return () => observer.disconnect()
  }, [containerSelector])
}
