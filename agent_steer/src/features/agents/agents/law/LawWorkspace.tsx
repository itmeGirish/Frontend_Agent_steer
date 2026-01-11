import type { AgentConfig } from '@/config/agents';
import { BaseAgentWorkspace } from '../base';

interface LawWorkspaceProps {
  agent: AgentConfig;
}

/**
 * Law Agent Workspace
 * Uses base template - extend with custom MainContent if needed
 */
export function LawWorkspace({ agent }: LawWorkspaceProps) {
  return <BaseAgentWorkspace agent={agent} />;
}
