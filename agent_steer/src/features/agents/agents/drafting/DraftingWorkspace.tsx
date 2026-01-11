import type { AgentConfig } from '@/config/agents';
import { BaseAgentWorkspace } from '../base';

interface DraftingWorkspaceProps {
  agent: AgentConfig;
}

/**
 * Drafting Agent Workspace
 * Uses base template - extend with custom MainContent if needed
 */
export function DraftingWorkspace({ agent }: DraftingWorkspaceProps) {
  return <BaseAgentWorkspace agent={agent} />;
}
