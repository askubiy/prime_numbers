function PrimeNumbersApp(){
  var db = new DB;
  var w;

  var state = false;
  var numbersEnumerated = parseInt(localStorage.numbersEnumerated) || 0;
  var currentNumber;
  var runCounter = parseInt(localStorage.runCounter) || 0;
  var totalOperatingTime = parseInt(localStorage.totalOperatingTime) || 0;
  var currentRunTime = parseInt(localStorage.currentRunTime) || 0;
  var maxOperatingTime = parseInt(localStorage.maxOperatingTime) || 0;
  var minOperatingTime = parseInt(localStorage.minOperatingTime) || 0;
  var operatingTimeInterval = null;
  var currentRunTimeInterval = null;
  var primesCount = parseInt(localStorage.primesCount) || 0;

  this.start = function() {
    if (!state) {
      currentNumber = numbersEnumerated;
      state = true;
      startWorker();
      runCounterUpdate();
      startOperatingTimeClock();
      return true;
    } else {
      return false;
    }
  };

  this.stop = function() {
    if (state) {
      state = false;
      stopOperatingTimeClock();
      return true;
    } else {
      return false;
    }
  };

  function startWorker() {
    if (!state) {
      return;
    }

    if(typeof(Worker) !== "undefined") {
      if(typeof(w) == "undefined") {
        w = new Worker("worker.js");
        var message = {mes: "start!", number: currentNumber};
        w.postMessage(message);
      }
      w.onmessage = function(event) {

        stopWorker();
        if (state) {
          if(event.data.isPrime){
            storePrimalInDB(currentNumber);
          }
          numbersEnumerated++;
          localStorage.numbersEnumerated = numbersEnumerated;
          currentNumber++;
          startWorker();
        }
      };
    } else {
      console.log("Sorry! No Web Worker support.");
    }
  }

  function stopWorker() {
    w.terminate();
    w = undefined;
  }

  function storePrimalInDB(primalNumber){
    db.openDb(function(){
      db.addPrimal(primalNumber);
    });
    primesCount++;
    localStorage.primesCount = primesCount;
  }

  this.getPrimesCount = function(){
    return primesCount;
  };

  this.getState = function() {
    return state;
  };

  this.getNumbersEnumerated = function() {
    return numbersEnumerated;
  };

  this.getTotalOperatingTime = function() {
    return formatTime(totalOperatingTime);
  };

  this.getMinOperatingTime = function() {
    return formatTime(minOperatingTime);
  };

  this.getMaxOperatingTime = function() {
    return formatTime(maxOperatingTime);
  };

  this.getRanCount = function() {
    return runCounter;
  };

  this.getPrimalList = function(callback) {
    db.openDb(function(){
      db.getPrimalList(callback);
    });
  };

  function runCounterUpdate(){
    runCounter += 1;
    localStorage.runCounter = runCounter;
  }

  function startOperatingTimeClock(){
    operatingTimeInterval = setInterval(function(){
      totalOperatingTime += 1000;
      localStorage.totalOperatingTime = totalOperatingTime;
    }, 1000);

    currentRunTime = 0;
    currentRunTimeInterval = setInterval(function(){
      currentRunTime += 500;
    }, 500);
  }

  function stopOperatingTimeClock(){
    clearInterval(operatingTimeInterval);
    clearInterval(currentRunTimeInterval);
    if(currentRunTime > maxOperatingTime) {
      maxOperatingTime = currentRunTime;
      localStorage.maxOperatingTime = maxOperatingTime;
    }
    if(currentRunTime < minOperatingTime || minOperatingTime === 0) {
      if (currentRunTime < 1000 && currentRunTime > 0){
        currentRunTime = 1000;
      }
      minOperatingTime = currentRunTime;
      localStorage.minOperatingTime = minOperatingTime;
    }
  }

  function formatTime(time){
    var seconds = Math.floor( (time/1000) % 60 );
    var minutes = Math.floor( (time/1000/60) % 60 );
    var hours = Math.floor( (time/(1000*60*60)) % 24 );
    var days = Math.floor( time/(1000*60*60*24) );
    var formattedTimeString = "";
    if (hours > 0){
      formattedTimeString = hours + " h. " + minutes + " min. " + seconds + " sec.";
    } else {
      if (minutes > 0){
        formattedTimeString = minutes + " min. " + seconds + " sec.";
      } else {
        formattedTimeString = seconds + " sec.";
      }
    }
    return formattedTimeString;
  }
}