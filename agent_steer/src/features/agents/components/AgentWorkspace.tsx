import type { AgentConfig } from '@/config/agents';
import { getAgentWorkspace } from '../agents';

interface AgentWorkspaceProps {
  agent: AgentConfig;
}

/**
 * Main AgentWorkspace component.
 * Automatically selects the appropriate workspace based on agent ID.
 *
 * To add a new agent:
 * 1. Create a folder in src/features/agents/agents/[agent-name]/
 * 2. Create [AgentName]Workspace.tsx using BaseAgentWorkspace or custom
 * 3. Add to AGENT_WORKSPACES registry in agents/index.ts
 */
export function AgentWorkspace({ agent }: AgentWorkspaceProps) {
  const WorkspaceComponent = getAgentWorkspace(agent.id);
  return <WorkspaceComponent agent={agent} />;
}
