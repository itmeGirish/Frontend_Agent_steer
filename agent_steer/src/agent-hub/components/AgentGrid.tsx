import { AgentCard } from './AgentCard'
import type { AgentConfig } from '@/agents/types'

interface AgentGridProps {
  agents: AgentConfig[]
}

export function AgentGrid({ agents }: AgentGridProps) {
  return (
    <div className="w-full max-w-[720px]">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900">Available Agents</h2>
        <p className="text-sm text-gray-500 mt-1">Select an agent to open its dedicated workspace</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {agents.map((agent) => (
          <AgentCard key={agent.id} agent={agent} />
        ))}
      </div>
    </div>
  )
}
