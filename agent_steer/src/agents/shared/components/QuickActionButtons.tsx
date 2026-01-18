import type { AgentAction } from '../../types'
import { sendMessageToChat } from '../hooks/useChatHelpers'

interface QuickActionButtonsProps {
  actions: AgentAction[]
  themeColor: string
}

export function QuickActionButtons({ actions, themeColor }: QuickActionButtonsProps) {
  return (
    <div className="p-3 border-t border-gray-200 bg-gray-50">
      <p className="text-xs text-gray-500 mb-2">Quick Actions</p>
      <div className="flex flex-wrap gap-2">
        {actions.map((action) => (
          <button
            key={action.id}
            onClick={() => sendMessageToChat(action.prompt)}
            className="px-3 py-1.5 rounded-full text-xs font-medium transition-colors"
            style={{
              backgroundColor: `${themeColor}15`,
              color: themeColor,
            }}
          >
            {action.label}
          </button>
        ))}
      </div>
    </div>
  )
}
