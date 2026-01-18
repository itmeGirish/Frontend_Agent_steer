import { HubHeader } from '../components/HubHeader'
import { ChatInput } from '../components/ChatInput'
import { AgentGrid } from '../components/AgentGrid'
import { getAllAgents } from '@/agents'

export function AgentHubPage() {
  const agents = getAllAgents()

  const handleSend = (message: string) => {
    // TODO: Handle global chat messages
    console.log('Message sent:', message)
  }

  return (
    <div className="min-h-screen bg-white">
      <HubHeader />

      <main className="flex-1 flex flex-col items-center px-4 pt-32 pb-20">
        {/* Title */}
        <h1 className="text-[42px] font-semibold text-gray-900 mb-10 tracking-tight">
          AgentSteer AI Workspace
        </h1>

        {/* Chat Input */}
        <ChatInput onSend={handleSend} />

        {/* Agent Grid */}
        <AgentGrid agents={agents} />

        {/* For You tab */}
        <div className="mt-14">
          <button className="px-8 py-2.5 text-sm text-gray-700 border-b-2 border-gray-900 font-medium">
            For You
          </button>
        </div>
      </main>
    </div>
  )
}
