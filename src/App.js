import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [remainingGuesses, setRemainingGuesses] = useState(5);
  const [feedback, setFeedback] = useState('');
  const [randomWord, setRandomWord] = useState('');

  useEffect(() => {
    getRandomWord();
  }, []);

  const getRandomWord = () => {
    fetch('https://g7uitozxhk.execute-api.us-east-1.amazonaws.com/dev')
      .then(response => response.json())
      .then(data => {
        if (data.body && data.body.ID && data.body.word) {
          setRandomWord(data.body.word);
        } else {
          throw new Error("No data returned from Lambda function");
        }
      })
      .catch(error => {
        console.error('Error:', error);
        // Handle error if needed
      });
  };

  const decrementGuessCount = () => {
    setRemainingGuesses(prevGuesses => prevGuesses - 1);
  };

  const checkGuess = () => {
    const word = randomWord;
    const guess = document.getElementById("guessInput").value.trim();
    const feedbackDisplay = document.getElementById("feedback");

    if (!word) {
      setFeedback("Error: Failed to fetch word from Lambda function.");
      return;
    }

    if (word.length !== guess.length) {
      setFeedback("Incorrect guess length. Please enter a guess with the same length as the word.");
      return;
    }

    let correctLetters = "";
    let wrongLetters = "";

    for (let i = 0; i < word.length; i++) {
      if (word[i] === guess[i]) {
        correctLetters += word[i];
      } else if (guess.includes(word[i])) {
        wrongLetters += word[i];
      }
    }

    if (guess === word) {
      setFeedback("Congratulations! You guessed the word correctly.");
    } else if (correctLetters === "" && wrongLetters === "") {
      setFeedback("No correct letters in the guess.");
    } else {
      let feedbackText = "";
      if (correctLetters !== "") {
        feedbackText += "Correct letters in the correct position: " + correctLetters + ". ";
      }
      if (wrongLetters !== "") {
        feedbackText += "Correct letters but in the wrong position: " + wrongLetters + ". ";
      }
      setFeedback(feedbackText);
    }

    decrementGuessCount();
  };

  return (
    <div className="wordle-container">
      <h1 className="wordle-header">Word Guess</h1>
      <div className="wordle-input">
        <input type="text" id="guessInput" placeholder="Enter your guess" autoComplete="off" />
        <button id="submitGuess" onClick={checkGuess}>Check</button>
      </div>
      <p className="wordle-feedback" id="feedback">{feedback}</p>
      <p className="wordle-guesses" id="guessCount">Guesses: {remainingGuesses}</p>
    </div>
  );
}

export default App;