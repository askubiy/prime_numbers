importScripts('db.js');
var db = new DB;
var currentNumber;
var primalList = [];

onmessage = function(e) {
  currentNumber = e.data.number
  dbPrepare();
};

function isPrime(n, primalList) {
  if (n == 2 || n == 3 || n == 5 || n == 7) {
    return true;
  } else if ((n < 2) || (n % 2 == 0)) {
    return false;
  } else {
    var found = false;
    for (var i = 0; primalList[i] <= Math.sqrt(n); i += 1) {
      if (n % primalList[i] == 0) {
        found = true;
        break;
      }
    }
  }

  return !found
}

function dbPrepare(){
  db.openDb(dbOpen);
}

function dbOpen(arg){
  db.getPrimalList(primalListCallback);
}

function primalListCallback(list){
  primalList = list;
  postMessage({isPrime: isPrime(currentNumber, primalList)});
}