const { neighborMapper } = require('./util');
const {
  ALL_NEIGHBORS,
  ALL_BUT_TOP,
  ALL_BUT_RIGHT,
  ALL_BUT_BOTTOM,
  ALL_BUT_LEFT,
  DIAGONAL_NEIGHBORS,
  WATER_TYPE,
  BLOCK_TYPE
} = require('./constants');

class Piece {
  constructor(type, x, y, board) {
    this.type = type;
    this.x = x;
    this.y = y;
    this.board = board;
  }

  isBlockType() {
    return [
      '<', // initial left end piece
      '>', // initial right end piece
      'v', // initial bottom end piece
      '^', // initial top end piece
      '#', // user-made block
      'o', // initial circle
      '%' // initial block
     ].indexOf(this.type) >= 0;
  }

  isWaterType() {
    return [
      '~', // user-made water
      '=' // initial water
    ].indexOf(this.type) >= 0;
  }

  isEmpty() {
    return this.type === ' ';
  }

  setType(type) {
    if (type === '~') this.setToWater();
    if (type === '#') this.setToBlock();
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

  setToBlock(type = '#') {
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
    const coord = neighborMapper(key, this.x, this.y);
    const neighbor = this.board.getPiece(coord.x, coord.y);

    if (!neighbor) {
      return;
    }

    neighbor.setType(type);
  }

  setNeighbors(neighbors, type) {
    neighbors.map(neighbor => {
      this.setNeighbor(neighbor, type);
    });
  }

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
