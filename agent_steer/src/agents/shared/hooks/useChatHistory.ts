import { useEffect, useRef } from 'react'
import {
  createChatSession,
  addMessageToSession,
  getChatSession,
  type ChatSession,
} from '@/agent-hub'

interface UseChatHistoryProps {
  agentId: string
  agentName: string
  agentColor: string
  sessionId?: string | null
}

/**
 * Hook to track and save chat messages to history
 */
export function useChatHistory({ agentId, agentName, agentColor, sessionId }: UseChatHistoryProps) {
  const currentSessionRef = useRef<ChatSession | null>(null)
  const lastMessageCountRef = useRef(0)
  const observerRef = useRef<MutationObserver | null>(null)

  useEffect(() => {
    // Load existing session or create new one
    if (sessionId) {
      const existingSession = getChatSession(sessionId)
      if (existingSession) {
        currentSessionRef.current = existingSession
      }
    }

    const observeMessages = () => {
      const messagesContainer = document.querySelector('.copilotKitMessages')
      if (!messagesContainer) return

      // Disconnect previous observer
      if (observerRef.current) {
        observerRef.current.disconnect()
      }

      const processMessages = () => {
        const messageElements = messagesContainer.querySelectorAll('.copilotKitMessage')
        const currentCount = messageElements.length

        // Only process if we have new messages
        if (currentCount <= lastMessageCountRef.current) return

        // Process new messages
        for (let i = lastMessageCountRef.current; i < currentCount; i++) {
          const messageEl = messageElements[i]
          const isUser = messageEl.classList.contains('copilotKitUserMessage')
          const contentEl = messageEl.querySelector('.copilotKitMarkdown, p')
          const content = contentEl?.textContent?.trim()

          if (!content) continue

          // Create session on first user message
          if (!currentSessionRef.current && isUser) {
            currentSessionRef.current = createChatSession(agentId, agentName, agentColor, content)
          }

          // Add message to session
          if (currentSessionRef.current) {
            addMessageToSession(
              currentSessionRef.current.id,
              isUser ? 'user' : 'assistant',
              content
            )
          }
        }

        lastMessageCountRef.current = currentCount
      }

      // Create observer for new messages
      observerRef.current = new MutationObserver(() => {
        processMessages()
      })

      observerRef.current.observe(messagesContainer, {
        childList: true,
        subtree: true,
      })

      // Process any existing messages
      processMessages()
    }

    // Try to observe immediately and after delay
    observeMessages()
    const timeoutId = setTimeout(observeMessages, 1000)

    // Also observe for container creation
    const bodyObserver = new MutationObserver(() => {
      const messagesContainer = document.querySelector('.copilotKitMessages')
      if (messagesContainer && !observerRef.current) {
        observeMessages()
      }
    })

    bodyObserver.observe(document.body, {
      childList: true,
      subtree: true,
    })

    return () => {
      clearTimeout(timeoutId)
      observerRef.current?.disconnect()
      bodyObserver.disconnect()
    }
  }, [agentId, agentName, agentColor, sessionId])

  return {
    getCurrentSession: () => currentSessionRef.current,
  }
}
