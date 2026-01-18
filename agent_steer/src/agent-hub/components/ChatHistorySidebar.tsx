import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Search,
  RefreshCw,
  Minus,
  MessageSquare,
  Briefcase,
  FileText,
  Send,
  Users,
  Bot,
  Trash2
} from 'lucide-react'
import type { ChatSession } from '../types'
import { getAllChatSessions, deleteChatSession } from '../utils'

// Icon mapping based on agent or content type
function getSessionIcon(session: ChatSession) {
  const agentId = session.agentId.toLowerCase()
  const title = session.title.toLowerCase()

  if (agentId.includes('whatsapp') || title.includes('broadcast') || title.includes('message')) {
    return Send
  }
  if (title.includes('job') || title.includes('application') || title.includes('onboarding')) {
    return Briefcase
  }
  if (agentId.includes('drafting') || title.includes('document') || title.includes('draft')) {
    return FileText
  }
  if (agentId.includes('customer') || title.includes('customer') || title.includes('support')) {
    return Users
  }
  if (agentId.includes('law') || title.includes('legal') || title.includes('law')) {
    return FileText
  }
  return Bot
}

export function ChatHistorySidebar() {
  const [sessions, setSessions] = useState<ChatSession[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const navigate = useNavigate()

  const loadSessions = () => {
    setSessions(getAllChatSessions())
  }

  useEffect(() => {
    loadSessions()
  }, [])

  const handleSessionClick = (session: ChatSession) => {
    navigate(`/agents/${session.agentId}?session=${session.id}`)
  }

  const handleDelete = (e: React.MouseEvent, sessionId: string) => {
    e.stopPropagation()
    deleteChatSession(sessionId)
    loadSessions()
  }

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))

    if (diffDays === 0) {
      return 'Today'
    } else if (diffDays === 1) {
      return 'Yesterday'
    } else {
      return date.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
      })
    }
  }

  const filteredSessions = sessions.filter(session =>
    session.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    session.agentName.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <aside className="w-[280px] h-full bg-white border-r border-gray-200 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
        <h2 className="text-base font-semibold text-gray-900">Task List</h2>
        <div className="flex items-center gap-1">
          <button
            onClick={loadSessions}
            className="p-1.5 rounded hover:bg-gray-100 transition-colors"
            title="Refresh"
          >
            <RefreshCw className="w-4 h-4 text-gray-500" />
          </button>
          <button
            className="p-1.5 rounded hover:bg-gray-100 transition-colors"
            title="Collapse"
          >
            <Minus className="w-4 h-4 text-gray-500" />
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="px-3 py-2">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search Chats"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          />
        </div>
      </div>

      {/* Divider */}
      <div className="mx-3 border-t border-gray-100" />

      {/* Sessions List */}
      <div className="flex-1 overflow-y-auto">
        {filteredSessions.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-40 text-gray-400 px-4">
            <MessageSquare className="w-8 h-8 mb-2 opacity-50" />
            <p className="text-sm text-center">
              {searchQuery ? 'No matching chats' : 'No chat history yet'}
            </p>
          </div>
        ) : (
          <div className="py-1">
            {filteredSessions.map((session) => {
              const Icon = getSessionIcon(session)
              return (
                <button
                  key={session.id}
                  onClick={() => handleSessionClick(session)}
                  className="w-full px-3 py-2.5 flex items-start gap-3 hover:bg-gray-50 transition-colors text-left group"
                >
                  {/* Icon */}
                  <div
                    className="w-6 h-6 rounded flex items-center justify-center flex-shrink-0 mt-0.5"
                    style={{
                      backgroundColor: `${session.agentColor}15`,
                      color: session.agentColor
                    }}
                  >
                    <Icon className="w-3.5 h-3.5" />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {session.title}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {formatDate(session.updatedAt)}
                    </p>
                  </div>

                  {/* Delete button - shows on hover */}
                  <button
                    onClick={(e) => handleDelete(e, session.id)}
                    className="p-1 rounded opacity-0 group-hover:opacity-100 hover:bg-gray-200 transition-all flex-shrink-0"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-gray-400" />
                  </button>
                </button>
              )
            })}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-3 py-2 border-t border-gray-100">
        <p className="text-xs text-gray-400 text-center">
          {sessions.length} conversation{sessions.length !== 1 ? 's' : ''}
        </p>
      </div>
    </aside>
  )
}
