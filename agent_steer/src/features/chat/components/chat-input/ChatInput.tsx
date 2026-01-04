import { useState, useRef, useEffect } from 'react'
import { cn } from '../../../../utils/cn'
import type { ChatInputProps } from './ChatInput.types'
import { Send, Paperclip } from 'lucide-react'

export function ChatInput({
  onSend,
  placeholder = 'Type your message...',
  disabled = false,
  isLoading = false,
}: ChatInputProps) {
  const [message, setMessage] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Auto-resize textarea based on content
  useEffect(() => {
    const textarea = textareaRef.current
    if (textarea) {
      textarea.style.height = 'auto'
      textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`
    }
  }, [message])

  // Handle send message
  const handleSend = () => {
    const trimmedMessage = message.trim()
    if (trimmedMessage && !disabled && !isLoading) {
      onSend(trimmedMessage)
      setMessage('')
      // Reset textarea height
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto'
      }
    }
  }

  // Handle keyboard shortcuts
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Send on Enter (without Shift)
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const isDisabled = disabled || isLoading
  const canSend = message.trim().length > 0 && !isDisabled

  return (
    <div className="border-t border-slate-700 bg-slate-900 p-4">
      <div
        className={cn(
          'flex items-end gap-3 rounded-xl border bg-slate-800 p-3',
          'border-slate-700 focus-within:border-blue-500 transition-colors',
          isDisabled && 'opacity-50'
        )}
      >
        {/* Attach file button */}
        <button
          type="button"
          disabled={isDisabled}
          className={cn(
            'flex-shrink-0 p-2 rounded-lg text-slate-400',
            'hover:bg-slate-700 hover:text-slate-200 transition-colors',
            'disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-slate-400'
          )}
          aria-label="Attach file"
        >
          <Paperclip className="w-5 h-5" />
        </button>

        {/* Textarea */}
        <textarea
          ref={textareaRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={isDisabled}
          rows={1}
          className={cn(
            'flex-1 bg-transparent text-slate-100 placeholder:text-slate-500',
            'resize-none outline-none min-h-[24px] max-h-[200px]',
            'disabled:cursor-not-allowed'
          )}
        />

        {/* Send button */}
        <button
          type="button"
          onClick={handleSend}
          disabled={!canSend}
          className={cn(
            'flex-shrink-0 p-2 rounded-lg transition-colors',
            canSend
              ? 'bg-blue-500 text-white hover:bg-blue-600'
              : 'bg-slate-700 text-slate-500 cursor-not-allowed'
          )}
          aria-label="Send message"
        >
          <Send className="w-5 h-5" />
        </button>
      </div>

      {/* Helper text */}
      <p className="text-xs text-slate-500 mt-2 text-center">
        Press Enter to send, Shift + Enter for new line
      </p>
    </div>
  )
}