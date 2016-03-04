function PrimeNumbersApp(){
  var db = new DB;
  var dfd = $.Deferred();

  function dbOpen(arg){
    console.log("db open: " + arg);
  }

  dfd.done(dbOpen);

  var successCallback = function (){
    db.addPrimal(1);
    console.log("db.addPrimal(1)");
    db.addPrimal(3);
    console.log("db.addPrimal(3)");
    db.addPrimal(5);
    console.log("db.addPrimal(5)");
    db.getPrimalList();
    console.log("db.getPrimalList call");
  };

  db.openDb(dfd)

  var state = false;
  var runCounter = parseInt(localStorage.runCounter) || 0;
  var totalOperatingTime = parseInt(localStorage.totalOperatingTime) || 0;
  var currentRunTime = parseInt(localStorage.currentRunTime) || 0;
  var maxOperatingTime = parseInt(localStorage.maxOperatingTime) || 0;
  var minOperatingTime = parseInt(localStorage.minOperatingTime) || 0;
  var operatingTimeInterval = null;
  var currentRunTimeInterval = null;
  var numbersCount = parseInt(localStorage.numbersCount) || 0;

  this.start = function() {
    if (!state) {
      state = true;
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

  this.getState = function() {
    return state;
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