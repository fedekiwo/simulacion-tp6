const _ = require("lodash");
const convert = require("convert-units");

if(process.argv.length <= 3) {
  console.log("Por favor indicar el N y el TF");
  process.exit(0);
}

const N = parseInt(process.argv[2]);
const TF = convert(parseFloat(process.argv[3])).from("month").to("s");

// TODO definir estas funciones cuando tengamos como son
const IA = () => { 
  const R = Math.random();
  return 1
};
const TA = () => { 
  const R = Math.random();
  return 1
};
const HIGH_VALUE = Number.MAX_SAFE_INTEGER;
// Condiciones iniciales
let t = 0;
let tpll = 0;
let ns  = 0;
let tps = _.times(N, _.constant(HIGH_VALUE));
let messagesReceivedPerInstance = _.times(N, _.constant(0));
let nst = 0; // Cantidad total de mensajes procesados

const indexOfMin = (list, list2) => list.indexOf(_.min(list2 || list));
const minIndex = () => indexOfMin(tps);
// const emptyInstance = () => tps.indexOf(HIGH_VALUE);
const nextInstanceIndex = () => indexOfMin(messagesReceivedPerInstance);
const emptyInstance = (i) => {
  if(tps[i] === HIGH_VALUE) {
    return i;
  }
  else {
    const j = indexOfMin(_.clone(messagesReceivedPerInstance).drop(i));
    if(j >= i) { j++; }
    return emptyInstance(j);
  }
};

const arrival = () => {
  t = tpll;
  tpll += IA();
  ns++;
  nst++;
  if(ns <= N) {
    const emptyInstanceIndex = emptyInstance(nextInstanceIndex());
    tps[emptyInstanceIndex] = TA();
    messagesReceivedPerInstance[emptyInstanceIndex]++;
  }
}

const exit = (i) => {
  t = tps[i];
  ns--;
  if(ns >= N) {
    tps[i] = TA();
    messagesReceivedPerInstance[i]++;
  }
  else {
    tps[i] = HIGH_VALUE;
  }
}

while(t < tf || ns > 0) {
  let nextTpsIndex = minIndex();
  if(tpll <= tps[nextTpsIndex]) {
    arrival();
  }
  else {
    exit(nextTpsIndex)
  }

  if(t >= tf && ns > 0){
    tpll = HIGH_VALUE;
  }
}

// Cálculo de resultados

// mostrar resultados.
console.log("Instancias: ", N);