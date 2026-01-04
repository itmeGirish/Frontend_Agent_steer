import { useEffect, useRef, useState } from 'react'
import { cn } from '../../../../utils/cn'
import type { ChatMessagesProps } from './ChatMessages.types'
import { Avatar } from '../../../../components/ui'
import { Copy, Check } from 'lucide-react'

export function ChatMessages({ messages, isTyping = false }: ChatMessagesProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [copiedId, setCopiedId] = useState<string | null>(null)

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  // Copy message to clipboard
  const handleCopy = async (id: string, content: string) => {
    await navigator.clipboard.writeText(content)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  // Format timestamp
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-6">
      {messages.length === 0 ? (
        // Empty state
        <div className="flex items-center justify-center h-full">
          <p className="text-slate-500">No messages yet. Start a conversation!</p>
        </div>
      ) : (
        // Messages list
        messages.map((message) => (
          <div
            key={message.id}
            className={cn(
              'flex gap-3',
              message.role === 'user' ? 'flex-row-reverse' : 'flex-row'
            )}
          >
            {/* Avatar */}
            <Avatar
              fallback={message.role === 'user' ? 'U' : 'AI'}
              className={cn(
                'flex-shrink-0',
                message.role === 'user'
                  ? 'bg-green-500 text-white'
                  : 'bg-blue-500 text-white'
              )}
              size="sm"
            />

            {/* Message bubble */}
            <div
              className={cn(
                'group relative max-w-[75%] rounded-2xl px-4 py-3',
                message.role === 'user'
                  ? 'bg-blue-500 text-white rounded-br-sm'
                  : 'bg-slate-800 text-slate-100 rounded-bl-sm'
              )}
            >
              {/* Message content */}
              <p className="whitespace-pre-wrap break-words">{message.content}</p>

              {/* Timestamp */}
              <span
                className={cn(
                  'text-xs mt-1 block',
                  message.role === 'user' ? 'text-blue-200' : 'text-slate-500'
                )}
              >
                {formatTime(message.timestamp)}
              </span>

              {/* Copy button (visible on hover) */}
              <button
                onClick={() => handleCopy(message.id, message.content)}
                className={cn(
                  'absolute top-2 opacity-0 group-hover:opacity-100 transition-opacity',
                  'p-1.5 rounded-lg bg-slate-700/50 hover:bg-slate-700 text-slate-300',
                  message.role === 'user' ? 'left-2' : 'right-2'
                )}
                aria-label="Copy message"
              >
                {copiedId === message.id ? (
                  <Check className="w-4 h-4 text-green-400" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>
        ))
      )}

      {/* Typing indicator */}
      {isTyping && (
        <div className="flex gap-3">
          <Avatar
            fallback="AI"
            className="bg-blue-500 text-white flex-shrink-0"
            size="sm"
          />
          <div className="bg-slate-800 rounded-2xl rounded-bl-sm px-4 py-3">
            <div className="flex gap-1">
              <span className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        </div>
      )}

      {/* Scroll anchor */}
      <div ref={messagesEndRef} />
    </div>
  )
}