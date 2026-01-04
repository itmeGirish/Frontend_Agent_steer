import { useState, useCallback } from 'react'
import { ChatSidebar, type Chat } from '../../features/chat/components/chat-sidebar'
import { ChatHeader, type Model } from '../../features/chat/components/chat-header'
import { ChatMessages, type Message } from '../../features/chat/components/chat-messages'
import { ChatInput } from '../../features/chat/components/chat-input'
import { EmptyState } from '../../features/chat/components/empty-state'

// Available AI models
const models: Model[] = [
  {
    id: 'gpt-4',
    name: 'GPT-4',
    description: 'Most capable model for complex tasks',
  },
  {
    id: 'gpt-3.5',
    name: 'GPT-3.5 Turbo',
    description: 'Fast and efficient for most tasks',
  },
  {
    id: 'claude',
    name: 'Claude 3',
    description: 'Great for analysis and writing',
  },
]

// Demo chat history
const initialChats: Chat[] = [
  {
    id: '1',
    title: 'React Component Help',
    lastMessage: 'How do I create a custom hook?',
    updatedAt: new Date(),
  },
  {
    id: '2',
    title: 'Python Debugging',
    lastMessage: 'Why is my loop not working?',
    updatedAt: new Date(Date.now() - 86400000),
  },
  {
    id: '3',
    title: 'Writing Assistance',
    lastMessage: 'Help me write an email to my boss',
    updatedAt: new Date(Date.now() - 172800000),
  },
]

export function ChatPage() {
  // State
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [selectedModelId, setSelectedModelId] = useState('gpt-4')
  const [chats, setChats] = useState<Chat[]>(initialChats)
  const [activeChatId, setActiveChatId] = useState<string | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [isTyping, setIsTyping] = useState(false)

  // Get active chat
  const activeChat = chats.find((chat) => chat.id === activeChatId)

  // Toggle sidebar
  const handleToggleSidebar = useCallback(() => {
    setSidebarCollapsed((prev) => !prev)
  }, [])

  // Create new chat
  const handleNewChat = useCallback(() => {
    setActiveChatId(null)
    setMessages([])
  }, [])

  // Select chat
  const handleSelectChat = useCallback((chatId: string) => {
    setActiveChatId(chatId)
    setMessages([])
  }, [])

  // Delete chat
  const handleDeleteChat = useCallback((chatId: string) => {
    setChats((prev) => prev.filter((chat) => chat.id !== chatId))
    if (activeChatId === chatId) {
      setActiveChatId(null)
      setMessages([])
    }
  }, [activeChatId])

  // Send message
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
    } else {
      setChats((prev) =>
        prev.map((chat) =>
          chat.id === activeChatId
            ? { ...chat, lastMessage: content, updatedAt: new Date() }
            : chat
        )
      )
    }

    // Simulate AI response
    setTimeout(() => {
      const aiMessage: Message = {
        id: `ai-${Date.now()}`,
        content: `This is a simulated AI response from ${models.find((m) => m.id === selectedModelId)?.name}.\n\nYou said: "${content}"\n\nIn a real application, this would be connected to an AI API.`,
        role: 'assistant',
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, aiMessage])
      setIsTyping(false)
    }, 1500)
  }, [activeChatId, selectedModelId])

  // Handle quick prompt click
  const handlePromptClick = useCallback((prompt: string) => {
    handleSendMessage(prompt)
  }, [handleSendMessage])

  // Share chat
  const handleShare = useCallback(() => {
    alert('Share functionality coming soon!')
  }, [])

  // Export chat
  const handleExport = useCallback(() => {
    const chatContent = messages
      .map((m) => `${m.role === 'user' ? 'You' : 'AI'}: ${m.content}`)
      .join('\n\n')
    
    const blob = new Blob([chatContent], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `chat-${Date.now()}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }, [messages])

  // Delete current chat
  const handleDeleteCurrentChat = useCallback(() => {
    if (activeChatId) {
      handleDeleteChat(activeChatId)
    }
  }, [activeChatId, handleDeleteChat])

  return (
    <div className="flex h-screen bg-slate-900">
      {/* Sidebar */}
      <ChatSidebar
        chats={chats}
        activeChatId={activeChatId || undefined}
        onNewChat={handleNewChat}
        onSelectChat={handleSelectChat}
        onDeleteChat={handleDeleteChat}
        isCollapsed={sidebarCollapsed}
        onToggle={handleToggleSidebar}
      />

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <ChatHeader
          title={activeChat?.title || 'New Chat'}
          models={models}
          selectedModelId={selectedModelId}
          onModelChange={setSelectedModelId}
          onToggleSidebar={handleToggleSidebar}
          isSidebarCollapsed={sidebarCollapsed}
          onShare={handleShare}
          onExport={messages.length > 0 ? handleExport : undefined}
          onDelete={activeChatId ? handleDeleteCurrentChat : undefined}
        />

        {/* Messages or Empty State */}
        {messages.length === 0 ? (
          <EmptyState
            userName="User"
            onPromptClick={handlePromptClick}
          />
        ) : (
          <ChatMessages
            messages={messages}
            isTyping={isTyping}
          />
        )}

        {/* Input */}
        <ChatInput
          onSend={handleSendMessage}
          isLoading={isTyping}
          placeholder="Type your message..."
        />
      </div>
    </div>
  )
}