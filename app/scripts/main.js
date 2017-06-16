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
        window.history.pushState($(this).attr('href'), '', 'start.html');
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

      $("#handle1").roundSlider({
        radius: 80,
        circleShape: "pie",
        sliderType: "min-range",
        value: get('targetTemperature','target_temperature'),
        startAngle: 315,
        min: 5,
        max: 30,
        step: 0.1,
        tooltipFormat: "changeTooltip",
        width:18,
        height:18,
        create: setTemperature(),
        radius: 120,
        change:  setTemperature()
      });



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
  var val = e.value;

  //put('targetTemperature','target_temperature', val);
  return val + '° ' + '<div class="current">Currently <span id="current_temp">...</span>°<div>';
}

function setTemperature(){

  console.log('set temp');
  var target = $("#handle1").roundSlider("getValue");
  put('targetTemperature','target_temperature', target)
  var e = {value:target}
  changeTooltip(e);
  console.log('target '+ target);
  $("#handle1").roundSlider("setValue",target);
  var cur = get('currentTemperature','current_temperature');
  console.log('cur '+ cur);
  $("#current_temp").text(cur);
  setTimeout(function () {
    setTemperature();
  },1000);
}
