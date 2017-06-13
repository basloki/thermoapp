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
                value: "20",
                startAngle: 315,
                min: 5,
                max: 30,
                step: 0.1,
                tooltipFormat: "changeTooltip"
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
    var val = e.value, speed;
    if (val < 20) speed = "Slow";
    else if (val < 40) speed = "Normal";
    else if (val < 70) speed = "Speed";
    else speed = "Very Speed";

    return val + '° ' + "<div>Current 18°<div>";
}