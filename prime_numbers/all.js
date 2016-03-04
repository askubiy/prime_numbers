$(document).ready(
  function(){

    var app = new PrimeNumbersApp();
    interfacePrepare(app);

    var operatingTimeInterval = setInterval(function(){
      var time = app.getTotalOperatingTime();
      $("#total-operating-time").text(time);
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

  }
);

function interfacePrepare(app) {
  $("#run-counter").text(app.getRanCount);
  $("#max-operating-time").text(app.getMaxOperatingTime());
  $("#min-operating-time").text(app.getMinOperatingTime());
  $("#total-operating-time").text(app.getTotalOperatingTime());
}
