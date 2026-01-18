// Agents - Main Registry
// Adding a new agent = create a new folder under /agents, register it here,
// and it appears automatically in the Agent Hub

import type { AgentConfig, AgentWorkspaceComponent } from './types'

// Import all agent configs and workspaces
import { whatsappAgentConfig, WhatsAppWorkspace } from './whatsapp'
import { customerAgentConfig, CustomerWorkspace } from './customer'
import { draftingAgentConfig, DraftingWorkspace } from './drafting'
import { lawAgentConfig, LawWorkspace } from './law'
import { BaseAgentWorkspace } from './shared'

// Agent Registry - Maps agent ID to config and workspace
// To add a new agent:
// 1. Create folder: /agents/[agent-name]/
// 2. Add config.ts, [AgentName]Workspace.tsx, index.ts
// 3. Register here
const AGENT_REGISTRY: Record<string, {
  config: AgentConfig
  workspace: AgentWorkspaceComponent
}> = {
  whatsapp: {
    config: whatsappAgentConfig,
    workspace: WhatsAppWorkspace,
  },
  customer: {
    config: customerAgentConfig,
    workspace: CustomerWorkspace,
  },
  drafting: {
    config: draftingAgentConfig,
    workspace: DraftingWorkspace,
  },
  law: {
    config: lawAgentConfig,
    workspace: LawWorkspace,
  },
}

/**
 * Get all registered agents
 * Used by Agent Hub to display available agents
 */
export function getAllAgents(): AgentConfig[] {
  return Object.values(AGENT_REGISTRY).map(entry => entry.config)
}

/**
 * Get agent config by ID
 */
export function getAgentById(id: string): AgentConfig | undefined {
  return AGENT_REGISTRY[id]?.config
}

/**
 * Get workspace component for an agent
 * Falls back to BaseAgentWorkspace if not found
 */
export function getAgentWorkspace(agentId: string): AgentWorkspaceComponent {
  return AGENT_REGISTRY[agentId]?.workspace || BaseAgentWorkspace
}

// Re-export types
export type { AgentConfig, AgentAction, AgentActionType, AgentWorkspaceComponent } from './types'

// Re-export shared utilities
export { BaseAgentWorkspace } from './shared'
