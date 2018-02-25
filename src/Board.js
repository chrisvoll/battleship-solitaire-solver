const Piece = require('./Piece');
const Ship = require('./Ship');

class Board {
  constructor(board, columns, rows, shipLengths) {
    this.board = board.map((row, y) => (
      row.split('').map((type, x) => new Piece(type, x, y, this))
    ));
    this.columns = columns;
    this.rows = rows;
    this.shipLengths = shipLengths;
    this.log('Initial Board');
  }

  /**
   * The process of finding a solution is an infinite loop until there are no
   * more possible moves. It flips back and forth between filling in complete
   * rows and columns, and trying to place available ships on the board.
   */
  solve() {
    if (this.fillRows()) return this.solve();
    if (this.fillShips()) return this.solve();
    const valid = this.isSolutionValid();
    this.log(valid ? 'Done!' : 'Failed :(', valid);
    return valid;
  }

  /**
   * This method checks that a given board state is valid, meaning no rows
   * contain more ship pieces than possible. However, it doesn't check for
   * board completion, since its purpose is validate moves so we can roll back
   * to a previous state if necessary.
   */
  isSolutionValid() {
    let valid = true;
    const validate = (axis, getPieces) => axis.forEach((count, coord) => {
      if (getPieces.call(this, coord).filter(p => p.isBlockType()).length > count) {
        valid = false;
      }
    });
    validate(this.columns, this.getColumn);
    validate(this.rows, this.getRow);
    return valid;
  }

  getRow(row) { return this.board[row]; }
  getColumn(column) { return this.board.map(row => row[column]); }
  getPiece(x, y) { return (this.board[y] || [])[x]; }
  getCompleteShips() {
    return this.findSequences(piece => piece.isBlockType())
      .map(sequence => new Ship(sequence))
      .filter(s => s.isComplete);
  }

  /**
   * If a row has the correct number of block pieces or water pieces, fill in
   * the rest of the row with the necessary block or water pieces.
   */
  fillRows() {
    let updated = false;
    const fill = (axis, getPieces) => axis.forEach((count, coord) => {
      if (this.fillPieces(count, getPieces.call(this, coord))) {
        updated = true;
      }
    });
    fill(this.rows, this.getRow);
    fill(this.columns, this.getColumn);
    this.board.forEach(row => row.forEach(piece => piece.surroundPiece()));
    return updated;
  }

  fillPieces(count, pieces) {
    const blockable = pieces.filter(p => p.isBlockType() || p.isEmpty());
    const empties = pieces.filter(p => p.isEmpty());
    const filled = pieces.filter(p => p.isBlockType());

    if (blockable.length === count && empties.length) {
      empties.forEach(piece => piece.setToBlock());
      return true;
    } else if (filled.length === count && empties.length) {
      empties.forEach(piece => piece.setToWater());
      return true;
    }
  }

  /**
   * We know how many ships of each size there are, so we can try to distribute
   * all of the incomplete ones throughout the board. For example, if there's
   * still a 5-boat available, we can check all the locations on the board that
   * have exactly five spaces, and then test if adding the boat there will
   * violate the max number of blocks for each affected row and column.
   */
  fillShips() {
    let updated = false;
    const ships = [...this.shipLengths];

    // Filter out all the ships we know are complete (i.e., surrounded by water)
    this.getCompleteShips().forEach(shipSequence => {
      ships.splice(ships.indexOf(shipSequence.length), 1);
    });

    // For each available ship, find all the candidate locations on the board
    // and drop it in. If it doesn't work, roll back and move on to the next one
    [...ships].forEach(ship => {
      const sequences = this.findSequences(
        piece => piece.isBlockType() || piece.isEmpty(),
        sequence => (
          sequence.sequence.length === ship &&
          sequence.sequence.filter(piece => piece.isEmpty()).length &&
          sequence.axis[sequence.coord] >= ship
        )
      );

      for (let i = 0; i < sequences.length; i++) {
        sequences[i].forEach(piece => piece.setToBlock());
        if (this.isSolutionValid()) {
          ships.splice(ships.indexOf(ship), 1);
          updated = true;
          break;
        } else {
          sequences[i].forEach(piece => piece.rollbackType());
        }
      }
    });

    return updated;
  }

  /**
   * This is a generalized method for finding groups of pieces. The first
   * condition determines whether something belongs in a group, and the second
   * condition determines if the group itself is valid.
   */
  findSequences(condition, sequenceCondition = x => x) {
    const runSequence = (axis, getPieces) => {
      axis.forEach((count, coord) => {
        let sequence = [];
        const pieces = getPieces.call(this, coord);

        for (let i = 0; i < pieces.length + 1; i++) {
          if (pieces[i] && condition(pieces[i])) {
            sequence.push(pieces[i]);
          } else {
            if (sequenceCondition({ sequence, axis, coord })) {
              sequences.push(sequence);
              break;
            }
            sequence = [];
          }
        }
      })
    };

    let sequences = [];
    runSequence(this.columns, this.getColumn);
    runSequence(this.rows, this.getRow);
    return sequences;
  }

  log(message, valid) {
    console.log(`\n${message}\n\n    ${this.columns.join(' ')}\n`);
    this.board.forEach((row, index) => {
      console.log(`${this.rows[index]}   ${row.map(p => valid ? p.toString() : p.type).join(' ')}`)
    });
  }
}

module.exports = Board;
