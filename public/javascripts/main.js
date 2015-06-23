$(document).ready(function(){
    $('#loading').hide();
    console.log( "ready!" );
    $('#menu').find('a').each(function() {
        console.log($(this).attr('href'));
        $(this).click(function(eventObject){
        eventObject.preventDefault();
          $('#loadableContent').html("");
          $('#loading').show();
          $.ajax({url: $(this).attr('href'), success: function(result){
              $('#loadableContent').html(result);
              $('#loading').hide();
          }, error: function(result){
              console.log("error: " + $(this).attr('href')+  " - " + result.status + ":" + result.statusText);
              $('#loadableContent').html("Unable to load: " + result.statusText);
              $('#loading').hide();
          }});
        });
    });
});
