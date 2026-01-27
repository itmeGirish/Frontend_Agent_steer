import { useState, useEffect, useRef } from 'react'
import { useSearchParams } from 'react-router-dom'
import { CopilotKit } from '@copilotkit/react-core'
import { CopilotChat, type CopilotKitCSSProperties } from '@copilotkit/react-ui'
import { useFrontendTool } from '@copilotkit/react-core'
import { createRoot, type Root } from 'react-dom/client'
import '@copilotkit/react-ui/styles.css'

import type { AgentConfig } from '../types'
import {
  AgentHeader,
  AgentActionButton,
  useHideCopilotBanner,
  useAutoScroll,
  useChatStyles,
  useChatHistory,
  sendMessageToChat,
} from '../shared'
import { useJobApplicationWorkflow } from './workflows'
import {
  WhatsAppSidebar,
  DashboardPage,
  BroadcastingPage,
  BroadcastingCampaignPage,
  OnboardingPage,
  ProactiveAgentsPage,
  ContentCreationPage,
  type FeatureId
} from './components'

interface WhatsAppWorkspaceProps {
  agent: AgentConfig
}

// Theme color helper
function getThemeColor(agent: AgentConfig): string {
  const colorMap: Record<string, string> = {
    'text-green-500': '#22c55e',
    'text-blue-500': '#3b82f6',
    'text-purple-500': '#a855f7',
    'text-amber-500': '#f59e0b',
  }
  return colorMap[agent.color] || '#22c55e'
}

// Hook to inject onboarding button above chat input
function useOnboardingButtonInjection(activeFeature: FeatureId, themeColor: string) {
  const rootRef = useRef<Root | null>(null)
  const containerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const injectButton = () => {
      const inputContainer = document.querySelector('.copilotKitInput')
      if (!inputContainer) return

      // Remove existing container if feature changed
      if (containerRef.current && inputContainer.parentElement?.contains(containerRef.current)) {
        if (activeFeature !== 'onboarding') {
          // Remove the button if not on onboarding page
          if (rootRef.current) {
            rootRef.current.unmount()
            rootRef.current = null
          }
          containerRef.current.remove()
          containerRef.current = null
          return
        }
        // Update existing content
        if (rootRef.current) {
          rootRef.current.render(
            <OnboardingButtonContent themeColor={themeColor} />
          )
        }
        return
      }

      // Only inject if on onboarding page
      if (activeFeature !== 'onboarding') return

      // Create container for button
      const buttonContainer = document.createElement('div')
      buttonContainer.className = 'onboarding-button-injected'
      containerRef.current = buttonContainer

      // Insert before the input container
      inputContainer.parentElement?.insertBefore(buttonContainer, inputContainer)

      // Create React root and render
      const root = createRoot(buttonContainer)
      rootRef.current = root
      root.render(
        <OnboardingButtonContent themeColor={themeColor} />
      )
    }

    // Try to inject immediately
    injectButton()

    // Also try after a delay
    const timeoutId = setTimeout(injectButton, 500)

    // Use MutationObserver to detect changes
    const observer = new MutationObserver(() => {
      injectButton()
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
  }, [activeFeature, themeColor])
}

