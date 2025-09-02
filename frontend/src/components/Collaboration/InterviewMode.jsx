import React, { useState, useEffect } from 'react';
import { 
  Clock, 
  Play, 
  Pause, 
  Square, 
  Users, 
  Video, 
  Mic, 
  MicOff, 
  VideoOff,
  Eye,
  EyeOff,
  Monitor,
  FileText,
  CheckCircle,
  AlertCircle,
  Star,
  MessageSquare
} from 'lucide-react';
import { Editor } from '@monaco-editor/react';
import { useTheme } from '../context/ThemeContext';

const InterviewMode = ({ 
  sessionId, 
  userId, 
  userName, 
  role, // interviewer or candidate
  onEndInterview 
}) => {
  const { isDarkMode } = useTheme();
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [currentProblem, setCurrentProblem] = useState(null);
  const [code, setCode] = useState('');
  const [notes, setNotes] = useState('');
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isMicOn, setIsMicOn] = useState(false);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [showNotes, setShowNotes] = useState(role === 'interviewer');
  const [showProblemPanel, setShowProblemPanel] = useState(true);
  const [interviewPhase, setInterviewPhase] = useState('introduction'); // introduction, coding, discussion, feedback
  
  // Mock interview problems
  const interviewProblems = {
    easy: [
      {
        id: 1,
        title: "Two Sum",
        difficulty: "Easy",
        description: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
        examples: [
          {
            input: "nums = [2,7,11,15], target = 9",
            output: "[0,1]",
            explanation: "Because nums[0] + nums[1] == 9, we return [0, 1]."
          }
        ],
        constraints: [
          "2 <= nums.length <= 10^4",
          "-10^9 <= nums[i] <= 10^9",
          "-10^9 <= target <= 10^9"
        ],
        hints: [
          "A really brute force way would be to search for all possible pairs of numbers but that would be too slow.",
          "Try using a hash map to store the complement of each number."
        ]
      },
      {
        id: 2,
        title: "Valid Parentheses",
        difficulty: "Easy",
        description: "Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.",
        examples: [
          {
            input: "s = \"()\"",
            output: "true"
          },
          {
            input: "s = \"()[]{}\"",
            output: "true"
          },
          {
            input: "s = \"(]\"",
            output: "false"
          }
        ]
      }
    ],
    medium: [
      {
        id: 3,
        title: "Add Two Numbers",
        difficulty: "Medium",
        description: "You are given two non-empty linked lists representing two non-negative integers. The digits are stored in reverse order, and each of their nodes contains a single digit. Add the two numbers and return the sum as a linked list.",
        examples: [
          {
            input: "l1 = [2,4,3], l2 = [5,6,4]",
            output: "[7,0,8]",
            explanation: "342 + 465 = 807."
          }
        ]
      }
    ],
    hard: [
      {
        id: 4,
        title: "Median of Two Sorted Arrays",
        difficulty: "Hard",
        description: "Given two sorted arrays nums1 and nums2 of size m and n respectively, return the median of the two sorted arrays.",
        examples: [
          {
            input: "nums1 = [1,3], nums2 = [2]",
            output: "2.00000",
            explanation: "merged array = [1,2,3] and median is 2."
          }
        ]
      }
    ]
  };

  useEffect(() => {
    let interval;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setTimeElapsed(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  useEffect(() => {
    // Load first problem
    setCurrentProblem(interviewProblems.easy[0]);
    setCode(`// ${interviewProblems.easy[0].title}
// ${interviewProblems.easy[0].description}

function solution() {
    // Your code here
    
}

// Test cases
console.log(solution());`);
  }, []);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const startTimer = () => {
    setIsTimerRunning(true);
    setInterviewPhase('coding');
  };

  const pauseTimer = () => {
    setIsTimerRunning(false);
  };

  const resetTimer = () => {
    setTimeElapsed(0);
    setIsTimerRunning(false);
  };

  const selectProblem = (difficulty, index) => {
    const problem = interviewProblems[difficulty][index];
    setCurrentProblem(problem);
    setCode(`// ${problem.title}
// ${problem.description}

function solution() {
    // Your code here
    
}

// Test cases
console.log(solution());`);
  };

  const handleCodeChange = (value) => {
    setCode(value);
  };

  const executeCode = () => {
    // Mock code execution
    console.log('Executing code:', code);
  };

  const saveNotes = () => {
    console.log('Saving notes:', notes);
  };

  const submitFeedback = () => {
    const feedbackData = {
      sessionId,
      candidateId: role === 'interviewer' ? null : userId,
      rating,
      feedback,
      notes,
      timeElapsed,
      problemSolved: currentProblem?.id,
      code
    };
    console.log('Submitting feedback:', feedbackData);
    setInterviewPhase('feedback');
  };

  const phases = {
    introduction: { label: 'Introduction', color: 'blue' },
    coding: { label: 'Coding', color: 'green' },
    discussion: { label: 'Discussion', color: 'yellow' },
    feedback: { label: 'Feedback', color: 'purple' }
  };

  return (
    <div className={`h-screen flex flex-col ${isDarkMode ? 'bg-zinc-900' : 'bg-gray-50'}`}>
      {/* Interview Header */}
      <div className={`h-16 border-b flex items-center justify-between px-6 ${
        isDarkMode ? 'bg-zinc-900 border-gray-700' : 'bg-white border-gray-200'
      }`}>
        <div className="flex items-center space-x-6">
          {/* Timer */}
          <div className="flex items-center space-x-3">
            <div className={`text-2xl font-mono font-bold ${
              timeElapsed > 2700 ? 'text-red-500' : 
              timeElapsed > 1800 ? 'text-yellow-500' : 'text-green-500'
            }`}>
              {formatTime(timeElapsed)}
            </div>
            <div className="flex space-x-1">
              {!isTimerRunning ? (
                <button
                  onClick={startTimer}
                  className="p-2 bg-green-600 hover:bg-green-700 text-slate-300 rounded"
                  title="Start timer"
                >
                  <Play className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={pauseTimer}
                  className="p-2 bg-yellow-600 hover:bg-yellow-700 text-slate-300 rounded"
                  title="Pause timer"
                >
                  <Pause className="w-4 h-4" />
                </button>
              )}
              <button
                onClick={resetTimer}
                className="p-2 bg-gray-600 hover:bg-zinc-900 text-slate-300 rounded"
                title="Reset timer"
              >
                <Square className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Phase Indicator */}
          <div className="flex items-center space-x-2">
            <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Phase:</span>
            <div className={`px-3 py-1 rounded-full text-xs font-medium ${
              phases[interviewPhase].color === 'blue' ? 'bg-blue-100 text-blue-800' :
              phases[interviewPhase].color === 'green' ? 'bg-green-100 text-green-800' :
              phases[interviewPhase].color === 'yellow' ? 'bg-yellow-100 text-yellow-800' :
              'bg-purple-100 text-purple-800'
            }`}>
              {phases[interviewPhase].label}
            </div>
          </div>

          {/* Role Indicator */}
          <div className="flex items-center space-x-2">
            <Users className="w-4 h-4" />
            <span className={`text-sm font-medium ${
              role === 'interviewer' ? 'text-blue-600' : 'text-green-600'
            }`}>
              {role === 'interviewer' ? 'Interviewer' : 'Candidate'}
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {/* Media Controls */}
          <button
            onClick={() => setIsMicOn(!isMicOn)}
            className={`p-2 rounded ${
              isMicOn ? 'bg-green-600 text-slate-300' : 'bg-gray-300 text-gray-600'
            }`}
          >
            {isMicOn ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
          </button>

          <button
            onClick={() => setIsCameraOn(!isCameraOn)}
            className={`p-2 rounded ${
              isCameraOn ? 'bg-green-600 text-slate-300' : 'bg-gray-300 text-gray-600'
            }`}
          >
            {isCameraOn ? <Video className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
          </button>

          <button
            onClick={() => setIsRecording(!isRecording)}
            className={`p-2 rounded ${
              isRecording ? 'bg-red-600 text-slate-300' : 'bg-gray-300 text-gray-600'
            }`}
            title={isRecording ? 'Stop recording' : 'Start recording'}
          >
            <div className={`w-4 h-4 rounded-full ${isRecording ? 'bg-white' : 'bg-gray-600'}`} />
          </button>

          {/* Toggle Panels */}
          <button
            onClick={() => setShowProblemPanel(!showProblemPanel)}
            className={`p-2 rounded ${isDarkMode ? 'hover:bg-zinc-900' : 'hover:bg-gray-200'}`}
            title="Toggle problem panel"
          >
            <FileText className="w-4 h-4" />
          </button>

          {role === 'interviewer' && (
            <button
              onClick={() => setShowNotes(!showNotes)}
              className={`p-2 rounded ${isDarkMode ? 'hover:bg-zinc-900' : 'hover:bg-gray-200'}`}
              title="Toggle notes panel"
            >
              <MessageSquare className="w-4 h-4" />
            </button>
          )}

          <button
            onClick={onEndInterview}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-slate-300 rounded font-medium"
          >
            End Interview
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Problem Panel */}
        {showProblemPanel && (
          <div className={`w-96 border-r flex flex-col ${
            isDarkMode ? 'bg-zinc-900 border-gray-700' : 'bg-white border-gray-200'
          }`}>
            <div className="p-4 border-b border-gray-700">
              <h2 className={`text-lg font-bold ${isDarkMode ? 'text-slate-300' : 'text-gray-900'}`}>
                Interview Problems
              </h2>
              
              {role === 'interviewer' && (
                <div className="mt-3 space-y-2">
                  <div className="text-sm font-medium text-gray-400">Quick Select:</div>
                  <div className="flex flex-wrap gap-1">
                    {Object.entries(interviewProblems).map(([difficulty, problems]) => (
                      problems.map((problem, index) => (
                        <button
                          key={problem.id}
                          onClick={() => selectProblem(difficulty, index)}
                          className={`px-2 py-1 text-xs rounded ${
                            currentProblem?.id === problem.id
                              ? 'bg-blue-600 text-slate-300'
                              : difficulty === 'easy' ? 'bg-green-100 text-green-800' :
                                difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-red-100 text-red-800'
                          }`}
                        >
                          {problem.title}
                        </button>
                      ))
                    ))}
                  </div>
                </div>
              )}
            </div>

            {currentProblem && (
              <div className="flex-1 overflow-auto p-4">
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-slate-300' : 'text-gray-900'}`}>
                        {currentProblem.title}
                      </h3>
                      <span className={`px-2 py-1 text-xs rounded ${
                        currentProblem.difficulty === 'Easy' ? 'bg-green-100 text-green-800' :
                        currentProblem.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {currentProblem.difficulty}
                      </span>
                    </div>
                    <p className={`text-sm leading-relaxed ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      {currentProblem.description}
                    </p>
                  </div>

                  {currentProblem.examples && (
                    <div>
                      <h4 className={`font-medium mb-2 ${isDarkMode ? 'text-slate-300' : 'text-gray-900'}`}>
                        Examples:
                      </h4>
                      {currentProblem.examples.map((example, index) => (
                        <div key={index} className={`p-3 rounded text-sm ${
                          isDarkMode ? 'bg-zinc-900' : 'bg-gray-100'
                        }`}>
                          <div><strong>Input:</strong> {example.input}</div>
                          <div><strong>Output:</strong> {example.output}</div>
                          {example.explanation && (
                            <div><strong>Explanation:</strong> {example.explanation}</div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {currentProblem.constraints && (
                    <div>
                      <h4 className={`font-medium mb-2 ${isDarkMode ? 'text-slate-300' : 'text-gray-900'}`}>
                        Constraints:
                      </h4>
                      <ul className={`text-sm space-y-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        {currentProblem.constraints.map((constraint, index) => (
                          <li key={index}>• {constraint}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {currentProblem.hints && role === 'interviewer' && (
                    <div>
                      <h4 className={`font-medium mb-2 ${isDarkMode ? 'text-slate-300' : 'text-gray-900'}`}>
                        Hints (Interviewer Only):
                      </h4>
                      <ul className={`text-sm space-y-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        {currentProblem.hints.map((hint, index) => (
                          <li key={index}>💡 {hint}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Code Editor */}
        <div className="flex-1 flex flex-col">
          <div className={`h-10 border-b flex items-center justify-between px-4 ${
            isDarkMode ? 'bg-zinc-900 border-gray-700' : 'bg-gray-50 border-gray-200'
          }`}>
            <span className={`text-sm font-medium ${isDarkMode ? 'text-slate-300' : 'text-gray-900'}`}>
              Code Editor
            </span>
            <div className="flex space-x-2">
              <button
                onClick={executeCode}
                className="px-3 py-1 bg-green-600 hover:bg-green-700 text-slate-300 rounded text-sm"
              >
                Run Code
              </button>
              {role === 'interviewer' && interviewPhase === 'discussion' && (
                <button
                  onClick={() => setInterviewPhase('feedback')}
                  className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-slate-300 rounded text-sm"
                >
                  Start Feedback
                </button>
              )}
            </div>
          </div>

          <div className="flex-1">
            <Editor
              height="100%"
              language="javascript"
              value={code}
              onChange={handleCodeChange}
              theme={isDarkMode ? 'vs-dark' : 'light'}
              options={{
                fontSize: 14,
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                wordWrap: 'on',
                automaticLayout: true,
                readOnly: role === 'interviewer' && interviewPhase === 'feedback'
              }}
            />
          </div>
        </div>

        {/* Notes/Feedback Panel */}
        {showNotes && role === 'interviewer' && (
          <div className={`w-80 border-l flex flex-col ${
            isDarkMode ? 'bg-zinc-900 border-gray-700' : 'bg-white border-gray-200'
          }`}>
            <div className="p-4 border-b border-gray-700">
              <h3 className={`font-medium ${isDarkMode ? 'text-slate-300' : 'text-gray-900'}`}>
                Interview Notes
              </h3>
            </div>

            <div className="flex-1 p-4 space-y-4">
              {/* Quick Assessment */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Overall Rating
                </label>
                <div className="flex space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setRating(star)}
                      className={`${
                        star <= rating ? 'text-yellow-500' : 'text-gray-300'
                      }`}
                    >
                      <Star className="w-5 h-5" fill={star <= rating ? 'currentColor' : 'none'} />
                    </button>
                  ))}
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Notes
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Observations about the candidate's approach, communication, problem-solving skills..."
                  className={`w-full h-32 px-3 py-2 text-sm rounded border ${
                    isDarkMode 
                      ? 'bg-zinc-900 border-gray-600 text-slate-300 placeholder-gray-400' 
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                  } resize-none`}
                />
              </div>

              {/* Feedback */}
              {interviewPhase === 'feedback' && (
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Feedback for Candidate
                  </label>
                  <textarea
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    placeholder="Constructive feedback to share with the candidate..."
                    className={`w-full h-32 px-3 py-2 text-sm rounded border ${
                      isDarkMode 
                        ? 'bg-zinc-900 border-gray-600 text-slate-300 placeholder-gray-400' 
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                    } resize-none`}
                  />
                </div>
              )}

              <div className="space-y-2">
                <button
                  onClick={saveNotes}
                  className="w-full px-3 py-2 bg-blue-600 hover:bg-blue-700 text-slate-300 rounded text-sm"
                >
                  Save Notes
                </button>
                
                {interviewPhase === 'feedback' && (
                  <button
                    onClick={submitFeedback}
                    className="w-full px-3 py-2 bg-green-600 hover:bg-green-700 text-slate-300 rounded text-sm"
                  >
                    Submit Feedback
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Phase Controls */}
      {role === 'interviewer' && (
        <div className={`h-12 border-t flex items-center justify-center space-x-4 ${
          isDarkMode ? 'bg-zinc-900 border-gray-700' : 'bg-gray-50 border-gray-200'
        }`}>
          {Object.entries(phases).map(([phase, config]) => (
            <button
              key={phase}
              onClick={() => setInterviewPhase(phase)}
              className={`px-4 py-1 rounded text-sm font-medium ${
                interviewPhase === phase
                  ? `bg-${config.color}-600 text-slate-300`
                  : isDarkMode ? 'text-gray-400 hover:text-slate-300' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {config.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default InterviewMode;
