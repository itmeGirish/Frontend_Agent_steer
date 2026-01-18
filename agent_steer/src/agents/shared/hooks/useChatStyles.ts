import { useEffect } from 'react'

/**
 * Hook to apply custom chat styles including scrollbar
 */
export function useChatStyles() {
  useEffect(() => {
    const style = document.createElement('style')
    style.textContent = `
      .copilotKitMessages {
        padding-bottom: 16px;
        overflow-y: auto;
      }
      .copilotKitMessage {
        max-width: 85%;
      }

      /* Custom scrollbar for chat panel */
      .copilotKitMessages::-webkit-scrollbar {
        width: 8px;
      }
      .copilotKitMessages::-webkit-scrollbar-track {
        background: #f1f5f9;
        border-radius: 4px;
      }
      .copilotKitMessages::-webkit-scrollbar-thumb {
        background: #cbd5e1;
        border-radius: 4px;
      }
      .copilotKitMessages::-webkit-scrollbar-thumb:hover {
        background: #94a3b8;
      }

      /* Firefox scrollbar */
      .copilotKitMessages {
        scrollbar-width: thin;
        scrollbar-color: #cbd5e1 #f1f5f9;
      }

      /* Chat panel container scrollbar */
      .chat-panel-scrollable::-webkit-scrollbar {
        width: 8px;
      }
      .chat-panel-scrollable::-webkit-scrollbar-track {
        background: #f1f5f9;
        border-radius: 4px;
      }
      .chat-panel-scrollable::-webkit-scrollbar-thumb {
        background: #cbd5e1;
        border-radius: 4px;
      }
      .chat-panel-scrollable::-webkit-scrollbar-thumb:hover {
        background: #94a3b8;
      }
      .chat-panel-scrollable {
        scrollbar-width: thin;
        scrollbar-color: #cbd5e1 #f1f5f9;
      }

      /* Chat panel with quick actions above input */
      .chat-panel-container {
        display: flex;
        flex-direction: column;
        position: relative;
      }

      /* Quick actions positioned above input */
      .quick-actions-wrapper {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        z-index: 10;
        display: flex;
        flex-direction: column;
      }

      .quick-actions-wrapper .quick-actions-bar {
        background: white;
        border-top: 1px solid #f1f5f9;
      }

      /* Make space for quick actions at the bottom of chat */
      .chat-panel-container .copilotKitInput {
        padding-top: 8px;
      }
    `
    document.head.appendChild(style)

    return () => {
      document.head.removeChild(style)
    }
  }, [])
}
