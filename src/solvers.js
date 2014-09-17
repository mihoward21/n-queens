/*           _
   ___  ___ | |_   _____ _ __ ___
  / __|/ _ \| \ \ / / _ \ '__/ __|
  \__ \ (_) | |\ V /  __/ |  \__ \
  |___/\___/|_| \_/ \___|_|  |___/

*/

// hint: you'll need to do a full-search of all possible arrangements of pieces!
// (There are also optimizations that will allow you to skip a lot of the dead search space)
// take a look at solversSpec.js to see what the tests are expecting


// return a matrix (an array of arrays) representing a single nxn chessboard, with n rooks placed such that none of them can attack each other

window.findNRooksSolution = function(n) {
  var board = new Board({n: n}); //fixme
  var boardArray = board.rows();
  for (var r = 0; r < boardArray.length; r++){
    for (var c = 0; c < boardArray.length; c++){
      board.togglePiece(r, c);
      if (board.hasAnyRooksConflicts()){
        board.togglePiece(r, c);
      }
    }
  }
  var solution = board.rows();
  console.log('Single solution for ' + n + ' rooks:', JSON.stringify(solution));
  return solution;
};



// return the number of nxn chessboards that exist, with n rooks placed such that none of them can attack each other
window.countNRooksSolutions = function(n) {
  var solutionCount = 0; //fixme
  if (n === 0) {
    return 1;
  }
  var placeRook = function(row, board){
    var boardArray = board.rows();
    //loop through columns on board
    for(var c = 0; c < boardArray.length; c++){
      //place rook in current row at i column
      board.togglePiece(row,c);
      //check if board is still valid
      if(!board.hasAnyRooksConflicts()){
        //check if board is complete, if so increment solutionCount
        if(row === boardArray.length-1){
          solutionCount++;
        } else{
        //else call recursive function
          placeRook(row+1, board);
        }
      }
      //remove rook from that spot
      board.togglePiece(row,c);
    }
  };
  var board = new Board({n: n});
  placeRook(0, board);

  console.log('Number of solutions for ' + n + ' rooks:', solutionCount);
  return solutionCount;
};



// return a matrix (an array of arrays) representing a single nxn chessboard, with n queens placed such that none of them can attack each other
window.findNQueensSolution = function(n) {
  var board = new Board({n: n}); //fixme
  var boardArray = board.rows();
  for (var r = 0; r < boardArray.length; r++){
    for (var c = 0; c < boardArray.length; c++){
      board.togglePiece(r, c);
      if (board.hasAnyQueensConflicts()){
        board.togglePiece(r, c);
      }
    }
  }
  var solution = board.rows();
  console.log('Single solution for ' + n + ' queens:', JSON.stringify(solution));
  return solution;
};


// return the number of nxn chessboards that exist, with n queens placed such that none of them can attack each other
window.countNQueensSolutions = function(n) {
  var solutionCount = 0; //fixme
  if (n === 0) {
    return 1;
  }
  var placeQueen = function(row, board){
    var boardArray = board.rows();
    //loop through columns on board
    for(var c = 0; c < boardArray.length; c++){
      //place rook in current row at i column
      board.togglePiece(row,c);
      //check if board is still valid
      if(!board.hasAnyQueensConflicts()){
        //check if board is complete, if so increment solutionCount
        if(row === boardArray.length-1){
          solutionCount++;
        } else{
        //else call recursive function
          placeQueen(row+1, board);
        }
      }
      //remove rook from that spot
      board.togglePiece(row,c);
    }
  };
  var board = new Board({n: n});
  placeQueen(0, board);

  console.log('Number of solutions for ' + n + ' queens:', solutionCount);
  return solutionCount;
};
