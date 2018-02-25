const { ALL_NEIGHBORS, WATER_TYPE } = require('./constants');

/**
 * A ship is a group of block pieces. It is complete when it is completely
 * surrounded by water pieces (or the edge of the game board)
 */
class Ship {
  constructor(pieces) {
    this.pieces = pieces;
  }

  get isComplete() {
    for (let i = 0; i < this.pieces.length; i++) {
      const neighbors = this.pieces[i].getNeighbors(ALL_NEIGHBORS);
      const empties = neighbors.filter(neighbor => neighbor.isEmpty());

      if (!empties.length) {
        continue;
      }

      return empties[0];
    }
  }

  get length() { return this.pieces.length; }
}

module.exports = Ship;
