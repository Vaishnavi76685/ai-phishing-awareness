import React, { useState } from 'react';
import { Award, CheckCircle2, XCircle, HelpCircle, ArrowRight, RotateCcw, ShieldCheck, Sparkles, Trophy } from 'lucide-react';
import { QUIZ_QUESTIONS } from '../data/phishingData';

export const AwarenessQuiz: React.FC = () => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);

  const q = QUIZ_QUESTIONS[currentIdx];
  const isAnswered = selectedAnswers[q.id] !== undefined;

  const handleOptionSelect = (optionIdx: number) => {
    if (isSubmitted) return;
    setSelectedAnswers(prev => ({ ...prev, [q.id]: optionIdx }));
    setShowExplanation(true);
  };

  const calculateScore = () => {
    let score = 0;
    QUIZ_QUESTIONS.forEach(item => {
      if (selectedAnswers[item.id] === item.correctAnswer) {
        score += 1;
      }
    });
    return score;
  };

  const resetQuiz = () => {
    setCurrentIdx(0);
    setSelectedAnswers({});
    setIsSubmitted(false);
    setShowExplanation(false);
  };

  const score = calculateScore();
  const percentage = Math.round((score / QUIZ_QUESTIONS.length) * 100);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Quiz Header */}
      <div className="space-y-1">
        <h1 className="text-3xl font-bold text-slate-900">Phishing Awareness Quiz</h1>
        <p className="text-slate-500 text-sm">
          Test your defensive knowledge against email fraud, MFA fatigue, typosquatting domains, vishing, and CEO impersonation.
        </p>
      </div>

      {!isSubmitted ? (
        <div className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 shadow-sm space-y-6">
          {/* Progress Bar & Header */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider">
              <span>Question {currentIdx + 1} of {QUIZ_QUESTIONS.length}</span>
              <span className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded text-[11px] font-bold">
                {q.category} • {q.difficulty}
              </span>
            </div>
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <div 
                className="bg-blue-600 h-full transition-all duration-300"
                style={{ width: `${((currentIdx + 1) / QUIZ_QUESTIONS.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Scenario Box */}
          <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-1.5">
            <div className="text-xs font-bold text-blue-600 uppercase tracking-wider flex items-center space-x-1.5">
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Real-World Scenario Focus</span>
            </div>
            <p className="text-xs font-mono text-slate-700">{q.scenario}</p>
          </div>

          {/* Question Title */}
          <h2 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
            {q.question}
          </h2>

          {/* Options Grid */}
          <div className="grid grid-cols-1 gap-3 pt-2">
            {q.options.map((option, optionIdx) => {
              const isSelected = selectedAnswers[q.id] === optionIdx;
              const isCorrect = optionIdx === q.correctAnswer;
              
              let btnStyle = 'border-slate-200 bg-slate-50 hover:border-slate-300 text-slate-800';
              if (isSelected) {
                btnStyle = isCorrect
                  ? 'border-emerald-500 bg-emerald-50 text-emerald-800 font-bold'
                  : 'border-rose-500 bg-rose-50 text-rose-800 font-bold';
              } else if (showExplanation && isCorrect) {
                btnStyle = 'border-emerald-500 bg-emerald-50 text-emerald-800 font-bold';
              }

              return (
                <button
                  key={optionIdx}
                  onClick={() => handleOptionSelect(optionIdx)}
                  className={`p-4 rounded-lg border text-left text-xs transition-all flex items-center justify-between cursor-pointer ${btnStyle}`}
                >
                  <span className="leading-relaxed">{option}</span>
                  {isSelected && (
                    isCorrect ? <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 ml-2" /> : <XCircle className="w-4 h-4 text-rose-600 shrink-0 ml-2" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Real-time Explanation Feedback */}
          {showExplanation && (
            <div className="p-4 bg-slate-900 text-white rounded-lg text-xs space-y-1 animate-fade-in">
              <div className="font-bold text-blue-400 uppercase tracking-wider text-[11px] flex items-center space-x-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Educational Explanation</span>
              </div>
              <p className="text-slate-300 leading-relaxed">{q.explanation}</p>
            </div>
          )}

          {/* Navigation Control Bar */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <button
              disabled={currentIdx === 0}
              onClick={() => {
                setCurrentIdx(prev => prev - 1);
                setShowExplanation(selectedAnswers[QUIZ_QUESTIONS[currentIdx - 1].id] !== undefined);
              }}
              className="px-4 py-2 bg-slate-100 text-slate-700 hover:bg-slate-200 text-xs font-bold uppercase tracking-wider rounded-lg disabled:opacity-40 cursor-pointer"
            >
              Previous
            </button>

            {currentIdx < QUIZ_QUESTIONS.length - 1 ? (
              <button
                onClick={() => {
                  setCurrentIdx(prev => prev + 1);
                  setShowExplanation(selectedAnswers[QUIZ_QUESTIONS[currentIdx + 1].id] !== undefined);
                }}
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold uppercase tracking-wider rounded-lg transition-colors cursor-pointer flex items-center space-x-1"
              >
                <span>Next Question</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={() => setIsSubmitted(true)}
                className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold uppercase tracking-wider rounded-lg shadow-sm transition-all cursor-pointer flex items-center space-x-1"
              >
                <span>Submit Quiz & View Score</span>
                <Trophy className="w-4 h-4 ml-1" />
              </button>
            )}
          </div>
        </div>
      ) : (
        /* Quiz Completion & Certificate Card */
        <div className="bg-white border border-slate-200 rounded-xl p-8 shadow-sm text-center space-y-6">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center mx-auto">
            <Trophy className="w-8 h-8" />
          </div>

          <div className="space-y-1">
            <h2 className="text-2xl font-bold text-slate-900">Quiz Completed!</h2>
            <p className="text-xs text-slate-500">Your score has been registered in the system awareness database.</p>
          </div>

          <div className="max-w-md mx-auto p-6 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
            <div className="text-4xl font-extrabold text-slate-900">{score} / {QUIZ_QUESTIONS.length}</div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Score: {percentage}%</div>
            <div className="inline-block px-3 py-1 bg-emerald-100 text-emerald-800 rounded-md text-xs font-bold uppercase tracking-wider">
              Badge: {percentage >= 90 ? 'Cyber Security Expert' : percentage >= 70 ? 'Awareness Practitioner' : 'Needs Review'}
            </div>
          </div>

          <button
            onClick={resetQuiz}
            className="px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold uppercase tracking-wider rounded-lg transition-colors flex items-center justify-center space-x-2 mx-auto cursor-pointer shadow-sm"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Retake Awareness Quiz</span>
          </button>
        </div>
      )}
    </div>
  );
};
