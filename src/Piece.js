const { neighborMapper } = require('./util');
const {
  ALL_NEIGHBORS,
  ALL_BUT_TOP,
  ALL_BUT_RIGHT,
  ALL_BUT_BOTTOM,
  ALL_BUT_LEFT,
  DIAGONAL_NEIGHBORS,
  BLOCK_TYPE,
  BLOCK_TYPES,
  EMPTY_TYPE,
  WATER_TYPE,
  WATER_TYPES
} = require('./constants');

class Piece {
  constructor(type, x, y, board) {
    this.type = type;
    this.x = x;
    this.y = y;
    this.board = board;
  }

  isBlockType() {
    return BLOCK_TYPES.indexOf(this.type) >= 0;
  }

  isWaterType() {
    return WATER_TYPES.indexOf(this.type) >= 0;
  }

  isEmpty() {
    return this.type === EMPTY_TYPE;
  }

  setType(type) {
    if (type === WATER_TYPE) this.setToWater();
    if (type === BLOCK_TYPE) this.setToBlock();
  }

  rollbackType(type) {
    this.type = this.lastType;
  }

  setToWater() {
    this.lastType = this.type;
    if (!this.isBlockType() && !this.isWaterType()) {
      this.type = WATER_TYPE;
    }
  }

  setToBlock() {
    this.lastType = this.type;
    if (!this.isBlockType()) {
      this.type = BLOCK_TYPE;
    }
  }

  neighborsAreBlockType(neighbors) {
    return neighbors.filter(n => {
      const neighbor = this.getNeighbor(n);
      return neighbor && neighbor.isBlockType();
    }).length > 0;
  }

  neighborsAreWaterType(neighbors) {
    return neighbors.filter(n => {
      const neighbor = this.getNeighbor(n);
      return neighbor && neighbor.isWaterType();
    }).length > 0;
  }

  getNeighbor(key) {
    const coord = neighborMapper(key, this.x, this.y);
    return this.board.getPiece(coord.x, coord.y);
  }

  getNeighbors(keys) {
  	return keys.map(key => this.getNeighbor(key)).filter(n => n);
  }

  setNeighbor(key, type) {
    const neighbor = this.getNeighbor(key);
    return neighbor && neighbor.setType(type);
  }

  setNeighbors(neighbors, type) {
    neighbors.map(neighbor => this.setNeighbor(neighbor, type));
  }

  /**
   * All block pieces have special properties that affect surrounding pieces.
   * For example, because ships cannot touch (even diagonally), blocks are
   * always surrounded diagonally by water.
   */
  surroundPiece() {
    switch(this.type) {
      case '%':
        this.setNeighbors(DIAGONAL_NEIGHBORS, WATER_TYPE);
        if (this.neighborsAreBlockType(['l', 'r'])) {
          this.setNeighbors(['l', 'r'], BLOCK_TYPE);
        }
        if (this.neighborsAreBlockType(['t', 'b'])) {
          this.setNeighbors(['t', 'b'], BLOCK_TYPE);
        }
        if (this.neighborsAreWaterType(['t', 'b'])) {
          this.setNeighbors(['l', 'r'], BLOCK_TYPE);
        }
        if (this.neighborsAreWaterType(['l', 'r'])) {
          this.setNeighbors(['t', 'b'], BLOCK_TYPE);
        }
        break;
      case '#':
        this.setNeighbors(DIAGONAL_NEIGHBORS, WATER_TYPE);
        if (this.neighborsAreBlockType(['l', 'r'])) {
          this.setNeighbors(['t', 'b'], WATER_TYPE);
        }
        if (this.neighborsAreBlockType(['t', 'b'])) {
          this.setNeighbors(['l', 'r'], WATER_TYPE);
        }
        break;
      case 'o':
        this.setNeighbors(ALL_NEIGHBORS, WATER_TYPE);
        break;
      case '<':
        this.setNeighbor('r', BLOCK_TYPE);
        this.setNeighbors(ALL_BUT_RIGHT, WATER_TYPE);
        break;
      case '>':
        this.setNeighbor('l', BLOCK_TYPE);
        this.setNeighbors(ALL_BUT_LEFT, WATER_TYPE);
        break;
      case 'v':
        this.setNeighbor('t', BLOCK_TYPE);
        this.setNeighbors(ALL_BUT_TOP, WATER_TYPE);
        break;
      case '^':
        this.setNeighbor('b', BLOCK_TYPE);
        this.setNeighbors(ALL_BUT_BOTTOM, WATER_TYPE);
        break;
    }
  }

  toString() {
    if (this.isBlockType()) return '•';
    if (this.isWaterType()) return '⋅';
    return ' ';
  }
}

module.exports = Piece;
