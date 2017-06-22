$(document).ready(function () {
  $('#input_birth').datetimepicker({
    viewMode: 'years',
    format: 'DD/MM/YYYY',
    defaultDate:'01/01/1999',
  });

  loadpage(location.origin+'/temperature.html');


});

function loadpage(url, data){
  $('#loader').show();
  // $('#holder').hide();

  // if(data == null){
  // 	data = [];
  // }

  // window.clearTimeout(timer);

  /*$.ajax({url: url, data: data, type : 'post'}).done(function(data, statusText, xhr){
   var status = xhr.status;                //200
   var head = xhr.getAllResponseHeaders(); //Detail header info
   console.log(head);
   });*/

  jQuery.ajax({'url': url, async: true, isLocal: true, data: data, type: 'get',
    success: function(str){

      console.log(str);

      $('#loader').hide();

      $('#holder').html(str);

      if($('.refreshTo').attr('href')){
        var loadTime = 3500;
        if($('.refreshTo').data('time')){
          loadTime = $('.refreshTo').data('time');
        }
        timer = window.setTimeout(function(){
          loadpage($('.refreshTo').attr('href'));
        }, loadTime);
      }

      $('#holder').find('a.ajax-link').click(function(){
        //window.history.pushState($(this).attr('href'), '', $(this).attr('href'));
        window.history.pushState($(this).attr('href'), '', 'index.html');
        loadpage(location.origin+'/'+$(this).attr('href'));
        return false;
      });

      $('.autofocus').focus();
      $('body').click(function(){
        $('.autofocus').focus();
      });

      $('form.ajax-link').on('submit', function(e) { //use on if jQuery 1.7+
        e.preventDefault();  //prevent form from submitting
        var data = $("form").serializeArray();
        console.log(data); //use the console for debugging, F12 in Chrome, not alerts

        loadpage($('form').attr('action'), data);
      });

      console.log(url);

      if(url == location.origin+'/'+'temperature.html') {
        $("#handle1").roundSlider({
          tooltipFormat: function (e) {
            var val;
            if(!e)
              val = '...';
            else
              val = e.value;

            //put('targetTemperature','target_temperature', val);
            return val + '° ' + '<div class="current">Currently <span id="current_temp">...</span>°<div>';
          },
          radius: 120,
          circleShape: "pie",
          sliderType: "min-range",
          value: parseFloat(get('targetTemperature','target_temperature')),
          startAngle: 315,
          min: 5,
          max: 30,
          step: 0.1,
          width:30,
          height:30,
          create: mainRun(),
          change: function (e) { changeTemperature(e); }
        });
      }

      if(url == location.origin+'/'+'history.html') {
        var chart = new CanvasJS.Chart("chartContainer",
          {
            title: {
              text: "Annual Expenses"
            },
            animationEnabled: true,
            axisY: {
              includeZero: false,
              prefix: "€ "
            },
            toolTip: {
              shared: true,
              content: "<span style='\"'color: {color};'\"'><strong>{name}</strong></span> <span style='\"'color: dimgrey;'\"'>&#8364;{y}</span> "
            },
            legend: {
              fontSize: 13
            },
            data: [
             {
                type: "splineArea",
                showInLegend: true,
                color: "rgba(127,96,132,.6)",
                name: "Energy Costs",
                dataPoints: [
                  {x: new Date(2012, 2), y: 300},
                  {x: new Date(2012, 3), y: 100},
                  {x: new Date(2012, 4), y: 80},
                  {x: new Date(2012, 5), y: 60},
                  {x: new Date(2012, 6), y: 65},
                  {x: new Date(2012, 7), y: 55},
                  {x: new Date(2012, 8), y: 65},
                  {x: new Date(2012, 9), y: 80},
                  {x: new Date(2012, 10), y: 130},
                  {x: new Date(2012, 11), y: 230},
                  {x: new Date(2013, 0), y: 280},
                  {x: new Date(2013, 1), y: 340}

                ]
              }

            ]
          });

        chart.render();
      }

      if(url == location.origin+'/'+'schedule.html') {
        console.log(getWeekProgram());
        // get and set the day temperature
        $('#day-temp').val(get('dayTemperature', 'day_temperature'));
        // get and set the night temperature
        $('#night-temp').val(get('nightTemperature', 'night_temperature'));

        $('#day-temp').change(function () {
          put('dayTemperature', 'day_temperature', $(this).val());
        });
        $('#night-temp').change(function () {
          put('nightTemperature', 'night_temperature', $(this).val());
        });
      }

      //console.log(getWeekProgram());



    },
    error: function(xhr, status) {
      console.log(url);
      console.log(xhr);
      $('#loader').hide();
      $('#holder').html(xhr.responseText);
    }
  });
}

function changeTooltip(e) {
  var val;
  if(!e)
    val = '...';
  else
    val = e.value;

  //put('targetTemperature','target_temperature', val);
  return val + '° ' + '<div class="current">Currently <span id="current_temp">...</span>°<div>';
}

function mainRun() {
  setTime();
  setCurrentTemp();
  checkTempSet();

  setTimeout(function() {
    mainRun();
  }, 200);

}

function changeTemperature(e) {
  var temp = e.value;
  put('targetTemperature', 'target_temperature', temp);
  changeTooltip(false);
}

function setTime() {
  var time = get('time','time');
  var day = get('day','current_day');
  document.getElementById("time").innerHTML = time;
  document.getElementById("day").innerHTML = day;
}

function setCurrentTemp() {
  var cur = get('currentTemperature','current_temperature');
  $("#current_temp").text(cur);
}

function checkTempSet() {
  var curSet = get('targetTemperature','target_temperature');
  var val = $("#handle1").roundSlider("getValue");
  if(val != curSet) {
    $("#handle1").roundSlider("setValue",curSet)
  }
}
