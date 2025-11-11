import { useChatStore } from "../store/useChatStore";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  // initialize chat store (selectedUser not used on this page)
  useChatStore();
  const navigate = useNavigate();

  const [contact, setContact] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [faqOpen, setFaqOpen] = useState(null); // State to track which FAQ is open

  const handleContactSubmit = (e) => {
    e.preventDefault();
    console.log("Contact Form Data:", contact);
    alert("Message sent successfully!");
    setContact({ name: "", email: "", message: "" });
  };

  const handleGetStarted = () => {
    navigate("/Dashboard");
  };

  const faqs = [
    {
      question: "How do I get started on CareerGuide.ai?",
      answer: "Sign up with your email, set up your profile, and explore our features to find the best career tools for you."
    },
    {
      question: "What kind of support does CareerGuide.ai offer?",
      answer: "We provide career recommendations, resources, and community support to help you grow professionally."
    },
    {
      question: "How can I update my profile information?",
      answer: "Log in to your account, navigate to the profile section, and edit your details anytime from the dashboard."
    },
    {
      question: "Is my personal information safe?",
      answer: "Yes, we use encryption and strict privacy policies to protect your data—check our privacy page for details."
    },
    {
      question: "Can I use CareerGuide.ai on my mobile device?",
      answer: "Yes, our platform is fully responsive and works smoothly on both mobile and desktop devices."
    },
    {
      question: "What should I do if I encounter a problem?",
      answer: "Contact our support team at support@careerguide.ai, and we will resolve your issue within 24 hours."
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-indigo-900 via-purple-800 to-indigo-900 text-white">
      {/* Header */}
      <header className="flex justify-between items-center px-8 py-4 bg-black/50 shadow-lg">
        <h1 className="text-2xl font-bold tracking-wide text-purple-300">CareerGuide.ai</h1>
        <nav className="flex space-x-6 text-lg">
          <a href="#" className="hover:text-purple-400 transition">Home</a>
          <a href="#" className="hover:text-purple-400 transition">Features</a>
          <a href="#" className="hover:text-purple-400 transition">Pricing</a>
          <a href="#" className="hover:text-purple-400 transition">Blog</a>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="flex-1 flex flex-col items-center justify-center text-center px-4 py-20">
        <img
          src="https://i.postimg.cc/NjS5Phrx/Mentor-GIF-purple-2.png"
          alt="Mentor Animation"
          className="w-64 h-auto mb-6 rounded-lg animate-pulse"
        />
        <h1 className="text-5xl md:text-6xl font-extrabold mb-4 drop-shadow-lg">Welcome to CareerGuide</h1>
        <p className="text-xl md:text-2xl mb-8 max-w-xl text-gray-200">
          Get personalized career recommendations and connect with mentors.
        </p>
        <button
          onClick={handleGetStarted}
          className="bg-purple-600 hover:bg-purple-700 transition px-8 py-3 rounded-lg shadow-md text-lg font-medium"
        >
          Get Started
        </button>
      </section>

      {/* About & Contact Sections */}
      <main className="px-6 md:px-20 py-12 space-y-16 bg-gray-50 text-gray-900 rounded-t-3xl shadow-inner">
        {/* About Section */}
        <section className="bg-white rounded-xl shadow p-8 hover:shadow-xl transition">
          <h3 className="text-2xl font-semibold mb-4 text-purple-800">About CareerGuide</h3>
          <p className="mb-6 leading-relaxed text-gray-700">
          CareerGuide.ai is your trusted partner in building a meaningful and successful career. Leveraging the power of advanced AI, we provide personalized career recommendations, real-time mentorship, and curated learning resources tailored to your unique background, skills, and aspirations. Whether you are a student exploring options, a professional looking to switch paths, or someone trying to upskill, our platform offers clarity and confidence every step of the way. From analyzing your profile to suggesting career roles, identifying skill gaps, and offering actionable advice through our virtual mentor, CareerGuide.ai is designed to simplify decision-making and empower you with insights that matter. Our mission is to make professional guidance accessible, adaptive, and impactful—because everyone deserves a career they love and believe in.
          </p>
          <img
            src="https://img.freepik.com/premium-vector/business-coach-speaking-front-audience-mentor-presenting-charts-reports-seminar-training-presentation-conference-leadership-mentoring-concept-cartoon-flat-vector-illustration_341509-2414.jpg?w=1380"
            alt="About CareerGuide"
            className="w-full rounded-md"
          />
        </section>

        {/* How It Works Section */}
        <section className="bg-white rounded-xl shadow p-8 hover:shadow-xl transition">
          <h3 className="text-3xl font-bold mb-6 text-center text-purple-800">How does the platform work? 😄</h3>
          <div className="flex justify-around items-center flex-wrap gap-8">
            <div className="text-center max-w-xs">
              <h4 className="text-4xl font-bold text-purple-600 mb-4">1</h4>
              <img
                src="https://app.mentorwith.com/wp-content/uploads/2020/10/1-Setup-Profile.png"
                alt="Set up availability"
                className="w-34 h-40 mx-auto mb-4 rounded-lg"
              />
              <p className="text-gray-700">1. Create Your Profile : Start by filling out a short form with your skills, interests, education, and experience.
              </p>
            </div>
            <div className="text-center max-w-xs">
              <h4 className="text-4xl font-bold text-purple-600 mb-4">2</h4>
              <img
                src="https://app.mentorwith.com/wp-content/uploads/2020/10/2-Get-Requests.png"
                alt="View scheduled sessions"
                className="w-34 h-40 mx-auto mb-4 rounded-lg"
              />
              <p className="text-gray-700">2. Get Personalized Guidance :
              Our AI analyzes your profile and generates tailored career paths, skill recommendations, and growth opportunities. </p>
            </div>
            <div className="text-center max-w-xs">
              <h4 className="text-4xl font-bold text-purple-600 mb-4">3</h4>
              <img
                src="https://app.mentorwith.com/wp-content/uploads/2020/10/2-Hold-Session.png"
                alt="Hold mentoring sessions"
                className="w-34 h-40 mx-auto mb-4 rounded-lg"
              />
              <p className="text-gray-700">3. Take Action & Grow :
              Follow the suggested next steps, whether it is learning a new skill, exploring a job role, or building a project.</p>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="bg-white rounded-xl shadow p-8 hover:shadow-xl transition">
          <h3 className="text-3xl font-bold mb-6 text-center text-purple-800">FAQs</h3>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="border-b border-gray-200">
                <button
                  onClick={() => setFaqOpen(faqOpen === index ? null : index)}
                  className="w-full text-left py-4 flex justify-between items-center text-lg font-medium text-purple-800 hover:text-purple-600 focus:outline-none"
                >
                  <span>+ {faq.question}</span>
                  <svg
                    className={`w-5 h-5 transition-transform ${faqOpen === index ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {faqOpen === index && (
                  <div className="text-gray-700 py-2 pl-4 pr-6">
                    <p>{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Contact Us */}
        <section className="bg-white rounded-xl shadow p-8 hover:shadow-xl transition">
          <h3 className="text-2xl font-semibold mb-6 text-purple-800">Contact Us</h3>
          <form onSubmit={handleContactSubmit} className="space-y-6">
            <div>
              <label className="block mb-1 font-medium">Name</label>
              <input
                type="text"
                value={contact.name}
                onChange={(e) => setContact({ ...contact, name: e.target.value })}
                placeholder="Your name"
                className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-purple-500 focus:outline-none bg-white text-black"
                required
              />
            </div>
            <div>
              <label className="block mb-1 font-medium">Email</label>
              <input
                type="email"
                value={contact.email}
                onChange={(e) => setContact({ ...contact, email: e.target.value })}
                placeholder="Your email"
                className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-purple-500 focus:outline-none bg-white text-black"
                required
              />
            </div>
            <div>
              <label className="block mb-1 font-medium">Message</label>
              <textarea
                value={contact.message}
                onChange={(e) => setContact({ ...contact, message: e.target.value })}
                placeholder="Your message"
                className="w-full p-3 border border-gray-300 rounded h-28 resize-none focus:ring-2 focus:ring-purple-500 focus:outline-none bg-white text-black"
                required
              />
            </div>
            <button
              type="submit"
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg transition shadow"
            >
              Send Message
            </button>
          </form>
        </section>
      </main>

      {/* Footer */}
      <footer className="text-center text-sm py-6 mt-auto bg-black/50 text-white">
        © 2025 CareerGuide.ai | All rights reserved
      </footer>
    </div>
  );
};

export default HomePage;