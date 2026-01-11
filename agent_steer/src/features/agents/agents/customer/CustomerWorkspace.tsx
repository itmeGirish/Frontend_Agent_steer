import type { AgentConfig } from '@/config/agents';
import { BaseAgentWorkspace } from '../base';

interface CustomerWorkspaceProps {
  agent: AgentConfig;
}

/**
 * Customer Proactive Agent Workspace
 * Uses base template - extend with custom MainContent if needed
 */
export function CustomerWorkspace({ agent }: CustomerWorkspaceProps) {
  return <BaseAgentWorkspace agent={agent} />;
}
