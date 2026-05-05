// Mock conversations — replace with AWS API Gateway WebSocket + DynamoDB

export const CONVERSATIONS = [
  {
    id: 'c1',
    with: {
      id: 'w1',
      name: 'Rajan Mehta',
      initials: 'RM',
      gradient: 'linear-gradient(135deg, #f59e0b, #f97316)',
      skill: 'Master Plumber',
      available: true,
    },
    jobContext: 'Fix bathroom pipe leakage under sink',
    jobId: 'j1',
    lastActivity: '10:28 AM',
    unread: 0,
    messages: [
      { id: 'm1', from: 'them', text: 'Hi! I saw your job posting. I can fix that pipe leak today — been doing this for 8 years.', time: '10:23 AM', read: true },
      { id: 'm2', from: 'me', text: 'Great! What time can you come?', time: '10:25 AM', read: true },
      { id: 'm3', from: 'them', text: 'I can be there by 3 PM. My rate for this type of job is ₹550 flat. All tools included.', time: '10:26 AM', read: true },
      { id: 'm4', from: 'me', text: 'Sounds good. Can you make it ₹500?', time: '10:27 AM', read: true },
      { id: 'm5', from: 'them', text: '₹520 is my best — I\'ll bring all materials and clean up after. Deal?', time: '10:28 AM', read: true },
    ],
  },
  {
    id: 'c2',
    with: {
      id: 'w2',
      name: 'Priya Sharma',
      initials: 'PS',
      gradient: 'linear-gradient(135deg, #8b5cf6, #6366f1)',
      skill: 'Interior Painter',
      available: true,
    },
    jobContext: 'Paint 2BHK apartment — 3 rooms',
    jobId: 'j2',
    lastActivity: '2 hrs ago',
    unread: 2,
    messages: [
      { id: 'm1', from: 'them', text: 'Hello! I use premium Asian Paints eco-range for all my projects. Zero VOC, safe for kids and pets.', time: '8:30 AM', read: true },
      { id: 'm2', from: 'me', text: 'That\'s exactly what I need. How long will the 2BHK take?', time: '8:45 AM', read: true },
      { id: 'm3', from: 'them', text: '3 rooms should take about 3 days. I\'ll need the space to air out for 24 hrs after.', time: '9:00 AM', read: false },
      { id: 'm4', from: 'them', text: 'Can we do a site visit first so I can give an accurate quote?', time: '9:01 AM', read: false },
    ],
  },
  {
    id: 'c3',
    with: {
      id: 'w4',
      name: 'Meena Subramaniam',
      initials: 'MS',
      gradient: 'linear-gradient(135deg, #10b981, #059669)',
      skill: 'Professional Cleaner',
      available: false,
    },
    jobContext: 'Deep clean 3BHK before move-in',
    jobId: 'j3',
    lastActivity: 'Yesterday',
    unread: 0,
    messages: [
      { id: 'm1', from: 'me', text: 'Hi Meena! I need a full deep clean before we move in. 3BHK in Adyar.', time: 'Yesterday', read: true },
      { id: 'm2', from: 'them', text: 'Perfect timing! I have a slot this Saturday morning. ₹2,200 for a full 3BHK.', time: 'Yesterday', read: true },
      { id: 'm3', from: 'me', text: 'That works great. Confirmed for Saturday 9 AM!', time: 'Yesterday', read: true },
      { id: 'm4', from: 'them', text: '✅ Confirmed! I\'ll bring all eco-friendly cleaning products. See you Saturday.', time: 'Yesterday', read: true },
    ],
  },
];

export const QUICK_REPLIES = [
  'I\'m interested, can we discuss?',
  'What\'s your earliest availability?',
  'Can you do a site visit first?',
  'Is this price negotiable?',
  'How long will the job take?',
  'Do you provide materials?',
];
