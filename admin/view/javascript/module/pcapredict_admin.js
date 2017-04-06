$(function() {

    function toggleStatus(value){
        if (value != undefined) {
            $('#status').prop('checked', value);
        } else {
            if ($('#status').prop('checked')){
                $('#status').prop('checked', false);
            } else {
                $('#status').prop('checked', true);
            }
        }
    }

    function updateActive() {
        if ($('#status').prop('checked')) {
            $('.switch-left').removeClass('switch--off');
            $('.switch-left').addClass('switch--on');
            $('.switch-right').removeClass('switch--on');
            $('.switch-right').addClass('switch--off');
        } else {
            $('.switch-left').removeClass('switch--on');
            $('.switch-left').addClass('switch--off');
            $('.switch-right').removeClass('switch--off');
            $('.switch-right').addClass('switch--on');
        }
    }

    function showAnyMessages() {

        if ($('.pcapredict-message').html().length > 0){

            $('.pcapredict-message').show();
            
            hideMessages(5000, 500);
        } else {
            $('.pcapredict-message').hide();
        }
    }

    function hideMessages(delayMs, animateTime) {
        delayMs = delayMs || 0;
        animateTime = animateTime || 0;
        setTimeout(function(){
            $('.pcapredict-message').fadeOut(animateTime);
        }, delayMs);
    }

    function setHostname(){
        $('#hostname').val(window.location.hostname);
    }
    
    $('.switch').on('click', function(){
        toggleStatus();
        updateActive();
    });

    showAnyMessages();
    setHostname();

});