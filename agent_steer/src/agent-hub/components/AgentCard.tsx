import { useNavigate } from 'react-router-dom'
import type { AgentConfig } from '@/agents/types'

interface AgentCardProps {
  agent: AgentConfig
}

export function AgentCard({ agent }: AgentCardProps) {
  const navigate = useNavigate()
  const Icon = agent.icon

  const handleClick = () => {
    navigate(`/agents/${agent.id}`)
  }

  return (
    <button
      onClick={handleClick}
      className="flex flex-col items-center gap-3 p-5 rounded-2xl bg-white border border-gray-100 hover:border-gray-200 hover:shadow-lg transition-all duration-200 group"
    >
      <div className={`w-14 h-14 rounded-2xl ${agent.bgColor} flex items-center justify-center group-hover:scale-110 transition-transform`}>
        <Icon className={`w-7 h-7 ${agent.color}`} />
      </div>
      <span className="text-sm text-gray-700 text-center font-medium leading-snug">
        {agent.name}
      </span>
    </button>
  )
}
