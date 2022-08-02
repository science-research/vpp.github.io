$(function() {
	$( "#side-navigation" ).tabs({ show: { effect: "fade", duration: 400 } });

	 $("#register").submit(function()
	    {
	    	event.preventDefault();
	 			var data = $('form#register').serialize();
		        $.ajax({
			        type : 'POST', 
			        url  : 'https://services.mageplaza.com/email/subscribe.php', 
			        data : data,
			       	dataType: "json",
			        success :  function(response)
			               {    
			               		if(response.alert == 'success'){
									$('#show-offers').modal('show');
								}
								else{
									alert(response.message);
								}
			               }
			        });
	    });
	 
});

