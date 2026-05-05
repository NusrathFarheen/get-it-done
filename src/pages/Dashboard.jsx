import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Zap, Briefcase, Star, DollarSign, MessageSquare,
  Bell, ChevronRight, Clock, MapPin, Check, X,
  Plus, TrendingUp, Users, BadgeCheck, Settings,
  LogOut, Home,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { POSTED_JOBS, WORKER_JOBS } from '../data/jobs';
import { WORKERS } from '../data/workers';
import './Dashboard.css';



/* ════════════════════════════
   CLIENT DASHBOARD
════════════════════════════ */

function ClientStats() {
  return (
    <div className="dash__stats-grid">
      {[
        { icon: <Briefcase size={20} />, label: 'Active Jobs', value: '2', color: 'amber' },
        { icon: <Bell size={20} />, label: 'New Bids', value: '3', color: 'blue' },
        { icon: <MessageSquare size={20} />, label: 'Unread Chats', value: '1', color: 'purple' },
        { icon: <Check size={20} />, label: 'Completed', value: '1', color: 'green' },
      ].map(s => (
        <div key={s.label} className={`dash__stat-card glass-card dash__stat-card--${s.color}`}>
          <div className="dash__stat-icon">{s.icon}</div>
          <div className="dash__stat-val">{s.value}</div>
          <div className="dash__stat-lbl">{s.label}</div>
        </div>
      ))}
    </div>
  );
}

function BidCard({ bid, jobTitle }) {
  const [accepted, setAccepted] = useState(false);
  const [declined, setDeclined] = useState(false);
  if (declined) return null;
  return (
    <div className={`bid-card glass-card ${accepted ? 'bid-card--accepted' : ''}`}>
      <div className="bid-card__header">
        <div className="bid-card__avatar" style={{ background: bid.gradient }}>{bid.workerInitials}</div>
        <div className="bid-card__info">
          <div className="bid-card__name">{bid.workerName}</div>
          <div className="bid-card__meta">
            <Star size={11} fill="currentColor" className="bid-card__star" /> {bid.rating}
            &nbsp;·&nbsp; {bid.jobs} jobs
          </div>
        </div>
        <div className="bid-card__amount">₹{bid.amount}</div>
      </div>
      <p className="bid-card__message">"{bid.message}"</p>
      {accepted ? (
        <div className="bid-card__accepted-badge"><Check size={13} /> Bid Accepted — Awaiting payment</div>
      ) : (
        <div className="bid-card__actions">
          <Link to={`/worker/${bid.workerId}`} className="btn btn-secondary bid-card__btn">View Profile</Link>
          <button className="btn btn-secondary bid-card__btn" id={`decline-${bid.workerId}`} onClick={() => setDeclined(true)}>
            <X size={13} /> Decline
          </button>
          <button className="btn btn-primary bid-card__btn" id={`accept-${bid.workerId}`} onClick={() => setAccepted(true)}>
            <Check size={13} /> Accept Bid
          </button>
        </div>
      )}
    </div>
  );
}

