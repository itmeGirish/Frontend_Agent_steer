import { useState, useCallback } from 'react'
import { ChatSidebar, type Chat } from '../../features/chat/components/chat-sidebar'
import { ChatMessages, type Message } from '../../features/chat/components/chat-messages'
import { ChatInput } from '../../features/chat/components/chat-input'
import { EmptyState } from '../../features/chat/components/empty-state'

export function ChatPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [chats, setChats] = useState<Chat[]>([])
  const [activeChatId, setActiveChatId] = useState<string | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [isTyping, setIsTyping] = useState(false)

  const handleToggleSidebar = useCallback(() => {
    setSidebarCollapsed((prev) => !prev)
  }, [])

  const handleNewChat = useCallback(() => {
    setActiveChatId(null)
    setMessages([])
  }, [])

  const handleSelectChat = useCallback((chatId: string) => {
    setActiveChatId(chatId)
    setMessages([])
  }, [])

  const handleDeleteChat = useCallback((chatId: string) => {
    setChats((prev) => prev.filter((chat) => chat.id !== chatId))
    if (activeChatId === chatId) {
      setActiveChatId(null)
      setMessages([])
    }
  }, [activeChatId])

  const handleSendMessage = useCallback((content: string) => {
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      content,
      role: 'user',
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setIsTyping(true)

    if (!activeChatId) {
      const newChat: Chat = {
        id: `chat-${Date.now()}`,
        title: content.slice(0, 30) + (content.length > 30 ? '...' : ''),
        lastMessage: content,
        updatedAt: new Date(),
      }
      setChats((prev) => [newChat, ...prev])
      setActiveChatId(newChat.id)
    }

    setTimeout(() => {
      const aiMessage: Message = {
        id: `ai-${Date.now()}`,
        content: `This is a simulated AI response.\n\nYou said: "${content}"\n\nIn a real application, this would be connected to an AI API.`,
        role: 'assistant',
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, aiMessage])
      setIsTyping(false)
    }, 1500)
  }, [activeChatId])

  return (
    <div className="flex h-screen bg-white">
      {/* Sidebar with icon bar + expanded panel */}
      <ChatSidebar
        chats={chats}
        activeChatId={activeChatId || undefined}
        onNewChat={handleNewChat}
        onSelectChat={handleSelectChat}
        onDeleteChat={handleDeleteChat}
        isCollapsed={sidebarCollapsed}
        onToggle={handleToggleSidebar}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-auto">
        {messages.length === 0 ? (
          <EmptyState onSend={handleSendMessage} />
        ) : (
          <>
            <ChatMessages
              messages={messages}
              isTyping={isTyping}
            />
            <div className="p-4">
              <ChatInput
                onSend={handleSendMessage}
                isLoading={isTyping}
              />
            </div>
          </>
        )}
      </div>
    </div>
  )
}