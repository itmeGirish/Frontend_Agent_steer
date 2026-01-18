/**
 * Send a message to the CopilotKit chat panel
 */
export function sendMessageToChat(message: string) {
  setTimeout(() => {
    const textarea = document.querySelector(
      '.copilotKitInput textarea'
    ) as HTMLTextAreaElement
    const form = textarea?.closest('form')

    if (textarea && form) {
      textarea.value = message
      textarea.dispatchEvent(new Event('input', { bubbles: true }))

      setTimeout(() => {
        const submitButton = form.querySelector('button[type="submit"]')
        if (submitButton) {
          ;(submitButton as HTMLButtonElement).click()
        }
      }, 100)
    }
  }, 100)
}
