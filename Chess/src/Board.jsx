import React, { useState } from 'react';
import { Chess } from 'chess.js';
import './Board.css';



function toSquareName(row,col){
    const file=String.fromCharCode(97+col);
    const rank=8-row;
    return `${file}${rank}`;
}
function Board() {
  const [game] = useState(new Chess());
  const board = game.board(); 
  const [selectedSquare,setSelectedSquare]=useState(null);
  
  const squares = [];
  const turn = game.turn();
  const gameOver=game.isGameOver();

  const history = game.history({ verbose: true });
  const lastMove = history[history.length - 1];
  // console.log(lastMove);
  
  
  for (let row = 0; row < 8; row++) {
    
    for (let col = 0; col < 8; col++) {
      const isDark = (row + col) % 2 === 1;
      const piece = board[row][col]; 
      
      const isSelected=selectedSquare && selectedSquare.row===row && selectedSquare.col===col;
      const squareName=toSquareName(row,col);
      const isLastMove=lastMove&&(lastMove.from===squareName || lastMove.to===squareName)
      
      squares.push(
        <div
          key={`${row}-${col}`}
          className={`square ${isDark ? 'dark' : 'light'} ${isSelected ? 'selected' : ''} ${isLastMove?'lastmove':''}`}
          onClick={() => {
            if (selectedSquare) {
                const selectedPiece=board[selectedSquare.row][selectedSquare.col];
                if(selectedSquare.row===row && selectedSquare.col===col){
                    setSelectedSquare(null);
                }
                else if(piece&&  piece.color===selectedPiece.color){
                    setSelectedSquare({row,col});
                }
                else{
                    const from =toSquareName(selectedSquare.row,selectedSquare.col);
                    const to=toSquareName(row,col);
                    try{
                        const move =game.move({from,to});
                    }
                    catch(err){
                        console.log(err);
                    }
                    setSelectedSquare(null);
                } 
            }
            else{
                if (piece && piece.color === turn) {
    setSelectedSquare({ row, col });
  }
            }
        }
    }
        >
          {piece && <img src={getPieceSymbol(piece)}className='piece'/>}
        </div>
      );
    }
  }

  return <>
  <p>{gameOver?"Game Over":(turn === 'w' ? "White's turn" : "Black's turn")}</p>
  <div className="board">
    {squares}
  </div>
  </>;
}

function getPieceSymbol(piece) {
  const symbols = {
    p: 'pawn', r: 'rook', n: 'knight', b: 'bishop', q: 'queen', k: 'king',
  };
  let pieceName=`/pieces-basic-svg/${symbols[piece.type]}-${piece.color}.svg`
  return pieceName;
  
}

export default Board;