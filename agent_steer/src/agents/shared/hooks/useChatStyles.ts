import { useEffect } from 'react'

/**
 * Hook to apply custom chat styles
 */
export function useChatStyles() {
  useEffect(() => {
    const style = document.createElement('style')
    style.textContent = `
      .copilotKitMessages {
        padding-bottom: 16px;
      }
      .copilotKitMessage {
        max-width: 85%;
      }
    `
    document.head.appendChild(style)

    return () => {
      document.head.removeChild(style)
    }
  }, [])
}
