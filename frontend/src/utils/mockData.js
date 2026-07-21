// High-fidelity Mock Data for SkillXchange Frontend Demo

export const MOCK_CATEGORIES = [
  { id: "cat-1", name: "Programming", description: "Coding, software engineering, and systems development." },
  { id: "cat-2", name: "Graphic Design", description: "UI/UX layout, vectors, illustrations, and styling." },
  { id: "cat-3", name: "Music", description: "Vocal tuning, guitars, and beat-mixing tools." },
  { id: "cat-4", name: "Languages", description: "Speaking, grammar coaching, and accents." },
  { id: "cat-5", name: "Fitness & Well-being", description: "Yoga, gym workout regimens, and mindfulness." },
  { id: "cat-6", name: "Cooking", description: "Culinary arts, pastries, and food preparation." },
  { id: "cat-7", name: "Career Prep", description: "Resumes, interviews, and public speaking." },
  { id: "cat-8", name: "Gardening & DIY", description: "Horticulture, carpentry, and crafts." }
];

export const MOCK_SKILLS = [
  { id: "sk-1", name: "React JS", category_name: "Programming", description: "Frontend web app state, components, and hooks." },
  { id: "sk-2", name: "Python", category_name: "Programming", description: "Syntax, lists, dictionaries, script files, and libraries." },
  { id: "sk-3", name: "UI/UX Design", category_name: "Graphic Design", description: "Figma wireframing, color systems, and user behavior specs." },
  { id: "sk-4", name: "French", category_name: "Languages", description: "Conversational vocabulary, pronunciation, and spelling rules." },
  { id: "sk-5", name: "Data Structures", category_name: "Programming", description: "Linked lists, binary trees, sorting algorithms, and big-O notation." },
  { id: "sk-6", name: "Video Editing", category_name: "Graphic Design", description: "Adobe Premiere transitions, audio level mixing, and color grading." },
  { id: "sk-7", name: "Yoga", category_name: "Fitness & Well-being", description: "Hatha posture sequences, breathing cycles, and meditation postures." },
  { id: "sk-8", name: "Financial Literacy", category_name: "Gardening & DIY", description: "Budgeting sheets, savings allocation, and stock tracking charts." }
];

export const MOCK_USERS = [
  {
    id: "user-charan",
    email: "charan@mits.ac.in",
    full_name: "Charan K",
    bio: "Computer Science major. Love teaching Java and web development basics, looking to learn UI/UX design.",
    major: "CSE - 3rd Year, MITS Madanapalle",
    teach_skills: ["React JS", "JavaScript", "Java"],
    learn_skills: ["UI/UX Design", "Figma"],
    rating_avg: 4.8,
    points: 280,
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
    role: "User",
    is_verified: true
  },
  {
    id: "user-sowmya",
    email: "sowmya@mits.ac.in",
    full_name: "Sowmya P",
    bio: "Data Analyst enthusiast. Python tutor, sql queries optimization champion. Interested in Yoga and French.",
    major: "IT - 3rd Year",
    teach_skills: ["Python", "Django", "SQL"],
    learn_skills: ["Yoga", "French"],
    rating_avg: 4.7,
    points: 310,
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150",
    role: "User",
    is_verified: true
  },
  {
    id: "user-ravi",
    email: "ravi.t@mits.ac.in",
    full_name: "Ravi Teja",
    bio: "Competitive programmer. C++ wizard. Eager to pick up video editing and photoshop basics.",
    major: "ECE - 2nd Year",
    teach_skills: ["C++", "Java", "Data Structures"],
    learn_skills: ["Video Editing", "Photoshop"],
    rating_avg: 4.6,
    points: 240,
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150",
    role: "User",
    is_verified: true
  },
  {
    id: "user-likhitha",
    email: "likhitha.s@mits.ac.in",
    full_name: "Likhitha S",
    bio: "Visual designer and content creator. Figma trainer. Looking to learn Python to build scrapers.",
    major: "CSE - 3rd Year",
    teach_skills: ["Figma", "Canva", "Photoshop"],
    learn_skills: ["Python", "React JS"],
    rating_avg: 4.9,
    points: 340,
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150",
    role: "User",
    is_verified: true
  }
];

