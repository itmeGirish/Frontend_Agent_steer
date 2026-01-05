import { useState, useRef, useEffect } from 'react'
import { cn } from '../../../../utils/cn'
import type { ChatInputProps } from './ChatInput.types'
import { Paperclip, Mic, CornerDownLeft } from 'lucide-react'

export function ChatInput({
  onSend,
  placeholder = 'Ask anything, create anything',
  disabled = false,
  isLoading = false,
}: ChatInputProps) {
  const [message, setMessage] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    const textarea = textareaRef.current
    if (textarea) {
      textarea.style.height = 'auto'
      textarea.style.height = `${Math.min(textarea.scrollHeight, 150)}px`
    }
  }, [message])

  const handleSend = () => {
    const trimmedMessage = message.trim()
    if (trimmedMessage && !disabled && !isLoading) {
      onSend(trimmedMessage)
      setMessage('')
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto'
      }
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const isDisabled = disabled || isLoading

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div
        className={cn(
          'flex flex-col rounded-2xl border border-gray-200 bg-white shadow-sm',
          'focus-within:border-gray-300 focus-within:shadow-md transition-all',
          isDisabled && 'opacity-50'
        )}
      >
        {/* Input area */}
        <textarea
          ref={textareaRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={isDisabled}
          rows={1}
          className={cn(
            'w-full px-4 pt-4 pb-2 bg-transparent text-gray-800 placeholder:text-gray-400',
            'resize-none outline-none min-h-[48px] max-h-[150px] text-base'
          )}
        />

        {/* Bottom toolbar */}
        <div className="flex items-center justify-between px-3 pb-3">
          <div className="flex items-center gap-1">
            <button
              type="button"
              disabled={isDisabled}
              className="p-2 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
              aria-label="Attach file"
            >
              <Paperclip className="w-5 h-5" />
            </button>
            <button
              type="button"
              disabled={isDisabled}
              className="p-2 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
              aria-label="Voice input"
            >
              <Mic className="w-5 h-5" />
            </button>
          </div>

          <button
            type="button"
            onClick={handleSend}
            disabled={isDisabled || !message.trim()}
            className={cn(
              'p-2 rounded-lg transition-colors',
              message.trim()
                ? 'text-gray-600 hover:bg-gray-100'
                : 'text-gray-300'
            )}
            aria-label="Send message"
          >
            <CornerDownLeft className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  )
}