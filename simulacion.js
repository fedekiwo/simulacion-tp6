const convert = require("convert-units");
const { _, IA, TA, orderedAvailableIndexes, indexOfMin, HIGH_VALUE } = require("./utils");

if(process.argv.length <= 3) {
  console.log("Por favor indicar el N y el TF");
  process.exit(0);
}

const N = parseInt(process.argv[2]);
const TF = convert(parseFloat(process.argv[3])).from("month").to("s");

// Condiciones iniciales
let t = 0, tpll = 0, ns  = 0;
let tps = _.times(N, _.constant(HIGH_VALUE));
let messagesProcessedPerInstance = _.times(N, _.constant(0));

const minIndex = () => indexOfMin(tps);
const nextInstanceIndex = () => indexOfMin(messagesProcessedPerInstance);

const emptyInstance = (i) => {
  if(tps[i] === HIGH_VALUE) {
    return i;
  }
  else {
    orderedAvailableIndexes[0];
  }
};

const arrival = () => {
  t = tpll;
  tpll += IA();
  ns++;

  if(ns <= N) {
    const emptyInstanceIndex = emptyInstance(nextInstanceIndex());
    tps[emptyInstanceIndex] = TA();
    messagesProcessedPerInstance[emptyInstanceIndex]++;
  }
}

const exit = (i) => {
  t = tps[i];
  ns--;

  if(ns >= N) {
    tps[i] = TA();
    messagesProcessedPerInstance[i]++;
  }
  else {
    tps[i] = HIGH_VALUE;
  }
}

while(t < TF || ns > 0) {
  let nextTpsIndex = minIndex();

  if(tpll <= tps[nextTpsIndex]) {
    arrival();
  }
  else {
    exit(nextTpsIndex)
  }

  if(t >= TF && ns > 0){
    tpll = HIGH_VALUE;
  }
}

// Cálculo de resultados

// mostrar resultados.
console.log("Instancias: ", N);