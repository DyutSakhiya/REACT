import React, { useState, useEffect } from "react";

const questions = [
  {
    question: "Who won the ICC Cricket World Cup in 2011?",
    options: ["Australia", "India", "England", "Pakistan"],
    answer: "India",
  },
  {
    question: "What is the capital of France?",
    options: ["Madrid", "Berlin", "Paris", "Lisbon"],
    answer: "Paris",
  },
  {
    question: "Which planet is known as the Red Planet?",
    options: ["Earth", "Mars", "Jupiter", "Saturn"],
    answer: "Mars",
  },
  {
    question: "Which language is used to style web pages?",
    options: ["HTML", "Python", "CSS", "Java"],
    answer: "CSS",
  },
  {
    question: "What does CPU stand for?",
    options: ["Central Processing Unit", "Computer Processing Unit", "Central Power Unit", "Core Programming Unit"],
    answer: "Central Processing Unit",
  },
];

function Quiz() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState(null);
  const [isCompleted, setIsCompleted] = useState(false);

  const currentQuestion = questions[currentIndex];

  useEffect(() => {
    setSelected(null);
  }, [currentIndex]);

  const handleOptionClick = (option) => {
    setSelected(option);
    if (option === currentQuestion.answer) {
      setScore(score + 1);
    }
  };

  const handleNext = () => {
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setIsCompleted(true);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      if (selected === currentQuestion.answer) {
        setScore(score - 1);
      }
    }
  };

  const restartQuiz = () => {
    setCurrentIndex(0);
    setScore(0);
    setSelected(null);
    setIsCompleted(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-blue-100 p-4">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
        {!isCompleted ? (
          <>
            <p className="text-sm text-gray-500">Question {currentIndex + 1} of {questions.length}</p>
            <h2 className="text-lg font-semibold mb-4">{currentQuestion.question}</h2>

            {currentQuestion.options.map((option, i) => (
              <button
                key={i}
                className={`mb-2 py-2 px-4 w-full rounded ${selected
                  ? option === currentQuestion.answer
                    ? "bg-green-500 text-white"
                    : option === selected
                      ? "bg-red-500 text-white"
                      : "bg-blue-300 text-white"
                  : "bg-blue-500 text-white hover:bg-blue-600"
                }`}
                onClick={() => handleOptionClick(option)}
                disabled={selected !== null}
              >
                {option}
              </button>
            ))}

            <div className="flex justify-between mt-4">
              <button
                onClick={handlePrevious}
                disabled={currentIndex === 0}
                className="bg-gray-600 text-white px-4 py-2 rounded disabled:opacity-50"
              >
                Previous
              </button>
              <button
                onClick={handleNext}
                disabled={selected === null}
                className="bg-green-600 text-white px-4 py-2 rounded"
              >
                {currentIndex + 1 === questions.answer ? "Finish" : "Next"}
              </button>
            </div>
          </>
        ) : (
          <div className="text-center">
            <h2 className="text-xl font-bold text-green-700 mb-2">Quiz Completed!</h2>
            <p className="text-gray-700 mb-4">Your Score: {score} / {questions.length}</p>
            <button onClick={restartQuiz} className="bg-green-600 text-white px-4 py-2 rounded">
              Restart Quiz
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
export default Quiz;
