
import React, { useState } from 'react';
import mcqs from './project_management_mcqs.json';


const ProjectManagement = () => {
  const [selectedOptions, setSelectedOptions] = useState({});
  const [page, setPage] = useState(1);
  const QUESTIONS_PER_PAGE = 20;

  const totalPages = Math.ceil(mcqs.length / QUESTIONS_PER_PAGE);
  const startIdx = (page - 1) * QUESTIONS_PER_PAGE;
  const endIdx = startIdx + QUESTIONS_PER_PAGE;
  const currentQuestions = mcqs.slice(startIdx, endIdx);

  const handleOptionChange = (questionId, option) => {
    setSelectedOptions((prev) => ({ ...prev, [questionId]: option }));
  };

  return (
    <section className="w-full min-h-screen bg-zinc-900 flex flex-col items-center justify-start py-8 sm:py-12 lg:py-16 px-4">
      <div className="bg-zinc-800 border border-zinc-700 rounded-2xl shadow-2xl p-6 sm:p-8 lg:p-10 max-w-4xl w-full mb-8 text-center">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 text-slate-100 tracking-wide">
          Project Management MCQs
        </h1>
        <p className="text-base sm:text-lg lg:text-xl text-slate-300 mb-8 font-medium leading-relaxed">
          Test your knowledge with the latest project management multiple choice questions!
        </p>
      </div>
      
      <div className="w-full max-w-6xl mx-auto">
        <div className="space-y-6">
          {currentQuestions.map((mcq, idx) => (
            <div
              key={mcq.id}
              className="bg-zinc-800 border border-zinc-700 rounded-xl p-4 sm:p-6 shadow-lg hover:shadow-xl transition-all duration-200 hover:border-zinc-600"
            >
              <div className="font-semibold mb-4 text-lg sm:text-xl text-slate-100">
                Q{startIdx + idx + 1}. {mcq.question}
              </div>
              <div className="space-y-3">
                {mcq.options.map((option, oidx) => {
                  const isCorrect = option === mcq.correct_answer;
                  const isSelected = selectedOptions[mcq.id] === option;
                  return (
                    <label
                      key={oidx}
                      className={`flex items-center p-3 sm:p-4 rounded-lg border cursor-pointer transition-all duration-200 ${
                        isCorrect
                          ? 'bg-emerald-900/30 border-emerald-600 text-emerald-300 shadow-md'
                          : 'bg-zinc-700 border-zinc-600 text-slate-300 hover:bg-zinc-600 hover:border-zinc-500'
                      } ${
                        isSelected && !isCorrect
                          ? 'bg-zinc-600 border-zinc-500'
                          : ''
                      }`}
                    >
                      <input
                        type="radio"
                        name={`question-${mcq.id}`}
                        value={option}
                        checked={selectedOptions[mcq.id] === option}
                        onChange={() => handleOptionChange(mcq.id, option)}
                        className="mr-3 w-4 h-4 text-emerald-600 bg-zinc-700 border-zinc-500 focus:ring-emerald-500 focus:ring-2"
                      />
                      <span className={`flex-1 ${isCorrect ? 'font-semibold' : 'font-normal'}`}>
                        {option}
                      </span>
                      {isCorrect && (
                        <span className="ml-3 text-sm font-medium text-emerald-400">
                          ✓
                        </span>
                      )}
                    </label>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Pagination Controls */}
        <div className="flex justify-center items-center gap-4 mt-8 flex-wrap">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className={`px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold text-sm sm:text-base transition-all duration-200 min-w-20 sm:min-w-24 ${
              page === 1
                ? 'bg-zinc-700 text-zinc-500 cursor-not-allowed border border-zinc-600'
                : 'bg-emerald-600 text-white hover:bg-emerald-700 border border-emerald-600 hover:border-emerald-700 shadow-md hover:shadow-lg'
            }`}
          >
            Previous
          </button>
          
          <span className="font-medium text-base sm:text-lg text-slate-300 px-2">
            Page {page} of {totalPages}
          </span>
          
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className={`px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold text-sm sm:text-base transition-all duration-200 min-w-20 sm:min-w-24 ${
              page === totalPages
                ? 'bg-zinc-700 text-zinc-500 cursor-not-allowed border border-zinc-600'
                : 'bg-emerald-600 text-white hover:bg-emerald-700 border border-emerald-600 hover:border-emerald-700 shadow-md hover:shadow-lg'
            }`}
          >
            Next
          </button>
        </div>
      </div>
    </section>
  );
};

export default ProjectManagement;