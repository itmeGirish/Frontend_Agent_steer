import { useEffect, useRef } from 'react'
import { cn } from '../../../../utils/cn'
import type { ChatMessagesProps } from './ChatMessages.types'
import { Bot } from 'lucide-react'

export function ChatMessages({ messages, isTyping = false }: ChatMessagesProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  return (
    <div className="flex-1 overflow-y-auto py-4">
      <div className="max-w-3xl mx-auto px-4 space-y-6">
        {messages.map((message) => (
          <div key={message.id}>
            {message.role === 'user' ? (
              // User message - right aligned with bubble
              <div className="flex justify-end">
                <div className="bg-gray-100 rounded-3xl px-5 py-3 max-w-[85%]">
                  <p className="text-gray-800 whitespace-pre-wrap break-words">
                    {message.content}
                  </p>
                </div>
              </div>
            ) : (
              // AI message - left aligned with icon
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center">
                  <Bot className="w-4 h-4 text-gray-600" />
                </div>
                <div className="flex-1 min-w-0 pt-1">
                  <p className="text-gray-800 whitespace-pre-wrap break-words leading-relaxed">
                    {message.content}
                  </p>
                </div>
              </div>
            )}
          </div>
        ))}

        {/* Typing indicator */}
        {isTyping && (
          <div className="flex gap-3">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center">
              <Bot className="w-4 h-4 text-gray-600" />
            </div>
            <div className="flex items-center gap-1 pt-2">
              <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>
    </div>
  )
}