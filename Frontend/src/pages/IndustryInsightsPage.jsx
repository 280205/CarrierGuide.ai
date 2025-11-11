import { useState } from "react";
import axios from "axios";
import Aurora from "../pages/Aurora"; // ✅ Adjust path if necessary

export default function IndustryInsightsPage() {
  const [insights, setInsights] = useState({
    marketOutlook: "Positive",
    industryGrowth: "",
    demandLevel: "",
    topSkills: ["Python", "Java", "JavaScript", "Cloud Computing", "Agile"],
    salaryRanges: {
      "Software Engineer": { min: 90, median: 135, max: 180 },
      "Data Scientist": { min: 90, median: 150, max: 180 },
      "Frontend Developer": { min: 90, median: 120, max: 150 },
      "Backend Developer": { min: 90, median: 135, max: 180 },
      "DevOps Engineer": { min: 90, median: 145, max: 180 },
      "Mobile App Developer": { min: 90, median: 130, max: 170 },
    },
    lastUpdated: "20/01/2025",
    nextUpdate: "in 4 days",
  });

  const [userQuery, setUserQuery] = useState("");
  const [chatMessages, setChatMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const getDemandBarWidth = (level) => {
    switch (level.toLowerCase()) {
      case "high":
        return "85%";
      case "medium":
        return "60%";
      case "low":
        return "35%";
      default:
        return "10%";
    }
  };

  const getGrowthBarWidth = (growth) => {
    const percent = parseInt(growth.replace("%", "")) || 0;
    return `${Math.min(Math.max(percent, 0), 100)}%`;
  };

  const handleChatSubmit = async (e) => {
    e.preventDefault();
    if (!userQuery.trim()) return;

    setIsLoading(true);
    const userMsg = { text: userQuery, sender: "user" };
    setChatMessages((prev) => [...prev, userMsg]);
    setUserQuery("");

    try {
      const res = await axios.post("http://localhost:5000/api/chat", {
        message: userQuery,
      });
      const mentorResponse = res.data.response;

      const updatedInsights = { ...insights };
      if (mentorResponse.toLowerCase().includes("growth")) {
        updatedInsights.industryGrowth = `${Math.floor(Math.random() * 11 + 5)}%`; // 5% to 15%
      } else if (mentorResponse.toLowerCase().includes("demand")) {
        const levels = ["Low", "Medium", "High"];
        updatedInsights.demandLevel = levels[Math.floor(Math.random() * levels.length)];
      } else if (mentorResponse.toLowerCase().includes("salary")) {
        Object.keys(updatedInsights.salaryRanges).forEach((role) => {
          updatedInsights.salaryRanges[role] = {
            min: Math.floor(Math.random() * 50) + 80,
            median: Math.floor(Math.random() * 50) + 120,
            max: Math.floor(Math.random() * 50) + 150,
          };
        });
      } else if (mentorResponse.toLowerCase().includes("skills")) {
        updatedInsights.topSkills = [
          ...new Set(
            [
              ...insights.topSkills,
              "Machine Learning",
              "DevOps",
              "Cybersecurity",
            ].sort(() => Math.random() - 0.5)
          ),
        ].slice(0, 5);
      }

      setInsights(updatedInsights);
      setChatMessages((prev) => [
        ...prev,
        { text: mentorResponse, sender: "mentor" },
      ]);
    } catch (err) {
      console.error("Chat Error:", err.response?.data || err.message);
      setChatMessages((prev) => [
        ...prev,
        {
          text: "Sorry, I could not reach the mentor. Try again!",
          sender: "mentor",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      <Aurora
        amplitude={1.2}
        blend={0.4}
        colorStops={["#2a2a72", "#4b0082", "#1a1a40"]}
      />

      <div className="relative z-10 p-10 pt-16 text-white">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">Industry Insights</h1>
          <div className="flex space-x-4">
            <button className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded text-white">
              Industry Insights
            </button>
            <button className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded text-white">
              Growth Tools
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gray-800 bg-opacity-80 p-4 rounded-lg shadow-lg">
            <h3 className="text-lg font-semibold">Market Outlook</h3>
            <p>{insights.marketOutlook}</p>
            <p className="text-sm text-gray-300">
              Next update {insights.nextUpdate}
            </p>
          </div>

          <div className="bg-gray-800 bg-opacity-80 p-4 rounded-lg shadow-lg">
            <h3 className="text-lg font-semibold">Industry Growth</h3>
            {insights.industryGrowth ? (
              <>
                <div className="w-full bg-gray-600 rounded-full h-2.5">
                  <div
                    className="bg-green-500 h-2.5 rounded-full"
                    style={{ width: getGrowthBarWidth(insights.industryGrowth) }}
                  ></div>
                </div>
                <p>{insights.industryGrowth}</p>
              </>
            ) : (
              <p className="text-gray-400 italic">
                Ask about industry growth to see data
              </p>
            )}
          </div>

          <div className="bg-gray-800 bg-opacity-80 p-4 rounded-lg shadow-lg">
            <h3 className="text-lg font-semibold">Demand Level</h3>
            {insights.demandLevel ? (
              <>
                <div className="w-full bg-gray-600 rounded-full h-2.5">
                  <div
                    className="bg-green-500 h-2.5 rounded-full"
                    style={{ width: getDemandBarWidth(insights.demandLevel) }}
                  ></div>
                </div>
                <p>{insights.demandLevel}</p>
              </>
            ) : (
              <p className="text-gray-400 italic">
                Ask about demand level to see data
              </p>
            )}
          </div>

          <div className="bg-gray-800 bg-opacity-80 p-4 rounded-lg md:col-span-3 shadow-lg">
            <h3 className="text-lg font-semibold">Top Skills</h3>
            <div className="flex flex-wrap gap-2">
              {insights.topSkills.map((skill, index) => (
                <span
                  key={index}
                  className="bg-gray-700 bg-opacity-80 px-2 py-1 rounded text-white"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          <div className="bg-gray-800 bg-opacity-80 p-4 rounded-lg md:col-span-3 shadow-lg">
            <h3 className="text-lg font-semibold">Salary Ranges by Role</h3>
            <p className="text-sm text-gray-300">
              Displaying minimum, median, and maximum salaries (in thousands)
            </p>
            <div className="mt-6 space-y-4">
              {Object.entries(insights.salaryRanges).map(([role, salaries]) => (
                <div key={role}>
                  <div className="flex justify-between items-center mb-1">
                    <span>{role}</span>
                    <span className="text-sm text-gray-300">
                      Min: {salaries.min}k • Median: {salaries.median}k • Max: {salaries.max}k
                    </span>
                  </div>
                  <div className="flex h-6 w-full bg-gray-600 rounded overflow-hidden">
                    <div
                      className="bg-blue-500"
                      style={{ width: `${(salaries.min / 180) * 100}%` }}
                      title={`Min: ${salaries.min}k`}
                    ></div>
                    <div
                      className="bg-blue-400"
                      style={{ width: `${((salaries.median - salaries.min) / 180) * 100}%` }}
                      title={`Median: ${salaries.median}k`}
                    ></div>
                    <div
                      className="bg-blue-300"
                      style={{ width: `${((salaries.max - salaries.median) / 180) * 100}%` }}
                      title={`Max: ${salaries.max}k`}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6 bg-gray-800 bg-opacity-80 p-4 rounded-lg shadow-lg">
          <h3 className="text-lg font-semibold mb-2">Ask Your Mentor</h3>
          <form onSubmit={handleChatSubmit} className="flex space-x-2">
            <input
              type="text"
              value={userQuery}
              onChange={(e) => setUserQuery(e.target.value)}
              placeholder="e.g., What’s the growth for AI? or Demand for DevOps?"
              className="flex-1 p-2 bg-gray-700 bg-opacity-80 rounded text-white outline-none"
            />
            <button
              type="submit"
              className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded text-white"
              disabled={isLoading}
            >
              {isLoading ? "Sending..." : "Ask"}
            </button>
          </form>
          <div className="mt-4 max-h-40 overflow-y-auto">
            {chatMessages.map((msg, index) => (
              <div
                key={index}
                className={`my-2 p-2 rounded ${
                  msg.sender === "user"
                    ? "bg-purple-600"
                    : "bg-gray-700 bg-opacity-80"
                }`}
              >
                {msg.text}
              </div>
            ))}
          </div>
        </div>

        <p className="text-sm text-gray-300 mt-4">
          Last updated: {insights.lastUpdated}
        </p>
      </div>
    </div>
  );
}
