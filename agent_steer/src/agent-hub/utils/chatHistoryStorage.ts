import type { ChatSession, ChatMessage } from '../types'

const STORAGE_KEY = 'agentsteer_chat_history'

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

function getStoredSessions(): ChatSession[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    if (!data) return []
    const parsed = JSON.parse(data)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function saveSessions(sessions: ChatSession[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions))
}

export function getAllChatSessions(): ChatSession[] {
  return getStoredSessions().sort((a, b) => b.updatedAt - a.updatedAt)
}

export function getChatSessionsByAgent(agentId: string): ChatSession[] {
  return getStoredSessions()
    .filter((s) => s.agentId === agentId)
    .sort((a, b) => b.updatedAt - a.updatedAt)
}

export function getChatSession(sessionId: string): ChatSession | undefined {
  return getStoredSessions().find((s) => s.id === sessionId)
}

export function createChatSession(
  agentId: string,
  agentName: string,
  agentColor: string,
  initialMessage?: string
): ChatSession {
  const now = Date.now()
  const session: ChatSession = {
    id: generateId(),
    agentId,
    agentName,
    agentColor,
    title: initialMessage?.slice(0, 50) || `Chat with ${agentName}`,
    messages: [],
    createdAt: now,
    updatedAt: now,
  }

  const sessions = getStoredSessions()
  sessions.unshift(session)
  saveSessions(sessions)

  return session
}

export function addMessageToSession(
  sessionId: string,
  role: 'user' | 'assistant',
  content: string
): ChatMessage | undefined {
  const sessions = getStoredSessions()
  const sessionIndex = sessions.findIndex((s) => s.id === sessionId)

  if (sessionIndex === -1) return undefined

  const message: ChatMessage = {
    id: generateId(),
    role,
    content,
    timestamp: Date.now(),
  }

  sessions[sessionIndex].messages.push(message)
  sessions[sessionIndex].updatedAt = Date.now()

  // Update title if this is the first user message
  if (role === 'user' && sessions[sessionIndex].messages.filter((m) => m.role === 'user').length === 1) {
    sessions[sessionIndex].title = content.slice(0, 50) + (content.length > 50 ? '...' : '')
  }

  saveSessions(sessions)

  return message
}

export function deleteChatSession(sessionId: string): void {
  const sessions = getStoredSessions().filter((s) => s.id !== sessionId)
  saveSessions(sessions)
}

export function clearAllChatHistory(): void {
  localStorage.removeItem(STORAGE_KEY)
}

export function getRecentSessions(limit: number = 10): ChatSession[] {
  return getAllChatSessions().slice(0, limit)
}
