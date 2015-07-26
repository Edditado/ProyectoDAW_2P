function inicializar(){
    var usrStorage = sessionStorage.getItem('tc');
   
    obtenerUserData(usrStorage);
}

function obtenerUserData(usrStorage){
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET","xml/cuentas.xml", false);
    xmlhttp.send();
    var xmlDoc = xmlhttp.responseXML;
    var xmlUsrs = xmlDoc.getElementsByTagName("user");
    var xmlUsr, xmlCta;

    for(var i=0; i < xmlUsrs.length; i++){
        xmlUsr = xmlUsrs[i].firstChild.nodeValue;
        if(usrStorage == xmlUsr){
            xmlCta = xmlUsrs[i].parentElement;
            nomb.appendChild( xmlCta.getElementsByTagName("nombres")[0].firstChild );
            ap.appendChild( xmlCta.getElementsByTagName("apellidos")[0].firstChild );
            inUsr.setAttribute("value", usrStorage );
                aSesion.appendChild( xmlCta.getElementsByTagName("user")[0].firstChild );
            inPwd.setAttribute("value", xmlCta.getElementsByTagName("pass")[0].firstChild.nodeValue );
            var tieneCarro = xmlCta.getElementsByTagName("carro")[0].firstChild.nodeValue;
            if( tieneCarro == "true"){
                sc.setAttribute("checked","checked");
                placac.setAttribute("value", xmlCta.getElementsByTagName("placa")[0].firstChild.nodeValue );
            }
            else{
                nc.setAttribute("checked","checked");
            }
            cel.appendChild( xmlCta.getElementsByTagName("telf")[0].firstChild );
            email.appendChild( xmlCta.getElementsByTagName("mail")[0].firstChild );
            cuentafb.appendChild( xmlCta.getElementsByTagName("fb")[0].firstChild );
        }
    }

    crearMenu(tieneCarro);
}

function crearMenu(tieneCarro){
    var rutas, solicitar, logros;

    if(tieneCarro == "true"){
        divRutas.setAttribute("class", "tab-pane fade in active");

        rutas = document.createElement("li");
        rutas.setAttribute("class", "active");
        var a = document.createElement("a");
        a.setAttribute("href", "#divRutas");
        a.setAttribute("data-toggle", "pill");
        var img = document.createElement("img");
        img.setAttribute("src", "img/car_icon.png");
        img.setAttribute("alt", "HTML5 Icon");
        a.appendChild(img);
        var p = document.createElement("h5");
        p.setAttribute("id", "rutas");
        var text = document.createTextNode("Rutas");
        p.appendChild(text);
        a.appendChild(p);
        rutas.appendChild(a);
        ulMenu.appendChild(rutas);

        solicitar = document.createElement("li");
        var a = document.createElement("a");
        a.setAttribute("href", "#divSolic");
        a.setAttribute("data-toggle", "pill");
        var img = document.createElement("img");
        img.setAttribute("src", "img/location.png");
        img.setAttribute("alt", "HTML5 Icon");
        a.appendChild(img);
        var p = document.createElement("h5");
        p.setAttribute("id", "solicitar");
        var text = document.createTextNode("Solicitar");
        p.appendChild(text);
        a.appendChild(p);
        solicitar.appendChild(a);
        ulMenu.appendChild(solicitar);

        logros = document.createElement("li");
        var a = document.createElement("a");
        a.setAttribute("href", "#divLogros");
        a.setAttribute("data-toggle", "pill");
        var img = document.createElement("img");
        img.setAttribute("src", "img/medal.png");
        img.setAttribute("alt", "HTML5 Icon");
        a.appendChild(img);
        var p = document.createElement("h5");
        p.setAttribute("id", "logros");
        var text = document.createTextNode("Logros");
        p.appendChild(text);
        a.appendChild(p);
        logros.appendChild(a);
        ulMenu.appendChild(logros);
    }
    else if(tieneCarro == "false"){
        divSolic.setAttribute("class", "tab-pane fade in active");

        solicitar = document.createElement("li");
        solicitar.setAttribute("class", "active");
        var a = document.createElement("a");
        a.setAttribute("href", "#divSolic");
        a.setAttribute("data-toggle", "pill"); 
        var img = document.createElement("img"); 
        img.setAttribute("src", "img/location.png");
        img.setAttribute("alt", "HTML5 Icon");
        a.appendChild(img);
        var p = document.createElement("h5");
        p.setAttribute("id", "solicitar");
        var text = document.createTextNode("Solicitar");
        p.appendChild(text);
        a.appendChild(p);
        solicitar.appendChild(a);
        ulMenu.appendChild(solicitar);
    }

    if (window.innerWidth <= window.innerHeight) {
        ulMenu.setAttribute("class", "nav nav-pills");
        navMenu.setAttribute("style", "float:none; width:auto; height:auto;");
        ruta1.setAttribute("style", "width:"+(window.innerWidth-30)+"px; height:"+(window.innerHeight-300)+"px;");
        ruta2.setAttribute("style", "width:"+(window.innerWidth-30)+"px; height:"+(window.innerHeight-300)+"px;");
        nRuta.setAttribute("style", "width:"+(window.innerWidth-30)+"px; height:"+(window.innerHeight-300)+"px;");
        divSolic.setAttribute("style", "width:"+(window.innerWidth-30)+"px; height:"+(window.innerHeight-300)+"px;");
    }
    else { 
        ulMenu.setAttribute("class", "nav nav-pills nav-stacked");
        navMenu.setAttribute("style", "float:left; width:120px; height:"+(window.innerHeight-50)+"px;");
        ruta1.setAttribute("style", "width:"+(window.innerWidth-160)+"px; height:"+(window.innerHeight-150)+"px;");
        ruta2.setAttribute("style", "width:"+(window.innerWidth-160)+"px; height:"+(window.innerHeight-150)+"px;");
        nRuta.setAttribute("style", "width:"+(window.innerWidth-160)+"px; height:"+(window.innerHeight-150)+"px;");
        divSolic.setAttribute("style", "width:"+(window.innerWidth-160)+"px; height:"+(window.innerHeight-150)+"px;");
    }

}

function cambiarMenu(){
    if (window.innerWidth <= window.innerHeight) {
        ulMenu.setAttribute("class", "nav nav-pills");
        navMenu.setAttribute("style", "float:none; width:auto; height:auto;");
    }
    else { 
        ulMenu.setAttribute("class", "nav nav-pills nav-stacked");
        navMenu.setAttribute("style", "float:left; width:120px; height:1000px;");
    }
}

window.addEventListener("load", inicializar);
window.addEventListener("resize", cambiarMenu);