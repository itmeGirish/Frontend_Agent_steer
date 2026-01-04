export interface Chat {
  /** Unique chat ID */
  id: string
  /** Chat title */
  title: string
  /** Last message preview */
  lastMessage: string
  /** Last updated timestamp */
  updatedAt: Date
  /** Is this chat active/selected */
  isActive?: boolean
}

export interface ChatSidebarProps {
  /** List of chats */
  chats: Chat[]
  /** Currently active chat ID */
  activeChatId?: string
  /** Callback when new chat is clicked */
  onNewChat: () => void
  /** Callback when a chat is selected */
  onSelectChat: (chatId: string) => void
  /** Callback when a chat is deleted */
  onDeleteChat: (chatId: string) => void
  /** Is sidebar collapsed (mobile) */
  isCollapsed?: boolean
  /** Callback to toggle sidebar */
  onToggle?: () => void
}