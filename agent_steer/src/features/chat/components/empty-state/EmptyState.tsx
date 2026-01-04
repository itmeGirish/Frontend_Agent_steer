import { cn } from '../../../../utils/cn'
import type { EmptyStateProps, QuickPrompt } from './EmptyState.types'
import { 
  Sparkles, 
  Code, 
  FileText, 
  Lightbulb, 
  PenTool,
  BarChart,
  Globe,
  Zap
} from 'lucide-react'

// Default quick prompts
const defaultQuickPrompts: QuickPrompt[] = [
  {
    id: '1',
    icon: 'code',
    title: 'Write Code',
    prompt: 'Help me write a function that',
  },
  {
    id: '2',
    icon: 'filetext',
    title: 'Summarize Text',
    prompt: 'Summarize the following text:',
  },
  {
    id: '3',
    icon: 'lightbulb',
    title: 'Brainstorm Ideas',
    prompt: 'Give me 10 creative ideas for',
  },
  {
    id: '4',
    icon: 'pentool',
    title: 'Write Content',
    prompt: 'Write a blog post about',
  },
  {
    id: '5',
    icon: 'barchart',
    title: 'Analyze Data',
    prompt: 'Help me analyze this data:',
  },
  {
    id: '6',
    icon: 'globe',
    title: 'Translate',
    prompt: 'Translate the following to',
  },
]

// Icon mapping
const iconMap: Record<string, React.ReactNode> = {
  code: <Code className="w-5 h-5" />,
  filetext: <FileText className="w-5 h-5" />,
  lightbulb: <Lightbulb className="w-5 h-5" />,
  pentool: <PenTool className="w-5 h-5" />,
  barchart: <BarChart className="w-5 h-5" />,
  globe: <Globe className="w-5 h-5" />,
  zap: <Zap className="w-5 h-5" />,
}

export function EmptyState({
  userName,
  quickPrompts = defaultQuickPrompts,
  onPromptClick,
}: EmptyStateProps) {
  // Get greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good morning'
    if (hour < 18) return 'Good afternoon'
    return 'Good evening'
  }

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8">
      {/* Logo/Icon */}
      <div className="mb-6">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
          <Sparkles className="w-8 h-8 text-white" />
        </div>
      </div>

      {/* Greeting */}
      <h1 className="text-3xl font-bold text-white mb-2">
        {getGreeting()}{userName ? `, ${userName}` : ''}!
      </h1>
      <p className="text-slate-400 text-lg mb-8 text-center max-w-md">
        How can I help you today? Choose a prompt below or type your own message.
      </p>

      {/* Quick Prompts Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 w-full max-w-3xl">
        {quickPrompts.map((prompt) => (
          <button
            key={prompt.id}
            onClick={() => onPromptClick(prompt.prompt)}
            className={cn(
              'flex items-center gap-3 p-4 rounded-xl text-left',
              'bg-slate-800/50 border border-slate-700/50',
              'hover:bg-slate-800 hover:border-slate-600',
              'transition-all duration-200',
              'group'
            )}
          >
            {/* Icon */}
            <div className={cn(
              'flex-shrink-0 w-10 h-10 rounded-lg',
              'bg-slate-700 group-hover:bg-blue-500/20',
              'flex items-center justify-center',
              'text-slate-400 group-hover:text-blue-400',
              'transition-colors'
            )}>
              {iconMap[prompt.icon] || <Zap className="w-5 h-5" />}
            </div>

            {/* Text */}
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-slate-200 group-hover:text-white transition-colors">
                {prompt.title}
              </h3>
              <p className="text-sm text-slate-500 truncate">
                {prompt.prompt}
              </p>
            </div>
          </button>
        ))}
      </div>

      {/* Footer hint */}
      <p className="text-slate-600 text-sm mt-8">
        Press <kbd className="px-2 py-1 bg-slate-800 rounded text-slate-400 mx-1">Enter</kbd> to send a message
      </p>
    </div>
  )
}