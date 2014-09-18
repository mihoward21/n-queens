// This file is a Backbone Model (don't worry about what that means)
// It's part of the Board Visualizer
// The only portions you need to work on are the helper functions (below)

(function() {

  window.Board = Backbone.Model.extend({

    initialize: function (params) {
      if (_.isUndefined(params) || _.isNull(params)) {
        console.log('Good guess! But to use the Board() constructor, you must pass it an argument in one of the following formats:');
        console.log('\t1. An object. To create an empty board of size n:\n\t\t{n: %c<num>%c} - Where %c<num> %cis the dimension of the (empty) board you wish to instantiate\n\t\t%cEXAMPLE: var board = new Board({n:5})', 'color: blue;', 'color: black;','color: blue;', 'color: black;', 'color: grey;');
        console.log('\t2. An array of arrays (a matrix). To create a populated board of size n:\n\t\t[ [%c<val>%c,%c<val>%c,%c<val>%c...], [%c<val>%c,%c<val>%c,%c<val>%c...], [%c<val>%c,%c<val>%c,%c<val>%c...] ] - Where each %c<val>%c is whatever value you want at that location on the board\n\t\t%cEXAMPLE: var board = new Board([[1,0,0],[0,1,0],[0,0,1]])', 'color: blue;', 'color: black;','color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: grey;');
      } else if (params.hasOwnProperty('n')) {
        this.set(makeEmptyMatrix(this.get('n')));
      } else {
        this.set('n', params.length);
      }
    },

    rows: function() {
      return _(_.range(this.get('n'))).map(function(rowIndex) {
        return this.get(rowIndex);
      }, this);
    },

    togglePiece: function(rowIndex, colIndex) {
      this.get(rowIndex)[colIndex] = + !this.get(rowIndex)[colIndex];
      this.trigger('change');
    },

	//position of start of major diagonal (top and left)
	//if this is 0 you are at top left corner. if it is positive you are on top row. if it is negative you are on far left column
    _getFirstRowColumnIndexForMajorDiagonalOn: function(rowIndex, colIndex) {
      return colIndex - rowIndex;
    },

	//position of start of minor diagonal (top and right)
	//if this is n(or n - 1 based on definition of indices) you are at top right corner. if it is > n (n-1) you are on far right column. if it is less you are on top row	
    _getFirstRowColumnIndexForMinorDiagonalOn: function(rowIndex, colIndex) {
      return colIndex + rowIndex;
    },

    hasAnyRooksConflicts: function() {
      return this.hasAnyRowConflicts() || this.hasAnyColConflicts();
    },

    hasAnyQueenConflictsOn: function(rowIndex, colIndex) {
      return (
        this.hasRowConflictAt(rowIndex) ||
        this.hasColConflictAt(colIndex) ||
        this.hasMajorDiagonalConflictAt(this._getFirstRowColumnIndexForMajorDiagonalOn(rowIndex, colIndex)) ||
        this.hasMinorDiagonalConflictAt(this._getFirstRowColumnIndexForMinorDiagonalOn(rowIndex, colIndex))
      );
    },

    hasAnyQueensConflicts: function() {
      return this.hasAnyRooksConflicts() || this.hasAnyMajorDiagonalConflicts() || this.hasAnyMinorDiagonalConflicts();
    },

    _isInBounds: function(rowIndex, colIndex) {
      return (
        0 <= rowIndex && rowIndex < this.get('n') &&
        0 <= colIndex && colIndex < this.get('n')
      );
    },


/*
         _             _     _
     ___| |_ __ _ _ __| |_  | |__   ___ _ __ ___ _
    / __| __/ _` | '__| __| | '_ \ / _ \ '__/ _ (_)
    \__ \ || (_| | |  | |_  | | | |  __/ | |  __/_
    |___/\__\__,_|_|   \__| |_| |_|\___|_|  \___(_)

 */
    /*=========================================================================
    =                 TODO: fill in these Helper Functions                    =
    =========================================================================*/

    // ROWS - run from left to right
    // --------------------------------------------------------------
    //
    // test if a specific row on this board contains a conflict
    hasRowConflictAt: function(rowIndex) {
	  var counter = 0;
	  for(var i = 0; i < this.get('n'); i++){
	    if(this.get(rowIndex)[i] === 1){
		  counter++;
		  if(counter > 1){
		    return true;
		  }
		}
	  }
      return false;
    },

    // test if any rows on this board contain conflicts
    hasAnyRowConflicts: function() {
      for(var i = 0; i < this.get('n'); i++){
	    if(this.hasRowConflictAt(i)){
		  return true;
		}  
	  }
	  return false;
    },



    // COLUMNS - run from top to bottom
    // --------------------------------------------------------------
    //
    // test if a specific column on this board contains a conflict
    hasColConflictAt: function(colIndex) {
      var counter = 0;
	  for(var i = 0; i < this.get('n'); i++){
	    if(this.get(i)[colIndex] === 1){
		  counter++;
		  if(counter > 1){
		    return true;
		  }
		}
	  }
      return false;
    },

    // test if any columns on this board contain conflicts
    hasAnyColConflicts: function() {
      for(var i = 0; i < this.get('n'); i++){
	    if(this.hasColConflictAt(i)){
		  return true;
		}  
	  }
	  return false;
    },



    // Major Diagonals - go from top-left to bottom-right
    // --------------------------------------------------------------
    //
    // test if a specific major diagonal on this board contains a conflict
    hasMajorDiagonalConflictAt: function(majorDiagonalColumnIndexAtFirstRow) {
      var row, col, counter=0;
	  if(majorDiagonalColumnIndexAtFirstRow === 0){
	    row = 0;
		col = 0;
	  } else if(majorDiagonalColumnIndexAtFirstRow > 0){
	    row = 0;
		col = majorDiagonalColumnIndexAtFirstRow;
	  } else{
	    row = -majorDiagonalColumnIndexAtFirstRow;
		col = 0;
	  }
	  while(this._isInBounds(row,col)){
	    if(this.get(row)[col] === 1){
		  counter++;
		  if(counter > 1){
		    return true;
		  }
		}
		row++;
		col++;
	  }
	  return false;
    },

    // test if any major diagonals on this board contain conflicts
    hasAnyMajorDiagonalConflicts: function() {
      var startR, startC;
	  for(var i = 0; i < this.get('n'); i++){
	    startR = this._getFirstRowColumnIndexForMajorDiagonalOn(i, 0);
		startC = this._getFirstRowColumnIndexForMajorDiagonalOn(0, i);
		if(this.hasMajorDiagonalConflictAt(startR) || this.hasMajorDiagonalConflictAt(startC)){
		  return true;
		}
	  }
	  return false;
    },



    // Minor Diagonals - go from top-right to bottom-left
    // --------------------------------------------------------------
    //
    // test if a specific minor diagonal on this board contains a conflict
    hasMinorDiagonalConflictAt: function(minorDiagonalColumnIndexAtFirstRow) {
      var row, col, counter=0;
	  if(minorDiagonalColumnIndexAtFirstRow === (this.get('n')-1)){
	    row = this.get('n')-1;
		col = this.get('n')-1;
	  } else if(minorDiagonalColumnIndexAtFirstRow > (this.get('n')-1)){
	    row = minorDiagonalColumnIndexAtFirstRow - this.get('n');
		col = this.get('n')-1;
	  } else{
	    row = 0;
		col = minorDiagonalColumnIndexAtFirstRow;
	  }
	  while(this._isInBounds(row,col)){
	    if(this.get(row)[col] === 1){
		  counter++;
		  if(counter > 1){
		    return true;
		  }
		}
		row++;
		col--;
	  }
	  return false;
    },

    // test if any minor diagonals on this board contain conflicts
    hasAnyMinorDiagonalConflicts: function() {
      var startR, startC;
	  for(var i = 0; i < this.get('n'); i++){
	    startR = this._getFirstRowColumnIndexForMinorDiagonalOn(i, this.get('n')-1);
		startC = this._getFirstRowColumnIndexForMinorDiagonalOn(0, i);
		if(this.hasMinorDiagonalConflictAt(startR) || this.hasMinorDiagonalConflictAt(startC)){
		  return true;
		}
	  }
	  return false;
    }

    /*--------------------  End of Helper Functions  ---------------------*/


  });

  var makeEmptyMatrix = function(n) {
    return _(_.range(n)).map(function() {
      return _(_.range(n)).map(function() {
        return 0;
      });
    });
  };

}());
