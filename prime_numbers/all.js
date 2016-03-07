$(document).ready(
  function(){

    var app = new PrimeNumbersApp();
    var tableShow = false;
    interfacePrepare(app);

    var operatingTimeInterval = setInterval(function(){
      var time = app.getTotalOperatingTime();
      $("#total-operating-time").text(time);
      $("#numbers-enumerated").text(app.getNumbersEnumerated());
      $("#primes-count").text(app.getPrimesCount());
    }, 500);

    $("#start-btn").on("click", function(event){
      if (app.start()){
        $("#run-counter").text(app.getRanCount);
        $(this).text("Stop");
        $("#app-status").removeClass("status-off");
        $("#app-status").addClass("status-on");
        $("#app-status").text("running");
      } else {
        app.stop();
        $(this).text("Start");
        $("#max-operating-time").text(app.getMaxOperatingTime());
        $("#min-operating-time").text(app.getMinOperatingTime());
        $("#app-status").removeClass("status-on");
        $("#app-status").addClass("status-off");
        $("#app-status").text("not running");
      }

      $(this).blur();
    });

    $("#show-table-btn").on("click", function(event){
      if (tableShow) {
        $(this).text("Refresh table data");
      } else {
        $(this).text("Refresh table data");
        tableShow = true;
      }
      app.getPrimalList(drawTable);
    })

    $("#clear-all").on("click", function(event){
      app.stop();
      window.localStorage.clear();
      indexedDB.deleteDatabase("prime-numbers-db");
      app = new PrimeNumbersApp();
      interfacePrepare(app);
      $(this).blur();
    });

  }
);

function interfacePrepare(app) {
  $("#run-counter").text(app.getRanCount);
  $("#max-operating-time").text(app.getMaxOperatingTime());
  $("#min-operating-time").text(app.getMinOperatingTime());
  $("#total-operating-time").text(app.getTotalOperatingTime());
  $("#numbers-enumerated").text(app.getNumbersEnumerated());
  $("#primes-count").text(app.getPrimesCount());

  //$('#primes-found').paging({ limit: 15 });

}

var oTable;

function drawTable(primalList){
  var dataSet = [];

  for (var i = 0; i < primalList.length; i++) {
    dataSet.push([primalList[i]]);
  }

  if(oTable){
    oTable.clear();
    oTable.rows.add(dataSet);
    oTable.draw();
  } else {
    oTable = $('#primes-found').DataTable( {
      data: dataSet,
      searching: false,
      ordering: false,
      columns: [
        { title: "Numbers" }
      ]
      }
    );
  }

}