export const MOCK_EXCHANGES = [
  {
    id: "ex-1",
    sender_email: "ravi.t@mits.ac.in",
    receiver_email: "nandini@email.com",
    learn_skill: "Python",
    teach_skill: "C++",
    message: "Hey Nandini! I see you want to learn C++ and can teach Python. Let's swap?",
    status: "Pending",
    created_at: "2026-07-16T10:00:00Z"
  },
  {
    id: "ex-2",
    sender_email: "nandini@email.com",
    receiver_email: "sowmya@mits.ac.in",
    learn_skill: "Django",
    teach_skill: "React JS",
    message: "Hi Sowmya, I can help you with React if you can help me understand Django models.",
    status: "Pending",
    created_at: "2026-07-17T12:00:00Z"
  },
  {
    id: "ex-3",
    sender_email: "nandini@email.com",
    receiver_email: "charan@mits.ac.in",
    learn_skill: "React JS",
    teach_skill: "Python",
    message: "Hi Charan, can we coordinate a session for React basics? I will cover Python dictionaries.",
    status: "Accepted",
    created_at: "2026-07-15T09:00:00Z"
  }
];

export const MOCK_MESSAGES = [
  {
    id: "m-1",
    sender_email: "charan@mits.ac.in",
    receiver_email: "nandini@email.com",
    message: "Hi Nandini! Ready for our session today?",
    is_read: true,
    created_at: "2026-07-18T09:00:00Z"
  },
  {
    id: "m-2",
    sender_email: "nandini@email.com",
    receiver_email: "charan@mits.ac.in",
    message: "Yes! I am ready. See you at 4 PM.",
    is_read: true,
    created_at: "2026-07-18T09:05:00Z"
  },
  {
    id: "m-3",
    sender_email: "charan@mits.ac.in",
    receiver_email: "nandini@email.com",
    message: "Great! Let's meet on Google Meet. Here is the link: meet.google.com/abc-defg-hij",
    is_read: true,
    created_at: "2026-07-18T09:10:00Z"
  },
  {
    id: "m-4",
    sender_email: "nandini@email.com",
    receiver_email: "charan@mits.ac.in",
    message: "Perfect! See you there.",
    is_read: true,
    created_at: "2026-07-18T09:12:00Z"
  }
];

export const MOCK_SESSIONS = [
  {
    id: "sess-1",
    exchange_id: "ex-3",
    skill_name: "React JS Basics",
    teacher_email: "charan@mits.ac.in",
    learner_email: "nandini@email.com",
    scheduled_time: "2026-07-20T16:00:00Z",
    meeting_link: "https://meet.google.com/abc-defg-hij",
    notes: "Bring your laptop with Node installed.",
    mode: "Online",
    status: "Scheduled",
    host_completed: false,
    guest_completed: false
  },
  {
    id: "sess-2",
    exchange_id: "ex-3",
    skill_name: "Python Programming",
    teacher_email: "nandini@email.com",
    learner_email: "charan@mits.ac.in",
    scheduled_time: "2026-07-21T18:30:00Z",
    meeting_link: "https://meet.google.com/abc-defg-hij",
    notes: "Introduction to loops and structures.",
    mode: "Online",
    status: "Scheduled",
    host_completed: false,
    guest_completed: false
  }
];

export const MOCK_REVIEWS = [
  {
    id: "rev-1",
    session_id: "sess-old-1",
    reviewer_email: "charan@mits.ac.in",
    reviewee_email: "nandini@email.com",
    rating: 5,
    comment: "Great teaching! Explained Python concepts very clearly.",
    created_at: "2026-07-14T11:00:00Z"
  },
  {
    id: "rev-2",
    session_id: "sess-old-2",
    reviewer_email: "sowmya@mits.ac.in",
    reviewee_email: "nandini@email.com",
    rating: 4,
    comment: "Very patient and supportive. Highly recommended!",
    created_at: "2026-07-12T15:00:00Z"
  }
];

export const MOCK_LEADERBOARD = [
  { rank: 1, full_name: "Charan K", points: 1250, avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150" },
  { rank: 2, full_name: "Sowmya P", points: 980, avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150" },
  { rank: 3, full_name: "Ravi Teja", points: 860, avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150" },
  { rank: 4, full_name: "Nandini R (You)", points: 320, avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150" },
  { rank: 5, full_name: "Likhitha S", points: 300, avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150" }
];
