import { Link } from 'react-router-dom'
import { Sparkles, ArrowRight } from 'lucide-react'

export function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-8">
      {/* Logo */}
      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mb-8">
        <Sparkles className="w-8 h-8 text-white" />
      </div>

      {/* Headline */}
      <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4 text-center">
        Welcome to{' '}
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
          Genspark
        </span>
      </h1>

      {/* Subtitle */}
      <p className="text-lg text-slate-400 mb-8 text-center max-w-md">
        Your All-in-One AI Workspace. One prompt, job done.
      </p>

      {/* CTA Button */}
      <Link to="/chat">
        <button className="inline-flex items-center gap-2 px-6 py-3 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 transition-colors">
          Start Chatting
          <ArrowRight className="w-5 h-5" />
        </button>
      </Link>
    </div>
  )
}