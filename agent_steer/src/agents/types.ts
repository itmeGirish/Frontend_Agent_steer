import type { LucideIcon } from 'lucide-react'

// Agent action types
export type AgentActionType =
  | 'onboarding'
  | 'job_application'
  | 'customer_support'
  | 'document_draft'
  | 'legal_review'
  | 'message_template'
  | 'broadcast'
  | 'analytics'
  | string // Allow custom action types

// Agent action configuration
export interface AgentAction {
  id: AgentActionType
  label: string
  description: string
  icon: LucideIcon
  prompt: string // The prompt to send to CopilotKit
}

// Agent configuration
export interface AgentConfig {
  id: string
  name: string
  description: string
  icon: LucideIcon
  color: string
  bgColor: string
  borderColor: string
  actions: AgentAction[]
  copilotAgentName: string // LangGraph agent name
}

// Agent workspace component type
export type AgentWorkspaceComponent = React.ComponentType<{ agent: AgentConfig }>
