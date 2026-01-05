import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { LandingPage } from './pages/landing'
import { ChatPage } from './pages/chat'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/chat" element={<ChatPage />} />
        <Route path="*" element={<LandingPage />} />
      </Routes>
    </Router>
  )
}

export default App