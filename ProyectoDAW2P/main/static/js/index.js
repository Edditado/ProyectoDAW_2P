function inicializar(){
    bIngresar.addEventListener('click', function () {
        var usr = $(userE).val();
        var pass = $(pwE).val();

        if (usr == "" || pass == "") {
            alert("Ingrese Usuario y Contraseña");
        }
        else {
            validarIngreso(usr, pass);
        }
    });

    bListo.addEventListener('click', function () {
       
        if ($(userR).val() == "" || $(pwR).val() == "") {
            alert("Su Usuario y Contraseña son importantes para el registro. Ingrese ambos por favor");
        }
        else
            continuaRegistro();
    });

    bRegistrar.addEventListener('click', function () {

        var expReg = /^[A-Z]{3}\-\d{4}$/;

        if (!$(newPW).val() == "" && !$(checkPW).val() == "") {

            if (radio_siAuto.checked) {

                var p = $(placa).val();

                if (!expReg.test(p)) {
                    alert(p + " no es una placa. Verifique e ingrese nuevamente");
                }
                else {
                    alert("¡Ahora eres parte de nosotros!. Ingresa y disfruta de éste beneficio");
                }
            }
            if (radio_noAuto.checked) {
                
                alert("¡Ahora eres parte de nosotros!. Ingresa y disfruta de éste beneficio");
                
            }
        }
        else {
            alert("¡Ya falta poco!...Llene todos los campos");
        }

    });
}

function continuaRegistro(){
    form1.setAttribute("style", "display:none");
    form2.setAttribute("style", "display:inline");
    //alert(radio_siAuto.checked);
    radio_siAuto.addEventListener('click',divPlaca);
    radio_noAuto.addEventListener('click',divPlaca);
        
}

function divPlaca(evt){
    //alert("radio: "+ evt.target.checked);
    radio=evt.target.id;
    if(radio=="radio_siAuto"){
        
        div_placa.setAttribute("style","display:block");
        
    }
    else{
        
        div_placa.setAttribute("style","display:none");
    }

}
   

function validarIngreso(usr, pass){
    xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET","xml/cuentas.xml", false);
    xmlhttp.send();
    xmlDoc = xmlhttp.responseXML;
    xmlUsrs = xmlDoc.getElementsByTagName("user");

    for(var i=0; i < xmlUsrs.length; i++){
        xmlUsr = xmlUsrs[i].firstChild.nodeValue;
        if(usr == xmlUsr){
            xmlCta = xmlUsrs[i].parentElement;
            xmlPass = xmlCta.getElementsByTagName("pass")[0].firstChild.nodeValue;
            if(pass == xmlPass){
                sessionStorage.setItem('tc', xmlUsr);
                goToMenu.setAttribute("href", "menu.html");
            }
        }
    }

}

window.addEventListener('load', inicializar);