// Onboarding button component
function OnboardingButtonContent({ themeColor }: { themeColor: string }) {
  const [isLoading, setIsLoading] = useState(false)

  const handleOnboardingClick = () => {
    if (isLoading) return

    console.log('[OnboardingButton] Button clicked, sending message to chat...')
    setIsLoading(true)

    // Show loading indicator in chat area
    const messagesContainer = document.querySelector('.copilotKitMessages')
    if (messagesContainer) {
      const loadingDiv = document.createElement('div')
      loadingDiv.className = 'copilotKitTypingIndicator'
      loadingDiv.id = 'onboarding-loading'
      loadingDiv.innerHTML = '<span></span><span></span><span></span>'
      messagesContainer.appendChild(loadingDiv)
      messagesContainer.scrollTop = messagesContainer.scrollHeight
    }

    sendMessageToChat('Start user onboarding process')

    // Reset loading state after a delay (response should come before this)
    setTimeout(() => {
      setIsLoading(false)
      const loadingEl = document.getElementById('onboarding-loading')
      if (loadingEl) loadingEl.remove()
    }, 30000)
  }

  return (
    <div className="px-3 py-2 bg-white border-t border-gray-100">
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
        <button
          onClick={handleOnboardingClick}
          disabled={isLoading}
          style={{
            padding: '6px 12px',
            borderRadius: '9999px',
            fontSize: '12px',
            fontWeight: 500,
            transition: 'all 0.2s',
            backgroundColor: isLoading ? '#e5e7eb' : `${themeColor}15`,
            color: isLoading ? '#9ca3af' : themeColor,
            border: 'none',
            cursor: isLoading ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}
          onMouseEnter={(e) => !isLoading && (e.currentTarget.style.opacity = '0.8')}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
        >
          {isLoading && (
            <span style={{
              width: '12px',
              height: '12px',
              border: '2px solid #d1d5db',
              borderTopColor: themeColor,
              borderRadius: '50%',
              animation: 'spin 0.8s linear infinite',
            }} />
          )}
          {isLoading ? 'Starting...' : 'Onboarding'}
        </button>
      </div>
    </div>
  )
}

// Hook to inject broadcasting button above chat input
function useBroadcastingButtonInjection(activeFeature: FeatureId, themeColor: string) {
  const rootRef = useRef<Root | null>(null)
  const containerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const injectButton = () => {
      const inputContainer = document.querySelector('.copilotKitInput')
      if (!inputContainer) return

      if (containerRef.current && inputContainer.parentElement?.contains(containerRef.current)) {
        if (activeFeature !== 'broadcast') {
          if (rootRef.current) {
            rootRef.current.unmount()
            rootRef.current = null
          }
          containerRef.current.remove()
          containerRef.current = null
          return
        }
        if (rootRef.current) {
          rootRef.current.render(
            <BroadcastingButtonContent themeColor={themeColor} />
          )
        }
        return
      }

      if (activeFeature !== 'broadcast') return

      const buttonContainer = document.createElement('div')
      buttonContainer.className = 'broadcasting-button-injected'
      containerRef.current = buttonContainer

      inputContainer.parentElement?.insertBefore(buttonContainer, inputContainer)

      const root = createRoot(buttonContainer)
      rootRef.current = root
      root.render(
        <BroadcastingButtonContent themeColor={themeColor} />
      )
    }

    injectButton()
    const timeoutId = setTimeout(injectButton, 500)

    const observer = new MutationObserver(() => {
      injectButton()
    })
    observer.observe(document.body, { childList: true, subtree: true })

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
  }, [activeFeature, themeColor])
}

