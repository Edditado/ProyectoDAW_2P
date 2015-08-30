

function inicializar(){

    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
    
    if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
        var myArr = JSON.parse(xmlhttp.responseText);   
        myFunction(myArr);
     }
    }
    xmlhttp.open("GET", "datos/", true);
    xmlhttp.send();

    function myFunction(arr) {
        var campos= arr[0].fields;
        tipo_user=campos.tipo;
        crearMenu(tipo_user);

      }

   }

function crearMenu(tipoUser)
 {   var rutas, solicitar, logros;
   
    if(tipoUser == "oferente"){
        
        divRutas.setAttribute("class", "tab-pane fade in active");
       // overmapDist.setAttribute("style", "display:none");
        rutas = document.createElement("li");
        rutas.setAttribute("class", "active");
        var a = document.createElement("a");
        a.setAttribute("href", "#divRutas");
        a.setAttribute("data-toggle", "pill");
        var img = document.createElement("img");
        img.setAttribute("src", "../static/img/car_icon.png");
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
        a.setAttribute("href", "#Solic");
        a.setAttribute("data-toggle", "pill");
        var img = document.createElement("img");
        img.setAttribute("src", "../static/img/location.png");
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
        img.setAttribute("src", "../static/img/medal.png");
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
    else if(tipoUser == "solicitante"){
        Solic.setAttribute("class", "tab-pane fade in active");

        solicitar = document.createElement("li");
        solicitar.setAttribute("class", "active");
        var a = document.createElement("a");
        a.setAttribute("href", "#Solic");
        a.setAttribute("data-toggle", "pill"); 
        var img = document.createElement("img"); 
        img.setAttribute("src", "../static/img/location.png");
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
        lstRutas.setAttribute("style", "width:"+(window.innerWidth-30)+"px; min-height:"+(window.innerHeight-300)+"px;");
        nRuta.setAttribute("style", "width:"+(window.innerWidth-30)+"px; height:"+(window.innerHeight-300)+"px;");
        divSolic.setAttribute("style", "width:"+(window.innerWidth-30)+"px; height:"+(window.innerHeight-300)+"px;");
    }
    else { 
        ulMenu.setAttribute("class", "nav nav-pills nav-stacked");
        navMenu.setAttribute("style", "float:left; width:120px; height:"+(window.innerHeight-50)+"px;");
        lstRutas.setAttribute("style", "width:"+(window.innerWidth-160)+"px; min-height:"+(window.innerHeight-150)+"px;");
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