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
  const GameOver=game.isGameOver();

  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const isDark = (row + col) % 2 === 1;
      const piece = board[row][col]; 
      const isSelected=selectedSquare && selectedSquare.row===row && selectedSquare.col===col;
      squares.push(
        <div
          key={`${row}-${col}`}
          className={`square ${isDark ? 'dark' : 'light'} ${isSelected ? 'selected' : ''}`}
          onClick={() => {
            if (selectedSquare) {
                const selectedPiece=board[selectedSquare.row][selectedSquare.col];
                if(selectedSquare.row===row && selectedSquare.col===col){
                    setSelectedSquare(null);
                }
                else if(piece&& piece.color===selectedPiece.color){
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
                setSelectedSquare({ row, col });
            }
        }
    }
        >
          {piece && <span className={piece.color==='w'?'piece-white':'piece-black'}>{getPieceSymbol(piece)}</span>}
        </div>
      );
    }
  }

  return <><p>{GameOver?"Game Over":(turn === 'w' ? "White's turn" : "Black's turn")}</p><div className="board">{squares}</div></>;
}

function getPieceSymbol(piece) {
  const symbols = {
    p: '♟', r: '♜', n: '♞', b: '♝', q: '♛', k: '♚',
  };
  return symbols[piece.type];
  
}

export default Board;