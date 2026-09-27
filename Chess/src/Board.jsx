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
                const from =toSquareName(selectedSquare.row,selectedSquare.col);
                const to=toSquareName(row,col);
                const move =game.move({from,to});
                setSelectedSquare(null);
            } else {
                setSelectedSquare({ row, col });
            }
        }}
        >
          {piece && <span className={piece.color==='w'?'piece-white':'piece-black'}>{getPieceSymbol(piece)}</span>}
        </div>
      );
    }
  }

  return <div className="board">{squares}</div>;
}

function getPieceSymbol(piece) {
  const symbols = {
    p: '♟', r: '♜', n: '♞', b: '♝', q: '♛', k: '♚',
  };
  return symbols[piece.type];
  
}

export default Board;