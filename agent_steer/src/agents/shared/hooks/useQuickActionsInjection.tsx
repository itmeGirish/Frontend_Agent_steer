import { useEffect, useRef } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import type { AgentAction } from '../../types'
import { sendMessageToChat } from './useChatHelpers'

interface QuickActionsInjectionProps {
  actions: AgentAction[]
  themeColor: string
}

/**
 * Hook to inject quick action buttons above the CopilotKit input area
 */
export function useQuickActionsInjection({ actions, themeColor }: QuickActionsInjectionProps) {
  const rootRef = useRef<Root | null>(null)
  const containerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const injectQuickActions = () => {
      const inputContainer = document.querySelector('.copilotKitInput')
      if (!inputContainer) return

      // Check if already injected
      if (containerRef.current && inputContainer.parentElement?.contains(containerRef.current)) {
        // Update existing content
        if (rootRef.current) {
          rootRef.current.render(
            <QuickActionsContent actions={actions} themeColor={themeColor} />
          )
        }
        return
      }

      // Create container for quick actions
      const quickActionsContainer = document.createElement('div')
      quickActionsContainer.className = 'quick-actions-injected'
      containerRef.current = quickActionsContainer

      // Insert before the input container
      inputContainer.parentElement?.insertBefore(quickActionsContainer, inputContainer)

      // Create React root and render
      const root = createRoot(quickActionsContainer)
      rootRef.current = root
      root.render(
        <QuickActionsContent actions={actions} themeColor={themeColor} />
      )
    }

    // Try to inject immediately
    injectQuickActions()

    // Also try after a delay in case CopilotChat hasn't fully rendered
    const timeoutId = setTimeout(injectQuickActions, 500)

    // Use MutationObserver to detect when CopilotKit input is added
    const observer = new MutationObserver(() => {
      injectQuickActions()
    })

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    })

    return () => {
      clearTimeout(timeoutId)
      observer.disconnect()
      if (rootRef.current) {
        rootRef.current.unmount()
        rootRef.current = null
      }
      if (containerRef.current && containerRef.current.parentElement) {
        containerRef.current.parentElement.removeChild(containerRef.current)
        containerRef.current = null
      }
    }
  }, [actions, themeColor])
}

// Internal component for the quick actions content
function QuickActionsContent({ actions, themeColor }: QuickActionsInjectionProps) {
  return (
    <div className="px-3 py-2 bg-white border-t border-gray-100">
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
        {actions.map((action) => (
          <button
            key={action.id}
            onClick={() => sendMessageToChat(action.prompt)}
            style={{
              padding: '6px 12px',
              borderRadius: '9999px',
              fontSize: '12px',
              fontWeight: 500,
              transition: 'opacity 0.2s',
              backgroundColor: `${themeColor}15`,
              color: themeColor,
              border: 'none',
              cursor: 'pointer',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.8')}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
          >
            {action.label}
          </button>
        ))}
      </div>
    </div>
  )
}
