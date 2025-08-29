import { useEffect, useState } from 'react'
import './App.css'

function App() {
  const [quiz, setQuiz] = useState([])
  const [index, setIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [showScore, setShowScore] = useState(false)
  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const [isCorrect, setIsCorrect] = useState(null)
  const [shuffledOptions, setShuffledOptions] = useState([])

  useEffect(() => {
    getDataFromAPI()
  }, [])

  useEffect(() => {
    if (quiz.length > 0 && index < quiz.length) {
      const currentQuestion = quiz[index]
      const allOptions = [
        ...currentQuestion.incorrectAnswers,
        currentQuestion.correctAnswer
      ]
      setShuffledOptions(shuffle([...allOptions]))
      setSelectedAnswer(null)
      setIsCorrect(null)
    }
  }, [quiz, index])

  function getDataFromAPI() {
    fetch('https://the-trivia-api.com/v2/questions')
      .then(data => data.json())
      .then(value => setQuiz(value))
      .catch(err => console.log(err))
  }

  function shuffle(array) {
    let currentIndex = array.length
    let randomIndex

    while (currentIndex !== 0) {
      randomIndex = Math.floor(Math.random() * currentIndex)
      currentIndex--
      [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]]
    }

    return array
  }

  function handleAnswerClick(option) {
    if (selectedAnswer) return // Prevent re-selecting after answer is chosen
    
    setSelectedAnswer(option)
    const correct = option === quiz[index].correctAnswer
    setIsCorrect(correct)
    
    if (correct) {
      setScore(score + 1)
    }
    
    // Move to next question after a delay
    setTimeout(() => {
      if (index < quiz.length - 1) {
        setIndex(index + 1)
      } else {
        setShowScore(true)
      }
    }, 1500)
  }

  function restartQuiz() {
    setIndex(0)
    setScore(0)
    setShowScore(false)
    setSelectedAnswer(null)
    setIsCorrect(null)
    getDataFromAPI()
  }

  if (!quiz.length) {
    return (
      <div className="loading-container">
        <img src="https://static.wixstatic.com/media/68315b_30dbad1140034a3da3c59278654e1655~mv2.gif" width="100%" alt="Loading" />
        <p>Loading questions...</p>
      </div>
    )
  }

  if (showScore) {
    return (
      <div className="app">
        <div className="score-section">
          <h2>Quiz Completed!</h2>
          <p>You scored {score} out of {quiz.length}</p>
          <div className="score-circle">
            <span>{Math.round((score / quiz.length) * 100)}%</span>
          </div>
          <button onClick={restartQuiz} className="restart-btn">Play Again</button>
        </div>
      </div>
    )
  }

  const currentQuestion = quiz[index]
  const progress = ((index + 1) / quiz.length) * 100

  return (
    <div className="app">
      <div className="quiz-container">
        <div className="quiz-header">
          <h1>Quiz App</h1>
          <div className="progress-bar">
            <div className="progress" style={{ width: `${progress}%` }}></div>
          </div>
          <div className="score">Score: {score}/{quiz.length}</div>
        </div>

        <div className="question-section">
          <div className="question-count">
            <span>Question {index + 1}</span>/{quiz.length}
          </div>
          <div className="question-text">
            {currentQuestion.question.text}
          </div>
          <div className="question-category">
            Category: {currentQuestion.category}
          </div>
        </div>

        <div className="answer-section">
          {shuffledOptions.map((option, i) => {
            let buttonClass = "answer-button"
            
            if (selectedAnswer === option) {
              buttonClass += isCorrect ? " correct" : " incorrect"
            } else if (selectedAnswer && option === currentQuestion.correctAnswer) {
              buttonClass += " correct"
            }
            
            return (
              <button 
                key={i} 
                onClick={() => handleAnswerClick(option)}
                className={buttonClass}
                disabled={selectedAnswer !== null}
              >
                {option}
              </button>
            )
          })}
        </div>

        <div className="feedback">
          {isCorrect !== null && (
            <p className={isCorrect ? "correct-feedback" : "incorrect-feedback"}>
              {isCorrect 
                ? "Correct! Well done!" 
                : `Sorry, the correct answer is: ${currentQuestion.correctAnswer}`
              }
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

export default App