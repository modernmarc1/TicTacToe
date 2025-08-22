import { useState } from 'react'

function GameBoard() {
  const [status, setStatus] = useState('');

  const handleClick = async () => {
    try {
      const response = await fetch(
        `http://127.0.0.1:3000/energy/upload/${threshold}`, 
        { 
          method: 'POST',
          body: ""
        }
      );

      setStatus('');
      const data = await response.text();
      const parsedData = JSON.parse(data);
      alert("Your Turn!");
    } catch (error) {
      setStatus('');
      setFile(null);
      alert(`There was an error making the computers move:\n${error}`);
    }
  }

  return (
    <div className="App">
    </div>
  );
}

export default GameBoard;
