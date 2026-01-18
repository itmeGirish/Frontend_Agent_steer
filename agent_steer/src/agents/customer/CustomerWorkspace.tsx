import type { AgentConfig } from '../types'
import { BaseAgentWorkspace } from '../shared'

interface CustomerWorkspaceProps {
  agent: AgentConfig
}

export function CustomerWorkspace({ agent }: CustomerWorkspaceProps) {
  return <BaseAgentWorkspace agent={agent} />
}
