import React, { useState, useMemo } from 'react';
import { quizData } from '../data/questions';

const shuffleArray = (array) => [...array].sort(() => Math.random() - 0.5);

function Quiz() {
  const [gameId, setGameId] = useState(1);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [quizFinished, setQuizFinished] = useState(false);

  const shuffledQuestions = useMemo(() => shuffleArray(quizData).slice(0, 10), [gameId]);

  const handleAnswerClick = (answer) => {
    if (isAnswered) return;

    setIsAnswered(true);
    setSelectedAnswer(answer);

    if (answer === shuffledQuestions[currentQuestionIndex].correctAnswer) {
      setScore((prevScore) => prevScore + 1);
    }

    setTimeout(() => {
      if (currentQuestionIndex < shuffledQuestions.length - 1) {
        setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
        setIsAnswered(false);
        setSelectedAnswer(null);
      } else {
        setQuizFinished(true);
      }
    }, 1500);
  };

  const handleRestartQuiz = () => {
    setGameId(prevId => prevId + 1);
    setQuizFinished(false);
    setCurrentQuestionIndex(0);
    setScore(0);
    setIsAnswered(false);
    setSelectedAnswer(null);
  };

  const getAnswerClassName = (answer) => {
    const baseClasses = "w-full text-left p-4 rounded-lg border-2 transition-all duration-200 disabled:cursor-not-allowed font-medium";
    
    if (!isAnswered) {
      return `${baseClasses} bg-gray-100 border-gray-300 hover:bg-gray-200 hover:border-gray-400 hover:-translate-y-0.5`;
    }
    
    const isCorrect = answer === shuffledQuestions[currentQuestionIndex].correctAnswer;
    const isSelected = answer === selectedAnswer;

    if (isCorrect) {
      return `${baseClasses} bg-green-100 border-green-500 text-green-800 font-bold`;
    }
    if (isSelected && !isCorrect) {
      return `${baseClasses} bg-red-100 border-red-500 text-red-800 font-bold`;
    }
    
    return `${baseClasses} bg-gray-100 border-gray-300 opacity-60`;
  };

  if (quizFinished) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 w-full max-w-2xl text-center">
        <div className="flex flex-col items-center justify-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-blue-600">Quiz Completed!</h2>
          <p className="text-base sm:text-lg my-4 text-gray-700">Your final score is: <span className="font-bold">{score}</span> out of {shuffledQuestions.length}</p>
          <h3 className="text-lg sm:text-xl mb-8 font-semibold text-gray-800">
            {score > 7 ? 'Great job!' : score > 4 ? 'Nice work!' : 'You did it!'}
          </h3>
          <button 
            onClick={handleRestartQuiz}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          >
            Play Again
          </button>
        </div>
      </div>
    );
  }

  const currentQuestion = shuffledQuestions[currentQuestionIndex];

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 w-full max-w-2xl">
      <div className="text-lg font-bold text-gray-600 text-right mb-4">Score: {score}</div>
      <div className="text-center mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800">{currentQuestion.title}</h2>
        <p className="text-sm text-gray-500 mt-1">Question {currentQuestionIndex + 1} of {shuffledQuestions.length}</p>
      </div>
      <div className="my-8">
        <p className="text-xl sm:text-2xl text-center text-gray-900 leading-relaxed">{currentQuestion.question}</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {currentQuestion.answers.map((answer, index) => (
          <button
            key={index}
            className={getAnswerClassName(answer)}
            onClick={() => handleAnswerClick(answer)}
            disabled={isAnswered}
          >
            {answer}
          </button>
        ))}
      </div>
    </div>
  );
}

export default Quiz;