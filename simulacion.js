const convert = require("convert-units");
const { _, IA, TA, orderedAvailableIndexes, indexOfMin, HIGH_VALUE, sleep } = require("./utils");

if(process.argv.length <= 3) {
  console.log("Por favor indicar el N y el TF");
  process.exit(0);
}

const N = parseInt(process.argv[2]);
const TF = convert(parseFloat(process.argv[3])).from(process.argv[4] || "month").to("s");
const COST = 0.1;
// Condiciones iniciales
let t = 0, tpll = 0, ns  = 0;
let tps = _.times(N, _.constant(HIGH_VALUE));
let messagesAssignedPerInstance = _.times(N, _.constant(0));
let messagesProcessedPerInstance = _.times(N, _.constant(0));

const minIndex = () => indexOfMin(tps);
const nextInstanceIndex = () => indexOfMin(messagesAssignedPerInstance);

const emptyInstance = (i) => {
  if(tps[i] === HIGH_VALUE) {
    return i;
  }
  else {
    // console.log("asdfasdfasdfasd", orderedAvailableIndexes(messagesAssignedPerInstance, tps));
    const emptyInstanceIndex = orderedAvailableIndexes(messagesAssignedPerInstance, tps)[0];

    return emptyInstanceIndex;
  }
};

const arrival = () => {
  console.log("LLEGADA");

  t = tpll;
  tpll = t + IA();
  ns++;

  if(ns <= N) {
    
    const emptyInstanceIndex = emptyInstance(nextInstanceIndex());
    messagesAssignedPerInstance[emptyInstanceIndex]++;

    console.log("Mensajes asignados por instancia: ", messagesAssignedPerInstance);
    console.log("Instancia seleccionada", emptyInstanceIndex);

    tps[emptyInstanceIndex] = t + TA();
  }
}

const exit = (i) => {
  console.log(`SALIDA(${i})`);

  t = tps[i];
  ns--;
  messagesProcessedPerInstance[i]++;

  if(ns >= N) {
    tps[i] = t + TA();
    messagesAssignedPerInstance[i]++;
  }
  else {
    tps[i] = HIGH_VALUE;
  }
}

const initIterationLog = (nextTpsIndex) => {
  console.log("TPS: ", tps);
  console.log("T: ", t);
  console.log("TPLL: ", tpll);
  console.log(`TPS(${nextTpsIndex}) : ${tps[nextTpsIndex]}`);
}

// async function simulation() { // Para debuggearlo mejor
function simulation() {
  // while(t < TF || ns > 0) { // Vaciamiento
  while(t < TF) {
    let nextTpsIndex = minIndex();
    initIterationLog(nextTpsIndex);
  
    if(tpll <= tps[nextTpsIndex]) {
      arrival();
    }
    else {
      exit(nextTpsIndex)
    }
  
    // if(t >= TF && ns > 0){ // Vaciamiento
    //   tpll = HIGH_VALUE;
    // }

    //await sleep(1000); // Para debuggearlo mejor
  }
}

simulation();
// Cálculo de resultados

// mostrar resultados.
console.log("Instancias: ", N);
console.log("Mensajes Procesados: ", _.sum(messagesProcessedPerInstance));
console.log("Mensajes Procesados: ", _.sum(messagesProcessedPerInstance));