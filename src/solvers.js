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
  var placeRook = function(row, board, usedCols){
    var boardArray = board.rows();
    //loop through columns on board
    for(var c = 0; c < boardArray.length; c++){
      if(usedCols.indexOf(c) === -1){
        //place rook in current row at i column
        board.togglePiece(row,c);
        //check if board is still valid
        if(!board.hasAnyRooksConflicts()){
          //check if board is complete, if so increment solutionCount
          if(row === boardArray.length-1){
            solutionCount++;
          } else{
            var newUsed = usedCols.slice(0);
            newUsed.push(c);
            //else call recursive function
            placeRook(row+1, board, newUsed);
          }
        }
        //remove rook from that spot
        board.togglePiece(row,c);
      }
    }
  };
  var board = new Board({n: n});
  placeRook(0, board, []);

  console.log('Number of solutions for ' + n + ' rooks:', solutionCount);
  return solutionCount;
};



// return a matrix (an array of arrays) representing a single nxn chessboard, with n queens placed such that none of them can attack each other
window.findNQueensSolution = function(n) {
  var placeQueen = function(row, board, usedCols, usedMjDg, usedMnDg){
    var boardArray = board.rows();
    //loop through columns on board
    for(var c = 0; c < boardArray.length; c++){
      if(usedCols.indexOf(c) === -1 && usedMjDg.indexOf(c-row) === -1 && usedMnDg.indexOf(c+row) === -1){
        //place rook in current row at i column
        board.togglePiece(row,c);
        //check if board is still valid
        if(!board.hasAnyQueensConflicts()){
          //check if board is complete, if so increment solutionCount
          if(row === boardArray.length-1){
            console.log('Single solution for ' + n + ' queens:', JSON.stringify(boardArray));
            return boardArray;
          } else{
            //else call recursive function
            //push current col into usedCols
            var newUsedCols = usedCols.slice(0);
            newUsedCols.push(c);
            var newUsedMjDg = usedMjDg.slice(0);
            newUsedMjDg.push(c-row);
            var newUsedMnDg = usedMnDg.slice(0);
            newUsedMnDg.push(c+row);
            var temp = placeQueen(row+1, board, newUsedCols, newUsedMjDg, newUsedMnDg);
            if (temp !== undefined){
              return temp;
            }
          }
        }
        //remove rook from that spot
        board.togglePiece(row,c);
      }
    }
    if (row === 0){
      return boardArray;
    }
  };
  var board = new Board({n: n});
  return placeQueen(0, board, [], [], []);
};


// return the number of nxn chessboards that exist, with n queens placed such that none of them can attack each other
window.countNQueensSolutions = function(n) {
  var newUsedCols, newUsedMjDg, newUsedMnDG, solutionCount = 0;
  if (n === 0 || n === 1) {
    console.log('Number of solutions for ' + n + ' queens:', 1);
    return 1;
  }
  var placeQueen = function(row, usedCols, usedMjDg, usedMnDg){
    //loop through columns on board
    //end for loop at n/2 for row = 0
    var endLoop = row === 0 ? Math.floor(n/2) : n;
    for(var c = 0; c < endLoop; c++){
      if(usedCols.indexOf(c) === -1 && usedMjDg.indexOf(c-row) === -1 && usedMnDg.indexOf(c+row) === -1){
        //check if board is complete, if so increment solutionCount
        if(row === n-1){
          solutionCount++;
        } else{
          //else call recursive function, update used cols/diags
          var newUsedCols = usedCols.slice(0);
          newUsedCols.push(c);
          var newUsedMjDg = usedMjDg.slice(0);
          newUsedMjDg.push(c-row);
          var newUsedMnDg = usedMnDg.slice(0);
          newUsedMnDg.push(c+row);
          placeQueen(row+1, newUsedCols, newUsedMjDg, newUsedMnDg);
        }
      }
    }
  };
  placeQueen(0, [], [], []);
  solutionCount*=2;
  if (n%2 === 1){
    placeQueen(1, [Math.floor(n/2)], [Math.floor(n/2)], [Math.floor(n/2)]);
  }
  console.log('Number of solutions for ' + n + ' queens:', solutionCount);
  return solutionCount;
};

window.countNQueensBitShift = function(n) {
  var solutionCount = 0;
  if (n === 0 || n === 1) {
    console.log('Number of solutions for ' + n + ' queens:', 1);
    return 1;
  }
  var placeQueen = function(row, left, right, column){
    //if we're on row 0, stop the loop at the midway point otherwise go through the whole row.
    var endLoop = row === 0 ? ((((1 << n) - 1) << (n >> 1)) & ((1 << n) - 1)) : 0;
	//get the binary number of possible spots for this row
    var possibleMoves = (1 << n) - 1 - (left|right|column);
	var current;
    while (possibleMoves > endLoop){
	  //if we're on the last row increment the counter and exit the current function call
      if (row === n - 1){
        solutionCount++;
        return;
      } else {
	    //find the next 1 in the binary number of possible spots, call the recursion function updating each argument, then remove that used 1 from the possible spots
        current = possibleMoves & -possibleMoves;
        placeQueen(row + 1, ((current | left) << 1) & ((1 << n) - 1), (current | right) >> 1, current | column);
        possibleMoves -= current;
      }
    }
  }
  placeQueen(0, 0, 0, 0);
  //double the counter
  solutionCount = solutionCount << 1;
  //if n is odd calculate the possible solutions putting the first queen in the middle column
  if (n & 1 === 1){
    var current = 1 << (n >> 1);
    placeQueen(1, current << 1, current >> 1, current);
  }
  console.log('Number of solutions for ' + n + ' queens:', solutionCount);
  return solutionCount;
}

var timeIt = function(func){
  return function(){
    var curr = Date.now();
    func.apply(this,arguments);
    return Date.now()-curr;
  };
}
