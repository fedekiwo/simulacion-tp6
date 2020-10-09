const _ = require("lodash");

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

const HIGH_VALUE = Number.MAX_SAFE_INTEGER;

const getRandom = () => {
  let R = 1;
  while(R === 1) {
    R = Math.random();
  }

  return R;
}

const fdpResolver = (name, divider) => {
  const R = getRandom();
  const value = Math.log(1 - R) / divider;

  console.log(`${name}: ${value}, Random: ${R}`);
  return value;
}; 

const IA = () => fdpResolver("IA", -0.1794);

const TA = () => fdpResolver("TA", -0.0088);

const indexOfMin = (list) => list.indexOf(_.min(list));

const getAllIndexes = (arr) => (val) => {
  let indexes = [], i = -1;
  while ((i = arr.indexOf(val, i+1)) != -1){
      indexes.push(i);
  }
  console.log("INDEXES", val, indexes);
  return indexes;
}

const orderedAvailableIndexes = (messagesProcessedPerInstance, tps) => {
  return _(messagesProcessedPerInstance).uniq()
  .orderBy(_.identity)
  .map(getAllIndexes(messagesProcessedPerInstance))
  .flatMap(indexesArray => indexesArray.filter(i => tps[i] == HIGH_VALUE))
  .value();
}

module.exports = {
  _,
  IA,
  TA,
  getAllIndexes,
  orderedAvailableIndexes, 
  indexOfMin,
  HIGH_VALUE,
  sleep
};
