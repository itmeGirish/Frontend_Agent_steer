import type { AgentConfig } from '../types'
import { BaseAgentWorkspace } from '../shared'

interface LawWorkspaceProps {
  agent: AgentConfig
}

export function LawWorkspace({ agent }: LawWorkspaceProps) {
  return <BaseAgentWorkspace agent={agent} />
}
