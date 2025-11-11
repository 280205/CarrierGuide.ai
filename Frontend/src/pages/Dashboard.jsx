import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Aurora from '../pages/Aurora'; // Adjust path if needed
import './rateyourself.css'; // Ensure this path is correct

const RateYourself = () => {
  const [profile, setProfile] = useState({
    skills: 'Python, coding, data analysis',
    interests: 'AI, web development, finance',
    education: 'BSc Computer Science',
    experience: '2 years in programming'
  });

  const [career, setCareer] = useState('');
  const [mentor, setMentor] = useState('');
  const [chatMessages, setChatMessages] = useState([]);
  const [message, setMessage] = useState('');
  const chatEndRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const submitProfile = {
      skills: profile.skills.split(',').map(s => s.trim()),
      interests: profile.interests.split(',').map(i => i.trim()),
      education: profile.education.trim(),
      experience: profile.experience.trim()
    };

    try {
      const res = await axios.post('http://localhost:5000/api/profile', { profile: submitProfile });
      setCareer(res.data.career || '');
      setMentor(res.data.mentor || '');
      setChatMessages([]);
      setMessage('');
    } catch (err) {
      console.error('API Error:', err.response?.data || err.message);
      alert('Failed to get career recommendation. Check the server or console for details.');
    }
  };

  const handleChatSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    const userMsg = { text: message, sender: 'user' };
    setChatMessages(prev => [...prev, userMsg]);
    setMessage('');

    try {
      const res = await axios.post('http://localhost:5000/api/chat', { message });
      setChatMessages(prev => [...prev, { text: res.data.response, sender: 'mentor' }]);
    } catch (err) {
      console.error('Chat Error:', err.response?.data || err.message);
      setChatMessages(prev => [
        ...prev,
        { text: 'Sorry, I couldn’t reach the mentor. Try again!', sender: 'mentor' }
      ]);
    }
  };

  const handleInsightsClick = () => {
    navigate('/industry-insights');
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Aurora background */}
      <Aurora amplitude={1.5} blend={0.4} colorStops={["#2a2a72", "#4b0082", "#1a1a40"]} />

      {/* Page content */}
      <div className="relative z-10 px-6 py-20 md:px-20 text-white">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Form Card */}
          <div className="bg-[#1e1e3f] bg-opacity-90 p-6 rounded-lg shadow-lg">
            <h3 className="text-2xl font-bold mb-6">Fill the Form</h3>
            <form onSubmit={handleSubmit} className="space-y-6">
              {['skills', 'interests', 'education', 'experience'].map((field, i) => (
                <div key={i}>
                  <label className="block mb-2 font-semibold">
                    {field.charAt(0).toUpperCase() + field.slice(1)}{field === 'skills' || field === 'interests' ? ' (comma-separated)' : ''}
                  </label>
                  <input
                    type="text"
                    value={profile[field]}
                    onChange={(e) => setProfile({ ...profile, [field]: e.target.value })}
                    placeholder={
                      field === 'skills' ? 'e.g., Python, coding, data analysis' :
                      field === 'interests' ? 'e.g., AI, web development, finance' :
                      field === 'education' ? 'e.g., BSc Computer Science' :
                      'e.g., 2 years in programming'
                    }
                    className="w-full p-3 rounded bg-gray-700 bg-opacity-80 text-white outline-none"
                  />
                </div>
              ))}
              <button type="submit" className="bg-purple-500 hover:bg-purple-600 px-4 py-3 w-full rounded text-white font-semibold">
                Discover your career
              </button>
            </form>
          </div>

          {/* Chat + Career Card */}
          <div className="bg-[#1e1e3f] bg-opacity-90 p-6 rounded-lg shadow-lg">
            <h3 className="text-2xl font-bold mb-4">Career & Mentor</h3>

            {(career || mentor) ? (
              <div className="space-y-4">
                {career && (
                  <div className="p-3 bg-gray-800 rounded text-white">
                    <strong>Career Recommendation:</strong> {career}
                  </div>
                )}
                {mentor && (
                  <div className="p-3 bg-gray-800 rounded text-white">
                    <strong>Mentor Recommendation:</strong> {mentor}
                  </div>
                )}
                <div className="max-h-40 overflow-y-auto space-y-2">
                  {chatMessages.map((msg, index) => (
                    <div
                      key={index}
                      className={`p-2 rounded ${msg.sender === 'user' ? 'bg-purple-600' : 'bg-gray-700'}`}
                    >
                      {msg.text}
                    </div>
                  ))}
                  <div ref={chatEndRef} />
                </div>
                <form onSubmit={handleChatSubmit} className="flex space-x-2">
                  <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="What can I help with?"
                    className="flex-1 p-2 bg-gray-700 rounded text-white outline-none"
                  />
                  <button type="submit" className="bg-purple-600 hover:bg-purple-700 px-4 rounded text-white">↑</button>
                </form>
                <button onClick={handleInsightsClick} className="w-full mt-2 bg-purple-500 hover:bg-purple-600 py-2 rounded text-white">
                  View Industry Insights
                </button>
              </div>
            ) : (
              <div>
                <p className="text-gray-300 mb-4">No recommendations available. Fill the form to get started!</p>
                <button onClick={handleInsightsClick} className="w-full bg-purple-500 hover:bg-purple-600 py-2 rounded text-white">
                  View Industry Insights
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RateYourself;
