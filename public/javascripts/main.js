$(document).ready(function(){
    console.log( "ready!" );
    $('#menu').find('a').each(function() {
        console.log($(this).attr('href'));
        $(this).click(function(eventObject){

          eventObject.preventDefault();
          $.ajax({url: $(this).attr('href'), success: function(result){
              console.log($(this).attr('href'));
              $("#loadableContent").html(result);
          }, error: function(result){
              console.log($(this).attr('href'));
              $("#loadableContent").html("Unable to load");
          }});
        });
        //$(this).attr('href', '#');
    });
});
