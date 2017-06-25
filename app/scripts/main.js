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

  jQuery.ajax({'url': url, async: true, isLocal: true, data: data, type: 'get',
    success: function(str){

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

        loadpage($('form').attr('action'), data);
      });

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
          create: mainRun(url),
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

        // activate tabs
        $('#schedulelist a').click(function (e) {
          e.preventDefault()
          $(this).tab('show');
        })

        //Control the Weekprogram button
        $('#programbtn').bootstrapToggle({
          onstyle: "success",
          offstyle: "danger",
          on: "Enabled",
          off: "Disabled"
        });

        $('#programbtn').bootstrapToggle(get('weekProgramState','week_program_state'));
        $('#programbtn').change(function() {
          if( $(this).prop('checked') ) {
            put('weekProgramState','week_program_state', 'on');
          }
          else {
            put('weekProgramState','week_program_state', 'off');
          }
        });


        // get and fill in week program
        getWeekProgram();
        initProgram();

        $('.add-switch-button').unbind('click').click(function () {
          if (Program[$(this).data('day')].length == 0) {
            Program[$(this).data('day')].push(['00:00', '00:00']);
            initProgram();
          } else if (Program[$(this).data('day')].length < 5) {
            var currentSwitch = Program[$(this).data('day')][Program[$(this).data('day')].length - 1];
            Program[$(this).data('day')].push([currentSwitch[1], currentSwitch[1]]);
            initProgram();
          } else if (Program[$(this).data('day')].length >= 5){
            alert('You can only add up to five switches per day');
          }
        });



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
    },
    error: function(xhr, status) {
      console.log('ERROR: ' + url);
      console.log('ERROR: ' + xhr);
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

function mainRun(url) {
  if(url == location.origin+'/'+'temperature.html') {
  setTime();
  setCurrentTemp();
  checkTempSet();

  setTimeout(function() {
    mainRun(url);
  }, 100);
  }
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

function makeSwitchHTML(index, dayTime, nightTime) {
  var x = Math.floor((Math.random() * 100000) + 1);
  return '<div class="row switch-row" id="row_'+x+'">' +
    '<div class="col-xs-5"><img src="images/sun.png"><input type="time" name="'+index+'-day" class="day-time-opt" value="'+dayTime+'"/></div>' +
    '<div class="col-xs-5"><img src="images/moon.png"><input type="time" name="'+index+'-night" class="night-time-opt" value="'+nightTime+'"/></div>' +
    '<div class="col-xs-2 text-right"><i class="mi mi-close delete-switch-row" data-row="row_'+x+'"></i></div>' +
  '</div>';
}

function initProgram() {
  Object.keys(Program).forEach(function(el){
    $('#'+el).find('.switch-rows').html('');
    Program[el].forEach(function (swi, index) {
      $('#'+el).find('.switch-rows').append(makeSwitchHTML(index, swi[0], swi[1]));
    });
    if(Program[el].length >= 5)
      $('#'+el).find('.delete-switch-row').attr("disabled", "disabled");
  });

  $("input[type=time]").change(function () {
    Object.keys(Program).forEach(function(el){
      Program[el] = [];
      $('#'+el).find('.switch-row').each(function () {
        Program[el].push([$(this).find('.day-time-opt').val(), $(this).find('.night-time-opt').val()]);
      });
      if(Program[el].length >= 5)
        $('#'+el).find('.delete-switch-row').attr("disabled", "disabled");
      else
        $('#'+el).find('.delete-switch-row').removeAttr("disabled");
    });
    //set program
    var weekEn = get('weekProgramState', 'week_program_state');
    setWeekProgram();

    if(weekEn === 'on') {
      put('weekProgramState','week_program_state','on');
    }

  });

  $('.delete-switch-row').click(function () {
    var c = confirm("Are you sure you want to delete this switch?");
    if(c) {
      $('#' + $(this).data('row')).remove();
      $("input[type=time]:first").trigger('change');
    }
  });

  $('.reset-schedule-button').click(function() {
    var c = confirm("Are you really sure you want to reset your schedule? This action cannot be reverted!");
    if(c) {
      setDefault();
      getWeekProgram();
      initProgram();
      if( $('#programbtn').prop('checked') ) {
        $('#programbtn').bootstrapToggle('off');
        put('weekProgramState','week_program_state','off');

      }
    }
  });
}

