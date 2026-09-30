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
  const [pendingPromotion, setPendingPromotion] = useState(null);
  const [resetCount, setResetCount] = useState(0);
  
  const squares = [];
  const turn = game.turn();
  const gameOver=game.isGameOver();
  const inCheck=game.inCheck();

  

  const history = game.history({ verbose: true });
  console.log(history);
  const lastMove = history[history.length - 1];
  const legalMoves=selectedSquare?game.moves({square:toSquareName(selectedSquare.row,selectedSquare.col),verbose:true}):[];
  // console.log(lastMove);
  function gameEnd(){
    if(game.isCheckmate()){
      return "Checkmate";
    }
    if(game.isStalemate()){
      return "Stalemate";
    }
    if(game.isDraw()){
      return "Draw";
    }
    
    else{
      return "Over";
    }
  }



  function promote(piece){
    game.move({
      from:pendingPromotion.from,
      to:pendingPromotion.to,
      promotion:piece
    });
    setPendingPromotion(null);
  }
  
  for (let row = 0; row < 8; row++) {
    
    for (let col = 0; col < 8; col++) {
      const isDark = (row + col) % 2 === 1;
      const piece = board[row][col]; 
      
      const isSelected=selectedSquare && selectedSquare.row===row && selectedSquare.col===col;
      const squareName=toSquareName(row,col);
      const isLastMove=lastMove&&(lastMove.from===squareName || lastMove.to===squareName)
      
      const isLegalMove = legalMoves.some((move) => move.to === squareName);
      
      const isKinginCheck=inCheck&&piece && piece.type==='k'&&piece.color===turn
      
      squares.push(
        <div
          key={`${row}-${col}`}
          className={`square ${isDark ? 'dark' : 'light'} ${isSelected ? 'selected' : ''} ${isLastMove?'lastmove':''} ${isLegalMove?'legalSquare':''} ${isKinginCheck?'check':''}`}
          onClick={() => {
            if(game.isGameOver()||pendingPromotion!=null)return;

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
                    const isPromotion =selectedPiece.type === 'p' && ((selectedPiece.color === 'w' && to[1] === '8') || (selectedPiece.color === 'b' && to[1] === '1'));
                    try{
                      if (isPromotion && isLegalMove) {
                        setPendingPromotion({ from, to });
                      }
                      else {
                        const move =game.move({from,to});
                      }
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
          {row===7 && <span className='file-notation'>{String.fromCharCode(97+col)}</span>}
          {col===0 && <span className='rank-notation'>{8-row}</span>}
        </div>
      );
    }
  }
  const movePairs=[];
  for(let i=0;i<history.length;i+=2){
    movePairs.push({
      number:i/2+1,
      white:history[i],
      black:history[i+1],
    })
  }
  const capturedPiece=[];
  // for(let i=0;i<history.length;i++){
  //   capturedPiece.push(history.captured)
  // }

  const capturedPieces = [];

for(let i = 0; i < history.length; i++){
    if(history[i].captured){
        capturedPieces.push({
            type: history[i].captured,
            color: history[i].color === 'w' ? 'b' : 'w'
        });
    }
}

  return <>

  <p>{gameOver?`Game Over ${gameEnd()}` :(turn === 'w' ? "White's turn" : "Black's turn")}</p>
  <div className="board">
    {squares}
  </div>
  {pendingPromotion&&
  (
    <div className="promotion">
      <button onClick={()=>promote('q')}>Queen</button>
      <button onClick={()=>promote('r')}>Rook</button>
      <button onClick={()=>promote('b')}>Bishop</button>
      <button onClick={()=>promote('n')}>Knight</button>
    </div>
  )}
  <div className="captured-piece">
    {capturedPieces.map((p, index) => (
      
      <img className="captured-piece-img" key={index} src={getPieceSymbol(p)}/>
))}
  </div>
  <div className="history-class">
  {movePairs.map((pair) => (
    <div className="move-row" key={pair.number}>
      <span>{pair.number +" "}</span>
      <span>{pair.white?.san + " "}</span>
      <span>{pair.black?.san}</span>
    </div>
    
  ))}
</div>
  <div className="reset-undo">
    <button onClick={()=>{game.reset(); setResetCount(c=>c+1)}}>Reset</button>
    <button onClick={()=>{game.undo();setResetCount(c=>c+1)}}>Undo</button>
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