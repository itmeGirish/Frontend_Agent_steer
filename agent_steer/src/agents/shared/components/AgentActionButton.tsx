import type { AgentAction } from '../../types'

interface AgentActionButtonProps {
  action: AgentAction
  themeColor: string
  onClick: (prompt: string) => void
}

export function AgentActionButton({ action, themeColor, onClick }: AgentActionButtonProps) {
  const Icon = action.icon

  return (
    <button
      onClick={() => onClick(action.prompt)}
      className="flex flex-col items-start gap-2 p-4 rounded-xl border border-gray-200 hover:border-gray-300 hover:shadow-sm transition-all text-left group"
    >
      <div
        className="w-10 h-10 rounded-lg flex items-center justify-center transition-colors"
        style={{ backgroundColor: `${themeColor}15` }}
      >
        <Icon className="w-5 h-5" style={{ color: themeColor }} />
      </div>
      <div>
        <h4 className="font-medium text-gray-900 text-sm">{action.label}</h4>
        <p className="text-xs text-gray-500 mt-0.5">{action.description}</p>
      </div>
    </button>
  )
}
