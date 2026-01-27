import { useState } from 'react'
import {
  FileText,
  Image,
  Video,
  Mic,
  Plus,
  Search,
  Star,
  Copy,
  Edit3,
  Trash2,
  Sparkles,
  Clock,
  FolderOpen
} from 'lucide-react'

interface ContentCreationPageProps {
  themeColor: string
}

// Dummy content data
const contentItems = [
  {
    id: 1,
    title: 'Welcome Message Template',
    type: 'text',
    category: 'Onboarding',
    lastEdited: '2 hours ago',
    starred: true,
    preview: 'Hello! Welcome to our service. We are excited to have you...',
  },
  {
    id: 2,
    title: 'Product Showcase Image',
    type: 'image',
    category: 'Marketing',
    lastEdited: '1 day ago',
    starred: false,
    preview: 'product_showcase.png',
  },
  {
    id: 3,
    title: 'Tutorial Video Script',
    type: 'video',
    category: 'Education',
    lastEdited: '3 days ago',
    starred: true,
    preview: 'Step-by-step guide for new users covering basic features...',
  },
  {
    id: 4,
    title: 'Holiday Promotion Banner',
    type: 'image',
    category: 'Seasonal',
    lastEdited: '1 week ago',
    starred: false,
    preview: 'holiday_promo.jpg',
  },
  {
    id: 5,
    title: 'Voice Greeting',
    type: 'audio',
    category: 'Support',
    lastEdited: '2 weeks ago',
    starred: false,
    preview: 'greeting_audio.mp3',
  },
  {
    id: 6,
    title: 'FAQ Response Template',
    type: 'text',
    category: 'Support',
    lastEdited: '3 hours ago',
    starred: true,
    preview: 'Thank you for reaching out! Here are the answers to your questions...',
  },
]

const categories = [
  { id: 'all', label: 'All Content', count: 24 },
  { id: 'onboarding', label: 'Onboarding', count: 5 },
  { id: 'marketing', label: 'Marketing', count: 8 },
  { id: 'support', label: 'Support', count: 6 },
  { id: 'seasonal', label: 'Seasonal', count: 5 },
]

const contentTypes = [
  { type: 'text', icon: FileText, label: 'Text', color: '#3b82f6' },
  { type: 'image', icon: Image, label: 'Image', color: '#22c55e' },
  { type: 'video', icon: Video, label: 'Video', color: '#a855f7' },
  { type: 'audio', icon: Mic, label: 'Audio', color: '#f59e0b' },
]

function getTypeInfo(type: string) {
  return contentTypes.find(t => t.type === type) || contentTypes[0]
}

export function ContentCreationPage({ themeColor }: ContentCreationPageProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [starredItems, setStarredItems] = useState<Record<number, boolean>>(
    contentItems.reduce((acc, item) => ({ ...acc, [item.id]: item.starred }), {})
  )

  const toggleStar = (id: number) => {
    setStarredItems(prev => ({ ...prev, [id]: !prev[id] }))
  }

  const filteredContent = contentItems.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'all' ||
      item.category.toLowerCase() === selectedCategory.toLowerCase()
    return matchesSearch && matchesCategory
  })

  return (
    <div className="flex-1 bg-gray-50 p-6 overflow-y-auto">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Content Creation</h2>
            <p className="text-gray-600 mt-1">Create and manage content for your campaigns</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 bg-white font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <Sparkles className="w-4 h-4" />
              AI Generate
            </button>
            <button
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-white font-medium transition-colors"
              style={{ backgroundColor: themeColor }}
            >
              <Plus className="w-4 h-4" />
              New Content
            </button>
          </div>
        </div>

        {/* Content Type Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {contentTypes.map((type) => (
            <div
              key={type.type}
              className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm hover:border-green-300 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: `${type.color}15` }}
                >
                  <type.icon className="w-5 h-5" style={{ color: type.color }} />
                </div>
                <div>
                  <p className="text-lg font-bold text-gray-900">
                    {contentItems.filter(c => c.type === type.type).length}
                  </p>
                  <p className="text-sm text-gray-500">{type.label}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex gap-6">
          {/* Categories Sidebar */}
          <div className="w-56 flex-shrink-0">
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-3">
              <h3 className="font-semibold text-gray-900 px-3 py-2">Categories</h3>
              <div className="space-y-1">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${
                      selectedCategory === cat.id
                        ? 'text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                    style={selectedCategory === cat.id ? { backgroundColor: themeColor } : {}}
                  >
                    <span className="flex items-center gap-2">
                      <FolderOpen className="w-4 h-4" />
                      {cat.label}
                    </span>
                    <span className={`text-xs ${selectedCategory === cat.id ? 'text-white/80' : 'text-gray-400'}`}>
                      {cat.count}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Content List */}
          <div className="flex-1">
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
              <div className="p-4 border-b border-gray-100">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search content..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500"
                  />
                </div>
              </div>
              <div className="divide-y divide-gray-100">
                {filteredContent.map((item) => {
                  const typeInfo = getTypeInfo(item.type)
                  const isStarred = starredItems[item.id]
                  return (
                    <div
                      key={item.id}
                      className="p-4 hover:bg-gray-50 transition-colors cursor-pointer group"
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                          style={{ backgroundColor: `${typeInfo.color}15` }}
                        >
                          <typeInfo.icon className="w-6 h-6" style={{ color: typeInfo.color }} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium text-gray-900">{item.title}</h4>
                            {isStarred && (
                              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            )}
                          </div>
                          <p className="text-sm text-gray-500 truncate mt-0.5">{item.preview}</p>
                          <div className="flex items-center gap-3 mt-2">
                            <span
                              className="text-xs px-2 py-0.5 rounded-full"
                              style={{ backgroundColor: `${themeColor}15`, color: themeColor }}
                            >
                              {item.category}
                            </span>
                            <span className="flex items-center gap-1 text-xs text-gray-400">
                              <Clock className="w-3 h-3" />
                              {item.lastEdited}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={(e) => { e.stopPropagation(); toggleStar(item.id) }}
                            className="p-2 hover:bg-gray-200 rounded-lg"
                          >
                            <Star className={`w-4 h-4 ${isStarred ? 'fill-yellow-400 text-yellow-400' : 'text-gray-400'}`} />
                          </button>
                          <button className="p-2 hover:bg-gray-200 rounded-lg">
                            <Copy className="w-4 h-4 text-gray-400" />
                          </button>
                          <button className="p-2 hover:bg-gray-200 rounded-lg">
                            <Edit3 className="w-4 h-4 text-gray-400" />
                          </button>
                          <button className="p-2 hover:bg-gray-200 rounded-lg">
                            <Trash2 className="w-4 h-4 text-gray-400" />
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
      </div>
    </div>
  )
}
