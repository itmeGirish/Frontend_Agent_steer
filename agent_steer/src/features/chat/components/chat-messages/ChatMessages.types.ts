export interface Message {
  /** Unique message ID */
  id: string
  /** Message content */
  content: string
  /** Who sent the message */
  role: 'user' | 'assistant'
  /** Timestamp */
  timestamp: Date
}

export interface ChatMessagesProps {
  /** Array of messages to display */
  messages: Message[]
  /** Show typing indicator */
  isTyping?: boolean
}