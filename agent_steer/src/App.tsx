import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { LandingPage } from './pages/landing'
import { ChatPage } from './pages/chat'

function App() {
  return (
    <Router>
      <Routes>
        {/* Landing Page */}
        <Route path="/" element={<LandingPage />} />
        
        {/* Chat Page */}
        <Route path="/chat" element={<ChatPage />} />
        
        {/* 404 - Redirect to home */}
        <Route path="*" element={<LandingPage />} />
      </Routes>
    </Router>
  )
}

export default App