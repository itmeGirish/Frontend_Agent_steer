import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { MessageSquare, Trash2, Clock, ChevronRight } from 'lucide-react'
import type { ChatSession } from '../types'
import { getAllChatSessions, deleteChatSession } from '../utils'

interface ChatHistoryPanelProps {
  isOpen: boolean
  onClose: () => void
}

export function ChatHistoryPanel({ isOpen, onClose }: ChatHistoryPanelProps) {
  const [sessions, setSessions] = useState<ChatSession[]>([])
  const navigate = useNavigate()

  useEffect(() => {
    if (isOpen) {
      setSessions(getAllChatSessions())
    }
  }, [isOpen])

  const handleSessionClick = (session: ChatSession) => {
    // Navigate to the agent workspace with the session
    navigate(`/agents/${session.agentId}?session=${session.id}`)
    onClose()
  }

  const handleDelete = (e: React.MouseEvent, sessionId: string) => {
    e.stopPropagation()
    deleteChatSession(sessionId)
    setSessions(getAllChatSessions())
  }

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))

    if (diffDays === 0) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    } else if (diffDays === 1) {
      return 'Yesterday'
    } else if (diffDays < 7) {
      return date.toLocaleDateString([], { weekday: 'short' })
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' })
    }
  }

  const groupSessionsByDate = (sessions: ChatSession[]) => {
    const today: ChatSession[] = []
    const yesterday: ChatSession[] = []
    const thisWeek: ChatSession[] = []
    const older: ChatSession[] = []

    const now = new Date()
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime()
    const yesterdayStart = todayStart - 24 * 60 * 60 * 1000
    const weekStart = todayStart - 7 * 24 * 60 * 60 * 1000

    sessions.forEach((session) => {
      if (session.updatedAt >= todayStart) {
        today.push(session)
      } else if (session.updatedAt >= yesterdayStart) {
        yesterday.push(session)
      } else if (session.updatedAt >= weekStart) {
        thisWeek.push(session)
      } else {
        older.push(session)
      }
    })

    return { today, yesterday, thisWeek, older }
  }

  const grouped = groupSessionsByDate(sessions)

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/20" onClick={onClose} />

      {/* Panel */}
      <div className="relative w-80 bg-white h-full shadow-xl flex flex-col animate-slide-in">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-gray-500" />
            <h2 className="text-lg font-semibold text-gray-900">Chat History</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <ChevronRight className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Sessions List */}
        <div className="flex-1 overflow-y-auto">
          {sessions.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400 px-4">
              <MessageSquare className="w-12 h-12 mb-3 opacity-50" />
              <p className="text-sm text-center">No chat history yet</p>
              <p className="text-xs text-center mt-1">
                Start a conversation with any agent
              </p>
            </div>
          ) : (
            <div className="py-2">
              {grouped.today.length > 0 && (
                <SessionGroup title="Today" sessions={grouped.today} onSessionClick={handleSessionClick} onDelete={handleDelete} formatTime={formatTime} />
              )}
              {grouped.yesterday.length > 0 && (
                <SessionGroup title="Yesterday" sessions={grouped.yesterday} onSessionClick={handleSessionClick} onDelete={handleDelete} formatTime={formatTime} />
              )}
              {grouped.thisWeek.length > 0 && (
                <SessionGroup title="This Week" sessions={grouped.thisWeek} onSessionClick={handleSessionClick} onDelete={handleDelete} formatTime={formatTime} />
              )}
              {grouped.older.length > 0 && (
                <SessionGroup title="Older" sessions={grouped.older} onSessionClick={handleSessionClick} onDelete={handleDelete} formatTime={formatTime} />
              )}
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes slide-in {
          from {
            transform: translateX(-100%);
          }
          to {
            transform: translateX(0);
          }
        }
        .animate-slide-in {
          animation: slide-in 0.2s ease-out;
        }
      `}</style>
    </div>
  )
}

interface SessionGroupProps {
  title: string
  sessions: ChatSession[]
  onSessionClick: (session: ChatSession) => void
  onDelete: (e: React.MouseEvent, sessionId: string) => void
  formatTime: (timestamp: number) => string
}

function SessionGroup({ title, sessions, onSessionClick, onDelete, formatTime }: SessionGroupProps) {
  return (
    <div className="mb-4">
      <h3 className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
        {title}
      </h3>
      {sessions.map((session) => (
        <button
          key={session.id}
          onClick={() => onSessionClick(session)}
          className="w-full px-4 py-3 flex items-start gap-3 hover:bg-gray-50 transition-colors text-left group"
        >
          {/* Agent color indicator */}
          <div
            className="w-2 h-2 rounded-full mt-2 flex-shrink-0"
            style={{ backgroundColor: session.agentColor }}
          />

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-medium text-gray-500 truncate">
                {session.agentName}
              </span>
              <span className="text-xs text-gray-400 flex-shrink-0">
                {formatTime(session.updatedAt)}
              </span>
            </div>
            <p className="text-sm text-gray-900 truncate mt-0.5">
              {session.title}
            </p>
            {session.messages.length > 0 && (
              <p className="text-xs text-gray-400 truncate mt-1">
                {session.messages[session.messages.length - 1].content.slice(0, 60)}
              </p>
            )}
          </div>

          {/* Delete button */}
          <button
            onClick={(e) => onDelete(e, session.id)}
            className="p-1.5 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-gray-200 transition-all flex-shrink-0"
          >
            <Trash2 className="w-4 h-4 text-gray-400" />
          </button>
        </button>
      ))}
    </div>
  )
}
