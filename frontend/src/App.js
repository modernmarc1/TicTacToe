import { useState } from 'react';

function renderSquares({row, squares, handleClick}) {
  return ([0, 1, 2].map(col => {
    const i = row * 3 + col;
    return (
      <button
        className='square'
        key={i}
        value={squares[i]}
        onClick={() => handleClick(i)}
      >
        {squares[i]}
      </button>
    );
  }));
}

function renderRows({squares, handleClick}) {
  return [0, 1, 2].map(row => (
    <div className="board-row" key={row}>
      {renderSquares({row, squares, handleClick})}
    </div>
  ));
}

function GameBoard() {
  const [status, setStatus] = useState('Your Turn!');
  const [squares, setSquares] = useState(Array(9).fill(null));
  const [id, setId] = useState('');

  const handleClick = async (i) => {
    try {
      // set user move
      const nextSquares = squares.slice();
      nextSquares[i] = 'X';
      setSquares(nextSquares);

      // get computer move
      setStatus('Computer is making a move...');
      const response = await fetch(
        `http://127.0.0.1:3000/game/play`, 
        { 
          method: 'POST',
          body: JSON.stringify({
            id, 
            squares: nextSquares
          })
        }
      );

      //update board with user and computer move
      const data = await response.text();
      const parsedData = JSON.parse(data);
      setSquares(parsedData.squares);
      if (!id) setId(parsedData.id);
      
      if (parsedData.winner) {
        setStatus(`Game Over! ${parsedData.winner} is the winner!`);
        setSquares(Array(9).fill(null));
        return;
      } else {
        setStatus('Your Turn!');
      }
    } catch (error) {
      setStatus('');
      alert(`There was an error making the computers move:\n${error}`);
    }
  }

  return (
    <div>
      {renderRows({squares, handleClick})}
      <div className="status">{status}</div>
    </div>
  );
}

export default GameBoard;
