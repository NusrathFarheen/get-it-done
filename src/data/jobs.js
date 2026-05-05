// Mock job data — replace with real API calls to AWS Lambda + DynamoDB

export const POSTED_JOBS = [
  {
    id: 'j1',
    title: 'Fix bathroom pipe leakage under sink',
    category: 'Plumbing',
    description: 'There is a slow leak under my bathroom sink. The pipe fitting seems loose. Need it fixed ASAP.',
    budget: { type: 'fixed', amount: 500, max: 800 },
    urgency: 'today',
    location: 'Bandra West, Mumbai',
    status: 'open',
    postedAt: '2 hours ago',
    bids: [
      { workerId: 'w1', workerName: 'Rajan Mehta', workerInitials: 'RM', gradient: 'linear-gradient(135deg, #f59e0b, #f97316)', amount: 550, message: 'I can be there by 3 PM today. I have all tools needed.', rating: 4.9, jobs: 312 },
      { workerId: 'w2', workerName: 'Suresh P.', workerInitials: 'SP', gradient: 'linear-gradient(135deg, #3b82f6, #06b6d4)', amount: 480, message: 'Available now. Quick and clean work guaranteed.', rating: 4.6, jobs: 87 },
    ],
  },
  {
    id: 'j2',
    title: 'Paint 2BHK apartment — 3 rooms',
    category: 'Painting',
    description: 'Need interior painting for a 2BHK flat. Walls + ceiling. Prefer eco-friendly paints.',
    budget: { type: 'range', amount: 12000, max: 20000 },
    urgency: 'this_week',
    location: 'Koramangala, Bangalore',
    status: 'in_progress',
    postedAt: '1 day ago',
    bids: [
      { workerId: 'w3', workerName: 'Priya Sharma', workerInitials: 'PS', gradient: 'linear-gradient(135deg, #8b5cf6, #6366f1)', amount: 15000, message: 'I use premium Asian Paints eco-range. Can start Monday.', rating: 4.8, jobs: 189 },
    ],
  },
  {
    id: 'j3',
    title: 'Deep clean entire 3BHK before move-in',
    category: 'Cleaning',
    description: 'Moving into a new apartment. Need thorough deep cleaning of all rooms, kitchen, and bathrooms.',
    budget: { type: 'fixed', amount: 2000, max: 3000 },
    urgency: 'flexible',
    location: 'Adyar, Chennai',
    status: 'completed',
    postedAt: '5 days ago',
    bids: [],
  },
];

export const WORKER_JOBS = [
  {
    id: 'wj1',
    title: 'Fix bathroom pipe leakage under sink',
    category: 'Plumbing',
    clientName: 'Ananya I.',
    location: 'Bandra West, Mumbai',
    budget: '₹500 – ₹800',
    urgency: 'today',
    postedAt: '2 hours ago',
    status: 'open',
    bidsCount: 2,
  },
  {
    id: 'wj2',
    title: 'Replace water heater — 15L geyser',
    category: 'Plumbing',
    clientName: 'Suresh K.',
    location: 'Powai, Mumbai',
    budget: '₹800 – ₹1,500',
    urgency: 'this_week',
    postedAt: '1 day ago',
    status: 'open',
    bidsCount: 1,
  },
  {
    id: 'wj3',
    title: 'Drain cleaning — kitchen + bathroom',
    category: 'Plumbing',
    clientName: 'Meena R.',
    location: 'Dadar, Mumbai',
    budget: '₹400 flat',
    urgency: 'flexible',
    postedAt: '3 days ago',
    status: 'open',
    bidsCount: 0,
  },
];

export const URGENCY_OPTIONS = [
  { value: 'today', label: 'Today', desc: 'Need it done urgently' },
  { value: 'this_week', label: 'This week', desc: 'Within the next 7 days' },
  { value: 'this_month', label: 'This month', desc: 'Within 30 days' },
  { value: 'flexible', label: 'Flexible', desc: 'No rush, I\'ll plan around the worker' },
];

export const JOB_CATEGORIES = [
  { label: 'Plumbing', emoji: '🔧' },
  { label: 'Electrical', emoji: '⚡' },
  { label: 'Carpentry', emoji: '🪚' },
  { label: 'Painting', emoji: '🎨' },
  { label: 'Cleaning', emoji: '✨' },
  { label: 'AC & Appliances', emoji: '❄️' },
  { label: 'Masonry & Tiling', emoji: '🧱' },
  { label: 'Gardening', emoji: '🌿' },
  { label: 'Moving & Shifting', emoji: '📦' },
  { label: 'Tutoring', emoji: '📚' },
  { label: 'Security Systems', emoji: '🔒' },
  { label: 'Other', emoji: '🛠️' },
];
