/**
 * Helper function to send a message to the CopilotKit chat
 * This handles the DOM manipulation to populate and send messages
 */
export function sendMessageToChat(message: string): void {
  console.log('Sending message to chat:', message);

  const populateAndSendMessage = (): boolean => {
    let chatInput: HTMLTextAreaElement | null = null;

    // Find textarea in CopilotKit containers (exclude form fields)
    const copilotContainers = document.querySelectorAll(
      '[class*="copilot"], [class*="chat"], [class*="sidebar"]'
    );

    for (const container of copilotContainers) {
      const textarea = container.querySelector(
        'textarea:not([data-form-field])'
      );
      if (textarea) {
        chatInput = textarea as HTMLTextAreaElement;
        break;
      }
    }

    // Fallback: find non-form textareas
    if (!chatInput) {
      const allTextareas = Array.from(document.querySelectorAll('textarea'));
      const nonFormTextareas = allTextareas.filter(
        (ta) =>
          !ta.hasAttribute('data-form-field') &&
          !ta.closest('form') &&
          ta.offsetParent
      );
      if (nonFormTextareas.length > 0) {
        chatInput = nonFormTextareas[nonFormTextareas.length - 1];
      }
    }

    if (!chatInput || !chatInput.offsetParent) {
      console.log('Chat textarea not found or is hidden');
      return false;
    }

    // Double-check this is not a form field
    if (chatInput.hasAttribute('data-form-field') || chatInput.closest('form')) {
      const allTextareas = Array.from(document.querySelectorAll('textarea'));
      chatInput =
        (allTextareas.find(
          (ta) =>
            !ta.hasAttribute('data-form-field') &&
            !ta.closest('form') &&
            ta.offsetParent
        ) as HTMLTextAreaElement) || null;

      if (!chatInput) {
        console.log('Could not find non-form textarea');
        return false;
      }
    }

    // Set value using native setter for React compatibility
    chatInput.value = '';
    const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
      window.HTMLTextAreaElement.prototype,
      'value'
    )?.set;

    if (nativeInputValueSetter) {
      nativeInputValueSetter.call(chatInput, message);
    }

    // Dispatch events for React
    const inputEvent = new Event('input', { bubbles: true, cancelable: true });
    const changeEvent = new Event('change', { bubbles: true, cancelable: true });
    chatInput.dispatchEvent(inputEvent);
    chatInput.dispatchEvent(changeEvent);
    chatInput.focus();

    // Find and click send button
    setTimeout(() => {
      let sendButton: HTMLButtonElement | null = null;

      const parent = chatInput?.parentElement;
      if (parent) {
        sendButton = parent.querySelector('button') as HTMLButtonElement | null;
      }

      if (!sendButton) {
        sendButton = document.querySelector(
          'button[class*="send"], button[class*="Submit"], button[aria-label*="send"], .copilotKitInputControlButton'
        ) as HTMLButtonElement | null;
      }

      if (sendButton) {
        if (sendButton.disabled) {
          sendButton.disabled = false;
          sendButton.removeAttribute('disabled');
        }

        // Only click once - don't use both dispatchEvent and click()
        sendButton.click();
      } else {
        // Fallback: Enter key
        const enterEvent = new KeyboardEvent('keydown', {
          key: 'Enter',
          code: 'Enter',
          keyCode: 13,
          which: 13,
          bubbles: true,
          cancelable: true,
        });
        chatInput?.dispatchEvent(enterEvent);
      }
    }, 250);

    return true;
  };

  // Try immediately, then retry if needed
  if (!populateAndSendMessage()) {
    setTimeout(() => {
      if (!populateAndSendMessage()) {
        setTimeout(() => populateAndSendMessage(), 300);
      }
    }, 150);
  }
}
