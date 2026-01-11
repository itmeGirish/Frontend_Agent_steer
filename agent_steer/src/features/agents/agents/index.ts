// Base template
export { BaseAgentWorkspace } from './base';

// Agent-specific workspaces
export { WhatsAppWorkspace } from './whatsapp';
export { CustomerWorkspace } from './customer';
export { DraftingWorkspace } from './drafting';
export { LawWorkspace } from './law';

// Agent workspace registry - maps agent ID to workspace component
import type { AgentConfig } from '@/config/agents';
import { WhatsAppWorkspace } from './whatsapp';
import { CustomerWorkspace } from './customer';
import { DraftingWorkspace } from './drafting';
import { LawWorkspace } from './law';
import { BaseAgentWorkspace } from './base';

type AgentWorkspaceComponent = React.ComponentType<{ agent: AgentConfig }>;

/**
 * Registry mapping agent IDs to their workspace components.
 * Add new agents here when creating them.
 */
export const AGENT_WORKSPACES: Record<string, AgentWorkspaceComponent> = {
  whatsapp: WhatsAppWorkspace,
  customer: CustomerWorkspace,
  drafting: DraftingWorkspace,
  law: LawWorkspace,
};

/**
 * Get the workspace component for an agent.
 * Falls back to BaseAgentWorkspace if no specific workspace is defined.
 */
export function getAgentWorkspace(agentId: string): AgentWorkspaceComponent {
  return AGENT_WORKSPACES[agentId] || BaseAgentWorkspace;
}
