function cellClicked(squareid){
    //alert("Would you like to buy this square? (" + square + ")");
    console.log("Clicked square " + squareid);
    $( "#dialog-confirm" ).data('squareid', squareid).dialog( "open" );
}

$(function() {
    $( "#dialog-confirm" ).dialog({
        autoOpen:false,
        resizable: false,
        height:170,
        modal: true,
        buttons: {
            "Buy": function() {
                var url = window.location.href;
                $.post( "/buySquare", 
                   { 
                   squareId: $(this).data('squareid') 
                   ,poolId: url.substring(url.lastIndexOf('/')+1,url.lastIndexOf('/')+25)
                   }
                ).done(function(data){
                    location.reload();    
                });
            },
            Cancel: function() {
              $( this ).dialog( "close" );
            }
        }
    });
});