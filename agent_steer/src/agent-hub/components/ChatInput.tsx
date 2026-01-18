import {
  User,
  Key,
  Paperclip,
  Mic,
  CornerDownLeft,
  X,
  Mail,
  Calendar,
  FolderOpen,
  FileText
} from 'lucide-react'

interface ChatInputProps {
  onSend?: (message: string) => void
}

export function ChatInput({ onSend }: ChatInputProps) {
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
    <div className="w-full max-w-[720px]">
      <form onSubmit={handleSubmit} className="mb-4">
        <div className="rounded-2xl border border-gray-200 bg-white shadow-[0_2px_20px_rgba(0,0,0,0.08)] overflow-hidden">
          <textarea
            name="message"
            placeholder="Ask anything, create anything"
            rows={2}
            className="w-full px-5 pt-5 pb-3 bg-transparent text-gray-800 placeholder:text-gray-400 resize-none outline-none text-[15px] leading-relaxed"
          />

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
      <div className="flex items-center justify-center gap-3 text-sm mb-14">
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
        <span className="text-gray-500">AgentSteer supports personalized tools</span>
        <button className="text-gray-400 hover:text-gray-600">
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
