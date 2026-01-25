/**
 * Send a message to the CopilotKit chat panel
 * Based on the robust implementation from testing_ui project
 */
export function sendMessageToChat(message: string) {
  console.log('[sendMessageToChat] Attempting to send:', message)

  // Remove any existing manual loading indicators
  const existingLoading = document.getElementById('onboarding-loading')
  if (existingLoading) existingLoading.remove()

  const populateAndSendMessage = () => {
    let chatInput: HTMLTextAreaElement | null = null

    // STEP 1: Find the chat textarea
    // First, try CopilotKit specific selectors
    chatInput = document.querySelector('.copilotKitInput textarea') as HTMLTextAreaElement

    // If not found, try to find textarea in CopilotKit containers
    if (!chatInput) {
      const copilotContainers = document.querySelectorAll('[class*="copilot"], [class*="chat"], [class*="sidebar"]')
      for (const container of copilotContainers) {
        const textarea = container.querySelector('textarea:not([data-form-field])')
        if (textarea) {
          chatInput = textarea as HTMLTextAreaElement
          break
        }
      }
    }

    // If still not found, get textareas that are NOT form fields
    if (!chatInput) {
      const allTextareas = Array.from(document.querySelectorAll('textarea'))
      const nonFormTextareas = allTextareas.filter(ta =>
        !ta.hasAttribute('data-form-field') &&
        !ta.closest('form') &&
        ta.offsetParent
      )
      if (nonFormTextareas.length > 0) {
        chatInput = nonFormTextareas[nonFormTextareas.length - 1] as HTMLTextAreaElement
      }
    }

    if (!chatInput || !chatInput.offsetParent) {
      console.error('[sendMessageToChat] Chat textarea not found or is hidden')
      return false
    }

    console.log('[sendMessageToChat] Found chat textarea')

    // STEP 2: Set the message value using native setter (important for React)
    chatInput.value = ''
    const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
      window.HTMLTextAreaElement.prototype,
      'value'
    )?.set

    if (nativeInputValueSetter) {
      nativeInputValueSetter.call(chatInput, message)
      console.log('[sendMessageToChat] Value set using native setter')
    } else {
      chatInput.value = message
      console.log('[sendMessageToChat] Value set directly')
    }

    // STEP 3: Trigger React to recognize the change
    const inputEvent = new Event('input', { bubbles: true, cancelable: true })
    const changeEvent = new Event('change', { bubbles: true, cancelable: true })
    chatInput.dispatchEvent(inputEvent)
    chatInput.dispatchEvent(changeEvent)

    if (chatInput.onchange) {
      chatInput.onchange(changeEvent as Event)
    }
    if (chatInput.oninput) {
      chatInput.oninput(inputEvent as Event)
    }

    chatInput.focus()
    console.log('[sendMessageToChat] Message populated, current value:', chatInput.value)

    // STEP 4: Find and click the send button
    setTimeout(() => {
      console.log('[sendMessageToChat] Looking for Send button...')

      let sendButton: HTMLButtonElement | null = null

      // Try to find button near the textarea
      const parent = chatInput?.parentElement
      if (parent) {
        sendButton = parent.querySelector('button') as HTMLButtonElement | null
      }

      // Try form submit button
      if (!sendButton) {
        const form = chatInput?.closest('form')
        if (form) {
          sendButton = form.querySelector('button[type="submit"]') as HTMLButtonElement | null
        }
      }

      // Try CopilotKit specific selectors
      if (!sendButton) {
        sendButton = document.querySelector(
          'button[class*="send"], button[class*="Submit"], button[aria-label*="send"], .copilotKitInputControlButton'
        ) as HTMLButtonElement | null
      }

      if (sendButton) {
        console.log('[sendMessageToChat] Found Send button, disabled:', sendButton.disabled)

        // Force enable if disabled
        if (sendButton.disabled) {
          console.log('[sendMessageToChat] Force enabling button...')
          sendButton.disabled = false
          sendButton.removeAttribute('disabled')
        }

        // Click with proper MouseEvent
        const clickEvent = new MouseEvent('click', {
          bubbles: true,
          cancelable: true,
          view: window
        })
        sendButton.dispatchEvent(clickEvent)
        sendButton.click()
        console.log('[sendMessageToChat] Send button clicked!')

        // Set up observer to detect when response arrives and clean up loading
        const messagesContainer = document.querySelector('.copilotKitMessages')
        if (messagesContainer) {
          const observer = new MutationObserver((mutations) => {
            // Check if a new assistant message appeared
            const hasNewMessage = mutations.some(m =>
              Array.from(m.addedNodes).some(n =>
                n instanceof HTMLElement &&
                (n.classList.contains('copilotKitAssistantMessage') ||
                 n.querySelector?.('.copilotKitAssistantMessage'))
              )
            )
            if (hasNewMessage) {
              // Remove loading indicator
              const loadingEl = document.getElementById('onboarding-loading')
              if (loadingEl) loadingEl.remove()
              observer.disconnect()
            }
          })
          observer.observe(messagesContainer, { childList: true, subtree: true })

          // Disconnect after 60 seconds to prevent memory leaks
          setTimeout(() => observer.disconnect(), 60000)
        }
      } else {
        // Fallback: Try simulating Enter key
        console.log('[sendMessageToChat] Send button not found, trying Enter key...')
        const enterEvent = new KeyboardEvent('keydown', {
          key: 'Enter',
          code: 'Enter',
          keyCode: 13,
          which: 13,
          bubbles: true,
          cancelable: true,
        })
        chatInput?.dispatchEvent(enterEvent)
        console.log('[sendMessageToChat] Enter key event dispatched')
      }
    }, 250)

    return true
  }

  // Try immediately, with retries
  if (!populateAndSendMessage()) {
    setTimeout(() => {
      if (!populateAndSendMessage()) {
        setTimeout(() => populateAndSendMessage(), 300)
      }
    }, 150)
  }
}
