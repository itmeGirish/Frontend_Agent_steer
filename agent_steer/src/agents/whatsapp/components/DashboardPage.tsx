import {
  TrendingUp,
  Users,
  MessageSquare,
  CheckCircle,
  ArrowUp,
  ArrowDown,
  BarChart3,
  PieChart,
  Activity
} from 'lucide-react'

interface DashboardPageProps {
  themeColor: string
}

// Dummy analytics data
const statsCards = [
  {
    id: 'messages',
    label: 'Total Messages',
    value: '12,847',
    change: '+12.5%',
    trend: 'up',
    icon: MessageSquare
  },
  {
    id: 'users',
    label: 'Active Users',
    value: '3,241',
    change: '+8.2%',
    trend: 'up',
    icon: Users
  },
  {
    id: 'responses',
    label: 'Response Rate',
    value: '94.2%',
    change: '+2.1%',
    trend: 'up',
    icon: CheckCircle
  },
  {
    id: 'engagement',
    label: 'Engagement',
    value: '78.5%',
    change: '-1.3%',
    trend: 'down',
    icon: TrendingUp
  },
]

const recentActivity = [
  { id: 1, action: 'New campaign launched', time: '2 mins ago', type: 'campaign' },
  { id: 2, action: 'User onboarding completed', time: '15 mins ago', type: 'user' },
  { id: 3, action: 'Broadcast sent to 500 users', time: '1 hour ago', type: 'broadcast' },
  { id: 4, action: 'Support ticket resolved', time: '2 hours ago', type: 'support' },
  { id: 5, action: 'New template created', time: '3 hours ago', type: 'template' },
]

const weeklyData = [
  { day: 'Mon', messages: 1200, responses: 1150 },
  { day: 'Tue', messages: 1400, responses: 1320 },
  { day: 'Wed', messages: 1100, responses: 1050 },
  { day: 'Thu', messages: 1600, responses: 1520 },
  { day: 'Fri', messages: 1800, responses: 1700 },
  { day: 'Sat', messages: 900, responses: 870 },
  { day: 'Sun', messages: 700, responses: 680 },
]

export function DashboardPage({ themeColor }: DashboardPageProps) {
  const maxMessages = Math.max(...weeklyData.map(d => d.messages))

  return (
    <div className="flex-1 bg-gray-50 p-6 overflow-y-auto">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
          <p className="text-gray-600 mt-1">Overview of your WhatsApp Agent performance</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {statsCards.map((stat) => (
            <div
              key={stat.id}
              className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm"
            >
              <div className="flex items-center justify-between mb-3">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: `${themeColor}15` }}
                >
                  <stat.icon className="w-5 h-5" style={{ color: themeColor }} />
                </div>
                <div className={`flex items-center gap-1 text-sm font-medium ${
                  stat.trend === 'up' ? 'text-green-600' : 'text-red-500'
                }`}>
                  {stat.trend === 'up' ? (
                    <ArrowUp className="w-4 h-4" />
                  ) : (
                    <ArrowDown className="w-4 h-4" />
                  )}
                  {stat.change}
                </div>
              </div>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
          {/* Weekly Messages Chart */}
          <div className="lg:col-span-2 bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-gray-400" />
                <h3 className="font-semibold text-gray-900">Weekly Messages</h3>
              </div>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: themeColor }} />
                  <span className="text-gray-600">Messages</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-gray-300" />
                  <span className="text-gray-600">Responses</span>
                </div>
              </div>
            </div>
            <div className="flex items-end justify-between h-48 gap-2 pt-4">
              {weeklyData.map((data) => (
                <div key={data.day} className="flex-1 flex flex-col items-center gap-1">
                  <div className="w-full flex gap-1 justify-center" style={{ height: '160px' }}>
                    <div
                      className="w-4 rounded-t transition-all"
                      style={{
                        backgroundColor: themeColor,
                        height: `${(data.messages / maxMessages) * 100}%`
                      }}
                    />
                    <div
                      className="w-4 bg-gray-300 rounded-t transition-all"
                      style={{
                        height: `${(data.responses / maxMessages) * 100}%`
                      }}
                    />
                  </div>
                  <span className="text-xs text-gray-500 mt-2">{data.day}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Channel Distribution */}
          <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <PieChart className="w-5 h-5 text-gray-400" />
              <h3 className="font-semibold text-gray-900">Message Types</h3>
            </div>
            <div className="space-y-3">
              {[
                { label: 'Text Messages', value: 65, color: themeColor },
                { label: 'Media', value: 20, color: '#3b82f6' },
                { label: 'Documents', value: 10, color: '#f59e0b' },
                { label: 'Voice', value: 5, color: '#a855f7' },
              ].map((item) => (
                <div key={item.label}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">{item.label}</span>
                    <span className="font-medium text-gray-900">{item.value}%</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{ width: `${item.value}%`, backgroundColor: item.color }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Activity className="w-5 h-5 text-gray-400" />
            <h3 className="font-semibold text-gray-900">Recent Activity</h3>
          </div>
          <div className="divide-y divide-gray-100">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: themeColor }}
                  />
                  <span className="text-sm text-gray-900">{activity.action}</span>
                </div>
                <span className="text-xs text-gray-500">{activity.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
