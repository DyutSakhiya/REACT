import React, { useState } from "react";

const questions = [
  {
    question: "Who won the ICC Cricket World Cup in 2011?",
    options: ["Australia", "India", "England", "Pakistan"],
  },
  {
    question: "Which country hosted the 2019 Cricket World Cup?",
    options: ["India", "England", "Australia", "New Zealand"],
  },
  {
    question: "Who is known as the 'Master Blaster' in cricket?",
    options: ["Virat Kohli", "Ricky Ponting", "Sachin Tendulkar", "MS Dhoni"],
  },
  {
    question: "Which bowler has taken the most wickets in Test cricket?",
    options: ["Shane Warne", "Muttiah Muralitharan", "Anil Kumble", "James Anderson"],
  },
  {
    question: "Which format is known as the shortest in professional cricket?",
    options: ["Test", "ODI", "T20", "The Hundred"],
  },
];

function Quiz() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedOption(null);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setSelectedOption(null);
    }
  };

  const handleOptionClick = (option) => {
    setSelectedOption(option);
  };

  const question = questions[currentQuestion];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-blue-100 p-4">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-md text-center space-y-6">
        <div className="text-gray-600 text-sm">
          Question {currentQuestion + 1} of {questions.length}
        </div>

        <h1 className="text-xl font-semibold text-gray-800">{question.question}</h1>

        <div className="flex flex-col gap-3">
          {question.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleOptionClick(option)}
              className={`py-2 px-4 rounded transition ${
                selectedOption === option
                  ? "bg-blue-700 text-white"
                  : "bg-blue-500 hover:bg-blue-600 text-white"
              }`}
            >
              {option}
            </button>
          ))}
        </div>

        <div className="flex justify-between pt-4">
          <button
            onClick={handlePrevious}
            className="py-2 px-4 rounded bg-gray-700 hover:bg-gray-600" 
            disabled={currentQuestion === 0}
          >
            Previous
          </button>

          <button
            onClick={handleNext}
            className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded"
            disabled={currentQuestion === questions.length - 1}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

export default Quiz;
