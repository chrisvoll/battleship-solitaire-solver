const neighborMapper = (key, x, y) => {
  const diff = ({
    't': [0, -1],
    'r': [1, 0],
    'b': [0, 1],
    'l': [-1, 0],
    'tl': [-1, -1],
    'tr': [1, -1],
    'bl': [-1, 1],
    'br': [1, 1]
  })[key];

  return { x: x + diff[0], y: y + diff[1] };
};

module.exports = {
  neighborMapper
};
