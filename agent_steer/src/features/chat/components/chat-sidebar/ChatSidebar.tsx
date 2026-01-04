import { useState } from 'react'
import { cn } from '../../../../utils/cn'
import type { ChatSidebarProps } from './ChatSidebar.types'
import { Button } from '../../../../components/ui'
import { 
  Plus, 
  MessageSquare, 
  Trash2, 
  Search,
  X,
  PanelLeftClose,
  PanelLeft
} from 'lucide-react'

export function ChatSidebar({
  chats,
  activeChatId,
  onNewChat,
  onSelectChat,
  onDeleteChat,
  isCollapsed = false,
  onToggle,
}: ChatSidebarProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [hoveredChatId, setHoveredChatId] = useState<string | null>(null)

  // Filter chats by search query
  const filteredChats = chats.filter(
    (chat) =>
      chat.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      chat.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Format date for display
  const formatDate = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))

    if (days === 0) {
      return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
      })
    } else if (days === 1) {
      return 'Yesterday'
    } else if (days < 7) {
      return date.toLocaleDateString('en-US', { weekday: 'short' })
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      })
    }
  }

  return (
    <aside
      className={cn(
        'flex flex-col bg-slate-950 border-r border-slate-800 transition-all duration-300',
        isCollapsed ? 'w-0 overflow-hidden' : 'w-72'
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-800">
        <h2 className="text-lg font-semibold text-white">Chats</h2>
        <div className="flex items-center gap-1">
          {onToggle && (
            <button
              onClick={onToggle}
              className="p-2 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
              aria-label="Toggle sidebar"
            >
              {isCollapsed ? (
                <PanelLeft className="w-5 h-5" />
              ) : (
                <PanelLeftClose className="w-5 h-5" />
              )}
            </button>
          )}
        </div>
      </div>

      {/* New Chat Button */}
      <div className="p-3">
        <Button
          onClick={onNewChat}
          leftIcon={<Plus className="w-4 h-4" />}
          className="w-full justify-start"
          variant="secondary"
        >
          New Chat
        </Button>
      </div>

      {/* Search */}
      <div className="px-3 pb-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search chats..."
            className={cn(
              'w-full pl-9 pr-8 py-2 rounded-lg',
              'bg-slate-900 border border-slate-800',
              'text-slate-100 placeholder:text-slate-500',
              'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
              'transition-colors'
            )}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded text-slate-500 hover:text-slate-300"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto px-2">
        {filteredChats.length === 0 ? (
          <div className="text-center py-8 text-slate-500">
            {searchQuery ? 'No chats found' : 'No chats yet'}
          </div>
        ) : (
          <div className="space-y-1">
            {filteredChats.map((chat) => (
              <div
                key={chat.id}
                onMouseEnter={() => setHoveredChatId(chat.id)}
                onMouseLeave={() => setHoveredChatId(null)}
                onClick={() => onSelectChat(chat.id)}
                className={cn(
                  'group relative flex items-start gap-3 p-3 rounded-lg cursor-pointer',
                  'transition-colors duration-150',
                  activeChatId === chat.id
                    ? 'bg-slate-800 text-white'
                    : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
                )}
              >
                {/* Chat icon */}
                <MessageSquare className="w-5 h-5 flex-shrink-0 mt-0.5" />

                {/* Chat info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-medium truncate">{chat.title}</h3>
                    <span className="text-xs text-slate-500 flex-shrink-0">
                      {formatDate(chat.updatedAt)}
                    </span>
                  </div>
                  <p className="text-sm text-slate-500 truncate mt-0.5">
                    {chat.lastMessage}
                  </p>
                </div>

                {/* Delete button (visible on hover) */}
                {hoveredChatId === chat.id && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      onDeleteChat(chat.id)
                    }}
                    className={cn(
                      'absolute right-2 top-1/2 -translate-y-1/2',
                      'p-1.5 rounded-lg',
                      'text-slate-500 hover:text-red-400 hover:bg-slate-800',
                      'transition-colors'
                    )}
                    aria-label="Delete chat"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-slate-800">
        <p className="text-xs text-slate-600 text-center">
          {chats.length} conversation{chats.length !== 1 ? 's' : ''}
        </p>
      </div>
    </aside>
  )
}