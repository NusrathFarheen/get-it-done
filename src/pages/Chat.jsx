import { useState, useRef, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import {
  Zap, ArrowLeft, Send, Smile, Paperclip, Phone,
  Video, MoreVertical, BadgeCheck, Clock, Check,
  CheckCheck, Briefcase, Star, ChevronRight, X,
  MapPin, DollarSign, Mic,
} from 'lucide-react';
import { CONVERSATIONS, QUICK_REPLIES } from '../data/messages';
import './Chat.css';

/* ── Single message bubble ── */
function Bubble({ msg }) {
  const isMe = msg.from === 'me';
  return (
    <div className={`chat__bubble-wrap ${isMe ? 'chat__bubble-wrap--me' : ''}`}>
      {!isMe && (
        <div className="chat__bubble-avatar">
          {/* first letter placeholder — real avatar would come from conversation data */}
        </div>
      )}
      <div className={`chat__bubble ${isMe ? 'chat__bubble--me' : 'chat__bubble--them'}`}>
        <span className="chat__bubble-text">{msg.text}</span>
        <div className="chat__bubble-meta">
          <span className="chat__bubble-time">{msg.time}</span>
          {isMe && (
            <span className="chat__bubble-status">
              {msg.read ? <CheckCheck size={12} className="chat__read" /> : <Check size={12} />}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── Conversation list item ── */
function ConvoItem({ convo, active, onClick }) {
  const lastMsg = convo.messages[convo.messages.length - 1];
  return (
    <button
      className={`chat__convo-item ${active ? 'chat__convo-item--active' : ''}`}
      id={`convo-${convo.id}`}
      onClick={onClick}
    >
      <div className="chat__convo-avatar" style={{ background: convo.with.gradient }}>
        {convo.with.initials}
        {convo.with.available && <span className="chat__convo-online" />}
      </div>
      <div className="chat__convo-body">
        <div className="chat__convo-top">
          <span className="chat__convo-name">{convo.with.name}</span>
          <span className="chat__convo-time">{convo.lastActivity}</span>
        </div>
        <div className="chat__convo-bottom">
          <span className="chat__convo-last">
            {lastMsg.from === 'me' && 'You: '}
            {lastMsg.text.length > 42 ? lastMsg.text.slice(0, 42) + '…' : lastMsg.text}
          </span>
          {convo.unread > 0 && (
            <span className="chat__convo-unread">{convo.unread}</span>
          )}
        </div>
        <div className="chat__convo-job">
          <Briefcase size={10} /> {convo.jobContext}
        </div>
      </div>
    </button>
  );
}

/* ── Main Chat page ── */
export default function Chat() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [conversations, setConversations] = useState(CONVERSATIONS);
  const [activeId, setActiveId] = useState(id || conversations[0]?.id);
  const [input, setInput] = useState('');
  const [showQuickReplies, setShowQuickReplies] = useState(false);
  const [typing, setTyping] = useState(false);
  const [showJobInfo, setShowJobInfo] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const activeConvo = conversations.find(c => c.id === activeId);

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeId, activeConvo?.messages]);

  // Simulate "typing" indicator when switching to a chat with unread messages
  useEffect(() => {
    if (activeConvo?.unread > 0) {
      setTyping(true);
      const t = setTimeout(() => setTyping(false), 2000);
      // Mark as read
      setConversations(prev => prev.map(c =>
        c.id === activeId ? { ...c, unread: 0, messages: c.messages.map(m => ({ ...m, read: true })) } : c
      ));
      return () => clearTimeout(t);
    }
  }, [activeId]);

  const handleSend = () => {
    const text = input.trim();
    if (!text || !activeConvo) return;
    const newMsg = {
      id: `m${Date.now()}`,
      from: 'me',
      text,
      time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
      read: false,
    };
    setConversations(prev => prev.map(c =>
      c.id === activeId
        ? { ...c, messages: [...c.messages, newMsg], lastActivity: 'Just now' }
        : c
    ));
    setInput('');
    setShowQuickReplies(false);
    inputRef.current?.focus();

    // Simulate reply after 2s
    setTimeout(() => {
      const replies = [
        'Got it! I\'ll confirm shortly.',
        'Sure, that works for me.',
        'Let me check my schedule and get back to you.',
        'Perfect! See you then.',
        'Can we do it a bit earlier?',
      ];
      const replyMsg = {
        id: `mr${Date.now()}`,
        from: 'them',
        text: replies[Math.floor(Math.random() * replies.length)],
        time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
        read: true,
      };
      setConversations(prev => prev.map(c =>
        c.id === activeId
          ? { ...c, messages: [...c.messages, replyMsg], lastActivity: 'Just now' }
          : c
      ));
    }, 2000);
  };

  const handleKey = e => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleQuickReply = text => {
    setInput(text);
    setShowQuickReplies(false);
    inputRef.current?.focus();
  };

  const selectConvo = (convoId) => {
    setActiveId(convoId);
    navigate(`/chat/${convoId}`, { replace: true });
    setShowJobInfo(false);
  };

  return (
    <div className="chat-page">
      <div className="noise-overlay" aria-hidden="true" />
      <div className="glow-orb glow-amber chat__glow-1" />

      {/* ── Top Bar ── */}
      <header className="chat__topbar">
        <Link to="/dashboard" className="chat__back" id="chat-back-btn">
          <ArrowLeft size={16} /> Dashboard
        </Link>
        <Link to="/" className="chat__logo">
          <div className="chat__logo-icon"><Zap size={14} fill="currentColor" /></div>
          <span>GetItDone</span>
        </Link>
        <div style={{ width: 100 }} />
      </header>

      <div className="chat__layout">
        {/* ══ LEFT: Conversation list ══ */}
        <aside className="chat__sidebar">
          <div className="chat__sidebar-head">
            <h2 className="chat__sidebar-title">Messages</h2>
            <span className="chat__total-badge">
              {conversations.reduce((acc, c) => acc + c.unread, 0) > 0 &&
                conversations.reduce((acc, c) => acc + c.unread, 0)}
            </span>
          </div>

          <div className="chat__convo-list" id="chat-convo-list">
            {conversations.map(convo => (
              <ConvoItem
                key={convo.id}
                convo={convo}
                active={convo.id === activeId}
                onClick={() => selectConvo(convo.id)}
              />
            ))}
          </div>
        </aside>

        {/* ══ RIGHT: Active chat ══ */}
        {activeConvo ? (
          <div className="chat__window">
            {/* Chat header */}
            <div className="chat__window-header">
              <div className="chat__window-avatar-wrap">
                <div className="chat__window-avatar" style={{ background: activeConvo.with.gradient }}>
                  {activeConvo.with.initials}
                </div>
                {activeConvo.with.available && <span className="chat__online-dot" />}
              </div>
              <div className="chat__window-info">
                <div className="chat__window-name">
                  {activeConvo.with.name}
                  <BadgeCheck size={14} className="chat__verified" />
                </div>
                <div className="chat__window-sub">
                  {activeConvo.with.available
                    ? <span className="chat__status-on">● Online</span>
                    : <span className="chat__status-off">● Offline</span>}
                  &nbsp;·&nbsp; {activeConvo.with.skill}
                </div>
              </div>
              <div className="chat__window-actions">
                <button
                  className="chat__icon-btn"
                  id="chat-job-info-btn"
                  title="Job details"
                  onClick={() => setShowJobInfo(p => !p)}
                >
                  <Briefcase size={17} />
                </button>
                <Link
                  to={`/worker/${activeConvo.with.id}`}
                  className="chat__icon-btn"
                  id="chat-view-profile-btn"
                  title="View profile"
                >
                  <Star size={17} />
                </Link>
                <button className="chat__icon-btn" id="chat-more-btn" title="More options">
                  <MoreVertical size={17} />
                </button>
              </div>
            </div>

            {/* Job context banner */}
            {showJobInfo && (
              <div className="chat__job-banner" id="chat-job-banner">
                <div className="chat__job-banner-inner">
                  <Briefcase size={13} />
                  <div>
                    <div className="chat__job-banner-title">{activeConvo.jobContext}</div>
                    <div className="chat__job-banner-sub">This conversation is about the above job</div>
                  </div>
                </div>
                <button className="chat__job-banner-close" onClick={() => setShowJobInfo(false)}>
                  <X size={13} />
                </button>
              </div>
            )}

            {/* Messages area */}
            <div className="chat__messages" id="chat-messages-area">
              {/* Date divider */}
              <div className="chat__date-divider">
                <span>Today</span>
              </div>

              {activeConvo.messages.map(msg => (
                <Bubble key={msg.id} msg={msg} />
              ))}

              {/* Typing indicator */}
              {typing && (
                <div className="chat__typing" id="chat-typing-indicator">
                  <div className="chat__typing-dot" />
                  <div className="chat__typing-dot" />
                  <div className="chat__typing-dot" />
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick replies */}
            {showQuickReplies && (
              <div className="chat__quick-replies" id="chat-quick-replies">
                {QUICK_REPLIES.map((r, i) => (
                  <button
                    key={i}
                    className="chat__quick-reply"
                    id={`quick-reply-${i}`}
                    onClick={() => handleQuickReply(r)}
                  >
                    {r}
                  </button>
                ))}
              </div>
            )}

            {/* Input bar */}
            <div className="chat__input-bar" id="chat-input-bar">
              <button
                className="chat__input-btn"
                id="chat-emoji-btn"
                title="Quick replies"
                onClick={() => setShowQuickReplies(p => !p)}
              >
                <Smile size={19} />
              </button>
              <button className="chat__input-btn" id="chat-attach-btn" title="Attach file">
                <Paperclip size={19} />
              </button>
              <textarea
                ref={inputRef}
                className="chat__input"
                id="chat-message-input"
                placeholder="Type a message…"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKey}
                rows={1}
              />
              {input.trim() ? (
                <button
                  className="chat__send-btn"
                  id="chat-send-btn"
                  onClick={handleSend}
                  aria-label="Send message"
                >
                  <Send size={17} />
                </button>
              ) : (
                <button className="chat__input-btn" id="chat-voice-btn" title="Voice message">
                  <Mic size={19} />
                </button>
              )}
            </div>

            {/* View profile CTA (bottom) */}
            <div className="chat__profile-cta">
              <Link to={`/worker/${activeConvo.with.id}`} className="chat__profile-link" id="chat-profile-cta">
                <div className="chat__profile-mini-avatar" style={{ background: activeConvo.with.gradient }}>
                  {activeConvo.with.initials}
                </div>
                <div>
                  <span className="chat__profile-mini-name">{activeConvo.with.name}</span>
                  <span className="chat__profile-mini-sub"> · View full profile</span>
                </div>
                <ChevronRight size={14} />
              </Link>
              <Link to="/post-job" className="btn btn-primary chat__book-btn" id="chat-book-btn">
                Hire Now
              </Link>
            </div>
          </div>
        ) : (
          <div className="chat__empty-window">
            <div className="chat__empty-icon">💬</div>
            <div className="chat__empty-title">Your messages</div>
            <div className="chat__empty-sub">
              Select a conversation, or browse workers and start chatting.
            </div>
            <Link to="/browse" className="btn btn-primary" id="chat-browse-btn">
              Browse Workers
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
