import { Link } from 'react-router-dom'
import { Sparkles, ArrowRight, Zap, Shield, Globe } from 'lucide-react'
import { Header } from '../components/Header'
import { Footer } from '../components/Footer'

export function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-900 flex flex-col">
      <Header />

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center px-8 pt-24 pb-16">
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mb-8 shadow-2xl shadow-blue-500/25">
          <Sparkles className="w-10 h-10 text-white" />
        </div>

        <h1 className="text-5xl sm:text-6xl font-bold text-white mb-6 text-center leading-tight">
          Welcome to{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
            AgentSteer
          </span>
        </h1>

        <p className="text-xl text-slate-400 mb-4 text-center max-w-2xl">
          Your All-in-One AI Workspace
        </p>

        <p className="text-lg text-slate-500 mb-10 text-center max-w-xl">
          Orchestrate powerful AI agents for WhatsApp automation, customer engagement,
          document drafting, and legal assistance — all in one platform.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 mb-16">
          <Link to="/hub">
            <button className="inline-flex items-center gap-2 px-8 py-4 bg-blue-500 text-white font-semibold rounded-xl hover:bg-blue-600 transition-all shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40">
              Launch Agent Hub
              <ArrowRight className="w-5 h-5" />
            </button>
          </Link>
          <button className="inline-flex items-center gap-2 px-8 py-4 border border-slate-700 text-slate-300 font-medium rounded-xl hover:bg-slate-800 transition-colors">
            Learn More
          </button>
        </div>

        {/* Feature highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl w-full">
          <div className="flex flex-col items-center p-6 rounded-2xl bg-slate-800/50 border border-slate-700">
            <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center mb-4">
              <Zap className="w-6 h-6 text-blue-400" />
            </div>
            <h3 className="text-white font-semibold mb-2">AI-Powered Agents</h3>
            <p className="text-slate-400 text-sm text-center">
              Specialized agents for every business need
            </p>
          </div>

          <div className="flex flex-col items-center p-6 rounded-2xl bg-slate-800/50 border border-slate-700">
            <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center mb-4">
              <Shield className="w-6 h-6 text-purple-400" />
            </div>
            <h3 className="text-white font-semibold mb-2">Secure & Reliable</h3>
            <p className="text-slate-400 text-sm text-center">
              Enterprise-grade security and uptime
            </p>
          </div>

          <div className="flex flex-col items-center p-6 rounded-2xl bg-slate-800/50 border border-slate-700">
            <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center mb-4">
              <Globe className="w-6 h-6 text-green-400" />
            </div>
            <h3 className="text-white font-semibold mb-2">Multi-Channel</h3>
            <p className="text-slate-400 text-sm text-center">
              Connect across WhatsApp, email, and more
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
