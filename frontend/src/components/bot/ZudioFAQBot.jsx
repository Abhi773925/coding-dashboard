import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";

const ZudioFAQBot = () => {
  const [messages, setMessages] = useState([
    { id: 1, text: "👋 Hey there! How can I help you today?", isBot: true },
  ]);
  const [inputText, setInputText] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [suggestedQuestions, setSuggestedQuestions] = useState([]);
  const [minimized, setMinimized] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Greeting messages
  const greetings = [
    "Hey! How can I assist you today? 😊",
    "Hello! Need any help? 👋",
    "Hi there! I'm here to answer your questions. 🙌",
    "Good to see you! How can I help? 😃",
  ];

  // FAQ Data with categories
  const faqData = [
    { 
      keywords: ["zudio", "what", "about"], 
      question: "What is Zudio?", 
      answer: "Zudio is a task management platform for teams to collaborate and complete work efficiently.",
      category: "general"
    },
    { 
      keywords: ["payment", "method", "pay"], 
      question: "What payment methods does Zudio accept?", 
      answer: "We accept credit cards, PayPal, and Google Pay.",
      category: "billing"
    },
    { 
      keywords: ["trial", "free"], 
      question: "Is there a free trial?", 
      answer: "Yes! We offer a 14-day free trial. No credit card required!",
      category: "billing"
    },
    { 
      keywords: ["contact", "support", "help"], 
      question: "How do I contact customer support?", 
      answer: "You can reach us at support@zudio.com or via live chat.",
      category: "support"
    },
    { 
      keywords: ["team", "collaborate", "collaboration"], 
      question: "Can I collaborate with my team?", 
      answer: "Yes! You can invite team members to your workspace and assign tasks.",
      category: "features"
    },
    { 
      keywords: ["refund", "policy", "money back"], 
      question: "Does Zudio offer refunds?", 
      answer: "Yes, we offer a 7-day refund policy if you're not satisfied.",
      category: "billing"
    },
    { 
      keywords: ["assign", "task", "allocation"], 
      question: "How do I assign a task?", 
      answer: "While creating a task, select 'Assign to' and choose a team member.",
      category: "features"
    },
    { 
      keywords: ["forgot", "password", "reset"], 
      question: "I forgot my password, what should I do?", 
      answer: "Click 'Forgot Password' on the login page and follow the reset steps.",
      category: "account"
    },
    { 
      keywords: ["export", "data"], 
      question: "Can I export my data from Zudio?", 
      answer: "Yes, you can export your data in CSV or JSON format from the Settings menu.",
      category: "features"
    },
    { 
      keywords: ["notification", "email", "alert"], 
      question: "How do I adjust notification settings?", 
      answer: "Go to Settings > Notifications to customize your email and in-app notification preferences.",
      category: "account"
    },
    { 
      keywords: ["integration", "connect", "apps"], 
      question: "Does Zudio integrate with other apps?", 
      answer: "Yes! Zudio integrates with Slack, Google Drive, Dropbox, and many more apps.",
      category: "features"
    },
  ];

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && !minimized) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen, minimized]);

  // Update unread count
  useEffect(() => {
    if (!isOpen || minimized) {
      if (messages.length > 0 && messages[messages.length - 1].isBot) {
        setUnreadCount(prev => prev + 1);
      }
    } else {
      setUnreadCount(0);
    }
  }, [messages, isOpen, minimized]);

  // Get Bot Response with improved matching
  const getBotResponse = (userQuery) => {
    const query = userQuery.toLowerCase();

    // Check for greetings
    const greetingKeywords = ["hello", "hi", "hey", "good morning", "good evening"];
    if (greetingKeywords.some((word) => query.includes(word))) {
      // Show suggested questions when greeting
      setSuggestedQuestions([
        "What is Zudio?",
        "Is there a free trial?",
        "How do I assign a task?"
      ]);
      return greetings[Math.floor(Math.random() * greetings.length)];
    }

    // Enhanced matching with scoring
    let bestMatch = null;
    let highestScore = 0;

    for (const faq of faqData) {
      // Calculate a match score based on keyword presence
      const matchScore = faq.keywords.reduce((score, keyword) => {
        return query.includes(keyword) ? score + 1 : score;
      }, 0);

      // Also check if query contains the question itself
      const questionMatch = faq.question.toLowerCase().includes(query) ? 2 : 0;
      
      const totalScore = matchScore + questionMatch;

      if (totalScore > highestScore) {
        highestScore = totalScore;
        bestMatch = faq;
      }
    }

    // Generate related questions based on category
    if (bestMatch && highestScore > 0) {
      const relatedFaqs = faqData
        .filter(faq => faq.category === bestMatch.category && faq !== bestMatch)
        .slice(0, 3);
      
      setSuggestedQuestions(relatedFaqs.map(faq => faq.question));
      return bestMatch.answer;
    }

    // No match found
    setSuggestedQuestions([
      "What is Zudio?",
      "How do I contact support?",
      "Does Zudio offer a free trial?"
    ]);
    return "🤔 I'm not sure about that. Try rephrasing your question or contact support at support@zudio.com.";
  };

  // Handle Message Send
  const handleSendMessage = () => {
    if (!inputText.trim()) return;

    const userMessage = { id: messages.length + 1, text: inputText, isBot: false };
    setMessages([...messages, userMessage]);
    setInputText("");
    setIsTyping(true);
    setSuggestedQuestions([]);

    setTimeout(() => {
      const botResponse = { id: messages.length + 2, text: getBotResponse(inputText), isBot: true };
      setMessages((prevMessages) => [...prevMessages, botResponse]);
      setIsTyping(false);
    }, Math.random() * 800 + 400); // Randomized typing time for realism
  };

  // Handle suggested question click
  const handleSuggestedQuestion = (question) => {
    setInputText(question);
    setTimeout(() => {
      handleSendMessage();
    }, 100);
  };

  // Toggle chat window
  const toggleChat = () => {
    if (!isOpen) {
      setIsOpen(true);
      setMinimized(false);
      setUnreadCount(0);
    } else {
      setIsOpen(false);
    }
  };

  // Minimize chat window
  const minimizeChat = () => {
    setMinimized(true);
  };

  // Restore chat window
  const restoreChat = () => {
    setMinimized(false);
    setUnreadCount(0);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Floating Chat Button */}
      <button
        onClick={toggleChat}
        className="bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-transform transform hover:scale-110 relative"
      >
        {isOpen ? "✖" : "💬"}
        
        {/* Unread message badge */}
        {unreadCount > 0 && !isOpen && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div 
          className={`fixed right-4 bg-[#121212] shadow-xl rounded-lg border border-gray-800 overflow-hidden transition-all duration-300 ${
            minimized ? 'h-12 bottom-16 w-64' : 'h-96 bottom-16 w-80'
          }`}
        >
          {/* Header */}
          <div className="bg-[#1a1a1a] text-white p-3 flex justify-between items-center border-b border-gray-800">
            <div className="flex items-center">
              <span className="h-2 w-2 bg-green-500 rounded-full mr-2"></span>
              <span className="font-semibold">Zudio Support</span>
            </div>
            <div className="flex items-center space-x-2">
              {minimized ? (
                <button onClick={restoreChat} className="text-gray-400 hover:text-white">
                  ↗️
                </button>
              ) : (
                <button onClick={minimizeChat} className="text-gray-400 hover:text-white">
                  ↙️
                </button>
              )}
              <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white">
                ✖
              </button>
            </div>
          </div>

          {/* Chat Content */}
          {!minimized && (
            <>
              {/* Chat Messages */}
              <div className="h-64 p-3 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`mb-3 max-w-[80%] ${
                      msg.isBot ? "mr-auto" : "ml-auto"
                    }`}
                  >
                    <div
                      className={`p-3 rounded-lg text-sm ${
                        msg.isBot 
                          ? "bg-[#1E1E1E] text-gray-100 rounded-bl-none" 
                          : "bg-blue-600 text-white rounded-br-none"
                      }`}
                    >
                      {msg.text}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {msg.isBot ? "Zudio bot • just now" : "You • just now"}
                    </div>
                  </div>
                ))}

                {/* Typing Indicator */}
                {isTyping && (
                  <div className="mb-3 max-w-[80%] mr-auto">
                    <div className="p-3 rounded-lg bg-[#1E1E1E] text-gray-300 text-sm rounded-bl-none">
                      <div className="flex space-x-1">
                        <div className="h-2 w-2 bg-gray-500 rounded-full animate-bounce delay-0"></div>
                        <div className="h-2 w-2 bg-gray-500 rounded-full animate-bounce delay-150"></div>
                        <div className="h-2 w-2 bg-gray-500 rounded-full animate-bounce delay-300"></div>
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Suggested Questions */}
              {suggestedQuestions.length > 0 && !isTyping && (
                <div className="px-3 py-2 border-t border-gray-800 bg-[#161616]">
                  <div className="text-xs text-gray-400 mb-2">Suggested questions:</div>
                  <div className="flex flex-wrap gap-2">
                    {suggestedQuestions.map((question, index) => (
                      <button
                        key={index}
                        onClick={() => handleSuggestedQuestion(question)}
                        className="bg-[#1E1E1E] text-gray-300 text-xs px-3 py-1 rounded-full hover:bg-gray-700 transition-colors"
                      >
                        {question}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Input Box */}
              <div className="p-3 border-t border-gray-800 flex bg-[#1a1a1a]">
                <input
                  ref={inputRef}
                  type="text"
                  className="flex-1 p-2 bg-[#242424] text-white border border-gray-700 rounded-l-lg focus:outline-none focus:border-blue-500 placeholder-gray-500"
                  placeholder="Ask me anything..."
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSendMessage();
                  }}
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!inputText.trim()}
                  className={`px-4 rounded-r-lg ${
                    inputText.trim() 
                      ? "bg-blue-600 text-white hover:bg-blue-700" 
                      : "bg-gray-700 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  ➤
                </button>
              </div>
            </>
          )}

          {/* Minimized View */}
          {minimized && (
            <div className="flex items-center justify-between px-3 h-full">
              <div className="flex items-center">
                <span className="h-2 w-2 bg-green-500 rounded-full mr-2"></span>
                <span className="text-gray-300 text-sm">Zudio Support</span>
              </div>
              {unreadCount > 0 && (
                <span className="bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ZudioFAQBot;