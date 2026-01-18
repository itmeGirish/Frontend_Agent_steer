import type { AgentConfig } from '../types'
import { BaseAgentWorkspace } from '../shared'

interface DraftingWorkspaceProps {
  agent: AgentConfig
}

export function DraftingWorkspace({ agent }: DraftingWorkspaceProps) {
  return <BaseAgentWorkspace agent={agent} />
}
