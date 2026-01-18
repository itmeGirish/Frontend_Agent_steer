import { useEffect } from 'react'

/**
 * Hook to hide the CopilotKit version banner
 */
export function useHideCopilotBanner() {
  useEffect(() => {
    const hideBanner = () => {
      const allElements = document.querySelectorAll('div, span, a')
      allElements.forEach((el) => {
        if (
          el.textContent?.includes('CopilotKit v') &&
          el.textContent?.includes('now live')
        ) {
          let parent = el.parentElement
          while (parent && parent.tagName !== 'BODY') {
            if (parent.children.length <= 3) {
              (parent as HTMLElement).style.display = 'none'
              return
            }
            parent = parent.parentElement
          }
          (el as HTMLElement).style.display = 'none'
        }
      })
    }

    hideBanner()
    const timer1 = setTimeout(hideBanner, 100)
    const timer2 = setTimeout(hideBanner, 500)
    const timer3 = setTimeout(hideBanner, 1000)

    const observer = new MutationObserver(hideBanner)
    observer.observe(document.body, { childList: true, subtree: true })

    return () => {
      clearTimeout(timer1)
      clearTimeout(timer2)
      clearTimeout(timer3)
      observer.disconnect()
    }
  }, [])
}
