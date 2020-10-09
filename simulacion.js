const convert = require("convert-units");
const { _, IA, TA, orderedAvailableIndexes, indexOfMin, HIGH_VALUE, sleep } = require("./utils");

if(process.argv.length <= 3) {
  console.log("Por favor indicar el N y el TF");
  process.exit(0);
}

const N = parseInt(process.argv[2]);
const TF = convert(parseFloat(process.argv[3])).from(process.argv[4] || "month").to("s");
const COST = 0.0358; // USD/hora por cada instancia
// Condiciones iniciales
let t = 0, tpll = 0, ns  = 0;
let tps = _.times(N, _.constant(HIGH_VALUE));
let messagesAssignedPerInstance = _.times(N, _.constant(0));
let messagesProcessedPerInstance = _.times(N, _.constant(0));
let ito = _.times(N, _.constant(0));
let sto = _.times(N, _.constant(0));
let ps = 0; // permamencia en el sistema
let sta = 0; // suma tiempos de atención

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
  
  ps += (tpll - t) * ns;
  t = tpll;
  tpll = t + IA();
  ns++;

  if(ns <= N) {
    
    const emptyInstanceIndex = emptyInstance(nextInstanceIndex());
    messagesAssignedPerInstance[emptyInstanceIndex]++;
    sto[emptyInstanceIndex] += t - ito[emptyInstanceIndex];
    
    console.log("Mensajes asignados por instancia: ", messagesAssignedPerInstance);
    console.log("Instancia seleccionada", emptyInstanceIndex);
    const ta = TA();
    tps[emptyInstanceIndex] = t + ta;
    sta += ta; 
  }
}

const exit = (i) => {
  console.log(`SALIDA(${i})`);

  ps += (tps[i] - t) * ns;
  t = tps[i];
  ns--;
  messagesProcessedPerInstance[i]++;

  if(ns >= N) {
    const ta = TA();
    tps[i] = t + ta;
    sta += ta;
    messagesAssignedPerInstance[i]++;
  }
  else {
    tps[i] = HIGH_VALUE;
    ito[i] = t;
  }
}

const initIterationLog = (nextTpsIndex) => {
  console.log("TPS: ", tps);
  console.log("T: ", t);
  console.log("TPLL: ", tpll);
  console.log(`TPS(${nextTpsIndex}) : ${tps[nextTpsIndex]}`);
}


function simulation() {

  while(t < TF) {
    let nextTpsIndex = minIndex();
    initIterationLog(nextTpsIndex);
  
    if(tpll <= tps[nextTpsIndex]) {
      arrival();
    }
    else {
      exit(nextTpsIndex)
    }
  
  }
}

simulation();

// mostrar resultados.
const totalCost = N * COST * convert(t).from("s").to("h");
console.log("==================================");
console.log("RESULTADOS");
console.log("Instancias: ", N);
console.log("Mensajes Procesados por hora: ", _.sum(messagesProcessedPerInstance) / convert(t).from("s").to("h"));
// console.log("Costo mensual (USD): ", N * COST);
console.log("Costo promedio por mensaje procesado (USD / mensaje): ", totalCost / _.sum(messagesProcessedPerInstance));
console.log("Porcentaje de tiempo ocioso: ", _.sum(sto) / t, sto);
console.log("Promedio de espera en cola (s):",  (ps - sta) / t);