// Broadcasting button component
function BroadcastingButtonContent({ themeColor }: { themeColor: string }) {
  const [isLoading, setIsLoading] = useState(false)

  const handleBroadcastingClick = () => {
    if (isLoading) return

    console.log('[BroadcastingButton] Button clicked, sending message to chat...')
    setIsLoading(true)

    const messagesContainer = document.querySelector('.copilotKitMessages')
    if (messagesContainer) {
      const loadingDiv = document.createElement('div')
      loadingDiv.className = 'copilotKitTypingIndicator'
      loadingDiv.id = 'broadcasting-loading'
      loadingDiv.innerHTML = '<span></span><span></span><span></span>'
      messagesContainer.appendChild(loadingDiv)
      messagesContainer.scrollTop = messagesContainer.scrollHeight
    }

    sendMessageToChat('Start broadcasting campaign')

    setTimeout(() => {
      setIsLoading(false)
      const loadingEl = document.getElementById('broadcasting-loading')
      if (loadingEl) loadingEl.remove()
    }, 30000)
  }

  return (
    <div className="px-3 py-2 bg-white border-t border-gray-100">
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
        <button
          onClick={handleBroadcastingClick}
          disabled={isLoading}
          style={{
            padding: '6px 12px',
            borderRadius: '9999px',
            fontSize: '12px',
            fontWeight: 500,
            transition: 'all 0.2s',
            backgroundColor: isLoading ? '#e5e7eb' : `${themeColor}15`,
            color: isLoading ? '#9ca3af' : themeColor,
            border: 'none',
            cursor: isLoading ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}
          onMouseEnter={(e) => !isLoading && (e.currentTarget.style.opacity = '0.8')}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
        >
          {isLoading && (
            <span style={{
              width: '12px',
              height: '12px',
              border: '2px solid #d1d5db',
              borderTopColor: themeColor,
              borderRadius: '50%',
              animation: 'spin 0.8s linear infinite',
            }} />
          )}
          {isLoading ? 'Starting...' : 'New Campaign'}
        </button>
      </div>
    </div>
  )
}

// Component to register workflow tools - always rendered inside CopilotKit
// Note: Onboarding workflow hooks are now in OnboardingPage component
function WorkflowToolsProvider({ themeColor, agentId }: { themeColor: string; agentId: string }) {
  console.log('[WorkflowToolsProvider] Registering workflow tools for agent:', agentId)
  // Register job application workflow (onboarding is handled by OnboardingPage)
  useJobApplicationWorkflow(themeColor, agentId)
  console.log('[WorkflowToolsProvider] Workflow tools registered')
  return null
}

export function WhatsAppWorkspace({ agent }: WhatsAppWorkspaceProps) {
  const [searchParams] = useSearchParams()
  const sessionId = searchParams.get('session')
  const [themeColor, setThemeColor] = useState(getThemeColor(agent))
  const [activeFeature, setActiveFeature] = useState<FeatureId>('dashboard')

  useEffect(() => {
    setThemeColor(getThemeColor(agent))
  }, [agent.id])

  // Apply shared hooks
  useHideCopilotBanner()
  useChatStyles()
  useAutoScroll('.w-\\[550px\\]')
  useChatHistory({
    agentId: agent.id,
    agentName: agent.name,
    agentColor: themeColor,
    sessionId,
  })

  // Inject onboarding button only when on onboarding page
  useOnboardingButtonInjection(activeFeature, themeColor)

  // Inject broadcasting button only when on broadcast page
  useBroadcastingButtonInjection(activeFeature, themeColor)

  // Render the appropriate content based on active feature
  const renderMainContent = () => {
    switch (activeFeature) {
      case 'dashboard':
        return <DashboardPage themeColor={themeColor} />
      case 'broadcast':
        return <BroadcastingCampaignPage themeColor={themeColor} />
      case 'onboarding':
        return <OnboardingPage themeColor={themeColor} />
      case 'proactive':
        return <ProactiveAgentsPage themeColor={themeColor} />
      case 'content':
        return <ContentCreationPage themeColor={themeColor} />
      case 'home':
      default:
        return (
          <WhatsAppMainContent
            agent={agent}
            themeColor={themeColor}
            setThemeColor={setThemeColor}
          />
        )
    }
  }

  return (
    <CopilotKit runtimeUrl="/api/copilotkit" agent={agent.copilotAgentName}>
      {/* Register workflow tools - always active */}
      <WorkflowToolsProvider themeColor={themeColor} agentId={agent.id} />

      <div
        style={{ '--copilot-kit-primary-color': themeColor } as CopilotKitCSSProperties}
        className="h-screen flex bg-white"
      >
        {/* Left Sidebar with Icons and Chat History */}
        <WhatsAppSidebar
          agentId={agent.id}
          themeColor={themeColor}
          activeFeature={activeFeature}
          onFeatureChange={setActiveFeature}
        />

        {/* Main Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <AgentHeader agent={agent} />
          <div className="flex-1 flex overflow-hidden">
            {/* Main Content Area - Changes based on selected feature */}
            <div className="flex-1 overflow-y-auto">
              {renderMainContent()}
            </div>
            {/* Chat Panel with Scrollbar - Always visible */}
            <div className="w-[550px] border-l border-gray-200 flex flex-col overflow-hidden chat-panel-container">
              <div className="flex-1 overflow-y-auto chat-panel-scrollable">
                <CopilotChat
                  labels={{
                    title: agent.name,
                    initial: `Hi! I'm your ${agent.name}. ${agent.description}`,
                  }}
                  instructions={`You are ${agent.name}. ${agent.description}`}
                  className="h-full"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </CopilotKit>
  )
}

interface WhatsAppMainContentProps {
  agent: AgentConfig
  themeColor: string
  setThemeColor: (color: string) => void
}

function WhatsAppMainContent({ agent, themeColor, setThemeColor }: WhatsAppMainContentProps) {
  // Theme color tool
  useFrontendTool({
    name: 'setThemeColor',
    parameters: [
      { name: 'themeColor', description: 'The theme color to set.', required: true },
    ],
    handler({ themeColor: newColor }: { themeColor: string }) {
      setThemeColor(newColor)
    },
  })

  // Note: Workflow tools are registered in WorkflowToolsProvider (always active)

  const handleActionClick = (prompt: string) => {
    sendMessageToChat(prompt)
  }

  return (
    <div className="flex-1 bg-gray-50 p-6 overflow-y-auto">
      <div className="max-w-4xl mx-auto">
        {/* Welcome */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Welcome to {agent.name}
          </h2>
          <p className="text-gray-600">{agent.description}</p>
        </div>

        {/* Actions Grid */}
        <div className="mb-8">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
            Quick Actions
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {agent.actions.map((action) => (
              <AgentActionButton
                key={action.id}
                action={action}
                themeColor={themeColor}
                onClick={handleActionClick}
              />
            ))}
          </div>
        </div>

        {/* Info Card */}
        <div
          className="p-6 rounded-xl border"
          style={{
            backgroundColor: `${themeColor}08`,
            borderColor: `${themeColor}30`,
          }}
        >
          <h3 className="font-semibold text-gray-900 mb-2">Getting Started</h3>
          <p className="text-sm text-gray-600 mb-4">
            Use the chat sidebar to interact with {agent.name}.
            Click any quick action or type your own message.
          </p>
          <div className="flex flex-wrap gap-2">
            {agent.actions.slice(0, 3).map((action) => (
              <span
                key={action.id}
                className="px-3 py-1 rounded-full text-xs font-medium"
                style={{
                  backgroundColor: `${themeColor}15`,
                  color: themeColor,
                }}
              >
                {action.label}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
