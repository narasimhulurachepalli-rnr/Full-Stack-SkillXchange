import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/layout/DashboardLayout';
import { useAuth } from '../context/AuthContext';
import { MOCK_SESSIONS, MOCK_USERS } from '../utils/mockData';
import { 
  Mic, MicOff, Video, VideoOff, Monitor, MessageSquare, 
  Users, Clock, PhoneOff, Calendar, Send, X, AlertCircle, CheckCircle2 
} from 'lucide-react';

export default function VideoRoom() {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  // Find session details
  const session = MOCK_SESSIONS.find(s => s.id === sessionId) || MOCK_SESSIONS[0];
  const partnerEmail = session.teacher_email === user?.email ? session.learner_email : session.teacher_email;
  const partner = MOCK_USERS.find(u => u.email === partnerEmail) || { full_name: "Charan K", avatar: "" };

  // Video states
  const [isMicOn, setIsMicOn] = useState(true);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isParticipantsOpen, setIsParticipantsOpen] = useState(false);
  const [isRescheduleOpen, setIsRescheduleOpen] = useState(false);
  
  // Timer state (seconds)
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  // Chat states
  const [chatMessages, setChatMessages] = useState([
    { id: "1", sender: partner.full_name, text: "Hi! Connected to video room.", time: "10:00 AM" },
    { id: "2", sender: "System", text: "End-to-end WebRTC video session initialized.", time: "10:00 AM" }
  ]);
  const [chatInput, setChatInput] = useState('');

  // Reschedule states
  const [rescheduleDate, setRescheduleDate] = useState('');
  const [rescheduleTime, setRescheduleTime] = useState('');
  const [rescheduleSuccess, setRescheduleSuccess] = useState(false);

  useEffect(() => {
    // Session timer tick
    const timer = setInterval(() => {
      setElapsedSeconds(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTimer = (totalSeconds) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSendChat = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    setChatMessages(prev => [
      ...prev,
      {
        id: `chat-${Date.now()}`,
        sender: user?.full_name || "You",
        text: chatInput.trim(),
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
    setChatInput('');
  };

  const handleRescheduleSubmit = (e) => {
    e.preventDefault();
    setRescheduleSuccess(true);
    setTimeout(() => {
      setIsRescheduleOpen(false);
      setRescheduleSuccess(false);
    }, 1500);
  };

  const handleEndCall = () => {
    session.status = 'Completed';
    navigate('/sessions');
  };

  // Construct Jitsi room URL
  const roomName = `SkillXchange_${session.id || 'room'}`;
  const jitsiUrl = `https://meet.jit.si/${roomName}#userInfo.displayName="${encodeURIComponent(user?.full_name || 'Participant')}"`;

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in font-sans">
        {/* Top Video Header */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 sm:p-6 text-white flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-xl">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <span className="px-2.5 py-0.5 bg-brand-rose text-white text-[10px] font-bold uppercase rounded-full animate-pulse flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
                LIVE VIDEO SESSION
              </span>
              <h1 className="text-xl font-bold font-outfit">{session.skill_name}</h1>
            </div>
            <p className="text-xs text-slate-400">
              Partner: <span className="text-white font-semibold">{partner.full_name}</span> ({partnerEmail})
            </p>
          </div>

          <div className="flex items-center gap-3 self-end sm:self-auto">
            {/* Live timer badge */}
            <div className="flex items-center gap-2 px-3.5 py-1.5 bg-slate-800 border border-slate-700 rounded-xl text-xs font-mono font-bold text-amber-400">
              <Clock className="w-4 h-4 text-amber-400" />
              <span>{formatTimer(elapsedSeconds)}</span>
            </div>

            {/* Reschedule button */}
            <button
              onClick={() => setIsRescheduleOpen(true)}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold rounded-xl flex items-center gap-1.5 text-slate-300 transition-colors"
            >
              <Calendar className="w-3.5 h-3.5" />
              Reschedule
            </button>
          </div>
        </div>

        {/* Video Canvas Container Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 min-h-[400px]">
          {/* Main Video Screen (3 cols) */}
          <div className="lg:col-span-3 bg-slate-950 border border-slate-800 rounded-3xl overflow-hidden relative shadow-2xl flex flex-col justify-between">
            {/* Embedded WebRTC Video Iframe */}
            <div className="relative w-full h-[360px] sm:h-[520px] bg-slate-900 flex items-center justify-center">
              <iframe
                src={jitsiUrl}
                title="SkillXchange Video Room"
                className="w-full h-full border-none rounded-t-3xl"
                allow="camera; microphone; display-capture; autoplay; clipboard-write"
              ></iframe>
            </div>

            {/* In-Call Controls Toolbar */}
            <div className="p-3 sm:p-4 bg-slate-900/90 border-t border-slate-800 flex flex-wrap items-center justify-center sm:justify-between gap-2.5 sm:gap-4">
              <div className="flex items-center gap-3">
                {/* Microphone toggle */}
                <button
                  onClick={() => setIsMicOn(!isMicOn)}
                  className={`p-3.5 rounded-2xl transition-all shadow-md ${
                    isMicOn 
                      ? 'bg-slate-800 hover:bg-slate-700 text-white' 
                      : 'bg-brand-rose text-white shadow-brand-rose/30'
                  }`}
                  title={isMicOn ? "Mute Microphone" : "Unmute Microphone"}
                >
                  {isMicOn ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
                </button>

                {/* Camera toggle */}
                <button
                  onClick={() => setIsVideoOn(!isVideoOn)}
                  className={`p-3.5 rounded-2xl transition-all shadow-md ${
                    isVideoOn 
                      ? 'bg-slate-800 hover:bg-slate-700 text-white' 
                      : 'bg-brand-rose text-white shadow-brand-rose/30'
                  }`}
                  title={isVideoOn ? "Turn Camera Off" : "Turn Camera On"}
                >
                  {isVideoOn ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
                </button>

                {/* Screen Share toggle */}
                <button
                  onClick={() => setIsScreenSharing(!isScreenSharing)}
                  className={`p-3.5 rounded-2xl transition-all shadow-md ${
                    isScreenSharing 
                      ? 'bg-brand-indigo text-white shadow-brand-indigo/30' 
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                  }`}
                  title="Share Screen"
                >
                  <Monitor className="w-5 h-5" />
                </button>
              </div>

              {/* Side Panels Toggles */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => { setIsChatOpen(!isChatOpen); setIsParticipantsOpen(false); }}
                  className={`p-3.5 rounded-2xl transition-all ${
                    isChatOpen ? 'bg-brand-indigo text-white' : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                  }`}
                  title="In-Session Chat"
                >
                  <MessageSquare className="w-5 h-5" />
                </button>

                <button
                  onClick={() => { setIsParticipantsOpen(!isParticipantsOpen); setIsChatOpen(false); }}
                  className={`p-3.5 rounded-2xl transition-all ${
                    isParticipantsOpen ? 'bg-brand-indigo text-white' : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                  }`}
                  title="Participants List"
                >
                  <Users className="w-5 h-5" />
                </button>

                {/* End Call Button */}
                <button
                  onClick={handleEndCall}
                  className="px-6 py-3 bg-brand-rose hover:bg-brand-rose/90 text-white font-bold rounded-2xl shadow-lg shadow-brand-rose/25 flex items-center gap-2 text-sm transition-all active:scale-95 ml-2"
                >
                  <PhoneOff className="w-4 h-4" />
                  <span>End Session</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right Column (In-Call Chat or Participants Drawer) */}
          <div className="bg-white border border-slate-100 rounded-3xl p-4 shadow-sm flex flex-col justify-between">
            {isParticipantsOpen ? (
              /* Participant List view */
              <div className="space-y-4 flex-1">
                <h3 className="font-bold text-slate-800 font-outfit border-b border-slate-100 pb-3 flex items-center gap-2 text-sm">
                  <Users className="w-4 h-4 text-brand-indigo" />
                  Participants (2)
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl">
                    <div className="flex items-center gap-3">
                      <img src={user?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80"} alt="You" className="w-8 h-8 rounded-full object-cover" />
                      <div>
                        <p className="text-xs font-bold text-slate-800">{user?.full_name} (You)</p>
                        <p className="text-[10px] text-brand-emerald font-semibold">Host</p>
                      </div>
                    </div>
                    <Mic className="w-4 h-4 text-emerald-500" />
                  </div>

                  <div className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl">
                    <div className="flex items-center gap-3">
                      <img src={partner.avatar} alt={partner.full_name} className="w-8 h-8 rounded-full object-cover" />
                      <div>
                        <p className="text-xs font-bold text-slate-800">{partner.full_name}</p>
                        <p className="text-[10px] text-slate-400">Peer Student</p>
                      </div>
                    </div>
                    <Mic className="w-4 h-4 text-emerald-500" />
                  </div>
                </div>
              </div>
            ) : (
              /* In-Session Chat view */
              <div className="flex-1 flex flex-col justify-between space-y-4">
                <h3 className="font-bold text-slate-800 font-outfit border-b border-slate-100 pb-3 flex items-center gap-2 text-sm">
                  <MessageSquare className="w-4 h-4 text-brand-indigo" />
                  In-Session Chat
                </h3>

                <div className="flex-1 space-y-3 overflow-y-auto max-h-[360px] pr-1">
                  {chatMessages.map((msg) => (
                    <div key={msg.id} className="p-3 bg-slate-50 border border-slate-100 rounded-2xl space-y-1">
                      <div className="flex justify-between items-center text-[10px]">
                        <span className="font-bold text-slate-800">{msg.sender}</span>
                        <span className="text-slate-400">{msg.time}</span>
                      </div>
                      <p className="text-xs text-slate-600">{msg.text}</p>
                    </div>
                  ))}
                </div>

                <form onSubmit={handleSendChat} className="flex items-center gap-2 pt-2 border-t border-slate-100">
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder="Type message..."
                    className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-brand-indigo"
                  />
                  <button
                    type="submit"
                    className="p-2 bg-brand-indigo text-white rounded-xl shadow-md hover:bg-brand-indigo/90"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>

        {/* Reschedule Modal */}
        {isRescheduleOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
            <div className="bg-white rounded-3xl border border-slate-100 p-6 w-full max-w-md relative shadow-2xl animate-scale-up">
              <button onClick={() => setIsRescheduleOpen(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
                <X className="w-6 h-6" />
              </button>

              <h2 className="text-xl font-bold font-outfit text-slate-800 mb-2">Reschedule Session</h2>
              <p className="text-xs text-slate-500 mb-6">Select a new date and time for this skill swap call.</p>

              {rescheduleSuccess ? (
                <div className="p-6 bg-brand-emerald/10 border border-brand-emerald/20 text-brand-emerald rounded-2xl text-center space-y-2">
                  <CheckCircle2 className="w-8 h-8 mx-auto" />
                  <h3 className="font-bold">Session Rescheduled!</h3>
                  <p className="text-xs">Calendar invitation updated and sent to {partner.full_name}.</p>
                </div>
              ) : (
                <form onSubmit={handleRescheduleSubmit} className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">New Date</label>
                    <input
                      type="date"
                      required
                      value={rescheduleDate}
                      onChange={(e) => setRescheduleDate(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-brand-indigo"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">New Time</label>
                    <input
                      type="time"
                      required
                      value={rescheduleTime}
                      onChange={(e) => setRescheduleTime(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-brand-indigo"
                    />
                  </div>

                  <div className="flex justify-end gap-3 pt-4">
                    <button type="button" onClick={() => setIsRescheduleOpen(false)} className="px-4 py-2 text-xs font-semibold text-slate-500 border border-slate-200 rounded-xl hover:bg-slate-50">
                      Cancel
                    </button>
                    <button type="submit" className="px-5 py-2 text-xs font-semibold text-white bg-brand-indigo hover:bg-brand-indigo/90 rounded-xl shadow-md">
                      Confirm Reschedule
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
