import ChatInterface from '../../components/ChatInterface'
import '../dashboard.css'

export default function Messages() {
  return (
    <div>
      <div className="page-head">
        <div>
          <h1 className="page-title">Messages</h1>
          <p className="muted">Chat with sellers in real time.</p>
        </div>
      </div>
      <ChatInterface />
    </div>
  )
}