function ClientJobs() {
  const [activeTab, setActiveTab] = useState('active');
  const tabs = [
    { key: 'active', label: 'Active Jobs' },
    { key: 'bids', label: 'Bids Received' },
    { key: 'completed', label: 'Completed' },
  ];

  const activeJobs = POSTED_JOBS.filter(j => j.status === 'open' || j.status === 'in_progress');
  const completedJobs = POSTED_JOBS.filter(j => j.status === 'completed');
  const allBids = POSTED_JOBS.flatMap(j => j.bids.map(b => ({ ...b, jobTitle: j.title, jobId: j.id })));

  return (
    <div className="dash__section">
      <div className="dash__section-head">
        <h2 className="dash__section-title">My Jobs</h2>
        <Link to="/post-job" className="btn btn-primary dash__post-btn" id="dash-post-job-btn">
          <Plus size={15} /> Post a Job
        </Link>
      </div>

      {/* Tabs */}
      <div className="dash__tabs">
        {tabs.map(t => (
          <button
            key={t.key} id={`dash-tab-${t.key}`}
            className={`dash__tab ${activeTab === t.key ? 'dash__tab--active' : ''}`}
            onClick={() => setActiveTab(t.key)}
          >{t.label}</button>
        ))}
      </div>

      {/* Active jobs */}
      {activeTab === 'active' && (
        <div className="dash__jobs-list">
          {activeJobs.map(job => (
            <div key={job.id} className="dash__job-card glass-card" id={`job-${job.id}`}>
              <div className="dash__job-header">
                <div>
                  <div className="dash__job-cat">{job.category}</div>
                  <div className="dash__job-title">{job.title}</div>
                  <div className="dash__job-meta">
                    <MapPin size={11} /> {job.location} &nbsp;·&nbsp;
                    <Clock size={11} /> {job.postedAt}
                  </div>
                </div>
                <div className={`dash__job-status dash__job-status--${job.status}`}>
                  {job.status === 'open' ? '🟡 Open' : '🔵 In Progress'}
                </div>
              </div>
              <div className="dash__job-footer">
                <span className="dash__job-bids">{job.bids.length} bid{job.bids.length !== 1 ? 's' : ''} received</span>
                <Link to="/dashboard" className="btn btn-secondary dash__job-view" id={`view-job-${job.id}`}>
                  View Bids <ChevronRight size={13} />
                </Link>
              </div>
            </div>
          ))}
          {activeJobs.length === 0 && (
            <div className="dash__empty">
              <div className="dash__empty-icon">📋</div>
              <div>No active jobs. <Link to="/post-job">Post your first job →</Link></div>
            </div>
          )}
        </div>
      )}

      {/* Bids */}
      {activeTab === 'bids' && (
        <div className="dash__bids-list">
          {allBids.length > 0 ? allBids.map((bid, i) => (
            <div key={i}>
              <div className="dash__bid-job-label">For: {bid.jobTitle}</div>
              <BidCard bid={bid} jobTitle={bid.jobTitle} />
            </div>
          )) : (
            <div className="dash__empty"><div className="dash__empty-icon">⏳</div><div>No bids yet. Workers will respond shortly!</div></div>
          )}
        </div>
      )}

      {/* Completed */}
      {activeTab === 'completed' && (
        <div className="dash__jobs-list">
          {completedJobs.map(job => (
            <div key={job.id} className="dash__job-card dash__job-card--done glass-card">
              <div className="dash__job-title">{job.title}</div>
              <div className="dash__job-meta"><Clock size={11} /> {job.postedAt}</div>
              <div className="dash__job-footer">
                <span className="dash__job-status dash__job-status--completed">✅ Completed</span>
                <button className="btn btn-secondary dash__job-view">Leave a Review</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ════════════════════════════
   WORKER DASHBOARD
════════════════════════════ */

function WorkerStats() {
  return (
    <div className="dash__stats-grid">
      {[
        { icon: <DollarSign size={20} />, label: 'This Month', value: '₹28,400', color: 'amber' },
        { icon: <Briefcase size={20} />, label: 'Active Jobs', value: '3', color: 'blue' },
        { icon: <TrendingUp size={20} />, label: 'Profile Views', value: '142', color: 'purple' },
        { icon: <Star size={20} />, label: 'Avg Rating', value: '4.9★', color: 'green' },
      ].map(s => (
        <div key={s.label} className={`dash__stat-card glass-card dash__stat-card--${s.color}`}>
          <div className="dash__stat-icon">{s.icon}</div>
          <div className="dash__stat-val">{s.value}</div>
          <div className="dash__stat-lbl">{s.label}</div>
        </div>
      ))}
    </div>
  );
}

function WorkerJobs() {
  const [activeTab, setActiveTab] = useState('feed');
  const tabs = [
    { key: 'feed', label: 'Job Feed' },
    { key: 'bids', label: 'My Bids' },
    { key: 'active', label: 'Active Work' },
  ];

  return (
    <div className="dash__section">
      <div className="dash__section-head">
        <h2 className="dash__section-title">Jobs Near You</h2>
        <Link to="/browse" className="btn btn-secondary dash__browse-btn" id="worker-browse-btn">
          Browse More
        </Link>
      </div>

      <div className="dash__tabs">
        {tabs.map(t => (
          <button key={t.key} id={`dash-wtab-${t.key}`}
            className={`dash__tab ${activeTab === t.key ? 'dash__tab--active' : ''}`}
            onClick={() => setActiveTab(t.key)}>
            {t.label}
          </button>
        ))}
      </div>

      {activeTab === 'feed' && (
        <div className="dash__jobs-list">
          {WORKER_JOBS.map(job => (
            <div key={job.id} className="dash__job-card glass-card" id={`wjob-${job.id}`}>
              <div className="dash__job-header">
                <div>
                  <div className="dash__job-cat">{job.category}</div>
                  <div className="dash__job-title">{job.title}</div>
                  <div className="dash__job-meta">
                    <MapPin size={11} /> {job.location} &nbsp;·&nbsp;
                    <Clock size={11} /> {job.postedAt}
                  </div>
                </div>
                <div className="dash__job-budget">{job.budget}</div>
              </div>
              <div className="dash__job-footer">
                <span className="dash__job-bids">{job.bidsCount} bid{job.bidsCount !== 1 ? 's' : ''} so far</span>
                <button className="btn btn-primary dash__job-view" id={`bid-${job.id}`}>
                  Place Bid <ChevronRight size={13} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'bids' && (
        <div className="dash__empty"><div className="dash__empty-icon">📤</div><div>Your submitted bids appear here.</div></div>
      )}

      {activeTab === 'active' && (
        <div className="dash__empty"><div className="dash__empty-icon">🔨</div><div>Jobs you're currently working on appear here.</div></div>
      )}
    </div>
  );
}

/* ════════════════════════════
   SHARED: MESSAGES PANEL
════════════════════════════ */
function MessagesPanel() {
  const MOCK_CHATS = [
    { name: 'Ananya Iyer', lastMsg: 'Can you come tomorrow at 10 AM?', time: '2 min ago', unread: 2, gradient: 'linear-gradient(135deg, #3b82f6, #06b6d4)', initials: 'AI' },
    { name: 'Suresh K.', lastMsg: 'Thanks! The pipe looks great now.', time: '1 hr ago', unread: 0, gradient: 'linear-gradient(135deg, #10b981, #059669)', initials: 'SK' },
    { name: 'Meena R.', lastMsg: 'What\'s your earliest available date?', time: '3 hrs ago', unread: 1, gradient: 'linear-gradient(135deg, #8b5cf6, #6366f1)', initials: 'MR' },
  ];

  return (
    <div className="dash__section">
      <div className="dash__section-head">
        <h2 className="dash__section-title">Messages</h2>
        <Link to="/chat" className="dash__see-all" id="dash-open-chat">Open Chat →</Link>
      </div>
      <div className="dash__chat-list">
        {MOCK_CHATS.map((chat, i) => (
          <Link key={i} to={`/chat/c${i + 1}`} className="dash__chat-item glass-card" id={`chat-${i}`} style={{ textDecoration: 'none' }}>
            <div className="dash__chat-avatar" style={{ background: chat.gradient }}>{chat.initials}</div>
            <div className="dash__chat-body">
              <div className="dash__chat-name">{chat.name}</div>
              <div className="dash__chat-last">{chat.lastMsg}</div>
            </div>
            <div className="dash__chat-right">
              <div className="dash__chat-time">{chat.time}</div>
              {chat.unread > 0 && <div className="dash__chat-unread">{chat.unread}</div>}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

/* ════════════════════════════
   MAIN DASHBOARD
════════════════════════════ */
export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mainTab, setMainTab] = useState('overview');

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const navItems = [
    { key: 'overview', icon: <Home size={16} />, label: 'Overview' },
    { key: 'jobs', icon: <Briefcase size={16} />, label: user.role === 'client' ? 'My Jobs' : 'Job Feed' },
    { key: 'messages', icon: <MessageSquare size={16} />, label: 'Messages' },
    { key: 'profile', icon: <BadgeCheck size={16} />, label: 'My Profile' },
  ];

  return (
    <div className="dash-page">
      <div className="noise-overlay" aria-hidden="true" />
      <div className="glow-orb glow-amber dash__glow-1" />

      {/* ── Sidebar ── */}
      <aside className="dash__sidebar glass-card" id="dash-sidebar">
        {/* User profile */}
        <div className="dash__user">
          <div className="dash__user-avatar">
            {user.initials}
          </div>
          <div className="dash__user-info">
            <div className="dash__user-name">{user.name}</div>
            <div className="dash__user-role">
              {user.role === 'client' ? '🏠 Client' : '🔧 Worker'}
            </div>
          </div>
          {user.verified && <BadgeCheck size={16} className="dash__user-verified" />}
        </div>

        {/* Location */}
        <div className="dash__user-loc">
          <MapPin size={12} /> {user.location}
        </div>

        {/* Rating (worker only) */}
        {user.role === 'worker' && (
          <div className="dash__user-rating">
            <Star size={13} fill="currentColor" className="dash__user-star" />
            4.9 · 218 reviews
          </div>
        )}

        {/* Nav */}
        <nav className="dash__nav">
          {navItems.map(item => (
            <button
              key={item.key}
              id={`dash-nav-${item.key}`}
              className={`dash__nav-item ${mainTab === item.key ? 'dash__nav-item--active' : ''}`}
              onClick={() => setMainTab(item.key)}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        {/* Quick actions */}
        {user.role === 'client' && (
          <Link to="/post-job" className="btn btn-primary dash__sidebar-cta" id="sidebar-post-job">
            <Plus size={15} /> Post a Job
          </Link>
        )}
        {user.role === 'worker' && (
          <Link to={`/worker/w1`} className="btn btn-secondary dash__sidebar-cta" id="sidebar-view-profile">
            View My Profile
          </Link>
        )}

        {/* Bottom actions */}
        <div className="dash__sidebar-bottom">
          <button className="dash__sidebar-link" id="dash-settings"><Settings size={14} /> Settings</button>
          <button onClick={handleLogout} className="dash__sidebar-link" id="dash-logout"><LogOut size={14} /> Log Out</button>
        </div>
      </aside>

      {/* ── Main ── */}
      <main className="dash__main">
        {/* Top bar */}
        <header className="dash__header">
          <div>
            <h1 className="dash__greeting">
              Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 17 ? 'afternoon' : 'evening'}, {user.name.split(' ')[0]} 👋
            </h1>
            <p className="dash__greeting-sub">
              {user.role === 'client'
                ? 'Here\'s what\'s happening with your jobs today.'
                : 'Here\'s your earnings and job feed for today.'}
            </p>
          </div>
          <div className="dash__header-actions">
            <button className="dash__notif-btn" id="dash-notifications" aria-label="Notifications">
              <Bell size={18} />
              <span className="dash__notif-dot" />
            </button>
            <Link to="/" className="dash__logo-link">
              <div className="dash__logo-icon"><Zap size={14} fill="currentColor" /></div>
            </Link>
          </div>
        </header>

        {/* Content */}
        <div className="dash__content">
          {mainTab === 'overview' && (
            <>
              {user.role === 'client' ? <ClientStats /> : <WorkerStats />}

              {/* Quick tip */}
              <div className="dash__tip glass-card">
                <div className="dash__tip-icon">💡</div>
                <div>
                  <div className="dash__tip-title">
                    {user.role === 'client' ? 'You have 3 new bids waiting!' : 'Your profile has 142 views this week!'}
                  </div>
                  <div className="dash__tip-sub">
                    {user.role === 'client'
                      ? 'Review and accept bids to get your job started.'
                      : 'Respond quickly to stay at the top of search results.'}
                  </div>
                </div>
                <button
                  className="btn btn-primary dash__tip-btn"
                  id="dash-tip-action"
                  onClick={() => setMainTab(user.role === 'client' ? 'jobs' : 'jobs')}
                >
                  {user.role === 'client' ? 'See Bids' : 'View Feed'} <ChevronRight size={13} />
                </button>
              </div>

              {/* Recommended workers (client only) */}
              {user.role === 'client' && (
                <div className="dash__section">
                  <div className="dash__section-head">
                    <h2 className="dash__section-title">Top Workers Near You</h2>
                    <Link to="/browse" className="dash__see-all" id="dash-see-all-workers">See all →</Link>
                  </div>
                  <div className="dash__recommended">
                    {WORKERS.slice(0, 3).map(w => (
                      <Link to={`/worker/${w.id}`} key={w.id} className="dash__rec-card glass-card" id={`rec-worker-${w.id}`}>
                        <div className="dash__rec-avatar" style={{ background: w.gradient }}>{w.initials}</div>
                        <div className="dash__rec-info">
                          <div className="dash__rec-name">{w.name}</div>
                          <div className="dash__rec-skill">{w.skill}</div>
                          <div className="dash__rec-meta">
                            <Star size={11} fill="currentColor" className="dash__rec-star" /> {w.rating} · ₹{w.rate}/hr
                          </div>
                        </div>
                        {w.available && <div className="dash__rec-avail">Available</div>}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

          {mainTab === 'jobs' && (
            user.role === 'client' ? <ClientJobs /> : <WorkerJobs />
          )}

          {mainTab === 'messages' && <MessagesPanel />}

          {mainTab === 'profile' && (
            <div className="dash__section">
              <div className="dash__section-head">
                <h2 className="dash__section-title">My Profile</h2>
                {user.role === 'worker' && (
                  <Link to="/worker/w1" className="btn btn-secondary" id="view-public-profile">View Public Profile</Link>
                )}
              </div>
              <div className="dash__profile-card glass-card">
                <div className="dash__profile-row">
                  <span className="dash__profile-label">Name</span>
                  <span className="dash__profile-val">{user.name}</span>
                </div>
                <div className="dash__profile-row">
                  <span className="dash__profile-label">Email</span>
                  <span className="dash__profile-val">{user.email}</span>
                </div>
                <div className="dash__profile-row">
                  <span className="dash__profile-label">Location</span>
                  <span className="dash__profile-val">{user.location}</span>
                </div>
                <div className="dash__profile-row">
                  <span className="dash__profile-label">Account Type</span>
                  <span className="dash__profile-val">{user.role === 'client' ? 'Client' : 'Worker'} · Free plan</span>
                </div>
                <div className="dash__profile-row">
                  <span className="dash__profile-label">Member Since</span>
                  <span className="dash__profile-val">{user.memberSince}</span>
                </div>
                <button className="btn btn-secondary" id="edit-profile-btn" style={{ width: 'fit-content', marginTop: 4 }}>
                  Edit Profile
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
