/**********************************************
 * STARTER CODE
 **********************************************/

/**
 * shuffle()
 * Shuffle the contents of an array
 *   depending the datatype of the source
 * Makes a copy. Does NOT shuffle the original.
 * Based on Steve Griffith's array shuffle prototype
 * @Parameters: Array or string
 * @Return: Scrambled Array or string, based on the provided parameter
 */
function shuffle (src) {
  const copy = [...src]

  const length = copy.length
  for (let i = 0; i < length; i++) {
    const x = copy[i]
    const y = Math.floor(Math.random() * length)
    const z = copy[y]
    copy[i] = z
    copy[y] = x
  }

  if (typeof src === 'string') {
    return copy.join('')
  }

  return copy
}

/**********************************************
 * YOUR CODE BELOW
 **********************************************/
const { useState, useEffect } = React;

function ScrambleGame() {
  const words = shuffle([
    "banana", "apple", "orange", "grape", "cherry", "mango", "peach", "pear", "plum", "melon"
  ]);
  const maxStrikes = 3;
  const maxPasses = 3;

  const initialGameData = {
    remainingWords: [...words],
    scrambledWord: "",
    correctWord: "",
    points: 0,
    strikes: 0,
    passes: maxPasses,
    gameOver: false
  };

  const [gameData, setGameData] = useState(() => {
    const storedData = localStorage.getItem("scrambleGame");
    return storedData ? JSON.parse(storedData) : initialGameData;
  });

  const [guess, setGuess] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!gameData.correctWord) {
      generateWord();
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("scrambleGame", JSON.stringify(gameData));
  }, [gameData]);

  function generateWord() {
    if (gameData.remainingWords.length === 0) {
      setGameData(prevState => ({ ...prevState, gameOver: true }));
      return;
    }
    const newWord = gameData.remainingWords[0];
    setGameData(prevState => ({
      ...prevState,
      scrambledWord: shuffle(newWord),
      correctWord: newWord,
      remainingWords: prevState.remainingWords.slice(1)
    }));
  }

  function handleGuess(event) {
    event.preventDefault();
    if (guess.toLowerCase() === gameData.correctWord.toLowerCase()) {
      setMessage("Correct!");
      setGameData(prevState => ({
        ...prevState,
        points: prevState.points + 1
      }));
      generateWord();
    } else {
      setMessage("Incorrect!");
      setGameData(prevState => ({
        ...prevState,
        strikes: prevState.strikes + 1
      }));
    }
    setGuess("");
    checkGameOver();
  }

  function passWord() {
    if (gameData.passes > 0) {
      setGameData(prevState => ({
        ...prevState,
        passes: prevState.passes - 1
      }));
      generateWord();
    }
  }

  function checkGameOver() {
    if (gameData.strikes >= maxStrikes || gameData.remainingWords.length === 0) {
      setGameData(prevState => ({ ...prevState, gameOver: true }));
    }
  }

  function resetGame() {
    setGameData(initialGameData);
    localStorage.removeItem("scrambleGame");
    setTimeout(generateWord, 0); // Ensure new word generation without state lag
  }

  return (
    <div>
      <h1>Scramble Game</h1>
      {gameData.gameOver ? (
        <div>
          <h2>Game Over!</h2>
          <p>Final Score: {gameData.points}</p>
          <button onClick={resetGame}>Play Again</button>
        </div>
      ) : (
        <div>
          <h2>Scrambled Word: {gameData.scrambledWord}</h2>
          <form onSubmit={handleGuess}>
            <input
              type="text"
              value={guess}
              onChange={(e) => setGuess(e.target.value)}
              required
            />
            <button type="submit">Guess</button>
          </form>
          <button onClick={passWord} disabled={gameData.passes === 0}>
            Pass ({gameData.passes} left)
          </button>
          <p>{message}</p>
          <p>Points: {gameData.points}</p>
          <p>Strikes: {gameData.strikes} / {maxStrikes}</p>
        </div>
      )}
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<ScrambleGame />);


