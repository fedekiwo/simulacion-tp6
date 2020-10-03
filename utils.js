const _ = require("lodash");

const IA = () => {
  const R = Math.random();
  return 1
};

const TA = () => { 
  const R = Math.random();
  return 1
};

const indexOfMin = (list) => list.indexOf(_.min(list));

const getAllIndexes = (arr) => (val) => {
  let indexes = [], i = -1;
  while ((i = arr.indexOf(val, i+1)) != -1){
      indexes.push(i);
  }
  return indexes;
}

const orderedAvailableIndexes = (arr) => {
  return _.uniq(arr)
  .map(getAllIndexes(arr))
  .flatMap(indexesArray => indexesArray.filter(i => arr[i] == HIGH_VALUE))
}

module.exports = {
  _,
  IA,
  TA,
  getAllIndexes,
  orderedAvailableIndexes, 
  indexOfMin,
  HIGH_VALUE: Number.MAX_SAFE_INTEGER
};
