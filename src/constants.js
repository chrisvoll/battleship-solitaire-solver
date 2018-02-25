const END_LEFT = '<';
const END_RIGHT = '>';
const END_BOTTOM = 'v';
const END_TOP = '^';
const BLOCK = '#';
const CIRCLE = 'o';
const MIDDLE = '%';

const WATER = '~';
const INITIAL_WATER = '=';

const EMPTY = ' ';

module.exports = {
  ALL_NEIGHBORS: ['tr', 't', 'tl', 'l', 'bl', 'b', 'br', 'r'],
  ALL_BUT_TOP: ['tr', 'tl', 'l', 'bl', 'b', 'br', 'r'],
  ALL_BUT_RIGHT: ['tr', 't', 'tl', 'l', 'bl', 'b', 'br'],
  ALL_BUT_BOTTOM: ['tr', 't', 'tl', 'l', 'bl', 'br', 'r'],
  ALL_BUT_LEFT: ['tr', 't', 'tl', 'bl', 'b', 'br', 'r'],
  DIAGONAL_NEIGHBORS: ['tl', 'tr', 'bl', 'br'],

  WATER_TYPE: WATER,
  WATER_TYPES: [
    WATER,
    INITIAL_WATER
  ],
  BLOCK_TYPE: BLOCK,
  BLOCK_TYPES: [
    END_LEFT,
    END_RIGHT,
    END_BOTTOM,
    END_TOP,
    BLOCK,
    CIRCLE,
    MIDDLE
  ],
  EMPTY_TYPE: EMPTY
};
