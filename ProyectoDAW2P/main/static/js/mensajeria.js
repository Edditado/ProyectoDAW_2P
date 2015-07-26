$(document).ready(function(){
    $("#misMensajes").click(function(){
        $("#chatCont").text("");
        $("#chat").modal();
    });
	$('#btn-chat').click(function(){
		var mensaje=$('#btn-input').val();
		var contenido=$('#msmContent').html();
		if(mensaje==""){
			alert("Escriba su mensaje")
		}
		else{
			$('#msmContent').html(contenido + '<p>' + mensaje + '</p>');
			$('p').addClass("form-control");	
			$('#btn-input').val('');
		}	
	
	});
});