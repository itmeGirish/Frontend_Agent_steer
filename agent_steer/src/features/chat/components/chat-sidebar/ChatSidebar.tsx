import { useState } from 'react'
import { cn } from '../../../../utils/cn'
import type { ChatSidebarProps } from './ChatSidebar.types'
import { 
  Plus,
  Minus,
  Search,
  MessageSquare,
  FolderOpen,
  Compass,
  Link2,
  Gift,
  User,
  RefreshCw,
  Globe,
  Radio,
  Megaphone
} from 'lucide-react'

export function ChatSidebar({
  chats,
  activeChatId,
  onNewChat,
  onSelectChat,
  isCollapsed = false,
  onToggle,
}: ChatSidebarProps) {
  const [searchQuery, setSearchQuery] = useState('')

  const tasks = [
    {
      id: '1',
      icon: Globe,
      title: 'Simple Website or Web App',
      date: 'Thu, Dec 25, 2025'
    },
    {
      id: '2', 
      icon: Radio,
      title: 'WhatsApp AI Broadcast Tool ...',
      date: 'Thu, Nov 20, 2025'
    },
    {
      id: '3',
      icon: Megaphone,
      title: 'WhatsApp AI Marketing Broa...',
      date: 'Thu, Nov 20, 2025'
    },
  ]

  return (
    <div className="flex h-full">
      {/* Icon sidebar - Always visible */}
      <aside className="flex flex-col bg-white border-r border-gray-100 w-[60px] flex-shrink-0">
        {/* Top section */}
        <div className="flex flex-col items-center gap-1 p-2 pt-3">
          <button
            onClick={onNewChat}
            className="w-10 h-10 rounded-xl bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors flex items-center justify-center"
          >
            <Plus className="w-5 h-5" />
          </button>
          
          <button
            onClick={onToggle}
            className="w-10 h-10 rounded-xl text-gray-400 hover:bg-gray-100 transition-colors flex items-center justify-center"
          >
            <Minus className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation icons */}
        <nav className="flex-1 flex flex-col items-center gap-1 py-4">
          <button className={cn(
            "w-10 h-10 rounded-xl flex items-center justify-center transition-colors",
            !isCollapsed ? "bg-blue-50 text-blue-500" : "text-gray-400 hover:bg-gray-100"
          )}>
            <FolderOpen className="w-5 h-5" />
          </button>
          <button className="w-10 h-10 rounded-xl text-gray-400 hover:bg-gray-100 transition-colors flex items-center justify-center">
            <MessageSquare className="w-5 h-5" />
          </button>
          <button className="w-10 h-10 rounded-xl text-gray-400 hover:bg-gray-100 transition-colors flex items-center justify-center">
            <Compass className="w-5 h-5" />
          </button>
          <button className="w-10 h-10 rounded-xl text-gray-400 hover:bg-gray-100 transition-colors flex items-center justify-center">
            <Link2 className="w-5 h-5" />
          </button>
        </nav>

        {/* Bottom icons */}
        <div className="flex flex-col items-center gap-1 p-2 pb-3 border-t border-gray-100">
          <button className="w-10 h-10 rounded-xl text-orange-400 hover:bg-orange-50 transition-colors flex items-center justify-center">
            <Gift className="w-5 h-5" />
          </button>
          <button className="w-10 h-10 rounded-xl text-gray-400 hover:bg-gray-100 transition-colors flex items-center justify-center">
            <User className="w-5 h-5" />
          </button>
        </div>
      </aside>

      {/* Expanded panel - Collapsible */}
      <div
        className={cn(
          'flex flex-col bg-white border-r border-gray-100 transition-all duration-300 overflow-hidden',
          isCollapsed ? 'w-0' : 'w-[260px]'
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
          <h2 className="font-semibold text-gray-900">Task List</h2>
          <div className="flex items-center gap-1">
            <button className="w-8 h-8 rounded-lg text-gray-400 hover:bg-gray-100 transition-colors flex items-center justify-center">
              <RefreshCw className="w-4 h-4" />
            </button>
            <button 
              onClick={onToggle}
              className="w-8 h-8 rounded-lg text-gray-400 hover:bg-gray-100 transition-colors flex items-center justify-center"
            >
              <Minus className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="px-3 py-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Chats"
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-gray-50 border-0 text-gray-800 placeholder:text-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-gray-200 transition-all"
            />
          </div>
        </div>

        {/* Task List */}
        <div className="flex-1 overflow-y-auto px-2">
          {tasks.map((task) => (
            <button
              key={task.id}
              onClick={() => onSelectChat(task.id)}
              className={cn(
                'w-full flex items-start gap-3 px-3 py-3 rounded-xl text-left transition-colors',
                activeChatId === task.id
                  ? 'bg-gray-100'
                  : 'hover:bg-gray-50'
              )}
            >
              <task.icon className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-800 truncate">
                  {task.title}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">
                  {task.date}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}