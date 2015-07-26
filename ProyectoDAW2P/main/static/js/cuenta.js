function CUENTA_inicializar() {
    $("#miCuenta").click(function(){
        $("#cuenta").modal();
    });

    $("#edusr").click(function () {
        document.getElementById("inUsr").disabled = false;
       
        edusr.setAttribute("style","float:left");
        edusr.setAttribute("style","display:none");
        savenomusuario.setAttribute("style","display:inline");
    });
    $("#edpwd").click(function () {
        document.getElementById("inPwd").disabled = false;
        edpwd.setAttribute("style","float:left");
        edpwd.setAttribute("style","display:none");
        savecontraseña.setAttribute("style","display:inline");
    });
    $("#edPlac").click(function () {
        document.getElementById("placac").disabled = false;
        edPlac.setAttribute("style","float:left");
        edPlac.setAttribute("style","display:none");
        savePlaca.setAttribute("style","display:inline");
    });

    $("#savenomusuario").click(function () {       
       document.getElementById("inUsr").disabled = true;
       edusr.setAttribute("style","display:inline");
       savenomusuario.setAttribute("style","display:none");
    });

     $("#savecontraseña").click(function () {
      document.getElementById("inPwd").disabled = true; 
      edpwd.setAttribute("style","display:inline");
      savecontraseña.setAttribute("style","display:none");
    });

    $("#savePlaca").click(function () {       
       document.getElementById("placac").disabled = true;
       edPlac.setAttribute("style","display:inline");
       savePlaca.setAttribute("style","display:none");
    });

    sc.addEventListener('click',CUENTA_verifica,false);
    nc.addEventListener('click',CUENTA_verifica,false);
   
}


function CUENTA_verifica(evt) {
    radio=evt.target.id;
    if(radio=="sc"){
        placa.setAttribute("style","display:block");
   }
    else{
        placa.setAttribute("style","display:none");
    }

}



window.addEventListener('load', CUENTA_inicializar, false);