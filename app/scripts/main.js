﻿$(document).ready(function () {
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

  jQuery.ajax({'url': url, isLocal: true, data: data, type: 'get',
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
          value: get('targetTemperature','target_temperature'),
          startAngle: 315,
          min: 5,
          max: 30,
          step: 0.1,
          width:30,
          height:30,
          create: setTemperature(),
          change: setTemperature()
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
              prefix: "$ "
            },
            toolTip: {
              shared: true,
              content: "<span style='\"'color: {color};'\"'><strong>{name}</strong></span> <span style='\"'color: dimgrey;'\"'>${y}</span> "
            },
            legend: {
              fontSize: 13
            },
            data: [
             {
                type: "splineArea",
                showInLegend: true,
                color: "rgba(127,96,132,.6)",
                name: "Costs",
                dataPoints: [
                  {x: new Date(2012, 2), y: 170},
                  {x: new Date(2012, 3), y: 260},
                  {x: new Date(2012, 4), y: 100},
                  {x: new Date(2012, 5), y: 140},
                  {x: new Date(2012, 6), y: 90},
                  {x: new Date(2012, 7), y: 100},
                  {x: new Date(2012, 8), y: 120},
                  {x: new Date(2012, 9), y: 500},
                  {x: new Date(2012, 10), y: 130},
                  {x: new Date(2012, 11), y: 230},
                  {x: new Date(2013, 0), y: 280},
                  {x: new Date(2013, 1), y: 130}

                ]
              }

            ]
          });

        chart.render();
      }

      console.log(getWeekProgram());



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

function setTemperature(){
  var target = $("#handle1").roundSlider("getValue");
  put('targetTemperature','target_temperature', target);

  changeTooltip(false);

  $("#handle1").roundSlider("setValue",target);
  var cur = get('currentTemperature','current_temperature');

  //Make a fix for multiple connected devices
  var curSet = get('targetTemperature','target_temperature');
    if(curSet != null && curSet != target) {
      $("#handle1").roundSlider("setValue", curSet);
      setTemperature();
    }

  $("#current_temp").text(cur);
  setTimeout(function () {
    setTemperature();
  },100);
}
