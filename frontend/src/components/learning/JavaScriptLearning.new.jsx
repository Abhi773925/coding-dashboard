import React, { useState } from 'react';
import syllabus from '../../data/javascriptSyllabus.json';
import CodeCompiler from '../Compiler/CodeCompiler';

const JavaScriptLearning = () => {
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const handleTopicSelect = (topic) => {
    setSelectedTopic(topic);
    setSelectedQuestion(null);
  };

  const handleQuestionSelect = (question) => {
    setSelectedQuestion(question);
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-[#0f172b] text-gray-100' : 'bg-gradient-to-br from-indigo-50 to-blue-100 text-gray-800'}`}>
      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-6 h-[calc(100vh-4rem)]">
          {/* Syllabus Navigation - Fixed width, scrollable */}
          <div className="w-1/4 bg-white/80 dark:bg-zinc-900/80 rounded-lg backdrop-blur-sm flex flex-col">
            <h2 className="text-2xl font-bold p-4 bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent sticky top-0 bg-white/80 dark:bg-zinc-900/80 border-b border-indigo-100 dark:border-indigo-900">
              JavaScript Syllabus
            </h2>
            
            <div className="overflow-y-auto flex-1 p-4">
              {syllabus.sections.map((section) => (
                <div key={section.id} className="mb-6">
                  <h3 className="text-lg font-semibold text-indigo-600 dark:text-indigo-400 mb-2">
                    {section.title}
                  </h3>
                  
                  <div className="space-y-1">
                    {section.topics.map((topic) => (
                      <button
                        key={topic.id}
                        onClick={() => handleTopicSelect(topic)}
                        className={`text-left w-full p-2 rounded-md transition-colors ${
                          selectedTopic?.id === topic.id
                            ? 'bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300'
                            : 'hover:bg-indigo-50 dark:hover:bg-indigo-900/30'
                        }`}
                      >
                        {topic.name}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Main Content Area - Flex layout for content and compiler */}
          <div className="flex-1 flex gap-6">
            {/* Topic Content - Scrollable */}
            <div className="w-1/2 bg-white/80 dark:bg-zinc-900/80 rounded-lg backdrop-blur-sm flex flex-col">
              {selectedTopic ? (
                <>
                  <h2 className="text-2xl font-bold p-4 bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent sticky top-0 bg-white/80 dark:bg-zinc-900/80 border-b border-indigo-100 dark:border-indigo-900">
                    {selectedTopic.name}
                  </h2>
                  <div className="overflow-y-auto flex-1 p-4">
                    {/* Subtopics */}
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold mb-2 text-indigo-600 dark:text-indigo-400">
                        Topics Covered
                      </h3>
                      <ul className="list-disc pl-5 space-y-1">
                        {selectedTopic.subtopics.map((subtopic, index) => (
                          <li key={index} className="text-gray-700 dark:text-gray-300">
                            {subtopic}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Practice Questions */}
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold mb-4 text-indigo-600 dark:text-indigo-400">
                        Practice Questions
                      </h3>
                      <div className="space-y-4">
                        {selectedTopic.practice.map((question) => (
                          <div
                            key={question.id}
                            className={`border border-indigo-100 dark:border-indigo-900 rounded-lg p-4 transition-colors ${
                              selectedQuestion?.id === question.id 
                              ? 'ring-2 ring-indigo-500' 
                              : 'hover:bg-indigo-50/50 dark:hover:bg-indigo-900/30'
                            }`}
                          >
                            <div className="flex justify-between items-start mb-2">
                              <h4 className="text-lg font-medium text-indigo-700 dark:text-indigo-300">
                                {question.title}
                              </h4>
                              <span className={`px-2 py-1 rounded text-xs ${
                                question.difficulty === 'easy'
                                  ? 'bg-green-100 text-green-700'
                                  : question.difficulty === 'medium'
                                  ? 'bg-yellow-100 text-yellow-700'
                                  : 'bg-red-100 text-red-700'
                              }`}>
                                {question.difficulty}
                              </span>
                            </div>
                            <p className="text-gray-700 dark:text-gray-300 mb-4">
                              {question.question}
                            </p>
                            <button
                              onClick={() => handleQuestionSelect(question)}
                              className={`px-4 py-2 rounded-md transition-colors ${
                                selectedQuestion?.id === question.id
                                ? 'bg-indigo-700 text-slate-300'
                                : 'bg-indigo-600 text-slate-300 hover:bg-indigo-700'
                              }`}
                            >
                              {selectedQuestion?.id === question.id ? 'Currently Selected' : 'Practice Now'}
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Challenge Question */}
                    <div>
                      <h3 className="text-lg font-semibold mb-4 text-indigo-600 dark:text-indigo-400">
                        Challenge Question
                      </h3>
                      <div className={`border border-indigo-100 dark:border-indigo-900 rounded-lg p-4 transition-colors ${
                        selectedQuestion?.id === selectedTopic.miscQuestion.id 
                        ? 'ring-2 ring-indigo-500' 
                        : 'hover:bg-indigo-50/50 dark:hover:bg-indigo-900/30'
                      }`}>
                        <h4 className="text-lg font-medium text-indigo-700 dark:text-indigo-300 mb-2">
                          {selectedTopic.miscQuestion.title}
                        </h4>
                        <p className="text-gray-700 dark:text-gray-300 mb-4">
                          {selectedTopic.miscQuestion.question}
                        </p>
                        <button
                          onClick={() => handleQuestionSelect(selectedTopic.miscQuestion)}
                          className={`px-4 py-2 rounded-md transition-colors ${
                            selectedQuestion?.id === selectedTopic.miscQuestion.id
                            ? 'bg-indigo-700 text-slate-300'
                            : 'bg-indigo-600 text-slate-300 hover:bg-indigo-700'
                          }`}
                        >
                          {selectedQuestion?.id === selectedTopic.miscQuestion.id ? 'Currently Selected' : 'Try Challenge'}
                        </button>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <h3 className="text-xl text-gray-600 dark:text-gray-400">
                    Select a topic to start learning
                  </h3>
                </div>
              )}
            </div>

            {/* Code Compiler - Fixed height */}
            <div className="w-1/2 bg-white/80 dark:bg-zinc-900/80 rounded-lg backdrop-blur-sm flex flex-col">
              {selectedQuestion ? (
                <>
                  <div className="p-4 border-b border-indigo-100 dark:border-indigo-900">
                    <h3 className="text-lg font-semibold text-indigo-600 dark:text-indigo-400">
                      {selectedQuestion.title}
                    </h3>
                  </div>
                  <div className="flex-1">
                    <CodeCompiler 
                      initialCode={selectedQuestion.starterCode || '// Write your code here'} 
                      language="javascript"
                    />
                  </div>
                </>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p className="text-gray-500 dark:text-gray-400">
                    Select a question to start coding
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JavaScriptLearning;
