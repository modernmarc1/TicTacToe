import { DynamoDBClient, GetItemCommand, PutItemCommand } from '@aws-sdk/client-dynamodb';

const clientCreds = {
  endpoint: 'http://host.docker.internal:4566', 
  region: 'us-west-2', 
  forcePathStyle: true,
  aws_access_key_id: "anything",
  aws_secret_access_key: "anything"
}

// Check row, then columns, then diagonals for a winner
function CalculateWinner(squares) {
  const winningRows = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];

  for (let i = 0; i < winningRows.length; i++) {
    const [a, b, c] = winningRows[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

// Returns true if there are moves remaining on the board
function isMovesLeft(board) {
    return board.includes(null);
}

// Minimax function for 1D board
function minimax(board, depth, isMax) {
    const winner = CalculateWinner(board);
    if (winner === 'O') return 10 - depth;
    if (winner === 'X') return depth - 10;
    if (!isMovesLeft(board)) return 0;

    if (isMax) {
        let best = -1000;
        for (let i = 0; i < 9; i++) {
            if (board[i] === null) {
                board[i] = 'O';
                best = Math.max(best, minimax(board, depth + 1, false));
                board[i] = null;
            }
        }
        return best;
    } else {
        let best = 1000;
        for (let i = 0; i < 9; i++) {
            if (board[i] === null) {
                board[i] = 'X';
                best = Math.min(best, minimax(board, depth + 1, true));
                board[i] = null;
            }
        }
        return best;
    }
}

// Returns the best move index for the computer ('O')
function findBestMove(board) {
    let bestVal = -1000; 
    let bestMove = -1;

    for (let i = 0; i < 9; i++) {
        if (board[i] === null) {
            board[i] = 'O';
            let moveVal = minimax(board, 0, false);
            board[i] = null;
            if (moveVal > bestVal) {
                bestVal = moveVal;
                bestMove = i;
            }
        }
    }    
    return bestMove;
}

async function putItemInDynamoDB(client, id, board, winner = "none") {
  const putParams = {
    TableName: 'GameTable',
    Item: {
      'id': { S: id },
      'board': { S: JSON.stringify(board) },
      'winner': { S: winner || "none" }
    }
  };
  const putCommand = new PutItemCommand(putParams);
  await client.send(putCommand);
}

function getResponseObj(statusCode, board, id, message, winner) {
  return {
    statusCode: statusCode,
    body: JSON.stringify({
      board: board,
      id: id,
      message: message,
      winner: winner
    }),
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    }
  };
}

/**
 * @function gameHandler
 * @param {object} event - API Gateway Lambda event contains game board
 * @returns {object} response - returns board, id and success or error response
**/
export const gameHandler = async (event) => {
  console.info('received:', event);
  let { id, squares } = JSON.parse(event.body);

  try {
    // create DynamoDB client & responses
    const client = new DynamoDBClient(clientCreds);
    let board = [];

    // add end user move to history if game exists
    if (id) {
      const input = {
        TableName: "GameTable",
        Key: {
          id: {
            S: id
          }
        }
      };
      const getCommand = new GetItemCommand(input);
      const getResponse = await client.send(getCommand);
      console.log('DynamoDB GetItem response:', getResponse);
      
      const responseBoards = JSON.parse(getResponse.Item.board.S);
      board = [...responseBoards, squares];
    } else {
      id = crypto.randomUUID();
      board = [squares];
    }
    
    //find computer move
    let bestMove = findBestMove(squares);
    let nextBoard = squares.slice();
    nextBoard[bestMove] = 'O';

    let winner = CalculateWinner(nextBoard);
    if (!winner && !isMovesLeft(nextBoard)) {
      winner = "tie";
    }

    try {
      await putItemInDynamoDB(client, id, [...board, nextBoard], winner);
    } catch (error) {
      return getResponseObj(400, nextBoard, id, `Error saving game state: ${error}`, winner);
    }
    
    return getResponseObj(200, nextBoard, id, "", winner);
  } catch (error) {
    const errorMessage = `Unexpected error processing request: ${error.message}`;
    console.error(errorMessage);
    return getResponseObj(400, null, id, `Error saving game state: ${errorMessage}`, null);
  }
};
