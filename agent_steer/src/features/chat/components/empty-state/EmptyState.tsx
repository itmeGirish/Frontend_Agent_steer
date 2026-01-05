import { 
  Sparkles, 
  User, 
  Key,
  Paperclip,
  Mic,
  CornerDownLeft,
  Users,
  MessageCircle,
  FileEdit,
  Scale,
  X,
  Mail,
  Calendar,
  FolderOpen,
  FileText
} from 'lucide-react'

interface EmptyStateProps {
  onSend?: (message: string) => void
}

const agents = [
  { 
    icon: Users, 
    label: 'Customer Proactive Agent', 
    color: 'text-blue-500',
    bgColor: 'bg-blue-50'
  },
  { 
    icon: MessageCircle, 
    label: 'WhatsApp Agent', 
    color: 'text-green-500',
    bgColor: 'bg-green-50'
  },
  { 
    icon: FileEdit, 
    label: 'Drafting Agent', 
    color: 'text-purple-500',
    bgColor: 'bg-purple-50'
  },
  { 
    icon: Scale, 
    label: 'Law Agent', 
    color: 'text-amber-500',
    bgColor: 'bg-amber-50'
  },
]

export function EmptyState({ onSend }: EmptyStateProps) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const input = form.elements.namedItem('message') as HTMLTextAreaElement
    if (input.value.trim() && onSend) {
      onSend(input.value.trim())
      input.value = ''
    }
  }

  return (
    <div className="flex-1 flex flex-col items-center px-4 pt-20 bg-white">
      {/* Title */}
      <h1 className="text-[42px] font-semibold text-gray-900 mb-10 tracking-tight">
        Genspark AI Workspace
      </h1>

      {/* Input Box */}
      <form onSubmit={handleSubmit} className="w-full max-w-[720px] mb-4">
        <div className="rounded-2xl border border-gray-200 bg-white shadow-[0_2px_20px_rgba(0,0,0,0.08)] overflow-hidden">
          {/* Text input */}
          <textarea
            name="message"
            placeholder="Ask anything, create anything"
            rows={2}
            className="w-full px-5 pt-5 pb-3 bg-transparent text-gray-800 placeholder:text-gray-400 resize-none outline-none text-[15px] leading-relaxed"
          />

          {/* Bottom toolbar */}
          <div className="flex items-center justify-between px-4 pb-4">
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="flex items-center gap-2 px-4 py-2 rounded-full border border-gray-200 text-gray-500 text-sm hover:bg-gray-50 transition-colors"
              >
                <User className="w-4 h-4" />
                Personalize
              </button>
              <button
                type="button"
                className="w-9 h-9 rounded-full border border-gray-200 text-gray-400 hover:bg-gray-50 transition-colors flex items-center justify-center"
              >
                <Key className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center gap-0.5">
              <button
                type="button"
                className="w-9 h-9 rounded-lg text-gray-400 hover:bg-gray-100 transition-colors flex items-center justify-center"
              >
                <Paperclip className="w-[18px] h-[18px]" />
              </button>
              <button
                type="button"
                className="w-9 h-9 rounded-lg text-gray-400 hover:bg-gray-100 transition-colors flex items-center justify-center"
              >
                <Mic className="w-[18px] h-[18px]" />
              </button>
              <button
                type="submit"
                className="w-9 h-9 rounded-lg text-gray-400 hover:bg-gray-100 transition-colors flex items-center justify-center"
              >
                <CornerDownLeft className="w-[18px] h-[18px]" />
              </button>
            </div>
          </div>
        </div>
      </form>

      {/* Integration notice */}
      <div className="flex items-center gap-3 text-sm mb-14">
        <div className="flex items-center gap-1.5">
          <div className="w-7 h-7 rounded-lg bg-white border border-gray-200 flex items-center justify-center shadow-sm">
            <Mail className="w-4 h-4 text-red-500" />
          </div>
          <div className="w-7 h-7 rounded-lg bg-white border border-gray-200 flex items-center justify-center shadow-sm">
            <Calendar className="w-4 h-4 text-blue-500" />
          </div>
          <div className="w-7 h-7 rounded-lg bg-white border border-gray-200 flex items-center justify-center shadow-sm">
            <FolderOpen className="w-4 h-4 text-yellow-500" />
          </div>
          <div className="w-7 h-7 rounded-lg bg-white border border-gray-200 flex items-center justify-center shadow-sm">
            <FileText className="w-4 h-4 text-blue-600" />
          </div>
        </div>
        <span className="text-gray-500">Genspark supports personalized tools</span>
        <button className="text-gray-400 hover:text-gray-600">
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Agent Cards Grid */}
      <div className="grid grid-cols-4 gap-4 max-w-[720px] w-full">
        {agents.map((agent) => (
          <button
            key={agent.label}
            className="flex flex-col items-center gap-3 p-5 rounded-2xl bg-white border border-gray-100 hover:border-gray-200 hover:shadow-lg transition-all duration-200"
          >
            <div className={`w-14 h-14 rounded-2xl ${agent.bgColor} flex items-center justify-center`}>
              <agent.icon className={`w-7 h-7 ${agent.color}`} />
            </div>
            <span className="text-sm text-gray-700 text-center font-medium leading-snug">
              {agent.label}
            </span>
          </button>
        ))}
      </div>

      {/* For You tab */}
      <div className="mt-14">
        <button className="px-8 py-2.5 text-sm text-gray-700 border-b-2 border-gray-900 font-medium">
          For You
        </button>
      </div>
    </div>
  )
}