import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Megaphone,
  Bot,
  LayoutDashboard,
  PenTool,
  Home,
  Plus,
  MessageSquare,
  Search,
  RefreshCw,
  Minus,
  Trash2,
  Send,
  Briefcase,
  FileText,
  Users,
  CheckSquare,
  Settings,
  HelpCircle
} from 'lucide-react'
import type { ChatSession } from '@/agent-hub'
import { deleteChatSession, getChatSessionsByAgent } from '@/agent-hub'

interface WhatsAppSidebarProps {
  agentId: string
  themeColor: string
}

// Feature items for the icon bar
const features = [
  { id: 'broadcast', icon: Megaphone, label: 'Broadcasting Campaign' },
  { id: 'proactive', icon: Bot, label: 'Proactive Agents' },
  { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboards' },
  { id: 'content', icon: PenTool, label: 'Content Creation Agent' },
]

// Icon mapping for chat sessions
function getSessionIcon(session: ChatSession) {
  const title = session.title.toLowerCase()
  if (title.includes('broadcast') || title.includes('message') || title.includes('campaign')) {
    return Send
  }
  if (title.includes('job') || title.includes('application') || title.includes('onboarding')) {
    return Briefcase
  }
  if (title.includes('document') || title.includes('draft') || title.includes('template')) {
    return FileText
  }
  if (title.includes('customer') || title.includes('support')) {
    return Users
  }
  return MessageSquare
}

export function WhatsAppSidebar({ agentId, themeColor }: WhatsAppSidebarProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [sessions, setSessions] = useState<ChatSession[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const navigate = useNavigate()

  const loadSessions = () => {
    setSessions(getChatSessionsByAgent(agentId))
  }

  useEffect(() => {
    loadSessions()
  }, [agentId])

  const handleToggle = () => {
    setIsExpanded(!isExpanded)
  }

  const handleSessionClick = (session: ChatSession) => {
    navigate(`/agents/${session.agentId}?session=${session.id}`)
  }

  const handleDelete = (e: React.MouseEvent, sessionId: string) => {
    e.stopPropagation()
    deleteChatSession(sessionId)
    loadSessions()
  }

  const handleHomeClick = () => {
    navigate('/hub')
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
    session.title.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="flex h-full">
      {/* Icon Bar - Always visible */}
      <aside className="w-14 bg-gray-900 flex flex-col items-center py-3 gap-1">
        {/* Home */}
        <button
          onClick={handleHomeClick}
          className="w-10 h-10 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-800 hover:text-white transition-colors"
          title="Agent Hub"
        >
          <Home className="w-5 h-5" />
        </button>

        {/* New Chat */}
        <button
          className="w-10 h-10 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-800 hover:text-white transition-colors"
          title="New Chat"
        >
          <Plus className="w-5 h-5" />
        </button>

        {/* Task List / Chat History */}
        <button
          onClick={handleToggle}
          className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${
            isExpanded
              ? 'bg-gray-700 text-white'
              : 'text-gray-400 hover:bg-gray-800 hover:text-white'
          }`}
          title="Task List"
        >
          <CheckSquare className="w-5 h-5" />
        </button>

        {/* Divider */}
        <div className="w-6 h-px bg-gray-700 my-2" />

        {/* Feature Icons */}
        {features.map((feature) => (
          <button
            key={feature.id}
            className="w-10 h-10 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-800 hover:text-white transition-colors"
            title={feature.label}
          >
            <feature.icon className="w-5 h-5" />
          </button>
        ))}

        {/* Spacer */}
        <div className="flex-1" />

        {/* Bottom icons */}
        <button
          className="w-10 h-10 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-800 hover:text-white transition-colors"
          title="Help"
        >
          <HelpCircle className="w-5 h-5" />
        </button>
        <button
          className="w-10 h-10 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-800 hover:text-white transition-colors"
          title="Settings"
        >
          <Settings className="w-5 h-5" />
        </button>
      </aside>

      {/* Collapse/Expand Toggle Button - Like Genspark's two underscores */}
      <div className="w-8 bg-white border-r border-gray-200 flex flex-col items-center pt-3">
        <button
          onClick={handleToggle}
          className="p-1.5 rounded hover:bg-gray-100 transition-colors"
          title={isExpanded ? "Collapse" : "Expand Task List"}
        >
          <Minus className="w-4 h-4 text-gray-500" />
        </button>
      </div>

      {/* Expanded Task List Panel */}
      {isExpanded && (
        <aside className="w-72 bg-white border-r border-gray-200 flex flex-col animate-slide-in">
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
                onClick={handleToggle}
                className="p-1.5 rounded hover:bg-gray-100 transition-colors"
                title="Collapse"
              >
                <Minus className="w-4 h-4 text-gray-500" />
              </button>
            </div>
          </div>

          {/* Search */}
          <div className="px-3 py-2 border-b border-gray-100">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search Chats"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500"
              />
            </div>
          </div>

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
                          backgroundColor: `${themeColor}15`,
                          color: themeColor
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

                      {/* Delete */}
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
        </aside>
      )}

      <style>{`
        @keyframes slide-in {
          from {
            width: 0;
            opacity: 0;
          }
          to {
            width: 18rem;
            opacity: 1;
          }
        }
        .animate-slide-in {
          animation: slide-in 0.2s ease-out;
        }
      `}</style>
    </div>
  )
}
