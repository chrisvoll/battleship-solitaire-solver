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

  solve() {
    if (this.fillRows()) return this.solve();
    if (this.fillShips()) return this.solve();
    const valid = this.isSolutionValid();
    this.log(valid ? 'Done!' : 'Failed :(', valid);
    return valid;
  }

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
    return this.findSequences(
      piece => piece.isBlockType(),
      sequence => sequence.sequence.length > 1
    ).map(sequence => new Ship(sequence)).filter(s => s.isComplete);
  }

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
    }

    if (filled.length === count && empties.length) {
      empties.forEach(piece => piece.setToWater());
      return true;
    }
  }

  fillShips() {
    let updated = false;
    const ships = [...this.shipLengths];
    this.getCompleteShips().forEach(shipSequence => {
      ships.splice(ships.indexOf(shipSequence.length), 1);
    });

    [...ships].forEach(ship => {
      const sequences = this.findSequences(
        piece => piece.isBlockType() || piece.isEmpty(),
        sequence => (
          sequence.sequence.length === ship &&
          sequence.sequence.filter(piece => piece.isEmpty()).length &&
          (sequence.type === 'column' ?
            this.columns[sequence.column] >= ship :
            this.rows[sequence.row] >= ship)
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

  findSequences(condition, sequenceCondition) {
    const runSequence = (type, axis, getPieces) => {
      axis.forEach((count, coord) => {
        let sequence = [];
        const pieces = getPieces.call(this, coord);

        for (let i = 0; i < pieces.length + 1; i++) {
          if (pieces[i] && condition(pieces[i])) {
            sequence.push(pieces[i]);
          } else {
            if (sequenceCondition({ sequence, type, [type]: coord })) {
              sequences.push(sequence);
              break;
            }
            sequence = [];
          }
        }
      })
    };

    let sequences = [];
    runSequence('column', this.columns, this.getColumn);
    runSequence('row', this.rows, this.getRow);
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
