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
                name: "Salaries",
                color: "rgba(54,158,173,.6)",
                dataPoints: [
                  {x: new Date('Mon'), y: 30000},
                  {x: new Date('Tue'), y: 35000},
                  {x: new Date('Wed'), y: 30000},
                  {x: new Date('Thu'), y: 30400},
                  {x: new Date('Fri'), y: 20900},
                  {x: new Date('Sat'), y: 31000},
                  {x: new Date('Sun'), y: 30200}
                ]
              },
              {
                type: "splineArea",
                showInLegend: true,
                name: "Office Cost",
                color: "rgba(134,180,2,.7)",
                dataPoints: [
                {x: new Date('Mon'), y: 30000},
                {x: new Date('Tue'), y: 35000},
                {x: new Date('Wed'), y: 30000},
                {x: new Date('Thu'), y: 30400},
                {x: new Date('Fri'), y: 20900},
                {x: new Date('Sat'), y: 31000},
                {x: new Date('Sun'), y: 30200}

                ]
              },
              {
                type: "splineArea",
                showInLegend: true,
                name: "Entertainment",
                color: "rgba(194,70,66,.6)",
                dataPoints: [
                {x: new Date('Mon'), y: 30000},
                {x: new Date('Tue'), y: 35000},
                {x: new Date('Wed'), y: 30000},
                {x: new Date('Thu'), y: 30400},
                {x: new Date('Fri'), y: 20900},
                {x: new Date('Sat'), y: 31000},
                {x: new Date('Sun'), y: 30200}

                ]
              },
              {
                type: "splineArea",
                showInLegend: true,
                color: "rgba(127,96,132,.6)",
                name: "Maintenance",
                dataPoints: [
                  {x: new Date(2012, 2), y: 1700},
                  {x: new Date(2012, 3), y: 2600},
                  {x: new Date(2012, 4), y: 1000},
                  {x: new Date(2012, 5), y: 1400},
                  {x: new Date(2012, 6), y: 900},
                  {x: new Date(2012, 7), y: 1000},
                  {x: new Date(2012, 8), y: 1200},
                  {x: new Date(2012, 9), y: 5000},
                  {x: new Date(2012, 10), y: 1300},
                  {x: new Date(2012, 11), y: 2300},
                  {x: new Date(2013, 0), y: 2800},
                  {x: new Date(2013, 1), y: 1300}

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

  console.log('set temp');
  var target = $("#handle1").roundSlider("getValue");
  //put('targetTemperature','target_temperature', target);
  changeTooltip(false);
  console.log('target '+ target);
  $("#handle1").roundSlider("setValue",target);
  var cur = get('currentTemperature','current_temperature');
  console.log('cur '+ cur);
  $("#current_temp").text(cur);
  setTimeout(function () {
    setTemperature();
  },1000);
}
