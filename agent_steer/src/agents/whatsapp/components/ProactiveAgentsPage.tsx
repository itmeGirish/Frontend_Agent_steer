import { useState } from 'react'
import {
  Bot,
  Play,
  Pause,
  Settings,
  Plus,
  Search,
  Clock,
  MessageSquare,
  Users,
  Zap,
  ToggleLeft,
  ToggleRight,
  BarChart2,
  AlertCircle
} from 'lucide-react'

interface ProactiveAgentsPageProps {
  themeColor: string
}

// Dummy proactive agents data
const agents = [
  {
    id: 1,
    name: 'Welcome Bot',
    description: 'Greets new users and guides them through onboarding',
    status: 'active',
    triggered: 1250,
    responses: 1180,
    lastActive: '2 mins ago',
    trigger: 'New user signup',
  },
  {
    id: 2,
    name: 'Cart Abandonment',
    description: 'Reminds users about items left in cart',
    status: 'active',
    triggered: 890,
    responses: 420,
    lastActive: '15 mins ago',
    trigger: 'Cart idle > 1 hour',
  },
  {
    id: 3,
    name: 'Feedback Collector',
    description: 'Requests feedback after order delivery',
    status: 'paused',
    triggered: 560,
    responses: 280,
    lastActive: '2 hours ago',
    trigger: 'Order delivered',
  },
  {
    id: 4,
    name: 'Appointment Reminder',
    description: 'Sends reminders before scheduled appointments',
    status: 'active',
    triggered: 340,
    responses: 320,
    lastActive: '30 mins ago',
    trigger: 'Appointment in 24h',
  },
  {
    id: 5,
    name: 'Re-engagement Bot',
    description: 'Reaches out to inactive users with special offers',
    status: 'paused',
    triggered: 2100,
    responses: 450,
    lastActive: '1 day ago',
    trigger: 'User inactive > 30 days',
  },
]

const triggerTypes = [
  { id: 'event', label: 'Event Based', count: 8 },
  { id: 'time', label: 'Time Based', count: 5 },
  { id: 'behavior', label: 'Behavior Based', count: 4 },
  { id: 'custom', label: 'Custom Rules', count: 3 },
]

export function ProactiveAgentsPage({ themeColor }: ProactiveAgentsPageProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [agentStates, setAgentStates] = useState<Record<number, boolean>>(
    agents.reduce((acc, agent) => ({ ...acc, [agent.id]: agent.status === 'active' }), {})
  )

  const toggleAgent = (id: number) => {
    setAgentStates(prev => ({ ...prev, [id]: !prev[id] }))
  }

  const filteredAgents = agents.filter(a =>
    a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const activeCount = Object.values(agentStates).filter(Boolean).length

  return (
    <div className="flex-1 bg-gray-50 p-6 overflow-y-auto">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Proactive Agents</h2>
            <p className="text-gray-600 mt-1">Automated agents that engage users proactively</p>
          </div>
          <button
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-white font-medium transition-colors"
            style={{ backgroundColor: themeColor }}
          >
            <Plus className="w-4 h-4" />
            Create Agent
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          {[
            { label: 'Total Agents', value: agents.length.toString(), icon: Bot },
            { label: 'Active Now', value: activeCount.toString(), icon: Zap },
            { label: 'Total Triggered', value: '5.1K', icon: MessageSquare },
            { label: 'Response Rate', value: '52%', icon: BarChart2 },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm"
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: `${themeColor}15` }}
                >
                  <stat.icon className="w-5 h-5" style={{ color: themeColor }} />
                </div>
                <div>
                  <p className="text-xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-sm text-gray-500">{stat.label}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Trigger Types */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {triggerTypes.map((type) => (
            <div
              key={type.id}
              className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm hover:border-green-300 transition-colors cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-900">{type.label}</span>
                <span
                  className="text-xs font-medium px-2 py-0.5 rounded-full"
                  style={{ backgroundColor: `${themeColor}15`, color: themeColor }}
                >
                  {type.count}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Agents List */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
          <div className="p-4 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">All Agents</h3>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search agents..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500"
                />
              </div>
            </div>
          </div>
          <div className="divide-y divide-gray-100">
            {filteredAgents.map((agent) => {
              const isActive = agentStates[agent.id]
              return (
                <div
                  key={agent.id}
                  className="p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center"
                        style={{ backgroundColor: `${themeColor}15` }}
                      >
                        <Bot className="w-6 h-6" style={{ color: themeColor }} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium text-gray-900">{agent.name}</h4>
                          <span
                            className={`w-2 h-2 rounded-full ${isActive ? 'bg-green-500' : 'bg-gray-300'}`}
                          />
                        </div>
                        <p className="text-sm text-gray-500 mt-0.5">{agent.description}</p>
                        <div className="flex items-center gap-4 mt-2">
                          <span className="flex items-center gap-1 text-xs text-gray-400">
                            <AlertCircle className="w-3 h-3" />
                            {agent.trigger}
                          </span>
                          <span className="flex items-center gap-1 text-xs text-gray-400">
                            <Clock className="w-3 h-3" />
                            {agent.lastActive}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">{agent.triggered.toLocaleString()}</p>
                        <p className="text-xs text-gray-500">Triggered</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">
                          {Math.round((agent.responses / agent.triggered) * 100)}%
                        </p>
                        <p className="text-xs text-gray-500">Response</p>
                      </div>
                      <button
                        onClick={() => toggleAgent(agent.id)}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        {isActive ? (
                          <ToggleRight className="w-8 h-8" style={{ color: themeColor }} />
                        ) : (
                          <ToggleLeft className="w-8 h-8 text-gray-300" />
                        )}
                      </button>
                      <button className="p-2 hover:bg-gray-100 rounded-lg">
                        <Settings className="w-4 h-4 text-gray-400" />
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
