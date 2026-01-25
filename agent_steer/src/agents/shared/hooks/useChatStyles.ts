import { useEffect } from 'react'

/**
 * Hook to apply custom chat styles including scrollbar and loading indicator
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

      /* Loading indicator - three dots animation */
      .copilotKitAssistantMessage[data-loading="true"]::after,
      .copilotKitResponseInProgress::after,
      [class*="loading"]::after,
      [class*="Loading"]::after {
        content: '';
        display: inline-block;
        width: 20px;
        animation: loadingDots 1.4s infinite;
      }

      @keyframes loadingDots {
        0%, 20% { content: '.'; }
        40% { content: '..'; }
        60%, 100% { content: '...'; }
      }

      /* Typing indicator styles */
      .copilotKitTypingIndicator,
      [class*="typing"],
      [class*="Typing"] {
        display: flex !important;
        align-items: center;
        gap: 4px;
        padding: 12px 16px;
        background: #f3f4f6;
        border-radius: 18px;
        margin: 8px 0;
      }

      .copilotKitTypingIndicator span,
      .typing-dot {
        width: 8px;
        height: 8px;
        background: #9ca3af;
        border-radius: 50%;
        animation: typingBounce 1.4s infinite ease-in-out;
      }

      .copilotKitTypingIndicator span:nth-child(1) { animation-delay: 0s; }
      .copilotKitTypingIndicator span:nth-child(2) { animation-delay: 0.2s; }
      .copilotKitTypingIndicator span:nth-child(3) { animation-delay: 0.4s; }

      @keyframes typingBounce {
        0%, 60%, 100% {
          transform: translateY(0);
          opacity: 0.4;
        }
        30% {
          transform: translateY(-4px);
          opacity: 1;
        }
      }

      /* Ensure loading states are visible */
      [data-status="loading"],
      [data-state="loading"],
      .is-loading {
        position: relative;
      }

      [data-status="loading"]::before,
      [data-state="loading"]::before {
        content: '';
        position: absolute;
        top: 50%;
        left: 50%;
        width: 20px;
        height: 20px;
        margin: -10px 0 0 -10px;
        border: 2px solid #e5e7eb;
        border-top-color: var(--copilot-kit-primary-color, #22c55e);
        border-radius: 50%;
        animation: spin 0.8s linear infinite;
      }

      @keyframes spin {
        to { transform: rotate(360deg); }
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
