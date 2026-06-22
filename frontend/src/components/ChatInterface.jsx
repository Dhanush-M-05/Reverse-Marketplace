import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FiSearch, FiSend, FiPaperclip, FiSmile, FiPhone, FiMoreVertical, FiFile, FiArrowLeft, FiMessageSquare,
} from 'react-icons/fi'
import Avatar from './Avatar'
import { conversations as seed } from '../data/messages'
import './chat.css'

const emojis = ['👍', '🙏', '🔥', '😊', '🎉', '❤️', '👀', '✅', '🚀', '💡']

export default function ChatInterface() {
  const [list] = useState(seed)
  const [activeId, setActiveId] = useState(seed[0]?.id)
  const [drafts, setDrafts] = useState({})
  const [sent, setSent] = useState({})
  const [showEmoji, setShowEmoji] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const endRef = useRef(null)

  const active = list.find((c) => c.id === activeId)
  const messages = active ? [...active.messages, ...(sent[activeId] || [])] : []

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages.length, activeId])

  if (!list.length) {
    return (
      <div className="chat chat-empty">
        <div className="empty">
          <FiMessageSquare size={42} />
          <h3>No conversations yet</h3>
          <p className="muted">Messages with sellers and buyers will appear here once you start chatting.</p>
        </div>
      </div>
    )
  }

  const send = () => {
    const text = (drafts[activeId] || '').trim()
    if (!text) return
    setSent((s) => ({
      ...s,
      [activeId]: [
        ...(s[activeId] || []),
        { id: 'me-' + Date.now(), from: 'me', text, time: 'now' },
      ],
    }))
    setDrafts((d) => ({ ...d, [activeId]: '' }))
    setShowEmoji(false)
  }

  return (
    <div className="chat">
      <aside className={`chat-list ${mobileOpen ? '' : 'mobile-hide'}`}>
        <div className="chat-list-head">
          <h3>Chats</h3>
        </div>
        <div className="searchbar" style={{ margin: '0 14px 12px' }}>
          <FiSearch />
          <input placeholder="Search messages..." />
        </div>
        <div className="chat-list-items">
          {list.map((c) => (
            <button
              key={c.id}
              className={`chat-list-item ${c.id === activeId ? 'active' : ''}`}
              onClick={() => { setActiveId(c.id); setMobileOpen(false) }}
            >
              <div style={{ position: 'relative' }}>
                <Avatar name={c.name} />
                {c.online && <span className="online-dot" />}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div className="flex justify-between">
                  <strong style={{ fontSize: '0.9rem' }}>{c.name}</strong>
                  <span className="dim" style={{ fontSize: '0.72rem' }}>{c.time}</span>
                </div>
                <div className="dim ellipsis" style={{ fontSize: '0.82rem' }}>{c.lastMessage}</div>
              </div>
              {c.unread > 0 && <span className="unread-badge">{c.unread}</span>}
            </button>
          ))}
        </div>
      </aside>

      <section className="chat-window">
        <header className="chat-header">
          <button className="icon-btn mobile-only" onClick={() => setMobileOpen(true)} aria-label="Back">
            <FiArrowLeft />
          </button>
          <Avatar name={active.name} />
          <div style={{ flex: 1 }}>
            <strong>{active.name}</strong>
            <div className="dim" style={{ fontSize: '0.78rem' }}>
              {active.typing ? <span className="typing-text">typing…</span> : active.online ? 'Online' : 'Offline'}
            </div>
          </div>
          <button className="icon-btn"><FiPhone /></button>
          <button className="icon-btn"><FiMoreVertical /></button>
        </header>

        <div className="chat-body">
          {messages.map((m) => (
            <motion.div
              key={m.id}
              className={`bubble-row ${m.from === 'me' ? 'me' : 'them'}`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className={`bubble ${m.from === 'me' ? 'bubble-me' : 'bubble-them'}`}>
                {m.text}
                {m.file && (
                  <div className="bubble-file">
                    <FiFile /> <span>{m.file.name}</span> <em>{m.file.size}</em>
                  </div>
                )}
                <span className="bubble-time">{m.time}</span>
              </div>
            </motion.div>
          ))}
          {active.typing && (
            <div className="bubble-row them">
              <div className="bubble bubble-them typing-bubble">
                <span /><span /><span />
              </div>
            </div>
          )}
          <div ref={endRef} />
        </div>

        <AnimatePresence>
          {showEmoji && (
            <motion.div
              className="emoji-bar"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
            >
              {emojis.map((e) => (
                <button
                  key={e}
                  onClick={() => setDrafts((d) => ({ ...d, [activeId]: (d[activeId] || '') + e }))}
                >
                  {e}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        <footer className="chat-input">
          <button className="icon-btn" onClick={() => setShowEmoji((s) => !s)} aria-label="Emoji"><FiSmile /></button>
          <button className="icon-btn" aria-label="Attach"><FiPaperclip /></button>
          <input
            value={drafts[activeId] || ''}
            onChange={(e) => setDrafts((d) => ({ ...d, [activeId]: e.target.value }))}
            onKeyDown={(e) => e.key === 'Enter' && send()}
            placeholder="Type a message..."
          />
          <button className="btn btn-primary chat-send" onClick={send} aria-label="Send"><FiSend /></button>
        </footer>
      </section>
    </div>
  )
}
